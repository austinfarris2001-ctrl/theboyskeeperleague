let activeSeasonFilter = "all";
let viewMode = "individual"; // "individual" or "total" - total only applies under All seasons
let scoreMode = "adp"; // "adp" (pick vs ADP) or "performance" (Points Over Replacement)
let rankView = "kept";
let performanceScoreCache = {}; // "season-player" -> VORP score (populated by getPerformanceScore)
let teamPlacementsForRender = {}; // season -> {owner: {finalRank, totalTeams}} - populated before each render

// Cache of season stats dumps, keyed by season - so switching the toggle or
// reopening a spotlight doesn't re-fetch the same ~1-2MB season stats file.
let seasonStatsCache = {};

async function fetchSeasonStats(season) {
  if (seasonStatsCache[season]) return seasonStatsCache[season];
  const res = await fetch("https://api.sleeper.app/v1/stats/nfl/regular/" + season);
  if (!res.ok) throw new Error("Failed to fetch season stats for " + season);
  const data = await res.json();
  seasonStatsCache[season] = data;
  return data;
}

// ============================================================
// TEAM PLACEMENTS - for the gold/silver/bronze/poop trophy badges.
// Same bracket-parsing approach as Team Stats: real playoff results,
// not regular-season record.
// ============================================================
let placementsCache = {}; // season -> { ownerName: { finalRank, totalTeams } }

