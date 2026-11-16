# Independent Bottom-Up Moving Cost Model — Experiment

**Status:** design/validation experiment only — not production  
**Started:** 2026-11-16  
**Owner direction:** build an independent model that explains its arithmetic; preserve the live calculator unchanged.

## 1. Purpose and user value

Test whether Relocation Cost can estimate a household move from transparent operating-cost components rather than relying on moving-company quotes as the model's pricing engine. A visitor should be able to inspect each component, its unit, source, date, assumption and contribution to the total.

This is a hypothesis, not a claim that a bottom-up model is automatically more accurate. Public operating data can be incomplete, and actual household moves include market constraints that a cost model may not capture.

## 2. Explicit boundary

- Experimental namespace and data only; no imports into the production calculator.
- Do not edit `src/lib/calculator.js`, `data/coefficients.json`, current production coefficients, or published estimates as part of this experiment.
- Do not infer or insert universal USD/kg/mile rates.
- No default numerical inputs unless a cited source supports the exact vehicle class, geography, period and cost definition.
- Keep provider quote ranges as an external validation comparator, not as inputs used to tune the experimental model.
- No publication or visitor-facing claims until the validation gates below pass.

## 3. Proposed calculation structure

First calculate the number of vehicle loads required from **both** volume and weight:

`loads = max(ceil(shipmentVolume / usableVehicleVolume), ceil(shipmentWeight / usablePayload))`

Then calculate the operational cost for each load:

`vehicleCost = dispatchCost + (loadedMiles + deadheadMiles) * (fuelPrice / fuelEconomy + nonFuelOperatingCostPerMile)`

`laborCost = crewSize * (loadingHours + unloadingHours) * fullyLoadedHourlyLaborCost`

`estimatedOperatingCost = loads * vehicleCost + laborCost + separately itemized extras`

This is a model skeleton, not a calibrated formula. The exact treatment of return journeys, repositioning, multiple drivers, overnight stops, tolls, permits, taxes, insurance, equipment, packing materials, storage and stairs must be specified and sourced before implementation. Avoid double-counting any cost included in a source's per-mile rate.

### Required input groups

| Group | Required fields | Notes |
|---|---|---|
| Shipment | cubic feet, pounds | Both constrain vehicle capacity; bedroom count alone is not a physical load measure. |
| Vehicle class | usable cubic feet, legal payload, fuel economy, dispatch/fixed cost | Separate small/medium/large classes only where specifications are verifiable. |
| Route | loaded miles, deadhead miles or explicit deadhead rule | State whether distance is one-way, loaded, return or repositioning. |
| Fuel | fuel type, dated regional/national price | Price and fuel economy must use compatible units and periods. |
| Vehicle operations | non-fuel cost per mile and included cost categories | Source-backed by vehicle class; do not transplant tractor-trailer averages to box trucks. |
| Labor | crew size, paid hours, fully-loaded hourly cost | Separate wage from employer burden; account for load and unload work. |
| Extras | item, quantity, unit cost, source | Keep optional and visible; no hidden blanket multiplier. |

If an essential parameter is unknown, return a visible missing-input/low-confidence state rather than silently filling it with an invented constant.

## 4. Source strategy

Prefer primary/public sources and record exact table, geography, period, unit, vehicle class, definition and retrieval date.

Candidate anchors already identified for investigation (not yet accepted as model coefficients):

- ATRI, *An Analysis of the Operational Costs of Trucking* (2026 release; 2025 for-hire tractor-trailer operating-cost average). This is a heavy combination-truck benchmark only, not a box-truck or household-moving rate. https://truckingresearch.org/
- U.S. Energy Information Administration, weekly on-highway diesel prices and methodology. Use the regional series matching the modeled route and the fuel type/period. https://www.eia.gov/petroleum/gasdiesel/
- U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics, May 2025: freight/material movers and relevant truck-driver occupations. Wage is not the same as fully-loaded employer labor cost. https://www.bls.gov/oes/
- Vehicle manufacturer specifications and government vehicle/fuel-economy sources for payload, usable volume and fuel economy. Each vehicle class needs a defensible representative specification; do not mix maximum advertised payload with a different vehicle's cargo volume.

A source register must store: `id`, `publisher`, `title`, `url`, `publishedAt`, `dataPeriod`, `retrievedAt`, `geography`, `vehicleClass`, `unit`, `definition`, `sampleSize` (when applicable), `limitations`, and the exact parameter(s) it supports.

## 5. Validation design

