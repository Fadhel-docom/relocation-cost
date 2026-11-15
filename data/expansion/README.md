# data/expansion — road distances for future countries (data only)

Nothing here is read by the website. These files keep the distance work for later country pages so it is not lost.
Rule X7/R4 still applies: no price or coefficient exists for these countries; only city-to-city road distances.

| Set | Cities | Pairs | Status | Where |
|---|---|---|---|---|
| `ca` Canada | 37 (Natural Earth) | 666 | **complete**: 666/666 routes inside Canada (`avoid_countries=[214]`, countryinfo checked, 0 touch another country), 42 reverse-direction checks, largest gap 2.83 % | `ca/` (archived from the experimental branch `exp/expansion-matrix-run`; `ca-road-matrix.json` is the earlier "fastest route" matrix that crosses the United States and is NOT the file to use) |
| `uk` United Kingdom | 31 | 465 | **complete** (2026-11-14): 465/465, 0 route touches another country after one recheck (Cardiff–Belfast asked again avoiding Ireland, +23.9 %), 1 flag (Swansea–Exeter ratio 2.26), 30 reverse checks, largest gap 3.93 % | `uk/routes.json` (Belfast routes may include a ferry) |
| `de` Germany | 30 | 435 | **complete** (2026-11-14): 435/435, 0 foreign after one recheck (Freiburg–Saarbrücken asked again avoiding France, +33.6 %), 0 flags, 28 reverse checks, largest gap 4.65 % | `de/routes.json` |
| `fr` France | 30 (metropolitan) | 435 | **complete** (2026-11-14): 435/435, 0 foreign after 4 rechecks (Nice–Strasbourg +22.6 %, Strasbourg–Lille +5.3 %, Strasbourg–Grenoble +8.2 %, Lille–Metz +8.0 %), 1 flag (Nice–Grenoble ratio 2.28, Alpine roads), 28 reverse checks, largest gap 2.31 % | `fr/routes.json` |
| `nl` Netherlands | 12 | 66 | **complete** (2026-11-14): 66/66, 0 foreign after 3 rechecks (Maastricht routes through Belgium/Germany), 0 flags, 5 reverse checks, largest gap 3.5 % | `nl/routes.json` |
| `at` Austria | 8 | 28 | **complete**: 28/28, 0 foreign after 12 rechecks (many Tyrol/Vorarlberg routes run through Germany; Klagenfurt–Bregenz needed a second pass because avoiding Germany sent it through Italy; final 542.89 km Austria only), 2 reverse checks | `at/routes.json`, `at/probe.json` |
| `be` Belgium | 9 | 36 | **complete**: 36/36, one country on every route, 3 reverse checks but **Brussels–Antwerpen differs 10.3 % between directions** (58.2 vs 52.5 km; city centres, ring roads): treat Belgian distances as approximate | `be/routes.json` |
| `ie` Ireland | 10 | 45 | **complete**: 45/45, 0 foreign after 2 rechecks (Dundalk–Sligo, Drogheda–Sligo ran through Northern Ireland, +4.8 % / +4.4 % when avoided), 3 reverse checks | `ie/routes.json` |
| `it` Italy (mainland) | 26 | 325 | **complete**: 325/325, one country on every route, 2 flags (Trieste–Ancona 2.25 and Bolzano–Udine 2.53, long way round), 21 reverse checks, largest gap 1.98 % | `it/routes.json` |

- **Method:** openrouteservice Directions, `driving-car` (a car, not a moving truck), km. For `uk` and `de` the default fastest route is asked first; a route touching another country for 1 km or more is asked again with that country avoided. The home country is learned from the first route.
- **Licence and attribution:** results are CC-BY-SA 4.0 and need the exact line `© openrouteservice by HeiGIT | Data from OpenStreetMap` wherever the numbers are shown (https://account.heigit.org/info/tos). Commercial use of the Standard plan was confirmed in writing by HeiGIT (2026-11-09 log). Whether storing results and the share-alike scope are fine is still open (BACKLOG B8).
- **countryinfo shape (probe, 2026-11-14):** the summary distances are in thousands of km, so country detection must use the ids, never a km threshold (`at/probe.json`). Every stored route lists its `country_ids`; `fastest_km` is kept next to the domestic `km` whenever a route was asked again. "Fastest" is by time, so the domestic distance can even be shorter.
- **Drift:** OpenStreetMap changes, so a rerun can differ (the US table moved up to 4.4 % in a week, median 0.06 %). Keep the run date.
- **Limits:** straight-line points are city centres from Natural Earth, not addresses; Belfast needs a ferry; the ORS route limit is about 6,000 km (not reached in Canada).
- **Resume or extend:** workflow "Expansion routes" (manual), inputs `sets` (comma separated, for example `nl,at`) and `max_requests` per set; daily quota 2,000 requests on api.heigit.org shared by everything run that day. Each set is saved on its own branch `data/expansion-<set>` and copied here by PR.
