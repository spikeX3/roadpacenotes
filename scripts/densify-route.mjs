#!/usr/bin/env node
// Densifies ROUTE in js/app.js with real freeway geometry from OpenStreetMap
// (Overpass API). Node 20+, no dependencies.
//
//   node scripts/densify-route.mjs            # rewrites the ROUTE line in js/app.js
//   node scripts/densify-route.mjs --dry-run  # report only
//   OVERPASS_CACHE=.overpass-cache node scripts/densify-route.mjs   # reuse saved responses
//   DEBUG_PATHS=paths.json ...                   # also dump the raw road path per anchor pair
//
// Anchors: every ROUTE point with a whole-number mile (the original hand-made
// points) keeps its mile value exactly; the app's STOPS, SPOTS, TOWNS, TOUR, PASSES,
// WX and planner are keyed to those miles. Points added between two anchors get
// miles in proportion to real road distance, rounded to 0.01 and never to a whole
// number, so a re-run finds the same anchors.
//
// Road data © OpenStreetMap contributors, ODbL.

import { readRoute, writeRoute, miles, overpass, sleep } from "./lib/route.mjs";

const DRY = process.argv.includes("--dry-run");
const PAD_KM = 15;        // the old line sits up to ~8 mi (13 km) off the road
const BOXES = 10;
const SNAP_ANCHOR_MI = 8; // interior anchors move onto the road (mile unchanged) if it's this close
const LINK_M = 1000;      // bridge gaps between dead-end ways (freeway-to-freeway ramps) up to this
const MAX_GAP_MI = 2;     // at least one point every this many miles
const MAX_POINTS = 1000;

// Which roads the trip follows between anchor miles. A pair of anchors uses every
// leg it overlaps.
const LEGS = [
  [0, 55, ["I 210", "CA 210"]],          // Ontario → Sylmar
  [25, 1012, ["I 5"]],                   // Sylmar → Tualatin (I-205 split)
  [1012, 1035, ["I 205"]],               // Portland bypass
  [1035, 1225, ["I 84"]],                // → exit 168
  [1135, 1245, ["US 730"]],              // exit 168 → Umatilla → Wallula
  [1225, 1265, ["US 12"]],               // Wallula → Walla Walla
];
const REFS = [...new Set(LEGS.flatMap(l => l[2]))];

const refsFor = (ga, gb) => new Set(LEGS.filter(([a, b]) => Math.min(b, gb) - Math.max(a, ga) > 0).flatMap(l => l[2]));
const wayRefs = ref => (ref || "").split(";").map(s => s.trim()).filter(r => REFS.includes(r));
const key = (lat, lon) => lat.toFixed(7) + "," + lon.toFixed(7);
const M_PER_MI = 1609.344;

function bbox(pts, padKm) {
  const lats = pts.map(p => p[0]), lons = pts.map(p => p[1]);
  const mid = (Math.min(...lats) + Math.max(...lats)) / 2;
  const dLat = padKm / 111, dLon = padKm / (111 * Math.cos(mid * Math.PI / 180));
  return [Math.min(...lats) - dLat, Math.min(...lons) - dLon, Math.max(...lats) + dLat, Math.max(...lons) + dLon];
}
const inBox = (b, lat, lon) => lat >= b[0] && lat <= b[2] && lon >= b[1] && lon <= b[3];

// ---------- tiny binary heap ----------
class Heap {
  constructor() { this.a = []; }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i) { const p = (i - 1) >> 1; if (a[p][0] <= a[i][0]) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && a[l][0] < a[m][0]) m = l; if (r < a.length && a[r][0] < a[m][0]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } }
    return top;
  }
  get size() { return this.a.length; }
}

// ---------- Douglas–Peucker on [lat, lon] (meters, local projection) ----------
function simplify(pts, tolM, keep) {
  const n = pts.length; if (n < 3) return pts.map((_, i) => i);
  const c = Math.cos(pts[0][0] * Math.PI / 180), K = 111320;
  const xy = pts.map(p => [p[1] * c * K, p[0] * K]);
  const mark = new Uint8Array(n); mark[0] = mark[n - 1] = 1;
  keep.forEach(i => mark[i] = 1);
  const stack = [];
  // split on forced points first
  const forced = [...mark.keys()].filter(i => mark[i]);
  for (let k = 1; k < forced.length; k++) stack.push([forced[k - 1], forced[k]]);
  while (stack.length) {
    const [s, e] = stack.pop(); if (e - s < 2) continue;
    const [x1, y1] = xy[s], [x2, y2] = xy[e], dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1;
    let best = -1, bd = 0;
    for (let i = s + 1; i < e; i++) {
      let t = ((xy[i][0] - x1) * dx + (xy[i][1] - y1) * dy) / L2; t = Math.max(0, Math.min(1, t));
      const d = Math.hypot(xy[i][0] - (x1 + t * dx), xy[i][1] - (y1 + t * dy));
      if (d > bd) { bd = d; best = i; }
    }
    if (bd > tolM) { mark[best] = 1; stack.push([s, best], [best, e]); }
  }
  return [...mark.keys()].filter(i => mark[i]);
}

