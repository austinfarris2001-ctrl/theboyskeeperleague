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
  const userIdToTeamName = {};
  users.forEach(function (u) {
    userIdToOwner[u.user_id] = ownerNameFromUsername(u.display_name);
    userIdToTeamName[u.user_id] = u.metadata && u.metadata.team_name;
    registerLiveAvatar(ownerNameFromUsername(u.display_name), u.avatar);
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
    const teamName = userIdToTeamName[r.owner_id] || (rosterIdToOwner[r.roster_id] || "Unknown");
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

// ============================================================
// DRILL-DOWN - clicking a Season Stats card opens a spotlight with 4 tabs:
// Schedule, Player Stats (points scored only while starting for this team),
// Awards, and Decisions (optimal lineup vs actual, points left on bench).
// Sleeper seasons only - ESPN years don't have weekly starter-level data.
// ============================================================

let allWeeksCache = {}; // season -> array of {week, entries: [...]}
let leagueMetaCache = {}; // season -> {rosterPositions, rosterIdToOwner, totalTeams}

async function fetchAllWeeksData(season) {
  if (allWeeksCache[season]) return allWeeksCache[season];
  const leagueId = LEAGUE_IDS[season];
  const weekNums = [];
  for (let w = 1; w <= 17; w++) weekNums.push(w); // league's season ends at week 17
  const results = await Promise.all(weekNums.map(function (w) {
    return fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/matchups/" + w)
      .then(function (data) { return { week: w, entries: data || [] }; })
      .catch(function () { return { week: w, entries: [] }; });
  }));
  const played = results.filter(function (r) { return r.entries.length > 0; });
  allWeeksCache[season] = played;
  return played;
}

async function getLeagueMeta(season) {
  if (leagueMetaCache[season]) return leagueMetaCache[season];
  const leagueId = LEAGUE_IDS[season];
  const [leagueInfo, rosters, users] = await Promise.all([
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/rosters"),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/users")
  ]);
  const userIdToOwner = {};
  users.forEach(function (u) { userIdToOwner[u.user_id] = ownerNameFromUsername(u.display_name); registerLiveAvatar(userIdToOwner[u.user_id], u.avatar); });
  const overridesForLeague = ROSTER_OWNER_OVERRIDES[leagueId] || {};
  const rosterIdToOwner = {};
  rosters.forEach(function (r) {
    rosterIdToOwner[r.roster_id] = userIdToOwner[r.owner_id] || overridesForLeague[r.roster_id] || "Unknown";
  });
  const meta = {
    rosterPositions: leagueInfo.roster_positions || [],
    rosterIdToOwner: rosterIdToOwner,
    totalTeams: rosters.length
  };
  leagueMetaCache[season] = meta;
  return meta;
}

function playerName(pid) {
  return (typeof PLAYER_NAMES !== "undefined" && PLAYER_NAMES[pid]) || pid;
}
function playerPos(pid) {
  return (typeof PLAYER_POSITIONS !== "undefined" && PLAYER_POSITIONS[pid]) || null;
}

// Builds this team's week-by-week schedule (opponent, scores, W/L, margin)
// plus raw starter data per week, reused by the other tabs.
function buildTeamWeeks(allWeeks, rosterId, rosterIdToOwner) {
  const teamWeeks = [];
  allWeeks.forEach(function (wk) {
    const mine = wk.entries.find(function (e) { return e.roster_id === rosterId; });
    if (!mine) return;
    const opp = wk.entries.find(function (e) {
      return e.matchup_id === mine.matchup_id && e.roster_id !== rosterId;
    });
    const myPoints = mine.points || 0;
    const oppPoints = opp ? (opp.points || 0) : 0;
    let result = "T";
    if (myPoints > oppPoints) result = "W";
    else if (myPoints < oppPoints) result = "L";
    teamWeeks.push({
      week: wk.week,
      myPoints: myPoints,
      oppPoints: oppPoints,
      oppOwner: opp ? (rosterIdToOwner[opp.roster_id] || "Unknown") : "Bye",
      result: result,
      margin: Math.abs(myPoints - oppPoints),
      starters: mine.starters || [],
      playersPoints: mine.players_points || {},
      allPlayers: mine.players || []
    });
  });
  return teamWeeks;
}

function computePlayerStarterTotals(teamWeeks) {
  const totals = {}; // player_id -> {starts, totalPoints}
  teamWeeks.forEach(function (w) {
    w.starters.forEach(function (pid) {
      if (pid === "0" || !pid) return; // Sleeper uses "0" for an empty slot
      if (!totals[pid]) totals[pid] = { starts: 0, totalPoints: 0 };
      totals[pid].starts += 1;
      totals[pid].totalPoints += (w.playersPoints[pid] || 0);
    });
  });
  return totals;
}

// League-wide average points-per-start by position, computed from the SAME
// weekly data we already fetched (every team's entries, not just ours) -
// used as the baseline for "biggest letdown."
function computeLeaguePositionAverages(allWeeks) {
  const sums = {}; // position -> {totalPoints, starts}
  allWeeks.forEach(function (wk) {
    wk.entries.forEach(function (entry) {
      const starters = entry.starters || [];
      const pp = entry.players_points || {};
      starters.forEach(function (pid) {
        if (pid === "0" || !pid) return;
        const pos = playerPos(pid);
        if (!pos) return;
        if (!sums[pos]) sums[pos] = { totalPoints: 0, starts: 0 };
        sums[pos].totalPoints += (pp[pid] || 0);
        sums[pos].starts += 1;
      });
    });
  });
  const avgs = {};
  Object.keys(sums).forEach(function (pos) {
    avgs[pos] = sums[pos].starts > 0 ? sums[pos].totalPoints / sums[pos].starts : 0;
  });
  return avgs;
}

function computeAwards(teamWeeks, playerTotals, leaguePosAvgs) {
  if (teamWeeks.length === 0) return null;

  let bestWeek = teamWeeks[0], worstWeek = teamWeeks[0];
  let closestWin = null, closestLoss = null, biggestBlowoutWin = null, worstBlowoutLoss = null;

  teamWeeks.forEach(function (w) {
    if (w.myPoints > bestWeek.myPoints) bestWeek = w;
    if (w.myPoints < worstWeek.myPoints) worstWeek = w;
    if (w.result === "W") {
      if (!closestWin || w.margin < closestWin.margin) closestWin = w;
      if (!biggestBlowoutWin || w.margin > biggestBlowoutWin.margin) biggestBlowoutWin = w;
    } else if (w.result === "L") {
      if (!closestLoss || w.margin < closestLoss.margin) closestLoss = w;
      if (!worstBlowoutLoss || w.margin > worstBlowoutLoss.margin) worstBlowoutLoss = w;
    }
  });

  // Streaks
  let longestWinStreak = 0, longestLossStreak = 0, curW = 0, curL = 0;
  teamWeeks.forEach(function (w) {
    if (w.result === "W") { curW++; curL = 0; } else if (w.result === "L") { curL++; curW = 0; } else { curW = 0; curL = 0; }
    longestWinStreak = Math.max(longestWinStreak, curW);
    longestLossStreak = Math.max(longestLossStreak, curL);
  });

  // Consistency: standard deviation of weekly points (lower = more consistent)
  const scores = teamWeeks.map(function (w) { return w.myPoints; });
  const mean = scores.reduce(function (a, b) { return a + b; }, 0) / scores.length;
  const variance = scores.reduce(function (sum, s) { return sum + Math.pow(s - mean, 2); }, 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Best performing player: highest total points while starting for this team
  let bestPlayer = null;
  Object.keys(playerTotals).forEach(function (pid) {
    const t = playerTotals[pid];
    if (!bestPlayer || t.totalPoints > bestPlayer.totalPoints) {
      bestPlayer = { pid: pid, name: playerName(pid), totalPoints: t.totalPoints, starts: t.starts };
    }
  });

  // Biggest letdown: min 3 starts, most below the league's per-position average per start
  let letdownPlayer = null;
  Object.keys(playerTotals).forEach(function (pid) {
    const t = playerTotals[pid];
    if (t.starts < 3) return;
    const pos = playerPos(pid);
    const leagueAvg = leaguePosAvgs[pos];
    if (leagueAvg == null) return;
    const avgPerStart = t.totalPoints / t.starts;
    const diff = avgPerStart - leagueAvg;
    if (!letdownPlayer || diff < letdownPlayer.diff) {
      letdownPlayer = { pid: pid, name: playerName(pid), pos: pos, avgPerStart: avgPerStart, leagueAvg: leagueAvg, diff: diff, starts: t.starts };
    }
  });

  return {
    bestWeek: bestWeek, worstWeek: worstWeek,
    closestWin: closestWin, closestLoss: closestLoss,
    biggestBlowoutWin: biggestBlowoutWin, worstBlowoutLoss: worstBlowoutLoss,
    longestWinStreak: longestWinStreak, longestLossStreak: longestLossStreak,
    stdDev: stdDev,
    bestPlayer: bestPlayer, letdownPlayer: letdownPlayer
  };
}

// Approximates the optimal starting lineup for one week: fills mandatory
// position slots with the best available player at that position, then
// fills FLEX slots with the best remaining RB/WR/TE, backfilling if the
// greedy top-N selection didn't satisfy position minimums. This is a strong
// approximation, not a guaranteed mathematical optimum in every edge case.
function computeOptimalLineup(week, rosterPositions) {
  const required = { QB: 0, RB: 0, WR: 0, TE: 0, K: 0, DEF: 0 };
  let flexSlots = 0;
  rosterPositions.forEach(function (slot) {
    if (slot === "FLEX") flexSlots++;
    else if (required.hasOwnProperty(slot)) required[slot]++;
  });

  const available = week.allPlayers.map(function (pid) {
    return { pid: pid, pos: playerPos(pid), points: week.playersPoints[pid] || 0 };
  }).filter(function (p) { return p.pos; });

  let total = 0;
  const used = new Set();

  ["QB", "K", "DEF"].forEach(function (pos) {
    const pool = available.filter(function (p) { return p.pos === pos && !used.has(p.pid); })
      .sort(function (a, b) { return b.points - a.points; });
    for (let i = 0; i < required[pos] && i < pool.length; i++) {
      total += pool[i].points;
      used.add(pool[i].pid);
    }
  });

  // RB/WR/TE + FLEX: greedy top-N with backfill to satisfy minimums
  const flexEligible = available.filter(function (p) {
    return (p.pos === "RB" || p.pos === "WR" || p.pos === "TE") && !used.has(p.pid);
  }).sort(function (a, b) { return b.points - a.points; });

  const totalFlexSlots = required.RB + required.WR + required.TE + flexSlots;
  let selected = flexEligible.slice(0, totalFlexSlots);

  ["RB", "WR", "TE"].forEach(function (pos) {
    let count = selected.filter(function (p) { return p.pos === pos; }).length;
    while (count < required[pos]) {
      // find the best unselected player at this position
      const candidate = flexEligible.find(function (p) { return p.pos === pos && selected.indexOf(p) === -1; });
      if (!candidate) break;
      // drop the lowest-point selected player NOT of this position to make room
      let dropIdx = -1, dropPoints = Infinity;
      selected.forEach(function (p, i) {
        if (p.pos !== pos && p.points < dropPoints) { dropPoints = p.points; dropIdx = i; }
      });
      if (dropIdx === -1) break;
      selected.splice(dropIdx, 1, candidate);
      count++;
    }
  });

  selected.forEach(function (p) { total += p.points; });

  return total;
}

function computeDecisions(teamWeeks, rosterPositions) {
  return teamWeeks.map(function (w) {
    const actual = w.starters.reduce(function (sum, pid) {
      return sum + (pid !== "0" ? (w.playersPoints[pid] || 0) : 0);
    }, 0);
    const optimal = computeOptimalLineup(w, rosterPositions);
    return { week: w.week, actual: actual, optimal: optimal, leftOnBench: Math.max(0, optimal - actual) };
  });
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
        finalRank: t.finalRank, totalTeams: t.totalTeams,
        rosterId: t.rosterId, // undefined for ESPN seasons - drill-down is Sleeper-only
        isEspn: ESPN_SEASONS.indexOf(stats.season) !== -1
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
    card.style.cursor = r.isEspn ? "default" : "pointer";
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
      '</div>' +
      (r.isEspn ? '' : '<div class="empty-note" style="text-align:center;margin-top:8px;">Tap for full breakdown</div>');
    if (!r.isEspn) {
      card.addEventListener("click", function () { openDrillDown(r); });
    }
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

// ============================================================
// DRILL-DOWN MODAL - the actual open/render/tab-switch logic
// ============================================================
let drillDownData = null; // cached computed data for the currently-open drill-down
let activeDrillTab = "schedule";

async function openDrillDown(row) {
  const overlay = document.getElementById("drill-overlay");
  const body = document.getElementById("drill-body");
  overlay.classList.remove("hidden");
  activeDrillTab = "schedule";
  body.innerHTML = '<p class="empty-note">Loading full breakdown from Sleeper...</p>';

  try {
    const [allWeeks, meta] = await Promise.all([
      fetchAllWeeksData(row.season),
      getLeagueMeta(row.season)
    ]);
    const teamWeeks = buildTeamWeeks(allWeeks, row.rosterId, meta.rosterIdToOwner);
    const playerTotals = computePlayerStarterTotals(teamWeeks);
    const leaguePosAvgs = computeLeaguePositionAverages(allWeeks);
    const awards = computeAwards(teamWeeks, playerTotals, leaguePosAvgs);
    const decisions = computeDecisions(teamWeeks, meta.rosterPositions);

    drillDownData = { row: row, teamWeeks: teamWeeks, playerTotals: playerTotals, awards: awards, decisions: decisions };
    renderDrillDown();
  } catch (e) {
    body.innerHTML = '<p class="empty-note">Couldn\'t load the full breakdown right now. Try again.</p>';
    console.error(e);
  }
}

function closeDrillDown() {
  document.getElementById("drill-overlay").classList.add("hidden");
  drillDownData = null;
}

function fmtNum(n) { return (n == null ? 0 : n).toFixed(1); }

function renderDrillDown() {
  if (!drillDownData) return;
  const d = drillDownData;
  const body = document.getElementById("drill-body");

  const tabsHtml =
    '<div class="drill-header">' +
      '<div class="team-name">' + d.row.owner + '</div>' +
      '<div class="sub-team-name">' + d.row.teamName + ' \u00b7 ' + d.row.season + '</div>' +
    '</div>' +
    '<div class="toggle-row">' +
      ["schedule", "players", "awards", "decisions"].map(function (tab) {
        const labels = { schedule: "Schedule", players: "Player Stats", awards: "Awards", decisions: "Decisions" };
        return '<button class="toggle-pill ' + (activeDrillTab === tab ? "active" : "") + '" data-drill-tab="' + tab + '">' + labels[tab] + '</button>';
      }).join("") +
    '</div>' +
    '<div id="drill-tab-content"></div>';

  body.innerHTML = tabsHtml;

  document.querySelectorAll("[data-drill-tab]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      activeDrillTab = btn.dataset.drillTab;
      renderDrillDown();
    });
  });

  const content = document.getElementById("drill-tab-content");
  if (activeDrillTab === "schedule") content.innerHTML = renderScheduleTab(d.teamWeeks);
  else if (activeDrillTab === "players") content.innerHTML = renderPlayersTab(d.playerTotals);
  else if (activeDrillTab === "awards") content.innerHTML = renderAwardsTab(d.awards);
  else if (activeDrillTab === "decisions") content.innerHTML = renderDecisionsTab(d.decisions);
}

