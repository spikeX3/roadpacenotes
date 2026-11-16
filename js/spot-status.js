/* Road Pace Notes · spot status
   Sleep spots that may be closed or whose status is uncertain. Each listed spot gets a
   visible warning wherever it's offered as a sleep option or badge, and its "Sleep here"
   buttons need a second tap. The planner never picks these on its own (rest-only areas
   are only used when you choose one).
   Uses the app's globals: SPOTS, select, esc, $. */
const SPOT_STATUS = {
  westley: {
    status: "closed?",
    note: "OpenStreetMap lists both sides as closed for construction (estimated end Fall 2025). Check Caltrans before counting on it.",
    checked: "2026-11-15",
    url: "https://quickmap.dot.ca.gov/",
  },
};

/** Warning markup for a spot id, or "" when the spot has no status. */
function spotWarnHTML(id) {
  const st = SPOT_STATUS[id];
  if (!st) return "";
  return `<div class="spotwarn" role="note"><span class="sw-tag">May be closed</span><span class="sw-note">${esc(st.note)}</span><span class="sw-meta"><a href="${esc(st.url)}" target="_blank" rel="noopener">Check Caltrans ↗</a> · checked ${esc(st.checked)}</span></div>`;
}

(function () {
  "use strict";
  const ARM_MS = 8000;

  // First tap on "Sleep here" only asks for confirmation; the second tap goes through to
  // the app's own handler. The listener sits on the parent in the capture phase so it runs
  // before the button's listener and can hold the first tap back.
  function arm(btn) {
    if (btn.dataset.swArmed !== undefined) return;
    btn.dataset.swArmed = "0";
    const label = btn.textContent, host = btn.parentElement;
    host.addEventListener("click", e => {
      if (e.target.closest("button") !== btn || btn.dataset.swArmed === "1") return;
      e.stopImmediatePropagation(); e.preventDefault();
      btn.dataset.swArmed = "1"; btn.textContent = "Tap again to sleep here anyway"; btn.classList.add("sw-armed");
      clearTimeout(btn._swTimer);
      btn._swTimer = setTimeout(() => { btn.dataset.swArmed = "0"; btn.textContent = label; btn.classList.remove("sw-armed"); }, ARM_MS);
    }, true);
  }

  // "Closest rest areas to tonight's stop" (data-rest) and the Cab list in the Tonight
  // chooser (data-rest2). Idempotent, so it can run after every render.
  function decorate() {
    document.querySelectorAll("[data-rest],[data-rest2]").forEach(btn => {
      const id = btn.dataset.rest || btn.dataset.rest2;
      if (!SPOT_STATUS[id]) return;
      const li = btn.closest("li");
      if (li && !li.querySelector(".spotwarn")) {
        li.classList.add("sw-li");
        (btn.closest(".rb") || btn).insertAdjacentHTML("beforebegin", spotWarnHTML(id));
      }
      arm(btn);
    });
  }
  let queued = false;
  const schedule = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; decorate(); }); };
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  decorate();

  // Map stop-details card
  const _select = select;
  select = function (id, src) {
    const r = _select.apply(this, arguments);
    try {
      const sid = typeof id === "string" && id.startsWith("sp-") ? id.slice(3) : null;
      const d = $("#detail");
      if (sid && SPOT_STATUS[sid] && d && !d.querySelector(".spotwarn")) {
        const at = d.querySelector(".dbtns");
        if (at) at.insertAdjacentHTML("beforebegin", spotWarnHTML(sid)); else d.insertAdjacentHTML("beforeend", spotWarnHTML(sid));
      }
    } catch (e) { console.warn("Spot status:", e); }
    return r;
  };
})();
