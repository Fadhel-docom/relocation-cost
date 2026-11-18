# B24 — Route mileage allocation to EIA PADDs

**Status (2026-11-18): method and utility implemented; route geometries and boundary file still required.** No route has been assigned a PADD split yet, and no PADD-weighted fuel cost is approved.

## Why the existing route data is insufficient

- `data/road-distances.json` stores a road-distance scalar for each state pair; it does not store the route line or states traversed.
- `data/cities.json` documents city-center coordinates, while `data/city-routes.json` describes city pages based on great-circle city-center distance. Those values cannot identify intermediate states.
- An endpoint-state average (or a straight-line path through state centroids) is not a valid substitute for the mileage actually driven in each PADD.

## Implemented method

`tools/b24_padd_allocation.py` accepts:
1. A road-route GeoJSON LineString/MultiLineString (ideally the same ORS/HeiGIT driving-car route and endpoint pair used for the distance benchmark).
2. A Census/TIGER state-boundary GeoJSON FeatureCollection with postal abbreviation in `STUSPS` (or one of the documented aliases).
3. A weekly EIA diesel-price JSON keyed by PADD 1–5.
4. A truck MPG value; default is the VIUS weighted diesel benchmark 9.10 MPG.

The utility samples each route line at no more than 0.25-mile intervals, computes geodesic length for each short piece, and assigns each sample to the containing state polygon. It then groups state miles by EIA PADD and calculates **fuel-only** cost as:

`fuel cost = Σ(PADD route miles ÷ truck MPG × PADD diesel price per gallon)`

State-to-PADD mapping follows the EIA definition: PADD 1 includes New England, Central Atlantic and Lower Atlantic states; PADD 2 includes the Midwest states (including Oklahoma and Tennessee); PADD 3 the Gulf Coast states; PADD 4 the Rocky Mountain states; PADD 5 the West Coast states. This mapping is not inferred from route endpoints.

## Fail-closed checks

- Reject unsupported or empty geometry.
- Reject route geometry that differs from an optional expected ORS road distance by more than 1%.
- Reject when more than 0.5% of route mileage cannot be matched to a state polygon. Missing mileage is never silently reassigned to an endpoint PADD.
- Require a diesel price for every PADD traversed.
- Keep all outputs explicitly labelled fuel-only; no labor, maintenance, tires, insurance, depreciation, tolls, overhead, or unprovided deadhead is included.

Run the isolated tests with:

`python -m unittest tools.test_b24_padd_allocation -v`

## Required data before production research can proceed

- A route GeoJSON for each route being tested, generated from the relevant road-routing provider and with provider attribution/terms retained.
- The matching Census/TIGER state boundary GeoJSON, with vintage and download source recorded.
- EIA weekly diesel prices for the same reference week.
- Route distance reconciliation and a coverage report for every route.

**Current limitation:** the repository currently has no route-geometry bundle. The new utility and tests make the allocation reproducible once geometry is obtained, but they do not manufacture or estimate route paths. No production coefficient, price, calculator formula, or published estimate is changed.

## Sources

- EIA PADD definitions: https://www.eia.gov/tools/glossary/index.php?id=Petroleum+Administration+for+Defense+District
- EIA weekly diesel prices: https://www.eia.gov/petroleum/gasdiesel/
- ORS/HeiGIT terms and route source already documented in `data/road-distances.json`.
- Census TIGER/Line geography: https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html