function renderScheduleTab(teamWeeks) {
  if (teamWeeks.length === 0) return '<p class="empty-note">No games played yet.</p>';
  return teamWeeks.map(function (w) {
    const resultColor = w.result === "W" ? "var(--green)" : w.result === "L" ? "var(--red)" : "var(--text-mute)";
    return '<div class="stat-row" style="margin-bottom:8px;align-items:center;">' +
      '<div class="stat-chip" style="text-align:left;flex:2;">' +
        '<div class="label">Week ' + w.week + '</div>' +
        '<div class="value" style="font-size:15px;">vs ' + w.oppOwner + '</div>' +
      '</div>' +
      '<div class="stat-chip"><div class="label">Score</div><div class="value" style="font-size:15px;">' + fmtNum(w.myPoints) + ' - ' + fmtNum(w.oppPoints) + '</div></div>' +
      '<div class="stat-chip"><div class="label" style="color:' + resultColor + ';">' + w.result + '</div><div class="value" style="font-size:15px;">' + fmtNum(w.margin) + '</div></div>' +
    '</div>';
  }).join("");
}

function renderPlayersTab(playerTotals) {
  const rows = Object.keys(playerTotals).map(function (pid) {
    return { pid: pid, name: playerName(pid), pos: playerPos(pid) || "", starts: playerTotals[pid].starts, totalPoints: playerTotals[pid].totalPoints };
  }).sort(function (a, b) { return b.totalPoints - a.totalPoints; });

  if (rows.length === 0) return '<p class="empty-note">No starter data available.</p>';

  return rows.map(function (r) {
    return '<div class="stat-row" style="margin-bottom:8px;align-items:center;">' +
      '<div class="stat-chip" style="text-align:left;flex:2;">' +
        '<div class="label">' + r.pos + '</div>' +
        '<div class="value" style="font-size:15px;">' + r.name + '</div>' +
      '</div>' +
      '<div class="stat-chip"><div class="label">Starts</div><div class="value" style="font-size:15px;">' + r.starts + '</div></div>' +
      '<div class="stat-chip"><div class="label">Points</div><div class="value" style="font-size:15px;">' + fmtNum(r.totalPoints) + '</div></div>' +
    '</div>';
  }).join("");
}

