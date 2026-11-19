# B24 PADD allocator — Claude re-review handoff (2026-11-19)

## Source of truth
Read OPS-ROOM.md, docs/operations/WORK-LOG.md, and B24 row in docs/operations/BACKLOG.md first.

## PR and branch state
- PR: https://github.com/Fadhel-docom/relocation-cost/pull/273
- Branch: research/b24-padd-clean-2026-11-18
- PR #276 merged to main at 5fc27d009b6229e1d2f85345c5b77f4a5837506b.
- GitHub currently reports PR #273 mergeable=false / dirty. Reconcile with current main before merge, preserving main's operations-room rule #23 and all B24 research changes.

## Claude's prior findings
1. KY missing from PADD_BY_STATE.
2. --mpg default 9.10 used arithmetic-mean MPG; fuel requires gallons per mile.
3. Allocation accepted 0.5% unmatched mileage but fuel pricing required 99.999% coverage.

## Changes ChatGPT made
Files: tools/b24_padd_allocation.py and tools/test_b24_padd_allocation.py.
- Added KY to PADD 2.
- Replaced the default MPG input with required --gallons-per-mile.
- Fuel formula: matched PADD miles × gallons per mile × diesel price.
- Aligned pricing gate with allocation at 99.5%; below 99.5% fail; at/above it price matched mileage only, report unmatched miles, and never renormalize.
- Added tests for all 50 states + DC, a Kentucky route, and 99.5%/99.49% threshold boundaries. There are 11 test methods.

## Requested review
1. Reconcile branch with main, preserving both sets of changes.
2. Review both code files in full, especially PADD coverage, fuel units, 99.5% threshold, and no-renormalization.
3. Consider whether 0.5% unmatched tolerance is defensible; if changed, align both stages and tests.
4. Run python -m unittest tools.test_b24_padd_allocation -v in CI and report exact count/result.
5. Re-check route mileage conservation, polygon holes, multipart routes, stored-distance guard and PADD price fallbacks.
6. Do not claim BLS/EIA source verification unless the original files were actually inspected.
7. Keep production formula, coefficients, displayed prices and route data untouched.
8. Record review in PR, OPS and WORK-LOG. Merge only after conflict resolution and green CI.

## Known evidence gaps
- No route GeoJSON bundle or TIGER state boundary file was present; no route-level PADD mileage or fuel prices computed.
- BLS geographic WageDex rows are secondary transcriptions with unknown RSE; Chicago is missing.
- Insureon policy medians have no fleet-size denominator.
- ATRI tire/insurance/cost data are freight comparators, not household-goods mover coefficients.
- Tire lifecycle and truck acquisition/resale/depreciation evidence remain incomplete.