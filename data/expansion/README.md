# data/expansion — road distances for future countries (data only)

Nothing here is read by the website. These files keep the distance work for later country pages so it is not lost.
Rule X7/R4 still applies: no price or coefficient exists for these countries; only city-to-city road distances.

| Set | Cities | Pairs | Status | Where |
|---|---|---|---|---|
| `ca` Canada | 37 (Natural Earth) | 666 | **complete**: 666/666 routes inside Canada (`avoid_countries=[214]`, countryinfo checked, 0 touch another country), 42 reverse-direction checks, largest gap 2.83 % | `ca/` (archived from the experimental branch `exp/expansion-matrix-run`; `ca-road-matrix.json` is the earlier "fastest route" matrix that crosses the United States and is NOT the file to use) |
| `uk` United Kingdom | 31 | 465 | see `uk/routes.json` once the workflow "Expansion routes" has run | branch `data/expansion-uk`, copied here by PR |
| `de` Germany | 30 | 435 | same, `de/routes.json` | branch `data/expansion-de` |

- **Method:** openrouteservice Directions, `driving-car` (a car, not a moving truck), km. For `uk` and `de` the default fastest route is asked first; a route touching another country for 1 km or more is asked again with that country avoided. The home country is learned from the first route.
- **Licence and attribution:** results are CC-BY-SA 4.0 and need the exact line `© openrouteservice by HeiGIT | Data from OpenStreetMap` wherever the numbers are shown (https://account.heigit.org/info/tos). Commercial use of the Standard plan was confirmed in writing by HeiGIT (2026-11-09 log). Whether storing results and the share-alike scope are fine is still open (BACKLOG B8).
- **Drift:** OpenStreetMap changes, so a rerun can differ (the US table moved up to 4.4 % in a week, median 0.06 %). Keep the run date.
- **Limits:** straight-line points are city centres from Natural Earth, not addresses; Belfast needs a ferry; the ORS route limit is about 6,000 km (not reached in Canada).
- **Resume or extend:** workflow "Expansion routes" (manual), inputs `set` and `max_requests`; daily quota 2,000 requests on api.heigit.org.
