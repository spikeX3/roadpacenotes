#!/usr/bin/env node
// Builds data/exits.json for Road Pace Notes' "Next Exit" panel from OpenStreetMap
// (Overpass API). Node 20+, no dependencies.
//
//   node scripts/build-exits.mjs            # writes data/exits.json
//   OVERPASS_URL=https://... node scripts/build-exits.mjs
//
// Data © OpenStreetMap contributors, available under the ODbL.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OVERPASS = process.env.OVERPASS_URL || "https://overpass-api.de/api/interpreter";
const UA = "roadpacenotes.com exits builder (+https://roadpacenotes.com)";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "exits.json");

// Copied from index.html. [lat, lon, global mile]; 0 = Ontario CA, 1265 = Walla Walla.
const ROUTE=[[34.06,-117.65,0],[34.15,-118.1,25],[34.33,-118.5,55],[34.8,-118.86,80],[34.94,-118.92,95],[35.3,-119.2,125],[36.0,-119.96,200],[36.25,-120.24,225],[36.62,-120.6,250],[37.1,-121.02,290],[37.95,-121.3,360],[38.58,-121.49,405],[38.68,-121.77,425],[39.15,-122.15,465],[40.18,-122.24,535],[40.59,-122.39,565],[40.78,-122.32,580],[41.15,-122.32,615],[41.31,-122.31,635],[41.42,-122.38,645],[41.73,-122.63,680],[42.07,-122.6,712],[42.19,-122.7,727],[42.39,-122.92,737],[42.41,-123.13,745],[42.44,-123.33,762],[42.7,-123.38,790],[43.22,-123.35,828],[44.05,-123.09,907],[44.63,-123.07,946],[44.94,-123.04,964],[45.25,-122.89,995],[45.38,-122.76,1012],[45.43,-122.57,1025],[45.55,-122.55,1035],[45.58,-122.12,1063],[45.7,-121.52,1095],[45.6,-121.18,1115],[45.67,-120.83,1135],[45.92,-119.34,1225],[46.08,-118.9,1245],[46.06,-118.34,1265]];

const BOXES = 10;          // corridor split
const PAD_KM = 3;          // bbox padding
const NEAR_M = 1200;       // amenity search radius around a junction
const MAX_OFF_MI = 2;      // drop exits farther than this from the ROUTE line
const MERGE_MI = 1;        // merge same-ref junctions (both directions) within this
const PER_CAT = 6;         // places kept per category per exit
const PAUSE_MS = 2000;

