# B24 — Claude audit of the weighted VIUS report (2026-11-17, evening)

**Reviewed:** `VIUS-2021-WEIGHTED-BOX-TRUCK-ANALYSIS-2026-11-17.md` (branch head d04176a, PR #256).
**Inputs:** the owner uploaded the Census files to Claude: `vius_2021_puf.csv` (67,952 rows x 168 columns), `vius-2021-puf-data-dictionary.xlsx`, `vius_2021_puf_user_guide.pdf`. Everything below was recomputed by Claude from the raw CSV (pandas, TABWEIGHT, RGROUP), not copied from the report.
**Status:** COMPLETE for the four requested checks. No production code, coefficient, price or UI changed.
(An earlier version of this file, commit 666ea5b, was partial because Census returned 403 from Claude's proxy; this version replaces it.)

## Verdict

All numbers in the report that I could recompute reproduce exactly. I found no numerical error. Three presentation fixes are listed at the end.

## 1. Full-file totals and random-groups method (guide eqs. 4-6)

| Check | Claude recomputation | Source |
|---|---|---|
| Weighted vehicles, all 67,952 records | 179,817,852.1 | guide Table A2: 179,817,852 |
| Weighted annual miles (TABWEIGHT x MILESANNL) | 1,896,992,660,361.1 | guide: 1,896,992,660,361 |
| Average annual miles | 10,549.52 (rounds 10,550) | guide: 10,550 |
| Guide worked example, BTYPE=25 | 71 records, 13,605.8 vehicles; all 8 replicate totals identical to the guide (13,878.4 / 14,816.0 / 8,673.6 / 11,824.8 / 16,628.0 / 6,910.4 / 9,600.0 / 26,515.2); CV 16.01 % | guide example (replicate = 8 x group weighted sum) |

The guide formula is: replicate total = G x sum of weights in the group, variance = sum of squared deviations / (G(G-1)), CV = sqrt(variance) / estimate x 100, with a ratio replicate for averages. The report's description and my implementation match it. For the four Box-truck domains all eight groups are non-empty, so G = 8.

## 2. Domains, weighted shares and CVs

| Domain | Records | Weighted vehicles | Share of Box-truck weight | Annual miles (bn) | CV miles | Mean miles | CV mean |
|---|---:|---:|---:|---:|---:|---:|---:|
| BTYPE=07 | 6,039 | 1,317,003.1 | 100 % | 24.812 | 2.89 % | 18,839 | 2.66 % |
| GVWR_CLASS 3-8 | 5,329 | 1,145,099.8 | 86.95 % | 21.594 | 3.52 % | 18,858 | 2.83 % |
| PRIMCOMMACT 11/12/13 | 3,132 | 629,924.0 | 47.83 % | 11.758 | 3.82 % | 18,665 | 3.28 % |
| PRIMPROD=23 | 303 | 67,404.5 | 5.12 % | 1.066 | 10.65 % | 15,809 | 9.88 % |

Identical to the report to the printed precision. Filters confirmed against the dictionary: BTYPE 07 = Box truck; PRIMCOMMACT 11/12/13 = goods of owner / of another / online local goods; the GVWR variable in the PUF is `GVWR_CLASS` (codes 1, 2A, 2B, 3-8). The GVWR class table and the FUELTYPE table (codes 10, 20, 31, 33, 34, 36, 40, X) match record counts and weights exactly. Furniture subset fuel mix 54.86 % diesel / 44.80 % gasoline / 0.34 % not reported also matches.

## 3. Treatment of X / not reported / not applicable, coverage, cost bands

- Coverage recomputed (weighted / records, Box trucks): LOADEDPCT 45.5 % / 49.4 %; DEADHEADPCT 27.7 % / 30.1 %; REPOSITIONPCT 28.2 % / 30.7 %; MPG 56.3 % / 61.6 %; TRUCKLOADPCT and LTRUCKLOADPCT 7.6 % / 7.6 % (456 records). Furniture subset: 301, 229, 230, 251 and 112 numeric records. The report's printed weighted coverage and counts are correct; the missing/X records are excluded from the means, not treated as zero.
- Weighted means reproduce: LOADEDPCT 77.84 % (furniture 69.85 %), DEADHEADPCT 22.41 % (24.81 %), REPOSITIONPCT 12.09 % (13.61 %).
- GM_COST: dictionary codes 1-7 are the seven bands (< $100 ... $10,000+); the other code present is excluded as in the report, giving 4,024 records, weight 821,564.5 and the printed distribution. ER_COST: codes 1-6 are the bands, code 7 = "Not reported" per the dictionary; 1,557 records, weight 326,138.3 and the printed distribution reproduce. The dictionary rows for GM_COST's extra code are cut off in my extract, so its label ("not reported") is inferred from the matching counts, not read.
- MPG: the guide states that the calculation method is not provided on the PUF (guide section on variables/documentation); the guide also lists operating-time share spent idling among questions excluded from the PUF. DEADHEADPCT carries the dictionary's "high nonsampling error" note. The report's position (do not use MPG as a coefficient; deadhead/reposition exploratory only) is supported.
- Unweighted mean MPG (10.6 weighted, 10.58 furniture) can be computed mechanically but stays out of the model, as the report says.

## 4. Presentation fixes for the report (no effect on conclusions)

1. Two sections are numbered `## 2`; renumber.
2. Label the coverage columns "weighted" vs "records" explicitly (both are correct, they differ).
3. State that domain mean miles use the exact weighted ratio; the numbers recomputed from rounded billions differ by up to 6 miles, so nobody re-derives them from the rounded totals.

## Impact on B24

VIUS is verified as a descriptive source only: GVWR mix, fuel-type mix, annual utilization, 2021 maintenance/repair bands, exploratory empty-mile shares. It still gives no fuel spend, no usable MPG method, no crew or operating hours, no speed, and no household-goods mover identifier. Those inputs stay unresolved; nothing enters the calculator.

## Next

1. ChatGPT applies the three presentation fixes on its report.
2. PR #256 is `dirty` against main (branch predates PR #258); rebase before any merge. Claude did not merge it.
3. Remaining open B24 gaps: non-fuel truck cost, truck-day ownership, crew productivity, speed, empty return, utilization. VIUS does not close them.

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
