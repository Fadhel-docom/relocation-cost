# B24/B15 — Shipment capacity allocation and excluded-cost register
**Prepared:** 2026-11-26  
**Status:** research-only evidence review; no production changes, no crew-hour changes, no model coefficient changes.

## Executive findings

1. There is a defensible *measurement basis* for shipment size: actual shipment weight and/or measured cubic volume from a physical/virtual survey and item inventory. 49 CFR Part 375 explicitly recognises estimates based on weight or volume, requires an explained volume-to-weight conversion when used, and requires actual certified-scale weight for non-binding estimates whose final charges depend on weight (§§375.401, 375.405, 375.507–375.509). FMCSA's consumer guide explains that a truck can already contain other shipments before a shipment is loaded and that tare/gross weighing can isolate an individual shipment's net weight. This is direct evidence that multi-shipment loading exists; it does **not** prescribe a universal cost-sharing formula.
2. There is no defensible national public dataset in the repository that maps bedroom labels to actual cubic feet, shipment weight, or truck-space utilization. CMR's size groups (<400, 400–800, 800–1,200, 1,200+ cu ft) are one mover network's published grouping and are not an independent national conversion standard.
3. Best candidate allocation metric for a *space-constrained shared-load scenario* is measured shipment cubic feet divided by usable cargo cubic feet, with payload/axle limits checked separately. For route-mile costs, a shipment's share may need a volume-mile or weight-mile driver depending on what constrains the resource. These are proposed accounting allocation bases, **not a published industry-standard HHG tariff formula**. No exact national allocation rule found.
4. Keep full truckload and consolidated/shared-load cases distinct. Do not assume every shipment shares a truck; do not assume a shipment uses the whole truck. Do not infer utilization from bedrooms alone.
5. The excluded-cost register below distinguishes (a) a source that establishes the cost category or gives a comparator, from (b) a source sufficient to estimate a Class 6–7 household-goods mover input. Most categories have the former but not the latter. "No source" means no adequate project-matched public source located for a usable rate/denominator; it does not mean the cost does not exist.

## 1. Evidence for truck capacity and shipment-size allocation

### 1.1 Direct regulatory support for measuring each shipment

- **49 CFR §375.401 and §375.405:** a mover's estimate must consider estimated shipment weight or volume and requested accessorial services; if volume is converted to weight, the conversion formula must be explained in writing. This supports volume as a recognised estimating measurement, not a bedroom-to-cubic-feet shortcut.
- **49 CFR §375.507:** where a non-binding estimate depends on shipment weight, each shipment's weight must be determined on a certified scale; a written explanation is required for volume-to-weight conversion.
- **49 CFR §375.509:** the regulatory weighing method uses truck tare and gross weights to calculate shipment net weight.
- **FMCSA Subpart E guidance:** origin weighing may occur when the truck is already partially loaded with other shipment(s); this does not affect the shipment's net weight when the prescribed weighing method is followed. This is direct evidence that a truck may carry multiple customers' shipments on the same vehicle.
- **FMCSA Appendix A, "Transport of Shipments on Two or More Vehicles":** it discusses cubic feet required by a shipment and the risk that an underestimated shipment will not fit, causing a leave-behind. This supports measuring cube and recognising usable-space constraints.

Sources:
- 49 CFR Part 375, especially §§375.401, 375.405, 375.507 and 375.509: https://www.govinfo.gov/content/pkg/CFR-2025-title49-vol5/xhtml/CFR-2025-title49-vol5-part375.html
- FMCSA, Pickup of My Shipment (Subpart E): https://www.fmcsa.dot.gov/protect-your-move/how-to/subpartE
- FMCSA, Your Rights and Responsibilities When You Move (Appendix A): https://www.fmcsa.dot.gov/sites/fmcsa.dot.gov/files/2023-10/FMCSA_R%26R_Handbook_Web_v1.pdf

### 1.2 What VIUS can and cannot supply

2021 VIUS is the appropriate national source for the physical and operational characteristics of trucks (vehicle type/body, GVWR, dimensions and use fields where available). It is not a household shipment inventory database and does not observe a specific mover's shipment cubic feet, the number of concurrent customers on a truck, or the share of usable cargo volume occupied by each customer. Do not derive shipment-size distributions or shared-load fractions from VIUS truck counts or fuel-use records.

Sources:
- Census 2021 VIUS PUF and data dictionary: https://www.census.gov/data/datasets/2021/econ/vius/2021-vius-puf.html
- BTS VIUS overview: https://www.bts.gov/vius

### 1.3 Evidence hierarchy for shipment size