function parseBracketPlacements(winnersBracket, losersBracket, totalTeams) {
  const placements = {};
  (winnersBracket || []).forEach(function (m) {
    if (m.p === 1 && m.w != null && m.l != null) {
      placements[m.w] = 1;
      placements[m.l] = 2;
    } else if (m.p === 3 && m.w != null && m.l != null) {
      placements[m.w] = 3;
      placements[m.l] = 4;
    }
  });
  if (losersBracket && losersBracket.length > 0) {
    const maxP = Math.max.apply(null, losersBracket.map(function (m) { return m.p || 0; }));
    losersBracket.forEach(function (m) {
      if (m.p === maxP && m.w != null && m.l != null) {
        placements[m.l] = totalTeams;
        placements[m.w] = totalTeams - 1;
      }
    });
  }
  return placements;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

async function getTeamPlacements(season) {
  if (placementsCache[season]) return placementsCache[season];
  const leagueId = typeof LEAGUE_IDS !== "undefined" ? LEAGUE_IDS[season] : null;
  if (!leagueId) return {};

  try {
    const [rosters, users, winnersBracket, losersBracket] = await Promise.all([
      fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/rosters"),
      fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/users"),
      fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/winners_bracket").catch(function () { return []; }),
      fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/losers_bracket").catch(function () { return []; })
    ]);

    const userIdToOwner = {};
    users.forEach(function (u) { userIdToOwner[u.user_id] = ownerNameFromUsername(u.display_name); });
    const overridesForLeague = (typeof ROSTER_OWNER_OVERRIDES !== "undefined" && ROSTER_OWNER_OVERRIDES[leagueId]) || {};
    const rosterIdToOwner = {};
    rosters.forEach(function (r) {
      rosterIdToOwner[r.roster_id] = userIdToOwner[r.owner_id] || overridesForLeague[r.roster_id] || "Unknown";
    });

    const totalTeams = rosters.length;
    const placements = parseBracketPlacements(winnersBracket, losersBracket, totalTeams);

    const result = {};
    rosters.forEach(function (r) {
      const owner = rosterIdToOwner[r.roster_id];
      result[owner] = { finalRank: placements[r.roster_id] || null, totalTeams: totalTeams };
    });
    placementsCache[season] = result;
    return result;
  } catch (e) {
    return {};
  }
}

function placementBadgeHtml(finalRank, totalTeams) {
  if (!finalRank || !totalTeams) return "";
  if (finalRank === 1) return '<span class="placement-badge" title="Champion">\uD83E\uDD47</span>';
  if (finalRank === 2) return '<span class="placement-badge" title="Runner-up">\uD83E\uDD48</span>';
  if (finalRank === 3) return '<span class="placement-badge" title="Third place">\uD83E\uDD49</span>';
  if (finalRank === totalTeams) return '<span class="placement-badge" title="Last place">\uD83D\uDCA9</span>';
  return "";
}

// ============================================================
// PERFORMANCE MODE - Points Over Replacement (VORP).
// Instead of ranking a player against everyone at their position, we compare
// them to "replacement level" - the last player who'd be a starter in a
// league like ours. That baseline is tied to how many starting slots exist
// per position (not the size of the position pool), which is what avoids
// unfairly favoring positions with more total players.
//
// Assumption: 2 FLEX slots are split evenly across RB/WR/TE (2/3 of a slot
// each) since Sleeper doesn't track which position actually filled a given
// FLEX spot. This is a simplification - adjust STARTER_SLOTS/FLEX_SLOTS
// below if you want a different split.
// ============================================================
const STARTER_SLOTS = { QB: 1, RB: 2, WR: 2, TE: 1 };
const FLEX_SLOTS = 2;
const FLEX_ELIGIBLE = ["RB", "WR", "TE"];

const SEASON_TEAM_COUNTS = { 2025: 12, 2026: 10 };

function replacementRank(position, season) {
  const teams = SEASON_TEAM_COUNTS[season] || 12;
  const flexShare = FLEX_SLOTS / FLEX_ELIGIBLE.length;
  const slots = STARTER_SLOTS[position] + (FLEX_ELIGIBLE.indexOf(position) >= 0 ? flexShare : 0);
  return Math.round(teams * slots);
}

let performanceBaselineCache = {}; // "season-position" -> replacement points value

async function getReplacementPoints(position, season) {
  const key = season + "-" + position;
  if (performanceBaselineCache[key] != null) return performanceBaselineCache[key];

  let statsDump;
  try {
    statsDump = await fetchSeasonStats(season);
  } catch (e) {
    return null;
  }

  const pool = [];
  for (const pid in PLAYER_POSITIONS) {
    if (PLAYER_POSITIONS[pid] !== position) continue;
    const s = statsDump[pid];
    if (s && typeof s.pts_ppr === "number") pool.push(s.pts_ppr);
  }
  pool.sort(function (a, b) { return b - a; });

  const rank = replacementRank(position, season);
  const baseline = pool[rank - 1]; // 0-indexed
  performanceBaselineCache[key] = baseline != null ? baseline : null;
  return performanceBaselineCache[key];
}

// Returns the VORP score for a keeper's player in their kept season, or null
// if stats aren't available yet (e.g. season still in progress). Also writes
// into performanceScoreCache so render functions can read it synchronously.
async function getPerformanceScore(keeper) {
  const cacheKey = keeper.season + "-" + keeper.player;
  if (performanceScoreCache[cacheKey] !== undefined) return performanceScoreCache[cacheKey];

  const info = typeof PLAYER_DB !== "undefined" ? PLAYER_DB[keeper.player] : null;
  if (!info || !info.position) {
    performanceScoreCache[cacheKey] = null;
    return null;
  }

  let statsDump;
  try {
    statsDump = await fetchSeasonStats(keeper.season);
  } catch (e) {
    performanceScoreCache[cacheKey] = null;
    return null;
  }
  const playerPoints = statsDump[info.playerId] && statsDump[info.playerId].pts_ppr;
  if (playerPoints == null) {
    performanceScoreCache[cacheKey] = null;
    return null;
  }

  const replacementPoints = await getReplacementPoints(info.position, keeper.season);
  if (replacementPoints == null) {
    performanceScoreCache[cacheKey] = null;
    return null;
  }

  const score = Math.round((playerPoints - replacementPoints) * 10) / 10;
  performanceScoreCache[cacheKey] = score;
  return score;
}

// Reads whichever score is currently active (ADP value score or cached
// Performance/VORP score) for display and sorting - synchronous, so it must
// be called after the relevant async fetches have already completed.
function getDisplayScore(keeper) {
  if (scoreMode === "adp") return keeper.valueScore;
  const cacheKey = keeper.season + "-" + keeper.player;
  const cached = performanceScoreCache[cacheKey];
  return typeof cached === "number" ? cached : null;
}

// Computes a player's finish rank at their position for a given season - e.g.
// "WR3" - by building the full pool of every real NFL player at that position
// and ranking by full-season PPR points, regardless of who (if anyone) had
// them rostered in our league that year.
async function getPositionalRank(playerName, season) {
  const info = typeof PLAYER_DB !== "undefined" ? PLAYER_DB[playerName] : null;
  if (!info || !info.position) return null;

  let statsDump;
  try {
    statsDump = await fetchSeasonStats(season);
  } catch (e) {
    return null;
  }

  const targetPoints = statsDump[info.playerId] && statsDump[info.playerId].pts_ppr;
  if (targetPoints == null) return null;

  const pool = [];
  for (const pid in PLAYER_POSITIONS) {
    if (PLAYER_POSITIONS[pid] !== info.position) continue;
    const s = statsDump[pid];
    if (s && typeof s.pts_ppr === "number") pool.push(s.pts_ppr);
  }
  pool.sort(function (a, b) { return b - a; });
  const rank = pool.indexOf(targetPoints) + 1;
  return rank > 0 ? { rank: rank, position: info.position, points: targetPoints } : null;
}

function getTeamTotals() {
  const totals = {};
  KEEPER_DATA.forEach(function (k) {
    if (!totals[k.owner]) {
      totals[k.owner] = { owner: k.owner, totalValue: 0, keepers: [] };
    }
    const score = getDisplayScore(k);
    totals[k.owner].totalValue += (score == null ? 0 : score);
    totals[k.owner].keepers.push(k);
  });
  return Object.values(totals)
    .map(function (t) {
      t.keepers.sort(function (a, b) { return a.season - b.season; });
      return t;
    })
    .sort(function (a, b) { return b.totalValue - a.totalValue; });
}

function formatValueScore(v) {
  const sign = v > 0 ? "+" : "";
  return sign + v;
}

// Option A ramp: neon acid green (positive) / hot red (negative), gray at 0.
// Only background is interpolated - text color is picked for contrast against
// whatever background lands, so it never blends into a mid-tone green/red.
const GREEN_STOPS = [
  { v: 0, bg: "#2a2f36" },
  { v: 10, bg: "#0e2a18" },
  { v: 30, bg: "#124723" },
  { v: 60, bg: "#1c7a3f" },
  { v: 100, bg: "#29cc5c" }
];
const RED_STOPS = [
  { v: 0, bg: "#2a2f36" },
  { v: 10, bg: "#3a0e0e" },
  { v: 20, bg: "#7a1414" },
  { v: 53, bg: "#a3251f" },
  { v: 100, bg: "#c9302a" }
];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(rgb) {
  return "#" + rgb.map(function (c) {
    return Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, "0");
  }).join("");
}
function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  return rgbToHex(a.map(function (c, i) { return c + (b[i] - c) * t; }));
}
function textForBg(hex) {
  const [r, g, b] = hexToRgb(hex);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150 ? "#08110c" : "#ffffff";
}

