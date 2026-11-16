# B15/B16 post-merge audit — 2026-11-16

## Deployment state

- PR #254 was merged into `main` at 2026-11-16 06:16 UTC.
- Merge commit: `96cb718868340e8323565e9e84fd4126c50a41b4`.
- Vercel production deployment for that exact commit reached `READY`; its aliases include `relocation-cost-psi.vercel.app`.
- This verifies deployment status and alias assignment. It does not replace a direct production browser interaction check; B16 stays open until that check is completed.

## Critical correction to the prior size-scaling analysis

The 2026-11-15 diagnostic `B15-SIZE-SCALING-ANALYSIS-2026-11-15.md` and `tools/b15-size-scaling-check.mjs` still map the old “2–3BR” group to numeric size `1.8`. After B16, the actual UI/data mapping is:

- `1.0`: Studio / 1 bedroom
- `1.35`: About 2 bedrooms
- `1.8`: About 3 bedrooms
- `2.4`: 4+ bedrooms

The prior diagnostic omitted `1.35` entirely and treated `1.8` as a combined 2–3BR group. Therefore its “3/3 inside” conclusion for the old 2–3BR category is not a valid four-size acceptance test after B16. Do not use its 9/9 acceptance statement to authorize recalibration.

## Reproduced current model vs CMR range

Using the current `calculateBudget()` formula, the verified U-Haul mileage-band floors ($1,657 at 1,001–1,500 miles; $2,190 at 1,501–2,000 miles), full-service type 1.65, no extra user-entered costs, and the calculator's 10% contingency, the model totals were compared with the same 10%-adjusted CMR 25th–75th percentile ranges.

| Road miles | Size value | Model total incl. 10% | CMR total range incl. 10% | Result |
|---:|---:|---:|---:|---|
| 1,071 | 1.0 | $2,482 | $2,079–$2,662 | inside |
| 1,071 | 1.35 | $2,713 | $2,992–$4,389 | 9% below low end |
| 1,071 | 1.8 | $3,010 | $5,082–$6,699 | 41% below low end |
| 1,071 | 2.4 | $3,406 | $8,382–$12,122 | 59% below low end |
| 1,089 | 1.0 | $2,494 | $2,079–$2,662 | inside |
| 1,089 | 1.35 | $2,728 | $2,992–$4,389 | 9% below low end |
| 1,089 | 1.8 | $3,030 | $5,082–$6,699 | 40% below low end |
| 1,089 | 2.4 | $3,433 | $8,382–$12,122 | 59% below low end |
| 1,501 | 1.0 | $3,334 | $2,387–$3,289 | 1% above high end |
| 1,501 | 1.35 | $3,657 | $3,476–$4,543 | inside |
| 1,501 | 1.8 | $4,073 | $5,973–$7,370 | 32% below low end |
| 1,501 | 2.4 | $4,628 | $8,811–$12,716 | 47% below low end |

The 1,071- and 1,089-mile routes share the CMR 1,000–1,499-mile band; 1,501 miles uses the 1,500–1,999-mile band. These are comparisons against one publisher's network distribution, not national-market validation or independent route-level holdouts. They diagnose a material size-scaling mismatch, but do not by themselves justify changing coefficients.

## Source freshness and comparability

- CMR's current 2026 report says the distance/size bands use 1,136 moves booked January 2025–September 2026; the 4+BR 1,500–1,999-mile cell uses the longer December 2022–September 2026 period. The report also references 2,046 booked moves overall; do not imply that all 2,046 contribute to every size-distance cell. Cell-level counts remain in `data/cmr-full-service-ranges.json`.
- Long Distance Moving's current 2026 report states 543 booked interstate moves from June 1–November 5, 2026. Its current table reports medians of $3,420 (under 4,000 lb), $6,890 (4,000–9,000 lb), and $16,070 (over 9,000 lb). The older B15 matrix recorded $6,630 and $16,790 for the latter two groups; those figures are stale against the current report.
- LDM groups by shipment weight, while CMR groups by cubic-foot volume. Their bedroom labels are approximate and their distance bands differ. Do not merge their values or use their difference as a direct calibration target.

## Decision / next action

1. Keep all production coefficients and formulas unchanged.
2. Correct the diagnostic mapping and include all four B16 values in every future acceptance test.
3. Obtain at least one genuinely independent source with disclosed size-by-distance sample counts and clear service/size definitions for the 2BR, 3BR and 4+BR groups; verify ownership and source overlap before treating it as independent.
4. Complete a direct production browser check of calculator interactions and legacy shared links after PR #254.
5. Keep B15 active; keep B16 open only for production verification. No national-calibration claim is supported.

## Sources checked 2026-11-16

- CMR 2026 booked-price report: https://www.consumermovingreviews.com/cheapest-long-distance-moving-companies/
- Long Distance Moving 2026 booked-move report: https://longdistancemoving.com/national-moving/moving-cost-report-2026
- Project implementation: `src/lib/calculator.js`, `data/coefficients.json`, `data/cmr-full-service-ranges.json`.
