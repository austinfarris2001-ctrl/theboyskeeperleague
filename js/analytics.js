// ============================================================
// ANALYTICS - league-wide insights across all seasons.
// Reuses the same VORP/replacement-level formulas already proven on
// Draft History and the Keeper page. Three tabs (Luck Factor, Head-to-Head,
// Consistency) need week-by-week matchup data, which we only have for
// Sleeper seasons (2023-2026) - ESPN years (2020-2022) only have season
// totals, not weekly schedules, so those tabs are scoped to Sleeper years
// and say so on the page.
// ============================================================

let activeTab = "misses";
const tabCache = {}; // tab name -> rendered HTML, so switching back is instant

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

function normalizeName(name) {
  return (name || "").toLowerCase().replace(/[.'\u2019-]/g, "").replace(/\s+jr$|\s+sr$|\s+ii$|\s+iii$/g, "").trim();
}
function playerName(pid) { return (typeof PLAYER_NAMES !== "undefined" && PLAYER_NAMES[pid]) || pid; }
function playerPos(pid) { return (typeof PLAYER_POSITIONS !== "undefined" && PLAYER_POSITIONS[pid]) || null; }

// ---- VORP / replacement level (same formula as Draft History & Keepers) ----
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

let seasonStatsCache = {};
async function fetchSeasonStats(season) {
  if (seasonStatsCache[season]) return seasonStatsCache[season];
  const data = await fetchJson("https://api.sleeper.app/v1/stats/nfl/regular/" + season);
  seasonStatsCache[season] = data;
  return data;
}

let replacementCache = {}; // "season-position" -> points
async function getReplacementPoints(position, season, statsDump) {
  const key = season + "-" + position;
  if (replacementCache[key] !== undefined) return replacementCache[key];
  const rank = replacementRank(position, season);
  if (!rank) { replacementCache[key] = null; return null; }
  const pool = [];
  for (const pid in PLAYER_POSITIONS) {
    if (PLAYER_POSITIONS[pid] !== position) continue;
    const s = statsDump[pid];
    if (s && typeof s.pts_ppr === "number") pool.push(s.pts_ppr);
  }
  pool.sort(function (a, b) { return b - a; });
  const val = pool[rank - 1] != null ? pool[rank - 1] : null;
  replacementCache[key] = val;
  return val;
}
// Rank of a specific points value within its position's full pool that season
async function getPositionalFinishRank(position, points, season, statsDump) {
  const pool = [];
  for (const pid in PLAYER_POSITIONS) {
    if (PLAYER_POSITIONS[pid] !== position) continue;
    const s = statsDump[pid];
    if (s && typeof s.pts_ppr === "number") pool.push(s.pts_ppr);
  }
  pool.sort(function (a, b) { return b - a; });
  const rank = pool.filter(function (p) { return p > points; }).length + 1;
  return rank;
}

// ---- Flat pick lists across all years (Sleeper live + ESPN embedded) ----
let flatPicksCache = {}; // season -> array of {round, pickNo, name, position, team, owner, playerId, seasonPoints}

async function getSleeperPicksFlat(season) {
  if (flatPicksCache[season]) return flatPicksCache[season];
  const leagueId = LEAGUE_IDS[season];
  const [leagueInfo, rosters, users] = await Promise.all([
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/rosters"),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/users")
  ]);
  const picks = await fetchJson("https://api.sleeper.app/v1/draft/" + leagueInfo.draft_id + "/picks");
  const userIdToOwner = {};
  users.forEach(function (u) { userIdToOwner[u.user_id] = ownerNameFromUsername(u.display_name); registerLiveAvatar(userIdToOwner[u.user_id], u); });
  const overridesForLeague = ROSTER_OWNER_OVERRIDES[leagueId] || {};
  const rosterIdToOwner = {};
  rosters.forEach(function (r) {
    rosterIdToOwner[r.roster_id] = userIdToOwner[r.owner_id] || overridesForLeague[r.roster_id] || "Unknown";
  });
  const flat = picks.map(function (p) {
    const meta = p.metadata || {};
    return {
      season: season, round: p.round, pickNo: p.pick_no,
      name: ((meta.first_name || "") + " " + (meta.last_name || "")).trim() || playerName(p.player_id),
      position: meta.position || playerPos(p.player_id),
      team: meta.team || null,
      owner: rosterIdToOwner[p.roster_id] || "Unknown",
      playerId: p.player_id, seasonPoints: null, isEspn: false
    };
  });
  flatPicksCache[season] = flat;
  return flat;
}

async function getEspnPicksFlat(season) {
  if (flatPicksCache["espn-" + season]) return flatPicksCache["espn-" + season];
  const picks = (typeof ESPN_DRAFT_PICKS !== "undefined" && ESPN_DRAFT_PICKS[season]) || [];
  const flat = picks.filter(function (p) { return p.name; }).map(function (p) {
    return {
      season: season, round: p.round, pickNo: p.overallPick,
      name: p.name, position: p.position,
      team: p.proTeamId ? (ESPN_TEAM_ID_MAP[p.proTeamId] || null) : null,
      owner: p.owner, playerId: null, seasonPoints: p.seasonPoints != null ? p.seasonPoints : null, isEspn: true
    };
  });
  flatPicksCache["espn-" + season] = flat;
  return flat;
}

async function getAllPicksForSeason(season) {
  return ESPN_SEASONS.indexOf(season) !== -1 ? getEspnPicksFlat(season) : getSleeperPicksFlat(season);
}

const ALL_SEASONS = ESPN_SEASONS.concat(Object.keys(LEAGUE_IDS).map(Number)).sort(function (a, b) { return a - b; });
const SLEEPER_SEASONS = Object.keys(LEAGUE_IDS).map(Number).sort(function (a, b) { return a - b; });

// ---- Weekly matchup data (Sleeper years only) - for Luck Factor & Head-to-Head ----
let weeklyDataCache = {};
async function fetchWeeklyData(season) {
  if (weeklyDataCache[season]) return weeklyDataCache[season];
  const leagueId = LEAGUE_IDS[season];
  const [rosters, users] = await Promise.all([
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/rosters"),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/users")
  ]);
  const userIdToOwner = {};
  users.forEach(function (u) { userIdToOwner[u.user_id] = ownerNameFromUsername(u.display_name); registerLiveAvatar(userIdToOwner[u.user_id], u); });
  const overridesForLeague = ROSTER_OWNER_OVERRIDES[leagueId] || {};
  const rosterIdToOwner = {};
  rosters.forEach(function (r) {
    rosterIdToOwner[r.roster_id] = userIdToOwner[r.owner_id] || overridesForLeague[r.roster_id] || "Unknown";
  });

  const weekNums = [];
  for (let w = 1; w <= 17; w++) weekNums.push(w);
  const weeks = await Promise.all(weekNums.map(function (w) {
    return fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/matchups/" + w)
      .then(function (data) { return { week: w, entries: data || [] }; })
      .catch(function () { return { week: w, entries: [] }; });
  }));
  const played = weeks.filter(function (w) { return w.entries.length > 0; });
  const result = { weeks: played, rosterIdToOwner: rosterIdToOwner };
  weeklyDataCache[season] = result;
  return result;
}

