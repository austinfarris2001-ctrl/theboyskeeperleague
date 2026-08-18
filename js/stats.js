// ============================================================
// TEAM STATS - Sleeper seasons (2023+) fetch live on every page load.
// ESPN seasons (2020-2022) come from the static data/espn-history.js file
// since those years are frozen history. Trophies reflect TRUE final
// standings (actual playoff results), not just regular-season record.
// ============================================================

let selectedSeasons = new Set();
let viewMode = "individual"; // "individual" or "cumulative"
let sortKey = "pointsFor";
let seasonCache = {}; // season -> computed stats object

function initials(name) {
  return name.split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase();
}

function avatarHtml(owner) {
  return '<span class="avatar-slot" data-owner="' + owner + '"></span>';
}

function attachAvatarFallbacks(root) {
  root.querySelectorAll(".avatar-slot").forEach(function (slot) {
    const owner = slot.getAttribute("data-owner");
    const info = OWNER_AVATARS[owner];
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

function placementBadge(finalRank, totalTeams) {
  if (!finalRank || !totalTeams) return "";
  if (finalRank === 1) return '<span class="placement-badge" title="Champion">\uD83E\uDD47</span>';
  if (finalRank === 2) return '<span class="placement-badge" title="Runner-up">\uD83E\uDD48</span>';
  if (finalRank === 3) return '<span class="placement-badge" title="Third place">\uD83E\uDD49</span>';
  if (finalRank === totalTeams) return '<span class="placement-badge" title="Last place">\uD83D\uDCA9</span>';
  return "";
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

// Parses winners_bracket/losers_bracket into a roster_id -> final rank map.
// Winners bracket "p" field marks placement games (p:1 = championship, p:3 = 3rd place, etc).
// Losers bracket works the same way but for the bottom of the standings (Sleeper's "Toilet Bowl") -
// the match with the highest p value decides last place, and its LOSER is dead last
// (in a toilet bowl, losing each round is how you advance toward "winning" last place).
function parseBracketPlacements(winnersBracket, losersBracket, totalTeams) {
  const placements = {}; // roster_id -> rank

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

async function computeSeasonStats(season) {
  if (ESPN_SEASONS.includes(season)) {
    const rawTeams = ESPN_HISTORY[season] || [];
    const totalTeams = rawTeams.length;
    const teams = rawTeams.map(function (t) {
      const games = t.wins + t.losses + t.ties;
      return {
        owner: t.owner,
        teamName: t.teamName,
        wins: t.wins, losses: t.losses, ties: t.ties,
        pointsFor: t.pointsFor,
        pointsAgainst: t.pointsAgainst,
        avgPerWeek: games > 0 ? t.pointsFor / games : 0,
        finalRank: t.finalRank,
        totalTeams: totalTeams
      };
    });
    return { season: season, teams: teams, bestPerformance: null, closestMatchup: null };
  }

  const leagueId = LEAGUE_IDS[season];
  const [leagueInfo, rosters, users, winnersBracket, losersBracket] = await Promise.all([
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/rosters"),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/users"),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/winners_bracket").catch(function () { return []; }),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/losers_bracket").catch(function () { return []; })
  ]);

  const userIdToOwner = {};
  users.forEach(function (u) {
    userIdToOwner[u.user_id] = ownerNameFromUsername(u.display_name);
  });
  const overridesForLeague = ROSTER_OWNER_OVERRIDES[leagueId] || {};
  const rosterIdToOwner = {};
  rosters.forEach(function (r) {
    rosterIdToOwner[r.roster_id] = userIdToOwner[r.owner_id] || overridesForLeague[r.roster_id] || "Unknown";
  });

  const totalTeams = rosters.length;
  const placements = parseBracketPlacements(winnersBracket, losersBracket, totalTeams);

  const teams = rosters.map(function (r) {
    const s = r.settings || {};
    const fptsTotal = (s.fpts || 0) + (s.fpts_decimal || 0) / 100;
    const fptsAgainst = (s.fpts_against || 0) + (s.fpts_against_decimal || 0) / 100;
    const wins = s.wins || 0, losses = s.losses || 0, ties = s.ties || 0;
    const games = wins + losses + ties;
    const teamName = (r.metadata && r.metadata.team_name) || (rosterIdToOwner[r.roster_id] || "Unknown");
    return {
      owner: rosterIdToOwner[r.roster_id] || "Unknown",
      teamName: teamName,
      rosterId: r.roster_id,
      wins: wins, losses: losses, ties: ties,
      pointsFor: fptsTotal,
      pointsAgainst: fptsAgainst,
      avgPerWeek: games > 0 ? fptsTotal / games : 0,
      finalRank: placements[r.roster_id] || null,
      totalTeams: totalTeams
    };
  });

  // Highlights (best single week, closest matchup) - only meaningful for completed regular seasons
  const playoffStart = (leagueInfo.settings && leagueInfo.settings.playoff_week_start) || 15;
  const weeks = [];
  for (let w = 1; w < playoffStart; w++) weeks.push(w);
  const weekResults = await Promise.all(weeks.map(function (w) {
    return fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/matchups/" + w)
      .then(function (data) { return { week: w, data: data }; })
      .catch(function () { return { week: w, data: [] }; });
  }));

  let bestPerformance = null;
  let closestMatchup = null;
  weekResults.forEach(function (wr) {
    if (!wr.data || wr.data.length === 0) return;
    wr.data.forEach(function (entry) {
      if (typeof entry.points !== "number") return;
      if (!bestPerformance || entry.points > bestPerformance.points) {
        bestPerformance = { owner: rosterIdToOwner[entry.roster_id] || "Unknown", points: entry.points, week: wr.week };
      }
    });
    const byMatchup = {};
    wr.data.forEach(function (entry) {
      if (entry.matchup_id == null) return;
      if (!byMatchup[entry.matchup_id]) byMatchup[entry.matchup_id] = [];
      byMatchup[entry.matchup_id].push(entry);
    });
    Object.values(byMatchup).forEach(function (pair) {
      if (pair.length !== 2) return;
      const margin = Math.abs(pair[0].points - pair[1].points);
      if (!closestMatchup || margin < closestMatchup.margin) {
        closestMatchup = {
          week: wr.week, margin: margin,
          teamA: rosterIdToOwner[pair[0].roster_id] || "Unknown", scoreA: pair[0].points,
          teamB: rosterIdToOwner[pair[1].roster_id] || "Unknown", scoreB: pair[1].points
        };
      }
    });
  });

  return { season: season, teams: teams, bestPerformance: bestPerformance, closestMatchup: closestMatchup };
}

async function getSeasonStats(season) {
  if (!seasonCache[season]) {
    seasonCache[season] = await computeSeasonStats(season);
  }
  return seasonCache[season];
}

function buildIndividualRows(allStats) {
  const rows = [];
  allStats.forEach(function (stats) {
    stats.teams.forEach(function (t) {
      rows.push({
        season: stats.season,
        owner: t.owner,
        teamName: t.teamName,
        wins: t.wins, losses: t.losses, ties: t.ties,
        pointsFor: t.pointsFor, pointsAgainst: t.pointsAgainst,
        avgPerWeek: t.avgPerWeek,
        finalRank: t.finalRank, totalTeams: t.totalTeams
      });
    });
  });
  return rows;
}

function buildCumulativeRows(allStats) {
  const byOwner = {};
  allStats.forEach(function (stats) {
    stats.teams.forEach(function (t) {
      if (!byOwner[t.owner]) {
        byOwner[t.owner] = {
          owner: t.owner, seasons: 0, wins: 0, losses: 0, ties: 0,
          pointsFor: 0, pointsAgainst: 0, championships: 0, runnerUps: 0, thirdPlaces: 0, lastPlaces: 0
        };
      }
      const agg = byOwner[t.owner];
      agg.seasons += 1;
      agg.wins += t.wins; agg.losses += t.losses; agg.ties += t.ties;
      agg.pointsFor += t.pointsFor; agg.pointsAgainst += t.pointsAgainst;
      if (t.finalRank === 1) agg.championships += 1;
      if (t.finalRank === 2) agg.runnerUps += 1;
      if (t.finalRank === 3) agg.thirdPlaces += 1;
      if (t.finalRank && t.totalTeams && t.finalRank === t.totalTeams) agg.lastPlaces += 1;
    });
  });
  return Object.values(byOwner).map(function (agg) {
    return Object.assign(agg, {
      avgPointsForPerSeason: agg.seasons > 0 ? agg.pointsFor / agg.seasons : 0,
      avgPointsAgainstPerSeason: agg.seasons > 0 ? agg.pointsAgainst / agg.seasons : 0
    });
  });
}

const SORT_OPTIONS_INDIVIDUAL = [
  { key: "pointsFor", label: "Points for" },
  { key: "pointsAgainst", label: "Points against" },
  { key: "wins", label: "Wins" },
  { key: "avgPerWeek", label: "Avg / week" },
  { key: "finalRank", label: "Final standing" }
];
const SORT_OPTIONS_CUMULATIVE = [
  { key: "pointsFor", label: "Total points for" },
  { key: "avgPointsForPerSeason", label: "Avg points for / season" },
  { key: "pointsAgainst", label: "Total points against" },
  { key: "wins", label: "Total wins" },
  { key: "seasons", label: "Seasons played" },
  { key: "championships", label: "Championships" }
];

function sortRows(rows) {
  const key = sortKey;
  const ascending = key === "pointsAgainst" || key === "avgPointsAgainstPerSeason" || key === "finalRank";
  return rows.slice().sort(function (a, b) {
    const diff = (a[key] || 0) - (b[key] || 0);
    return ascending ? diff : -diff;
  });
}

function renderSortOptions() {
  const select = document.getElementById("sort-select");
  const options = viewMode === "cumulative" ? SORT_OPTIONS_CUMULATIVE : SORT_OPTIONS_INDIVIDUAL;
  const valid = options.some(function (o) { return o.key === sortKey; });
  if (!valid) sortKey = options[0].key;
  select.innerHTML = options.map(function (o) {
    return '<option value="' + o.key + '"' + (o.key === sortKey ? " selected" : "") + '>' + o.label + '</option>';
  }).join("");
}

function renderIndividualGrid(rows) {
  const grid = document.getElementById("team-grid");
  grid.innerHTML = "";
  sortRows(rows).forEach(function (r) {
    const card = document.createElement("div");
    card.className = "keeper-card";
    card.style.cursor = "default";
    card.innerHTML =
      '<div class="card-top">' + avatarHtml(r.owner) +
        '<div><div class="eyebrow">' + r.season + ' \u00b7 ' + r.wins + '-' + r.losses + (r.ties ? '-' + r.ties : '') + '</div>' +
        '<div class="team-name">' + r.owner + '</div>' +
        '<div class="sub-team-name">' + r.teamName + ' ' + placementBadge(r.finalRank, r.totalTeams) + '</div></div>' +
      '</div>' +
      '<div class="stat-row">' +
        '<div class="stat-chip"><div class="label">Points for</div><div class="value">' + r.pointsFor.toFixed(1) + '</div></div>' +
        '<div class="stat-chip"><div class="label">Points against</div><div class="value">' + r.pointsAgainst.toFixed(1) + '</div></div>' +
      '</div>' +
      '<div class="stat-row" style="margin-top:8px;">' +
        '<div class="stat-chip"><div class="label">Avg / week</div><div class="value">' + r.avgPerWeek.toFixed(1) + '</div></div>' +
      '</div>';
    grid.appendChild(card);
  });
  attachAvatarFallbacks(grid);
}

function renderCumulativeGrid(rows) {
  const grid = document.getElementById("team-grid");
  grid.innerHTML = "";
  sortRows(rows).forEach(function (r) {
    const trophyParts = [];
    if (r.championships > 0) trophyParts.push('\uD83E\uDD47 x' + r.championships);
    if (r.runnerUps > 0) trophyParts.push('\uD83E\uDD48 x' + r.runnerUps);
    if (r.thirdPlaces > 0) trophyParts.push('\uD83E\uDD49 x' + r.thirdPlaces);
    if (r.lastPlaces > 0) trophyParts.push('\uD83D\uDCA9 x' + r.lastPlaces);
    const trophyLine = trophyParts.join('  ');
    const card = document.createElement("div");
    card.className = "keeper-card";
    card.style.cursor = "default";
    card.innerHTML =
      '<div class="card-top">' + avatarHtml(r.owner) +
        '<div><div class="eyebrow">' + r.seasons + ' SEASON' + (r.seasons === 1 ? '' : 'S') + '</div>' +
        '<div class="team-name">' + r.owner + '</div>' +
        (trophyLine ? '<div class="sub-team-name">' + trophyLine + '</div>' : '') + '</div>' +
      '</div>' +
      '<div class="stat-row">' +
        '<div class="stat-chip"><div class="label">Total PF</div><div class="value">' + r.pointsFor.toFixed(0) + '</div></div>' +
        '<div class="stat-chip"><div class="label">Avg PF/season</div><div class="value">' + r.avgPointsForPerSeason.toFixed(0) + '</div></div>' +
      '</div>' +
      '<div class="stat-row" style="margin-top:8px;">' +
        '<div class="stat-chip"><div class="label">Record</div><div class="value" style="font-size:15px;">' + r.wins + '-' + r.losses + (r.ties ? '-' + r.ties : '') + '</div></div>' +
      '</div>';
    grid.appendChild(card);
  });
  attachAvatarFallbacks(grid);
}

function renderHighlights(allStats) {
  const section = document.getElementById("highlights-section");
  const wrap = document.getElementById("highlights");
  wrap.innerHTML = "";

  if (allStats.length !== 1 || (!allStats[0].bestPerformance && !allStats[0].closestMatchup)) {
    section.style.display = "none";
    return;
  }
  section.style.display = "block";
  const stats = allStats[0];

  if (stats.bestPerformance) {
    const card = document.createElement("div");
    card.className = "keeper-card";
    card.style.cursor = "default";
    card.innerHTML =
      '<div class="card-top">' + avatarHtml(stats.bestPerformance.owner) +
        '<div><div class="eyebrow">BEST PERFORMANCE - WEEK ' + stats.bestPerformance.week + '</div>' +
        '<div class="team-name">' + stats.bestPerformance.owner + '</div></div>' +
      '</div>' +
      '<div class="stat-row"><div class="stat-chip"><div class="label">Points</div><div class="value">' + stats.bestPerformance.points.toFixed(1) + '</div></div></div>';
    wrap.appendChild(card);
  }
  if (stats.closestMatchup) {
    const cm = stats.closestMatchup;
    const card = document.createElement("div");
    card.className = "keeper-card";
    card.style.cursor = "default";
    card.innerHTML =
      '<div class="eyebrow">CLOSEST MATCHUP - WEEK ' + cm.week + '</div>' +
      '<div class="player-name" style="font-size:16px;">' + cm.teamA + ' ' + cm.scoreA.toFixed(1) + ' vs ' + cm.teamB + ' ' + cm.scoreB.toFixed(1) + '</div>' +
      '<div class="stat-row"><div class="stat-chip"><div class="label">Margin</div><div class="value">' + cm.margin.toFixed(1) + '</div></div></div>';
    wrap.appendChild(card);
  }
  attachAvatarFallbacks(wrap);
}

async function renderAll() {
  const loadingNote = document.getElementById("loading-note");
  const grid = document.getElementById("team-grid");
  const modeBar = document.getElementById("view-mode-bar");
  const sortBar = document.getElementById("sort-bar");

  if (selectedSeasons.size === 0) {
    grid.innerHTML = '<p class="empty-note">Select at least one season above.</p>';
    document.getElementById("highlights-section").style.display = "none";
    modeBar.style.display = "none";
    sortBar.style.display = "none";
    return;
  }

  modeBar.style.display = "flex";
  sortBar.style.display = "flex";
  loadingNote.style.display = "block";
  loadingNote.textContent = "Loading live data from Sleeper...";
  grid.innerHTML = "";

  try {
    const seasons = Array.from(selectedSeasons).sort();
    const allStats = await Promise.all(seasons.map(getSeasonStats));
    loadingNote.style.display = "none";

    renderHighlights(allStats);
    renderSortOptions();

    if (viewMode === "cumulative") {
      renderCumulativeGrid(buildCumulativeRows(allStats));
    } else {
      renderIndividualGrid(buildIndividualRows(allStats));
    }
  } catch (err) {
    loadingNote.textContent = "Couldn't load data right now. Try refreshing.";
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const seasonBar = document.getElementById("season-bar");
  const seasons = ESPN_SEASONS.concat(Object.keys(LEAGUE_IDS).map(Number)).sort(function (a, b) { return a - b; });

  seasons.forEach(function (season) {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.season = season;
    btn.textContent = season;
    btn.addEventListener("click", function () {
      if (selectedSeasons.has(season)) {
        selectedSeasons.delete(season);
        btn.classList.remove("active");
      } else {
        selectedSeasons.add(season);
        btn.classList.add("active");
      }
      renderAll();
    });
    seasonBar.appendChild(btn);
  });

  document.getElementById("select-all-btn").addEventListener("click", function () {
    document.querySelectorAll("#season-bar .filter-btn").forEach(function (btn) {
      const season = Number(btn.dataset.season);
      selectedSeasons.add(season);
      btn.classList.add("active");
    });
    renderAll();
  });

  document.getElementById("deselect-all-btn").addEventListener("click", function () {
    document.querySelectorAll("#season-bar .filter-btn").forEach(function (btn) {
      btn.classList.remove("active");
    });
    selectedSeasons.clear();
    renderAll();
  });

  document.querySelectorAll("#view-mode-bar [data-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#view-mode-bar [data-mode]").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      viewMode = btn.dataset.mode;
      renderAll();
    });
  });

  document.getElementById("sort-select").addEventListener("change", function (e) {
    sortKey = e.target.value;
    renderAll();
  });

  const defaultBtn = seasonBar.querySelector('[data-season="2025"]');
  if (defaultBtn) defaultBtn.click();
});
