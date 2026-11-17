# B24 — Claude audit of the weighted VIUS report (2026-11-17)

**Reviewed:** `VIUS-2021-WEIGHTED-BOX-TRUCK-ANALYSIS-2026-11-17.md` (branch head d04176a, PR #256).
**Scope:** ChatGPT asked for an independent audit against the raw PUF, the data dictionary and the Census guide.
**Status:** PARTIAL. No production code, coefficient, price or UI changed.

## What I could NOT do

The raw PUF cannot be reproduced from my session: `www2.census.gov` returns HTTP 403 from the proxy (probed again 2026-11-17 evening, same result as this morning). So I did not re-run any of the four requested checks against the records:

1. Full-file totals and random-groups CV (179,817,852 vehicles; 1,896,992,660,361 miles; replicate rescaling 8 × group sum).
2. The filters BTYPE=07, GVWR 3–8, PRIMCOMMACT 11/12/13, PRIMPROD=23 and their weighted shares.
3. The handling of X / not reported / not applicable, MPG, maintenance bands, DEADHEADPCT, REPOSITIONPCT, TRUCKLOADPCT, LTRUCKLOADPCT.
4. Weighted coverage figures (45.5 %, 27.7 %, 28.2 %, 56.3 %, 7.6 %).

To close these, the owner must upload `vius_2021_puf.csv`, the data dictionary and the guide to this session (same three files ChatGPT used). Until then these points stay **unverified by Claude**.

## What I checked (arithmetic and internal consistency only, from the report's own numbers)

| Check | Result |
|---|---|
| GVWR table: records sum / weights sum | 6,039 / 1,317,003.1 = Box-truck totals in section 2 ✔ |
| GVWR table: each weighted share | all 9 shares recompute to the printed 2 decimals ✔ |
| GVWR classes 3–8: records, weights | 5,329 / 1,145,099.8 ✔; weighted share recomputes to 86.95 %, printed 86.9 % (rounding edge: 87.0 % would also be defensible) |
| Fuel table: records / weights | 6,039 / 1,317,003.1 ✔; all 8 shares recompute ✔ |
| Goods and furniture shares in section 2 | 51.9 % / 47.8 % and 5.0 % / 5.1 % recompute ✔ |
| Mean annual miles from printed totals | 18,840 / 18,858 / 18,666 / 15,815 vs printed 18,839 / 18,858 / 18,665 / 15,809: differences ≤ 6 miles, explained by the totals being printed to 3–4 significant figures ✔ |
| Full-file average miles | 1,896,992,660,361 / 179,817,852 = 10,549.52 ✔ |
| Maintenance bands | GM_COST sums to 99.99 %, ER_COST to 100.01 % (rounding) ✔ |

## Findings to correct in the report (no effect on conclusions)

1. **Duplicate heading:** two sections are numbered `## 2` (baseline reproduction and domain definitions). Renumber 3–10 or merge.
2. **Coverage wording is easy to misread.** The loaded/deadhead/reposition table mixes two bases: record coverage (my recomputation from the printed counts: LOADEDPCT 49.4 %, DEADHEADPCT 30.1 %, REPOSITIONPCT 30.7 %) and weighted coverage (printed 45.5 %, 27.7 %, 28.2 %). Both are plausible and different; label each column "records" or "weighted" so nobody compares them.
3. **Rounded mean vs published rounding:** state once that full-file average 10,549.52 rounds to 10,550 and that the four domain means above are derived from rounded totals.

## Conclusions that follow from the report even before the raw check

These are the report's own limits, and I agree with them as written:
- VIUS gives no fuel spend, gallons, MPG method, driver hours, speed or household-goods indicator; MPG must not become a coefficient.
- BTYPE=07 and PRIMPROD=23 do not identify residential movers; the furniture subset (303 records, CV ≈ 10 %) is too small and too ambiguous to represent them.
- Maintenance/repair bands are 2021 categorical bands, not a per-mile rate.
- DEADHEADPCT / REPOSITIONPCT carry the guide's high-nonsampling-error warning and apply to 27–28 % of box-truck weight only.

## Impact on B24

VIUS stays a descriptive source (GVWR mix, fuel-type mix, annual utilization, plausibility band for maintenance). The bottleneck is unchanged: no source yet closes non-fuel truck cost, truck-day ownership, crew productivity, speed, empty return or utilization for household-goods moves. Those inputs stay **unresolved**; nothing enters the calculator.

## Next

1. Owner uploads the three VIUS files to Claude → I reproduce the totals, the CV and the filters, then update this file.
2. PR #256 is `dirty` against main (its branch predates PR #258 and shows those files as deleted). Rebase onto main before any merge; I did not merge it.
