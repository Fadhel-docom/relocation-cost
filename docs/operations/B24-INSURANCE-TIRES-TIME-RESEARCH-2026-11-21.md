# B24 — Independent insurance, tire and time evidence review

**Prepared:** 2026-11-21  
**Owner:** ChatGPT  
**Status:** research-only. No production coefficient, calculator logic, displayed price, route distance, or customer-facing claim is changed.

## Executive decision

This review finds usable industry benchmarks for insurance and tires, and stronger public evidence for truck travel-speed and driver-hours context. It does not establish mover-specific box-truck rates or residential loading/unloading productivity.

| Component | Latest usable benchmark | Evidence scope | B24 decision |
|---|---:|---|---|
| Truck insurance premiums | $0.106 / combination-truck-mile (2025) | ATRI for-hire combination-truck fleet benchmark | External benchmark only; do not apply as a box-truck mover coefficient yet |
| Tires | $0.050 / combination-truck-mile (2025) | ATRI for-hire combination-truck fleet benchmark | External benchmark only; do not apply as a box-truck mover coefficient yet |
| Driving-time utilization | 7.41 driving hours/day and 10.4 on-duty hours/day (2025) | ATRI industry HOS utilization benchmark | Plausibility check only; not route ETA or residential moving job duration |
| Route truck speeds | FHWA Monthly NHS Traffic Speed dataset | Public median speed by month, vehicle type, time period, area and functional system | Best next dataset to extract and test against the 44 route geometries |
| Loading/unloading time | No defensible national mover-specific productivity dataset identified | No supported minutes/hour per room, cubic foot, or weight | Keep unresolved; do not invent a crew-hours multiplier |

ATRI figures are better than an arbitrary allowance, but the sample is for-hire combination trucks, not the B24 VIUS business-related box-truck cohort (GVWR classes 6–7) and not a sample of household-goods moves. The scope mismatch is decisive.

## 1. Insurance

### ATRI per-mile benchmark

ATRI's 2026 Operational Costs of Trucking report covers 2025 operating costs. FleetOwner's report of the ATRI line items gives:
- Insurance premiums: $0.106 per mile in 2025, versus $0.102 in 2024 (+3.9%).
- Tires: $0.050 per mile in 2025, versus $0.047 in 2024 (+6.4%).
- The 2025 total operating cost was $2.336 per mile.
- The survey included roughly 182,248 combination trucks and represents for-hire operations, not private fleets or residential movers.

Sources:
- ATRI report landing page: https://truckingresearch.org/about-atri/atri-research/operational-costs-of-trucking/
- ATRI 2026 report release: https://truckingresearch.org/2026/07/new-atri-report-details-accelerating-costs-and-low-profitability-despite-cuts/
- FleetOwner line-item transcription and scope caveats (Nov. 10, 2026): https://www.fleetowner.com/emissions-efficiency/article/55417694/trucking-by-the-numbers-2026-the-price-of-operating-a-fleet
- Truck News coverage (July 15, 2026): https://www.trucknews.com/transportation/cost-to-operate-a-truck-hit-record-2-34-per-mile-in-2025-atri-says/1003218450/

ATRI's 2026 motor-carrier survey form defines truck insurance premiums as liability, cargo and excess-liability policy premiums related to insuring the truck; it excludes workers' compensation, physical damage, jury awards and out-of-court settlements. This is not an all-in business-insurance figure.
Source: https://truckingresearch.org/wp-content/uploads/2026/02/2026-Ops-Cost-Motor-Carrier-Form.pdf

ATRI's separate insurance research says liability premium costs rose 18.6% from 2021 to 2024, reaching 10.2 cents per mile; per-mile liability losses rose 33.1%.
Source: https://truckingresearch.org/2026/05/new-atri-research-analyzes-motor-carrier-responses-to-rising-insurance-costs/

### FMCSA legal minima are not premium prices

FMCSA states that for-hire household-goods carriers operating vehicles with GVWR at least 10,001 lb have $750,000 BIPD/public-liability and $5,000 cargo filing minimums. These are minimum filed coverage/financial-responsibility amounts, not annual premiums. Do not multiply them by an assumed rate or convert them to dollars per mile.
Official source: https://www.fmcsa.dot.gov/registration/insurance-filing-requirements

