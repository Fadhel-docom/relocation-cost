# US market value roadmap — execution baseline
**Date:** 2026-11-03  
**Owner scope:** United States only. Canada, United Kingdom/England and EU research is explicitly excluded from this workstream until the separate Claude review is complete.  
**Status:** Research and operating plan; no production code, prices, formulas, public pages, API calls, deployments or indexing changes.

## Executive decision

Do not expand the city count. The existing 18-city footprint should become a reliable, decision-useful relocation planning layer before any new geography is added.

The strongest product direction to test is not a generic moving-price calculator. It is a **whole-move cash plan** that combines:
1. the move itself and its cost components;
2. employer assistance (lump sum, direct payment, reimbursement, caps, timing and employee-paid items);
3. the household's first weeks/months after arrival, including recurring housing costs and a user-selected cash buffer;
4. planned versus actual costs after the move.

This is a promising product position, not a proven moat or a uniqueness claim. Competitors already offer moving estimates, quote comparison and some relocation-package calculators. We must prove that our integrated budget workflow is materially more useful and more accurate for a defined audience.

## Current US footprint — repository-verified

- `data/cities.json`: 18 city-centre coordinate records.
- `data/city-routes.json`: 44 city-pair pages. The file describes great-circle distance and one page per pair covering both directions.
- `data/route-pages.json`: 50 state-to-state route pages.
- `data/coefficients.json`: source-backed benchmarks, but explicitly **not** a calibrated universal quote model. U-Haul distance-band averages are lower-bound DIY rental benchmarks; BLS labor wages are context only; Census migration is context only. Candidate universal coefficients remain null.
- City route distance method is great-circle distance between city-centre coordinates, not road mileage or address-to-address routing.
- The 18 city records are not yet a complete local-city data product. The city list alone does not establish local pricing, neighborhood-level costs, current rents, local moving rules or city-specific labor rates.
- The HeiGIT road-distance output remains isolated. CC BY-SA result licensing is understood at a high level, but account storage/caching/retention and factual database-rights application remain unresolved. No production adoption is authorised.
- The existing product already has useful building blocks: moving-cost calculator, cost breakdown, employer package comparison, employee out-of-pocket gap, cash buffer, planned-vs-actual budget tracker, checklist, truck-size guidance and mover/quote education. The next work should connect these into one coherent decision flow rather than add disconnected widgets.

## Phase 1 — improve the whole relocation budget and calibrate only what evidence supports

### 1A. Make the budget model explicit before changing its math

Separate the estimate into distinct, visible components and label each one by evidence type:
- **Moving provider price:** actual dated quote or user-entered quote; record service type, inventory/weight or home-size proxy, origin/destination, move date, access conditions, packing/loading/unloading, insurance/valuation, storage and included/excluded fees.
- **DIY truck rental:** dated, route- and truck-size-specific observed price where available. U-Haul's published mileage-band averages are historical benchmarks, not current route quotes and not a universal per-mile coefficient.
- **Fuel:** calculate only when route distance, vehicle/truck fuel economy and fuel price basis are explicit. Do not silently treat a federal mileage reimbursement rate as consumer fuel cost.
- **Lodging/meals/tolls/storage/packing/insurance:** separate inputs or sourced estimates with geography, date, unit and scope. Do not hide them in a single multiplier.
- **Employer assistance:** user-entered allowance and reimbursement policy, eligible expense categories, caps, payment timing, required receipts, repayment/clawback terms and taxable/non-taxable treatment only where verified for the user's case. Show gross assistance, eligible spend, expected reimbursement timing and the remaining employee-funded amount separately.
- **Arrival cash plan:** recurring housing, utilities, transport, food and other essential monthly costs; user-selected months/weeks of buffer; one-time deposits/setup costs; first-paycheck timing. Distinguish monthly burn from move-day spend.

### 1B. Source hierarchy and what each source can/cannot prove

| Source | Useful role | Do not use it as |
|---|---|---|
| Dated provider quotes / paid invoices with scope and consent | Primary calibration observations for the actual moving service | A universal market price from a small convenience sample |
| U-Haul published mileage-band table | DIY truck-rental benchmark with its stated period and limitations | Live price, route-specific quote, or full-service mover price |
| BLS OEWS / ECI / CPI | Local occupational wage context, labor-cost trends, selected metro price changes | Direct mover quote or guaranteed mover hourly rate |
| Census ACS | Local housing/rent/income/population context and migration characteristics | A moving-service price |
| BEA Regional Price Parities (RPP) | Broad metro/state price-level comparison, including housing-rent component | A standalone estimate of a particular household's rent or moving cost |
| EIA fuel price series | Fuel-price context by published geography and date | Exact route fuel spend without distance and vehicle efficiency |
| GSA per diem | Federal lodging/meals allowance benchmark for its defined purpose | Average consumer hotel/meal spending |
| IRS mileage rate | Tax/federal rules for the specific eligible use | A consumer vehicle's fuel cost or general moving-cost rate |

