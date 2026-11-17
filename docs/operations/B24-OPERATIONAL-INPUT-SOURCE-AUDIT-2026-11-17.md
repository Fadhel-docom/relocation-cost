# B24 — Operational input source audit and model corrections — 2026-11-17

**Status:** evidence audit only. No numerical operating-cost coefficient is accepted. No production code, formula, coefficient, UI, price, or deployment setting changed.

## 1. What this pass actually closed

This pass moved three source families from "candidate, not checked" to a more precise role:

- EIA has dated weekly on-highway diesel retail series at U.S., PADD, and state levels, suitable for a transparent fuel-price input after matching fuel type, trip date, and route geography.
- GSA publishes downloadable FY per-diem tables by locality/ZIP and date. These are federal employee reimbursement ceilings/allowances, not observed commercial mover hotel or meal costs.
- BLS ECEC publishes employer compensation by broad occupational and industry groups. It can provide a reasonableness context for employer burden, but the available broad categories do not equal household-goods mover crew costs.

The pass also found a regulatory condition that must be fixed in the model design: FMCSA HOS rules cannot be applied as a universal driver-days formula to every truck class without first determining whether the specific operation/vehicle is in scope and whether an exception applies.

## 2. Evidence register additions

| Cost item | Primary source and verified coverage | Permitted role | Not established / status |
|---|---|---|---|
| Diesel fuel price | EIA Weekly Retail On-Highway Diesel, all types; weekly dollars/gallon including taxes; U.S., PADD regions, and state series. The page exposes downloadable history and definitions. | Dated benchmark. For a route, calculate a route-mile-weighted price only if route mileage by PADD/state and trip week are known. Keep diesel separate from gasoline. | Retail pump average is not a mover's negotiated fleet-card price, and does not provide gallons consumed. Fuel price alone is not fuel cost. **Source role accepted; no price snapshot or coefficient accepted.** |
| Lodging and meals | GSA Per Diem Files: FY2026 and FY2027 tables, including ZIP-code workbook; GSA lookup supports locality and travel dates. FY2026 bulletin retained standard CONUS lodging at $110 and standard M&IE at $68, with locality-specific rates. | A dated public planning benchmark / scenario ceiling for a driver overnight, with locality and fiscal year stated. | Federal employee reimbursement policy is not commercial trucker actual spend, motel market price, or mover reimbursement. Do not silently set lodging equal to GSA. **Context/scenario only.** |
| Employer labor burden | BLS ECEC December 2025: private-industry benefits were 29.9% of total compensation overall; Trade, Transportation & Utilities benefits 28.6%. June 2026 ECEC also reports a broad Transportation and Material Moving occupations group at $35.69 total compensation/hour ($24.00 wages + $11.68 benefits; rounded components may not sum exactly). | Broad reasonableness check for whether wage-only labor materially understates employer cost. Use a single internally consistent ECEC series only when the occupation/industry/geography match is documented. | These are broad groups, not household goods moving crews; no direct matched ECEC rate for a mover crew was established. Do not apply 29.9% or 28.6% as a universal multiplier to OEWS wages, nor combine unmatched wage and benefit populations. **Context only.** |
| Occupational wages | BLS May 2025 OEWS national/industry tables. BLS IAG for NAICS 484 (Truck Transportation) reports 2025 median/mean hourly wages: heavy/tractor-trailer drivers $29.00/$29.59; light/delivery drivers $23.01/$23.45; hand laborers/freight movers $22.01/$22.25. | Broad occupational cross-check and starting point for a later matched occupation × geography × industry extraction. | NAICS 484 is truck transportation, not specifically NAICS 48421/484210 household goods moving. These figures are not loaded labor costs and should not be used as mover-specific rates. **Context only.** |

### Source URLs

- EIA weekly diesel series: https://www.eia.gov/dnav/pet/PET_PRI_GND_A_EPD2D_PTE_DPGAL_W.htm
- EIA annual diesel series: https://www.eia.gov/dnav/pet/pet_pri_gnd_a_epd2d_pte_dpgal_a.htm
- GSA per-diem files: https://www.gsa.gov/travel/per-diem-rates/per-diem-files
- GSA FY2026 bulletin: https://www.gsa.gov/policy-regulations/regulations/federal-travel-regulation/ftr-and-related-files/gsa-per-diem-bulletin-ftr-2601
- BLS ECEC June 2026: https://www.bls.gov/web/ecec/ecec-rse.pdf
- BLS ECEC December 2025 release: https://www.bls.gov/news.release/archives/ecec_03202026.htm
- BLS Truck Transportation industry profile / occupational context: https://www.bls.gov/iag/Tgs/iag484.htm
- BLS May 2025 national industry-specific OEWS index: https://www.bls.gov/oes/2025/may/oessrci.htm