// Unified matchup format regardless of source: {week, ownerA, scoreA, ownerB, scoreB}
function getEspnWeeklyMatchups(season) {
  const raw = (typeof ESPN_SCHEDULE !== "undefined" && ESPN_SCHEDULE[season]) || [];
  return raw.map(function (m) {
    return { week: m.week, ownerA: m.homeOwner, scoreA: m.homeScore, ownerB: m.awayOwner, scoreB: m.awayScore };
  });
}
async function getSleeperWeeklyMatchups(season) {
  const data = await fetchWeeklyData(season);
  const matchups = [];
  data.weeks.forEach(function (wk) {
    const byMatchup = {};
    wk.entries.forEach(function (e) { if (e.matchup_id != null) (byMatchup[e.matchup_id] = byMatchup[e.matchup_id] || []).push(e); });
    Object.values(byMatchup).forEach(function (pair) {
      if (pair.length !== 2) return;
      matchups.push({
        week: wk.week,
        ownerA: data.rosterIdToOwner[pair[0].roster_id] || "Unknown", scoreA: pair[0].points || 0,
        ownerB: data.rosterIdToOwner[pair[1].roster_id] || "Unknown", scoreB: pair[1].points || 0
      });
    });
  });
  return matchups;
}
async function getWeeklyMatchupsForSeason(season) {
  return ESPN_SEASONS.indexOf(season) !== -1 ? getEspnWeeklyMatchups(season) : getSleeperWeeklyMatchups(season);
}

// ---- shared avatar rendering ----
function initials(name) { return name.split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase(); }
function avatarHtml(owner) { return '<span class="avatar-slot" data-owner="' + owner + '"></span>'; }
function attachAvatarFallbacks(root) {
  root.querySelectorAll(".avatar-slot").forEach(function (slot) {
    const owner = slot.getAttribute("data-owner");
    const info = getAvatarInfo(owner);
    if (!info) {
      const div = document.createElement("div");
      div.className = "team-avatar-fallback";
      div.textContent = initials(owner);
      slot.replaceWith(div);
      return;
    }
    const img = document.createElement("img");
    img.className = "team-avatar";
    img.alt = "";
    img.addEventListener("error", function () {
      const div = document.createElement("div");
      div.className = "team-avatar-fallback";
      div.textContent = initials(owner);
      img.replaceWith(div);
    });
    img.src = info.type === "url" ? info.value : "https://sleepercdn.com/avatars/thumbs/" + info.value;
    slot.replaceWith(img);
  });
}

function row(rank, owner, titleLine, subLine, value, valueColor) {
  return '<div class="analytics-row">' +
    (rank != null ? '<div class="analytics-rank">' + rank + '</div>' : '') +
    (owner ? avatarHtml(owner) : '') +
    '<div class="analytics-main">' +
      '<div class="analytics-title-line">' + titleLine + '</div>' +
      (subLine ? '<div class="analytics-sub-line">' + subLine + '</div>' : '') +
    '</div>' +
    (value != null ? '<div class="analytics-value" style="color:' + (valueColor || "var(--text)") + ';">' + value + '</div>' : '') +
  '</div>';
}

async function renderMisses() {
  const misses = await computeBiggestMisses();
  if (misses.length === 0) return '<p class="empty-note">No misses found.</p>';
  return misses.map(function (m, i) {
    return row(i + 1, m.owner, m.name + ' (' + m.position + ')',
      m.season + ' \u00b7 drafted ' + m.draftRank + m.position.toLowerCase() + ', finished ' + m.finishRank + m.position.toLowerCase() + ' \u00b7 ' + m.owner,
      '+' + m.missScore, "var(--green)");
  }).join("");
}

let draftGradesData = null;
let draftGradesYear = "all";
function renderDraftGradesFilterBar() {
  const bar = document.getElementById("draftgrades-year-bar");
  if (!bar) return;
  const years = Object.keys(draftGradesData || {}).sort(function (a, b) { return b - a; });
  bar.innerHTML = '<button class="filter-btn small-btn ' + (draftGradesYear === "all" ? "active" : "") + '" data-dg-year="all">All-time</button>' +
    years.map(function (y) { return '<button class="filter-btn small-btn ' + (String(draftGradesYear) === y ? "active" : "") + '" data-dg-year="' + y + '">' + y + '</button>'; }).join("");
  bar.querySelectorAll("[data-dg-year]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      draftGradesYear = btn.dataset.dgYear === "all" ? "all" : Number(btn.dataset.dgYear);
      document.getElementById("analytics-content").innerHTML = renderDraftGradesBody();
      attachAvatarFallbacks(document.getElementById("analytics-content"));
      renderDraftGradesFilterBar();
    });
  });
}
function renderDraftGradesBody() {
  const bySeasonOwner = draftGradesData;
  if (draftGradesYear === "all") {
    const allTime = {};
    Object.keys(bySeasonOwner).forEach(function (season) {
      Object.keys(bySeasonOwner[season]).forEach(function (owner) {
        allTime[owner] = allTime[owner] || { totalVorp: 0, classes: 0 };
        allTime[owner].totalVorp += bySeasonOwner[season][owner].totalVorp;
        allTime[owner].classes += 1;
      });
    });
    const ranked = Object.keys(allTime).map(function (owner) {
      return { owner: owner, avgVorp: Math.round((allTime[owner].totalVorp / allTime[owner].classes) * 10) / 10, classes: allTime[owner].classes };
    }).sort(function (a, b) { return b.avgVorp - a.avgVorp; });
    return '<p class="empty-note" style="margin-bottom:10px;">Sleeper seasons only. All-time average draft class VORP.</p>' +
      ranked.map(function (o, i) {
        return row(i + 1, o.owner, o.owner, o.classes + ' draft classes', (o.avgVorp > 0 ? "+" : "") + o.avgVorp, o.avgVorp >= 0 ? "var(--green)" : "var(--red)");
      }).join("");
  }
  const seasonData = bySeasonOwner[draftGradesYear] || {};
  const ranked = Object.keys(seasonData).map(function (owner) {
    return { owner: owner, totalVorp: Math.round(seasonData[owner].totalVorp * 10) / 10 };
  }).sort(function (a, b) { return b.totalVorp - a.totalVorp; });
  return '<p class="empty-note" style="margin-bottom:10px;">' + draftGradesYear + ' draft class grades.</p>' +
    ranked.map(function (o, i) {
      return row(i + 1, o.owner, o.owner, null, (o.totalVorp > 0 ? "+" : "") + o.totalVorp, o.totalVorp >= 0 ? "var(--green)" : "var(--red)");
    }).join("");
}
async function renderDraftGrades() {
  if (!draftGradesData) draftGradesData = await computeDraftGrades();
  renderDraftGradesFilterBar();
  return renderDraftGradesBody();
}

