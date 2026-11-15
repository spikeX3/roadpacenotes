# Road Pace Notes

Your co-driver for the road ahead. A road-trip planner with day-by-day routes, camp and hotel options, fuel and cost tracking, a camp kitchen, and a drive mode that reads out what's coming up.

**Live site:** https://roadpacenotes.com

## What's in it

- **Trip planner:** Ontario, CA → Walla Walla, WA on I-5 / I-84, split into days by driving hours, with Shorter / Longer day buttons.
- **Tonight:** tent, cab or hotel for each night, with the reasons behind the suggestion, nearby campsites, rest areas and hotel price ranges.
- **Fuel & costs:** tank simulation, Costco fill-ups, per-day fuel cost, expense tracker with charts.
- **Camp kitchen:** meals per day, meal builder, pantry, shopping list and kitchen log.
- **Map:** zoomable route map with stops, rest areas and day filters.
- **Drive mode:** dark map, progress ring, daylight arc, highway-sign cards for the next gas / rest area / camp / pass, and read-aloud mile-marker stories.
- **Refresh conditions:** pulls the latest National Weather Service forecast for every stop (works on the live site, not inside sandboxed previews).
- **Phone layout:** bottom tab bar (Trip, Map, Drive, Kitchen, More).

Everything runs in the browser. Data you enter (expenses, pantry, notes) is saved in that browser only.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app: HTML, CSS and JavaScript in one file |
| `CNAME` | Tells GitHub Pages to serve the site at roadpacenotes.com |
| `.nojekyll` | Serves files as-is (no Jekyll processing) |

## Roadmap

- **Next Exit:** a floating button that shows what's at the upcoming exit (gas, food, restrooms, sights), with driver and passenger views and "skip to next exit / next gas / next food".
- Split `index.html` into separate CSS / JS / data files.
- Southbound (return trip) data.

## Notes

Weather, gas prices and hotel prices are snapshots from mid-November 2026 unless refreshed. Always check road conditions (Caltrans QuickMap, Oregon TripCheck) before driving.