## 3. Important model correction: FMCSA HOS is conditional, not a universal mileage clock

FMCSA states that its federal CMV safety rules generally apply to vehicles used in interstate commerce to transport property when the vehicle/combination meets the 10,001 lb GVWR/GVWR/GCWR/GVW threshold (or the applicable passenger/hazardous-material criteria). The HOS driver guide further describes applicability and exceptions. Therefore:

1. Add a vehicle/operation applicability gate before invoking federal HOS.
2. Record GVWR/GCWR, actual/declared operation, interstate-commerce status, and any applicable exception before calculating a regulatory driving schedule.
3. Treat the 11-hour driving / 14-hour window / 10-hour rest structure as a conditional legal constraint, not a universal travel-speed or cost assumption.
4. Do not infer average road speed from HOS limits. Legal maximum driving time does not reveal actual average speed, traffic, route delays, dispatch practice, or driver choice.
5. Intrastate operations may be governed by state-specific rules; do not assume the federal schedule is identical in every context.

Official references:
- FMCSA CMV definition and 10,001 lb threshold: https://www.fmcsa.dot.gov/faq/what-difference-between-a-commercial-motor-vehicle-cmv-and-a-non-cmv
- FMCSA applicability FAQ: https://www.fmcsa.dot.gov/faq/how-do-i-determine-whether-i-am-subject-fmcsas-safety-regulations
- FMCSA Interstate Truck Driver's Guide to HOS: https://www.fmcsa.dot.gov/sites/fmcsa.dot.gov/files/2022-04/FMCSA-HOS-395-DRIVERS-GUIDE-TO-HOS%282022-04-28%29_0.pdf

## 4. Formula architecture refinements required before code

The current experiment skeleton is not yet sufficiently specified to implement safely. Amend the design as follows:

- **Three mileage legs, not one blended deadhead term:** (a) loaded linehaul, (b) empty return to base, and (c) empty repositioning to next pickup. Each leg must carry distance, time, fuel, and cost bearer separately. Include only legs the selected service/operator actually incurs.
- **Two separate clocks:** vehicle occupation time (truck unavailable for another job) and each worker's paid/on-duty time. They are not interchangeable. Loading/unloading may consume crew hours while a truck is stationary; do not count the same interval twice as both a full extra truck-day and a separate idle allocation unless the allocation method explicitly warrants it.
- **Labor by task:** driver time, loading crew time, unloading crew time, waiting/transfer time and overtime must be separate quantities. The crew may overlap with drivers; the staffing model must define this before summing costs.
- **Time-based costs:** allocate truck ownership/insurance/registration by documented truck-days or another measured utilization denominator. Do not infer a per-mile cost by dividing annual fixed cost by arbitrary miles.
- **Fuel:** gallons = sum over actual vehicle legs of (leg miles / compatible fuel economy for that vehicle/load/duty cycle). Fuel spend = gallons × dated fuel price. VIUS fleet MPG may be a contextual distribution only until the raw PUF, definition, and subgroup precision are validated.
- **Mode separation:** dedicated and consolidated are separate operating models. Consolidated pricing requires a sourced utilization/allocation rule plus terminal, handling, and delivery-window costs; VIUS annual LTL mileage share is not a shipment-level utilization factor.
- **Commercial price layer:** operating cost, company overhead allocation, market/seasonal adjustment, and profit/markup must remain separate. No public source reviewed here supports a universal mover margin.

## 5. Source-use decisions

**Can now be used as source-backed inputs after a trip's date/location/fuel type are specified:** EIA fuel-price series.

**Can be used as explicitly labelled scenario/context only:** GSA per-diem rates; BLS broad ECEC; BLS NAICS 484 occupational wage context; FMCSA HOS limits only after applicability is established.

**Still unresolved:** loaded real-world MPG for the target moving truck class; average route speed/time distribution; moving-specific deadhead and repositioning allocation; box-truck non-fuel variable cost per mile; truck ownership/insurance cost per truck-day; crew size and productivity by shipment volume/access; commercial shared-load utilization; route tolls/permits; mover-specific fully loaded labor rates; defensible overhead and profit distributions.