const FREEWAYS = ["I 5", "I 205", "I 84", "I 210", "CA 210"];
// Which freeway the trip is on along each stretch of global miles. Keeps I-5's
// downtown-Portland exits (and other crossing freeways inside a bbox) out.
const LEGS = [
  [0, 56, ["I 210", "CA 210"]],
  [50, 1015, ["I 5"]],
  [1008, 1040, ["I 205"]],
  [1030, 1265, ["I 84"]],
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---------- geometry (same math as gFromLatLon in index.html) ----------
function gFromLatLon(lat, lon) {
  const c = Math.cos(lat * Math.PI / 180);
  let best = { d: 1e9, g: 0, i: 1 };
  for (let i = 1; i < ROUTE.length; i++) {
    const a = ROUTE[i - 1], b = ROUTE[i];
    const ax = (a[1] - lon) * c, ay = a[0] - lat, bx = (b[1] - lon) * c, by = b[0] - lat;
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1;
    let t = -(ax * dx + ay * dy) / L2; t = Math.max(0, Math.min(1, t));
    const px = ax + dx * t, py = ay + dy * t, d = Math.hypot(px, py) * 69;
    if (d < best.d) best = { d, g: a[2] + (b[2] - a[2]) * t, i };
  }
  return best;
}
function miles(lat1, lon1, lat2, lon2) {
  const r = Math.PI / 180, dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 2 * 3958.8 * Math.asin(Math.sqrt(h));
}
// Side of the freeway a place is on, as a compass letter. The route runs N–S for
// most of the trip (E/W), but east–west through the Columbia Gorge (N/S).
function sideOf(exit, segI, lat, lon) {
  const a = ROUTE[segI - 1], b = ROUTE[segI], c = Math.cos(exit.lat * Math.PI / 180);
  const tx = (b[1] - a[1]) * c, ty = b[0] - a[0];                    // tangent, increasing g
  const px = (lon - exit.lon) * c, py = lat - exit.lat;
  const n = Math.hypot(tx, ty) || 1, rx = ty / n, ry = -tx / n;       // right-hand normal
  const s = Math.sign(px * rx + py * ry) || 1;
  const vx = rx * s, vy = ry * s;                                     // normal towards place
  return Math.abs(vx) >= Math.abs(vy) ? (vx > 0 ? "E" : "W") : (vy > 0 ? "N" : "S");
}

function boxes() {
  const n = ROUTE.length, per = Math.ceil((n - 1) / BOXES), out = [];
  for (let s = 0; s < n - 1; s += per) {
    const pts = ROUTE.slice(s, Math.min(n, s + per + 1));
    const lats = pts.map(p => p[0]), lons = pts.map(p => p[1]);
    const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const dLat = PAD_KM / 111, dLon = PAD_KM / (111 * Math.cos(midLat * Math.PI / 180));
    out.push([Math.min(...lats) - dLat, Math.min(...lons) - dLon, Math.max(...lats) + dLat, Math.max(...lons) + dLon].map(v => +v.toFixed(4)));
  }
  return out;
}

// ---------- Overpass ----------
async function overpass(query, label) {
  for (let attempt = 0, wait = 15000; ; attempt++, wait *= 2) {
    let res, text;
    try {
      res = await fetch(OVERPASS, {
        method: "POST",
        headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body: "data=" + encodeURIComponent(query),
      });
      text = await res.text();
    } catch (e) {
      res = { status: 0 }; text = String(e);
    }
    if (res.status === 200) {
      try { return JSON.parse(text); } catch { /* fall through and retry */ }
    }
    const retryable = [0, 200, 429, 502, 503, 504].includes(res.status);
    if (!retryable || attempt >= 5) throw new Error(`${label}: HTTP ${res.status} ${text.slice(0, 300)}`);
    console.warn(`  ${label}: HTTP ${res.status}, retrying in ${wait / 1000}s`);
    await sleep(wait);
  }
}

const refRe = `(^|;) *(${FREEWAYS.join("|")}) *(;|$)`;
const queryFor = ([s, w, n, e]) => `[out:json][timeout:300];
way["highway"="motorway"]["ref"~"${refRe}"](${s},${w},${n},${e})->.fw;
.fw out body qt;
node(w.fw)["highway"="motorway_junction"]->.j;
.j out body qt;
(
  nwr["amenity"~"^(fuel|fast_food|restaurant|cafe|toilets|charging_station)$"](around.j:${NEAR_M});
  nwr["tourism"~"^(hotel|motel|attraction|viewpoint|museum)$"](around.j:${NEAR_M});
  nwr["shop"~"^(supermarket|convenience)$"](around.j:${NEAR_M});
);
out center tags qt;`;

// ---------- classification ----------
function category(t) {
  switch (t.amenity) {
    case "fuel": return "gas";
    case "fast_food": case "restaurant": return "food";
    case "cafe": return "coffee";
    case "toilets": return "restroom";
    case "charging_station": return "ev";
  }
  switch (t.tourism) {
    case "hotel": case "motel": return "lodging";
    case "attraction": case "viewpoint": case "museum": return "sight";
  }
  if (t.shop === "supermarket" || t.shop === "convenience") return "grocery";
  return null;
}
const freewaysOf = ref => (ref || "").split(";").map(s => s.trim()).filter(r => FREEWAYS.includes(r));
const allowedAt = g => new Set(LEGS.filter(([a, b]) => g >= a && g <= b).flatMap(l => l[2]));

// ---------- main ----------
async function main() {
  const bbs = boxes();
  const junctions = new Map(), places = new Map(), nodeFw = new Map();
  for (let k = 0; k < bbs.length; k++) {
    const label = `box ${k + 1}/${bbs.length}`;
    console.log(`${label} ${bbs[k].join(",")}`);
    const data = await overpass(queryFor(bbs[k]), label);
    let nj = 0, np = 0;
    for (const el of data.elements) {
      const t = el.tags || {};
      if (el.type === "way" && t.highway === "motorway") {
        const fws = freewaysOf(t.ref);
        for (const nd of el.nodes || []) {
          const s = nodeFw.get(nd) || new Set(); fws.forEach(f => s.add(f)); nodeFw.set(nd, s);
        }
      } else if (el.type === "node" && t.highway === "motorway_junction") {
        junctions.set(el.id, { id: el.id, lat: el.lat, lon: el.lon, ref: t.ref || "", name: t.name || t["exit_to"] || t.destination || "" }); nj++;
      } else {
        const cat = category(t);
        if (!cat || t.access === "private" || t.access === "no") continue;
        const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
        if (lat == null) continue;
        places.set(el.type + el.id, { cat, lat, lon, t }); np++;
      }
    }
    console.log(`  ${nj} junctions, ${np} places`);
    if (k < bbs.length - 1) await sleep(PAUSE_MS);
  }

  // Junctions → candidate exits on the route.
  let cands = [];
  for (const j of junctions.values()) {
    if (!j.ref && !j.name) continue;
    const p = gFromLatLon(j.lat, j.lon);
    if (p.d > MAX_OFF_MI) continue;
    const fws = nodeFw.get(j.id) || new Set(), ok = allowedAt(p.g);
    if (![...fws].some(f => ok.has(f))) continue;
    cands.push({ ...j, g: p.g, fw: [...fws].find(f => ok.has(f)) });
  }
  cands.sort((a, b) => a.g - b.g);

  // Merge NB/SB nodes of the same exit.
  const exits = [];
  for (const c of cands) {
    const key = c.ref ? "r:" + c.ref : "n:" + c.name;
    const m = exits.find(e => e.key === key && e.fw === c.fw && Math.abs(e.g - c.g) <= MERGE_MI);
    if (m) {
      m.members.push(c);
      if (!m.names.includes(c.name) && c.name) m.names.push(c.name);
    } else exits.push({ key, fw: c.fw, ref: c.ref, g: c.g, members: [c], names: c.name ? [c.name] : [] });
  }

  const allPlaces = [...places.values()];
  const out = exits.map(e => {
    const lat = e.members.reduce((s, m) => s + m.lat, 0) / e.members.length;
    const lon = e.members.reduce((s, m) => s + m.lon, 0) / e.members.length;
    const proj = gFromLatLon(lat, lon);
    const ex = { lat, lon };
    const near = [];
    for (const p of allPlaces) {
      // fast reject before haversine
      if (Math.abs(p.lat - lat) > 0.02 || Math.abs(p.lon - lon) > 0.03) continue;
      const d = Math.min(...e.members.map(m => miles(m.lat, m.lon, p.lat, p.lon)));
      if (d * 1609.34 > NEAR_M) continue;
      const t = p.t, o = {
        name: t.name || null, brand: t.brand || null, category: p.cat,
        lat: +p.lat.toFixed(5), lon: +p.lon.toFixed(5), dist: +d.toFixed(2),
        side: sideOf(ex, proj.i, p.lat, p.lon),
      };
      if (t.opening_hours) o.opening_hours = t.opening_hours;
      if (p.cat === "gas" && t["fuel:diesel"]) o.diesel = t["fuel:diesel"];
      if (p.cat === "sight" || p.cat === "lodging") o.kind = t.tourism;
      if (p.cat === "grocery") o.kind = t.shop;
      if (p.cat === "food") o.kind = t.amenity;
      // Unnamed food/lodging/grocery/sights are rarely useful; keep unnamed gas/restrooms/EV.
      if (!o.name && !o.brand && ["food", "lodging", "grocery", "sight", "coffee"].includes(p.cat)) continue;
      near.push(o);
    }
    near.sort((a, b) => a.dist - b.dist);
    const per = {}, kept = [];
    for (const p of near) {
      // de-dupe the same business mapped as node + building
      if (kept.some(k => k.category === p.category && (k.name || k.brand) === (p.name || p.brand) && miles(k.lat, k.lon, p.lat, p.lon) < 0.08)) continue;
      if ((per[p.category] = (per[p.category] || 0) + 1) > PER_CAT) continue;
      kept.push(p);
    }
    return {
      ref: e.ref, name: e.names.join(" / ") || null, hwy: e.fw, g: +proj.g.toFixed(2),
      lat: +lat.toFixed(5), lon: +lon.toFixed(5), places: kept,
    };
  }).sort((a, b) => a.g - b.g);

  if (out.length < 50) throw new Error(`Only ${out.length} exits found; refusing to trust this run`);
  const doc = { generated: new Date().toISOString(), source: "© OpenStreetMap contributors (ODbL)", exits: out };
  const json = JSON.stringify(doc);
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, json + "\n");
  const nPlaces = out.reduce((s, e) => s + e.places.length, 0);
  console.log(`Wrote ${OUT}: ${out.length} exits, ${nPlaces} places, ${(json.length / 1024).toFixed(0)} KB`);
  if (json.length > 1.5 * 1024 * 1024) console.warn("Warning: output is over 1.5 MB");
}

main().catch(e => { console.error(e); process.exit(1); });