let luckFactorData = null;
let luckFactorYear = "all";
function renderLuckFilterBar() {
  const bar = document.getElementById("luck-year-bar");
  if (!bar) return;
  const years = ALL_SEASONS.slice().sort(function (a, b) { return b - a; });
  bar.innerHTML = '<button class="filter-btn small-btn ' + (luckFactorYear === "all" ? "active" : "") + '" data-luck-year="all">All-time</button>' +
    years.map(function (y) { return '<button class="filter-btn small-btn ' + (luckFactorYear === y ? "active" : "") + '" data-luck-year="' + y + '">' + y + '</button>'; }).join("");
  bar.querySelectorAll("[data-luck-year]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      luckFactorYear = btn.dataset.luckYear === "all" ? "all" : Number(btn.dataset.luckYear);
      document.getElementById("analytics-content").innerHTML = renderLuckFactorBody();
      attachAvatarFallbacks(document.getElementById("analytics-content"));
      renderLuckFilterBar();
    });
  });
}
function renderLuckFactorBody() {
  let rows = luckFactorData;
  let note = "Covers all seasons, 2020-2026.";
  if (luckFactorYear === "all") {
    const byOwner = {};
    rows.forEach(function (r) {
      byOwner[r.owner] = byOwner[r.owner] || { actualWins: 0, expectedWins: 0 };
      byOwner[r.owner].actualWins += r.actualWins;
      byOwner[r.owner].expectedWins += r.expectedWins;
    });
    rows = Object.keys(byOwner).map(function (owner) {
      const o = byOwner[owner];
      return { owner: owner, season: "All-time", actualWins: o.actualWins, expectedWins: Math.round(o.expectedWins * 10) / 10, luck: Math.round((o.actualWins - o.expectedWins) * 10) / 10 };
    });
  } else {
    rows = rows.filter(function (r) { return r.season === luckFactorYear; });
  }
  rows = rows.slice().sort(function (a, b) { return b.luck - a.luck; });

  let html = '<div class="podium-title" style="margin-bottom:4px;">\uD83D\uDEA8 Fraud Meter \uD83D\uDEA8</div>' +
    '<p class="empty-note" style="margin-bottom:10px;">#1 = biggest fraud - won way more than their scoring actually deserved.</p>';

  if (rows.length > 0) {
    const topFraud = rows[0];
    html += '<div class="analytics-row" style="border-color:#ffd54a;box-shadow:0 0 14px rgba(255,213,74,0.35);">' +
      avatarHtml(topFraud.owner) +
      '<div class="analytics-main">' +
        '<div class="analytics-title-line">\uD83C\uDFC6 Certified Fraud of the ' + (luckFactorYear === "all" ? "Ages" : luckFactorYear) + ': ' + topFraud.owner + '</div>' +
        '<div class="analytics-sub-line">Won ' + topFraud.actualWins + ' games with only ' + topFraud.expectedWins + ' expected - riding pure luck</div>' +
      '</div>' +
      '<div class="analytics-value" style="color:var(--gold, #ffd54a);">+' + topFraud.luck + '</div>' +
    '</div>';
  }

  html += '<div class="podium-title" style="margin:20px 0 10px;">Full ranking</div>';
  html += '<p class="empty-note" style="margin-bottom:10px;">' + note + '</p>' +
    rows.map(function (r, i) {
      return row(i + 1, r.owner, r.owner, 'Actual wins: ' + r.actualWins + ' \u00b7 Expected: ' + r.expectedWins,
        (r.luck > 0 ? "+" : "") + r.luck + ' luck', r.luck >= 0 ? "var(--green)" : "var(--red)");
    }).join("");
  return html;
}
async function renderLuckFactor() {
  if (!luckFactorData) luckFactorData = await computeLuckFactor();
  renderLuckFilterBar();
  return renderLuckFactorBody();
}

// Disambiguates owners who share a first name (multiple Tylers/Austins) by
// showing their last name instead; everyone else shows first name for space.
const H2H_SHORT_NAME_OVERRIDES = {
  "Tyler Ahrens": "Ahrens", "Tyler Armstrong": "Armstrong",
  "Austin Farris": "Farris", "Austin Castro": "Castro",
  "Michael Hoffa": "Hoffa", "Sydney & Olivia": "MooreCok"
};
// Current-owners view drops the Austin/Michael disambiguation since only
// one Austin (and no other Michael) remains active - but both Tylers are
// still in the league, so that disambiguation stays either way.
const H2H_CURRENT_OWNER_OVERRIDES = {
  "Tyler Ahrens": "Ahrens", "Tyler Armstrong": "Armstrong",
  "Austin Farris": "Austin"
};
const CURRENT_OWNERS = [
  "Shivam Patel", "Tyler Armstrong", "Austin Farris", "Brayden Armstrong",
  "Braden Galvan", "Braeden Sully", "Tyler Ahrens", "Rohan Shani",
  "Zach Sullivan", "Joe Sadler"
];

let h2hMode = "all";
function h2hShortName(owner) {
  if (h2hMode === "current") return H2H_CURRENT_OWNER_OVERRIDES[owner] || owner.split(" ")[0];
  return H2H_SHORT_NAME_OVERRIDES[owner] || owner.split(" ")[0];
}

function renderH2HFilterBar() {
  const bar = document.getElementById("h2h-mode-bar");
  if (!bar) return;
  bar.innerHTML =
    '<button class="filter-btn small-btn ' + (h2hMode === "all" ? "active" : "") + '" data-h2h-mode="all">All-time</button>' +
    '<button class="filter-btn small-btn ' + (h2hMode === "current" ? "active" : "") + '" data-h2h-mode="current">Current owners</button>';
  bar.querySelectorAll("[data-h2h-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      h2hMode = btn.dataset.h2hMode;
      document.getElementById("analytics-content").innerHTML = renderHeadToHeadBody(h2hDataCache);
      attachAvatarFallbacks(document.getElementById("analytics-content"));
      renderH2HFilterBar();
    });
  });
}

