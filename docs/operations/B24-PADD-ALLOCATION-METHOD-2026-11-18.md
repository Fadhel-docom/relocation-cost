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
3. A weekly EIA diesel-price JSON keyed by PADD 1A/1B/1C, PADD 2–4, and the PADD 5 California / West Coast-less-California price series; aggregate PADD 1/5 fallback is supported.
4. A required gallons-per-mile value. Use the audited VIUS class 6–7 diesel estimate `0.122605 gal/mile` (equivalent harmonic MPG 8.157); never default to arithmetic-mean MPG.

The utility samples each route line at no more than 0.25-mile intervals, computes geodesic length for each short piece, and assigns each sample to the containing state polygon. Kentucky is explicitly included in PADD 2. It then groups state miles by EIA PADD and calculates **fuel-only** cost as:

`fuel cost = Σ(PADD route miles × weighted gallons per mile × PADD diesel price per gallon)`

State-to-PADD mapping follows the EIA definition: PADD 1 includes New England, Central Atlantic and Lower Atlantic states; PADD 2 includes the Midwest states (including Oklahoma and Tennessee); PADD 3 the Gulf Coast states; PADD 4 the Rocky Mountain states; PADD 5 the West Coast states. This mapping is not inferred from route endpoints.

## Fail-closed checks

- Reject unsupported or empty geometry.
- Reject route geometry that differs from an optional expected ORS road distance by more than 1%.
- Require at least 99.999% route-mile coverage in both geometry allocation and fuel pricing. The same threshold is enforced at both stages; missing mileage is never silently reassigned to an endpoint PADD or allowed to pass one stage only.
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


## 2026-11-18 — HeiGIT route-geometry ingestion pipeline

Added `tools/fetch_heigit_route_geometries.mjs` and manual workflow `.github/workflows/fetch-b24-route-geometries.yml`. The fetcher reads the existing 44 city route definitions and directional state-page routes, uses the exact city-center/state-centroid coordinates and the corresponding stored road-distance matrix key, and requests full GeoJSON geometry plus provider duration from the current endpoint:

`POST https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson`

It explicitly excludes Canada using the ORS `avoid_countries: ["CA"]` routing option, fetches sequentially with a 1.6-second gap to stay below the published 40 requests/minute account rate, and stores provider distance/duration, existing matrix distance, difference percentage, timestamp, licence, and attribution. A >1% difference is flagged and the PADD allocator refuses that geometry until reconciled. API key is read only from the `HEIGIT_API_KEY` GitHub Actions secret; it is never printed or committed.

The manual workflow can fetch all routes, city routes only, or state routes only. It writes successful outputs to a new data branch and opens a PR. If some requests fail, it preserves successful outputs and the manifest in that PR, then marks the run failed so the missing routes are not hidden. No API call has been executed by this PR; no HeiGIT quota has been consumed by adding the pipeline.

Official API references:
- HeiGIT/ORS API playground and V2 GeoJSON Directions endpoint: https://playground.heigit.org/
- ORS routing options, including `avoid_countries`: https://giscience.github.io/openrouteservice/api-reference/endpoints/directions/routing-options
- ORS country list (Canada code/identifier): https://giscience.github.io/openrouteservice/technical-details/country-list
- HeiGIT endpoint migration: https://ask.openrouteservice.org/t/deprecating-api-openrouteservice-org-in-favour-of-api-heigit-org/7912

**Credential requirement:** repository secret `HEIGIT_API_KEY` must be configured before the manual workflow can run. Never put the key in source code, issue comments, or chat. Existing Vercel environment variables are not read or decrypted by this workflow.


## 2026-11-18 — EIA diesel snapshot and subdistrict-aware PADD pricing

Added `data/research/eia-diesel-padd-prices-2026-11-16.json` using EIA's November 16, 2026 weekly on-highway diesel series (released November 17; taxes included):
- East Coast PADD 1: $5.782/gal; New England 1A: $6.225; Central Atlantic 1B: $6.309; Lower Atlantic 1C: $5.541.
- Midwest PADD 2: $5.967; Gulf Coast PADD 3: $5.547; Rocky Mountain PADD 4: $6.011.
- West Coast PADD 5: $6.948; California series: $7.733; West Coast less California: $6.269.

The allocator now maps PADD 1 states to 1A/1B/1C and PADD 5 states to California (5CA) vs West Coast less California (5X), where EIA publishes distinct prices. If subdistrict/subarea prices are absent, it falls back to aggregate PADD 1 or PADD 5. Added tests for both subdistrict weighting and aggregate fallback. These are EIA price-series areas; 5CA/5X are not formal additional PADD districts.

No route fuel cost is calculated yet because no route GeoJSON or TIGER polygons are in the repository. This is a dated price input snapshot, not a current evergreen price; future estimates must use the EIA week closest to the move date and preserve the price week.

Official source: https://www.eia.gov/dnav/pet/PET_PRI_GND_A_EPD2D_PTE_DPGAL_W.htm (EIA weekly retail gasoline and diesel prices, dollars per gallon including taxes).
