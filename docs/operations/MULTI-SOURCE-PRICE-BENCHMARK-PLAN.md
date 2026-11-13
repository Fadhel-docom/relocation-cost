# Multi-source price benchmark and calibration plan

**Owner decision:** 2026-11-13. Use a practical three- or four-source benchmark and the simple arithmetic mean of comparable published central prices. Do not wait for exact route-level samples, but do not manufacture comparability either.

## 1. Interstate full-service source set

| Source | Published figure used | Evidence | Limitation |
|---|---:|---|---|
| [Consumer Moving Reviews (CMR)](https://www.consumermovingreviews.com/cheapest-long-distance-moving-companies/) | $3,400 | Median for about 2 bedrooms, 1,000–1,499 miles. The page says 2,046 moves were booked through its network overall; the size/distance table is based on 1,136 moves, and the individual cell count is not shown. | Network-booked prices; not a national census. CMR discloses related-company relationships, so check affiliations before combining it with carrier-owned datasets. |
| [Long Distance Moving](https://longdistancemoving.com/national-moving/moving-cost-report-2026) | $6,630 | Median booked estimate for 4,000–9,000 lb (approximately 2–3 bedrooms) and 600–1,700 driving miles; 155 moves in the weight band overall. | One national network; booked estimate, not final invoice; its distance × size cell count is not shown. |
| [moveBuddha](https://www.movebuddha.com/blog/cost-move-out-state/) | $3,200 | Midpoint of its published $1,900–$4,500 full-service range for 2–3 bedrooms at 1,000 miles. | Rough estimated range based on quotes and Better Moves Project participants; midpoint is a proxy, not a published average or median. |

**Simple mean of the three central values:** ($3,400 + $6,630 + $3,200) / 3 = **$4,410**.

**Observed source spread:** **$3,200–$6,630**. This is the spread between the selected source central values, not a confidence interval or a guaranteed customer-price range.

This is a **provisional cross-source planning average** for a broad 2–3 bedroom / roughly 1,000–1,700-mile interstate full-service scenario. The source bands overlap but are not identical, and the source statistics differ (median, median, range midpoint). It is useful for detecting a potential model gap; it is not yet suitable as a precise route-level output.

## 2. Source audit: what is not counted in this mean

- [A Plus Moving & Storage](https://aplusmovingandstorage.co/resources/moving-cost-index/) publishes 20th–80th percentile ranges from 669 completed paid interstate moves, including $4,200–$5,500 for a 2-bedroom / 1,000–1,500-mile cell (midpoint $4,850). This is valuable as a cross-check, but CMR identifies A Plus as a related company to CMR's owner. Do not count both as independent sources in the same mean until the dataset overlap and governance relationship are clarified.
- [This Old House](https://www.thisoldhouse.com/moving/moving-costs) publishes a 2025 survey table with a $2,668 2-bedroom average at 1,101–1,400 miles, but that table does not establish that every observation is full-service. Its separate 2026 survey reports $6,164 average for full-service at 1,101–1,400 miles but does not break that figure down by bedroom. Keep these as context, not a matched full-service cell.
- [Haulest](https://haulest.com/calculators/cost?market=us) reports a $4,100 interstate median for 2-bedroom reviewer-submitted prices (1,181 reviews), but its public summary does not split by distance. Use as a national sanity check, not a distance-matched input.
- [HireAHelper](https://www.hireahelper.com/advice/cost-methodology/) is not a primary input for interstate full-service in the reviewed methodology; its data is useful for local full-service and moving labor, which must be a separate model.
- Do not count two sites as independent simply because their branding differs. Record shared ownership, network overlap, survey reuse, and source provenance before computing a mean.

## 3. First comparison with our current calculator

The current formula in src/lib/calculator.js uses a U-Haul distance-band average as a DIY floor, then adds a fixed per-mile service premium for full-service. Its service premium is an MVP assumption, not a market-derived full-service price.

For a **1,250-mile, full-service, size multiplier 1.8** test case (the current UI calls this “4–5 rooms”; it is only a rough proxy, not a verified 2-bedroom mapping):
- Current model move cost: **$2,917**
- Current total including its 10% contingency: **$3,209**
- Current displayed planning band: **$2,567–$3,850**
- Provisional three-source central-price mean: **$4,410**
- Current point estimate is about **27.2% below** that cross-source mean; the current upper planning bound is about **12.7% below** it.

This is a meaningful warning signal, not proof that the calculator underprices every 2-bedroom move. The size input is not equivalent, the source bands/statistics differ, and the current 80%–120% band is not statistically calibrated. **Do not change the formula from this one comparison.**

## 4. The product issue discovered: size input does not match the market

The calculator currently asks for room-count groups (“Studio / 1 room”, “2–3 rooms”, “4–5 rooms”, “6+ rooms”). The sources and moving carriers generally use bedrooms, shipment weight, or cubic volume. These are not interchangeable.

Create B16 to resolve this before production calibration:
- Replace ambiguous room-count labels with bedroom-based categories (studio, 1, 2, 3, 4+ bedrooms), or test a more informative but still easy input.
- Add a lightweight inventory-density refinement (for example, lightly furnished / typical / heavily furnished) only if a credible weight/volume crosswalk can be sourced and validated.
- Explain that bedroom count is a proxy and that actual inventory/weight changes price.
- Keep the form short; do not force visitors to estimate pounds or cubic feet unless research shows that users can do so reliably.
- Add tests for every mapping and compare it against source weight/volume bands before changing production coefficients.

## 5. Owner-approved mean rule

For each scenario cell:
1. Collect 3–4 eligible source central values for the same service type and broadly overlapping distance and shipment-size bands.
2. Use the source's reported average or median. If only a range is available, use its midpoint and label it as a midpoint proxy.
3. Compute the simple arithmetic mean: sum of eligible central values divided by source count.
4. Display the individual source values and their low–high spread. Never call that spread a confidence interval.
5. If fewer than three sources qualify, label the cell provisional and do not silently fill missing values.
6. Keep raw observations, source dates, URLs, sample counts, statistic type, inclusions/exclusions, and affiliation/overlap notes.
7. Do not average full-service, containers, rental trucks, and labor-only together.

## 6. Implementation sequence and completion gates

- [ ] Build a dated raw source matrix for representative cells, beginning with interstate full-service.
- [ ] Verify source overlap and whether quoted/paid values include packing, fuel, valuation, accessorials and taxes.
- [ ] Resolve B16's bedroom/weight/volume input crosswalk.
- [ ] Compare the benchmark against calculator outputs only for equivalent scenarios.
- [ ] Review adjacent size/distance cells and holdout cases; quantify error before proposing a formula change.
- [ ] Implement the smallest justified calibration with regression tests and a reviewed PR.
- [ ] Update the methodology/results UI with source links, dates, scope, estimate type, and limits.
- [ ] Verify the deployed result and disclosure.

**No production price, coefficient, formula, or UI is changed by this plan.** B15 remains active until the source matrix, B16 mapping, and validation gates are complete.