let h2hDataCache = null;
function renderHeadToHeadBody(data) {
  const owners = h2hMode === "current" ? data.owners.filter(function (o) { return CURRENT_OWNERS.indexOf(o) !== -1; }) : data.owners;
  const note = h2hMode === "current"
    ? "Current 10 owners only - all seasons those owners have played, 2020-2026."
    : "All seasons, 2020-2026, every owner who's ever been in the league.";
  let html = '<p class="empty-note" style="margin-bottom:10px;">' + note + ' Each cell shows the row owner\'s record vs the column owner.</p>';
  html += '<div class="h2h-table"><div class="h2h-grid" style="grid-template-columns:repeat(' + (owners.length + 1) + ',1fr);">';
  html += '<div class="h2h-header"></div>';
  owners.forEach(function (o) { html += '<div class="h2h-header">' + h2hShortName(o) + '</div>'; });
  owners.forEach(function (rowOwner) {
    html += '<div class="h2h-header">' + h2hShortName(rowOwner) + '</div>';
    owners.forEach(function (colOwner) {
      if (rowOwner === colOwner) { html += '<div class="h2h-cell" style="opacity:0.3;">-</div>'; return; }
      const key = [rowOwner, colOwner].sort().join("|");
      const rec = data.record[key];
      if (!rec) { html += '<div class="h2h-cell" style="opacity:0.3;">-</div>'; return; }
      const wins = rec[rowOwner] || 0, losses = rec[colOwner] || 0;
      const color = wins > losses ? "var(--green)" : wins < losses ? "var(--red)" : "var(--text-mute)";
      html += '<div class="h2h-cell" style="color:' + color + ';">' + wins + '-' + losses + '</div>';
    });
  });
  html += '</div></div>';
  return html;
}

async function renderHeadToHead() {
  if (!h2hDataCache) h2hDataCache = await computeHeadToHead();
  renderH2HFilterBar();
  return renderHeadToHeadBody(h2hDataCache);
}

// Skill positions first, then kickers/defense at the back (not alphabetical,
// which would put DEF and K first)
const POSITION_ORDER = ["QB", "RB", "WR", "TE", "K", "DEF"];
function sortByPositionOrder(positions) {
  return positions.slice().sort(function (a, b) {
    const ai = POSITION_ORDER.indexOf(a), bi = POSITION_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

async function renderTendencies() {
  const data = await computeTendencies();
  return Object.keys(data).sort().map(function (owner) {
    const o = data[owner];
    const posLine = sortByPositionOrder(Object.keys(o.avgFirstRound)).map(function (pos) {
      return pos + ': R' + o.avgFirstRound[pos];
    }).join(" \u00b7 ");
    const mixLine = sortByPositionOrder(Object.keys(o.positionCounts)).map(function (pos) {
      return pos + ' ' + o.positionCounts[pos];
    }).join(", ");
    return row(null, owner, owner, "First taken - " + posLine, null) +
      '<div class="analytics-sub-line" style="margin:-4px 0 10px 44px;">Position mix: ' + mixLine + ' (' + o.totalPicks + ' total picks)</div>';
  }).join("");
}

async function renderKeeperHits() {
  const data = await computeKeeperHitRate();
  let html = Object.keys(data.byOwner).map(function (owner) {
    const o = data.byOwner[owner];
    const pct = Math.round((o.hits / o.total) * 100);
    return row(null, owner, owner, o.hits + ' hits / ' + o.misses + ' misses (' + o.total + ' keepers)', pct + '%', pct >= 50 ? "var(--green)" : "var(--red)");
  }).join("");
  html += '<div class="podium-title" style="margin:20px 0 10px;">Every keeper pick</div>';
  html += data.details.sort(function (a, b) { return b.vorp - a.vorp; }).map(function (d) {
    return row(null, d.owner, d.player + ' (' + d.season + ')', d.owner, (d.vorp > 0 ? "+" : "") + d.vorp, d.vorp >= 0 ? "var(--green)" : "var(--red)");
  }).join("");
  return html;
}

async function renderRoundValue() {
  const byRound = await computeRoundValue();
  const rounds = Object.keys(byRound).map(Number).sort(function (a, b) { return a - b; });
  return rounds.map(function (r) {
    const d = byRound[r];
    const avg = Math.round((d.totalVorp / d.count) * 10) / 10;
    return row(null, null, "Round " + r, d.count + ' picks analyzed', (avg > 0 ? "+" : "") + avg + ' avg VORP', avg >= 0 ? "var(--green)" : "var(--red)");
  }).join("");
}

async function renderConsistency() {
  const data = await computeConsistency();
  const ranked = Object.keys(data).map(function (owner) {
    return { owner: owner, stdDev: data[owner].stdDev, avg: data[owner].avg, games: data[owner].games };
  }).sort(function (a, b) { return a.stdDev - b.stdDev; });
  let html = '<p class="empty-note" style="margin-bottom:10px;">All seasons, 2020-2026. Lower std dev = steadier week to week.</p>';
  html += ranked.map(function (o, i) {
    return row(i + 1, o.owner, o.owner, 'Avg ' + o.avg + ' pts/week across ' + o.games + ' games', o.stdDev + ' std dev', null);
  }).join("");
  return html;
}

let optimalDraftSeason = null;
let optimalDraftKeepersMode = "keepers";
let optimalDraftDataCache = {}; // "season-mode" -> simulated board

function renderOptimalDraftFilterBars() {
  const seasonBar = document.getElementById("optimaldraft-season-bar");
  const keepersBar = document.getElementById("optimaldraft-keepers-bar");
  const seasons = ALL_SEASONS.slice().sort(function (a, b) { return b - a; });
  if (!optimalDraftSeason) optimalDraftSeason = seasons[0];

  seasonBar.innerHTML = seasons.map(function (s) {
    return '<button class="filter-btn small-btn ' + (s === optimalDraftSeason ? "active" : "") + '" data-od-season="' + s + '">' + s + '</button>';
  }).join("");
  keepersBar.innerHTML =
    '<button class="filter-btn small-btn ' + (optimalDraftKeepersMode === "keepers" ? "active" : "") + '" data-od-keepers="keepers">Keepers</button>' +
    '<button class="filter-btn small-btn ' + (optimalDraftKeepersMode === "nokeepers" ? "active" : "") + '" data-od-keepers="nokeepers">No Keepers</button>';

  seasonBar.querySelectorAll("[data-od-season]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      optimalDraftSeason = Number(btn.dataset.odSeason);
      renderOptimalDraft().then(function (html) {
        document.getElementById("analytics-content").innerHTML = html;
        renderOptimalDraftFilterBars();
      });
    });
  });
  keepersBar.querySelectorAll("[data-od-keepers]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      optimalDraftKeepersMode = btn.dataset.odKeepers;
      renderOptimalDraft().then(function (html) {
        document.getElementById("analytics-content").innerHTML = html;
        renderOptimalDraftFilterBars();
      });
    });
  });
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  return "#" + a.map(function (c, i) {
    return Math.round(Math.max(0, Math.min(255, c + (b[i] - c) * t))).toString(16).padStart(2, "0");
  }).join("");
}
// Same magnitude-scaled color ramp used on Draft History's Performance mode -
// the bigger the number, the more it pops, red for negative/green for positive.
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
  return lerpColor(lo.c, hi.c, t);
}

