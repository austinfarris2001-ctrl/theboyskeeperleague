// ============================================================
// KEEPER DATA - this is the file you edit to add/update keepers
// ============================================================
// To add a new keeper: copy one of the objects below and change the values.
// season: the year the player was KEPT (2025, 2026, etc)
// owner: team owner's name as you want it displayed
// player: player name
// round / pick: overall draft pick they were kept/drafted at
// adp: average draft position that year
// valueScore: pick minus adp (calculate this yourself, or ask Claude to)

const KEEPER_DATA = [
  { season: 2025, owner: "Shivam Patel", player: "Brian Thomas", round: 10, pick: 115, adp: 14, valueScore: 101 },
  { season: 2025, owner: "Tyler Armstrong", player: "Jayden Daniels", round: 11, pick: 122, adp: 31, valueScore: 91 },
  { season: 2025, owner: "Austin Farris", player: "Brock Bowers", round: 9, pick: 97, adp: 16, valueScore: 81 },
  { season: 2025, owner: "Brayden Armstrong", player: "Jordan Addison", round: 9, pick: 106, adp: 27, valueScore: 79 },
  { season: 2025, owner: "Alvin Pokel", player: "Courtland Sutton", round: 10, pick: 117, adp: 50, valueScore: 67 },
  { season: 2025, owner: "Braden Galvan", player: "Terry McLaurin", round: 6, pick: 66, adp: 39, valueScore: 27 },
  { season: 2025, owner: "Braeden Sully", player: "Tee Higgins", round: 4, pick: 44, adp: 29, valueScore: 15 },
  { season: 2025, owner: "Tyler Ahrens", player: "Kenneth Walker", round: 5, pick: 56, adp: 44, valueScore: 12 },
  { season: 2025, owner: "Rohan Shani", player: "Alvin Kamara", round: 4, pick: 46, adp: 42, valueScore: 4 },
  { season: 2025, owner: "Michael Hoffa", player: "DeVonta Smith", round: 4, pick: 38, adp: 52, valueScore: -14 },
  { season: 2025, owner: "Zach Sullivan", player: "Mark Andrews", round: 5, pick: 57, adp: 77, valueScore: -20 },
  { season: 2025, owner: "Joe Sadler", player: "Jaylen Waddle", round: 4, pick: 37, adp: 68, valueScore: -31 },
  { season: 2026, owner: "Austin Farris", player: "Drake Maye", round: 15, pick: 149, adp: 48, valueScore: 101 },
  { season: 2026, owner: "Joe Sadler", player: "Jaxson Dart", round: 15, pick: 142, adp: 82, valueScore: 60 },
  { season: 2026, owner: "Tyler Armstrong", player: "Cam Skattebo", round: 8, pick: 77, adp: 43, valueScore: 34 },
  { season: 2026, owner: "Braeden Sully", player: "Travis Etienne", round: 8, pick: 75, adp: 41, valueScore: 34 },
  { season: 2026, owner: "Tyler Ahrens", player: "Chris Olave", round: 6, pick: 60, adp: 30, valueScore: 30 },
  { season: 2026, owner: "Brayden Armstrong", player: "Rashee Rice", round: 5, pick: 45, adp: 27, valueScore: 18 },
  { season: 2026, owner: "Rohan Shani", player: "Zay Flowers", round: 6, pick: 53, adp: 44, valueScore: 9 },
  { season: 2026, owner: "Braden Galvan", player: "Tony Pollard", round: 4, pick: 34, adp: 87, valueScore: -53 }
];
