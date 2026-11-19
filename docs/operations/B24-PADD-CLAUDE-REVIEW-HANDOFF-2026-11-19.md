# B24 PADD allocator — Claude re-review handoff (2026-11-19)

## Source of truth
Read OPS-ROOM.md, docs/operations/WORK-LOG.md, and B24 row in docs/operations/BACKLOG.md first.

## PR and branch state
- PR: https://github.com/Fadhel-docom/relocation-cost/pull/273
- Branch: research/b24-padd-clean-2026-11-18
- PR #276 merged to main at 5fc27d009b6229e1d2f85345c5b77f4a5837506b.
- GitHub currently reports PR #273 branch was reconciled with current main using merge commit 58825ef465cd6fd06567f985fd7bfef1eb6d0220; raw GitHub API reports mergeable=true (mergeable_state unstable due Vercel rate-limit status). Current branch head has since advanced with TIGER pipeline work.

## Claude's prior findings
1. KY missing from PADD_BY_STATE.
2. --mpg default 9.10 used arithmetic-mean MPG; fuel requires gallons per mile.
3. Allocation accepted 0.5% unmatched mileage but fuel pricing required 99.999% coverage.

## Changes ChatGPT made
Files: tools/b24_padd_allocation.py and tools/test_b24_padd_allocation.py.
- Added KY to PADD 2.
- Replaced the default MPG input with required --gallons-per-mile.
- Fuel formula: matched PADD miles × gallons per mile × diesel price.
- Aligned allocation and pricing gates at 99.999% route-mile coverage; both stages reject below that exact threshold. No unmatched mileage is silently assigned, omitted from cost, or normalized.
- Added tests for all 50 states + DC, a Kentucky route, and 99.999% strict coverage boundary. There are 11 test methods.

## New Census boundary pipeline added by ChatGPT
- `tools/fetch_tiger_state_boundaries.py` downloads official Census 2026 TIGER/Line `tl_2026_us_state.zip`, validates NAD83 geographic coordinates, exact 50 states + DC coverage, and coordinate bounds; records source ZIP SHA-256 and download timestamp.
- `.github/workflows/fetch-b24-tiger-boundaries.yml` manually runs the converter and opens a data PR. It has not been executed yet; no GeoJSON file is in the repository.
- `tools/test_fetch_tiger_state_boundaries.py` adds synthetic-shapefile tests. The B24 test workflow installs pinned pyshp 2.3.1 and runs both allocator and converter suites; the first run passed 16/16, and the synthetic shapefile fixture ring orientation was corrected afterward so a clean rerun is still required.
- The HeiGIT route workflow now opens a review PR after a successful fetch. It remains manual and requires Actions secret HEIGIT_API_KEY; verify secret availability through a workflow run, never expose it.

## Requested review
1. Reconcile branch with main, preserving both sets of changes.
2. Review both code files in full, especially PADD coverage, fuel units, 99.999% threshold consistency, and no-renormalization.
3. Confirm that 99.999% is enforced identically in allocation and pricing; test edge cases and ensure rounded coverage cannot pass a failing raw ratio.
4. Review the TIGER converter's archive handling, CRS validation, 51-feature state/DC coverage and pyshp fixture tests.
5. Run the manual Census TIGER workflow and inspect the generated data PR. Run the HeiGIT geometry workflow only if HEIGIT_API_KEY is configured; inspect quota/error report and generated manifest.
6. Run both Python test suites in CI and report exact counts/results.
7. Re-check route mileage conservation, polygon holes, multipart routes, stored-distance guard and PADD price fallbacks.
8. Do not claim BLS/EIA source verification unless the original files were actually inspected.
9. Keep production formula, coefficients, displayed prices and route data untouched.
10. Record review in PR, OPS and WORK-LOG. Merge only after conflict resolution and green CI.

## Known evidence gaps
- No route GeoJSON bundle or TIGER state boundary file was present; no route-level PADD mileage or fuel prices computed.
- BLS geographic WageDex rows are secondary transcriptions with unknown RSE; Chicago is missing.
- Insureon policy medians have no fleet-size denominator.
- ATRI tire/insurance/cost data are freight comparators, not household-goods mover coefficients.
- Tire lifecycle and truck acquisition/resale/depreciation evidence remain incomplete.