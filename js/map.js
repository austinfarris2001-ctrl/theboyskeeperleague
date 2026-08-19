// ============================================================
// HOMEPAGE MAP - renders an accurately-projected US map (D3 + real
// US Census geography via the us-atlas package) and pins each owner's
// avatar at their city. Uses d3.geoAlbersUsa(), the same standard
// projection used for virtually every US choropleth map, so Alaska/
// Hawaii-style distortion issues don't apply (we don't have anyone
// there anyway) and city placement is geographically accurate rather
// than a hand-approximated guess.
// ============================================================

function mapInitials(name) {
  return name.split(" ").map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase();
}

function renderMap(usTopoJson) {
  const container = document.getElementById("map-placeholder");
  container.innerHTML = "";
  container.style.padding = "0";
  container.style.textAlign = "left";

  const width = container.clientWidth || 900;
  const height = width * 0.62;

  const svg = d3.select(container).append("svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", "100%")
    .style("display", "block");

  const projection = d3.geoAlbersUsa().fitSize([width, height], topojson.feature(usTopoJson, usTopoJson.objects.states));
  const path = d3.geoPath().projection(projection);

  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(usTopoJson, usTopoJson.objects.states).features)
    .enter().append("path")
    .attr("d", path)
    .attr("fill", "#0f1626")
    .attr("stroke", "#1c5490")
    .attr("stroke-width", 1);

  // Group owners by city so people sharing a city get arranged in a
  // small cluster around the true point instead of stacking exactly on top.
  const byCity = {};
  Object.keys(OWNER_LOCATIONS).forEach(function (owner) {
    const loc = OWNER_LOCATIONS[owner];
    const key = loc.lat + "," + loc.lon;
    if (!byCity[key]) byCity[key] = [];
    byCity[key].push(owner);
  });

  const pinGroup = svg.append("g");

  Object.keys(byCity).forEach(function (key) {
    const owners = byCity[key];
    const loc = OWNER_LOCATIONS[owners[0]];
    const projected = projection([loc.lon, loc.lat]);
    if (!projected) return;
    const [cx, cy] = projected;

    owners.forEach(function (owner, i) {
      // arrange duplicates in a small ring around the true point
      const n = owners.length;
      const angle = (i / n) * Math.PI * 2;
      const spread = n > 1 ? 16 : 0;
      const px = cx + Math.cos(angle) * spread;
      const py = cy + Math.sin(angle) * spread;

      const g = pinGroup.append("g").attr("transform", "translate(" + px + "," + py + ")").style("cursor", "pointer");

      g.append("circle").attr("r", 15).attr("fill", "#0a0f1c").attr("stroke", "#38d0ff").attr("stroke-width", 2);

      const info = OWNER_AVATARS[owner];
      const clipId = "clip-" + owner.replace(/[^a-zA-Z0-9]/g, "");
      if (info) {
        svg.append("clipPath").attr("id", clipId).append("circle").attr("r", 14);
        const src = info.type === "url" ? info.value : "https://sleepercdn.com/avatars/thumbs/" + info.value;
        g.append("image")
          .attr("href", src)
          .attr("x", -14).attr("y", -14).attr("width", 28).attr("height", 28)
          .attr("clip-path", "url(#" + clipId + ")")
          .on("error", function () {
            d3.select(this).remove();
            g.append("text").attr("text-anchor", "middle").attr("dy", "0.35em")
              .attr("fill", "#38d0ff").attr("font-size", "11px").attr("font-weight", "700")
              .text(mapInitials(owner));
          });
      } else {
        g.append("text").attr("text-anchor", "middle").attr("dy", "0.35em")
          .attr("fill", "#38d0ff").attr("font-size", "11px").attr("font-weight", "700")
          .text(mapInitials(owner));
      }

      g.append("title").text(owner + " - " + loc.city);
    });
  });
}

function loadMapScripts(callback) {
  const scripts = [
    "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js",
    "https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js"
  ];
  let loaded = 0;
  scripts.forEach(function (src) {
    const s = document.createElement("script");
    s.src = src;
    s.onload = function () {
      loaded++;
      if (loaded === scripts.length) callback();
    };
    s.onerror = function () {
      document.getElementById("map-placeholder").textContent = "Couldn't load the map right now.";
    };
    document.head.appendChild(s);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadMapScripts(function () {
    fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then(function (res) { return res.json(); })
      .then(function (topo) { renderMap(topo); })
      .catch(function () {
        document.getElementById("map-placeholder").textContent = "Couldn't load the map right now.";
      });
  });
});