Official-source starting points (recheck release vintage and geography before use):
- BEA RPP: https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area
- BEA RPP methodology: https://bea.gov/news/rpce-rpi-rpp-release-additional-information
- BLS data: https://www.bls.gov/data/
- BLS metro CPI: https://www.bls.gov/charts/consumer-price-index/consumer-price-index-by-metro-area.htm
- Census ACS: https://www.census.gov/programs-surveys/acs
- Census state-to-state migration: https://www.census.gov/data/tables/time-series/demo/geographic-mobility/state-to-state-migration.html
- EIA petroleum data: https://www.eia.gov/petroleum/gasdiesel/
- GSA per diem files: https://www.gsa.gov/travel/per-diem-rates/per-diem-files
- GSA mileage rates: https://www.gsa.gov/travel/mileage-reimbursements
- IRS mileage rates: https://www.irs.gov/tax-professionals/standard-mileage-rates

Important 2026 distinction: the GSA mid-year schedule shows $0.235/mile for federal relocation purposes from July 1, 2026; the IRS page separately labels the 23.5-cent moving rate as military-only. These are rule/allowance figures for defined cases, not a market estimate of consumer driving costs. Always retain the applicable agency, use case and effective date.

### 1C. Calibration record required for every observation

Do not use an observation unless it can be stored with:
- observation ID and source URL/provider;
- quote or transaction date, retrieval date and move date;
- origin/destination geography and route-distance method;
- service type and scope;
- home size/inventory/weight and truck size where relevant;
- included/excluded charges and access conditions;
- currency, amount, unit and taxes/fees;
- source rights, permission/terms and whether public redistribution is allowed;
- anonymisation/consent status if user supplied;
- quality flag and reason for exclusion.

Do not scrape or retain personal data. Do not contact providers or users, submit forms, or publish collected prices without the owner's approval and a lawful, documented data basis.

### 1D. Calibration gate

No coefficient/formula change until:
1. observations are comparable by service type and scope;
2. sample count and coverage are disclosed by route, home-size band and move type;
3. outliers and missingness are documented;
4. estimates are tested against a holdout set not used to fit the model;
5. error metrics and uncertainty bands are reported;
6. owner approves a separate implementation PR.

If quote evidence is too sparse, improve transparency and allow quote entry; do not pretend the model is calibrated.

## Phase 2 — make the existing 18 city pages genuinely useful

### City inventory (from `data/cities.json`)

| Current city | State | Local data work required before calling the page locally informative |
|---|---:|---|
| New York | NY | Confirm correct metro geography; ACS housing/rent; BEA RPP; BLS coverage; official city moving-truck/parking rules |
| Los Angeles | CA | Same; city/county distinctions and official parking/permit sources |
| Chicago | IL | Same; official loading/parking rules and local housing context |
| Houston | TX | Same; metro boundary and housing context; official city rules |
| Phoenix | AZ | Same; metro boundary, housing context and official local rules |
| Dallas | TX | Same; distinguish Dallas from Dallas–Fort Worth metro data |
| Austin | TX | Same; confirm current metro definition and source availability |
| San Francisco | CA | Same; city versus metro geography, housing context and official truck/parking rules |
| Seattle | WA | Same; city versus metro geography and official loading/parking rules |
| Denver | CO | Same; current metro geography and official local rules |
| Miami | FL | Same; distinguish city from Miami–Fort Lauderdale–West Palm Beach metro |
| Atlanta | GA | Same; metro geography, housing context and official local rules |
| Boston | MA | Same; cross-state metro geography and official local rules |
| Las Vegas | NV | Same; metro geography and official local rules |
| Portland | OR | Same; cross-state metro geography and official local rules |
| San Diego | CA | Same; county/metro geography and official local rules |
| Charlotte | NC | Same; cross-state metro geography and official local rules |
| Nashville | TN | Same; metro geography and official local rules |

This table is a **research queue**, not a claim that each data source has already been matched to every city. Before importing any series, build a geography crosswalk (city → county/county-equivalent → OMB metro definition → source geography) and record mismatches.

### Minimum useful local profile for each city