async function renderOptimalDraft() {
  if (!optimalDraftSeason) optimalDraftSeason = ALL_SEASONS[ALL_SEASONS.length - 1];
  renderOptimalDraftFilterBars();
  const cacheKey = optimalDraftSeason + "-" + optimalDraftKeepersMode;
  let board = optimalDraftDataCache[cacheKey];
  if (!board) {
    board = await simulateOptimalDraft(optimalDraftSeason, optimalDraftKeepersMode);
    optimalDraftDataCache[cacheKey] = board;
  }

  let html = '<p class="empty-note" style="margin-bottom:10px;">' + optimalDraftSeason + ' - how the draft would have gone if every team picked the best available VORP each turn' +
    (optimalDraftKeepersMode === "keepers" ? ", keeping everyone's real keeper locked in." : ", with no keepers - everyone (including real keepers) is up for grabs.") + '</p>';

  html += '<div class="draft-board"><div class="draft-grid" style="grid-template-columns:repeat(' + (board.maxSlot + 1) + ',1fr);">';
  html += '<div></div>';
  const slotOwners = {};
  Object.keys(board.ownerToSlot).forEach(function (owner) { slotOwners[board.ownerToSlot[owner]] = owner; });
  for (let slot = 1; slot <= board.maxSlot; slot++) {
    html += '<div class="draft-header-cell">' + (slotOwners[slot] || "Slot " + slot) + '</div>';
  }
  for (let round = 1; round <= board.maxRound; round++) {
    html += '<div class="draft-header-cell" style="background:transparent;border:none;color:var(--text-mute);">R' + round + '</div>';
    for (let slot = 1; slot <= board.maxSlot; slot++) {
      const pick = board.cellMap[round + "-" + slot];
      if (!pick) { html += '<div class="draft-cell"></div>'; continue; }
      const name = (pick.metadata.first_name + " " + pick.metadata.last_name).trim();
      html += '<div class="draft-cell' + (pick.isKeeper ? " keeper" : "") + '">' +
        '<div class="pick-num">Pick ' + pick.pick_no + (pick.isKeeper ? " \uD83D\uDD11" : "") + '</div>' +
        '<div class="pick-player">' + name + '</div>' +
        '<span class="pick-pos">' + (pick.metadata.position || "") + '</span>' +
        (pick.value != null && pick.value > -999 ? '<div class="pick-value" style="color:' + magnitudeColor(pick.value) + ';">' + (pick.value > 0 ? "+" : "") + pick.value + '</div>' : '') +
      '</div>';
    }
  }
  html += '</div></div>';
  return html;
}

const TAB_RENDERERS = {
  misses: renderMisses, draftgrades: renderDraftGrades, luck: renderLuckFactor,
  h2h: renderHeadToHead, tendencies: renderTendencies, keeperhits: renderKeeperHits,
  roundvalue: renderRoundValue, consistency: renderConsistency, optimaldraft: renderOptimalDraft
};

async function showTab(tab) {
  activeTab = tab;
  const loading = document.getElementById("analytics-loading");
  const content = document.getElementById("analytics-content");

  document.getElementById("draftgrades-year-bar").style.display = tab === "draftgrades" ? "flex" : "none";
  document.getElementById("luck-year-bar").style.display = tab === "luck" ? "flex" : "none";
  document.getElementById("h2h-mode-bar").style.display = tab === "h2h" ? "flex" : "none";
  document.getElementById("optimaldraft-season-bar").style.display = tab === "optimaldraft" ? "flex" : "none";
  document.getElementById("optimaldraft-keepers-bar").style.display = tab === "optimaldraft" ? "flex" : "none";

  // draftgrades/luck manage their own re-render on filter change, so always
  // re-derive their view from already-fetched data instead of a stale cache
  if (tab === "draftgrades" || tab === "luck" || tab === "h2h" || tab === "optimaldraft") {
    loading.style.display = "block";
    loading.textContent = "Crunching numbers across every season... this can take a bit the first time.";
    content.innerHTML = "";
    try {
      const html = await TAB_RENDERERS[tab]();
      content.innerHTML = html;
      attachAvatarFallbacks(content);
      loading.style.display = "none";
    } catch (e) {
      loading.textContent = "Couldn't compute this right now.";
      console.error(e);
    }
    return;
  }

  if (tabCache[tab]) {
    content.innerHTML = tabCache[tab];
    attachAvatarFallbacks(content);
    loading.style.display = "none";
    return;
  }

  loading.style.display = "block";
  loading.textContent = "Crunching numbers across every season... this can take a bit the first time.";
  content.innerHTML = "";

  try {
    const html = await TAB_RENDERERS[tab]();
    tabCache[tab] = html;
    content.innerHTML = html;
    attachAvatarFallbacks(content);
    loading.style.display = "none";
  } catch (e) {
    loading.textContent = "Couldn't compute this right now.";
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("#analytics-tab-bar [data-tab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#analytics-tab-bar [data-tab]").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      showTab(btn.dataset.tab);
    });
  });
  showTab("misses");
});

// Shared helper: VORP for one pick, works for both Sleeper (real stats) and
// ESPN (embedded season points + pool built from other ESPN picks that season)
async function getPickVorpFlat(pick, seasonPicks, statsDump) {
  if (!pick.position) return null;
  if (pick.isEspn) {
    if (pick.seasonPoints == null) return null;
    const pool = seasonPicks.filter(function (q) { return q.position === pick.position && q.seasonPoints != null; })
      .map(function (q) { return q.seasonPoints; }).sort(function (a, b) { return b - a; });
    if (pool.length === 0) return null;
    const rank = replacementRank(pick.position, pick.season);
    // Fall back to the shallowest player actually in the pool if this
    // position's draft-only pool (ESPN years) is smaller than the calculated
    // replacement rank - otherwise thin positions like TE can go entirely
    // blank for a whole season (real bug found and fixed on Draft History).
    const replacement = rank ? (pool[rank - 1] != null ? pool[rank - 1] : pool[pool.length - 1]) : null;
    return replacement != null ? Math.round((pick.seasonPoints - replacement) * 10) / 10 : null;
  }
  if (!statsDump || !pick.playerId) return null;
  const pts = statsDump[pick.playerId] && statsDump[pick.playerId].pts_ppr;
  if (pts == null) return null;
  const replacement = await getReplacementPoints(pick.position, pick.season, statsDump);
  return replacement != null ? Math.round((pts - replacement) * 10) / 10 : null;
}

