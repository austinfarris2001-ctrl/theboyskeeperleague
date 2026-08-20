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
  // Static data (see data/adp-data.js) instead of a live fetch -
  // FantasyFootballCalculator's API blocks cross-site browser requests (CORS),
  // confirmed via direct testing.
  return (typeof ADP_DATA !== "undefined" && ADP_DATA[season]) || {};
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
const SEASON_TEAM_COUNTS = { 2020: 10, 2021: 10, 2022: 12, 2023: 10, 2024: 12, 2025: 12, 2026: 10 };
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

// ============================================================
// ESPN SEASONS (2020-2022) - most picks resolve directly from the real
// historical roster data embedded in data/espn-draft.js (genuinely accurate
// for that season - not a live guess). A minority of picks (players who got
// dropped and weren't on any roster by season's end) have no embedded data;
// those fall back to a live ESPN athlete lookup, which may show their
// CURRENT team instead of their historical one for just that handful.
// ============================================================
let espnAthleteCache = {}; // espnPlayerId -> {name, position} (name/position don't change by season)
let espnSeasonTeamCache = {}; // "espnPlayerId-season" -> team abbreviation or null

async function fetchEspnAthlete(espnPlayerId) {
  if (espnAthleteCache[espnPlayerId]) return espnAthleteCache[espnPlayerId];
  try {
    const res = await fetch("https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/" + espnPlayerId);
    if (!res.ok) throw new Error("not ok");
    const data = await res.json();
    const a = data.athlete || {};
    const info = {
      name: a.displayName || a.fullName || ("Player #" + espnPlayerId),
      position: (a.position && (a.position.abbreviation || a.position.name)) || null,
      currentTeam: (a.team && a.team.abbreviation) || null
    };
    espnAthleteCache[espnPlayerId] = info;
    return info;
  } catch (e) {
    const fallback = { name: "Player #" + espnPlayerId, position: null, currentTeam: null };
    espnAthleteCache[espnPlayerId] = fallback;
    return fallback;
  }
}

async function fetchEspnHistoricalTeam(espnPlayerId, season) {
  const cacheKey = espnPlayerId + "-" + season;
  if (espnSeasonTeamCache[cacheKey] !== undefined) return espnSeasonTeamCache[cacheKey];
  try {
    const res = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/" + season + "/athletes/" + espnPlayerId);
    if (!res.ok) throw new Error("not ok");
    const data = await res.json();
    // team may show up as a direct numeric id, or nested under a team object
    const teamId = data.proTeamId || data.teamId || (data.team && data.team.id) || null;
    const team = teamId ? ESPN_TEAM_ID_MAP[teamId] || null : null;
    espnSeasonTeamCache[cacheKey] = team;
    return team;
  } catch (e) {
    espnSeasonTeamCache[cacheKey] = null;
    return null;
  }
}

async function fetchEspnAthleteForSeason(espnPlayerId, season) {
  const [base, historicalTeam] = await Promise.all([
    fetchEspnAthlete(espnPlayerId),
    fetchEspnHistoricalTeam(espnPlayerId, season)
  ]);
  return {
    name: base.name,
    position: base.position,
    team: historicalTeam || base.currentTeam // fall back to current team if the season-specific lookup failed
  };
}

async function fetchEspnDraftBoard(season) {
  if (draftCache["espn-" + season]) return draftCache["espn-" + season];
  const picks = ESPN_DRAFT_PICKS[season] || [];

  let maxRound = 0, maxSlot = 0;
  const slotOwner = {};
  const cellMap = {};
  // ESPN doesn't give us a stable "draft slot" the way Sleeper does - use
  // each team's round-1 pick position (pickInRound) as their column.
  picks.forEach(function (p) {
    if (p.round === 1) slotOwner[p.pickInRound] = p.owner;
  });
  const teamIdToSlot = {};
  picks.forEach(function (p) {
    if (p.round === 1) teamIdToSlot[p.teamId] = p.pickInRound;
  });
  picks.forEach(function (p) {
    const slot = teamIdToSlot[p.teamId];
    if (p.round > maxRound) maxRound = p.round;
    if (slot > maxSlot) maxSlot = slot;
    cellMap[p.round + "-" + slot] = p;
  });

  const board = { season: season, maxRound: maxRound, maxSlot: maxSlot, slotOwner: slotOwner, cellMap: cellMap, isEspn: true };
  draftCache["espn-" + season] = board;
  return board;
}

