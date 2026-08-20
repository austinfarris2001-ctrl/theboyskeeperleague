// ============================================================
// DRAFT HISTORY - live draft boards for Sleeper seasons (2023-2026).
// ESPN seasons (2020-2022) are pending - need one more file per season
// (ESPN's picks reference their own internal player IDs with no names
// attached in what we have saved; a kona_player_info view fetch resolves it).
// Value (vs ADP) mode uses FantasyFootballCalculator's free public ADP API.
// ============================================================

let activeSeason = null;
let colorMode = "position";
let draftCache = {}; // season -> computed draft board data
let adpCache = {}; // season -> {playerNameLower: adp}

const POSITION_COLORS = {
  QB: "#ff4d4d", RB: "#0fd98c", WR: "#2fc3ff", TE: "#ffcc33",
  K: "#b892ff", DEF: "#8fa8c4"
};

const TEAM_ABBR_OVERRIDES = { WAS: "wsh" };
function teamLogoUrl(team) {
  if (!team) return null;
  const abbr = (TEAM_ABBR_OVERRIDES[team] || team).toLowerCase();
  return "https://a.espncdn.com/i/teamlogos/nfl/500/" + abbr + ".png";
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function textForBg(hex) {
  const [r, g, b] = hexToRgb(hex);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150 ? "#08110c" : "#ffffff";
}
function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  return "#" + a.map(function (c, i) {
    return Math.round(Math.max(0, Math.min(255, c + (b[i] - c) * t))).toString(16).padStart(2, "0");
  }).join("");
}

// Magnitude-scaled color ramp for Performance (VORP) and Value (ADP diff) -
// same "the bigger the number, the more it pops" approach as the keeper page.
const POP_GREEN_STOPS = [{ v: 0, c: "#1c3d2e" }, { v: 15, c: "#0e6b3f" }, { v: 40, c: "#0fd98c" }, { v: 80, c: "#39ff8a" }];
const POP_RED_STOPS = [{ v: 0, c: "#3d1c1c" }, { v: 15, c: "#8a1f1f" }, { v: 40, c: "#e2554a" }, { v: 80, c: "#ff2020" }];
function magnitudeColor(value) {
  const stops = value >= 0 ? POP_GREEN_STOPS : POP_RED_STOPS;
  const mag = Math.min(Math.abs(value), 80);
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (mag >= stops[i].v && mag <= stops[i + 1].v) { lo = stops[i]; hi = stops[i + 1]; break; }
  }
  const range = hi.v - lo.v;
  const t = range === 0 ? 0 : (mag - lo.v) / range;
  const bg = lerpColor(lo.c, hi.c, t);
  return { bg: bg, text: textForBg(bg) };
}

