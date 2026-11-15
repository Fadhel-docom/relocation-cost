# B15 unified price matrix and route holdout review — 2026-11-14

Repository: Fadhel-docom/relocation-cost  
Branch: `docs/b15-unified-matrix-holdout-20261114`  
Scope: research and operations documentation only. No production code, calculator input, formula, coefficient, or displayed price changed.

## Decision summary

A four-publisher candidate matrix can now be calculated for the four bedroom-size groups using the owner-approved unweighted arithmetic-mean rule. These are **planning benchmarks, not validated market prices or production coefficients**. The sources overlap in distance and broad shipment-size scope, but their central statistics differ (median, average, and range midpoint), and several distance-by-size cell counts remain undisclosed.

The matrix is sufficient to identify a persistent size-related gap and to proceed with B16 design work, but not sufficient to map bedroom labels to numeric production multipliers. Two route-level checks show that the current full-service move component is materially below moveBuddha's published route ranges for larger shipments. One of those checks is outside the calibration distance band. Because the route checks use the same publisher as one calibration input, they are a **publisher-level route holdout**, not an independent-source validation.

## 1. Unified candidate matrix

Target scenario: interstate full-service, approximately 1,000–1,500 road miles. The source bands are not identical: CMR 1,000–1,499 mi; This Old House (TOH) 1,101–1,400 mi; moveBuddha approximately 1,000 mi; Long Distance Moving (LDM) 600–1,700 mi.

| Size group | CMR median | LDM median | moveBuddha midpoint proxy | TOH average | Unweighted 4-source mean | Central-value spread |
|---|---:|---:|---:|---:|---:|---:|
| Studio / 1BR | $2,120 | $3,420 | $1,900 | $2,485 | **$2,481** | $1,900–$3,420 |
| 2BR | $3,400 | $6,630 | $3,200 | $2,668 | **$3,975** | $2,668–$6,630 |
| 3BR | $5,390 | $6,630* | $3,200* | $3,913 | **$4,783** | $3,200–$6,630 |
| 4+BR | $9,000 | $16,790† | $5,950 | $6,207‡ | **$9,487** | $5,950–$16,790 |

* LDM reports one combined 2–3 bedroom weight group; moveBuddha also publishes a combined 2–3 bedroom range. Their same central values are therefore repeated as broad proxies in the 2BR and 3BR rows, not independent exact-bedroom observations.  
† LDM's over-9,000-lb group is a shipment-weight proxy for 4+ bedrooms. Its 600–1,700-mile distance column has only 19–61 observations; the exact 4+ cell count is not separately exposed.  
‡ TOH publishes a 4-bedroom value, not a 4+ bedroom value. It is a near-match proxy, not an exact 4+ group.

### Cell sample counts and provenance

| Source | Published sample disclosure | What is known for the target cell |
|---|---|---|
| CMR | 1,000–1,499 mi: Studio/1BR n=144; 2BR n=121; 3BR n=39; 4+BR n=47. | Exact size × distance counts are exposed on CMR route-level disclosures. These are booked network moves, not a national census. |
| LDM | 543 booked interstate moves overall; size/weight group totals 284 / 155 / 104 across all distances. | Exact 600–1,700 mi × weight-group cell counts are not disclosed. The >9,000-lb distance column contains 19–61 moves. Booked estimates, not final invoices. |
| moveBuddha | 1,000-mile size ranges; the guide does not disclose a sample count for each size × distance cell. | Midpoints are proxies, not published means or medians. Underlying quote/data overlap with other publishers is not established. |
| TOH | 2025 survey of 1,000 movers, focused on full-service movers. | Per-distance × bedroom cell counts are not disclosed. Published values are averages; exact service inclusions and cell composition are limited. |

### Arithmetic

The project rule calls for a simple, unweighted arithmetic mean of the eligible source central values. The calculations above use four candidate source values per size group; range midpoints are explicitly marked as proxies. No weighting by sample size is applied because cell-level sample sizes are unavailable for several sources.

The source spread is the range of the selected source central values. It is **not** a confidence interval, prediction interval, or promise of what an individual mover will charge.

