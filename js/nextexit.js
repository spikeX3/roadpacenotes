/* Road Pace Notes · Next Exit
   Floating "NEXT EXIT" pill, an exit panel (bottom sheet on phones, side panel on
   desktop) and a drive-mode card, fed by data/exits.json (OpenStreetMap).
   Uses the app's globals: ROUTE, R, PLAN, S, store, STOPS, SPOTS, TOUR, PASSES,
   FILLPRICE, FUEL, MPH, TANK, RESERVE, DRV, MOB, curDay, gFromLatLon, dayOf,
   passVerdict, shortName, speak, esc. */
(function () {
  "use strict";
  if (typeof R === "undefined" || typeof ROUTE === "undefined") { console.warn("Next Exit: app globals missing; not starting."); return; }

  const CATS = [
    ["gas", "Gas", "⛽"], ["food", "Food", "🍔"], ["coffee", "Coffee", "☕"], ["restroom", "Restrooms", "🚻"],
    ["ev", "EV charging", "⚡"], ["lodging", "Lodging", "🛏️"], ["sight", "Sights", "📷"], ["grocery", "Groceries", "🛒"],
  ];
  const CAT = Object.fromEntries(CATS.map(c => [c[0], { t: c[1], i: c[2] }]));
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
  const label = p => p.name || p.brand || CAT[p.category].t;
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
    g.filter(p => p.brand || p.name).forEach(p => { const n = p.brand || p.name; if (!seen.has(n)) { seen.add(n); names.push({ n, side: p.side }); } });
    if (!names.length) names.push({ n: "Gas", side: g[0].side });
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
  function fuelTip(e) {
    if (!FUEL || typeof FUEL.tankAt !== "function") return "";
    const tank = Math.max(0, FUEL.tankAt(e.x)), range = Math.max(0, (tank - RESERVE) * S.mpg);
    const i = NX.list.indexOf(e), nextGas = NX.list.slice(i + 1).find(o => has(o, "gas"));
    const gap = nextGas ? nextGas.x - e.x : null;
    const tk = `Tank ≈${Math.round(tank)} gal`;
    if (has(e, "gas")) {
      if (tank < TANK * 0.35 || (gap != null && range < gap + 15)) return `${tk}: fill here${gap != null ? `. Next gas in ${Math.round(gap)} mi.` : "."}`;
      return `${tk} (≈${Math.round(range)} mi of range): no need to stop.`;
    }
    return gap != null ? `${tk}. Next gas in ${Math.round(gap)} mi.` : `${tk}. No more gas on the route.`;
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
  function jumpTarget(cat) {
    const pos = here(), sel = NX.list[NX.sel];
    const cands = NX.list.filter(e => e.x > pos.x + 0.1 && has(withBadges(e), cat));
    if (!cands.length) return null;
    if (sel && cands.includes(sel)) return cands[cands.indexOf(sel) + 1] || null;
    return cands.find(e => !sel || e.x > sel.x) || cands[0];
  }
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
      `<li><span class="nx-i" aria-hidden="true">⛽</span>${g ? g.map(o => `${h(o.n)}${o.side ? ` <small>(${o.side})</small>` : ""}`).join(", ") : "No gas"}</li>`,
      `<li><span class="nx-i" aria-hidden="true">🍔</span>${f ? h(f) : "No food"}</li>`,
      `<li><span class="nx-i" aria-hidden="true">🚻</span>${r ? "Restrooms" : "No restrooms"}</li>`,
    ];
    const none = !e.places.length && !e.badges.length;
    return `${none ? `<p class="nx-none">No services at this exit.</p>` : `<ul class="nx-hl">${rows.join("")}</ul>`}
      <div class="nx-big">
        <a class="nx-btn go" href="${nav(e.lat, e.lon)}" target="_blank" rel="noopener">Navigate</a>
        <button type="button" class="nx-btn" data-step="1" ${nextEx ? "" : "disabled"}>Next ›</button>
        <button type="button" class="nx-btn say" data-say aria-label="Read this exit aloud">🔊</button>
      </div>`;
  }

  function passengerView(e, pos, srcNote) {
    const badges = e.badges.map(b => `<li class="nx-b ${h(b.k)}"><b>${h(b.t)}</b>${b.k !== "story" && b.d ? ` <span>${h(b.d)}</span>` : ""}${b.k === "story" ? `<p>${h(b.d)}</p>` : ""}</li>`).join("");
    const tip = fuelTip(e);
    const jumps = JUMPS.map(([cat, t]) => {
      const tg = jumpTarget(cat);
      return `<button type="button" data-jump="${cat}" ${tg ? "" : "aria-disabled=\"true\""}>${t}<small>${tg ? fmtMi(tg.x - pos.x) : "none"}</small></button>`;
    }).join("");
    let rows = "";
    CATS.forEach(([cat, t, icon]) => {
      const ps = e.places.filter(p => p.category === cat); if (!ps.length) return;
      rows += `<section class="nx-cat"><h3><span aria-hidden="true">${icon}</span> ${t} <small>${ps.length}</small></h3><ul>${ps.map(p => place(p)).join("")}</ul></section>`;
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
    if (p.brand && p.name && p.brand !== p.name) sub.push(h(p.brand));
    sub.push(`${fmtMi(p.dist)} from exit`);
    if (p.side) sub.push(SIDE[p.side] || p.side);
    if (p.diesel === "yes") sub.push("diesel");
    const hours = p.opening_hours ? `<span class="nx-hours">${h(p.opening_hours === "24/7" ? "Open 24/7" : p.opening_hours)}</span>` : "";
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
    const hl = [g ? "⛽ " + g.map(o => o.n).join(", ") : "", f ? "🍔 " + f : "", r ? "🚻 Restrooms" : ""].filter(Boolean);
    card.innerHTML = `<button type="button" class="nx-dv-main" data-nxopen aria-label="${h(exitTitle(e))}, ${fmtMi(d)}. Open exit details.">
        <span class="nx-dv-sign"><small>NEXT EXIT</small><b>${h(e.ref || "—")}</b></span>
        <span class="nx-dv-txt"><b>${fmtMi(d)} · ${fmtMin(d)}</b><span>${h(e.name || "")}</span><span class="nx-dv-hl">${hl.length ? h(hl.join(" · ")) : "No services"}</span></span>
      </button><button type="button" class="nx-dv-say" data-nxsay aria-label="Read the next exit aloud">🔊</button>`;
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