| Candidate measure | Evidence status | Appropriate use | Limitation |
|---|---|---|---|
| Actual net shipment weight | Strong regulatory basis; certified-scale method | Best observed mass input where available | Weight alone does not describe cube or awkward item geometry |
| Measured cubic feet from inventory/survey | Strong regulatory recognition as an estimate basis | Best direct space-demand measure | Requires consistent inventory/table measurement and a stated method |
| Weight inferred from cubic feet | Permitted only with written conversion explanation | Secondary estimate if tariff uses a documented factor | Density varies by shipment mix; do not use an unexplained universal factor |
| Truck usable cargo volume | Requires exact vehicle/body configuration source | Denominator for a space-share scenario | VIUS national survey does not give the project's matched fleet configuration and loading efficiency |
| Payload / GVWR capacity | Vehicle technical/legal constraint | Separate feasibility cap on weight | Not interchangeable with cubic feet; axle limits and body limits also matter |
| Bedroom count | Weak proxy only | UX starting category, not physical measurement | Furniture quantity, packing, household composition and possessions vary substantially |
| CMR bedroom/cube bands | External mover-network grouping | Independent comparison / benchmark description only | Not a national conversion law or independently sampled census |

### 1.4 Candidate allocation equations — hypotheses, not adopted rules

For a shared-load scenario with multiple shipments on the same vehicle:

- **Space share:** shipment measured cube ÷ usable cargo cube.
- **Payload share:** shipment measured net weight ÷ usable payload.
- **Volume-distance exposure:** shipment cube × common line-haul miles.
- **Weight-distance exposure:** shipment net weight × common line-haul miles.

No single one is correct for every cost. Cube may govern trailer/box-space scarcity; weight/payload may govern legal/vehicle constraints; route miles drive fuel and distance-related wear; customer-specific pickup/delivery handling is not shared merely because line-haul is shared.

A possible *research-only allocation sensitivity* is to compare:
1. cube share of space-constrained equipment cost;
2. weight share of payload-constrained cost;
3. volume-mile and weight-mile allocations for common line-haul costs.

Do not sum these as four costs. They are alternative allocation drivers for the same underlying common cost pool. Add a fixed per-shipment stop/pickup/delivery cost only where supported by measured stops and service work. A shipment with exclusive-use service or one that occupies the full loading space should be represented as a separate full-capacity case, not prorated as a consolidated shipment.

**Important evidence gap:** neither FMCSA nor VIUS provides a universal formula for allocating common truck costs among customers. The equations above are transparent cost-accounting hypotheses. Before using them beyond sensitivity analysis, obtain carrier tariff language and/or anonymized manifests showing truck ID, usable cube, shipment cube/weight, loaded miles, stop sequence, and invoiced allocation for each shipment.

### 1.5 California tariff example — narrow jurisdiction only

California PUC Maximum Rate Tariff 4 (effective tariff document dated January 16, 2014) contains a Table of Measurements, estimated-cost rules, and a 7 lb per cubic foot conversion in the specified weight-based estimating context. It is useful evidence that a regulator-approved household-goods tariff can use itemized cube and a stated cube-to-weight factor. It is **not** a current nationwide factor, and it does not establish the right factor for this model or all states.

Source: CPUC Maximum Rate Tariff 4: https://files.cpuc.ca.gov/transportation/MaxRateTariff4_1_16_14.pdf

## 2. Excluded-cost component register

The prototype's current partial subtotal contains fuel, a route-duration driver wage proxy, and scenario-based handling wages only. The table below enumerates the remaining exclusions and the evidence quality. "Source exists" is not the same as "usable project-matched rate exists."

