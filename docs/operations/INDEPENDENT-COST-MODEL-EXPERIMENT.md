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
