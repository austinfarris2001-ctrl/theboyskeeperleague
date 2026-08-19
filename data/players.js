// ============================================================
// PLAYER DATA - maps each keeper's player name to their Sleeper player ID
// and current NFL team, used for headshots and team logos.
// Built by matching keeper names against Sleeper's full player database
// (api.sleeper.app/v1/players/nfl). Update this whenever a new keeper is
// added, or if a player gets traded (team changes).
// ============================================================

const PLAYER_DB = {
  "Brian Thomas": { playerId: "11631", team: "JAX", position: "WR" },
  "Jayden Daniels": { playerId: "11566", team: "WAS", position: "QB" },
  "Brock Bowers": { playerId: "11604", team: "LV", position: "TE" },
  "Jordan Addison": { playerId: "9756", team: "MIN", position: "WR" },
  "Courtland Sutton": { playerId: "5045", team: "DEN", position: "WR" },
  "Terry McLaurin": { playerId: "5927", team: "WAS", position: "WR" },
  "Tee Higgins": { playerId: "6801", team: "CIN", position: "WR" },
  "Kenneth Walker": { playerId: "8151", team: "KC", position: "RB" },
  "Alvin Kamara": { playerId: "4035", team: "NO", position: "RB" },
  "DeVonta Smith": { playerId: "7525", team: "PHI", position: "WR" },
  "Mark Andrews": { playerId: "5012", team: "BAL", position: "TE" },
  "Jaylen Waddle": { playerId: "7526", team: "DEN", position: "WR" },
  "Drake Maye": { playerId: "11564", team: "NE", position: "QB" },
  "Jaxson Dart": { playerId: "12508", team: "NYG", position: "QB" },
  "Cam Skattebo": { playerId: "12481", team: "NYG", position: "RB" },
  "Travis Etienne": { playerId: "7543", team: "NO", position: "RB" },
  "Chris Olave": { playerId: "8144", team: "NO", position: "WR" },
  "Rashee Rice": { playerId: "10229", team: "KC", position: "WR" },
  "Zay Flowers": { playerId: "9997", team: "BAL", position: "WR" },
  "Tony Pollard": { playerId: "5967", team: "TEN", position: "RB" },
  "Colston Loveland": { playerId: "12517", team: "CHI", position: "TE" }
};

// ESPN's team-logo URLs use lowercase abbreviations that mostly match Sleeper's,
// except Washington (Sleeper: WAS, ESPN: wsh). Add more overrides here if a
// mismatch shows up for a new team.
const TEAM_ABBR_OVERRIDES = {
  "WAS": "wsh"
};

function playerHeadshotUrl(playerId) {
  return "https://sleepercdn.com/content/nfl/players/" + playerId + ".jpg";
}

function teamLogoUrl(team) {
  if (!team) return null;
  const abbr = (TEAM_ABBR_OVERRIDES[team] || team).toLowerCase();
  return "https://a.espncdn.com/i/teamlogos/nfl/500/" + abbr + ".png";
}