| Excluded component | Evidence located | Project-fit / what is still missing |
|---|---|---|
| Vehicle maintenance and repairs (excluding tires) | **Source:** ATRI 2025 Sample Carrier Operational Costs, 2024 truckload peer-group median $0.161/truck-mile; `data/research/b24-atri-2024-truckload-comparator.json` | Freight tractor-trailer cohort, not Class 6–7 household-goods box trucks. No matched box-truck repair invoices and mileage. Comparator only. |
| Tires: purchase, repairs, retreads, replacement, casing | **Source:** ATRI 2024 truckload peer median $0.032/truck-mile; Michelin 2023 lifecycle method and illustrative examples in `data/research/b24-tire-capital-benchmarks-2026-11-18.json` | No matched Class 6–7 tire specification, installed invoices, service-life mileage and retread/repair history. Comparator/method only. |
| Commercial auto / motor-truck liability premium | **Source:** Insureon moving-business median $876/month per policy; ATRI 2025 $0.106/combination-truck-mile (different peer cohort) in `data/research/b24-insureon-moving-insurance-benchmarks-2026-11-18.json` and B24 insurance review | Insureon lacks truck-count and annual-mile denominator; ATRI is combination trucks. No matched premium per box truck-mile. |
| Cargo / goods-in-transit / bailee coverage | **Source:** FMCSA §375.303 and order-for-service disclosures identify liability/valuation choices; Insureon notes cargo/bailee coverage may be separate | **No source** for a matched premium per shipment or truck-mile for the target fleet; legal coverage disclosure is not a premium rate. |
| Physical damage / comprehensive / collision | **Source:** insurance-policy categories discussed in B24 insurance review / Insureon caveats | **No source** for matched Class 6–7 premium, insured value, deductible and annual miles. |
| General liability | **Source:** Insureon moving-business median $120/month per policy | Business-policy median; no matching revenue/payroll/exposure allocation to a route or shipment. |
| Workers' compensation | **Source:** Insureon moving-business median $755/month per policy; BLS OEWS provides wages only | No matched state/class payroll premium rate, experience modifier, covered payroll or job allocation. BLS wages are not workers' comp. |
| Employee benefits / payroll taxes / employer burden | **Source:** ATRI truckload company-driver benefits comparator $0.157/truck-mile; BLS OEWS wage estimates | ATRI cohort mismatch; BLS OEWS is wage, not benefit/tax load. **No source** for matched HHG mover burden by occupation/state. |
| Vehicle purchase / lease / equipment payment | **Source:** ATRI truckload peer-group equipment lease-or-purchase median $0.391/truck-mile; ICCT modeled Class 6–7 straight-truck purchase benchmark in existing tire/capital file | ATRI is tractor-trailer payment and not pure depreciation; ICCT is modeled purchase price, not current HHG box-truck transaction. No matched vehicle/body cost + utilization denominator. |
| Depreciation / residual value / financing / cost of capital | **Source:** ICCT price benchmark and ATRI equipment payment comparator only | **No source** for target fleet purchase price, body upfit, residual value, holding period, lifetime miles and financing terms as a matched set. Keep unresolved. |
| Tolls | **Source:** route tolls exist as a cost category in carrier operations; no toll dataset in current model inputs | **No source** for tolls along the 44 routes, truck class, axle/toll class, toll avoidance, and route choice. Do not assume zero. |
| Permits, registration, HVUT, inspections and compliance fees | **Source:** official FMCSA/IRS/state fee schedules can establish individual statutory fees | **No source** assembled for matched truck configuration, states, annual allocation and route share. Do not convert isolated statutory fees to per-mile without utilization. |
| Dispatch, booking, customer service, estimating, sales and administration | **No source** for mover-specific time or cost allocation | No matched overhead accounts, FTE hours, shipment count or route assignment. |
| General corporate overhead, facilities, rent, utilities, software and non-truck equipment | **No source** for matched operator cost structure | ATRI all-in cost is not a transparent HHG overhead breakdown; do not plug a residual percentage. |
| Profit / operating margin | **Source:** ATRI industry operating-cost/profitability context, not a mover-specific target margin | **No source** for an appropriate target margin for this service, market and business model. Profit is not an operating cost; keep separate from cost subtotal. |
| Deadhead / empty repositioning / return leg | **Source:** ATRI 2024 truckload peer group reports 15.18% average deadhead share in the repository comparator | Different freight cohort and network. No matched HHG box-truck empty-mile share by route/market. Existing route mileage is loaded route only; do not apply 15.18%. |
| Driver non-driving paid duty: pre/post trip, fuel stops, paperwork, inspections, waiting, shipper interaction | **Source:** FMCSA HOS definitions/rules; ATRI 2025 on-duty utilization; B24 time review | Context and ceilings/industry utilization, not target-fleet paid duty per move. No matched duty logs. Avoid double counting with route driving hours. |
| Residential loading / unloading labour | **Source:** historical Bellhop cohorts and 2001 FMCSA household-goods task analysis in `b24-moving-labor-time-evidence-2026-11-18.json` | Non-national, old and/or conceptual; no current representative national crew productivity. Current prototype uses explicit scenarios, not evidence. No further crew-hour work in this task. |
| Packing / unpacking labour and materials | **Source:** CPUC tariff has packing/unpacking rate items; 49 CFR recognises related services/accessorials | No matched materials bill, cartons, packing hours or target-fleet rates. Out of prototype scope. |
| Furniture disassembly / reassembly, appliance servicing, special handling | **Source:** CPUC tariff lists separate tariff items; FMCSA requires related services/accessorials to be identified | No matched frequency, task time, material or rate dataset for routes. Customer-specific add-ons, not base line-haul. |
| Stairs, elevators, long carries, hoisting / rigging, shuttle / access constraints | **Source:** 49 CFR §375.401(f) identifies accessorial services such as elevators and long carries; FMCSA describes shuttle need due to road restrictions; CPUC tariff contains specific items | No matched frequency, distance, equipment, labour or rate distribution. Do not bake into generic base price. |
| Storage-in-transit / warehouse handling | **Source:** FMCSA Part 375 covers storage-in-transit and required customer disclosures; CPUC tariff has storage-related items | No matched storage incidence, duration, warehouse cost or handling rates. |
| Extra stops / pickup and delivery legs / interline transfer | **Source:** FMCSA order for service identifies other participating carriers; CPUC tariff includes mixed shipments and separate shipment rules | No matched stop/transfer counts, costs or allocation observations for target network. |
| Claims, loss/damage, cargo loss and deductible exposure | **Source:** FMCSA Part 375 liability/claims rules; ATRI insurance survey definitions exclude some loss categories | **No source** for expected loss cost per target shipment/truck-mile and claim severity/frequency. Keep distinct from premium. |
| Taxes / sales or use taxes / local charges | **Source:** applicable state/local tax statutes and jurisdictional rates exist | **No source** assembled for service-specific taxability by origin/destination and customer invoice. Do not apply a national percentage. |
| Payment processing / financing / credit-card fees / collections | **No source** for target mover merchant fee, payment mix, chargeback and collection cost | No matched operator statements or transaction denominator. |
| Broker / agent / referral commissions | **Source:** tariffs may describe agency/commission rules; no matched project data | **No source** for target mover commission schedule or share of booked jobs. |
| Customer acquisition / advertising / lead cost | **No source** for target mover acquisition spend and attributable completed moves | Not a truck operating cost; do not mix with direct cost per mile absent a business-model scope. |
| Equipment downtime / rental replacement / breakdown recovery | **No source** for matched breakdown frequency, downtime and substitute-truck costs | Not included; needs fleet maintenance/dispatch records. |
| Environmental / emissions fees or carbon cost | **No source** for applicable target fleet fee or project-approved carbon-price policy | Do not invent a carbon surcharge. |
| Minimum charges / exclusive-use / full-vehicle occupancy premium | **Source:** carrier tariffs can define minimum weight, exclusive-use and full-vehicle occupancy conditions; California tariff is one jurisdictional example | No nationwide matched rate schedule or frequency; must be carrier/tariff-specific. |

