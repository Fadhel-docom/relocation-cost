# Multi-source price benchmark and calibration plan

**Owner decision:** 2026-11-13. Replace the stalled exact-route sample requirement with a practical benchmark built from 3–4 credible public sources. The goal is to put real, sourced market prices behind the calculator without presenting incomparable prices as identical.

## 1. Selected source set for interstate full-service

| Source | Public evidence reviewed | How it enters the benchmark | Limitations |
|---|---|---|---|
| [This Old House — Moving Costs](https://www.thisoldhouse.com/moving/moving-costs) | Updated 2026-06-12; 2025 survey of 1,000 moving customers; publishes average costs by distance and bedroom/weight bands | Source central price (reported average) when service and cell align | Cell sample sizes are not published; its weight bands (1BR 2,000–4,000 lb; 2BR 4,000–7,000 lb; 3BR 7,000–10,000 lb; 4BR 10,000+ lb) are not equivalent to our current room-count input. |
| [Long Distance Moving — 2026 report](https://longdistancemoving.com/national-moving/moving-cost-report-2026) | 543 booked interstate full-service moves, June 1–Nov 5 2026; published median by shipment weight and driving-distance band | Source central price (reported median) for matching interstate cells | One national network; booked estimate, not final invoice; winter moves underrepresented. |
| [Consumer Moving Reviews — 2026 Cost Report](https://www.consumermovingreviews.com/cheapest-long-distance-moving-companies/) | Research team reports 2,046 booked long-distance moves; cost tables show 25th-percentile/median by distance and home size | Source central price (reported median) for matching cells | Network-booked moves; verify cell sample count and exact scope; check possible dataset overlap with other network reports before treating as independent. |
| [A Plus Moving & Storage — Moving Cost Index](https://aplusmovingandstorage.co/resources/moving-cost-index/) | 669 completed paid interstate jobs; 20th–80th percentile ranges by distance and home size | Range cross-check; if a source midpoint is used as a central price, label it explicitly as a range midpoint | Single-carrier dataset; cell-level counts not shown; great-circle distance bands rather than driving miles. |

**Secondary cross-checks, not automatic mean inputs:** Haulest publishes reviewer-reported interstate medians by home size but not a matched distance × size cell in the summary; moveBuddha publishes selected quotes and claims a large monthly dataset, but public quote rows must contain the required route/size/scope details; HireAHelper's cited cost methodology covers local full-service (under about 50 miles) and labor-only, so it is not a valid interstate full-service source. HireAHelper can be considered later for a separate local/labor model.

Do not count two publications that reuse the same underlying network or survey as independent sources. The source audit must record known or suspected overlap.

## 2. Standard comparison grid

Start with **interstate full-service only**. Use the distance bands and shipment-size definitions each source actually publishes, then create common scenario cells only where the bands overlap sufficiently. Prioritize 1BR / 2BR / 3BR and 4+BR shipment groups, and record weight where available. Do not pretend that a room-count multiplier equals a bedroom or weight band.

Each captured observation records source, exact URL, publication/capture date, statistic type, total sample and cell sample if available, route/distance band, shipment size/weight definition, service type, inclusions/exclusions, price, currency, and limitations.

## 3. Average calculation — owner-approved simple mean

For each scenario:
1. Collect 3–4 central price figures from the selected sources. All must describe interstate full-service moving and broadly comparable distance and shipment-size scenarios.
2. Use each source's published central figure: its average, median, or (only where no central figure exists) the midpoint of its published typical range. Record which statistic each source supplied; never disguise a midpoint as an average or median.
3. Calculate the simple arithmetic mean of the eligible source central figures: sum divided by the number of sources. Label the result **cross-source planning average**, not a national market mean or a quote.
4. Show the source values and the observed low–high spread beside the average. This spread is not a confidence interval.
5. If only two sources are eligible, keep the cell provisional and do not change the production formula until a third eligible source is found. Do not fill missing cells by guessing.
6. Investigate material outliers and source overlap. Do not silently remove a source simply because its price is inconvenient.

## 4. From benchmark to calculator

- Build a raw source matrix and central-price table for representative distance/size scenarios.
- Compare each cross-source planning average with the current calculator output under equivalent assumptions.
- Identify whether any gap is systematic by distance or shipment size; do not apply one blanket multiplier if the pattern differs by band.
- Validate the proposed adjustment on held-out cells/routes not used to derive it.
- Implement the smallest justified adjustment with regression tests, build evidence and a reviewed PR.
- Display estimate type, sources, dates, service scope, inclusions/exclusions and observed spread in the methodology/results UI.

## 5. Separate service models

Never average full-service, containers, rental trucks and labor-only together. Complete the interstate full-service benchmark first. Local full-service and labor-only can use HireAHelper data in a separate later workstream.

## 6. Completion gates

- [ ] Three or four genuinely eligible source values for each calibrated scenario.
- [ ] Raw observations and central-price calculations committed.
- [ ] Distance, size and service comparability documented; overlapping datasets checked.
- [ ] Current calculator outputs compared with benchmark values.
- [ ] Holdout validation and error measurements documented.
- [ ] Code changes tested and reviewed; production estimate and disclosure verified.

## 7. Evidence snapshot (reviewed 2026-11-13)

- This Old House: 2025 survey of 1,000 movers; average table by distance and bedroom/weight band.
- Long Distance Moving: 543 booked interstate full-service moves; median by weight and distance; booked estimates rather than final invoices.
- Consumer Moving Reviews: research team reports 2,046 booked long-distance moves and publishes median/range tables by size and distance.
- A Plus: 669 completed paid interstate jobs; 20th–80th percentile ranges by distance and size.
- Haulest: useful secondary reviewer-reported check; its interstate median is not distance-segmented in the public summary.
- HireAHelper: not used for interstate full-service because the cited methodology is local full-service and labor-only; separate service models only.

**No production price or formula is changed by this plan.** The next B15 work unit is to extract the overlapping cells from the four selected sources, calculate the source-central-price mean, and compare it with current calculator outputs.

## 8. First pilot benchmark — 2-bedroom, approximately 1,000–1,500 miles

This is the first usable cross-source comparison found on 2026-11-13. The source bands overlap but are not identical, so treat it as a **provisional planning benchmark**, not a route-specific market price.

| Source | Published scenario | Central value used | Statistic / caveat |
|---|---|---:|---|
| [This Old House](https://www.thisoldhouse.com/moving/moving-costs) | 2 bedrooms, 1,101–1,400 miles | $2,668 | Published survey average; 2025 survey of 1,000 customers overall; cell N not disclosed. Its 2BR band is 4,000–7,000 lb. |
| [Consumer Moving Reviews](https://www.consumermovingreviews.com/cheapest-long-distance-moving-companies/) | About 2 bedrooms, 1,000–1,499 miles | $3,400 | Published median; CMR reports 2,046 booked long-distance moves overall; cell N not shown in this table. |
| [A Plus Moving & Storage](https://aplusmovingandstorage.co/resources/moving-cost-index/) | 2 bedrooms, 1,000–1,500 miles | $4,200–$5,500; midpoint $4,850 | 20th–80th percentile range from 669 completed paid jobs overall; cell N not disclosed. Midpoint is used only as a central-price proxy, not relabelled as an average. |

**Arithmetic mean:** ($2,668 + $3,400 + $4,850) / 3 = **$3,639** (rounded to nearest dollar).

**Observed source spread:** $2,668–$4,850. This is not a confidence interval.

**Interpretation:** This gives the calculator team a real initial reference point for a roughly 2-bedroom interstate full-service move in the 1,000–1,500-mile range. The source bands and statistical measures differ, and the independence of the underlying datasets has not yet been fully confirmed. Before changing production pricing, compare this benchmark to the calculator output for a genuinely equivalent inventory/service scenario, verify source overlap, and test adjacent distance/size cells. The current site size selector is room-based, so do not assume it is a 2-bedroom shipment until the mapping is verified.
