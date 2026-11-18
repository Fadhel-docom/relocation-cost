# B24 follow-up — route fuel, labor-time rules, and missing vehicle-cost evidence

**Research date:** 2026-11-18  
**Status:** research-only. No production formula, coefficient, route distance, or customer-facing price is changed.

## 1. EIA route-fuel geography is now specified from the official regional map

The EIA weekly on-highway diesel table for the week of **2026-11-16** reports these retail prices, including taxes:

| Fuel-price region | Diesel USD/gal |
|---|---:|
| PADD 1A — New England | 6.225 |
| PADD 1B — Central Atlantic | 6.309 |
| PADD 1C — Lower Atlantic | 5.541 |
| PADD 2 — Midwest | 5.967 |
| PADD 3 — Gulf Coast | 5.547 |
| PADD 4 — Rocky Mountain | 6.011 |
| PADD 5 — West Coast | 6.948 |
| California (PADD 5 subregion) | 7.733 |
| West Coast excluding California | 6.269 |
| U.S. | 5.937 |

Official table: https://www.eia.gov/dnav/pet/PET_PRI_GND_A_EPD2D_PTE_DPGAL_W.htm

The official EIA definitions page maps states to PADD regions:
- PADD 1A: CT, ME, MA, NH, RI, VT.
- PADD 1B: DE, DC, MD, NJ, NY, PA.
- PADD 1C: FL, GA, NC, SC, VA, WV.
- PADD 2: IL, IN, IA, KS, KY, MI, MN, MO, NE, ND, OH, OK, SD, TN, WI.
- PADD 3: AL, AR, LA, MS, NM, TX.
- PADD 4: CO, ID, MT, UT, WY.
- PADD 5: AK, AZ, CA, HI, NV, OR, WA.

Official definitions: https://www.eia.gov/dnav/pet/tbldefs/pet_cons_821use_tbldef2.asp

### Route calculation rule

For a route polyline intersected with PADD boundaries, calculate the distance travelled inside each region, then:

`route\_diesel\_price = sum(region\_miles × region\_diesel\_price) / sum(region\_miles)`

Then:

`fuel\_cost\_per\_truck\_mile = route\_diesel\_price / VIUS\_weighted\_MPG`

The loaded-mile allocation remains a separate utilization calculation. Do not average origin and destination prices, do not assign a whole route to the origin PADD, and do not double-count empty miles. If California is represented separately in the EIA series, use its own price for route miles within California and use West Coast-ex-California for the remaining PADD 5 miles. Preserve the week-ending date with every result.

**Important implementation dependency:** route distance tables alone are insufficient for exact PADD mileage. The route geometry/polyline (or a road-network segment sequence with coordinates) must be available. Until that geometry is extracted and validated, this is a fully specified method, not a completed route-level allocation dataset. Alaska/Hawaii need separate treatment because the current road-route dataset is for the contiguous states.

## 2. Driver hours: use route duration plus legal scheduling constraints, not an invented fixed speed

FMCSA's property-carrier summary states the general interstate CMV limits: up to 11 driving hours after 10 consecutive hours off duty; no driving after the 14th consecutive hour after coming on duty; and a 30-minute interruption after 8 cumulative driving hours (subject to applicable exceptions).

Official FMCSA summary: https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations

These are regulatory ceilings and rest rules, **not an estimate of typical trip duration or paid work hours**. They must not be converted into a flat assumed average speed or a universal “hours per 500 miles” factor.

Recommended separation:
1. **Wheel-turning time:** use the routing engine's route duration if it is available and validated; otherwise keep the driving-time input explicitly unresolved rather than manufacturing it from miles.
2. **HOS schedule feasibility:** apply the relevant property-carrier rules only to trips/vehicles actually in scope, with the short-haul and non-CDL exceptions evaluated where relevant. This creates a feasible elapsed schedule, not extra wage hours by itself.
3. **Driver paid time:** include dispatch/pre-trip, loading assistance if actually performed by the driver, fueling, inspection, delays and end-of-trip duties only when separately evidenced or explicitly modelled.
4. **Handling crew time:** calculate loading and unloading separately at origin and destination. Do not multiply the driver's road time by the whole crew count.

For an interstate move, the driver wage geography should normally follow the carrier's dispatch/home-base labour market unless there is evidence of a driver handoff or a separately staffed relay. Do not take a simple average of origin and destination wages. Handling wages can be tied separately to origin and destination labour markets because the loading and unloading crews may be local.

The May 2025 OEWS geographic extraction remains pending. BLS confirms that the official May 2025 state, metro and nonmetro tables and percentile data exist, but the downloadable state XLSX is served as a ZIP that the current retrieval path could not parse. The official state index and tables page remain the source of truth:
- https://www.bls.gov/oes/2025/may/oessrcst.htm
- https://www.bls.gov/oes/tables.htm
- https://www.bls.gov/oes/oes_doc.htm

Do not substitute scraped May 2023 values or third-party reproductions. Required fields remain SOC 53-3032, 53-3033 and 53-7062, area code, employment, employment RSE, mean/median and percentile wages, and suppression flags.

## 3. Insurance: regulatory minimums are verified, but premiums are not

FMCSA's current insurance-filing chart states that for-hire household-goods carriers operating vehicles with GVWR at least 10,001 lb have a **$750,000 BIPD public-liability filing minimum** and a **$5,000 cargo-insurance filing minimum**.