function normalizeName(name) {
  return (name || "").toLowerCase().replace(/[.'’-]/g, "").replace(/\s+jr$|\s+sr$|\s+ii$|\s+iii$/g, "").trim();
}

async function fetchAdp(season) {
  if (adpCache[season]) return adpCache[season];
  const teams = SEASON_TEAM_COUNTS[season] || 12;
  const res = await fetch("https://fantasyfootballcalculator.com/api/v1/adp/ppr?teams=" + teams + "&year=" + season);
  if (!res.ok) throw new Error("ADP fetch failed");
  const data = await res.json();
  const map = {};
  (data.players || []).forEach(function (p) {
    map[normalizeName(p.name)] = p.adp;
  });
  adpCache[season] = map;
  return map;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

function playerName(pid) { return (typeof PLAYER_NAMES !== "undefined" && PLAYER_NAMES[pid]) || pid; }
function playerPos(pid) { return (typeof PLAYER_POSITIONS !== "undefined" && PLAYER_POSITIONS[pid]) || null; }

async function fetchSeasonStats(season) {
  const res = await fetch("https://api.sleeper.app/v1/stats/nfl/regular/" + season);
  if (!res.ok) throw new Error("stats fetch failed");
  return res.json();
}

// Same VORP approach as the keeper page - replacement level tied to
// starter-slot count per position, not raw points or position rank.
const SEASON_TEAM_COUNTS = { 2023: 10, 2024: 12, 2025: 12, 2026: 10 };
const STARTER_SLOTS = { QB: 1, RB: 2, WR: 2, TE: 1 };
const FLEX_SLOTS = 2;
const FLEX_ELIGIBLE = ["RB", "WR", "TE"];
function replacementRank(position, season) {
  if (!STARTER_SLOTS[position]) return null;
  const teams = SEASON_TEAM_COUNTS[season] || 12;
  const flexShare = FLEX_SLOTS / FLEX_ELIGIBLE.length;
  const slots = STARTER_SLOTS[position] + (FLEX_ELIGIBLE.indexOf(position) >= 0 ? flexShare : 0);
  return Math.round(teams * slots);
}
async function getReplacementPoints(position, season, statsDump) {
  const rank = replacementRank(position, season);
  if (!rank) return null;
  const pool = [];
  for (const pid in PLAYER_POSITIONS) {
    if (PLAYER_POSITIONS[pid] !== position) continue;
    const s = statsDump[pid];
    if (s && typeof s.pts_ppr === "number") pool.push(s.pts_ppr);
  }
  pool.sort(function (a, b) { return b - a; });
  return pool[rank - 1] != null ? pool[rank - 1] : null;
}

async function fetchDraftBoard(season) {
  if (draftCache[season]) return draftCache[season];
  const leagueId = LEAGUE_IDS[season];

  const [leagueInfo, rosters, users] = await Promise.all([
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/rosters"),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/users")
  ]);

  const draftId = leagueInfo.draft_id;
  const picks = await fetchJson("https://api.sleeper.app/v1/draft/" + draftId + "/picks");

  const userIdToOwner = {};
  users.forEach(function (u) { userIdToOwner[u.user_id] = ownerNameFromUsername(u.display_name); });
  const overridesForLeague = ROSTER_OWNER_OVERRIDES[leagueId] || {};
  const rosterIdToOwner = {};
  rosters.forEach(function (r) {
    rosterIdToOwner[r.roster_id] = userIdToOwner[r.owner_id] || overridesForLeague[r.roster_id] || "Unknown";
  });

  let maxRound = 0, maxSlot = 0;
  picks.forEach(function (p) {
    if (p.round > maxRound) maxRound = p.round;
    if (p.draft_slot > maxSlot) maxSlot = p.draft_slot;
  });

  // header owner per slot: whoever's roster made round-1's pick in that slot
  const slotOwner = {};
  picks.forEach(function (p) {
    if (p.round === 1) slotOwner[p.draft_slot] = rosterIdToOwner[p.roster_id] || "Unknown";
  });

  const cellMap = {}; // "round-slot" -> pick
  picks.forEach(function (p) { cellMap[p.round + "-" + p.draft_slot] = p; });

  const board = {
    season: season, maxRound: maxRound, maxSlot: maxSlot,
    slotOwner: slotOwner, cellMap: cellMap
  };
  draftCache[season] = board;
  return board;
}

function pickDisplayInfo(pick) {
  if (!pick) return null;
  const meta = pick.metadata || {};
  const name = (meta.first_name || meta.last_name)
    ? ((meta.first_name || "") + " " + (meta.last_name || "")).trim()
    : playerName(pick.player_id);
  const position = meta.position || playerPos(pick.player_id);
  const team = meta.team || null;
  return { name: name, position: position, team: team };
}

function cellColorHtml(pick, mode, extraData) {
  const info = pickDisplayInfo(pick);
  if (!info) return { bg: "var(--panel-2)", text: "var(--text-mute)", stat: null };

  if (mode === "position") {
    const c = POSITION_COLORS[info.position] || "#3a4556";
    return { bg: c, text: textForBg(c), stat: null };
  }
  if (mode === "performance" && extraData) {
    const vorp = extraData.vorpByPick[pick.round + "-" + pick.draft_slot];
    if (vorp == null) return { bg: "var(--panel-2)", text: "var(--text-mute)", stat: null };
    const colors = magnitudeColor(vorp);
    return { bg: colors.bg, text: colors.text, stat: (vorp > 0 ? "+" : "") + vorp.toFixed(1) };
  }
  if (mode === "value" && extraData) {
    const diff = extraData.diffByPick[pick.round + "-" + pick.draft_slot];
    if (diff == null) return { bg: "var(--panel-2)", text: "var(--text-mute)", stat: null };
    const colors = magnitudeColor(diff);
    return { bg: colors.bg, text: colors.text, stat: (diff > 0 ? "+" : "") + diff.toFixed(0) };
  }
  return { bg: "var(--panel-2)", text: "var(--text-mute)", stat: null };
}

async function computePerformanceData(season, board) {
  let statsDump;
  try {
    statsDump = await fetchSeasonStats(season);
  } catch (e) {
    return null;
  }
  const replacementCache = {};
  const vorpByPick = {};
  for (const key in board.cellMap) {
    const pick = board.cellMap[key];
    const info = pickDisplayInfo(pick);
    if (!info || !info.position) continue;
    const pts = statsDump[pick.player_id] && statsDump[pick.player_id].pts_ppr;
    if (pts == null) continue;
    if (replacementCache[info.position] === undefined) {
      replacementCache[info.position] = await getReplacementPoints(info.position, season, statsDump);
    }
    const replacement = replacementCache[info.position];
    if (replacement == null) continue;
    vorpByPick[key] = Math.round((pts - replacement) * 10) / 10;
  }
  return { vorpByPick: vorpByPick };
}

async function computeValueData(season, board) {
  let adpMap;
  try {
    adpMap = await fetchAdp(season);
  } catch (e) {
    return null;
  }
  const diffByPick = {};
  for (const key in board.cellMap) {
    const pick = board.cellMap[key];
    const info = pickDisplayInfo(pick);
    if (!info) continue;
    const adp = adpMap[normalizeName(info.name)];
    if (adp == null) continue;
    // positive = pick fell later than ADP suggested (good value), same
    // convention as the keeper page's "pick minus ADP" formula
    diffByPick[key] = Math.round((pick.pick_no - adp) * 10) / 10;
  }
  return { diffByPick: diffByPick };
}

function renderLegend() {
  const legend = document.getElementById("draft-legend");
  if (colorMode === "position") {
    legend.innerHTML = Object.keys(POSITION_COLORS).map(function (pos) {
      return '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:' + POSITION_COLORS[pos] + ';"></span>' + pos + '</div>';
    }).join("");
  } else if (colorMode === "performance") {
    legend.innerHTML =
      '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:#39ff8a;"></span>Big VORP win (brighter = bigger)</div>' +
      '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:#ff2020;"></span>Big VORP miss (brighter = worse)</div>';
  } else if (colorMode === "value") {
    legend.innerHTML =
      '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:#39ff8a;"></span>Great value vs ADP</div>' +
      '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:#ff2020;"></span>Big reach vs ADP</div>' +
      '<div class="empty-note" style="margin-left:8px;">Source: FantasyFootballCalculator - unmatched names show gray</div>';
  }
}

async function renderDraftBoard() {
  const loading = document.getElementById("draft-loading");
  const boardEl = document.getElementById("draft-board");

  if (!activeSeason) {
    loading.textContent = "Select a season above.";
    loading.style.display = "block";
    boardEl.innerHTML = "";
    return;
  }

  if (ESPN_SEASONS.indexOf(activeSeason) !== -1) {
    loading.style.display = "none";
    boardEl.innerHTML = '<p class="empty-note">' + activeSeason + ' draft board is pending - need to verify ESPN player names for this season first (coming soon).</p>';
    return;
  }

  loading.style.display = "block";
  loading.textContent = "Loading " + activeSeason + " draft from Sleeper...";
  boardEl.innerHTML = "";

  try {
    const board = await fetchDraftBoard(activeSeason);
    renderLegend();

    let extraData = null;
    if (colorMode === "performance") {
      loading.textContent = "Loading season stats for VORP coloring...";
      extraData = await computePerformanceData(activeSeason, board);
    } else if (colorMode === "value") {
      loading.textContent = "Loading ADP data...";
      extraData = await computeValueData(activeSeason, board);
    }

    loading.style.display = "none";

    const grid = document.createElement("div");
    grid.className = "draft-grid";
    grid.style.gridTemplateColumns = "repeat(" + (board.maxSlot + 1) + ", 1fr)";

    // header row
    grid.appendChild(document.createElement("div"));
    for (let slot = 1; slot <= board.maxSlot; slot++) {
      const h = document.createElement("div");
      h.className = "draft-header-cell";
      h.textContent = board.slotOwner[slot] || "Slot " + slot;
      grid.appendChild(h);
    }

    for (let round = 1; round <= board.maxRound; round++) {
      const roundLabel = document.createElement("div");
      roundLabel.className = "draft-round-label";
      roundLabel.textContent = "R" + round;
      grid.appendChild(roundLabel);

      for (let slot = 1; slot <= board.maxSlot; slot++) {
        const pick = board.cellMap[round + "-" + slot];
        const info = pickDisplayInfo(pick);
        const cell = document.createElement("div");
        cell.className = "draft-cell";

        if (info) {
          const colors = cellColorHtml(pick, colorMode, extraData);
          cell.style.background = colors.bg;
          cell.style.color = colors.text;
          cell.style.borderColor = colors.bg === "var(--panel-2)" ? "var(--border)" : colors.bg;
          const logo = info.team ? teamLogoUrl(info.team) : null;
          cell.innerHTML =
            '<div class="pick-num" style="color:' + (colors.bg === "var(--panel-2)" ? "var(--text-mute)" : colors.text) + ';opacity:0.85;">Pick ' + pick.pick_no + '</div>' +
            '<div class="pick-player">' + info.name + '</div>' +
            (colors.stat != null ? '<div class="pick-stat">' + colors.stat + '</div>' : '') +
            (logo ? '<img class="pick-logo" src="' + logo + '" alt="" onerror="this.remove()">' : '');
        }
        grid.appendChild(cell);
      }
    }

    boardEl.appendChild(grid);
  } catch (e) {
    loading.style.display = "block";
    loading.textContent = "Couldn't load the draft board right now.";
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const seasonBar = document.getElementById("draft-season-bar");
  const seasons = ESPN_SEASONS.concat(Object.keys(LEAGUE_IDS).map(Number)).sort(function (a, b) { return a - b; });
  seasons.forEach(function (season) {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.season = season;
    btn.textContent = season;
    btn.addEventListener("click", function () {
      document.querySelectorAll("#draft-season-bar .filter-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      activeSeason = season;
      renderDraftBoard();
    });
    seasonBar.appendChild(btn);
  });

  document.querySelectorAll("#draft-color-bar [data-color-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#draft-color-bar [data-color-mode]").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      colorMode = btn.dataset.colorMode;
      renderDraftBoard();
    });
  });

  const defaultBtn = seasonBar.querySelector('[data-season="2025"]');
  if (defaultBtn) defaultBtn.click();
});