// ============================================================
// OPTIMAL DRAFT SIMULATOR - re-drafts a real season's draft as if every
// team picked the best available VORP each turn (with perfect hindsight),
// using the exact same draft order/teams/rounds as the real draft. Smart-
// draft constraints keep it from producing absurd lineups (e.g. drafting
// 4 kickers in round 2).
// ============================================================

const ROSTER_REQUIREMENTS = { QB: 1, RB: 2, WR: 2, TE: 1, K: 1, DEF: 1 };
const SIM_FLEX_SLOTS = 2;
const SIM_FLEX_ELIGIBLE = ["RB", "WR", "TE"];
const MAX_QB = 2, MAX_TE = 2;

async function simulateOptimalDraft(season, keepersMode) {
  const realPicks = await getAllPicksForSeason(season);
  const isEspn = ESPN_SEASONS.indexOf(season) !== -1;
  let statsDump = null;
  if (!isEspn) {
    try { statsDump = await fetchSeasonStats(season); } catch (e) { /* fall through with null */ }
  }

  // Draft order/teams: reuse the EXACT real sequence (round, pickNo, owner) -
  // same slots, same teams each round, just different players end up there.
  const draftOrder = realPicks.slice().sort(function (a, b) { return a.pickNo - b.pickNo; })
    .map(function (p) { return { round: p.round, pickNo: p.pickNo, owner: p.owner }; });
  const maxRound = Math.max.apply(null, draftOrder.map(function (p) { return p.round; }));

  // Slot number per owner, derived from round-1 order (for grid rendering later)
  const ownerToSlot = {};
  draftOrder.filter(function (p) { return p.round === 1; })
    .forEach(function (p, i) { ownerToSlot[p.owner] = i + 1; });

  // Build the value pool: VORP for skill positions, raw season points for K/DEF
  // (VORP isn't computed for K/DEF anywhere on this site - no replacement
  // level baseline for them - so raw points is the best available proxy).
  // Every real drafted player gets AN entry even if their value can't be
  // computed (missing stats) - falling back to a low placeholder rather than
  // excluding them entirely. Without this, the pool can run short of the
  // actual number of real picks, leaving later rounds (where deep/bench
  // picks concentrate) with nothing left to assign - the cause of widespread
  // and full-round blank cells that were reported.
  const pool = [];
  for (const p of realPicks) {
    if (!p.position) continue;
    let value;
    if (p.position === "K" || p.position === "DEF") {
      value = p.seasonPoints;
    } else {
      value = await getPickVorpFlat(p, realPicks, statsDump);
    }
    pool.push({ name: p.name, position: p.position, value: value != null ? value : -999, team: p.team });
  }

  // Keepers mode: lock each team's real keeper into their real slot, and
  // remove that player from the general pool. No-Keepers mode: leave the
  // pool untouched - the kept player is up for grabs by anyone.
  const lockedPicks = {}; // "round-pickNo" -> {name, position, team, isKeeper:true}
  if (keepersMode === "keepers" && typeof KEEPER_DATA !== "undefined") {
    KEEPER_DATA.filter(function (k) { return k.season === season; }).forEach(function (k) {
      const realPick = realPicks.find(function (p) { return p.owner === k.owner && normalizeName(p.name) === normalizeName(k.player); });
      if (!realPick) return;
      lockedPicks[realPick.round + "-" + realPick.pickNo] = { name: k.player, position: realPick.position, team: realPick.team, isKeeper: true };
      const poolIdx = pool.findIndex(function (p) { return normalizeName(p.name) === normalizeName(k.player); });
      if (poolIdx !== -1) pool.splice(poolIdx, 1);
    });
  }

  // Per-owner roster state as the simulated draft progresses
  const rosterState = {};
  function getRoster(owner) {
    if (!rosterState[owner]) {
      rosterState[owner] = { QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DEF: 0, flexUsed: 0 };
    }
    return rosterState[owner];
  }
  function nonKDefStartersFilled(roster) {
    const mandatoryFilled = roster.QB >= 1 && roster.RB >= ROSTER_REQUIREMENTS.RB &&
      roster.WR >= ROSTER_REQUIREMENTS.WR && roster.TE >= 1;
    const flexEligibleExtra = Math.max(0, roster.RB - ROSTER_REQUIREMENTS.RB) +
      Math.max(0, roster.WR - ROSTER_REQUIREMENTS.WR) + Math.max(0, roster.TE - 1);
    return mandatoryFilled && flexEligibleExtra >= SIM_FLEX_SLOTS;
  }

  // If a keeper occupies a slot, its roster impact still needs to be applied
  // when the simulation reaches that pick - apply it inline during the loop.

  const cellMap = {};
  for (const pick of draftOrder) {
    const key = pick.round + "-" + pick.pickNo;
    const roster = getRoster(pick.owner);

    if (lockedPicks[key]) {
      const kept = lockedPicks[key];
      if (kept.position && roster[kept.position] != null) roster[kept.position]++;
      cellMap[pick.round + "-" + ownerToSlot[pick.owner]] = {
        round: pick.round, pick_no: pick.pickNo, owner: pick.owner,
        metadata: { first_name: kept.name.split(" ")[0], last_name: kept.name.split(" ").slice(1).join(" "), position: kept.position, team: kept.team },
        isKeeper: true
      };
      continue;
    }

    const roundsFromEnd = maxRound - pick.round; // 0 = last round
    const kdefEligible = roundsFromEnd <= 2; // "last 3 rounds"
    const kdefForceWindow = roundsFromEnd <= 1; // "last 2 rounds"
    const needsK = roster.K < ROSTER_REQUIREMENTS.K;
    const needsDef = roster.DEF < ROSTER_REQUIREMENTS.DEF;

    let chosenIdx = -1;

    if (kdefForceWindow && (needsK || needsDef)) {
      // force-fill whichever is still missing (K before DEF if both missing)
      const wantPos = needsK ? "K" : "DEF";
      let best = -1, bestVal = -Infinity;
      pool.forEach(function (p, i) { if (p.position === wantPos && p.value > bestVal) { best = i; bestVal = p.value; } });
      chosenIdx = best;
      // Safety fallback: if that position is already exhausted in the pool
      // (e.g. missing data for one team's worth of K/DEF), don't just skip
      // the pick entirely - fall through to normal best-available logic
      // below so the team still drafts someone.
    }

    if (chosenIdx === -1) {
      const lineupFilled = nonKDefStartersFilled(roster);
      let best = -1, bestVal = -Infinity;
      pool.forEach(function (p, i) {
        if (p.position === "K" || p.position === "DEF") {
          if (!kdefEligible) return;
          if ((p.position === "K" && roster.K >= ROSTER_REQUIREMENTS.K) || (p.position === "DEF" && roster.DEF >= ROSTER_REQUIREMENTS.DEF)) return;
        } else if (p.position === "QB") {
          if (roster.QB >= MAX_QB) return;
          if (roster.QB >= 1 && !lineupFilled) return; // no 2nd QB before lineup filled
        } else if (p.position === "TE") {
          if (roster.TE >= MAX_TE) return;
          if (roster.TE >= 1 && !lineupFilled) return; // no 2nd TE before lineup filled
        } else if (SIM_FLEX_ELIGIBLE.indexOf(p.position) === -1) {
          return; // unknown position, skip
        }
        if (p.value > bestVal) { best = i; bestVal = p.value; }
      });
      chosenIdx = best;
    }

    // Last resort: if every constraint-respecting option is exhausted (e.g.
    // this season's pool ran short because many deep/bench real picks never
    // had a resolvable VORP), ignore the smart-draft rules entirely rather
    // than leaving the pick blank - a real team always drafts someone with
    // their turn. This is what was causing widespread blank cells, especially
    // in later rounds where the pool thins out fastest.
    if (chosenIdx === -1 && pool.length > 0) {
      let best = 0, bestVal = pool[0].value;
      pool.forEach(function (p, i) { if (p.value > bestVal) { best = i; bestVal = p.value; } });
      chosenIdx = best;
    }

    if (chosenIdx === -1) continue; // truly nothing left in the pool at all
    const chosen = pool[chosenIdx];
    pool.splice(chosenIdx, 1);
    if (chosen.position && roster[chosen.position] != null) roster[chosen.position]++;

    cellMap[pick.round + "-" + ownerToSlot[pick.owner]] = {
      round: pick.round, pick_no: pick.pickNo, owner: pick.owner,
      metadata: { first_name: chosen.name.split(" ")[0], last_name: chosen.name.split(" ").slice(1).join(" "), position: chosen.position, team: chosen.team },
      value: Math.round(chosen.value * 10) / 10
    };
  }

  return { season: season, maxRound: maxRound, maxSlot: Object.keys(ownerToSlot).length, ownerToSlot: ownerToSlot, cellMap: cellMap };
}
function isKeeperPick(season, pickNo) {
  if (typeof KEEPER_DATA === "undefined") return false;
  return KEEPER_DATA.some(function (k) { return k.season === season && k.pick === pickNo; });
}