function renderAwardsTab(awards) {
  if (!awards) return '<p class="empty-note">No games played yet.</p>';

  function matchupLine(w, label) {
    if (!w) return "";
    return '<div class="stat-row" style="margin-bottom:8px;">' +
      '<div class="stat-chip" style="text-align:left;flex:2;"><div class="label">' + label + '</div><div class="value" style="font-size:14px;">Week ' + w.week + ' vs ' + w.oppOwner + '</div></div>' +
      '<div class="stat-chip"><div class="label">Score</div><div class="value" style="font-size:14px;">' + fmtNum(w.myPoints) + ' - ' + fmtNum(w.oppPoints) + '</div></div>' +
    '</div>';
  }
  function simpleLine(label, value) {
    return '<div class="stat-row" style="margin-bottom:8px;">' +
      '<div class="stat-chip" style="text-align:left;flex:2;"><div class="label">' + label + '</div></div>' +
      '<div class="stat-chip"><div class="value" style="font-size:14px;">' + value + '</div></div>' +
    '</div>';
  }

  let html = "";
  html += matchupLine(awards.bestWeek, "Best week");
  html += matchupLine(awards.worstWeek, "Worst week");
  html += matchupLine(awards.closestWin, "Closest win");
  html += matchupLine(awards.closestLoss, "Closest loss");
  html += matchupLine(awards.biggestBlowoutWin, "Biggest blowout win");
  html += matchupLine(awards.worstBlowoutLoss, "Worst blowout loss");
  html += simpleLine("Longest win streak", awards.longestWinStreak + " games");
  html += simpleLine("Longest losing streak", awards.longestLossStreak + " games");
  html += simpleLine("Consistency (std dev)", fmtNum(awards.stdDev) + " pts - lower is steadier");
  if (awards.bestPlayer) {
    html += simpleLine("Best performing player", awards.bestPlayer.name + " (" + fmtNum(awards.bestPlayer.totalPoints) + " pts, " + awards.bestPlayer.starts + " starts)");
  }
  if (awards.letdownPlayer) {
    html += simpleLine("Biggest letdown", awards.letdownPlayer.name + " - " + fmtNum(awards.letdownPlayer.avgPerStart) + " pts/start vs " + fmtNum(awards.letdownPlayer.leagueAvg) + " " + awards.letdownPlayer.pos + " avg");
  }
  return html;
}