For each of the 18, aim to publish only fields that are available, current and decision-useful:
1. city and metro definition, counties included, and source geography;
2. latest ACS rent/housing benchmark with year, measure and confidence/limitations;
3. BEA RPP all-items and housing-rent parity with year and national baseline;
4. local mover-labor wage context only if a suitable BLS metro occupational estimate exists;
5. fuel-price context only at the geography and frequency the source actually supports;
6. official local moving-truck/loading/parking permit rules, fees and links, only when an authoritative municipal page exists;
7. practical explanation of what the local data means for a relocating household, with no false precision.

No neighborhood rankings, invented “average mover prices”, or city-specific coefficients from broad state/metro indicators. If a field is unavailable or too old, show “not available” rather than filling it with a national average without explanation.

### City-page acceptance test

A page is not “improved” merely because it contains more text. It must help answer a local decision question that the calculator cannot answer alone, cite the source and date beside each changing figure, distinguish city from metro geography, explain limitations, link to the relevant calculator/budget workflow, and pass mobile/accessibility/build checks. If no useful local facts can be verified for a city, do not add a thin city hub.

## Phase 3 — build a defensible data asset, not a marketing claim

Candidate asset: a **dated, transparent US moving-cost observation dataset** with route, service type, home-size band, quote date, inclusions, sample count, median/range and methodology.

Before naming or promoting it:
- decide whether observations are public quotes, licensed provider data, owner-submitted quotes/receipts with explicit consent, or another documented source;
- secure redistribution rights and privacy controls;
- publish collection and exclusion rules;
- publish data dictionary, version, update date, source coverage and limitations;
- report sample counts per cell and missing coverage;
- separate observed prices from model estimates;
- avoid national labels unless the sampling design and coverage genuinely support national inference;
- do not imply statistical representativeness from convenience samples;
- retain a correction and deletion process for contributed data.

A smaller, honest set of route-level observations is more valuable than a broad unsupported “national study”. The dataset remains a hypothesis until enough lawful, comparable observations exist.

## Phase 4 — distribution after product evidence

1. **Google/Bing:** preserve the 2026-11-05 GSC measurement gate and compare equivalent windows; diagnose the calculator discovery/indexing issue from URLs and crawl evidence rather than resubmitting blindly.
2. **AI answer engines:** keep the direct ChatGPT Search, Google AI Overviews/AI Mode and Copilot benchmark marked NOT TESTED until each surface is actually checked. Record exact prompt, date, location/language, whether our domain appears, cited URL, competitors and screenshot/evidence. Ordinary web search is not an AI citation test.
3. **Citable data asset:** only pitch it after methodology, sample coverage and rights are ready.
4. **Embeddable tool:** research and prototype only after a measurable user need and distribution partner interest are demonstrated; do not build a generic embed for its own sake.
5. **Publisher partnerships:** PR #172 is a research-only shortlist and draft outreach. It is not approval to contact anyone. Do not send outreach without owner approval.
6. **Measure useful outcomes:** calculator starts/completions, budget saves/exports, employer-gap interactions, return usage, qualified organic clicks and partner referrals; impressions alone are not success.

## Work sequence and gates

| Order | Work package | Deliverable | Gate |
|---|---|---|---|
| 1 | Budget component and source audit | Field-level data dictionary + source/rights matrix | No formula change |
| 2 | 18-city geography crosswalk | Verified city/metro/source coverage matrix | No new cities |
| 3 | First city profiles | Small pilot for 2–3 cities, chosen by source completeness and demand evidence | Owner review before public pages |
| 4 | Calibration feasibility | Quote-observation protocol + sample/quality assessment | No coefficients until evidence passes |
| 5 | Dataset feasibility | Rights, privacy, representativeness and maintenance plan | No “national study” claim |
| 6 | Distribution | AI/Search baseline, embed demand test, publisher pipeline | No outreach or embed release without evidence/approval |

## Immediate next actions

- **ChatGPT:** complete the US data-source inventory and city-to-source geography crosswalk; audit the current budget feature flow and record missing fields without editing production calculations.
- **Claude:** after finishing the separate international research, independently review this US roadmap and challenge the proposed city-source mapping, budget field model and calibration gates. Do not overlap or merge international research into this report.
- **Owner:** no action required now. Owner approval will be requested only for external contact, data collection that needs consent/terms, a public release, or a formula change.

## Evidence and limitations

This baseline is based on repository files on `main` and official source pages linked above, checked 2026-11-03. It is a desk audit and operating plan, not a full audit of every live page, all 18 city datasets, provider quotes, GSC/Bing current data, or direct AI answer surfaces. Those checks remain explicitly open. No live price calibration, city-page publishing, API call, outreach, deployment or indexing action was performed.
