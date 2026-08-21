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
  "jsadl1225": "Joe Sadler",
  "austincastro23": "Austin Castro",
  "ethan35thomas": "Ethan Thomas",
  "jessecallahan13": "Jesse Callahan"
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

// Sleeper permanently unlinks owner_id from a roster once that person leaves
// the league - even for past seasons they actually played. Manual overrides
// for those roster slots, keyed by league_id then roster_id.
const ROSTER_OWNER_OVERRIDES = {
  "1257432232532914176": {
    3: "Michael Hoffa",
    9: "Alvin Pokel"
  }
};

// Seasons before the league moved to Sleeper - rendered from static ESPN_HISTORY data.
const ESPN_SEASONS = [2020, 2021, 2022];

function ownerNameFromUsername(username) {
  if (!username) return "Unknown";
  const key = username.toLowerCase();
  return USERNAME_TO_OWNER[key] || username;
}

// ============================================================
// LIVE AVATAR REGISTRY - every page fetches Sleeper's /league/{id}/users
// endpoint anyway (to resolve owner names), and that response already
// includes each user's CURRENT avatar hash - we just weren't capturing it.
// Whichever page loads first for a session populates this from real,
// current Sleeper data, so avatars self-update whenever someone changes
// their picture on Sleeper - no more manually refreshing OWNER_AVATARS by
// hand. Falls back to the static OWNER_AVATARS map (data/keepers.js-adjacent)
// for anyone not present in whatever season's users list was fetched (e.g.
// departed members, or pages that haven't loaded a live fetch yet).
// ============================================================
const LIVE_AVATARS = {};
function registerLiveAvatar(owner, avatarHash) {
  if (owner && avatarHash) LIVE_AVATARS[owner] = avatarHash;
}
function getAvatarInfo(owner) {
  if (LIVE_AVATARS[owner]) return { type: "id", value: LIVE_AVATARS[owner] };
  return (typeof OWNER_AVATARS !== "undefined" ? OWNER_AVATARS[owner] : null) || null;
}
