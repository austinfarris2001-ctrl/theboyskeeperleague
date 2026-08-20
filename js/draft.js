// ============================================================
// DRAFT HISTORY - live draft boards for Sleeper seasons (2023-2026).
// ESPN seasons (2020-2022) will be added once player names are verified -
// see the placeholder note when those years are selected.
// Value (vs ADP) mode is a placeholder for now - needs a multi-site ADP
// data source (FantasyFootballCalculator's free API) wired in next.
// ============================================================

let activeSeason = null;
let colorMode = "position";
let draftCache = {}; // season -> computed draft board data

const POSITION_COLORS = {
  QB: "#e2554a", RB: "#1d9e75", WR: "#38d0ff", TE: "#e8b13a",
  K: "#9c8ff0", DEF: "#6a95b8"
};

const TEAM_ABBR_OVERRIDES = { WAS: "wsh" };
function teamLogoUrl(team) {
  if (!team) return null;
  const abbr = (TEAM_ABBR_OVERRIDES[team] || team).toLowerCase();
  return "https://a.espncdn.com/i/teamlogos/nfl/500/" + abbr + ".png";
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
  if (!info) return { bg: "var(--panel-2)", text: "var(--text-mute)" };

  if (mode === "position") {
    const c = POSITION_COLORS[info.position] || "#3a4556";
    return { bg: c + "33", text: c };
  }
  if (mode === "performance" && extraData) {
    const vorp = extraData.vorpByPick[pick.round + "-" + pick.draft_slot];
    if (vorp == null) return { bg: "var(--panel-2)", text: "var(--text-mute)" };
    return { bg: vorp >= 0 ? "rgba(57,255,138,0.18)" : "rgba(255,92,92,0.18)", text: vorp >= 0 ? "var(--green)" : "var(--red)" };
  }
  return { bg: "var(--panel-2)", text: "var(--text-mute)" };
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

function renderLegend() {
  const legend = document.getElementById("draft-legend");
  if (colorMode === "position") {
    legend.innerHTML = Object.keys(POSITION_COLORS).map(function (pos) {
      return '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:' + POSITION_COLORS[pos] + ';"></span>' + pos + '</div>';
    }).join("");
  } else if (colorMode === "performance") {
    legend.innerHTML =
      '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:rgba(57,255,138,0.4);"></span>Outperformed replacement level</div>' +
      '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:rgba(255,92,92,0.4);"></span>Underperformed replacement level</div>';
  } else {
    legend.innerHTML = '<div class="empty-note">Value-vs-ADP mode is coming soon - needs a multi-site ADP data source wired in.</div>';
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
    }

    if (colorMode === "value") {
      loading.style.display = "none";
      boardEl.innerHTML = '<p class="empty-note">Value-vs-ADP mode is coming soon.</p>';
      return;
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
          const logo = info.team ? teamLogoUrl(info.team) : null;
          cell.innerHTML =
            '<div class="pick-num">Pick ' + pick.pick_no + '</div>' +
            '<div class="pick-player">' + info.name + '</div>' +
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