1. **Parameter audit:** no numeric parameter enters the model without a source and matching definition. Distinguish observed data, derived values and assumptions.
2. **Unit tests:** zero/invalid inputs, boundary capacities, weight-limited versus volume-limited loads, multiple loads, fuel conversion, labor arithmetic, deadhead handling and no double counting.
3. **Sensitivity:** show how results move when fuel price, fuel economy, utilization, labor hours and deadhead assumptions change. Identify dominant assumptions.
4. **Holdout routes:** choose routes not used to select parameters. Keep route, date, vehicle class and service scope explicit.
5. **External checks:** compare against independently published booked-move/quote ranges only after the model is frozen for that test. Do not use a comparator to calibrate and then call the same rows validation.
6. **Error reporting:** report absolute and percentage error, median error, direction of bias, coverage inside comparator ranges, and sample count per comparable cell. Do not hide misses by averaging unlike categories.
7. **User comprehension:** test whether a visitor can understand why a total changed when distance, load, truck class or crew hours changed.

## 6. Decision gates

- **Gate A — source sufficiency:** all material cost components have compatible, current sources or are explicitly disclosed assumptions.
- **Gate B — computational integrity:** tests pass and units/capacity constraints are correct.
- **Gate C — external validity:** holdout comparisons show acceptable, documented error across multiple sizes and distance bands; thresholds must be defined before viewing final results.
- **Gate D — product value:** explanation is understandable and meaningfully better for planning than a single opaque number.

Failure at any gate means revise or stop the experiment. Passing does not automatically authorize replacing the production model; that requires a separate decision and controlled integration PR.

## 7. First implementation unit

Build a pure experimental calculation module with an explicit parameter object and a test suite. Keep all source values in a separate experimental data file with provenance. The function must refuse to calculate if required inputs or provenance are missing. No UI or production integration in this first unit.

## 8. Current evidence and limitations

- ATRI's published tractor-trailer average is useful context but not a moving-truck rate.
- EIA fuel series can support dated fuel-price inputs, but not whole-vehicle operating cost.
- BLS wage tables can support wage benchmarks, but not a complete loaded labor rate without a sourced employer-cost factor.
- No accepted small/medium/large moving-truck cost matrix has been assembled yet.
- Therefore this document defines the experiment; it does not claim a working or validated estimator.

## 9. Initial source scan — 2026-11-16

The first source pass confirms that **capacity data is easier to obtain than independent operating-cost data**. This distinction matters: do not mistake published rental-fleet specifications for a cost-per-mile dataset.

