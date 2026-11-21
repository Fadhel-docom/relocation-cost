# B24 — ChatGPT handoff: 44-city PADD validation (2026-11-20)

## Verified on main before PR #286
- PR #280: official Census TIGER/Line 2026 state boundaries merged; 51 features (50 states + DC).
- PR #283: route workflow maps existing GitHub Actions secret ORS_API_KEY into the fetch script's HEIGIT_API_KEY environment variable. Secret value was never read or printed.
- PR #284: HeiGIT city geometry workflow completed 44/44, zero request failures.
- PR #285: PADD allocator validated on four representative routes with 100% reported coverage; KY maps to PADD 2 and California is split from non-California PADD 5 pricing.

## PR #286 and full CI result
- PR: https://github.com/Fadhel-docom/relocation-cost/pull/286
- Corrected all-city workflow run: https://github.com/Fadhel-docom/relocation-cost/actions/runs/44811060668
- Artifact: b24-padd-city-validation (artifact ID 14667720033; SHA-256 d21e133521d0b6a7d44d90966fa4198fd79ae9331b30a0b99fa8442ec63df6a5).
- 44 expected, 44 files, 44 processed, 0 integrity errors; focused PADD/TIGER suite 19/19.
- 41 routes validated; all 41 have 100.000% state-boundary coverage and 0 unmatched miles.
- 3 routes blocked by the strict >1% stored-distance reconciliation gate: Atlanta–Boston 4.418%, Boston–New York 1.002%, Charlotte–New York 3.058%. No fuel estimate was emitted for these three.
- The 41 accepted fuel-only scenarios use 0.122605 gal/vehicle-mile and EIA reference week 2026-11-16. Per-truck-mile results range $0.6794–$0.9481 (median $0.7235). This is fuel only, not full operating cost, not a mover quote, and not a production coefficient.

## Important newly discovered routing-parameter mismatch
The existing matrix is built through src/lib/road-distance.js::buildDirectionsBody:
- radiuses: [-1, -1]
- geometry: false
- instructions: false
- units: m
- no avoid_borders or avoid_countries options.

The GeoJSON fetcher tools/fetch_heigit_route_geometries.mjs currently:
- does not set radiuses
- adds avoid_borders: controlled and avoid_countries: [CA]
- requests full GeoJSON geometry.

Thus the three >1% deltas may reflect request/snap-setting differences, not only map-network updates. Do not change data/road-distances.json or bypass the gate. Claude should review whether to run a small controlled comparison using identical request parameters (only after quota impact is understood). No further HeiGIT request has been made after the 44-route fetch.

## CI and deployment boundaries
Build, Validate calculator/site, B24 tests, and the all-city workflow passed on PR #286. Rendered-pages is report-only. Vercel PR preview was READY; no production deployment or production calculator change is claimed. PR #286 remains Draft pending Claude review.

## Next sequence
1. Claude reviews PR #286 and the route-parameter mismatch.
2. If warranted, compare the three routes with matrix-compatible request settings; reconcile only with evidence and owner-approved scope if production distances would change.
3. Retrieve official BLS May 2025 State and Metro OEWS ZIPs:
   - https://www.bls.gov/oes/special-requests/oesm25st.zip
   - https://www.bls.gov/oes/special-requests/oesm25ma.zip
   Extract SOC 53-3032, 53-3033 and 53-7062 while retaining area codes, employment, RSE, mean/median wages and suppression flags. OEWS is a broad occupational proxy, not mover-specific compensation. Technical notes: https://www.bls.gov/oes/current/oes_tec.htm
4. Continue independent tire, insurance, capital/depreciation and labor-time evidence. No production parameter until all components and holdout validation pass.

## Scope
Research-only. No production calculator code, route matrix, coefficient, published price or customer-facing estimate changed in PR #286.