## 2. Holdout route checks against the current calculator

The calibration matrix above does not contain these two route-page observations. They were checked separately against the current full-service move component from `src/lib/calculator.js`, excluding the calculator's other costs and 10% contingency.

| Route / distance | Current model proxy | Current move component | moveBuddha route range | Range midpoint | Model vs midpoint |
|---|---|---:|---:|---:|---:|
| Boston, MA → Miami, FL / 1,501 mi | Studio / 1BR (size 1.0) | $3,031 | $2,127–$4,772 | $3,450 | −12.1% |
| Boston, MA → Miami, FL / 1,501 mi | 2–3BR proxy (size 1.8) | $3,703 | $2,754–$6,840 | $4,797 | −22.8% |
| Boston, MA → Miami, FL / 1,501 mi | 4+BR proxy (size 2.4) | $4,207 | $5,343–$8,726 | $7,035 | −40.2% |
| Nashville, TN → Burlington, VT / 1,089 mi | Studio / 1BR (size 1.0) | $2,267 | $2,123–$4,773 | $3,448 | −34.3% |
| Nashville, TN → Burlington, VT / 1,089 mi | 2–3BR proxy (size 1.8) | $2,755 | $2,658–$6,736 | $4,697 | −41.4% |
| Nashville, TN → Burlington, VT / 1,089 mi | 4+BR proxy (size 2.4) | $3,121 | $4,443–$8,900 | $6,672 | −53.2% |

Method: for the current model, full-service type multiplier is 1.65; the existing size multipliers used here are 1.0, 1.8 and 2.4, matching only approximate legacy UI labels, not verified bedroom equivalence. The move component is calculated with the current U-Haul distance-band floor and current per-mile model. Values are rounded to the nearest dollar.

Route source disclosures:
- Boston–Miami: 1,501 miles; route ranges by home size; moveBuddha says its pricing reflects its monthly dataset of 1,500+ live quotes; updated 2026-11-12.
- Nashville–Burlington: 1,089 miles; route ranges by home size; same stated monthly dataset; updated 2026-10-06.

### Interpretation and limitations

1. The current calculator's move component sits below the published route-range midpoint in all six comparisons, with the largest relative gaps in larger shipment groups.
2. The 1,501-mile Boston–Miami route is outside the 1,000–1,499-mile calibration band and is useful as a distance holdout. Nashville–Burlington is a within-band route check.
3. These are range-midpoint comparisons, not comparisons with paid invoices or exact route-specific medians. The pages do not expose cell-level quote counts.
4. Both checks use moveBuddha, which also supplies one calibration proxy. The publisher-level dataset may overlap; independence is not established. Do not describe this as independent validation.
5. Legacy room-count multipliers do not map reliably to bedroom groups. These comparisons diagnose a likely size-input/model gap; they do not authorize coefficient changes.

## 3. B15 / B16 decision

- **B15 remains active.** The unified matrix and means are now documented, and two route holdout checks have been run. The remaining gate is stronger validation: obtain cell counts or better-disclosed independent full-service sources for the size groups, especially 2BR / 3BR / 4+BR; add route-level holdouts from a second publisher or actual non-overlapping booked/paid observations; confirm source ownership/provenance overlap.
- **B16 can move into implementation planning, but not production multiplier mapping.** The bedroom-based semantic choices remain Studio / 1BR, 2BR, 3BR, 4+BR. Do not silently map them to legacy multipliers 1 / 1.35 / 1.8 / 2.4. Preserve old shared-link values until a tested migration contract is defined.
- **No coefficient, formula, or production price change is approved by this review.** Do not tune the model to the route midpoints; they are only a diagnostic cross-check.
- **Next work:** find additional independently disclosed full-service route/cell data; validate cell counts and overlap; then build a testable B16 input migration and run regression tests before any pricing recalibration.

## 4. Sources