// Color intensity ramp for "points left on bench" - the worse the decision
// (bigger number), the brighter/hotter the red. Same style of ramp as the
// keeper page's value-score circles, just red-only since there's no "good"
// direction here (0 left on bench is neutral/good, not green).
const BENCH_RED_STOPS = [
  { v: 0, color: "#8fb8d6" },   // near 0 - neutral, not alarming
  { v: 5, color: "#c9807a" },   // small miss
  { v: 15, color: "#e2554a" },  // moderate miss
  { v: 30, color: "#ff4d3d" },  // big miss
  { v: 50, color: "#ff2020" }   // brutal miss
];
function benchColor(value) {
  const v = Math.min(Math.abs(value), 50);
  let lo = BENCH_RED_STOPS[0], hi = BENCH_RED_STOPS[BENCH_RED_STOPS.length - 1];
  for (let i = 0; i < BENCH_RED_STOPS.length - 1; i++) {
    if (v >= BENCH_RED_STOPS[i].v && v <= BENCH_RED_STOPS[i + 1].v) {
      lo = BENCH_RED_STOPS[i]; hi = BENCH_RED_STOPS[i + 1]; break;
    }
  }
  const range = hi.v - lo.v;
  const t = range === 0 ? 0 : (v - lo.v) / range;
  const a = lo.color.match(/\w\w/g).map(function (h) { return parseInt(h, 16); });
  const b = hi.color.match(/\w\w/g).map(function (h) { return parseInt(h, 16); });
  const mixed = a.map(function (c, i) { return Math.round(c + (b[i] - c) * t); });
  return "#" + mixed.map(function (c) { return c.toString(16).padStart(2, "0"); }).join("");
}

