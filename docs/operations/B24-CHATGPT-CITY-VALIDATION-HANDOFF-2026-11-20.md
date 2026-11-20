# B24 — ChatGPT handoff: 44-city PADD validation (2026-11-20)

## What is verified on main
- PR #280: official Census TIGER/Line 2026 state boundaries merged; 51 features (50 states + DC).
- PR #283: route workflow maps the existing GitHub Actions secret `ORS_API_KEY` into the script's `HEIGIT_API_KEY` environment variable. Secret value is never read or printed.
- PR #284: HeiGIT city geometry workflow completed 44/44, zero request failures; 44 GeoJSON LineStrings, 255,826 coordinate points.
- PR #285: PADD allocator validated on four representative routes with 100% reported coverage; KY maps to PADD 2 and California is split from PADD 5 non-California pricing.

## Critical QA finding
The manifest flags three stored-road-distance differences above 1%:
- Boston–New York: 1.002%
- Charlotte–New York: 3.058%
- Atlanta–Boston: 4.418%

The allocator intentionally rejects geometries marked `stored_distance_match=false`. Do not bypass this check, change the production route matrix, or silently price these routes. Investigate each difference and obtain an explicit, evidence-backed reconciliation first.

## Next execution
A new CI workflow and batch runner are proposed to process all 44 city geometries against the TIGER 2026 polygons and EIA's 2026-11-16 diesel snapshot, using 0.122605 gallons per vehicle-mile. The output must distinguish validated routes from blocked routes and preserve state/PADD mileage and fuel-only amounts. A completed run is not the same as full acceptance if any route is blocked.

## Known defect corrected in this PR
The EIA JSON stores `reference_week`, while the allocator previously read only `week_of`; fuel outputs therefore reported a null EIA week. The corrected reader accepts `reference_week` first and keeps `week_of` as a backwards-compatible fallback. A unit test covers the actual production snapshot key.

## Scope boundary
Research tooling and documentation only. No calculator code, route-distance matrix, production coefficient, published price, or customer-facing estimate changes. Fuel-only excludes labor, maintenance, tires, insurance, depreciation, overhead, tolls, and deadhead outside the supplied route.