## 6. Download attempt and limits

The official Census directory lists the 2021 VIUS CSV ZIP (3.4 MB), SAS ZIP and Excel dictionary. A direct retrieval attempt of the CSV ZIP in this session failed. This does not mean the dataset is unavailable; it means no local copy was obtained and no raw PUF analysis was performed. The existing VIUS audit remains a field/methodology audit only. Do not report any subgroup estimate until the PUF and dictionary are actually processed and the Census guide's published examples are reproduced.

## 7. Next work sequence

1. Obtain the VIUS CSV and dictionary through a successful download or an owner-provided upload; preserve the original source files and record checksum/retrieval date.
2. Reproduce Census guide national/state estimates and its worked example before the box-truck subset.
3. In parallel only after the VIUS gate: extract BLS OEWS May 2025 occupation × geography data for the current city/route set; keep industry scope visible and do not label broad NAICS 484 values as household-moving wages.
4. Build a route fuel-price method from EIA PADD/state series only after route mileage by region and a trip date are explicit.
5. Leave every unsupported input unresolved; no code until the source register and formula specification are complete.

**Decision:** this pass improves the evidence map and corrects the HOS applicability design. It does not close the core box-truck operating-cost gap and does not justify a numeric total or production change.

## 8. EIA-888 diesel price methodology and route-allocation gate — 2026-11-17

A fresh review of EIA's official weekly on-highway diesel methodology establishes the following:

- EIA-888 collects retail on-highway ULSD prices every Monday, representing the cash self-serve pump price at 8:00 a.m. local time, including taxes. The sample includes truck stops and service stations.
- The current sample is approximately 590 outlets. Prices are estimated as volume-weighted averages using outlet annual sales volumes; the eight primary non-overlapping publication cells are New England (PADD 1A), Central Atlantic (1B), Lower Atlantic (1C), Midwest (2), Gulf Coast (3), Rocky Mountain (4), West Coast excluding California, and California. PADD 1 and PADD 5 aggregates are secondary cells and must not be double-counted with their subregions.
- Alaska and Hawaii are outside the diesel survey target population. The EIA diesel geography is not a 50-state diesel-price table; California is the only separately published state-level diesel price.
- EIA publishes standard errors with the weekly estimates and flags estimates with coefficient of variation above 5%. The source register should retain the relevant standard error/CV where available, not just the price.
- The price is a retail benchmark, not a mover's negotiated fleet price. It is appropriate as a dated external price reference, not a direct record of what a specific operator paid.

### Candidate route-weighted retail benchmark (not yet accepted as fuel spend)

If a route polyline can be intersected with the eight primary EIA price geographies, define distance share for region r as d_r / Σd_r and compute P_route = Σ[(d_r / Σd_r) × P_r,w], where P_r,w is the EIA price for region r and the relevant survey week. Use only non-overlapping primary cells; never combine a PADD aggregate with its subregions. Record the route-week alignment and price CV.

This is a mileage-weighted retail-price proxy, not a measured fuel-purchase basket. A more realistic purchase-weighted estimate would require refueling locations/quantities or a validated refueling model. Also, the project's current state-pair distance totals do not encode the actual route polyline or miles by PADD subregion; the route allocation cannot be reconstructed from origin/destination states alone. A route geometry or separately sourced segment allocation is a prerequisite.

Fuel spend remains: gallons consumed × dated route price. Gallons still require vehicle-class- and load/duty-cycle-compatible fuel economy, which is unresolved. Therefore this methodology does not yet produce a valid fuel-cost coefficient or total.

Official sources:
- EIA weekly diesel price methodology: https://www.eia.gov/petroleum/gasdiesel/diesel_proc-methods.php
- EIA weekly diesel series: https://www.eia.gov/dnav/pet/PET_PRI_GND_A_EPD2D_PTE_DPGAL_W.htm
- EIA gasoline/diesel update and release dates: https://www.eia.gov/petroleum/data.php?tid=petroleum-and-other-liquids-products-prices-and-supply-data
- EIA detailed price/standard-error report linked from the weekly series.

**Decision:** EIA is a qualified dated retail-price source once route geography and trip week are known. It does not close the fuel-economy gap, does not support a universal fuel-price constant, and does not justify fuel dollars before route mileage allocation and compatible MPG are established.