async function computeBiggestMisses() {
  const allMisses = [];
  for (const season of ALL_SEASONS) {
    const picks = await getAllPicksForSeason(season);
    const byPos = {};
    picks.forEach(function (p) { if (p.position) (byPos[p.position] = byPos[p.position] || []).push(p); });
    Object.keys(byPos).forEach(function (pos) { byPos[pos].sort(function (a, b) { return a.pickNo - b.pickNo; }); });

    const isEspn = ESPN_SEASONS.indexOf(season) !== -1;
    let statsDump = null;
    if (!isEspn) {
      try { statsDump = await fetchSeasonStats(season); } catch (e) { continue; }
    }

    for (const pos of Object.keys(byPos)) {
      if (isEspn) {
        const withPoints = byPos[pos].filter(function (p) { return p.seasonPoints != null; })
          .slice().sort(function (a, b) { return b.seasonPoints - a.seasonPoints; });
        byPos[pos].forEach(function (p, idx) {
          if (p.seasonPoints == null) return;
          if (isKeeperPick(season, p.pickNo)) return; // still counts toward draft order above, just not listed as a "find"
          const finishRank = withPoints.indexOf(p) + 1;
          const missScore = (idx + 1) - finishRank;
          if (missScore > 0) allMisses.push(Object.assign({}, p, { draftRank: idx + 1, finishRank: finishRank, missScore: missScore }));
        });
      } else {
        for (let idx = 0; idx < byPos[pos].length; idx++) {
          const p = byPos[pos][idx];
          if (!p.playerId) continue;
          if (isKeeperPick(season, p.pickNo)) continue;
          const pts = statsDump[p.playerId] && statsDump[p.playerId].pts_ppr;
          if (pts == null) continue;
          const finishRank = await getPositionalFinishRank(pos, pts, season, statsDump);
          const missScore = (idx + 1) - finishRank;
          if (missScore > 0) allMisses.push(Object.assign({}, p, { draftRank: idx + 1, finishRank: finishRank, missScore: missScore }));
        }
      }
    }
  }
  allMisses.sort(function (a, b) { return b.missScore - a.missScore; });

  // ensure at least one entry per owner shows up, per the original ask
  const top = allMisses.slice(0, 15);
  const ownersShown = new Set(top.map(function (m) { return m.owner; }));
  const byOwnerBest = {};
  allMisses.forEach(function (m) {
    if (!byOwnerBest[m.owner] || m.missScore > byOwnerBest[m.owner].missScore) byOwnerBest[m.owner] = m;
  });
  Object.keys(byOwnerBest).forEach(function (owner) {
    if (!ownersShown.has(owner) && byOwnerBest[owner].missScore > 0) {
      top.push(byOwnerBest[owner]);
      ownersShown.add(owner);
    }
  });
  return top;
}

// ---- Tab 2: Draft Grades (Sleeper years only for now) ----
async function computeDraftGrades() {
  const bySeasonOwner = {};
  for (const season of SLEEPER_SEASONS) {
    const picks = await getAllPicksForSeason(season);
    let statsDump = null;
    try { statsDump = await fetchSeasonStats(season); } catch (e) { continue; }
    for (const p of picks) {
      const vorp = await getPickVorpFlat(p, picks, statsDump);
      if (vorp == null) continue;
      bySeasonOwner[season] = bySeasonOwner[season] || {};
      bySeasonOwner[season][p.owner] = bySeasonOwner[season][p.owner] || { totalVorp: 0, picks: 0 };
      bySeasonOwner[season][p.owner].totalVorp += vorp;
      bySeasonOwner[season][p.owner].picks += 1;
    }
  }
  return bySeasonOwner;
}

