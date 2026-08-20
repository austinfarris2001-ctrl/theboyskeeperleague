// ============================================================
// PLAYOFF STATS - stats scoped to just the playoff weeks each season,
// split into who made the real playoffs vs the toilet bowl/consolation
// bracket. Sleeper years (2023-2026) use real bracket data (winners_bracket/
// losers_bracket) for exact classification and a real bracket visualization.
// ESPN years (2020-2022) classify playoffs-vs-toilet-bowl by final rank vs
// that season's playoff team count (ESPN doesn't tag bracket type per game),
// using the static data/espn-playoffs.js extracted from Austin's league files.
// ============================================================

let selectedPlayoffSeasons = new Set();
const playoffDataCache = {};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch " + url);
  return res.json();
}

function initials(name) { return name.split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase(); }
function avatarHtml(owner) { return '<span class="avatar-slot" data-owner="' + owner + '"></span>'; }
function attachAvatarFallbacks(root) {
  root.querySelectorAll(".avatar-slot").forEach(function (slot) {
    const owner = slot.getAttribute("data-owner");
    const info = typeof OWNER_AVATARS !== "undefined" ? OWNER_AVATARS[owner] : null;
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

function parseBracketPlacements(winnersBracket, losersBracket, totalTeams) {
  const placements = {};
  (winnersBracket || []).forEach(function (m) {
    if (m.p === 1 && m.w != null && m.l != null) { placements[m.w] = 1; placements[m.l] = 2; }
    else if (m.p === 3 && m.w != null && m.l != null) { placements[m.w] = 3; placements[m.l] = 4; }
  });
  if (losersBracket && losersBracket.length > 0) {
    const maxP = Math.max.apply(null, losersBracket.map(function (m) { return m.p || 0; }));
    losersBracket.forEach(function (m) {
      if (m.p === maxP && m.w != null && m.l != null) { placements[m.l] = totalTeams; placements[m.w] = totalTeams - 1; }
    });
  }
  return placements;
}

// ---- Sleeper season playoff data ----
async function getSleeperPlayoffData(season) {
  const cacheKey = "sleeper-" + season;
  if (playoffDataCache[cacheKey]) return playoffDataCache[cacheKey];
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
    userIdToTeamName[u.user_id] = (u.metadata && u.metadata.team_name) || null;
  });
  const overridesForLeague = ROSTER_OWNER_OVERRIDES[leagueId] || {};
  const rosterIdToOwner = {};
  const rosterIdToTeamName = {};
  rosters.forEach(function (r) {
    rosterIdToOwner[r.roster_id] = userIdToOwner[r.owner_id] || overridesForLeague[r.roster_id] || "Unknown";
    rosterIdToTeamName[r.roster_id] = userIdToTeamName[r.owner_id] || null;
  });

  const totalTeams = rosters.length;
  const playoffStart = (leagueInfo.settings && leagueInfo.settings.playoff_week_start) || 15;
  const placements = parseBracketPlacements(winnersBracket, losersBracket, totalTeams);

  const winnersRosterIds = new Set();
  (winnersBracket || []).forEach(function (m) {
    if (m.t1 != null) winnersRosterIds.add(m.t1);
    if (m.t2 != null) winnersRosterIds.add(m.t2);
  });
  const losersRosterIds = new Set();
  (losersBracket || []).forEach(function (m) {
    if (m.t1 != null) losersRosterIds.add(m.t1);
    if (m.t2 != null) losersRosterIds.add(m.t2);
  });

  const playoffWeeks = [];
  for (let w = playoffStart; w <= 17; w++) playoffWeeks.push(w);
  const weekResults = await Promise.all(playoffWeeks.map(function (w) {
    return fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/matchups/" + w)
      .then(function (data) { return { week: w, entries: data || [] }; })
      .catch(function () { return { week: w, entries: [] }; });
  }));

  // Figure out which weeks belong to the same bracket round, since some
  // rounds (usually the championship) span 2+ weeks combined into one
  // win/loss - but points still count per-week for averaging purposes.
  // Heuristic: 1 week per round, with any extra weeks folded into the LAST
  // round (the common real-world setup: semis are 1 week, championship is 2).
  const numRounds = Math.max.apply(null, (winnersBracket || []).map(function (m) { return m.r || 1; }).concat([1]));
  const extraWeeks = Math.max(0, playoffWeeks.length - numRounds);
  const roundOfWeek = {};
  let weekIdx = 0;
  for (let round = 1; round <= numRounds; round++) {
    const weeksInThisRound = (round === numRounds) ? (1 + extraWeeks) : 1;
    for (let i = 0; i < weeksInThisRound && weekIdx < playoffWeeks.length; i++) {
      roundOfWeek[playoffWeeks[weekIdx]] = round;
      weekIdx++;
    }
  }

  const teamStats = {};
  rosters.forEach(function (r) {
    const owner = rosterIdToOwner[r.roster_id];
    let bracket = null;
    if (winnersRosterIds.has(r.roster_id)) bracket = "playoffs";
    else if (losersRosterIds.has(r.roster_id)) bracket = "toilet";
    if (!bracket) return; // team didn't participate in either bracket (rare/edge case)
    teamStats[r.roster_id] = {
      owner: owner, teamName: rosterIdToTeamName[r.roster_id], bracket: bracket, wins: 0, losses: 0, ties: 0,
      pointsFor: 0, pointsAgainst: 0, games: 0,
      finalRank: placements[r.roster_id] || null, totalTeams: totalTeams
    };
  });

  // Per-week: always counts separately for points/averages, regardless of
  // whether the week is part of a multi-week round.
  weekResults.forEach(function (wr) {
    wr.entries.forEach(function (e) {
      const t = teamStats[e.roster_id];
      if (!t) return;
      t.pointsFor += (e.points || 0);
      t.games += 1;
    });
    const byMatchup = {};
    wr.entries.forEach(function (e) { if (e.matchup_id != null) (byMatchup[e.matchup_id] = byMatchup[e.matchup_id] || []).push(e); });
    Object.values(byMatchup).forEach(function (pair) {
      if (pair.length !== 2) return;
      pair.forEach(function (e, i) {
        const t = teamStats[e.roster_id];
        if (t) t.pointsAgainst += (pair[1 - i].points || 0);
      });
    });
  });

  // Per-round: establish each round's roster pairing from its first week,
  // then sum every week in that round per roster before deciding the
  // win/loss once for the whole round (not once per week).
  const roundPairings = {}; // round -> [[rosterA, rosterB], ...]
  const seenRoundForPairing = {};
  weekResults.forEach(function (wr) {
    const round = roundOfWeek[wr.week];
    if (seenRoundForPairing[round]) return; // pairing already established from an earlier week in this round
    const byMatchup = {};
    wr.entries.forEach(function (e) { if (e.matchup_id != null) (byMatchup[e.matchup_id] = byMatchup[e.matchup_id] || []).push(e); });
    const pairs = Object.values(byMatchup).filter(function (p) { return p.length === 2; })
      .map(function (p) { return [p[0].roster_id, p[1].roster_id]; });
    if (pairs.length > 0) { roundPairings[round] = pairs; seenRoundForPairing[round] = true; }
  });

  const scoreByRosterWeek = {};
  weekResults.forEach(function (wr) {
    wr.entries.forEach(function (e) { scoreByRosterWeek[e.roster_id + "-" + wr.week] = e.points || 0; });
  });
  const weeksByRound = {};
  playoffWeeks.forEach(function (w) { const r = roundOfWeek[w]; (weeksByRound[r] = weeksByRound[r] || []).push(w); });

  Object.keys(roundPairings).forEach(function (round) {
    roundPairings[round].forEach(function (pair) {
      const weeksInRound = weeksByRound[round] || [];
      let totalA = 0, totalB = 0;
      weeksInRound.forEach(function (w) {
        totalA += scoreByRosterWeek[pair[0] + "-" + w] || 0;
        totalB += scoreByRosterWeek[pair[1] + "-" + w] || 0;
      });
      const tA = teamStats[pair[0]], tB = teamStats[pair[1]];
      if (!tA || !tB) return;
      if (totalA > totalB) { tA.wins += 1; tB.losses += 1; }
      else if (totalB > totalA) { tB.wins += 1; tA.losses += 1; }
      else { tA.ties += 1; tB.ties += 1; }
    });
  });
  const bracketRounds = {};
  (winnersBracket || []).forEach(function (m) {
    const weeksInRound = weeksByRound[m.r] || [playoffStart + (m.r - 1)];
    function roundTotal(rosterId) {
      if (rosterId == null) return null;
      return weeksInRound.reduce(function (sum, w) { return sum + (scoreByRosterWeek[rosterId + "-" + w] || 0); }, 0);
    }
    bracketRounds[m.r] = bracketRounds[m.r] || [];
    bracketRounds[m.r].push({
      team1: m.t1 != null ? rosterIdToOwner[m.t1] : "TBD",
      team2: m.t2 != null ? rosterIdToOwner[m.t2] : "TBD",
      score1: roundTotal(m.t1),
      score2: roundTotal(m.t2),
      winner: m.w != null ? rosterIdToOwner[m.w] : null,
      isFinal: m.p === 1,
      multiWeek: weeksInRound.length > 1
    });
  });

  const result = {
    season: season, isEspn: false,
    teams: Object.values(teamStats),
    bracketRounds: bracketRounds
  };
  playoffDataCache[cacheKey] = result;
  return result;
}

// ---- ESPN season playoff data (static, already embedded) ----
async function getEspnPlayoffData(season) {
  const cacheKey = "espn-" + season;
  if (playoffDataCache[cacheKey]) return playoffDataCache[cacheKey];
  const raw = (typeof ESPN_PLAYOFFS !== "undefined" && ESPN_PLAYOFFS[season]) || { weeklyMatchups: [], roundMatchups: [], ownerBracket: {} };
  const historyTeams = (typeof ESPN_HISTORY !== "undefined" && ESPN_HISTORY[season]) || [];
  const finalRankByOwner = {};
  const teamNameByOwner = {};
  historyTeams.forEach(function (t) { finalRankByOwner[t.owner] = t.finalRank; teamNameByOwner[t.owner] = t.espnTeamName || t.teamName; });
  const totalTeams = historyTeams.length;

  const teamStats = {};
  Object.keys(raw.ownerBracket).forEach(function (owner) {
    teamStats[owner] = {
      owner: owner, teamName: teamNameByOwner[owner] || null, bracket: raw.ownerBracket[owner], wins: 0, losses: 0, ties: 0,
      pointsFor: 0, pointsAgainst: 0, games: 0,
      finalRank: finalRankByOwner[owner] || null, totalTeams: totalTeams
    };
  });

  // Points/games: one entry per ACTUAL week - this is what fixes the
  // "200+ points per game" bug (a multi-week round's combined total was
  // previously being counted as a single week).
  (raw.weeklyMatchups || []).forEach(function (m) {
    [[m.homeOwner, m.homeScore, m.awayScore], [m.awayOwner, m.awayScore, m.homeScore]].forEach(function (t) {
      const stat = teamStats[t[0]];
      if (!stat) return;
      stat.pointsFor += t[1]; stat.pointsAgainst += t[2]; stat.games += 1;
    });
  });

  // Win/loss: one entry per bracket ROUND (may span multiple weeks) - uses
  // the real combined-total result, exactly matching the Sleeper approach.
  (raw.roundMatchups || []).forEach(function (m) {
    const home = teamStats[m.homeOwner], away = teamStats[m.awayOwner];
    if (!home || !away) return;
    if (m.winner === "HOME") { home.wins += 1; away.losses += 1; }
    else if (m.winner === "AWAY") { away.wins += 1; home.losses += 1; }
    else { home.ties += 1; away.ties += 1; }
  });

  const result = { season: season, isEspn: true, teams: Object.values(teamStats), bracketRounds: null };
  playoffDataCache[cacheKey] = result;
  return result;
}

async function getPlayoffData(season) {
  return ESPN_SEASONS.indexOf(season) !== -1 ? getEspnPlayoffData(season) : getSleeperPlayoffData(season);
}

function teamCardHtml(t, season) {
  const record = t.wins + '-' + t.losses + (t.ties ? '-' + t.ties : '');
  return '<div class="keeper-card" style="cursor:default;">' +
    '<div class="card-top">' + avatarHtml(t.owner) +
      '<div><div class="eyebrow">' + season + ' \u00b7 ' + record + '</div>' +
      '<div class="team-name">' + t.owner + ' ' + placementBadge(t.finalRank, t.totalTeams) + '</div>' +
      (t.teamName ? '<div class="sub-team-name">' + t.teamName + '</div>' : '') + '</div>' +
    '</div>' +
    '<div class="stat-row">' +
      '<div class="stat-chip"><div class="label">Points for</div><div class="value">' + t.pointsFor.toFixed(1) + '</div></div>' +
      '<div class="stat-chip"><div class="label">Points against</div><div class="value">' + t.pointsAgainst.toFixed(1) + '</div></div>' +
    '</div>' +
    '<div class="stat-row" style="margin-top:8px;">' +
      '<div class="stat-chip"><div class="label">Avg / game</div><div class="value">' + (t.games > 0 ? (t.pointsFor / t.games).toFixed(1) : "0.0") + '</div></div>' +
    '</div>' +
  '</div>';
}

function renderBracket(bracketRounds) {
  const rounds = Object.keys(bracketRounds).map(Number).sort(function (a, b) { return a - b; });
  if (rounds.length === 0) return '<p class="empty-note">No bracket data available for this season.</p>';
  return rounds.map(function (r) {
    const matches = bracketRounds[r];
    const roundLabel = (matches.some(function (m) { return m.isFinal; }) ? "Championship" : "Round " + r) +
      (matches[0] && matches[0].multiWeek ? " (combined multi-week score)" : "");
    return '<div class="bracket-round">' +
      '<div class="bracket-round-title">' + roundLabel + '</div>' +
      matches.map(function (m) {
        const t1Win = m.winner === m.team1, t2Win = m.winner === m.team2;
        return '<div class="bracket-match">' +
          '<div class="bracket-team ' + (t1Win ? "winner" : m.winner ? "loser" : "") + '">' +
            '<span>' + m.team1 + '</span><span>' + (m.score1 != null ? m.score1.toFixed(1) : "-") + '</span>' +
          '</div>' +
          '<div class="bracket-team ' + (t2Win ? "winner" : m.winner ? "loser" : "") + '">' +
            '<span>' + m.team2 + '</span><span>' + (m.score2 != null ? m.score2.toFixed(1) : "-") + '</span>' +
          '</div>' +
        '</div>';
      }).join("") +
    '</div>';
  }).join("");
}


let playoffViewMode = "individual";
let playoffSortKey = "pointsFor";

const SORT_OPTIONS = [
  { key: "pointsFor", label: "Points for" },
  { key: "pointsAgainst", label: "Points against" },
  { key: "wins", label: "Wins" },
  { key: "avgPerWeek", label: "Avg / week" },
  { key: "finalRank", label: "Final standing" }
];

function renderSortOptions() {
  const select = document.getElementById("playoff-sort-select");
  select.innerHTML = SORT_OPTIONS.map(function (o) {
    return '<option value="' + o.key + '"' + (o.key === playoffSortKey ? " selected" : "") + '>' + o.label + '</option>';
  }).join("");
}

function sortTeams(teams) {
  const key = playoffSortKey;
  const ascending = key === "pointsAgainst" || key === "finalRank";
  return teams.slice().sort(function (a, b) {
    const av = key === "avgPerWeek" ? (a.games > 0 ? a.pointsFor / a.games : 0) : (a[key] || 0);
    const bv = key === "avgPerWeek" ? (b.games > 0 ? b.pointsFor / b.games : 0) : (b[key] || 0);
    return ascending ? av - bv : bv - av;
  });
}

async function renderSeasons() {
  const content = document.getElementById("playoff-content");
  const loading = document.getElementById("playoff-loading");
  const modeBar = document.getElementById("playoff-mode-bar");
  const sortBar = document.getElementById("playoff-sort-select").closest(".filter-bar");
  const seasons = Array.from(selectedPlayoffSeasons).sort();

  if (seasons.length === 0) {
    loading.textContent = "Select at least one season above.";
    loading.style.display = "block";
    content.innerHTML = "";
    modeBar.style.display = "none";
    sortBar.style.display = "none";
    return;
  }

  modeBar.style.display = "flex";
  sortBar.style.display = "flex";
  renderSortOptions();

  loading.style.display = "block";
  loading.textContent = "Loading playoff data...";
  content.innerHTML = "";

  try {
    const allData = await Promise.all(seasons.map(getPlayoffData));
    loading.style.display = "none";

    let html = "";

    // single-season bracket visualization (Sleeper only - ESPN doesn't have exact bracket paths)
    if (seasons.length === 1 && allData[0].bracketRounds) {
      html += '<div class="podium-title" style="margin-bottom:10px;">' + seasons[0] + ' Championship Bracket</div>';
      html += renderBracket(allData[0].bracketRounds);
    } else if (seasons.length === 1 && allData[0].isEspn) {
      html += '<p class="empty-note" style="margin-bottom:16px;">ESPN doesn\'t give us exact bracket paths for this season - showing playoff-week stats instead.</p>';
    }

    if (playoffViewMode === "individual") {
      // flat list of every team-season, split by bracket, sortable together
      const allTeams = [];
      allData.forEach(function (data) {
        data.teams.forEach(function (t) { allTeams.push(Object.assign({ season: data.season }, t)); });
      });
      const playoffTeams = sortTeams(allTeams.filter(function (t) { return t.bracket === "playoffs"; }));
      const toiletTeams = sortTeams(allTeams.filter(function (t) { return t.bracket === "toilet"; }));

      html += '<div class="podium-title" style="margin:20px 0 10px;">Playoffs</div>';
      html += '<div class="keeper-grid">' + playoffTeams.map(function (t) { return teamCardHtml(t, t.season); }).join("") + '</div>';
      html += '<div class="podium-title" style="margin:20px 0 10px;">Toilet Bowl \uD83D\uDCA9</div>';
      html += '<div class="keeper-grid">' + toiletTeams.map(function (t) { return teamCardHtml(t, t.season); }).join("") + '</div>';
    } else {
      // cumulative: aggregate per owner across selected seasons, split by bracket
      const byOwnerPlayoffs = {}, byOwnerToilet = {};
      allData.forEach(function (data) {
        data.teams.forEach(function (t) {
          const bucket = t.bracket === "playoffs" ? byOwnerPlayoffs : byOwnerToilet;
          bucket[t.owner] = bucket[t.owner] || {
            owner: t.owner, wins: 0, losses: 0, ties: 0, pointsFor: 0, pointsAgainst: 0, games: 0,
            appearances: 0, championships: 0, runnerUps: 0, thirds: 0, lastPlaces: 0
          };
          const agg = bucket[t.owner];
          agg.wins += t.wins; agg.losses += t.losses; agg.ties += t.ties;
          agg.pointsFor += t.pointsFor; agg.pointsAgainst += t.pointsAgainst; agg.games += t.games;
          agg.appearances += 1;
          if (t.finalRank === 1) agg.championships += 1;
          if (t.finalRank === 2) agg.runnerUps += 1;
          if (t.finalRank === 3) agg.thirds += 1;
          if (t.finalRank && t.totalTeams && t.finalRank === t.totalTeams) agg.lastPlaces += 1;
        });
      });

      function cumulativeCardHtml(agg) {
        const record = agg.wins + '-' + agg.losses + (agg.ties ? '-' + agg.ties : '');
        const trophyParts = [];
        if (agg.championships > 0) trophyParts.push('\uD83E\uDD47x' + agg.championships);
        if (agg.runnerUps > 0) trophyParts.push('\uD83E\uDD48x' + agg.runnerUps);
        if (agg.thirds > 0) trophyParts.push('\uD83E\uDD49x' + agg.thirds);
        if (agg.lastPlaces > 0) trophyParts.push('\uD83D\uDCA9x' + agg.lastPlaces);
        return '<div class="keeper-card" style="cursor:default;">' +
          '<div class="card-top">' + avatarHtml(agg.owner) +
            '<div><div class="eyebrow">' + agg.appearances + ' appearance' + (agg.appearances === 1 ? '' : 's') + ' \u00b7 ' + record + '</div>' +
            '<div class="team-name">' + agg.owner + (trophyParts.length ? ' ' + trophyParts.join(' ') : '') + '</div></div>' +
          '</div>' +
          '<div class="stat-row">' +
            '<div class="stat-chip"><div class="label">Points for</div><div class="value">' + agg.pointsFor.toFixed(1) + '</div></div>' +
            '<div class="stat-chip"><div class="label">Points against</div><div class="value">' + agg.pointsAgainst.toFixed(1) + '</div></div>' +
          '</div>' +
          '<div class="stat-row" style="margin-top:8px;">' +
            '<div class="stat-chip"><div class="label">Avg / week</div><div class="value">' + (agg.games > 0 ? (agg.pointsFor / agg.games).toFixed(1) : "0.0") + '</div></div>' +
          '</div>' +
        '</div>';
      }

      const playoffList = sortTeams(Object.values(byOwnerPlayoffs));
      const toiletList = sortTeams(Object.values(byOwnerToilet));
      html += '<div class="podium-title" style="margin:20px 0 10px;">Playoffs (cumulative across selected seasons)</div>';
      html += '<div class="keeper-grid">' + playoffList.map(cumulativeCardHtml).join("") + '</div>';
      html += '<div class="podium-title" style="margin:20px 0 10px;">Toilet Bowl \uD83D\uDCA9 (cumulative)</div>';
      html += '<div class="keeper-grid">' + toiletList.map(cumulativeCardHtml).join("") + '</div>';
    }

    content.innerHTML = html;
    attachAvatarFallbacks(content);
  } catch (e) {
    loading.style.display = "block";
    loading.textContent = "Couldn't load playoff data right now.";
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const seasonBar = document.getElementById("playoff-season-bar");
  const seasons = ESPN_SEASONS.concat(Object.keys(LEAGUE_IDS).map(Number)).sort(function (a, b) { return a - b; });
  seasons.forEach(function (season) {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.season = season;
    btn.textContent = season;
    btn.addEventListener("click", function () {
      if (selectedPlayoffSeasons.has(season)) {
        selectedPlayoffSeasons.delete(season);
        btn.classList.remove("active");
      } else {
        selectedPlayoffSeasons.add(season);
        btn.classList.add("active");
      }
      renderSeasons();
    });
    seasonBar.appendChild(btn);
  });

  document.getElementById("playoff-select-all-btn").addEventListener("click", function () {
    document.querySelectorAll("#playoff-season-bar .filter-btn").forEach(function (btn) {
      selectedPlayoffSeasons.add(Number(btn.dataset.season));
      btn.classList.add("active");
    });
    renderSeasons();
  });
  document.getElementById("playoff-deselect-all-btn").addEventListener("click", function () {
    document.querySelectorAll("#playoff-season-bar .filter-btn").forEach(function (btn) { btn.classList.remove("active"); });
    selectedPlayoffSeasons.clear();
    renderSeasons();
  });

  document.querySelectorAll("#playoff-mode-bar [data-mode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#playoff-mode-bar [data-mode]").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      playoffViewMode = btn.dataset.mode;
      renderSeasons();
    });
  });

  document.getElementById("playoff-sort-select").addEventListener("change", function (e) {
    playoffSortKey = e.target.value;
    renderSeasons();
  });

  const defaultBtn = seasonBar.querySelector('[data-season="2025"]');
  if (defaultBtn) defaultBtn.click();
});
