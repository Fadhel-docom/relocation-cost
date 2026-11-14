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

## 8. 2026-11-14 second-pass audit: cell counts, source scope, and sensitivity check

### Evidence added after the first refresh

| Source | Relevant published cell(s) | What is actually disclosed | Decision |
|---|---|---|---|
| [This Old House 2025 moving-cost survey](https://www.thisoldhouse.com/moving/moving-costs) | 1,101–1,400 miles: 1BR $2,485; 2BR $2,668; 3BR $3,913; 4BR $6,207 (averages). | The article says the figures come from a 2025 survey of 1,000 moving customers; the 2026 survey page says the 2025 research focused on full-service movers. Per-cell sample counts and full inclusion details are not published in the surfaced table. | Add as a fourth directional cross-check, not as proof of a well-powered cell. It is the closest distance band to 1,250 miles and separates 2BR from 3BR. Keep its 2025 timing and unknown cell n visible. |
| [CMR main 2026 cost table](https://www.consumermovingreviews.com/cheapest-long-distance-moving-companies/) and its [route-level sample disclosures](https://www.consumermovingreviews.com/routes/movers-from-adrian-mi-49221-to-fort-myers-fl-33900/) | 1,000–1,499 miles: studio/1BR $2,120 (middle half $1,890–$2,420; n=144); about 2BR $3,400 ($2,720–$3,990; n=121); about 3BR $5,390 ($4,620–$6,090; n=39); 4+BR $9,000 ($7,620–$11,020; n=47). | The route pages explicitly expose the booking count for each size × distance cell. These four counts sum to 351 in this distance band. Across all distances, the 1,136-move cohort is split into 419 / 404 / 164 / 149 by size. | CMR cell n is now known for the benchmark distance band; no longer mark these four cells as unknown. The 3BR cell (n=39) is materially smaller than the 1BR/2BR cells. CMR is owned by Preferred Movers Network Inc.; A Plus Moving & Storage and Jacob and Sons are related companies sharing an office address, and Wilson Bros lists the same address. Do not treat CMR and A Plus as independent without dataset-overlap evidence. |
| [CMR small-move report](https://www.consumermovingreviews.com/best-movers-for-small-long-distance-moves/) | For 1,000–1,499 miles: studio/1BR median $2,170 and about 2BR median $3,990. | The report identifies 419 studio/1BR moves under 400 cu ft across all distances. Its separate “Moves” column shows 1,983 for the 1,000–1,499-mile row while also displaying an about-2BR median; that row count therefore must not be interpreted as the studio/1BR cohort count. Exact size × distance counts are instead disclosed on CMR route pages (144 / 121 / 39 / 47 for the four size groups in this band). | This is a second CMR publication using related CMR data, not an independent provider. The different studio/1BR and 2BR medians ($2,170 vs $2,120; $3,990 vs $3,400) reflect different published cohorts/definitions and should not be averaged. Treat the 1,983 field as a distance-row count whose precise scope is not defined in the extract; use the route-page size-cell counts for the benchmark. |
| [Long Distance Moving 2026 report](https://longdistancemoving.com/national-moving/moving-cost-report-2026) | 600–1,700 miles: under 4,000 lb $3,420; 4,000–9,000 lb $6,630; over 9,000 lb $16,790 (medians). | 543 booked moves overall; weight-group totals are 284 / 155 / 104 across all distances. Exact 600–1,700-mile cross-cells are not given in the extracted table. The over-9,000-lb distance columns contain only 19–61 moves each. | Use the distance row, not overall weight medians. Do not mistake the overall 284/155/104 counts for the 600–1,700-mile cell counts. Mark 4+BR/over-9,000-lb estimate low precision. Booked estimates, not final invoices. |
| [moveBuddha 2026 guide](https://www.movebuddha.com/blog/cost-move-out-state/) and [pricing methodology](https://www.movebuddha.com/blog/moving-pricing-methodology/) | 1,000-mile full-service ranges: 1BR $1,100–$2,700; 2–3BR $1,900–$4,500; 4–5BR $4,100–$7,800. | Guide says rough estimates from quotes and Better Moves participants; the midpoint is not a published mean/median. Methodology describes mixed monthly inputs (feeds/APIs, Better Moves, live quotes, user submissions, anonymized calculator transactions) and 1,000+ new cost points/month, but not cell-level n or the composition of this specific guide table. | Keep the midpoint as a proxy only. Do not assume it is independent of every other online quote-based source. |

### Sensitivity check (not a replacement benchmark)

Adding the This Old House 2025 distance/home-size averages to the existing three-source central values produces illustrative four-source arithmetic means:

| Approximate size | Existing three-source mean | Added This Old House cell | Four-source illustrative mean |
|---|---:|---:|---:|
| Studio / 1BR | $2,480 | $2,485 | $2,481 |
| 2BR | $4,410 (the prior combined 2–3BR cell) | $2,668 | $3,975* |
| 3BR | $4,410 (the prior combined 2–3BR cell) | $3,913 | $4,783* |
| 4+BR | $10,580 | $6,207 (4BR) | $9,487 |

*For 2BR and 3BR, the displayed four-source figures are **not** four-source exact-size means: the existing three-source anchor is still a combined 2–3BR cell. These numbers are a sensitivity illustration only and must not be used as exact bedroom-level targets. The 4+BR comparison also pairs a 4BR survey cell with a 4+BR category, so it is not exact. The 1BR result is the only row whose size labels are broadly aligned, though distance bands and statistics still differ.

### B15 quality decision

1. The previous 1,250-mile three-source means remain **provisional warning signals**, not validated market means or production targets.
2. CMR now discloses exact cell counts for the 1,000–1,499-mile band (144 / 121 / 39 / 47 by size). The overall source matrix is still not statistically validated: Long Distance Moving does not expose exact counts for every distance × weight cell (its largest-size distance cells are only 19–61); This Old House and moveBuddha do not expose matched cell n for the cited tables.
3. Do not count multiple CMR pages as independent sources. CMR explicitly identifies Preferred Movers Network Inc. as its owner and A Plus Moving & Storage and Jacob and Sons as related companies sharing an office address; Wilson Bros lists the same address. This strengthens the case against counting CMR and A Plus as independent without dataset-overlap evidence. Do not infer source independence merely from different domains; record shared ownership, survey reuse, quote feeds, and partner/network overlap where verifiable.
4. Do not replace the owner-approved arithmetic-mean rule. Instead, show a **comparability grade** next to each source cell: distance fit, size/weight fit, service fit, statistic type, data vintage, cell n, and provenance known/unknown. If a critical field is unknown, keep the cell provisional and state why.
5. CMR's route-level pages resolve the most important 1,000–1,499-mile cell counts; the CSV remains useful for full raw-matrix verification and historical consistency, but is no longer a blocker for those four counts. The next evidence action is to request exact cross-tab cell counts and definitions from Long Distance Moving and This Old House, and to validate the CSV/data dictionary against CMR's route pages. Do not publish invented counts or reverse-engineer them from aggregate totals.
6. Until those checks and B16 mapping are complete, do not change HOME_SIZES, MOVE_PER_MILE, the service premium, or any production estimate.

### Additional product-quality improvement

When the benchmark is eventually surfaced to visitors, show the source range and the date checked beside the point estimate, and explain that a source spread is not a confidence interval. For weak or mismatched cells, use a broader planning range or withhold a point estimate rather than displaying false precision. This is a B15 release criterion, not a separate feature request.


## 9. 2026-11-14 CMR cell-count resolution (follow-up)

A targeted search of CMR route-level pages found explicit booking counts for each home-size cell in the 1,000–1,499-mile band. The published route page for a 1,255-mile lane shows the same four benchmark cells and counts:

| CMR size category | 25th–75th percentile | Median | Bookings in 1,000–1,499 mi cell |
|---|---:|---:|---:|
| Studio / 1BR (under 400 cu ft) | $1,890–$2,420 | $2,120 | 144 |
| About 2BR (400–800 cu ft) | $2,720–$3,990 | $3,400 | 121 |
| About 3BR (800–1,200 cu ft) | $4,620–$6,090 | $5,390 | 39 |
| 4+BR (1,200+ cu ft) | $7,620–$11,020 | $9,000 | 47 |

The four cells total 351 bookings for this distance band. CMR's overall 1,136-booking cohort is also broken down by size across all distances: 419 / 404 / 164 / 149. This is meaningful new evidence: CMR's exact cell n is no longer unknown for the target band. The 3BR cell has the smallest count (39), so its median and range deserve more caution than the larger 1BR/2BR cells.

The small-move article's “Moves” value of 1,983 for the 1,000–1,499-mile row is not the count of studio/1BR moves: the same row also reports an about-2BR median, while the report separately says the small-move cohort totals 419 across all distances. Its precise scope is not defined in the extracted table; do not use 1,983 as a size-cell n. Use CMR's route-page cell counts above. The different $2,170 and $3,990 medians on the small-move article are a different cohort/definition and must not be averaged with the main report.

This resolves one B15 evidence gap, but not the entire benchmark. Long Distance Moving still lacks exact n for all distance × weight cells, and This Old House / moveBuddha do not provide matched cell n for the cited comparisons. CMR remains one network dataset, not a national census. Do not change production estimates until the independent-source comparability and holdout gates pass.


### Additional 2026 full-service distance-only check

This Old House's 2026 survey page reports an average of $6,164 for respondents who used full-service movers and moved 1,101–1,400 miles. The survey covered 1,000 recent movers overall, but the number in this distance × service subgroup is not disclosed in the public extract, and the figure is not split by bedroom/weight. Use it as a distance-level directional cross-check only, not as another size-specific central value. This is useful because it is based on the 2026 survey rather than the 2025 size table, but it cannot fill the missing 2BR/3BR/4+BR source cells.
