// Shared helpers for the build scripts: read/write the ROUTE line in index.html,
// the app's geometry functions, and a polite Overpass client.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const INDEX = join(ROOT, "index.html");
const ROUTE_RE = /^const ROUTE=(\[\[.*\]\]);\r?$/m;

/** ROUTE as [[lat, lon, mile], ...], parsed from the single `const ROUTE=[...]` line. */
export async function readRoute(file = INDEX) {
  const html = await readFile(file, "utf8");
  const m = ROUTE_RE.exec(html);
  if (!m) throw new Error(`No "const ROUTE=[[...]];" line found in ${file}`);
  const route = JSON.parse(m[1]);
  if (!Array.isArray(route) || route.length < 2 || !route.every(p => p.length === 3 && p.every(Number.isFinite)))
    throw new Error("ROUTE isn't an array of [lat, lon, mile]");
  return route;
}

/** Replace only the ROUTE line in index.html (line endings and everything else untouched). */
export async function writeRoute(route, file = INDEX) {
  const html = await readFile(file, "utf8");
  if (!ROUTE_RE.test(html)) throw new Error("ROUTE line not found");
  const line = "const ROUTE=" + JSON.stringify(route) + ";";
  const out = html.replace(ROUTE_RE, (all) => line + (all.endsWith("\r") ? "\r" : ""));
  await writeFile(file, out);
}

/** Same math as gFromLatLon in index.html; also returns the segment index. */
export function gFromLatLon(route, lat, lon) {
  const c = Math.cos(lat * Math.PI / 180);
  let best = { d: 1e9, g: 0, i: 1 };
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1], b = route[i];
    const ax = (a[1] - lon) * c, ay = a[0] - lat, bx = (b[1] - lon) * c, by = b[0] - lat;
    const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy || 1;
    let t = -(ax * dx + ay * dy) / L2; t = Math.max(0, Math.min(1, t));
    const px = ax + dx * t, py = ay + dy * t, d = Math.hypot(px, py) * 69;
    if (d < best.d) best = { d, g: a[2] + (b[2] - a[2]) * t, i };
  }
  return best;
}

/** Same as routeAt in index.html. */
export function routeAt(route, g) {
  const last = route[route.length - 1];
  g = Math.max(route[0][2], Math.min(last[2], g));
  for (let i = 1; i < route.length; i++) {
    const a = route[i - 1], b = route[i];
    if (g <= b[2]) { const t = (g - a[2]) / (b[2] - a[2] || 1); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  }
  return last.slice(0, 2);
}

export function miles(lat1, lon1, lat2, lon2) {
  const r = Math.PI / 180, dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 2 * 3958.8 * Math.asin(Math.sqrt(h));
}

export const sleep = ms => new Promise(r => setTimeout(r, ms));

const UA = "roadpacenotes.com route builder (+https://roadpacenotes.com)";

/**
 * POST a query to Overpass, one at a time, retrying 429/5xx with backoff.
 * If cacheDir is set, responses are saved there by key and reused on later runs.
 * Returns { data, fresh } (fresh = actually fetched).
 */
export async function overpass(query, { label = "query", url = process.env.OVERPASS_URL || "https://overpass-api.de/api/interpreter", cacheDir = process.env.OVERPASS_CACHE || "", key } = {}) {
  const cacheFile = cacheDir && key ? join(cacheDir, key + ".json") : "";
  if (cacheFile) {
    try { return { data: JSON.parse(await readFile(cacheFile, "utf8")), fresh: false }; } catch { /* not cached */ }
  }
  for (let attempt = 0, wait = 15000; ; attempt++, wait *= 2) {
    let status = 0, text = "";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body: "data=" + encodeURIComponent(query),
      });
      status = res.status; text = await res.text();
    } catch (e) { text = String(e); }
    if (status === 200) {
      try {
        const data = JSON.parse(text);
        if (cacheFile) { await mkdir(cacheDir, { recursive: true }); await writeFile(cacheFile, JSON.stringify(data)); }
        return { data, fresh: true };
      } catch { /* truncated body: retry */ }
    }
    if (![0, 200, 429, 502, 503, 504].includes(status) || attempt >= 6) throw new Error(`${label}: HTTP ${status} ${text.slice(0, 300)}`);
    console.warn(`  ${label}: HTTP ${status}, retrying in ${wait / 1000}s`);
    await sleep(wait);
  }
}