function scoreStyle(value) {
  const stops = value >= 0 ? GREEN_STOPS : RED_STOPS;
  const mag = Math.min(Math.abs(value), 100);
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (mag >= stops[i].v && mag <= stops[i + 1].v) {
      lo = stops[i]; hi = stops[i + 1]; break;
    }
  }
  const range = hi.v - lo.v;
  const t = range === 0 ? 0 : (mag - lo.v) / range;
  const bg = lerpColor(lo.bg, hi.bg, t);
  return { bg: bg, text: textForBg(bg) };
}

function scoreBoxHtml(value, big) {
  const s = scoreStyle(value);
  const sizeClass = big ? "score-circle-big" : "score-circle-small";
  return '<span class="score-circle ' + sizeClass + '" style="background:' + s.bg + ';color:' + s.text + ';">' +
    formatValueScore(value) + '</span>';
}

function initials(name) {
  return name.split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase();
}

function avatarHtml(owner, size) {
  return '<span class="avatar-slot" data-owner="' + owner + '" data-size="' + size + '"></span>';
}

function attachAvatarFallbacks(root) {
  root.querySelectorAll(".avatar-slot").forEach(function (slot) {
    const owner = slot.getAttribute("data-owner");
    const size = slot.getAttribute("data-size");
    const info = OWNER_AVATARS[owner];
    const cls = size === "large" ? "spotlight-avatar" : "team-avatar";
    const fallbackCls = size === "large" ? "spotlight-avatar-fallback" : "team-avatar-fallback";

    if (!info) {
      const div = document.createElement("div");
      div.className = fallbackCls;
      div.textContent = initials(owner);
      slot.replaceWith(div);
      return;
    }

    const img = document.createElement("img");
    img.className = cls;
    img.alt = "";
    // attach the fallback handler BEFORE setting src, so a fast/immediate
    // failure can't fire the error event before anything is listening for it
    img.addEventListener("error", function () {
      const div = document.createElement("div");
      div.className = fallbackCls;
      div.textContent = initials(owner);
      img.replaceWith(div);
    });
    img.src = info.type === "url" ? info.value : "https://sleepercdn.com/avatars/thumbs/" + info.value;
    slot.replaceWith(img);
  });
}

