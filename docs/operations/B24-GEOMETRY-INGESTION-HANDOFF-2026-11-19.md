# B24 geometry ingestion — operations handoff (2026-11-19)

## Source of truth
Read `OPS-ROOM.md`, `docs/operations/WORK-LOG.md`, and the B24 row in `docs/operations/BACKLOG.md` before acting. This file is an execution handoff, not a replacement for those records.

## Current verified state
- PR #273 merged to `main` at merge commit `19d4a1322f0dfee03f4ef57ee2a5a67be1eba10a`.
- Claude's final review comment: https://github.com/Fadhel-docom/relocation-cost/pull/273#issuecomment-7021508980
- Claude verified: KY maps to PADD 2; all 50 states + DC are mapped; CLI requires `--gallons-per-mile`; allocation and pricing share the exact 99.999% gate using unrounded `coverage_pct_exact`.
- Claude reports allocator tests 14/14, TIGER converter tests run in CI (requires pyshp), all Actions green, and Vercel success. The PR's 18-test total is 14 allocator + 4 TIGER converter tests.
- VIUS primary fuel estimator from PR #276: 0.122605 gallons per vehicle-mile (CV 1.6%, n=1,080, TABWEIGHT sum 207,128, 8 RGROUPs). At the cited EIA U.S. diesel snapshot $5.937/gal, this gives about $0.728 fuel-only per truck-mile. This is not a full operating cost or a mover quote.
- No production calculator, coefficient, displayed price, or stored route distance changed.

## Immediate task A — Census TIGER state boundaries
Workflow: `.github/workflows/fetch-b24-tiger-boundaries.yml`
- Event: manual `workflow_dispatch`.
- Input: `base_branch=main`.
- No secret is required.
- Run once. It downloads official Census TIGER/Line 2026 state polygons and creates a data PR if output changed.
- Inspect the run logs and generated PR before merge. Verify 51 unique features (50 states + DC), NAD83 geographic CRS, coordinate bounds, source URL, download timestamp, SHA-256, and attribution.
- Confirm that Alaska and Hawaii are present as boundary features even though route coverage may remain incomplete.
- Do not infer a route-level PADD split from state centroids or endpoint states.

## Immediate task B — HeiGIT route geometries
Workflow: `.github/workflows/fetch-b24-route-geometries.yml`
- Event: manual `workflow_dispatch`; inputs are `base_branch=main`, `route_set=all|cities|states`, and `force=false`.
- Requires repository Actions secret `HEIGIT_API_KEY`. Never print, paste, commit, or expose the key.
- If the secret is not configured, stop; do not request the owner to reveal it in chat.
- Do not start with `route_set=all`. First run `route_set=cities` only if the secret exists, then inspect the manifest and route quality. The script requests each route separately with a 1.6-second gap, excludes Canada, stores provider distance/duration and compares provider miles with stored miles.
- Inspect: requested/fetched/skipped/failures, every >1% stored-distance mismatch, missing routes, geometry type, provider metadata, license/attribution and route IDs. Do not allocate routes flagged `stored_distance_match=false`.
- Ask Claude to select a small, representative validation subset from fetched city routes (a Kentucky crossing, Florida/North Carolina coastal route, and a PADD 5 route) and run the PADD allocator against the TIGER polygons. Report unmatched miles and coverage per route. The current workflow fetches all selected routes; if a smaller subset is needed, implement a safe allowlist option in a separate reviewed change rather than editing generated data manually.
- Only after the city sample is sound, fetch state-page routes, then remaining routes. Keep quota use measured and avoid force-refetch unless a documented reason exists.

## PADD allocation / pricing acceptance
- Use `tools/b24_padd_allocation.py` with the official TIGER GeoJSON and actual route geometry.
- Require at least 99.999% raw route-mile coverage. Rounded display percentages must never control acceptance.
- No endpoint-PADD fallback, no renormalizing covered miles, and no silently assigning unmatched miles.
- Reconcile route geometry length with provider and stored road distances. Any mismatch over 1% blocks that route pending investigation.
- Fuel-only route cost is `sum(PADD route miles × 0.122605 gal/vehicle-mile × current PADD diesel USD/gal)`; keep per-vehicle unit explicit. Use current EIA price data by the correct PADD/subdistrict; do not average endpoints.
- Preserve the route-level output, source dates, manifest and QA results as auditable research data. No production price until remaining components and holdout validation pass.

## Remaining independent cost evidence
- Official BLS May 2025 OEWS state and metro files must be retrieved and parsed directly. WageDex secondary transcriptions with unknown RSE remain unapproved. Preserve SOC, area code, employment, RSE, median/mean and suppression flags.
- Tire lifecycle/cost, mover-specific insurance, truck acquisition/resale/depreciation, driver/crew hours and overhead remain separate evidence gaps. Do not substitute Class 8 freight figures as mover coefficients.
- Validate the model on holdout routes/classes not used in calibration and compare to public mover ranges only after the model is frozen.

## Required close-out
Claude must record exact workflow run URLs, generated PRs, source hashes, route coverage and failures in OPS-ROOM and WORK-LOG. ChatGPT must update the B24 backlog status and research note after verified results. Do not mark B24 complete until route allocation and holdout tests pass.