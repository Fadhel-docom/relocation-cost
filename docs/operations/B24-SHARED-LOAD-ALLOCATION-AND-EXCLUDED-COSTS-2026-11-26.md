# B24/B15 — Shared-load allocation and excluded-cost register
**Date:** 2026-11-26 | **Status:** research only. No production use or pricing/coefficient changes.

## 1. Shared-load / truck-capacity allocation

### Finding
The PR #302 prototype charges each shipment as though it has a dedicated truck: full route fuel and the driver road-time proxy are repeated for every shipment size. Claude's review identified this as a structural flaw, especially for smaller shipments.

Credible evidence supports that household-goods shipments can share a vehicle and that both shipment weight and shipment volume/space are recognized pricing bases. However, **no source located in this review establishes a universal formula for allocating a shared truck's total route costs among household shipments by bedroom count, cubic feet, weight, or a blended ratio.** The existence of shared carriage is sourced; the allocation coefficient is not.

### Source-backed facts
1. **Shared carriage exists.** FMCSA's Subpart E weighing guidance says the truck may already be partially loaded with other shipment(s) when the driver's tare weight is taken. The customer's shipment net weight can still be isolated by the certified scale method. This directly establishes multi-shipment carriage, but does not explain how fuel, driver wages, tolls or capital costs are split between customers.
   Source: FMCSA, [Pickup of My Shipment of Household Goods (Subpart E)](https://www.fmcsa.dot.gov/protect-your-move/how-to/subpartE).

2. **Volume can be a transportation pricing basis.** The 2003 Federal Register consumer-protection rule discussion recognizes household-goods transportation priced by shipment volume (e.g. cubic yards/meters), discusses estimating cubic space and space reservation, and separately explains weight-based shipments.
   Source: [Federal Register, 68 FR 35091 (June 11, 2003)](https://www.govinfo.gov/content/pkg/FR-2003-06-11/pdf/03-14439.pdf).

3. **Vehicle cube is a recognized capacity measure, but the 7 lb/cu ft figure is narrow.** Georgia Rule 570-38-3 requires household-goods vehicles to display available cubic-foot storage capacity. It permits a constructive weight of 7 lb per cubic foot in specified circumstances where one shipment fills the vehicle/prevents other customers' goods, or where exclusive-use capacity is ordered. This is a tariff/constructive-weight rule, not a general shared-load allocation formula and not a national rule.
   Source: Georgia Secretary of State, [Rule 570-38-3 Household Goods Carriers](https://rules.sos.ga.gov/gac/570-38-3).

4. **Tariff and service details matter.** FMCSA says written estimates must include transportation, accessorial and advance charges; final charges follow the carrier's tariff and services. Volume-to-weight conversion, where used, requires an explained formula under federal regulations.
   Sources: FMCSA [Estimating Charges (Subpart D)](https://www.fmcsa.dot.gov/protect-your-move/how-to/subpartD); [General Requirements (Subpart A)](https://www.fmcsa.dot.gov/protect-your-move/how-to/subpartA); [49 CFR Part 375](https://www.govinfo.gov/content/pkg/CFR-2025-title49-vol5/xhtml/CFR-2025-title49-vol5-part375.html).

### Research design — no formula authorized
Do not allocate by bedroom count. Bedroom count is not measured cargo capacity.

For a future empirical model, collect shipment-level measured cube (ft³/m³), certified weight (lb), actual vehicle usable cube and legal payload, load-plan/floor-space constraints, and route-leg costs plus the list of shipments carried on each leg.

Distinguish:
- **Cube-constrained leg:** volume/space is the scarce capacity.
- **Weight-constrained leg:** payload is the scarce capacity.
- **Mixed or geometry-constrained leg:** actual load plan and placement/axle constraints are needed; neither volume nor weight alone is sufficient.

A candidate analytical basis is each shipment's observed share of the binding capacity on each leg, but this is a research design only. Do not use max(volume share, weight share), a blended average, or any fixed percentage until it is validated against actual load manifests and reconciles the shared cost pool to 100% without double counting. Allocate leg costs only among shipments actually on that leg; separately assign customer-specific pickup/delivery services; explicitly handle empty/reposition legs.

**Decision:** shared-load allocation is a valid next research direction, but its numerical basis remains **not sourced**. The Georgia 7 lb/cu ft rule cannot be used as a shared-load allocation coefficient.

## 2. Excluded-cost register

"Source exists" below means a source establishes the category or service, not that a usable Relocation Cost rate/coefficient is available.

| Excluded component | Source status and limitation |
|---|---|
| Truck/trailer maintenance and repairs | **Source exists; project rate unavailable.** VIUS 2021 reports broad annual maintenance/repair bands for business-related box trucks, not per-mile exact costs. ATRI reports per-mile values for for-hire combination trucks, not household-moving box trucks. See repository VIUS extraction note and ATRI 2025 report. |
| Tires (purchase, retread, replacement, maintenance) | **Source exists; matched box-truck rate unavailable.** ATRI tracks tires for combination-truck fleets. No matched moving-box-truck tire life plus installed-cost dataset found. |
| Truck insurance (liability, physical damage, cargo) | **Source exists; matched premium denominator unavailable.** ATRI tracks truck insurance premiums for combination trucks. No mover/box-truck premium linked to vehicle-year or annual miles found. |
| Truck/trailer lease or purchase | **Source exists; box-truck coefficient unavailable.** ATRI tracks lease/purchase payments per mile for for-hire fleets; population mismatch. |
| Depreciation / residual value / capital lifecycle | **No project-fit source.** ATRI payment costs are not depreciation. No matched moving-box-truck age, useful-life, resale value and annual-mile dataset established. |
| Tolls | **Source exists as an operating-cost category; route-specific toll costs unavailable.** ATRI tracks tolls; MoDOT lists tolls among possible move charges. No route/vehicle-class toll path calculation integrated. |
| Permits and licenses | **Source exists as a fleet-cost category; route-specific amount unavailable.** ATRI tracks permits/licenses. No project-specific box-truck interstate permit/registration/CDL cost allocator found. |
| Driver benefits / employer payroll burden | **Source exists as a category; matched rate unavailable.** ATRI separates driver benefits from wages. No matched employer tax, workers' compensation, paid leave and benefit burden for this moving-driver cohort established. |
| Driver non-driving paid duty (pre/post-trip, fueling, waiting, loading standby, breaks, layover) | **No per-move source.** ATRI has broad utilization/dwell metrics, not a matched per-shipment paid-duty dataset. Provider route duration is not total paid duty or HOS schedule time. |
| Deadhead / repositioning / return trip | **Partial source; shipment allocation unsupported.** VIUS has national box-truck deadhead/reposition variables, but the documentation warns of high non-sampling error; not mover-specific and not a shipment-level multiplier. |
| Dispatch, scheduling, customer service, back-office/admin overhead | **No project-fit per-move source.** ATRI's cost categories do not provide a household-mover back-office allocator; industry reporting notes its study does not attempt broader back-office overhead. |
| General corporate overhead / facilities | **No project-fit source.** No matched household-goods mover cost-accounting dataset or auditable per-move allocation found. |
| Profit / operating margin | **No project-specific source.** Profit is a commercial outcome; no representative margin dataset matched to this service and shipment cohort established. |
| Packing labour and materials | **Source exists as service category; rate unavailable.** FMCSA identifies packing as accessorial; Columbia's moving guide lists packing labour/materials. No per-box material bill or matched labour rate found. |
| Unpacking | **Source exists; rate unavailable.** FMCSA Subpart A identifies unpacking as accessorial. No project tariff/rate. |
| Appliance servicing / disconnect-reconnect | **Source exists; rate unavailable.** FMCSA Subpart A identifies appliance servicing and third-party appliance service. |
| Special handling (pianos, antiques, art, safes, bulky/fragile items) | **Source exists; rate unavailable.** FMCSA accessorial definitions and MoDOT moving-cost guide identify special/bulky services. |
| Stairs / elevator / flight carry | **Source exists; rate unavailable.** FMCSA Subpart D and MoDOT list these accessorials; no matched per-flight/per-floor tariff dataset. |
| Long carry | **Source exists; rate unavailable.** FMCSA glossary and MoDOT list long-carry charges; no project-specific distance threshold/tariff. |
| Shuttle / auxiliary vehicle | **Source exists; rate unavailable.** FMCSA defines auxiliary shuttle service when normal road-haul equipment cannot access pickup/delivery and a smaller vehicle is needed. |
| Storage-in-transit / warehouse storage | **Source exists; rate unavailable.** FMCSA Subpart A and MoDOT identify storage costs; no matched duration/rate dataset. |
| Warehouse handling | **Source exists; rate unavailable.** FMCSA glossary defines placement/removal handling during storage-in-transit; no project tariff rate. |
| Pickup/delivery accessorial or extra pickup/drop | **Source exists; rate unavailable.** FMCSA glossary identifies pickup/delivery charges; no project tariff rate. |
| Third-party / advanced charges | **Source exists; rate unavailable.** FMCSA Subpart A defines third-party services paid by the mover and passed through to the customer. |
| Valuation / full-value protection charge | **Source exists; rate unavailable.** FMCSA Subpart A defines valuation as a charge for greater liability assumed by the mover; no mover tariff/coverage quote dataset. |
| Parking permits / access restrictions / impracticable operations | **Source exists; rate unavailable.** FMCSA Subpart D notes parking permits and impracticable operations; exact charge depends on carrier tariff and circumstances. |
| Peak-season rates / expedited or guaranteed service | **Source exists; rate unavailable.** FMCSA glossary defines peak-season rates; no date-specific mover tariff dataset. |
| Minimum shipment weight / minimum charge | **Source exists as common practice; actual tariff unavailable.** FMCSA Subpart E says most movers have a minimum weight charge, generally at least 3,000 lb. This is not universal and must not become a project constant. |
| Fuel surcharge | **No project-fit surcharge source.** EIA diesel price is an underlying fuel input, not a mover surcharge formula or evidence whether surcharge is already embedded in tariff. |
| Taxes on moving services | **No project-specific source.** Taxability varies by jurisdiction/service; no route-specific state/local treatment matrix researched. |
| Payment processing / financing fees | **No project-fit source.** FMCSA lists accepted payment forms but does not establish carrier processing costs; no mover tariff/payment dataset. |
| Claims administration / damage-loss reserve | **No project-fit cost allocator.** FMCSA describes valuation and claims rights, but no matched claims frequency/severity or per-shipment reserve data found. |
| Broker/agent commission or referral share | **No project-fit source.** FMCSA distinguishes brokers, movers and agents, but no representative commission/revenue-share dataset for this service was sourced. |

### Register references
- FMCSA [General Requirements (Subpart A)](https://www.fmcsa.dot.gov/protect-your-move/how-to/subpartA), [Estimating Charges (Subpart D)](https://www.fmcsa.dot.gov/protect-your-move/how-to/subpartD), [Pickup of My Shipment (Subpart E)](https://www.fmcsa.dot.gov/protect-your-move/how-to/subpartE), and [Glossary](https://www.fmcsa.dot.gov/protect-your-move/how-to/glossary).
- Missouri DOT, [Determining the Cost for Retaining a Moving Company](https://www.modot.org/sites/default/files/documents/hhg%20-%20Determining%20the%20Cost_0.pdf).
- North Carolina Utilities Commission, [Moving 101](https://www.ncuc.gov/industries/transportation/movingguide.html).
- Columbia University, [Moving Guide (May 2025)](https://worklife.columbia.edu/sites/worklife.columbia.edu/files/content/Moving%20Guide-May-2025.pdf).
- Canadian Association of Movers, [The Moving Process: What to Expect](https://www.mover.net/sites/default/files/2021-06/HelpSheet_WhatToExpectWhenYouMove.pdf) — supplemental checklist, not U.S. tariff authority.
- ATRI, [2026 Operational Costs of Trucking release (July 15, 2026)](https://truckingresearch.org/2026/07/new-atri-report-details-accelerating-costs-and-low-profitability-despite-cuts/) and [2025 Operational Costs of Trucking](https://www.truckingresearch.org/2025/07/2025-operational-costs-of-trucking/) — cost-category evidence, combination-truck population only.
- Existing repository note: docs/operations/B24-VIUS-WEIGHTED-EXTRACTION-2026-11-18.md.

## 3. Gate / next step
- Shared carriage: sourced.
- Shipment capacity dimensions (weight and volume): sourced.
- Universal shared-load allocation formula / numeric coefficient: **not sourced**.
- Every excluded component above is explicitly classified; a sourced category is not a sourced project rate.
- Next evidence needed: anonymized mover load manifests with shipment cube/weight, vehicle capacity and leg costs, or published carrier tariffs with explicit space/weight rules and worked shipment examples.
- No more crew-hour work, production changes, formula/price/coefficient changes, route-data changes, network/API calls, or deployment.