async function main() {
  const route = await readRoute();
  const anchors = route.filter(p => Number.isInteger(p[2]));
  console.log(`ROUTE: ${route.length} points, ${anchors.length} anchors (whole-number miles), miles ${anchors[0][2]}–${anchors.at(-1)[2]}`);

  // ---- fetch road geometry in ~10 corridor boxes ----
  const per = Math.ceil((anchors.length - 1) / BOXES), boxes = [];
  for (let s = 0; s < anchors.length - 1; s += per) boxes.push(bbox(anchors.slice(s, Math.min(anchors.length, s + per + 1)), PAD_KM).map(v => +v.toFixed(3)));
  const refRe = `(^|;) *(${REFS.join("|")}) *(;|$)`;
  const ways = new Map();
  for (let k = 0; k < boxes.length; k++) {
    const [s, w, n, e] = boxes[k], label = `box ${k + 1}/${boxes.length}`;
    console.log(`${label} ${boxes[k].join(",")}`);
    const q = `[out:json][timeout:300];way["highway"~"^(motorway|trunk|primary)$"]["ref"~"${refRe}"](${s},${w},${n},${e});out geom qt;`;
    const { data, fresh } = await overpass(q, { label, key: "route-" + boxes[k].join("_") });
    let c = 0;
    for (const el of data.elements) if (el.type === "way" && el.geometry) { ways.set(el.id, { refs: wayRefs(el.tags?.ref), geom: el.geometry.map(g => [g.lat, g.lon]) }); c++; }
    console.log(`  ${c} ways${fresh ? "" : " (cached)"}`);
    if (fresh && k < boxes.length - 1) await sleep(2000);
  }

  // ---- route each anchor pair along the allowed roads ----
  const out = [];
  const report = [];
  const snapped = new Map(); // anchor index -> [lat, lon]
  const pairs = [];
  for (let i = 1; i < anchors.length; i++) {
    const A = anchors[i - 1], B = anchors[i], refs = refsFor(A[2], B[2]);
    const box = bbox([A, B], PAD_KM);
    // graph
    const nodes = new Map(); // key -> {lat, lon, adj: Map(key -> m), deg}
    const node = (lat, lon) => { const k = key(lat, lon); let n = nodes.get(k); if (!n) nodes.set(k, n = { k, lat, lon, adj: new Map(), ends: 0 }); return n; };
    const link = (a, b, m) => { if (a === b) return; const o = a.adj.get(b.k); if (o == null || m < o) { a.adj.set(b.k, m); b.adj.set(a.k, m); } };
    for (const w of ways.values()) {
      if (!w.refs.some(r => refs.has(r))) continue;
      if (!w.geom.some(([la, lo]) => inBox(box, la, lo))) continue;
      let prev = null;
      w.geom.forEach(([la, lo], j) => {
        const n = node(la, lo);
        if (j === 0 || j === w.geom.length - 1) n.ends++;
        if (prev) link(prev, n, miles(prev.lat, prev.lon, la, lo) * M_PER_MI);
        prev = n;
      });
    }
    // bridge dead ends (ramps between freeways, split carriageways) to the nearest other node
    const cell = 0.01, grid = new Map(), gk = (la, lo) => Math.floor(la / cell) + ":" + Math.floor(lo / cell);
    for (const n of nodes.values()) { const k = gk(n.lat, n.lon); (grid.get(k) || grid.set(k, []).get(k)).push(n); }
    for (const n of nodes.values()) {
      if (n.adj.size > 1) continue; // only dead ends
      let best = null, bd = LINK_M;
      const ci = Math.floor(n.lat / cell), cj = Math.floor(n.lon / cell);
      for (let di = -1; di <= 1; di++) for (let dj = -2; dj <= 2; dj++) for (const o of grid.get((ci + di) + ":" + (cj + dj)) || []) {
        if (o === n || n.adj.has(o.k)) continue;
        const d = miles(n.lat, n.lon, o.lat, o.lon) * M_PER_MI;
        if (d < bd) { bd = d; best = o; }
      }
      if (best) link(n, best, bd * 1.5);
    }
    if (!nodes.size) throw new Error(`No road geometry for miles ${A[2]}–${B[2]} (${[...refs]})`);
    // Start and end on whichever carriageway suits: every node within END_SLACK_MI of an
    // anchor's nearest node is a possible start/end. (With only the single nearest
    // node, a path could run past the anchor to the next median crossing and back.)
    const END_SLACK_MI = 0.3;
    const near = (lat, lon) => {
      const all = [...nodes.values()].map(n => [n, miles(lat, lon, n.lat, n.lon)]);
      const min = Math.min(...all.map(x => x[1]));
      return { min, list: all.filter(x => x[1] <= min + END_SLACK_MI) };
    };
    const sN = near(A[0], A[1]), tN = near(B[0], B[1]);
    const T = "__end", ends = new Map(tN.list.map(([n, d]) => [n.k, d * M_PER_MI]));
    // Dijkstra from all start candidates (cost = distance from the anchor) to the virtual end
    const dist = new Map(), prev = new Map(), h = new Heap();
    for (const [n, d] of sN.list) { const c = d * M_PER_MI; if (c < (dist.get(n.k) ?? Infinity)) { dist.set(n.k, c); h.push([c, n.k]); } }
    while (h.size) {
      const [d, k] = h.pop(); if (k === T) break; if (d > dist.get(k)) continue;
      const step = (k2, m) => { const nd = d + m; if (nd < (dist.get(k2) ?? Infinity)) { dist.set(k2, nd); prev.set(k2, k); h.push([nd, k2]); } };
      for (const [k2, m] of nodes.get(k).adj) step(k2, m);
      if (ends.has(k)) step(T, ends.get(k));
    }
    if (!dist.has(T)) throw new Error(`No connected road between miles ${A[2]} and ${B[2]} (${[...refs]}); try a larger LINK_M`);
    const path = []; for (let k = prev.get(T); k != null; k = prev.get(k)) { const n = nodes.get(k); path.push([n.lat, n.lon]); }
    path.reverse();
    let roadMi = 0; for (let j = 1; j < path.length; j++) roadMi += miles(path[j - 1][0], path[j - 1][1], path[j][0], path[j][1]);
    pairs.push({ A, B, i, path, sd: sN.min, td: tN.min, refs: [...refs], roadMi });
  }

  // ---- anchors: endpoints stay put; interior anchors move onto the road when it's close ----
  anchors.forEach((p, i) => {
    if (i === 0 || i === anchors.length - 1) { snapped.set(i, [p[0], p[1]]); return; }
    const end = pairs[i - 1].path.at(-1), start = pairs[i].path[0];
    const cand = miles(p[0], p[1], end[0], end[1]) <= miles(p[0], p[1], start[0], start[1]) ? end : start;
    const d = miles(p[0], p[1], cand[0], cand[1]);
    snapped.set(i, d <= SNAP_ANCHOR_MI ? cand : [p[0], p[1]]);
    report.push({ mile: p[2], movedMi: d <= SNAP_ANCHOR_MI ? d : 0, offRoadMi: d });
  });

  // ---- build, simplify, enforce spacing, assign miles ----
  const build = tolM => {
    const pts = [];
    pairs.forEach(({ A, B, i, path }) => {
      const a = snapped.get(i - 1), b = snapped.get(i);
      const line = [a, ...path, b].filter((p, j, arr) => j === 0 || p[0] !== arr[j - 1][0] || p[1] !== arr[j - 1][1]);
      const cum = [0]; for (let j = 1; j < line.length; j++) cum.push(cum[j - 1] + miles(line[j - 1][0], line[j - 1][1], line[j][0], line[j][1]));
      const total = cum.at(-1) || 1;
      const keep = simplify(line, tolM, []);
      // at least one point every MAX_GAP_MI of road, interpolated along the road
      const at = c => { let j = 1; while (j < cum.length - 1 && cum[j] < c) j++; const t = (c - cum[j - 1]) / ((cum[j] - cum[j - 1]) || 1); return [line[j - 1][0] + (line[j][0] - line[j - 1][0]) * t, line[j - 1][1] + (line[j][1] - line[j - 1][1]) * t]; };
      const seq = [{ p: line[keep[0]], c: cum[keep[0]], j: keep[0] }];
      for (let k = 1; k < keep.length; k++) {
        const c0 = cum[keep[k - 1]], c1 = cum[keep[k]], n = Math.ceil((c1 - c0) / MAX_GAP_MI) - 1;
        for (let q = 1; q <= n; q++) { const c = c0 + (c1 - c0) * q / (n + 1); seq.push({ p: at(c), c, j: -1 }); }
        seq.push({ p: line[keep[k]], c: c1, j: keep[k] });
      }
      seq.forEach((o, idx) => {
        if (idx === 0 && pts.length) return; // shared anchor
        const isA = o.j === 0, isB = o.j === line.length - 1;
        let mile = isA ? A[2] : isB ? B[2] : A[2] + (B[2] - A[2]) * o.c / total;
        if (!isA && !isB) { mile = Math.round(mile * 100) / 100; if (Number.isInteger(mile)) mile += mile < B[2] - 0.01 ? 0.01 : -0.01; mile = +mile.toFixed(2); }
        pts.push([+o.p[0].toFixed(4), +o.p[1].toFixed(4), mile]);
      });
    });
    // drop any non-anchor point that doesn't strictly increase in miles
    return pts.filter((p, j) => j === 0 || p[2] > pts[j - 1][2] || Number.isInteger(p[2]));
  };
  let lo = 5, hi = 2000, best = null;
  for (let it = 0; it < 18; it++) {
    const mid = (lo + hi) / 2, r = build(mid);
    if (r.length <= MAX_POINTS) { best = { tol: mid, r }; hi = mid; } else lo = mid;
  }
  if (!best) throw new Error("Couldn't get under MAX_POINTS");
  const dense = best.r;

  // ---- checks ----
  const anchorMiles = anchors.map(p => p[2]), outAnchors = dense.filter(p => Number.isInteger(p[2])).map(p => p[2]);
  if (JSON.stringify(anchorMiles) !== JSON.stringify(outAnchors)) throw new Error("Anchor miles changed!");
  for (let j = 1; j < dense.length; j++) if (!(dense[j][2] > dense[j - 1][2])) throw new Error(`Miles not increasing at ${j}: ${dense[j - 1][2]} → ${dense[j][2]}`);
  let maxGap = 0; for (let j = 1; j < dense.length; j++) maxGap = Math.max(maxGap, miles(dense[j - 1][0], dense[j - 1][1], dense[j][0], dense[j][1]));

  console.log(`\nDensified: ${route.length} → ${dense.length} points (simplify tolerance ${best.tol.toFixed(0)} m, longest gap ${maxGap.toFixed(2)} mi)`);
  console.log("Road distance vs ROUTE miles per anchor pair (ratio far from 1 means the old miles are stretched or squeezed):");
  pairs.forEach(p => {
    const crow = miles(p.A[0], p.A[1], p.B[0], p.B[1]), wind = p.roadMi / (crow || 1);
    console.log(`  ${String(p.A[2]).padStart(4)}–${String(p.B[2]).padEnd(4)} ${p.refs.join("/").padEnd(16)} road ${p.roadMi.toFixed(1).padStart(6)} mi vs ${String(p.B[2] - p.A[2]).padStart(3)} listed (${(p.roadMi / (p.B[2] - p.A[2])).toFixed(2)}), straight line ${crow.toFixed(1).padStart(5)} (road/straight ${wind.toFixed(2)})${wind > 1.45 ? "  <-- check" : ""}`);
  });
  const moved = report.filter(r => r.movedMi > 0.05).sort((a, b) => b.movedMi - a.movedMi);
  console.log(`Anchors moved onto the road: ${moved.length}; largest: ${moved.slice(0, 6).map(r => `mile ${r.mile} ${r.movedMi.toFixed(2)} mi`).join(", ")}`);
  const far = report.filter(r => r.offRoadMi > SNAP_ANCHOR_MI); if (far.length) console.warn(`Anchors left in place (> ${SNAP_ANCHOR_MI} mi from the road): ${far.map(r => r.mile).join(", ")}`);

  if (process.env.DEBUG_PATHS) await (await import("node:fs/promises")).writeFile(process.env.DEBUG_PATHS, JSON.stringify(pairs.map(p => ({ a: p.A[2], b: p.B[2], path: p.path }))));
  if (DRY) { console.log("Dry run: js/app.js not changed."); return; }
  await writeRoute(dense);
  console.log(`Wrote ROUTE (${dense.length} points) to js/app.js`);
}

main().catch(e => { console.error(e); process.exit(1); });