### Mover-specific cross-check

Insureon publishes a median commercial-auto policy cost for moving businesses of $876/month ($10,512/year), plus $120/month general liability and $755/month workers' compensation. These are medians among moving businesses applying for quotes; the page notes fleet size/value, revenue, employee count, coverage limits/deductibles and cargo exposure as factors.
Source: https://www.insureon.com/trucking-business-insurance/moving-companies/cost

This is closer to the target industry than ATRI's combination-truck survey, but it is a business-policy median without a matched number of insured trucks or annual-mile denominator. Keep it as a descriptive cross-check only. Do not divide by one truck or guessed fleet mileage, and do not add it to the ATRI per-mile figure.

**Insurance decision:** $0.106/combination-truck-mile is the best public per-mile comparator; Insureon's $876/month mover-policy median is a separate cross-check. Neither is approved as a B24 box-truck coefficient. A stronger input requires comparable mover premium observations with insured vehicle count, vehicle class, coverage scope, annual miles, geography and policy year.

## 2. Tires

ATRI's 2025 benchmark reports $0.050 per combination-truck-mile, up 6.4% from $0.047 in 2024. ATRI's owner-operator form defines tire expenses to include purchase, maintenance, retreading and replacement.
Sources:
- https://truckingresearch.org/about-atri/atri-research/operational-costs-of-trucking/
- https://truckingresearch.org/wp-content/uploads/2026/02/2026-Ops-Costs-OO-Form.pdf
- https://www.fleetowner.com/emissions-efficiency/article/55417694/trucking-by-the-numbers-2026-the-price-of-operating-a-fleet

This is a fleet-level lifecycle benchmark, not a matched rate for B24 medium-duty box trucks. A defensible box-truck tire cost needs:
1. Tire size, load range/index and axle position by vehicle class.
2. Tire count in the modeled configuration.
3. Installed purchase price (tire, mounting, balancing, disposal and fees).
4. Expected service mileage under a stated duty cycle/load, including casing and retread policy.
5. Puncture repairs, premature removals and casing credits, without double counting.

A retail tire listing divided by an assumed lifespan is not enough. Manufacturer warranty mileage is not automatically observed service life. VIUS tire/equipment fields describe configuration but do not supply matched tire expenses or service-life observations.

If matched data are obtained, calculate lifecycle tire spend for the tire set divided by truck miles over the same lifecycle. Keep low/base/high scenarios only when each is supported by a source or measured cohort.

**Tire decision:** $0.050/combination-truck-mile is an external comparator, not a B24 box-truck input. Installed price plus service-life evidence remains open.

## 3. Time: separate road travel, driver duty and moving labour

### Observed fleet HOS utilization

Truck News' July 15, 2026 coverage of ATRI's report says 2025 drivers averaged 7.41 driving hours/day out of 11 available and 10.4 on-duty hours/day out of the 14-hour window. On-duty time includes pre/post-trip inspections, fueling/servicing, shipper interactions and breaks as well as driving. Truckload and specialized carriers averaged 7.97 and 7.95 driving hours; LTL averaged 5.98.
Source: https://www.trucknews.com/transportation/cost-to-operate-a-truck-hit-record-2-34-per-mile-in-2025-atri-says/1003218450/

This is an industry scheduling benchmark, not a B24 route ETA or residential loading/unloading standard. Do not convert 7.41 hours/day into a universal average speed or multiply the whole crew by driver duty time.

### Legal limits are ceilings, not average time assumptions

FMCSA's property-carrying rules generally allow up to 11 driving hours after 10 consecutive hours off duty; prohibit driving beyond the 14th consecutive hour after coming on duty; and require a 30-minute interruption after 8 cumulative driving hours, subject to applicable exceptions. Cumulative 60/70-hour limits also apply.
Official summary: https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations
Regulatory text: https://www.govinfo.gov/content/pkg/CFR-2025-title49-vol5/xhtml/CFR-2025-title49-vol5-part395.html

These rules establish schedule feasibility, not road speed, route ETA, paid hours for a particular move, loading duration, or crew productivity. Assess short-haul exceptions only where the operation qualifies.

### FHWA observed truck speeds — best next extraction

