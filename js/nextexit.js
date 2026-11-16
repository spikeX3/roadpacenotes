/* Road Pace Notes · Next Exit
   Floating "NEXT EXIT" pill, an exit panel (bottom sheet on phones, side panel on
   desktop) and a drive-mode card, fed by data/exits.json (OpenStreetMap).
   Uses the app's globals: ROUTE, R, PLAN, S, store, STOPS, SPOTS, TOUR, PASSES,
   FILLPRICE, FUEL, MPH, TANK, RESERVE, DRV, MOB, curDay, gFromLatLon, dayOf,
   passVerdict, shortName, speak, esc. */
(function () {
  "use strict";
  if (typeof R === "undefined" || typeof ROUTE === "undefined") { console.warn("Next Exit: app globals missing; not starting."); return; }

  // 24×24 line icons in the style of the app's tab bar (stroke = currentColor).
  const ICON_PATHS = {
    gas: '<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M6 9h6"/><path d="M14 10h2a2 2 0 0 1 2 2v4a1.5 1.5 0 0 0 3 0V8l-3-3"/>',
    food: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1-3 4-3 7 0 2 1 3 3 3v8"/>',
    coffee: '<path d="M4 9h12v4a6 6 0 0 1-6 6h0a6 6 0 0 1-6-6z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3M4 21h12"/>',
    restroom: '<circle cx="7" cy="4.5" r="1.8"/><circle cx="17" cy="4.5" r="1.8"/><path d="M7 9v12M4.5 9h5M17 9l-3 7h6l-3-7M17 16v5M12 3v18"/>',
    ev: '<path d="M13 2 5 14h6l-1 8 8-12h-6z"/>',
    lodging: '<path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11.5" r="2"/>',
    sight: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    grocery: '<path d="M3 4h2l2.4 11h10.2L20 8H6.2"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
    speak: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    nav: '<path d="M3 11 21 3l-8 18-2-8z"/>',
  };
  const icon = (k, cls = "nx-ic") => `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICON_PATHS[k]}</svg>`;
  const CATS = [
    ["gas", "Gas"], ["food", "Food"], ["coffee", "Coffee"], ["restroom", "Restrooms"],
    ["ev", "EV charging"], ["lodging", "Lodging"], ["sight", "Sights"], ["grocery", "Groceries"],
  ];
  const CAT = Object.fromEntries(CATS.map(c => [c[0], { t: c[1] }]));
  const JUMPS = [["gas", "Next gas"], ["food", "Next food"], ["restroom", "Next restroom"]];
  const SIDE = { E: "east side", W: "west side", N: "north side", S: "south side" };
  const BADGE_MI = 2, GPS_MAX_OFF = 15, GPS_STALE_MS = 120000, DRIVER_SPEED = 4.5;
  const TAP_WINDOW_MS = 10 * 60 * 1000; // high-accuracy GPS for this long after the pill is tapped

  const NX = {
    data: null, list: [], sel: -1, open: false, mode: null /* manual 'driver'|'passenger' */,
    gps: null, watch: null, lastFocus: null, built: false,
    watchHi: null, allowed: false, paused: false, tapAt: 0, tapTimer: null, ask: false,
  };
  window.NEXTEXIT = NX; // handy for debugging in the console

  /* ---------- helpers ---------- */
  const q = s => document.querySelector(s);
  const h = t => (typeof esc === "function" ? esc(t) : String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])));
  const fmtMi = m => { m = Math.abs(m); return m < 0.95 ? `${m.toFixed(1)} mi` : `${Math.round(m)} mi`; };
  const fmtMin = m => { const t = Math.max(1, Math.round(Math.abs(m) / MPH * 60)); return t < 60 ? `≈${t} min` : `≈${Math.floor(t / 60)} h ${String(t % 60).padStart(2, "0")} min`; };
  const nav = (lat, lon) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  // Names for places OSM left unnamed: brand if it's a real one (not "B"), otherwise
  // "{kind} · {side} side", plus opening hours when known.
  const KIND = {
    gas: "Gas station", coffee: "Café", restroom: "Restroom", ev: "EV charger",
    food: { fast_food: "Fast food", restaurant: "Restaurant", _: "Restaurant" },
    lodging: { hotel: "Hotel", motel: "Motel", _: "Lodging" },
    sight: { attraction: "Attraction", viewpoint: "Viewpoint", museum: "Museum", _: "Sight" },
    grocery: { supermarket: "Supermarket", convenience: "Convenience store", _: "Store" },
  };
  const goodBrand = b => (typeof b === "string" && b.trim().length > 1 && /[\p{L}\p{N}]/u.test(b)) ? b.trim() : null; // "76", "A&W" ok; "B" not
  const kindName = p => { const k = KIND[p.category]; return typeof k === "string" ? k : (k && (k[p.kind] || k._)) || CAT[p.category].t; };
  const hoursText = o => o === "24/7" ? "Open 24/7" : o;
  const isAnon = p => !p.name && !goodBrand(p.brand);
  const label = p => p.name || goodBrand(p.brand) ||
    [kindName(p), p.side && SIDE[p.side], p.opening_hours && hoursText(p.opening_hours)].filter(Boolean).join(" · ");
  const exitTitle = e => e.ref ? `Exit ${e.ref}` : (e.name || "Exit");
  const has = (e, cat) => e.places.some(p => p.category === cat) || (cat === "restroom" && e.badges && e.badges.some(b => b.k === "rest"));

  /* ---------- data ---------- */
  async function load() {
    let data = null;
    try {
      const r = await fetch("data/exits.json", { cache: "no-cache" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      data = await r.json();
      if (!data || !Array.isArray(data.exits)) throw new Error("bad format");
      try { localStorage.setItem("i5trip3:exits", JSON.stringify(data)); } catch (e) { /* quota: fine */ }
    } catch (err) {
      try { data = JSON.parse(localStorage.getItem("i5trip3:exits") || "null"); } catch (e) { data = null; }
      if (data) console.warn("Next Exit: using cached exit data (" + err.message + ")");
      else { console.warn("Next Exit: couldn't load data/exits.json (" + err.message + "); hiding the Next Exit button."); return; }
    }
    NX.data = data;
    build();
    refresh();
    maybeStartGPS(false);
  }

  // Exits inside the current trip, in travel order (local miles), with app badges.
  function tripList() {
    if (!NX.data || !R) return [];
    return NX.data.exits.filter(e => R.inR(e.g)).map(e => ({ ...e, x: R.L(e.g) })).sort((a, b) => a.x - b.x);
  }
  function badgesFor(e) {
    const out = [], near = g => Math.abs(g - e.g) <= BADGE_MI;
    try {
      R.stops.filter(s => s.cat === "costco" && near(s.g)).forEach(s => {
        const px = FILLPRICE[s.name]; out.push({ k: "costco", t: px ? `Costco gas $${px.toFixed(2)}` : "Costco gas", d: s.name });
      });
      R.spots.filter(s => s.cat === "truck" && near(s.g)).forEach(s => out.push({ k: "rest", t: "Rest area", d: SPOTS[s.id][3] }));
      const i = dayOf(e.x), d = PLAN[i];
      if (d && d.spot && near(SPOTS[d.spot][1])) out.push({ k: "camp", t: "Tonight's stop", d: shortName(d.spot) });
      PASSES.filter(p => R.inR(p.g) && near(p.g)).forEach(p => {
        const [k, v] = passVerdict(p, (S.passLv && S.passLv[p.n]) || "clear");
        out.push({ k: "pass " + k, t: `${p.n.replace(/ \(.*\)/, "")}: ${v}`, d: p.el ? `${p.el.toLocaleString()} ft` : "" });
      });
      TOUR.filter(f => R.inR(f[0]) && near(f[0])).forEach(f => out.push({ k: "story", t: `Story: ${f[1]}`, d: f[2] }));
    } catch (err) { console.warn("Next Exit: badge error", err); }
    return out;
  }
  function withBadges(e) { if (e && !e.badges) e.badges = badgesFor(e); return e; }

  /* ---------- position ---------- */
  function shownDayStart() {
    let i = 0;
    if (typeof MOB !== "undefined" && MOB.on) i = S.mday || 0;
    else if (typeof curDay !== "undefined" && curDay > 0) i = curDay - 1;
    const d = PLAN[Math.min(i, PLAN.length - 1)];
    return d ? d.a : 0;
  }
  function gpsFresh() { return NX.gps && Date.now() - NX.gps.t < GPS_STALE_MS && NX.gps.d <= GPS_MAX_OFF && R.inR(NX.gps.g); }
  function here() {
    if (gpsFresh()) return { x: Math.max(0, Math.min(R.T, R.L(NX.gps.g))), src: "gps" };
    if (typeof DRV !== "undefined" && DRV.on) return { x: DRV.x, src: "drive" };
    return { x: shownDayStart(), src: "day" };
  }
  function nextIndex(x) { const i = NX.list.findIndex(e => e.x > x + 0.1); return i; }

  /* GPS, easy on the battery:
     - never prompts by itself; watches only once location is allowed (or the user taps "Use my location")
     - high accuracy only while the panel or drive mode is open, or for 10 minutes after the pill is tapped;
       otherwise a low-accuracy watch that accepts fixes up to a minute old
     - stops while the page is hidden and resumes when it's visible again (if still allowed) */
  function wantHigh() { return NX.open || (typeof DRV !== "undefined" && DRV.on) || Date.now() - NX.tapAt < TAP_WINDOW_MS; }
  async function permitted() {
    try {
      if (!navigator.permissions) return NX.allowed;
      const st = await navigator.permissions.query({ name: "geolocation" });
      return st.state === "granted";
    } catch (e) { return NX.allowed; }
  }
  function stopWatch() {
    if (NX.watch != null) navigator.geolocation.clearWatch(NX.watch);
    NX.watch = null; NX.watchHi = null;
  }
  function startWatch() {
    if (!navigator.geolocation || document.hidden) return;
    const hi = wantHigh();
    if (NX.watch != null && NX.watchHi === hi) return;
    stopWatch();
    NX.watchHi = hi;
    NX.watch = navigator.geolocation.watchPosition(p => {
      NX.allowed = true;
      const r = gFromLatLon(p.coords.latitude, p.coords.longitude);
      NX.gps = { g: r.g, d: r.d, t: Date.now(), speed: p.coords.speed, lat: p.coords.latitude, lon: p.coords.longitude };
      refresh();
    }, err => {
      if (NX.ask) setMsg(err.code === 1 ? "Location permission was denied." : "Couldn't get a GPS fix.");
      if (err.code === 1) { NX.allowed = false; stopWatch(); }
    }, hi ? { enableHighAccuracy: true, maximumAge: 15000, timeout: 30000 }
          : { enableHighAccuracy: false, maximumAge: 60000, timeout: 120000 });
  }
  async function maybeStartGPS(ask) {
    if (!navigator.geolocation) return;
    NX.ask = !!ask;
    if (!ask && !(await permitted())) return;
    startWatch();
  }
  // Switch between high and low accuracy when the reason for high accuracy starts or ends.
  function retuneGPS() { if (NX.watch != null) startWatch(); }
  function notePillTap() {
    NX.tapAt = Date.now();
    clearTimeout(NX.tapTimer);
    NX.tapTimer = setTimeout(retuneGPS, TAP_WINDOW_MS + 1000);
    retuneGPS();
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { if (NX.watch != null) { stopWatch(); NX.paused = true; } }
    else if (NX.paused) { NX.paused = false; maybeStartGPS(false); }
  });
  function setMsg(t) { const m = q("#nx-msg"); if (m) m.textContent = t; }

  /* ---------- driver / passenger ---------- */
  function isDriver() {
    if (NX.mode) return NX.mode === "driver";
    return !!(gpsFresh() && NX.gps.speed != null && NX.gps.speed > DRIVER_SPEED);
  }

  /* ---------- summaries ---------- */
  function gasHighlight(e) {
    const g = e.places.filter(p => p.category === "gas");
    if (!g.length) return null;
    const seen = new Set(), names = [];
    g.filter(p => !isAnon(p)).forEach(p => { const n = goodBrand(p.brand) || p.name; if (!seen.has(n)) { seen.add(n); names.push({ n, side: p.side }); } });
    if (!names.length) names.push({ n: "Gas station", side: g[0].side });
    return names.slice(0, 2);
  }
  function foodHighlight(e) { const f = e.places.find(p => p.category === "food"); return f ? label(f) : null; }
  function spokenText(e, dist) {
    const parts = [];
    const g = gasHighlight(e); if (g) parts.push(g.map(o => o.n).join(" and "));
    const f = foodHighlight(e); if (f) parts.push(f);
    if (has(e, "restroom")) parts.push("restrooms");
    const name = e.ref ? `Exit ${e.ref}` : (e.name || "The next exit");
    const when = dist == null ? "" : dist < 0.3 ? " now" : ` in ${dist < 0.95 ? dist.toFixed(1) : Math.round(dist)} mile${Math.round(dist) === 1 ? "" : "s"}`;
    return `${name}${when}: ${parts.length ? parts.join(", ") : "no services"}.`;
  }
  /* "Next gas": one rule shared by the tank tip and the Next gas button, so they always agree.
     From position x (local miles, which already increase in the travel direction R.dir), take
     the nearer of
       (a) the first exit ahead with at least one OSM gas place, and
       (b) the first of the app's own fuel stops ahead (R.stops with cat costco/fuel).
     A fuel stop within 1 mi of that exit counts as the same stop (it's named, e.g.
     "Costco Woodland (Exit 537)"). Distance is measured along the route: target − x.
     The button jumps to the exit (for an app stop: the exit nearest to it, within 2 mi). */
  function nextGas(x = here().x) {
    const exit = NX.list.find(e => e.x > x + 0.1 && has(e, "gas")) || null;
    const stop = (R.stops || []).filter(s => (s.cat === "costco" || s.cat === "fuel") && s.local > x + 0.1)
      .sort((a, b) => a.local - b.local)[0] || null;
    if (!exit && !stop) return null;
    if (stop && (!exit || stop.local < exit.x - 1)) {
      const near = NX.list.filter(e => Math.abs(e.x - stop.local) <= 2)
        .sort((a, b) => Math.abs(a.x - stop.local) - Math.abs(b.x - stop.local))[0] || null;
      return { dist: stop.local - x, label: stop.name, exit: near };
    }
    const same = stop && Math.abs(stop.local - exit.x) <= 1 ? stop.name : null;
    return { dist: exit.x - x, label: same ? `${same} (${exitTitle(exit)})` : exitTitle(exit), exit };
  }
  function nextGasText(ng) { return ng ? `Next gas: ${ng.label}, ${fmtMi(ng.dist)}.` : "No more gas on the route."; }

  function fuelTip(e) {
    if (!FUEL || typeof FUEL.tankAt !== "function") return "";
    const tank = Math.max(0, FUEL.tankAt(e.x)), range = Math.max(0, (tank - RESERVE) * S.mpg);
    // whether to fill at *this* exit depends on the gap to the gas after it
    const i = NX.list.indexOf(e), after = NX.list.slice(i + 1).find(o => has(o, "gas"));
    const gap = after ? after.x - e.x : null;
    const tk = `Tank at this exit ≈${Math.round(tank)} gal`;
    const verdict = !has(e, "gas") ? `${tk}.`
      : (tank < TANK * 0.35 || (gap != null && range < gap + 15)) ? `${tk}: fill here.`
      : `${tk} (≈${Math.round(range)} mi of range): no need to stop.`;
    return `${verdict} ${nextGasText(nextGas())}`;
  }

  /* ---------- DOM ---------- */
  function build() {
    if (NX.built) return; NX.built = true;
    const pill = document.createElement("button");
    pill.type = "button"; pill.id = "nx-pill"; pill.className = "nx-pill"; pill.hidden = true;
    pill.addEventListener("click", () => { notePillTap(); openPanel(); });
    document.body.appendChild(pill);

    const back = document.createElement("div"); back.className = "nx-back"; back.hidden = true;
    back.addEventListener("click", closePanel);
    document.body.appendChild(back);

    const p = document.createElement("aside");
    p.id = "nx-panel"; p.className = "nx-panel"; p.hidden = true;
    p.setAttribute("role", "dialog"); p.setAttribute("aria-modal", "true"); p.setAttribute("aria-labelledby", "nx-title"); p.tabIndex = -1;
    p.innerHTML = `
      <header class="nx-head">
        <div class="nx-mode" role="group" aria-label="View for">
          <button type="button" data-mode="driver">Driver</button><button type="button" data-mode="passenger">Passenger</button>
        </div>
        <button type="button" class="nx-x" aria-label="Close Next Exit">✕</button>
      </header>
      <div class="nx-body" id="nx-body"></div>
      <nav class="nx-nav" aria-label="Browse exits">
        <button type="button" class="nx-prev" aria-label="Previous exit">‹ Prev</button>
        <button type="button" class="nx-next" aria-label="Next exit">Next ›</button>
      </nav>
      <footer class="nx-foot"><span id="nx-msg" aria-live="polite"></span><span>Exit data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a></span></footer>`;
    document.body.appendChild(p);
    p.querySelector(".nx-x").addEventListener("click", closePanel);
    p.querySelector(".nx-prev").addEventListener("click", () => step(-1));
    p.querySelector(".nx-next").addEventListener("click", () => step(1));
    p.querySelectorAll("[data-mode]").forEach(b => b.addEventListener("click", () => { NX.mode = b.dataset.mode; renderPanel(); }));
    p.addEventListener("click", e => {
      const j = e.target.closest("[data-jump]"); if (j) { jump(j.dataset.jump); return; }
      if (e.target.closest("[data-say]")) { const ex = NX.list[NX.sel]; if (ex) { const ok = speak(spokenText(ex, ex.x - here().x)); if (!ok) setMsg("Speech isn't available in this browser."); } return; }
      if (e.target.closest("[data-gps]")) { setMsg("Finding you…"); maybeStartGPS(true); return; }
      if (e.target.closest("[data-step]")) step(+e.target.closest("[data-step]").dataset.step);
    });
    // swipe left/right to browse
    let sx = null, sy = 0;
    p.addEventListener("touchstart", e => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
    p.addEventListener("touchend", e => {
      if (sx == null) return; const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy; sx = null;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    }, { passive: true });
    // Esc closes the panel first (capture, so drive mode's own Esc handler doesn't also fire)
    window.addEventListener("keydown", e => {
      if (!NX.open) return;
      if (e.key === "Escape") { e.stopPropagation(); e.preventDefault(); closePanel(); }
      else if (e.key === "Tab") trap(e);
    }, true);
  }
  function trap(e) {
    const p = q("#nx-panel"); const f = [...p.querySelectorAll("button,a[href],[tabindex]:not([tabindex='-1'])")].filter(n => !n.disabled && n.offsetParent !== null);
    if (!f.length) return; const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === p)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function refresh() {
    if (!NX.data) return;
    NX.list = tripList();
    renderPill();
    if (NX.open) renderPanel();
    if (typeof DRV !== "undefined" && DRV.on) renderDrive(DRV.x);
  }

  function renderPill() {
    const pill = q("#nx-pill"); if (!pill) return;
    const pos = here(), i = nextIndex(pos.x), e = NX.list[i];
    if (!e) { pill.hidden = true; return; }
    const d = e.x - pos.x;
    pill.innerHTML = `<span class="nx-k">Next exit</span><b>${h(e.ref || (e.name || "").slice(0, 18))}</b><span class="nx-d">· ${fmtMi(d)}</span>`;
    pill.setAttribute("aria-label", `Next exit: ${exitTitle(e)}${e.name && e.ref ? ", " + e.name : ""}, ${fmtMi(d)} ahead. Open exit details.`);
    pill.hidden = false;
    document.body.classList.add("nx-has");
  }

  function openPanel(index) {
    if (!NX.data || !NX.list.length) return;
    NX.lastFocus = document.activeElement;
    const pos = here();
    NX.sel = index != null ? index : nextIndex(pos.x);
    if (NX.sel < 0) NX.sel = NX.list.length - 1;
    NX.open = true;
    q("#nx-panel").hidden = false; q(".nx-back").hidden = false;
    document.body.classList.add("nx-open");
    retuneGPS();
    renderPanel();
    requestAnimationFrame(() => { const p = q("#nx-panel"); (p.querySelector(".nx-sign") || p).focus(); });
  }
  function closePanel() {
    if (!NX.open) return;
    NX.open = false; NX.mode = null; // manual driver/passenger choice lasts until the panel closes
    q("#nx-panel").hidden = true; q(".nx-back").hidden = true;
    document.body.classList.remove("nx-open");
    retuneGPS();
    setMsg("");
    const f = NX.lastFocus; NX.lastFocus = null;
    if (f && document.contains(f) && f.offsetParent !== null) f.focus();
    else { const pill = q("#nx-pill"); if (pill && !pill.hidden) pill.focus(); }
    renderPill();
  }
  function step(d) {
    const n = Math.max(0, Math.min(NX.list.length - 1, NX.sel + d));
    if (n === NX.sel) return;
    NX.sel = n; renderPanel();
    const s = q("#nx-panel .nx-sign"); if (s) s.focus();
  }
  // Jump targets are measured from the current position, like the tank tip, so the button's
  // distance and the tip's "Next gas" always match. Gas uses the shared nextGas() rule.
  function jumpInfo(cat) {
    const pos = here();
    if (cat === "gas") { const ng = nextGas(pos.x); return ng ? { exit: ng.exit, dist: ng.dist } : null; }
    const e = NX.list.find(o => o.x > pos.x + 0.1 && has(withBadges(o), cat));
    return e ? { exit: e, dist: e.x - pos.x } : null;
  }
  function jumpTarget(cat) { const j = jumpInfo(cat); return j && j.exit; }
  function jump(cat) {
    const t = jumpTarget(cat);
    if (!t) { setMsg(`No more ${CAT[cat].t.toLowerCase()} ahead on this trip.`); return; }
    NX.sel = NX.list.indexOf(t); renderPanel();
    const s = q("#nx-panel .nx-sign"); if (s) s.focus();
  }

  function renderPanel() {
    const p = q("#nx-panel"); if (!p || !NX.open) return;
    const e = withBadges(NX.list[NX.sel]); const body = q("#nx-body");
    if (!e) { body.innerHTML = `<p class="nx-none">No exits on this trip.</p>`; return; }
    const pos = here(), d = e.x - pos.x, driver = isDriver();
    p.classList.toggle("driver", driver);
    p.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-pressed", String((b.dataset.mode === "driver") === driver)));
    p.querySelector(".nx-prev").disabled = NX.sel <= 0;
    p.querySelector(".nx-next").disabled = NX.sel >= NX.list.length - 1;
    const where = d >= 0 ? `${fmtMi(d)} ahead · ${fmtMin(d)}` : `${fmtMi(d)} behind you`;
    const srcNote = { gps: "from your GPS", drive: "from drive mode", day: "from the start of the day shown" }[pos.src];
    const sign = `<div class="nx-sign" tabindex="-1" id="nx-title" aria-live="polite"><span class="nx-tab">${e.ref ? "EXIT " + h(e.ref) : "EXIT"}</span><b>${h(e.name || (e.hwy ? e.hwy.replace(" ", "-") : "Exit"))}</b><span class="nx-where">${where}</span></div>`;
    body.innerHTML = sign + (driver ? driverView(e) : passengerView(e, pos, srcNote));
  }

  function driverView(e) {
    const g = gasHighlight(e), f = foodHighlight(e), r = has(e, "restroom");
    const nextEx = NX.list[NX.sel + 1];
    const rows = [
      `<li><span class="nx-i">${icon("gas")}</span><span class="nx-hlt">${g ? g.map(o => `${h(o.n)}${o.side ? ` <small>(${o.side})</small>` : ""}`).join(", ") : "No gas"}</span></li>`,
      `<li><span class="nx-i">${icon("food")}</span><span class="nx-hlt">${f ? h(f) : "No food"}</span></li>`,
      `<li><span class="nx-i">${icon("restroom")}</span><span class="nx-hlt">${r ? "Restrooms" : "No restrooms"}</span></li>`,
    ];
    const none = !e.places.length && !e.badges.length;
    return `${none ? `<p class="nx-none">No services at this exit.</p>` : `<ul class="nx-hl">${rows.join("")}</ul>`}
      <div class="nx-big">
        <a class="nx-btn go" href="${nav(e.lat, e.lon)}" target="_blank" rel="noopener">${icon("nav")}<span>Navigate</span></a>
        <button type="button" class="nx-btn" data-step="1" ${nextEx ? "" : "disabled"}>Next ›</button>
        <button type="button" class="nx-btn say" data-say aria-label="Read this exit aloud">${icon("speak")}</button>
      </div>`;
  }

  function passengerView(e, pos, srcNote) {
    const badges = e.badges.map(b => `<li class="nx-b ${h(b.k)}"><b>${h(b.t)}</b>${b.k !== "story" && b.d ? ` <span>${h(b.d)}</span>` : ""}${b.k === "story" ? `<p>${h(b.d)}</p>` : ""}</li>`).join("");
    const tip = fuelTip(e);
    const jumps = JUMPS.map(([cat, t]) => {
      const j = jumpInfo(cat), on = j && j.exit && NX.list.indexOf(j.exit) === NX.sel;
      return `<button type="button" data-jump="${cat}" ${j && j.exit ? "" : "aria-disabled=\"true\""}${on ? " aria-current=\"true\"" : ""}><span class="nx-jt">${icon(cat)}${t}</span><small>${j ? fmtMi(j.dist) : "none"}</small></button>`;
    }).join("");
    let rows = "";
    CATS.forEach(([cat, t]) => {
      const ps = e.places.filter(p => p.category === cat); if (!ps.length) return;
      rows += `<section class="nx-cat"><h3>${icon(cat)} ${t} <small>${ps.length}</small></h3><ul>${ps.map(p => place(p)).join("")}</ul></section>`;
    });
    const gpsBtn = pos.src !== "gps" && navigator.geolocation ? `<button type="button" class="nx-link" data-gps>Use my location</button>` : "";
    return `${badges ? `<ul class="nx-badges">${badges}</ul>` : ""}
      ${tip ? `<p class="nx-tip">${h(tip)}</p>` : ""}
      <div class="nx-jumps" role="group" aria-label="Jump ahead">${jumps}</div>
      ${rows || `<p class="nx-none">No services at this exit.</p>`}
      <p class="nx-src">Distances ${srcNote}. ${gpsBtn}</p>`;
  }

  function place(p) {
    const sub = [];
    const anon = isAnon(p), brand = goodBrand(p.brand);
    if (brand && p.name && brand !== p.name) sub.push(h(brand));
    sub.push(`${fmtMi(p.dist)} from exit`);
    if (p.side && !anon) sub.push(SIDE[p.side] || p.side); // unnamed places already say the side
    if (p.diesel === "yes") sub.push("diesel");
    const hours = p.opening_hours && !anon ? `<span class="nx-hours">${h(hoursText(p.opening_hours))}</span>` : "";
    let links = `<a href="${nav(p.lat, p.lon)}" target="_blank" rel="noopener" aria-label="Directions to ${h(label(p))}">Map</a>`;
    if (p.category === "gas") {
      links += `<a href="https://www.gasbuddy.com/home?search=${encodeURIComponent(`${p.lat},${p.lon}`)}&fuel=1" target="_blank" rel="noopener" aria-label="Check price on GasBuddy">GasBuddy</a><a href="https://www.google.com/maps/search/gas+prices/@${p.lat},${p.lon},15z" target="_blank" rel="noopener" aria-label="Check gas prices on Google Maps">Prices</a>`;
    }
    return `<li class="nx-pl"><div><b>${h(label(p))}</b><span>${sub.join(" · ")}</span>${hours}</div><div class="nx-ln">${links}</div></li>`;
  }

  /* ---------- drive mode card ---------- */
  function renderDrive(x) {
    const host = q("#drive.v2 .dv2-side") || q("#drive .dv-info");
    if (!host || !NX.data) return;
    let card = q("#nx-dv");
    if (!card || !host.contains(card)) {
      if (card) card.remove();
      card = document.createElement("section");
      card.id = "nx-dv"; card.className = "nx-dv"; card.setAttribute("aria-label", "Next exit");
      const after = host.querySelector(".dv2-hero");
      if (after) after.after(card); else host.prepend(card);
      card.addEventListener("click", ev => {
        if (ev.target.closest("[data-nxsay]")) { const e = NX.list[+card.dataset.i]; if (e) speak(spokenText(e, e.x - here().x)); return; }
        if (ev.target.closest("[data-nxopen]")) openPanel(+card.dataset.i);
      });
    }
    const pos = here(), i = nextIndex(pos.x), e = withBadges(NX.list[i]);
    if (!e) { card.hidden = true; return; }
    card.hidden = false; card.dataset.i = i;
    const d = e.x - pos.x, g = gasHighlight(e), f = foodHighlight(e), r = has(e, "restroom");
    const hl = [g ? icon("gas") + h(g.map(o => o.n).join(", ")) : "", f ? icon("food") + h(f) : "", r ? icon("restroom") + "Restrooms" : ""].filter(Boolean);
    card.innerHTML = `<button type="button" class="nx-dv-main" data-nxopen aria-label="${h(exitTitle(e))}, ${fmtMi(d)}. Open exit details.">
        <span class="nx-dv-sign"><small>NEXT EXIT</small><b>${h(e.ref || "—")}</b></span>
        <span class="nx-dv-txt"><b>${fmtMi(d)} · ${fmtMin(d)}</b><span>${h(e.name || "")}</span><span class="nx-dv-hl">${hl.length ? hl.map(x => `<span>${x}</span>`).join("") : "No services"}</span></span>
      </button><button type="button" class="nx-dv-say" data-nxsay aria-label="Read the next exit aloud">${icon("speak")}</button>`;
  }

  /* ---------- hook into the app ---------- */
  function wrap(name, after) {
    const fn = window[name];
    if (typeof fn !== "function") return;
    const w = function (...a) { const r = fn.apply(this, a); try { after(...a); } catch (e) { console.warn("Next Exit:", e); } return r; };
    try { window[name] = w; } catch (e) { /* not assignable */ }
  }
  // These are function declarations, so window[name] and the global binding are the same.
  const _driveAt = driveAt;
  driveAt = function (x, pos) { _driveAt(x, pos); try { renderDrive(x); } catch (e) { console.warn("Next Exit:", e); } };
  const _openDrive = openDrive;
  openDrive = async function (...a) { const r = await _openDrive.apply(this, a); try { retuneGPS(); renderPill(); renderDrive(DRV.x); } catch (e) { console.warn("Next Exit:", e); } return r; };
  const _closeDrive = closeDrive;
  closeDrive = function (...a) { const r = _closeDrive.apply(this, a); try { retuneGPS(); refresh(); } catch (e) { } return r; };
  wrap("rebuild", refresh);
  wrap("applyMDay", () => { if (!NX.open) renderPill(); });
  wrap("selectDay", () => { if (!NX.open) renderPill(); });

  load();
})();
