# Road Pace Notes

Your co-driver for the road ahead. A road-trip planner with day-by-day routes, camp and hotel options, fuel and cost tracking, a camp kitchen, and a drive mode that reads out what's coming up.

**Live site:** https://roadpacenotes.com

## What's in it

- **Trip planner:** Ontario, CA → Walla Walla, WA on I-5 / I-84, split into days by driving hours, with Shorter / Longer day buttons.
- **Tonight:** tent, cab or hotel for each night, with the reasons behind the suggestion, nearby campsites, rest areas and hotel price ranges.
- **Fuel & costs:** tank simulation, Costco fill-ups, per-day fuel cost, expense tracker with charts.
- **Camp kitchen:** meals per day, meal builder, pantry, shopping list and kitchen log.
- **Map:** zoomable route map with stops, rest areas and day filters.
- **Next Exit:** a green exit-sign button showing the upcoming exit, with gas, food, coffee, restrooms, EV charging, lodging, sights and groceries nearby (details below).
- **Drive mode:** dark map, progress ring, daylight arc, highway-sign cards for the next gas / rest area / camp / pass, and read-aloud mile-marker stories.
- **Refresh conditions:** pulls the latest National Weather Service forecast for every stop (works on the live site, not inside sandboxed previews).
- **Phone layout:** bottom tab bar (Trip, Map, Drive, Kitchen, More).

Everything runs in the browser. Data you enter (expenses, pantry, notes) is saved in that browser only.

## Next Exit

The **NEXT EXIT** button (above the tab bar on phones, above *Drive mode* on desktop) shows the next freeway exit in your direction of travel. Tap it for the exit panel:

- **Where you are:** your GPS if you've allowed location, otherwise drive mode's position, otherwise the start of the day you're looking at. Southbound trips (⇄ Swap) work the same way.
- **What's there:** gas, food, coffee, restrooms, EV charging, lodging, sights and groceries within about 1.2 km (¾ mi), with distance, side of the freeway, hours and a Google Maps link. Gas stations also get price links (GasBuddy, Google Maps).
- **Trip badges:** Costco fill-ups with the planned price, rest areas, tonight's stop, mountain passes with their current verdict, and mile-marker stories.
- **Fuel tip:** estimated gallons left at that exit and whether to fill up.
- **Browse:** ‹ Prev / Next › (or swipe), plus *Next gas*, *Next food* and *Next restroom*.
- **Driver view:** three highlights in large type, big Navigate / Next buttons and 🔊 read-aloud. It switches on by itself above ~10 mph on GPS; the Driver / Passenger toggle overrides that until you close the panel.
- **Drive mode** gets a Next Exit card too.

The exit data lives in `data/exits.json` and is cached in the browser for offline use. If it can't be loaded, the button simply doesn't appear.

### Rebuilding the exit data

```sh
node scripts/build-exits.mjs
```

Needs Node 20 or newer and network access; no `npm install`. It asks the [Overpass API](https://overpass-api.de/) for motorway exits on I-210 / I-5 / I-205 / I-84 along the route and the places around each one, then writes `data/exits.json`. It's polite to the shared server (one request at a time, pauses and retries), so a run takes several minutes. Set `OVERPASS_URL` to use a different Overpass instance.

Both scripts read `ROUTE` from `js/app.js`. To refine the route line itself:

```sh
node scripts/densify-route.mjs --dry-run   # report only
node scripts/densify-route.mjs             # rewrite the ROUTE line in js/app.js
```

The 42 original points (whole-number miles) are anchors and keep their miles exactly; everything in the app (stops, camps, passes, stories, the planner) is keyed to those miles. Points in between get miles in proportion to road distance. Rebuild the exit data afterwards. Set `OVERPASS_CACHE=.overpass-cache` to save responses and reuse them on later runs.

A GitHub Action (`.github/workflows/build-exits.yml`) reruns it monthly, and on demand from the Actions tab, and commits the file if anything changed.

### Attribution

Exit and place data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/). The app shows this credit in the Next Exit panel.

## Files

| File | Purpose |
|---|---|
| `index.html` | Page markup; loads the stylesheets and scripts below in order |
| `css/app.css` | App styles |
| `js/app.js` | Core data (including `ROUTE`), planner and UI |
| `js/features.js` | Passes, kitchen, drive mode, phone layout, live weather and other features |
| `js/bg.js` | Animated road-trip background |
| `js/spot-status.js`, `css/spot-status.css` | Warnings for closed or uncertain sleep spots (`SPOT_STATUS`) |
| `CNAME` | Tells GitHub Pages to serve the site at roadpacenotes.com |
| `.nojekyll` | Serves files as-is (no Jekyll processing) |
| `js/nextexit.js`, `css/nextexit.css` | Next Exit button, panel and drive-mode card |
| `data/exits.json` | Exits and nearby places, built from OpenStreetMap |
| `scripts/build-exits.mjs` | Builds `data/exits.json` (Node 20, no dependencies) |
| `scripts/densify-route.mjs` | Rebuilds the `ROUTE` line in `js/app.js` from OpenStreetMap freeway geometry |
| `scripts/lib/route.mjs` | Shared ROUTE parser, route math and Overpass client for the scripts |
| `.github/workflows/build-exits.yml` | Monthly rebuild of the exit data |

The scripts are plain classic scripts (no modules, `defer` or `async`) that share each other's top-level names, so keep them in the order `index.html` loads them.

## Roadmap

- Southbound (return trip) data.

## Notes

Weather, gas prices and hotel prices are snapshots from mid-November 2026 unless refreshed. Always check road conditions (Caltrans QuickMap, Oregon TripCheck) before driving.