async function resolveEspnBoard(board) {
  if (board.resolved) return board;
  const keys = Object.keys(board.cellMap);
  await Promise.all(keys.map(async function (key) {
    const raw = board.cellMap[key];

    if (raw.name) {
      // real historical data already embedded in data/espn-draft.js
      const [firstName, ...rest] = raw.name.split(" ");
      board.cellMap[key] = {
        round: raw.round, draft_slot: null, pick_no: raw.overallPick, owner: raw.owner, player_id: null,
        seasonPoints: raw.seasonPoints != null ? raw.seasonPoints : null,
        metadata: {
          first_name: firstName, last_name: rest.join(" "),
          position: raw.position || null,
          team: raw.proTeamId ? (ESPN_TEAM_ID_MAP[raw.proTeamId] || null) : null
        }
      };
      return;
    }

    // gap player - not on any roster by that season's end, resolve live
    const athlete = await fetchEspnAthleteForSeason(raw.espnPlayerId, board.season);
    const [firstName, ...rest] = athlete.name.split(" ");
    board.cellMap[key] = {
      round: raw.round, draft_slot: null, pick_no: raw.overallPick, owner: raw.owner, player_id: null,
      metadata: { first_name: firstName, last_name: rest.join(" "), position: athlete.position, team: athlete.team }
    };
  }));
  board.resolved = true;
  return board;
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
    slotOwner: slotOwner, cellMap: cellMap, rosterIdToOwner: rosterIdToOwner
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

function cellColorHtml(pick, mode, extraData, cellKey) {
  const info = pickDisplayInfo(pick);
  if (!info) return { bg: "var(--panel-2)", text: "var(--text-mute)", stat: null };

  if (mode === "position") {
    const c = POSITION_COLORS[info.position] || "#3a4556";
    return { bg: c, text: "#000000", stat: null };
  }
  if (mode === "performance" && extraData) {
    const vorp = extraData.vorpByPick[cellKey];
    if (vorp == null) return { bg: "var(--panel-2)", text: "var(--text-mute)", stat: null };
    const colors = magnitudeColor(vorp);
    return { bg: colors.bg, text: colors.text, stat: (vorp > 0 ? "+" : "") + vorp.toFixed(1) };
  }
  if (mode === "value" && extraData) {
    const diff = extraData.diffByPick[cellKey];
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

// ESPN years use their own embedded season point totals (already scored
// under that league's real settings for that season) instead of Sleeper's
// stats endpoint - same replacement-level math, self-contained data source.
function computeEspnPerformanceData(board) {
  const byPosition = {}; // position -> [points, ...]
  for (const key in board.cellMap) {
    const pick = board.cellMap[key];
    const pos = pick.metadata && pick.metadata.position;
    if (!pos || pick.seasonPoints == null) continue;
    if (!byPosition[pos]) byPosition[pos] = [];
    byPosition[pos].push(pick.seasonPoints);
  }
  Object.keys(byPosition).forEach(function (pos) {
    byPosition[pos].sort(function (a, b) { return b - a; });
  });

  const vorpByPick = {};
  for (const key in board.cellMap) {
    const pick = board.cellMap[key];
    const pos = pick.metadata && pick.metadata.position;
    if (!pos || pick.seasonPoints == null) continue;
    const rank = replacementRank(pos, board.season);
    if (!rank) continue;
    const pool = byPosition[pos] || [];
    const replacement = pool[rank - 1];
    if (replacement == null) continue;
    vorpByPick[key] = Math.round((pick.seasonPoints - replacement) * 10) / 10;
  }
  return { vorpByPick: vorpByPick };
}

async function computeValueData(season, board) {
  let adpMap;
  try {
    adpMap = await fetchAdp(season);
  } catch (e) {
    console.error("ADP fetch failed:", e);
    return { diffByPick: {}, error: e.message || "fetch failed" };
  }
  const diffByPick = {};
  let matched = 0, total = 0;
  for (const key in board.cellMap) {
    const pick = board.cellMap[key];
    const info = pickDisplayInfo(pick);
    if (!info) continue;
    total++;
    const adp = adpMap[normalizeName(info.name)];
    if (adp == null) continue;
    matched++;
    // positive = pick fell later than ADP suggested (good value), same
    // convention as the keeper page's "pick minus ADP" formula
    diffByPick[key] = Math.round((pick.pick_no - adp) * 10) / 10;
  }
  console.log("ADP match rate for " + season + ": " + matched + "/" + total);
  return { diffByPick: diffByPick, matched: matched, total: total };
}

// A keeper pick is still a real pick in that season's draft (Sleeper keeper
// mechanics assign it a round/pick like any other selection), so marking it
// is just a season+pick_no lookup against the keeper data we already have.
function isKeeperPick(season, pickNo) {
  if (typeof KEEPER_DATA === "undefined") return false;
  return KEEPER_DATA.some(function (k) { return k.season === season && k.pick === pickNo; });
}

function renderLegend() {
  const legend = document.getElementById("draft-legend");
  const keeperNote = '<div class="draft-legend-item" style="opacity:0.6;"><span style="font-size:11px;">\uD83D\uDD11</span> = kept the following year</div>';
  if (colorMode === "position") {
    legend.innerHTML = Object.keys(POSITION_COLORS).map(function (pos) {
      return '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:' + POSITION_COLORS[pos] + ';"></span>' + pos + '</div>';
    }).join("") + keeperNote;
  } else if (colorMode === "performance") {
    legend.innerHTML =
      '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:#39ff8a;"></span>Big VORP win (brighter = bigger)</div>' +
      '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:#ff2020;"></span>Big VORP miss (brighter = worse)</div>' +
      keeperNote;
  } else if (colorMode === "value") {
    legend.innerHTML =
      '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:#39ff8a;"></span>Great value vs ADP</div>' +
      '<div class="draft-legend-item"><span class="draft-legend-swatch" style="background:#ff2020;"></span>Big reach vs ADP</div>' +
      '<div class="empty-note" style="margin-left:8px;">Source: FantasyFootballCalculator - unmatched names show gray</div>' +
      keeperNote;
  }
}

// ============================================================
// PICK DRILL-DOWN - click any pick to see its details, plus a best-effort
// search across every other season for the same player. Cross-year search
// reuses whatever boards are already cached and fetches/resolves the rest
// on demand, so repeated clicks get faster as more seasons get cached.
// ============================================================

function pickOwner(pick, board, isEspn) {
  if (isEspn) return pick.owner || "Unknown";
  return (board.rosterIdToOwner && board.rosterIdToOwner[pick.roster_id]) || "Unknown";
}

function getPickAdpDiff(pick, season) {
  const info = pickDisplayInfo(pick);
  if (!info) return null;
  const adpMap = (typeof ADP_DATA !== "undefined" && ADP_DATA[season]) || {};
  const adp = adpMap[normalizeName(info.name)];
  if (adp == null) return null;
  return Math.round((pick.pick_no - adp) * 10) / 10;
}

async function getPickVORP(pick, season, isEspn, board) {
  if (isEspn) {
    const perf = computeEspnPerformanceData(board);
    let foundKey = null;
    for (const k in board.cellMap) {
      if (board.cellMap[k] === pick) { foundKey = k; break; }
    }
    return foundKey ? (perf.vorpByPick[foundKey] != null ? perf.vorpByPick[foundKey] : null) : null;
  }
  if (!pick.player_id) return null;
  const info = pickDisplayInfo(pick);
  if (!info || !info.position) return null;
  let statsDump;
  try {
    statsDump = await fetchSeasonStats(season);
  } catch (e) {
    return null;
  }
  const pts = statsDump[pick.player_id] && statsDump[pick.player_id].pts_ppr;
  if (pts == null) return null;
  const replacement = await getReplacementPoints(info.position, season, statsDump);
  if (replacement == null) return null;
  return Math.round((pts - replacement) * 10) / 10;
}

async function findOtherAppearances(playerName, currentSeason) {
  const targetNorm = normalizeName(playerName);
  const allSeasons = ESPN_SEASONS.concat(Object.keys(LEAGUE_IDS).map(Number));
  const results = await Promise.all(allSeasons.map(async function (season) {
    if (season === currentSeason) return null;
    try {
      const seasonIsEspn = ESPN_SEASONS.indexOf(season) !== -1;
      const board = seasonIsEspn
        ? await resolveEspnBoard(await fetchEspnDraftBoard(season))
        : await fetchDraftBoard(season);
      for (const key in board.cellMap) {
        const p = board.cellMap[key];
        const info = pickDisplayInfo(p);
        if (info && normalizeName(info.name) === targetNorm) {
          return { season: season, round: p.round, pickNo: p.pick_no, owner: pickOwner(p, board, seasonIsEspn) };
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }));
  return results.filter(function (r) { return r; }).sort(function (a, b) { return a.season - b.season; });
}

async function openPickDrillDown(pick, season, isEspn, board) {
  const overlay = document.getElementById("drill-overlay");
  const body = document.getElementById("drill-body");
  overlay.classList.remove("hidden");

  const info = pickDisplayInfo(pick);
  const owner = pickOwner(pick, board, isEspn);
  const keeper = isKeeperPick(season, pick.pick_no);
  const headshot = pick.player_id ? "https://sleepercdn.com/content/nfl/players/" + pick.player_id + ".jpg" : null;
  const logo = info.team ? teamLogoUrl(info.team) : null;

  body.innerHTML =
    '<div class="spotlight-top">' +
      (headshot ? '<img class="spotlight-avatar" id="drill-headshot" src="' + headshot + '" alt="">' : '<div class="spotlight-avatar-fallback">' + (info.position || "?") + '</div>') +
      '<div><div class="eyebrow">' + season + (keeper ? ' \uD83D\uDD11 KEPT NEXT YEAR' : '') + '</div>' +
      '<div class="team-name">' + info.name + '</div>' +
      '<div class="sub-team-name">' + (info.position || "") + (info.team ? ' \u00b7 ' + info.team : '') + '</div></div>' +
      (logo ? '<img src="' + logo + '" style="width:28px;height:28px;border-radius:50%;background:#fff;padding:2px;margin-left:auto;" alt="">' : '') +
    '</div>' +
    '<div class="spotlight-stats">' +
      '<div class="stat-box"><div class="label">Drafted by</div><div class="val" style="font-size:14px;">' + owner + '</div></div>' +
      '<div class="stat-box"><div class="label">Round</div><div class="val">' + pick.round + '</div></div>' +
      '<div class="stat-box"><div class="label">Pick</div><div class="val">' + pick.pick_no + '</div></div>' +
    '</div>' +
    '<div class="spotlight-stats" id="drill-computed-stats">' +
      '<div class="stat-box"><div class="label">ADP diff</div><div class="val" id="drill-adp-val">-</div></div>' +
      '<div class="stat-box"><div class="label">VORP</div><div class="val" id="drill-vorp-val">loading...</div></div>' +
    '</div>' +
    '<div class="rank-line" id="drill-other-years">Checking other seasons...</div>';

  const headshotEl = document.getElementById("drill-headshot");
  if (headshotEl) {
    headshotEl.addEventListener("error", function () {
      const div = document.createElement("div");
      div.className = "spotlight-avatar-fallback";
      div.textContent = info.position || "?";
      headshotEl.replaceWith(div);
    });
  }

  const adpDiff = getPickAdpDiff(pick, season);
  document.getElementById("drill-adp-val").textContent = adpDiff != null ? (adpDiff > 0 ? "+" : "") + adpDiff : "N/A";

  getPickVORP(pick, season, isEspn, board).then(function (vorp) {
    const el = document.getElementById("drill-vorp-val");
    if (el) el.textContent = vorp != null ? (vorp > 0 ? "+" : "") + vorp : "N/A";
  });

  findOtherAppearances(info.name, season).then(function (others) {
    const el = document.getElementById("drill-other-years");
    if (!el) return;
    if (others.length === 0) {
      el.textContent = "Not found in any other season's draft in our history.";
      return;
    }
    el.innerHTML = "Also drafted: " + others.map(function (o) {
      return o.season + " (R" + o.round + ", Pick " + o.pickNo + " by " + o.owner + ")";
    }).join(" \u00b7 ");
  });
}

function closePickDrillDown() {
  document.getElementById("drill-overlay").classList.add("hidden");
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

  const isEspn = ESPN_SEASONS.indexOf(activeSeason) !== -1;

  loading.style.display = "block";
  loading.textContent = isEspn
    ? "Resolving " + activeSeason + " player names from ESPN..."
    : "Loading " + activeSeason + " draft from Sleeper...";
  boardEl.innerHTML = "";

  try {
    const board = isEspn
      ? await resolveEspnBoard(await fetchEspnDraftBoard(activeSeason))
      : await fetchDraftBoard(activeSeason);
    renderLegend();

    let extraData = null;
    if (colorMode === "performance") {
      if (isEspn) {
        extraData = computeEspnPerformanceData(board);
      } else {
        loading.textContent = "Loading season stats for VORP coloring...";
        extraData = await computePerformanceData(activeSeason, board);
      }
    } else if (colorMode === "value") {
      loading.textContent = "Loading ADP data...";
      extraData = await computeValueData(activeSeason, board);
    }

    if (extraData && extraData.error) {
      loading.style.display = "block";
      loading.textContent = "ADP data couldn't be loaded (" + extraData.error + "). This is likely the FantasyFootballCalculator API blocking cross-site requests - let Austin know so this can be worked around.";
      return;
    }
    if (extraData && colorMode === "value" && extraData.matched === 0 && extraData.total > 0) {
      loading.style.display = "block";
      loading.textContent = ADP_DATA[activeSeason]
        ? "ADP data loaded but matched 0 of " + extraData.total + " picks by name - something's off with the name matching, not a fetch failure."
        : activeSeason + " ADP data isn't available yet for this season.";
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
        const cellKey = round + "-" + slot;
        const pick = board.cellMap[cellKey];
        const info = pickDisplayInfo(pick);
        const cell = document.createElement("div");
        cell.className = "draft-cell";

        if (info) {
          const colors = cellColorHtml(pick, colorMode, extraData, cellKey);
          cell.style.background = colors.bg;
          cell.style.color = colors.text;
          cell.style.borderColor = colors.bg === "var(--panel-2)" ? "var(--border)" : colors.bg;
          cell.style.cursor = "pointer";
          const logo = info.team ? teamLogoUrl(info.team) : null;
          const keeperBadge = isKeeperPick(activeSeason, pick.pick_no)
            ? '<span class="keeper-marker" title="Kept the following year">\uD83D\uDD11</span>' : '';
          cell.innerHTML =
            keeperBadge +
            '<div class="pick-num" style="color:' + (colors.bg === "var(--panel-2)" ? "var(--text-mute)" : colors.text) + ';opacity:0.85;">Pick ' + pick.pick_no + '</div>' +
            '<div class="pick-player">' + info.name + '</div>' +
            (colors.stat != null ? '<div class="pick-stat">' + colors.stat + '</div>' : '') +
            (logo ? '<img class="pick-logo" src="' + logo + '" alt="" onerror="this.remove()">' : '');
          cell.addEventListener("click", function () { openPickDrillDown(pick, activeSeason, isEspn, board); });
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

  document.getElementById("close-drill").addEventListener("click", closePickDrillDown);
  document.getElementById("drill-overlay").addEventListener("click", function (e) {
    if (e.target.id === "drill-overlay") closePickDrillDown();
  });
});