- CMR 2026 price table and size/distance counts: https://www.consumermovingreviews.com/cheapest-long-distance-moving-companies/
- CMR route-level sample disclosure: https://www.consumermovingreviews.com/routes/movers-from-adrian-mi-49221-to-fort-myers-fl-33900/
- Long Distance Moving 2026 report: https://longdistancemoving.com/national-moving/moving-cost-report-2026
- moveBuddha out-of-state cost guide: https://www.movebuddha.com/blog/cost-move-out-state/
- This Old House 2025 moving-cost table: https://www.thisoldhouse.com/moving/moving-costs
- Boston → Miami route page: https://www.movebuddha.com/popular-routes/ma/fl/boston-to-miami/
- Nashville → Burlington route page: https://www.movebuddha.com/popular-routes/tn/vt/nashville-to-burlington/


## 5. Second-publisher and ownership audit — 2026-11-14

A targeted search for independent route-level evidence found several candidates, but none currently clears the full B15 calibration/validation gate.

| Candidate | Evidence found | Independence / comparability decision |
|---|---|---|
| GoodMigrations | Boston→Miami and Nashville→Burlington route ranges, each described as based on 1,500+ monthly live quotes. | **Not independent of moveBuddha.** moveBuddha announced its acquisition of GoodMigrations in May 2023. Treat the two brands as one ownership group unless separate underlying data lineage is demonstrated. Do not count GoodMigrations as the second publisher. |
| Extra Space Storage | Boston→Miami estimates by bedroom: 3BR $5,316–$9,193; 4BR $5,816–$10,193. The page says its estimates are calculated using its own moving-cost calculator and is dated Dec 11, 2025. | Useful exact-route directional cross-check candidate. No route-cell sample count or transparent estimate-generation details were disclosed in the inspected page; not eligible for arithmetic calibration or a validated holdout yet. |
| MoveAdvisor | Boston→Miami ranges: Studio/1BR $2,162–$3,314; 2–3BR $4,169–$6,948; 4+BR $5,764–$9,469. The page says it calculated historical averages from moving reviews on the route. It lists 107 movers serving the route. | Independent-looking route review source, but 107 is the number of mover listings, not the number of price observations. No price-cell n, observation dates, or service inclusion details. Candidate-only; do not infer sample size from listings. |
| Move.org | Its 2025 State of Moving survey reports 2,500 completed responses; its 2024 quote-derived page gives 3BR distance-band medians and says hundreds of quotes were gathered. | Independent broad external check, but the 2,500-person survey includes mixed move methods and the distance/size cells do not expose n. The quote-derived 2024 3BR series is potentially useful as a distance-band check, not an exact route holdout or an eligible size matrix input without further source clarification. |
| MyFastMovers | Publishes 27,854 model-priced city routes and 224 measured corridors. | Explicitly a published model estimate, not observed customer prices. Useful competitor/UX benchmark, not an independent price observation. |

### Consequence for B15

- The independent second-publisher route holdout remains **not yet satisfied**.
- Do not treat moveBuddha + GoodMigrations as two independent sources.
- Do not treat the number of listed movers, survey-wide n, or an overall quote count as a size × route cell count.
- The strongest next request is a transparent cell-level disclosure from Extra Space Storage or MoveAdvisor (sample size, date window, what the estimate includes, and whether values are quote-derived or model-generated), or a separate publisher's actual booked/paid route observations.
- Existing four-source means remain provisional planning benchmarks only. No formula or coefficient changes are authorized.

### Source record

- moveBuddha acquisition announcement (May 5, 2023): https://www.accessnewswire.com/newsroom/en/business-and-professional-services/movebuddha-acquires-los-angeles-based-goodmigrations-753067
- GoodMigrations Boston→Miami route/methodology: https://goodmigrations.com/popular-routes/massachusetts/florida/boston-ma-to-miami-fl/
- Extra Space Storage Boston cost guide (updated Dec 11, 2025): https://www.extraspace.com/moving/tools/moving-cost-calculator/movers-boston-ma/
- MoveAdvisor Boston→Miami route and historical-review method: https://moveadvisor.com/usa/routes/boston-to-miami-movers
- Move.org 2025 State of Moving survey: https://www.move.org/the-state-of-moving/
- Move.org 2024 quote-derived distance medians: https://www.move.org/moving-costs/
- MyFastMovers modelled route network: https://www.myfastmovers.com/popular-routes/
