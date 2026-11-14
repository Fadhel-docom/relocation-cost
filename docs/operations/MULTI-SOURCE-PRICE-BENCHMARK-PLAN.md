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

## 3. First comparison across three shipment-size groups

The current formula in src/lib/calculator.js uses a U-Haul distance-band average as a DIY floor, then adds a fixed per-mile service premium for full-service. Its service premium is an MVP assumption, not a market-derived full-service price.

For a common 1,250-mile test distance, the three sources provide these central values:

| Shipment group | CMR median | Long Distance Moving median | moveBuddha range midpoint | Three-source mean | Source central-value spread |
|---|---:|---:|---:|---:|---:|
| Studio / 1 bedroom | $2,120 | $3,420 | $1,900 | **$2,480** | $1,900–$3,420 |
| About 2–3 bedrooms | $3,400 | $6,630 | $3,200 | **$4,410** | $3,200–$6,630 |
| 4+ bedrooms | $9,000 | $16,790 | $5,950 | **$10,580** | $5,950–$16,790 |

Source matching details:
- CMR uses its 1,000–1,499-mile band and reports medians by bedroom category.
- Long Distance Moving uses its 600–1,700-mile band and reports medians by shipment-weight category: under 4,000 lb; 4,000–9,000 lb; over 9,000 lb.
- moveBuddha uses its 1,000-mile full-service range for 1BR, 2–3BR and 4–5BR; the midpoint is only a central-price proxy.
- These are overlapping planning bands, not identical route/size cells. The averages are provisional comparison anchors, not national market means.

The current model outputs at 1,250 miles are. Compare the **move component** with source moving prices; do not compare the all-in total or its contingency band with a mover's price:

| Current UI size proxy | Move component (comparable to mover price) | Total incl. 10% contingency | Current 80%–120% total band | Source central-price mean | Move component vs mean |
|---|---:|---:|---:|---:|---:|
| 1.0 (“Studio / 1 room”) | $2,357 | $2,593 | $2,074–$3,111 | $2,480 | **5.0% below** |
| 1.8 (“4–5 rooms”) | $2,917 | $3,209 | $2,567–$3,850 | $4,410 | **33.9% below** |
| 2.4 (“6+ rooms”) | $3,337 | $3,671 | $2,937–$4,405 | $10,580 | **68.5% below** |

**Accounting correction:** The provider benchmarks describe the mover's price, so the fair comparison is against the calculator's move component ($2,357 / $2,917 / $3,337), not the total after the 10% contingency ($2,593 / $3,209 / $3,671). The 80%–120% band also applies to the all-in total and is not directly comparable to provider prices.

**Interpretation:** On this provisional comparison, the move component is about 5.0% below the 1BR mean, 33.9% below the 2–3BR mean, and 68.5% below the 4+BR mean. The gap widens sharply for larger shipment groups. This is a strong warning that the current size multipliers may not represent the market's bedroom/weight pricing curve. It is not proof of the exact underpricing percentage because room-count options do not map reliably to bedroom/weight groups and the three source datasets use different bands/statistics. **Do not change the formula until B16 aligns the size input and the source matrix is validated.**
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
## 7. 2026-11-14 source refresh and B16 product specification

### Fresh source checks (accessed 2026-11-14)

