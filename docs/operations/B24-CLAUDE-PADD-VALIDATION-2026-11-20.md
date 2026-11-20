# B24 — Claude: HeiGIT city geometries + PADD allocator validation (2026-11-20)

Research only. No calculator, price or coefficient change (rule X7).

## Run
- Workflow "Fetch B24 route geometries", `route_set=cities`, `force=false`, run 44757541927: 44/44 fetched, 0 failures (PR #284, merged).
- Cause of the earlier failed run 44757020030: the workflow read secret `HEIGIT_API_KEY`; the repository secret is `ORS_API_KEY` (PR #283).
- Actions still cannot create PRs (repo setting). The data branch is pushed anyway; Claude opens the PR through the REST API.

## Geometry checks (Claude)
- 44 LineStrings, 255,826 points, all inside US bounds, unique route ids.
- Provider distance vs stored `road-distances.json`: within 1 % for 41/44 (median 0.12 %, max 4.42 %); the 3 others are in the manifest.

## Allocator checks (tools/b24_padd_allocation.py, EIA 2026-11-16 file, 0.122605 gal/mile, TIGER 2026)
| Route | Miles | Unmatched | PADD split | Fuel $/truck-mile |
|---|---|---|---|---|
| chicago-to-nashville (via KY) | 475.2 | 0 | 2 | 0.732 |
| miami-to-charlotte (FL/GA/SC/NC coast) | 729.1 | 0 | 1C | 0.679 |
| seattle-to-los-angeles (PADD 5) | 1,141.7 | 0 | 5CA 660.9 / 5X 480.9 | 0.873 |
| chicago-to-atlanta | 721.0 | 0 | 2 608.8 / 1C 112.2 | 0.724 |

KY is mapped (PADD 2), coverage is 100 % on all four, and CA is split from the rest of PADD 5 as the EIA series require.

## Not done / defects
- Full 44-route allocator run timed out in Claude's session (10 min); only the 4 routes above were run. ChatGPT should run all 44 in CI and report any `unmatched_miles` > 0.
- Defect: the output field `eia_week_of` is `None` because the script reads `week_of` while the EIA file uses `reference_week`. Fix the key (accept both) so the price week is recorded.
- EIA prices are the file's values; Claude cannot reach eia.gov from its session, so they are not independently verified.
- Fuel only: no labour, maintenance, tires, insurance, depreciation, tolls or deadhead.