Official source: https://www.fmcsa.dot.gov/registration/insurance-filing-requirements

These are required coverage/filing amounts, **not annual premium prices**. They cannot be multiplied by a guessed rate or treated as insurance cost per mile. Premiums depend on carrier-specific underwriting variables (fleet, operating radius, claims, drivers, coverage, deductibles, cargo exposure and business profile). Therefore the B24 insurance dollar input remains unresolved until a reproducible premium dataset or a sufficiently transparent sample of comparable carrier quotes is obtained. No premium is inferred from GVWR or truck purchase price.

## 4. Capital/depreciation: acquisition evidence is emerging; resale/life evidence is still missing

A current commercial-dealer inventory snapshot contains examples such as:
- New 2025 Isuzu FTR diesel, 26-ft box body, listed at $134,500.
- New 2025 Isuzu NPR-HD diesel, 16–18-ft box bodies, listings around $72,000–$75,343.
- New 2026 NPR-HD examples with materially different body/engine configurations and asking prices.

Inventory source (dealer listings aggregated by Comvoy): https://www.comvoy.com/vehicles/new/isuzu/box-trucks/cargo-straight-box-trucks-rc6b

This is **not yet a depreciation dataset**: the listings are asking prices, configurations differ, and there is no matched used resale cohort, mileage, condition, body/liftgate specification or sale price. Do not calculate depreciation from a single new-truck price or assume a generic residual percentage.

A defensible capital cost needs, by comparable truck class/configuration:
- acquisition price net of body/equipment differences;
- age, odometer and condition-matched resale observations;
- service life / annual mileage assumption with a source;
- financing or cost-of-capital treatment stated separately;
- residual value and disposal cost where supported.

Until a matched used-market cohort is assembled, capital/depreciation remains a sensitivity-only or unresolved line item.

## 5. Tires and maintenance: no defensible tire $/mile found yet

VIUS provides rear-axle tire counts and tire-equipment indicators, but no tire purchase/expense field. A tire cost per mile requires both a comparable installed tire price and a defensible service-life / replacement-mile estimate for the actual tire size, axle position, load rating, duty cycle and casing policy.

A retail tire listing by itself is not enough; neither is a generic “truck tire lasts X miles” claim. The evidence collection must record tire model/size/load range, installed price (including mounting, balancing and disposal), expected casing/retread treatment, and observed or manufacturer-supported tread life. Until both price and service-life evidence match the truck class, tire cost remains unresolved.

The VIUS annual maintenance and extensive-repair bands are interval-censored and disclosure-protected. Preserve the weighted category distribution. Do not turn category midpoints into precise invoices or a single cost-per-mile coefficient. A later inflation adjustment must use a documented, relevant official price index and retain the original 2021 nominal band definitions.

## 6. Rental price evidence is deliberately excluded from the owner-operated cost equation

U-Haul's public comparison shows that consumer rental prices combine time, per-mile charges, route-specific one-way pricing, included days/miles and optional coverage. Its FAQ confirms that one-way rates depend on truck size, origin, destination and date, and include a set number of days and miles.

Sources:
- https://www.uhaul.com/Tips/Packing/Truck-Rental-Price-Vs-Cost-What-Youre-Really-Paying-for-36520/
- https://www.uhaul.com/FrequentlyAskedQuestions/Truck-Rentals/

These are useful for a separate DIY rental comparison, not as a proxy for a carrier-owned truck's fuel, maintenance, insurance, capital and labour costs. Keep rental, truck-only owner-operated, truck-plus-labour and full-service mover scopes separate.

## 7. Validation protocol — freeze inputs before opening holdout routes

When the component dataset is ready:
1. Freeze the calibration route list and calibration assumptions before examining holdout outcomes.
2. Hold out complete origin-destination pairs, not merely duplicate rows; where possible also hold out at least one geographic corridor/PADD combination.
3. Stratify the holdout by route distance (short/medium/long), shipment size, truck class, and dedicated/shared service.
4. Compare predicted component costs with any independent observations using the same scope and units. Keep public mover quotes as external validation only; never blend them into cost coefficients.
5. Report absolute error, percentage error, median absolute percentage error, signed bias, and coverage of the uncertainty interval. Report results by route and size, not just one aggregate score.
6. Do not tune on the holdout set. If a model revision is required, move the former holdout into development and reserve a new untouched holdout.
7. A failed or poorly covered holdout is a model result, not a reason to quietly adjust constants until it passes.

## 8. Current decision and next work

**Newly resolved:** official PADD-to-state mapping and the route-mile-weighted fuel-price formula; correct interpretation of HOS rules as scheduling constraints rather than labour-hour estimates; FMCSA household-goods insurance filing minimums; and a limited set of new-truck acquisition-price observations.

**Still unresolved:** May 2025 state/metro BLS extraction; route polyline-to-PADD mileage; validated driver and handling paid-hour assumptions; installed tire price plus service life; comparable used-truck resale/service-life data; actual insurance premiums; maintenance-band inflation and interval treatment.

No complete non-fuel truck operating cost, no full `$/truck-mile`, no `$/lb-mile`, and no consumer moving price is established by this update. B24 remains experimental. The existing production calculator and its coefficients remain untouched.