### 2.1 Avoid double counting

- Do not add ATRI's all-in cost-per-mile to component line items; it overlaps them.
- Do not add ATRI equipment payment to depreciation and financing unless the accounting definitions are reconciled.
- Do not add insurance policy medians to ATRI per-mile premiums.
- Do not add tire lifecycle costs on top of maintenance if the maintenance source includes tires; the current ATRI comparator explicitly reports maintenance excluding tires.
- Do not add BLS benefits/payroll burden to an hourly wage unless the burden is separately sourced and the wage definition is checked.
- Do not add driver on-duty time to driving time where driving is already included in on-duty hours.
- Do not allocate one common line-haul cost twice through both cube-share and weight-share. Select the resource driver for that cost pool and show alternatives as sensitivity only.

## 3. Research decision and next evidence gates

### Accepted as research basis
- Use physical shipment cube and actual shipment weight as separate dimensions.
- Treat the existence of consolidated truck loading as supported by FMCSA guidance, but treat the allocation formula as unresolved.
- For sensitivity only, compare cube-share, weight-share and corresponding mile-weighted drivers.
- Keep CMR as a separate external booked-price reference. CMR's size groups are not used to derive the capacity formula or truck usable cube.
- Keep all excluded components in this register with their source-fit limitations.

### Not accepted
- Bedroom count as a direct cubic-foot measurement.
- VIUS as evidence of household shipment cube or shared-load percentage.
- A universal 7 lb/cu ft density factor derived from California's tariff.
- A claim that FMCSA mandates cube-share or weight-share allocation of costs.
- Applying ATRI freight-truck per-mile figures directly to the Class 6–7 moving truck model.
- Adding a generic overhead/profit percentage to force the subtotal toward CMR.

### Required evidence before a numeric shared-load allocation can be adopted
1. Vehicle-specific usable cargo volume and payload/axle limits for a defined box-truck configuration.
2. Per-shipment measured cube and weight, not bedroom category alone.
3. Carrier load manifests identifying all shipments on each truck and their pickup/delivery sequence.
4. Actual route/segment miles while each shipment is aboard (so shared route exposure can be calculated).
5. Carrier tariff or invoices showing whether the customer is charged by weight, cube, exclusive use, minimums or another basis.
6. Reconciliation showing allocated shares sum to the underlying common cost pool, with no double counting.

No new crew-hour analysis is authorized by this task. No production changes or price changes were made.