function renderDecisionsTab(decisions) {
  if (decisions.length === 0) return '<p class="empty-note">No games played yet.</p>';
  const totalLeft = decisions.reduce(function (sum, d) { return sum + d.leftOnBench; }, 0);
  let html = '<div class="empty-note" style="margin-bottom:10px;">Total points left on the bench this season: ' + fmtNum(totalLeft) + '</div>';
  html += decisions.map(function (d) {
    return '<div class="stat-row" style="margin-bottom:8px;align-items:center;">' +
      '<div class="stat-chip" style="text-align:left;flex:1;"><div class="label">Week ' + d.week + '</div></div>' +
      '<div class="stat-chip"><div class="label">Actual</div><div class="value" style="font-size:15px;">' + fmtNum(d.actual) + '</div></div>' +
      '<div class="stat-chip"><div class="label">Optimal</div><div class="value" style="font-size:15px;">' + fmtNum(d.optimal) + '</div></div>' +
      '<div class="stat-chip"><div class="label">Left on bench</div><div class="value" style="font-size:16px;font-weight:800;color:' + benchColor(d.leftOnBench) + ';">' + fmtNum(d.leftOnBench) + '</div></div>' +
    '</div>';
  }).join("");
  return html;
}

async function renderAll() {
  const loadingNote = document.getElementById("loading-note");
  const grid = document.getElementById("team-grid");
  const modeBar = document.getElementById("view-mode-bar");
  const sortBar = document.getElementById("sort-bar");

  if (selectedSeasons.size === 0) {
    grid.innerHTML = '<p class="empty-note">Select at least one season above.</p>';
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

  document.getElementById("close-drill").addEventListener("click", closeDrillDown);
  document.getElementById("drill-overlay").addEventListener("click", function (e) {
    if (e.target.id === "drill-overlay") closeDrillDown();
  });

  const defaultBtn = seasonBar.querySelector('[data-season="2025"]');
  if (defaultBtn) defaultBtn.click();
});
