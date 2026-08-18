// ============================================================
// SHARED OWNER DATA - used by every page (keepers, team stats, etc)
// ============================================================
// Maps a Sleeper username (lowercase) to the friendly owner name used
// throughout the site. Update this if someone changes their Sleeper username.
const USERNAME_TO_OWNER = {
  "shivampatel123": "Shivam Patel",
  "tydog203": "Tyler Armstrong",
  "afar24": "Austin Farris",
  "crazylegs0518": "Brayden Armstrong",
  "alvinpokel": "Alvin Pokel",
  "braden703": "Braden Galvan",
  "braedensully": "Braeden Sully",
  "tylerahrens": "Tyler Ahrens",
  "daddyshani1": "Rohan Shani",
  "bigthad": "Michael Hoffa",
  "zday47": "Zach Sullivan",
  "jsadl1225": "Joe Sadler"
};

// Avatar source per owner - see data/keepers.js header for the type explanation.
const OWNER_AVATARS = {
  "Shivam Patel": { type: "url", value: "https://sleepercdn.com/uploads/9beea504a9a18675801d1f4994cb085c.jpg" },
  "Tyler Armstrong": { type: "url", value: "https://sleepercdn.com/uploads/60b9ec24af3fb646a01d86f54de0a818.jpg" },
  "Austin Farris": { type: "id", value: "f0edbf4278f53f9425db175073df6584" },
  "Brayden Armstrong": { type: "id", value: "d55d1f7075eda01948318de4af616075" },
  "Alvin Pokel": null,
  "Braden Galvan": { type: "url", value: "https://sleepercdn.com/uploads/87c59a355eed988844c04e1b959f0600.jpg" },
  "Braeden Sully": { type: "url", value: "https://sleepercdn.com/uploads/0a4d3daa17a54fffe9c65e7c00bd07df.jpg" },
  "Tyler Ahrens": { type: "url", value: "https://sleepercdn.com/uploads/e0a83d416084d53358cfecdbf8067f20.jpg" },
  "Rohan Shani": { type: "url", value: "https://sleepercdn.com/uploads/06757fd439eb2bdce4e6e78938ef220d.jpg" },
  "Michael Hoffa": null,
  "Zach Sullivan": { type: "url", value: "https://sleepercdn.com/uploads/a0cf6cf9b698d4d63c9277733eb49bd1.jpg" },
  "Joe Sadler": { type: "id", value: "82aec8e811b839b8ec25d7b458afd57b" }
};

// League IDs per season - Sleeper seasons only (2020-2022 come from ESPN_HISTORY instead).
const LEAGUE_IDS = {
  2023: "998754274152747008",
  2024: "1132805983862054912",
  2025: "1257432232532914176",
  2026: "1385308512279621632"
};

// Seasons before the league moved to Sleeper - rendered from static ESPN_HISTORY data.
const ESPN_SEASONS = [2020, 2021, 2022];

function ownerNameFromUsername(username) {
  if (!username) return "Unknown";
  const key = username.toLowerCase();
  return USERNAME_TO_OWNER[key] || username;
}
