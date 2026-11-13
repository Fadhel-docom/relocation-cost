# Multi-source price benchmark and calibration plan

**Owner decision:** 2026-11-13. Replace the stalled exact-route sample requirement with a transparent 3–4-source benchmark. The goal is to put real, sourced market prices behind the calculator without pretending that unrelated prices are comparable.

## 1. Source shortlist

These are candidate sources, not four automatically interchangeable observations. A source is included in a calculation cell only when its published data matches the scenario and service scope.

| Candidate | Public evidence reviewed | Intended role | Limitation / admission rule |
|---|---|---|---|
| [This Old House — Moving Costs](https://www.thisoldhouse.com/moving/moving-costs) | Updated 2026-06-12; reports a 2025 survey of 1,000 moving customers and publishes average prices by distance and bedroom/weight band | Primary public average benchmark | Check service scope and cell sample availability. Its bedroom bands map to weight bands (1BR 2,000–4,000 lb; 2BR 4,000–7,000 lb; 3BR 7,000–10,000 lb; 4BR 10,000+ lb), not directly to our current room-count inputs. |
| [HireAHelper — Moving Statistics / methodology](https://www.hireahelper.com/moving-statistics/) | Describes actual customer-paid amounts across thousands of platform moves; truck/container cost research uses 10,000 transactions across 12 brands over six years | Candidate source for service-specific average benchmarks | Public summary may not expose a matched full-service distance × shipment-size cell. Use only when the actual published cell and included costs can be verified; otherwise context-only. |
| [moveBuddha — Pricing Methodology](https://www.movebuddha.com/blog/moving-pricing-methodology/) and [calculator](https://www.movebuddha.com/moving-cost-calculator/) | Methodology updated 2026-11-04; claims 10,000+ monthly pricing points across full-service, containers, truck rentals and labor; calculator publishes selected participant quotes | Candidate for same-input quote snapshots and market cross-checks | Public quote examples often omit shipment size/service detail. Do not use a quote unless route distance, shipment size, service type, date and inclusions are captured. Its methodology claims are self-reported. |
| [A Plus Moving & Storage — Moving Cost Index](https://aplusmovingandstorage.co/resources/moving-cost-index/) | 669 completed paid jobs; 20th–80th percentile ranges by distance band and home size; quarterly refresh | Independent range validation / fourth source | Single-carrier dataset, not a market-wide average. Preserve the published range; do not silently treat its midpoint as an arithmetic mean. |

**Source selection rule:** Prefer sources that disclose methodology, sample size, date, price statistic and scope. A source can be credible generally yet unusable for a particular cell. Do not force four values into a cell if only two are comparable.

## 2. Standard comparison grid

Start with **interstate full-service moving only**. Use representative distance bands that overlap the published source tables (initially 501–800, 801–1,100, 1,101–1,400, 1,401–1,700 and 1,701+ miles). Use weight-defined shipment bands where available. Do not equate the website's current room-count multipliers to bedroom/weight bands without a documented crosswalk.

Each captured observation must record:
- source name and exact URL;
- capture/publication date;
- statistic type: arithmetic average, median, quoted price, or percentile range;
- sample size and whether cell-level sample size is disclosed;
- origin/destination or distance band;
- shipment size and weight definition;
- service type and what is included/excluded;
- price in USD, before/after taxes and surcharges when stated;
- whether it is a completed paid move, survey-reported payment, provider quote, or published range;
- source limitations and reviewer note.

Do not count two pages that reuse the same underlying survey or partner dataset as independent sources.

## 3. Arithmetic mean rule

For each scenario cell:
1. Admit only observations matching the same service type, distance band, shipment-size band and broadly equivalent inclusions.
2. Prefer source-reported averages/medians of the same statistic type. Do not mix an average with a quote, a median, or a percentile-band midpoint in one arithmetic mean.
3. Require at least **three eligible source values**. If only two exist, keep the cell provisional and do not change the production model.
4. Calculate the simple arithmetic mean exactly as requested: sum of eligible source values divided by the number of eligible sources.
5. Also publish the minimum and maximum observed source values so visitors can see market spread. Do not call this a confidence interval.
6. Preserve each source value, its date and its methodology; never overwrite raw observations with the mean.
7. If one source is an obvious scope mismatch or outlier caused by different inclusions, investigate and document it. Do not silently discard it just to produce a preferred result.

A Plus percentile ranges are retained as a separate range cross-check unless a compatible source statistic is available. Their midpoint is not silently relabelled as an average.

## 4. From benchmark to calculator

- First produce a benchmark table for the representative distance/size cells and compare it with the current calculator output under matching assumptions.
- Quantify the difference per cell and look for systematic bias by distance and size; do not apply one blanket multiplier if the error varies by band.
- Test any proposed adjustment on held-out cells/routes not used to derive it.
- Implement the smallest defensible adjustment, with regression tests for representative scenarios and edge cases.
- Keep the estimate explicitly labelled as a planning estimate, with methodology, date, source links, included services and exclusions.
- If a cell lacks three comparable sources, retain the current estimate and disclose the gap rather than inventing a number.

## 5. Separate service models

Do not average these together: full-service movers; moving containers / self-service; rental truck; labor-only. Build separate benchmarks for another service model only after the full-service baseline is complete and the sources expose comparable data.

## 6. Completion gates

B15 is complete only when all of the following are evidenced:
- [ ] Four-source review completed; at least three sources provide usable observations for each calibrated cell.
- [ ] Raw source matrix and arithmetic calculations are committed.
- [ ] Every cell has comparable distance, size, service scope and statistic type.
- [ ] Existing calculator outputs are compared against the benchmark.
- [ ] Holdout validation is documented with error measurements.
- [ ] Any code change has tests, build evidence and a reviewed PR.
- [ ] Methodology page identifies sources, dates, scope and limitations.
- [ ] Production verification confirms the displayed estimate and source disclosure.

## 7. Initial evidence snapshot (reviewed 2026-11-13)

- This Old House's 2026 moving-cost guide states that it uses a 2025 survey of 1,000 moving customers and publishes average prices by distance and bedroom/weight band.
- HireAHelper describes actual paid platform moves and a separate 10,000-transaction truck/container dataset; those service models must remain separate.
- moveBuddha describes a monthly dataset spanning multiple service models and publishes selected participant quotes, but individual quote rows must be checked for matching size and scope.
- A Plus reports 669 completed paid jobs and 20th–80th percentile ranges; it is a useful range cross-check, not a market-wide average.

**No price mean or production calibration is claimed in this plan.** The next B15 work unit is to extract the matched cells from these sources, capture raw values and dates, and calculate only cells with three genuinely comparable source values.