function playerVisualHtml(playerName, size) {
  return '<span class="player-visual-slot" data-player="' + playerName + '" data-size="' + size + '"></span>';
}

function attachPlayerVisualFallbacks(root) {
  root.querySelectorAll(".player-visual-slot").forEach(function (slot) {
    const name = slot.getAttribute("data-player");
    const size = slot.getAttribute("data-size");
    const info = typeof PLAYER_DB !== "undefined" ? PLAYER_DB[name] : null;
    const headshotCls = "player-headshot player-headshot-" + size;
    const fallbackCls = "player-headshot-fallback player-headshot-fallback-" + size;

    if (!info) {
      const div = document.createElement("div");
      div.className = fallbackCls;
      div.textContent = initials(name);
      slot.replaceWith(div);
      return;
    }

    const wrap = document.createElement("div");
    wrap.className = "player-visual-wrap player-visual-wrap-" + size;

    const img = document.createElement("img");
    img.className = headshotCls;
    img.alt = "";
    img.addEventListener("error", function () {
      const div = document.createElement("div");
      div.className = fallbackCls;
      div.textContent = initials(name);
      img.replaceWith(div);
    });
    img.src = playerHeadshotUrl(info.playerId);
    wrap.appendChild(img);

    const logoUrl = teamLogoUrl(info.team);
    if (logoUrl) {
      const logo = document.createElement("img");
      logo.className = "team-logo-badge team-logo-badge-" + size;
      logo.alt = "";
      logo.addEventListener("error", function () { logo.style.display = "none"; });
      logo.src = logoUrl;
      wrap.appendChild(logo);
    }

    slot.replaceWith(wrap);
  });
}

function getFiltered() {
  return KEEPER_DATA.filter(function (k) {
    return activeSeasonFilter === "all" || k.season === activeSeasonFilter;
  }).sort(function (a, b) {
    const sa = getDisplayScore(a), sb = getDisplayScore(b);
    if (sa == null && sb == null) return 0;
    if (sa == null) return 1;
    if (sb == null) return -1;
    return sb - sa;
  });
}