| Source | What it provides | Permitted use in this experiment | What it does not establish |
|---|---|---|---|
| [Enterprise Truck Rental — Truck Comparison Guide](https://www.enterprisetrucks.com/truckrental/en_US/vehicles/commercial-truck-comparison-guide.html) | Approximate 16-ft, 24-ft and 26-ft box truck cargo volumes (960/1,500/1,800 ft³), payload ceilings (7,500/10,000/10,000 lb) and GVWR; warns specs vary by make/model/year. | Cross-check ranges for vehicle/body capacity only. | A universal payload or volume for every vehicle; fuel economy; purchase, maintenance, insurance or per-mile operating cost. It is a rental fleet source, not an independent national fleet census. |
| [U-Haul — Moving Truck Sizes](https://www.uhaul.com/Truck-Rentals/Moving-Truck-Sizes/) | Published cargo volumes, max load and “up to” MPG for its truck classes; expressly says MPG is estimated for ideal conditions and varies with load, grade, weather and speed. | Secondary cross-check only; never combine its best-case MPG with another fleet's payload/volume as if they describe one vehicle. | Real-world loaded MPG or neutral vehicle-class averages. U-Haul is a rental provider, so these values are not the primary independent source for the model. |
| [Isuzu — N-Series Gas specifications](https://www.isuzucv.com/en/nseries/nseries_gas_specifications) and [Diesel specifications](https://isuzucv.com/en/nseries/nseries_diesel_specifications) | OEM chassis class, GVWR and body-payload ranges for Class 3–5 configurations. | Establish a chassis-level payload envelope and verify class boundaries. | Completed box-body cargo volume, actual completed-vehicle payload after liftgate/body fit-out, or real-world MPG. The body builder configuration changes usable payload. |
| [ATRI — 2026 operational-cost report release](https://truckingresearch.org/2026/07/new-atri-report-details-accelerating-costs-and-low-profitability-despite-cuts/) | 2025 for-hire trucking average $2.336/mile; $1.854/mile excluding fuel. | Context/sanity check for large commercial trucking only; keep it separate from straight-truck estimates. | A Class 3–6 box-truck cost curve or a household-move tariff. Do not assign this average to a moving truck. |
| [BLS — Employer Costs for Employee Compensation](https://www.bls.gov/charts/employer-costs-for-employee-compensation/costs-by-occupational-group.htm) | Employer wages and benefit components by broad occupational group; latest chart includes production, transportation and material-moving workers. | Cross-check a fully-loaded labor assumption after matching the correct occupation and geography. | A mover crew's exact loaded hourly cost, productivity, crew size or paid hours per move. |

### Findings and unresolved gaps

1. A three-class vehicle model cannot safely be populated by “small/medium/large” labels alone. Each experimental vehicle record needs a specific chassis/body configuration, usable volume, completed-vehicle payload and source/version.
2. Manufacturer chassis payload is not the same as cargo payload after a box body, liftgate, fuel and equipment are installed. Prefer completed-vehicle payload or subtract documented body/equipment weights; otherwise mark it unknown.
3. The reviewed OEM/rental specification pages do not provide a neutral, comparable real-world loaded MPG series for the required box-truck classes. “Up to” rental MPG is not acceptable as a calibrated input.
4. ATRI's tractor-trailer average must not be used as the non-fuel per-mile cost of a Class 4/5 box truck. The vehicle class and operating context differ.
5. BLS ECEC is a stronger route to a wage-plus-benefits benchmark than applying an arbitrary burden multiplier to an occupational wage, but the occupational group and geography still need to match the modeled crew.

**Decision:** accept none of these as final numerical operating-cost coefficients. Accept only the source roles above. The next research unit is to find a public, class-specific medium-duty/straight-truck operating-cost or fuel-consumption dataset; if unavailable, preserve an explicit missing-input state rather than fabricate a per-mile rate.


## 10. High-value public dataset found — 2021 VIUS PUF (2026-11-16)

A stronger route than rental-fleet MPG has been identified: the U.S. Census Bureau's 2021 Vehicle Inventory and Use Survey (VIUS) Public Use File, produced with BTS/FHWA/DOE. Official landing page: https://www.census.gov/data/datasets/2021/econ/vius/2021-vius-puf.html. BTS overview: https://www.bts.gov/vius. PUF user guide: https://www2.census.gov/programs-surveys/vius/datasets/2021/vius_2021_puf_user_guide.pdf.

**What is verified from the official documentation:**

- The PUF contains 67,952 in-scope vehicle records and 168 variables. It includes vehicle records for the 2021 VIUS; the survey was conducted February–October 2022. The survey population covers private and commercial trucks in the 50 states and DC, but New Hampshire registration addresses are absent from this PUF.
- VIUS includes straight trucks and truck tractors, and collects vehicle weight/class, body type, fuel economy, vehicle miles, and other operating characteristics. The PUF guide specifically documents integer MPG values, annual miles (MILESANNL), gross vehicle weight rating class (GVWR_CLASS), and the PUF-only loaded-mile percentage (LOADEDPCT).
- The PUF is not raw unweighted ground truth: Census applied disclosure protections. The guide says noise was applied to MILESANNL and TABWEIGHT, weights were rounded, some categories were coarsened, and records with low weights may have categorical values swapped. The guide explains how to create estimates and sampling-variability measures. Read the methodology and user guide before computing any class/body estimates.

**Permitted next use:** investigate whether the PUF can produce defensible weighted fuel-economy distributions for straight-truck body types crossed with GVWR classes relevant to moving trucks. Report unweighted record count, weighted population estimate, effective sample size/variance where the prescribed method supports it, missingness, and category definitions. Separate straight trucks from tractor-trailers; exclude unsuitable body types; check whether MPG represents the vehicle's reported use rather than a moving-truck loaded long-haul duty cycle. LOADEDPCT may help characterize use but does not by itself provide loaded-only MPG.

**Limits:** 2021 is the latest VIUS survey release identified here; it is not a 2026 current fleet measurement. The PUF's noise, rounding, coarsening, sample design, and 2021 conditions limit precision. Do not present a small class/body subgroup as nationally representative without checking variance and disclosure rules. Do not turn an average MPG into a full operating-cost-per-mile figure: maintenance, insurance, depreciation/financing, tires, permits, and driver/crew costs remain separate inputs.

**Research decision:** VIUS is now the priority candidate for fuel-economy evidence, not yet an accepted coefficient. The next task is to inspect the downloadable dictionary and PUF fields, reproduce the official published totals as a validation check, then calculate only sufficiently supported straight-truck class/body subsets. If precision or subgroup sample size is inadequate, use it as contextual evidence only and keep the parameter unresolved.

### Related current source roles

- DOE's 2024 summary reports 2021 on-road fuel economy by truck body type and points to the VIUS source data; it is a useful cross-check, not a replacement for the microdata analysis: https://www.energy.gov/cmei/vehicles/articles/fotw-1342-may-13-2024-average-road-fuel-economy-mediumheavy-trucks-ranged-40.
- BLS ECEC's June 2026 chart reports $24.99 wages plus benefit components for the broad “production, transportation, and material moving” group. This is a current broad labor-cost reference, not a mover-specific hourly rate or a substitute for local occupation matching: https://www.bls.gov/charts/employer-costs-for-employee-compensation/costs-by-occupational-group.htm.
- ATRI's $2.336/mile 2025 average remains a combination-truck benchmark only; it is not suitable as the non-fuel cost of a moving box truck.
