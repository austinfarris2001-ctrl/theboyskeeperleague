// ============================================================
// HOMEPAGE - live current-season standings from Sleeper.
// Tries the most recent season first; if it has no games played yet
// (e.g. draft just happened, week 1 hasn't been played), falls back
// to the most recent season that actually has results.
// ============================================================

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

async function fetchStandings(season) {
  const leagueId = LEAGUE_IDS[season];
  const [rosters, users] = await Promise.all([
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/rosters"),
    fetchJson("https://api.sleeper.app/v1/league/" + leagueId + "/users")
  ]);

  const userIdToOwner = {};
  users.forEach(function (u) { userIdToOwner[u.user_id] = ownerNameFromUsername(u.display_name); });
  const overridesForLeague = ROSTER_OWNER_OVERRIDES[leagueId] || {};

  const teams = rosters.map(function (r) {
    const s = r.settings || {};
    const fptsTotal = (s.fpts || 0) + (s.fpts_decimal || 0) / 100;
    const wins = s.wins || 0, losses = s.losses || 0, ties = s.ties || 0;
    return {
      owner: userIdToOwner[r.owner_id] || overridesForLeague[r.roster_id] || "Unknown",
      wins: wins, losses: losses, ties: ties,
      pointsFor: fptsTotal,
      gamesPlayed: wins + losses + ties
    };
  });

  const totalGames = teams.reduce(function (sum, t) { return sum + t.gamesPlayed; }, 0);
  teams.sort(function (a, b) {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.pointsFor - a.pointsFor;
  });

  return { season: season, teams: teams, hasGames: totalGames > 0 };
}

function renderStandings(result) {
  document.getElementById("standings-title").textContent = result.season + " standings";
  document.getElementById("standings-loading").style.display = "none";
  const grid = document.getElementById("standings-grid");
  grid.innerHTML = "";

  if (!result.hasGames) {
    grid.innerHTML = '<p class="empty-note">No games played yet for ' + result.season + '.</p>';
    return;
  }

  result.teams.forEach(function (t, i) {
    const card = document.createElement("div");
    card.className = "keeper-card";
    card.style.cursor = "default";
    card.innerHTML =
      '<div class="card-top">' + avatarHtml(t.owner) +
        '<div><div class="eyebrow">RANK ' + (i + 1) + '</div>' +
        '<div class="team-name">' + t.owner + '</div></div>' +
      '</div>' +
      '<div class="stat-row">' +
        '<div class="stat-chip"><div class="label">Record</div><div class="value">' + t.wins + '-' + t.losses + (t.ties ? '-' + t.ties : '') + '</div></div>' +
        '<div class="stat-chip"><div class="label">Points for</div><div class="value">' + t.pointsFor.toFixed(1) + '</div></div>' +
      '</div>';
    grid.appendChild(card);
  });
  attachAvatarFallbacks(grid);
}

async function loadStandings() {
  const seasons = Object.keys(LEAGUE_IDS).map(Number).sort(function (a, b) { return b - a; });
  for (let i = 0; i < seasons.length; i++) {
    try {
      const result = await fetchStandings(seasons[i]);
      if (result.hasGames) {
        renderStandings(result);
        return;
      }
      // keep the most recent attempt in case NOTHING has games yet
      if (i === seasons.length - 1) renderStandings(result);
    } catch (e) {
      // try the next season back
    }
  }
  document.getElementById("standings-loading").textContent = "Couldn't load standings right now.";
}

document.addEventListener("DOMContentLoaded", loadStandings);