function renderPodium() {
  const podium = document.getElementById("podium");
  const podiumTitle = document.getElementById("podium-title");
  const trophies = ["\uD83C\uDFC6", "\uD83C\uDFC6", "\uD83C\uDFC6"];
  const order = [1, 0, 2]; // display order: 2nd, 1st, 3rd

  if (viewMode === "total") {
    podiumTitle.textContent = "Top total value scores";
    const top3 = getTeamTotals().slice(0, 3);
    podium.innerHTML = "";
    order.forEach(function (idx) {
      const team = top3[idx];
      if (!team) return;
      const rank = idx + 1;
      const spot = document.createElement("div");
      spot.className = "podium-spot rank-" + rank;
      spot.innerHTML =
        '<div class="podium-trophy">' + trophies[idx] + '</div>' +
        '<div class="podium-medal">' + rank + '</div>' +
        '<div class="p-owner">' + team.owner + '</div>' +
        '<div class="p-player">' + team.keepers.length + ' keeper' + (team.keepers.length === 1 ? "" : "s") + '</div>' +
        '<div class="p-score">' + scoreBoxHtml(team.totalValue, true) + '</div>' +
        '<div class="podium-base rank-' + rank + '-base"></div>';
      spot.addEventListener("click", function () { openTeamSpotlight(team); });
      podium.appendChild(spot);
    });
    attachAvatarFallbacks(podium);
    return;
  }

  podiumTitle.textContent = scoreMode === "performance" ? "Top performance scores" : "Top value scores";
  const top3 = getFiltered().slice(0, 3);
  podium.innerHTML = "";
  order.forEach(function (idx) {
    const keeper = top3[idx];
    if (!keeper) return;
    const rank = idx + 1;
    const score = getDisplayScore(keeper);
    const placement = (teamPlacementsForRender[keeper.season] || {})[keeper.owner] || {};
    const spot = document.createElement("div");
    spot.className = "podium-spot rank-" + rank;
    spot.innerHTML =
      '<div class="podium-trophy">' + trophies[idx] + '</div>' +
      '<div class="podium-medal">' + rank + '</div>' +
      '<div class="p-owner">' + keeper.owner + ' ' + placementBadgeHtml(placement.finalRank, placement.totalTeams) + '</div>' +
      '<div class="p-player-visual">' + playerVisualHtml(keeper.player, "small") + '</div>' +
      '<div class="p-player">' + keeper.player + '</div>' +
      '<div class="p-score">' + (score == null ? '<span class="empty-note">-</span>' : scoreBoxHtml(score, true)) + '</div>' +
      '<div class="podium-base rank-' + rank + '-base"></div>';
    spot.addEventListener("click", function () { openSpotlight(keeper); });
    podium.appendChild(spot);
  });
  attachAvatarFallbacks(podium);
  attachPlayerVisualFallbacks(podium);
}

function renderKeeperGrid() {
  const grid = document.getElementById("keeper-grid");
  grid.innerHTML = "";

  if (viewMode === "total") {
    const teams = getTeamTotals();
    if (teams.length === 0) {
      grid.innerHTML = '<p class="empty-note">No keepers recorded yet.</p>';
      return;
    }
    teams.forEach(function (team) {
      const card = document.createElement("div");
      card.className = "keeper-card";
      const yearsList = team.keepers.map(function (k) { return k.season + " " + k.player; }).join("<br>");
      card.innerHTML =
        '<div class="card-top">' + avatarHtml(team.owner, "small") +
          '<div><div class="eyebrow">TOTAL ACROSS ' + team.keepers.length + ' YEAR' + (team.keepers.length === 1 ? "" : "S") + '</div>' +
          '<div class="team-name">' + team.owner + '</div></div>' +
        '</div>' +
        '<div class="player-name" style="font-size:15px;font-weight:600;line-height:1.5;">' + yearsList + '</div>' +
        '<div class="value-score">' + scoreBoxHtml(team.totalValue, true) + '</div>';
      card.addEventListener("click", function () { openTeamSpotlight(team); });
      grid.appendChild(card);
    });
    attachAvatarFallbacks(grid);
    return;
  }

  const filtered = getFiltered();

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty-note">No keepers recorded for this view yet.</p>';
    return;
  }

  filtered.forEach(function (keeper) {
    const card = document.createElement("div");
    card.className = "keeper-card";
    const score = getDisplayScore(keeper);
    const placement = (teamPlacementsForRender[keeper.season] || {})[keeper.owner] || {};
    card.innerHTML =
      '<div class="card-top">' + avatarHtml(keeper.owner, "small") +
        '<div><div class="eyebrow">' + keeper.season + ' KEEPER</div>' +
        '<div class="team-name">' + keeper.owner + ' ' + placementBadgeHtml(placement.finalRank, placement.totalTeams) + '</div></div>' +
      '</div>' +
      '<div class="player-name-row">' + playerVisualHtml(keeper.player, "small") +
        '<div class="player-name">' + keeper.player + '</div></div>' +
      '<div class="stat-row">' +
        '<div class="stat-chip"><div class="label">Pick</div><div class="value">' + keeper.pick + '</div></div>' +
        '<div class="stat-chip"><div class="label">ADP</div><div class="value">' + keeper.adp + '</div></div>' +
      '</div>' +
      '<div class="value-score">' + (score == null ? '<span class="empty-note">Stats not available yet</span>' : scoreBoxHtml(score, true)) + '</div>';
    card.addEventListener("click", function () { openSpotlight(keeper); });
    grid.appendChild(card);
  });
  attachAvatarFallbacks(grid);
  attachPlayerVisualFallbacks(grid);
}

