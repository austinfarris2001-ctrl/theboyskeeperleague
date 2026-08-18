let activeSeasonFilter = "all";
let rankView = "kept";

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
  const size = big ? "font-size:16px;padding:5px 12px;" : "font-size:13px;padding:4px 9px;";
  return '<span style="display:inline-block;border-radius:8px;font-weight:700;' + size +
    'background:' + s.bg + ';color:' + s.text + ';">' + formatValueScore(value) + '</span>';
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

function getFiltered() {
  return KEEPER_DATA.filter(function (k) {
    return activeSeasonFilter === "all" || k.season === activeSeasonFilter;
  }).sort(function (a, b) { return b.valueScore - a.valueScore; });
}

function renderPodium() {
  const podium = document.getElementById("podium");
  const top3 = getFiltered().slice(0, 3);
  const trophies = ["\uD83C\uDFC6", "\uD83C\uDFC6", "\uD83C\uDFC6"];
  const order = [1, 0, 2]; // display order: 2nd, 1st, 3rd

  podium.innerHTML = "";
  order.forEach(function (idx) {
    const keeper = top3[idx];
    if (!keeper) return;
    const rank = idx + 1;
    const spot = document.createElement("div");
    spot.className = "podium-spot rank-" + rank;
    spot.innerHTML =
      '<div class="podium-trophy">' + trophies[idx] + '</div>' +
      '<div class="podium-medal">' + rank + '</div>' +
      '<div class="p-owner">' + keeper.owner + '</div>' +
      '<div class="p-player">' + keeper.player + '</div>' +
      '<div class="p-score">' + scoreBoxHtml(keeper.valueScore, true) + '</div>' +
      '<div class="podium-base rank-' + rank + '-base"></div>';
    spot.addEventListener("click", function () { openSpotlight(keeper); });
    podium.appendChild(spot);
  });
  attachAvatarFallbacks(podium);
}

function renderKeeperGrid() {
  const grid = document.getElementById("keeper-grid");
  grid.innerHTML = "";
  const filtered = getFiltered();

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="empty-note">No keepers recorded for this view yet.</p>';
    return;
  }

  filtered.forEach(function (keeper) {
    const card = document.createElement("div");
    card.className = "keeper-card";
    card.innerHTML =
      '<div class="card-top">' + avatarHtml(keeper.owner, "small") +
        '<div><div class="eyebrow">' + keeper.season + ' KEEPER</div>' +
        '<div class="team-name">' + keeper.owner + '</div></div>' +
      '</div>' +
      '<div class="player-name">' + keeper.player + '</div>' +
      '<div class="stat-row">' +
        '<div class="stat-chip"><div class="label">Pick</div><div class="value">' + keeper.pick + '</div></div>' +
        '<div class="stat-chip"><div class="label">ADP</div><div class="value">' + keeper.adp + '</div></div>' +
      '</div>' +
      '<div class="value-score">' + scoreBoxHtml(keeper.valueScore, true) + '</div>';
    card.addEventListener("click", function () { openSpotlight(keeper); });
    grid.appendChild(card);
  });
  attachAvatarFallbacks(grid);
}

function openSpotlight(keeper) {
  rankView = "kept";
  renderSpotlight(keeper);
  document.getElementById("spotlight-overlay").classList.remove("hidden");
}

function renderSpotlight(keeper) {
  document.getElementById("spotlight-body").innerHTML =
    '<div class="spotlight-top">' + avatarHtml(keeper.owner, "large") +
      '<div><div class="eyebrow">' + keeper.season + ' KEEPER</div>' +
      '<div class="team-name">' + keeper.owner + '</div></div>' +
    '</div>' +
    '<div class="player-name">' + keeper.player + '</div>' +
    '<div class="spotlight-stats">' +
      '<div class="stat-box"><div class="label">Pick</div><div class="val">' + keeper.pick + '</div></div>' +
      '<div class="stat-box"><div class="label">ADP</div><div class="val">' + keeper.adp + '</div></div>' +
      '<div class="stat-box"><div class="label">Value</div><div class="val">' + scoreBoxHtml(keeper.valueScore, false) + '</div></div>' +
    '</div>' +
    '<div class="toggle-row">' +
      '<button class="toggle-pill ' + (rankView === "kept" ? "active" : "") + '" data-view="kept">Kept-year stats</button>' +
      '<button class="toggle-pill ' + (rankView === "prior" ? "active" : "") + '" data-view="prior">Year before stats</button>' +
    '</div>' +
    '<div class="rank-line">Positional rank pending real season stats</div>';

  attachAvatarFallbacks(document.getElementById("spotlight-body"));

  const pills = document.querySelectorAll(".toggle-pill");
  for (let i = 0; i < pills.length; i++) {
    pills[i].addEventListener("click", function () {
      rankView = this.dataset.view;
      renderSpotlight(keeper);
    });
  }
}

function closeSpotlight() {
  document.getElementById("spotlight-overlay").classList.add("hidden");
}

function renderAll() {
  renderPodium();
  renderKeeperGrid();
}

document.addEventListener("DOMContentLoaded", function () {
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      const val = btn.dataset.season;
      activeSeasonFilter = val === "all" ? "all" : Number(val);
      renderAll();
    });
  });
  renderAll();
  document.getElementById("close-spotlight").addEventListener("click", closeSpotlight);
  document.getElementById("spotlight-overlay").addEventListener("click", function (e) {
    if (e.target.id === "spotlight-overlay") closeSpotlight();
  });
});
