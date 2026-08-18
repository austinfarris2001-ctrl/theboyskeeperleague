// ============================================================
// TEAM STATS - fetches live from the Sleeper API on every page load.
// Unlike the keeper page, nothing here is hardcoded - it always reflects
// whatever's currently on Sleeper, including in-progress seasons.
// ============================================================

let currentSeason = null;
let seasonCache = {}; // season -> computed stats object, so re-clicking a tab doesn't re-fetch

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

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

async function computeSeasonStats(season) {
  const leagueId = LEAGUE_IDS[season];
  const [leagueInfo, rosters, users] = await Promise.all([
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/rosters"),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/users")
  ]);

  // Map roster_id -> owner display name
  const userIdToOwner = {};
  users.forEach(function (u) {
    userIdToOwner[u.user_id] = ownerNameFromUsername(u.display_name);
  });
  const rosterIdToOwner = {};
  rosters.forEach(function (r) {
    rosterIdToOwner[r.roster_id] = userIdToOwner[r.owner_id] || "Unknown";
  });

  // Season totals come straight off each roster's settings - no per-week math needed
  const teams = rosters.map(function (r) {
    const s = r.settings || {};
    const fptsTotal = (s.fpts || 0) + (s.fpts_decimal || 0) / 100;
    const fptsAgainst = (s.fpts_against || 0) + (s.fpts_against_decimal || 0) / 100;
    const wins = s.wins || 0, losses = s.losses || 0, ties = s.ties || 0;
    const games = wins + losses + ties;
    return {
      owner: rosterIdToOwner[r.roster_id] || "Unknown",
      rosterId: r.roster_id,
      wins: wins, losses: losses, ties: ties,
      pointsFor: fptsTotal,
      pointsAgainst: fptsAgainst,
      avgPerWeek: games > 0 ? fptsTotal / games : 0
    };
  }).sort(function (a, b) { return b.pointsFor - a.pointsFor; });

  // Walk regular-season weeks to find best single-week score and closest matchup
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
    // best single-team-week score
    wr.data.forEach(function (entry) {
      if (typeof entry.points !== "number") return;
      if (!bestPerformance || entry.points > bestPerformance.points) {
        bestPerformance = {
          owner: rosterIdToOwner[entry.roster_id] || "Unknown",
          points: entry.points,
          week: wr.week
        };
      }
    });
    // closest matchup - group by matchup_id
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
          week: wr.week,
          margin: margin,
          teamA: rosterIdToOwner[pair[0].roster_id] || "Unknown",
          scoreA: pair[0].points,
          teamB: rosterIdToOwner[pair[1].roster_id] || "Unknown",
          scoreB: pair[1].points
        };
      }
    });
  });

  return {
    season: season,
    leagueStatus: leagueInfo.status,
    teams: teams,
    bestPerformance: bestPerformance,
    closestMatchup: closestMatchup,
    weeksPlayed: weekResults.filter(function (wr) { return wr.data && wr.data.length > 0; }).length
  };
}

function renderTeamGrid(stats) {
  const grid = document.getElementById("team-grid");
  grid.innerHTML = "";

  if (stats.teams.length === 0 || stats.weeksPlayed === 0) {
    grid.innerHTML = '<p class="empty-note">No games played yet for ' + stats.season + '.</p>';
    return;
  }

  stats.teams.forEach(function (team) {
    const card = document.createElement("div");
    card.className = "keeper-card";
    card.style.cursor = "default";
    card.innerHTML =
      '<div class="card-top">' + avatarHtml(team.owner) +
        '<div><div class="eyebrow">' + team.wins + '-' + team.losses + (team.ties ? '-' + team.ties : '') + '</div>' +
        '<div class="team-name">' + team.owner + '</div></div>' +
      '</div>' +
      '<div class="stat-row">' +
        '<div class="stat-chip"><div class="label">Points for</div><div class="value">' + team.pointsFor.toFixed(1) + '</div></div>' +
        '<div class="stat-chip"><div class="label">Points against</div><div class="value">' + team.pointsAgainst.toFixed(1) + '</div></div>' +
      '</div>' +
      '<div class="stat-row" style="margin-top:8px;">' +
        '<div class="stat-chip"><div class="label">Avg / week</div><div class="value">' + team.avgPerWeek.toFixed(1) + '</div></div>' +
      '</div>';
    grid.appendChild(card);
  });
  attachAvatarFallbacks(grid);
}

function renderHighlights(stats) {
  const section = document.getElementById("highlights-section");
  const wrap = document.getElementById("highlights");
  wrap.innerHTML = "";

  if (!stats.bestPerformance && !stats.closestMatchup) {
    section.style.display = "none";
    return;
  }
  section.style.display = "block";

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

async function showSeason(season) {
  currentSeason = season;
  document.querySelectorAll(".filter-btn").forEach(function (b) {
    b.classList.toggle("active", Number(b.dataset.season) === season);
  });

  const loadingNote = document.getElementById("loading-note");
  const grid = document.getElementById("team-grid");
  document.getElementById("highlights-section").style.display = "none";
  grid.innerHTML = "";
  loadingNote.style.display = "block";
  loadingNote.textContent = "Loading live data from Sleeper...";

  try {
    if (!seasonCache[season]) {
      seasonCache[season] = await computeSeasonStats(season);
    }
    loadingNote.style.display = "none";
    renderHighlights(seasonCache[season]);
    renderTeamGrid(seasonCache[season]);
  } catch (err) {
    loadingNote.textContent = "Couldn't load data for " + season + " from Sleeper right now. Try refreshing.";
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const seasonBar = document.getElementById("season-bar");
  const seasons = Object.keys(LEAGUE_IDS).map(Number).sort();
  seasons.forEach(function (season) {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.season = season;
    btn.textContent = season;
    btn.addEventListener("click", function () { showSeason(season); });
    seasonBar.appendChild(btn);
  });
  // default to the most recent season that's actually been played (2025, not the not-yet-drafted 2026)
  showSeason(2025);
});