function openSpotlight(keeper) {
  rankView = "kept";
  renderSpotlight(keeper);
  document.getElementById("spotlight-overlay").classList.remove("hidden");
}

async function renderSpotlight(keeper) {
  const targetSeason = rankView === "kept" ? keeper.season : keeper.season - 1;
  const placement = (teamPlacementsForRender[keeper.season] || {})[keeper.owner] || {};
  const initialScore = scoreMode === "adp" ? keeper.valueScore : getDisplayScore(keeper);
  const valueBoxHtml = initialScore == null
    ? '<span id="value-box-loading" style="font-size:12px;color:var(--text-mute);">loading...</span>'
    : scoreBoxHtml(initialScore, false);

  document.getElementById("spotlight-body").innerHTML =
    '<div class="spotlight-top">' + avatarHtml(keeper.owner, "large") +
      '<div><div class="eyebrow">' + keeper.season + ' KEEPER</div>' +
      '<div class="team-name">' + keeper.owner + ' ' + placementBadgeHtml(placement.finalRank, placement.totalTeams) + '</div></div>' +
    '</div>' +
    '<div class="player-name-row">' + playerVisualHtml(keeper.player, "large") +
      '<div class="player-name">' + keeper.player + '</div></div>' +
    '<div class="spotlight-stats">' +
      '<div class="stat-box"><div class="label">Pick</div><div class="val">' + keeper.pick + '</div></div>' +
      '<div class="stat-box"><div class="label">ADP</div><div class="val">' + keeper.adp + '</div></div>' +
      '<div class="stat-box"><div class="label">' + (scoreMode === "performance" ? "VORP" : "Value") + '</div><div class="val" id="value-box-val">' + valueBoxHtml + '</div></div>' +
    '</div>' +
    '<div class="toggle-row">' +
      '<button class="toggle-pill ' + (rankView === "kept" ? "active" : "") + '" data-view="kept">Kept-year stats</button>' +
      '<button class="toggle-pill ' + (rankView === "prior" ? "active" : "") + '" data-view="prior">Year before stats</button>' +
    '</div>' +
    '<div class="rank-line" id="rank-line">Loading ' + targetSeason + ' stats...</div>';

  attachAvatarFallbacks(document.getElementById("spotlight-body"));
  attachPlayerVisualFallbacks(document.getElementById("spotlight-body"));

  const pills = document.querySelectorAll(".toggle-pill");
  for (let i = 0; i < pills.length; i++) {
    pills[i].addEventListener("click", function () {
      rankView = this.dataset.view;
      renderSpotlight(keeper);
    });
  }

  if (scoreMode === "performance" && initialScore == null) {
    getPerformanceScore(keeper).then(function (score) {
      const valBox = document.getElementById("value-box-val");
      if (!valBox) return;
      valBox.innerHTML = score == null ? "N/A" : scoreBoxHtml(score, false);
    });
  }

  const rankLine = document.getElementById("rank-line");
  try {
    const result = await getPositionalRank(keeper.player, targetSeason);
    // guard against the spotlight having moved on to a different keeper/toggle
    // while this fetch was in flight
    if (!document.getElementById("rank-line")) return;
    if (result) {
      rankLine.textContent = targetSeason + ' season: finished ' + result.position + result.rank +
        ' (' + result.points.toFixed(1) + ' PPR pts)';
    } else {
      rankLine.textContent = 'No ' + targetSeason + ' season stats available for this player.';
    }
  } catch (e) {
    if (document.getElementById("rank-line")) {
      rankLine.textContent = "Couldn't load season stats right now.";
    }
  }
}