FHWA's public Monthly NHS Traffic Speed dataset reports historical 50th-percentile median speeds by year/month, vehicle type, time period, area and functional road system. The data portal listed 7,812 rows and 10 columns and was updated Nov. 5, 2026; it is public-domain U.S. government data.
Dataset: https://data.transportation.gov/Roadways-and-Bridges/Monthly-NHS-Traffic-Speed/ra4w-8xud
Data.gov metadata and CSV/API downloads: https://catalog.data.gov/dataset/monthly-nhs-traffic-speed

FHWA also documents a Freight Performance Measures tool with truck operating speeds by place and time on 25 major freight interstates.
Source: https://ops.fhwa.dot.gov/freight/freight_analysis/travel_time.htm

**Next technical step:** retrieve the FHWA CSV and metadata; inspect exact vehicle-type, time-period, area and functional-system values; join relevant truck median-speed observations to existing route geometry where spatially valid; calculate route-segment-weighted time and report coverage. Preserve time-of-day/month uncertainty. Do not apply NHS speeds to local/non-NHS access segments. If a valid join cannot be built, keep road time unresolved rather than inventing a constant.

### Residential moving task time remains unresolved

Claude's latest work-log entry reports that BLS May 2025 OEWS wages for SOC 53-3032, 53-3033 and 53-7062 have been extracted into State and Metro files. OEWS supplies wage rates, not hours per residential move, crew composition, employer burden or productivity.

Once task hours and crew roles are supported, keep labour separate:
- driver road/duty time: driver role only;
- loading at origin: handling crew only;
- unloading at destination: handling crew only;
- driver handling assistance: count only if explicitly modeled, without counting the same person-hours twice.

No supported national residential-mover source was identified here that establishes loading/unloading hours per room, cubic foot or pound. Keep these hours unresolved. Target mover-specific time-and-motion studies or anonymized job records containing shipment size, crew size, actual paid hours, loading/unloading split, route and service scope. If unavailable, use only a clearly labelled scenario range tested against independent observations, never a claimed national average.

## 4. Double-counting controls

- ATRI insurance per-mile is premiums under its defined scope, not legal coverage limits.
- Insureon commercial-auto median is not additive to ATRI's per-mile benchmark.
- ATRI tire cost includes purchase, maintenance, retreading and replacement; do not add tire maintenance again.
- ATRI's $106.69/hour 2025 operating-cost benchmark is all-in truck operating cost, not an hourly wage. Use only as an external reasonableness check after component assembly.
- BLS OEWS wages are straight-time wage estimates, not benefits/payroll-tax loads or task-hour estimates.
- HOS on-duty time includes non-driving duties and breaks; do not add 10.4 hours to 7.41 driving hours because driving is already included in on-duty time.

## 5. Recommended B24 sequence

1. Extract FHWA Monthly NHS Traffic Speed and metadata; preserve source date, units, vehicle mapping and missing values.
2. Test route-time joins on all 44 geometries, distinguishing NHS from local roads; compare with available routing durations without additional HeiGIT calls.
3. Keep ATRI insurance and tire figures tagged as combination_truck_for_hire external comparators, not household_goods_box_truck inputs.
4. Seek mover fleet premium observations with truck counts and mileage denominators.
5. Match box-truck tire configuration, installed cost and observed service life.
6. Keep handling hours open until mover-specific task-time observations support them; BLS wages remain separate.
7. Freeze inputs and run the previously specified route/size holdout only after component coverage and uncertainty bounds are adequate.

## 6. Evidence hierarchy

1. Primary federal/regulatory: FMCSA insurance filing requirements and HOS rules; FHWA NHS truck-speed dataset and FPM references.
2. Primary research institute: ATRI operational-cost and insurance research; ATRI survey forms for cost definitions.
3. Official wage statistics: BLS May 2025 OEWS and technical notes.
4. Mover-policy cross-check: Insureon medians, with applicant cohort and denominator limitations.
5. Industry reporting: FleetOwner and Truck News reproductions of ATRI 2025 line items and utilization figures. Label these as trade-press reporting of ATRI, not independently collected mover data.

**Final gate:** this review does not establish a complete non-fuel cost model, mover-specific tire/insurance rates, residential labour hours, or a consumer moving price. No production change is authorized.