| Source | Current public evidence relevant to the 1,250-mile comparison | Use and limitation |
|---|---|---|
| [Consumer Moving Reviews (CMR)](https://www.consumermovingreviews.com/cheapest-long-distance-moving-companies/) | Its 1,000–1,499-mile row currently shows medians of $2,120 (studio/1BR), $3,400 (about 2BR), $5,390 (about 3BR), and $9,000 (4+BR). | Useful adjacent size cells. The page notes that some bands have fewer than 30 moves; cell-level counts must be checked before treating any row as equally reliable. Network-booked prices, not a national census. |
| [Long Distance Moving 2026 report](https://longdistancemoving.com/national-moving/moving-cost-report-2026) | The report now states 543 booked interstate moves (June–November 2026). Overall shipment medians: $3,420 for under 4,000 lb (284 moves), $6,890 for 4,000–9,000 lb (155), and $16,070 for over 9,000 lb (104). Its distance × weight table gives $3,420 / $6,630 / $16,790 in the 600–1,700-mile band. | Use the distance × weight table for the 1,250-mile scenario, not the overall median. This resolves the apparent $6,630 vs $6,890 discrepancy: different aggregations. Report says bedroom labels are approximate and weight determines price. One network; booked estimates, not final invoices. |
| [moveBuddha out-of-state cost guide](https://www.movebuddha.com/blog/cost-move-out-state/) | Current 1,000-mile full-service ranges: 1BR $1,100–$2,700; 2–3BR $1,900–$4,500; 4–5BR $4,100–$7,800. | Midpoints ($1,900 / $3,200 / $5,950) are proxies, not published means/medians. Rough estimates based on quotes and Better Moves Project participants; not a 1,250-mile cell. |
| [Haulest public index](https://haulest.com/calculators/cost?market=us) | Updated 2026-11-03: self-reported interstate medians $3,456 (studio, n=59), $2,906 (1BR, n=286), $4,100 (2BR, n=1,181), $5,483 (3BR, n=658), and $6,655 (4BR, n=287). | Strong size-granularity cross-check, but no distance segmentation in this table and user-submitted reviews are selection-biased. Do not add to distance-matched mean. |

### B15 interpretation update

- The 2026 Long Distance Moving report exposes both overall shipment medians and distance-band medians. Do not mix them: the 1,250-mile comparison must use its 600–1,700-mile row ($3,420 / $6,630 / $16,790), while the overall 543-move medians are $3,420 / $6,890 / $16,070.
- CMR now exposes an additional 3-bedroom median ($5,390) in the same 1,000–1,499-mile band. This improves the size ladder: studio/1BR $2,120; about 2BR $3,400; about 3BR $5,390; 4+BR $9,000. Verify the cell-count footnote/CSV before assigning equal confidence to each cell.
- Haulest's public size-specific interstate counts provide a useful independent national, non-distance-matched check. Keep it outside the B15 arithmetic mean; do not silently treat it as a 1,250-mile observation.
- Existing B15 three-source means remain provisional and should not be promoted to production truth. The sources still differ in statistics, bands, service inclusions, and sample provenance.

### B16 minimum viable product specification (documentation only; no production change)

1. Replace ambiguous room-count language with household bedroom categories aligned to public source conventions: **Studio / 1 bedroom**, **2 bedrooms**, **3 bedrooms**, **4+ bedrooms**. Keep “studio” visible because several datasets group it with 1BR.
2. Add a concise disclosure beside the control: “Bedroom count is a rough size guide. The amount of furniture, packed weight, and bulky items can change the price.”
3. Do not ask visitors to estimate pounds or cubic feet. CMR's small-move evidence uses an under-400-cu-ft segment, and Long Distance Moving says bedroom labels are approximate; neither establishes a reliable visitor-facing conversion from bedrooms to weight/volume.
4. Do not add “light / typical / heavily furnished” yet. No validated crosswalk currently maps those subjective choices to shipment weight or to the existing HOME_SIZES coefficients.
5. Separate the semantic bedroom selection from any numeric pricing multiplier. Do not silently map new bedroom labels onto the current room multipliers (1, 1.35, 1.8, 2.4). Build an explicit mapping only after the B15 source matrix and holdout tests establish defensible size-group calibration.
6. Before implementation: add tests for URL/share-state compatibility, default selection, all four categories, and the exact mapping contract. Preserve existing shared estimate links or provide a tested migration for old size values.
7. Before release: compare each category against at least three eligible sources where possible; disclose when a cell has fewer than three; verify desktop/mobile accessibility and production output. No formula change merely because labels change.

**Status:** research and product specification only. No source coefficient, calculator UI, formula, or live price changed.