function openTeamSpotlight(team) {
  document.getElementById("spotlight-body").innerHTML =
    '<div class="spotlight-top">' + avatarHtml(team.owner, "large") +
      '<div><div class="eyebrow">TOTAL ACROSS ' + team.keepers.length + ' YEAR' + (team.keepers.length === 1 ? "" : "S") + '</div>' +
      '<div class="team-name">' + team.owner + '</div></div>' +
    '</div>' +
    '<div class="player-name">' + scoreBoxHtml(team.totalValue, true) + '</div>' +
    team.keepers.map(function (k) {
      return '<div class="stat-row" style="margin-bottom:8px; align-items:center;">' +
        '<div class="stat-chip" style="text-align:left;flex:2; display:flex; align-items:center; gap:8px;">' +
          playerVisualHtml(k.player, "tiny") +
          '<div><div class="label">' + k.season + '</div><div class="value" style="font-size:15px;">' + k.player + '</div></div>' +
        '</div>' +
        '<div class="stat-chip">' + scoreBoxHtml(k.valueScore, false) + '</div>' +
      '</div>';
    }).join("");

  attachAvatarFallbacks(document.getElementById("spotlight-body"));
  attachPlayerVisualFallbacks(document.getElementById("spotlight-body"));
  document.getElementById("spotlight-overlay").classList.remove("hidden");
}

function closeSpotlight() {
  document.getElementById("spotlight-overlay").classList.add("hidden");
}

async function renderAll() {
  const grid = document.getElementById("keeper-grid");
  grid.innerHTML = '<p class="empty-note">Loading...</p>';

  // Trophies always show regardless of ADP/Performance mode - fetch placements
  // for every season currently in view.
  const seasonsInView = activeSeasonFilter === "all"
    ? Array.from(new Set(KEEPER_DATA.map(function (k) { return k.season; })))
    : [activeSeasonFilter];
  const placementResults = await Promise.all(seasonsInView.map(function (s) {
    return getTeamPlacements(s).then(function (p) { return [s, p]; });
  }));
  teamPlacementsForRender = {};
  placementResults.forEach(function (pair) { teamPlacementsForRender[pair[0]] = pair[1]; });

  // In Performance mode, pre-fetch every visible keeper's VORP score so
  // sorting/podium/cards can all read from cache synchronously.
  if (scoreMode === "performance" && viewMode !== "total") {
    const relevant = activeSeasonFilter === "all" ? KEEPER_DATA : KEEPER_DATA.filter(function (k) { return k.season === activeSeasonFilter; });
    await Promise.all(relevant.map(getPerformanceScore));
  } else if (scoreMode === "performance" && viewMode === "total") {
    await Promise.all(KEEPER_DATA.map(getPerformanceScore));
  }

  renderPodium();
  renderKeeperGrid();
}

document.addEventListener("DOMContentLoaded", function () {
  const seasonBtns = document.querySelectorAll("[data-season]");
  const modeBtns = document.querySelectorAll("[data-mode]");
  const viewModeBar = document.getElementById("view-mode-bar");

  function updateModeBarVisibility() {
    if (activeSeasonFilter === "all") {
      viewModeBar.style.display = "flex";
    } else {
      viewModeBar.style.display = "none";
      viewMode = "individual";
      modeBtns.forEach(function (b) { b.classList.toggle("active", b.dataset.mode === "individual"); });
    }
  }

  seasonBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      seasonBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      const val = btn.dataset.season;
      activeSeasonFilter = val === "all" ? "all" : Number(val);
      updateModeBarVisibility();
      renderAll();
    });
  });

  modeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      modeBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      viewMode = btn.dataset.mode;
      renderAll();
    });
  });

  document.querySelectorAll("[data-score-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-score-mode]").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      scoreMode = btn.dataset.scoreMode;
      renderAll();
    });
  });

  updateModeBarVisibility();
  renderAll();
  document.getElementById("close-spotlight").addEventListener("click", closeSpotlight);
  document.getElementById("spotlight-overlay").addEventListener("click", function (e) {
    if (e.target.id === "spotlight-overlay") closeSpotlight();
  });
});