// ---- Tab 3: Luck Factor (Sleeper years only - needs weekly matchup data) ----
async function computeLuckFactor() {
  const results = [];
  for (const season of ALL_SEASONS) {
    let matchups;
    try { matchups = await getWeeklyMatchupsForSeason(season); } catch (e) { continue; }
    if (matchups.length === 0) continue;
    const byWeek = {};
    matchups.forEach(function (m) { (byWeek[m.week] = byWeek[m.week] || []).push(m); });

    const totals = {};
    Object.keys(byWeek).forEach(function (week) {
      const weekMatchups = byWeek[week];
      const scores = [];
      weekMatchups.forEach(function (m) { scores.push({ owner: m.ownerA, points: m.scoreA }); scores.push({ owner: m.ownerB, points: m.scoreB }); });
      scores.forEach(function (s) {
        const beat = scores.filter(function (o) { return o.owner !== s.owner && o.points < s.points; }).length;
        const expected = scores.length > 1 ? beat / (scores.length - 1) : 0;
        totals[s.owner] = totals[s.owner] || { actualWins: 0, expectedWins: 0 };
        totals[s.owner].expectedWins += expected;
      });
      weekMatchups.forEach(function (m) {
        if (m.scoreA > m.scoreB) totals[m.ownerA].actualWins += 1;
        else if (m.scoreB > m.scoreA) totals[m.ownerB].actualWins += 1;
      });
    });
    Object.keys(totals).forEach(function (owner) {
      const t = totals[owner];
      results.push({
        season: season, owner: owner, actualWins: t.actualWins,
        expectedWins: Math.round(t.expectedWins * 10) / 10,
        luck: Math.round((t.actualWins - t.expectedWins) * 10) / 10
      });
    });
  }
  return results;
}

// ---- Tab 4: Head-to-Head (all seasons, including ESPN via schedule data) ----
async function computeHeadToHead() {
  const owners = new Set();
  const record = {};
  for (const season of ALL_SEASONS) {
    let matchups;
    try { matchups = await getWeeklyMatchupsForSeason(season); } catch (e) { continue; }
    matchups.forEach(function (m) {
      owners.add(m.ownerA); owners.add(m.ownerB);
      const key = [m.ownerA, m.ownerB].sort().join("|");
      record[key] = record[key] || {};
      if (m.scoreA === m.scoreB) {
        record[key].ties = (record[key].ties || 0) + 1;
      } else {
        const winner = m.scoreA > m.scoreB ? m.ownerA : m.ownerB;
        record[key][winner] = (record[key][winner] || 0) + 1;
      }
    });
  }
  return { owners: Array.from(owners).sort(), record: record };
}

// ---- Tab 5: Positional Drafting Tendencies ----
async function computeTendencies() {
  const byOwner = {};
  for (const season of ALL_SEASONS) {
    const picks = await getAllPicksForSeason(season);
    const byOwnerThisSeason = {};
    picks.forEach(function (p) { (byOwnerThisSeason[p.owner] = byOwnerThisSeason[p.owner] || []).push(p); });
    Object.keys(byOwnerThisSeason).forEach(function (owner) {
      const ownerPicks = byOwnerThisSeason[owner].slice().sort(function (a, b) { return a.round - b.round; });
      byOwner[owner] = byOwner[owner] || { positionCounts: {}, totalPicks: 0, firstRoundSamples: {} };
      const seenPos = new Set();
      ownerPicks.forEach(function (p) {
        if (!p.position) return;
        byOwner[owner].positionCounts[p.position] = (byOwner[owner].positionCounts[p.position] || 0) + 1;
        byOwner[owner].totalPicks += 1;
        if (!seenPos.has(p.position)) {
          seenPos.add(p.position);
          byOwner[owner].firstRoundSamples[p.position] = byOwner[owner].firstRoundSamples[p.position] || [];
          byOwner[owner].firstRoundSamples[p.position].push(p.round);
        }
      });
    });
  }
  const result = {};
  Object.keys(byOwner).forEach(function (owner) {
    const o = byOwner[owner];
    const avgFirstRound = {};
    Object.keys(o.firstRoundSamples).forEach(function (pos) {
      const arr = o.firstRoundSamples[pos];
      avgFirstRound[pos] = Math.round((arr.reduce(function (a, b) { return a + b; }, 0) / arr.length) * 10) / 10;
    });
    result[owner] = { avgFirstRound: avgFirstRound, positionCounts: o.positionCounts, totalPicks: o.totalPicks };
  });
  return result;
}

// ---- Tab 6: Keeper Hit Rate ----
async function computeKeeperHitRate() {
  const byOwner = {};
  const details = [];
  for (const k of KEEPER_DATA) {
    const playerInfo = (typeof PLAYER_DB !== "undefined") ? PLAYER_DB[k.player] : null;
    if (!playerInfo) continue;
    let statsDump;
    try { statsDump = await fetchSeasonStats(k.season); } catch (e) { continue; }
    const pts = statsDump[playerInfo.playerId] && statsDump[playerInfo.playerId].pts_ppr;
    if (pts == null) continue;
    const replacement = await getReplacementPoints(playerInfo.position, k.season, statsDump);
    if (replacement == null) continue;
    const vorp = Math.round((pts - replacement) * 10) / 10;
    byOwner[k.owner] = byOwner[k.owner] || { hits: 0, misses: 0, total: 0 };
    byOwner[k.owner].total += 1;
    if (vorp > 0) byOwner[k.owner].hits += 1; else byOwner[k.owner].misses += 1;
    details.push({ owner: k.owner, player: k.player, season: k.season, vorp: vorp });
  }
  return { byOwner: byOwner, details: details };
}

// ---- Tab 7: Draft Value by Round (league-wide, all owners combined) ----
async function computeRoundValue() {
  const byRound = {};
  for (const season of ALL_SEASONS) {
    const picks = await getAllPicksForSeason(season);
    const isEspn = ESPN_SEASONS.indexOf(season) !== -1;
    let statsDump = null;
    if (!isEspn) {
      try { statsDump = await fetchSeasonStats(season); } catch (e) { continue; }
    }
    for (const p of picks) {
      const vorp = await getPickVorpFlat(p, picks, statsDump);
      if (vorp == null) continue;
      byRound[p.round] = byRound[p.round] || { totalVorp: 0, count: 0 };
      byRound[p.round].totalVorp += vorp;
      byRound[p.round].count += 1;
    }
  }
  return byRound;
}

// ---- Tab 8: Consistency (Sleeper years only) ----
async function computeConsistency() {
  const byOwner = {};
  for (const season of ALL_SEASONS) {
    let matchups;
    try { matchups = await getWeeklyMatchupsForSeason(season); } catch (e) { continue; }
    matchups.forEach(function (m) {
      byOwner[m.ownerA] = byOwner[m.ownerA] || [];
      byOwner[m.ownerA].push(m.scoreA);
      byOwner[m.ownerB] = byOwner[m.ownerB] || [];
      byOwner[m.ownerB].push(m.scoreB);
    });
  }
  const result = {};
  Object.keys(byOwner).forEach(function (owner) {
    const scores = byOwner[owner];
    const mean = scores.reduce(function (a, b) { return a + b; }, 0) / scores.length;
    const variance = scores.reduce(function (s, v) { return s + Math.pow(v - mean, 2); }, 0) / scores.length;
    result[owner] = { stdDev: Math.round(Math.sqrt(variance) * 10) / 10, avg: Math.round(mean * 10) / 10, games: scores.length };
  });
  return result;
}
