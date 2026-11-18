# Independent truck operating-cost model — research note (2026-11-16)

## Objective

Replace repeated browsing of mover quote pages with a transparent, bottom-up model that estimates:
1. operating cost per mile for small, medium and large box-truck classes;
2. the implied transport cost per shipment and per pound-mile (with kg-km conversion);
3. handling and full-service components separately.

The model must use public operational, fuel and wage data as inputs. Mover-published prices may be retained only as clearly labelled external validation/holdout evidence, never blended into the model coefficients. No production price or coefficient is changed by this research note.

## Strongest independent source found: 2021 Vehicle Inventory and Use Survey (VIUS)

BTS describes VIUS as the principal national source on physical and operational characteristics of U.S. trucks. The 2021 survey covered a sample of 150,000 owners of Class 1–8 trucks; Census conducted it with BTS, FHWA and DOE support. It collected fuel economy, annual miles, maintenance and repair costs, vehicle/body type, weight, commercial use, load use and other operating characteristics.

Crucially, the public-use data dictionary includes fields that map directly to the proposed model:

| Field | Meaning / intended use |
|---|---|
| `BTYPE` | Body type; code `07` is Box truck |
| `GVWR_CLASS` | Vehicle weight class; codes 3–8 cover 10,001 lb and above |
| `BUSRELATED` | Whether the vehicle is used at least partly for business |
| `FUELTYPE` | Diesel, gasoline and other fuel types |
| `MPG` | Miles per gallon |
| `MILESANNL` | Annual miles driven |
| `GM_COST`, `ER_COST` | General maintenance and extensive-repair cost bands |
| `LOADEDPCT` | Share of annual mileage while loaded |
| `DEADHEADPCT`, `REPOSITIONPCT` | Empty return and empty repositioning mileage shares |
| `TRUCKLOADPCT`, `LTRUCKLOADPCT` | Truckload and less-than-truckload mileage shares |
| `TABWEIGHT` | Survey tabulation weight |

This is a much better foundation than guessing a universal cents-per-mile rate from bedroom count or copying a mover's quote table. The PUF also applies disclosure protections (including noise, topcoding, swapping and coarsening); its cost bands are not exact invoices. The extraction must therefore use the survey weights, report sample counts and distributions, and avoid publishing sparse or unstable cells.

**Weighted extraction completed 2026-11-18.** The reproducible script and results are in `tools/b24-vius-box-truck-extract.py` and `docs/operations/B24-VIUS-WEIGHTED-EXTRACTION-2026-11-18.md`. It filters `BTYPE=07` and `BUSRELATED=1`, then reports weighted MPG, annual mileage, loaded/deadhead/reposition shares, variable-level valid counts, maintenance/repair category distributions and random-group CVs by GVWR and fuel. The focus diesel sample (GVWR 6–7) contains 1,556 PUF records and represents about 317,285 vehicles; weighted MPG is 9.10 (CV 1.5%), annual mileage 25,011 (CV 3.9%), and loaded share 74.6% (CV 1.0%). Maintenance and repair remain interval-censored annual bands, not exact per-mile costs. No price or production coefficient is asserted.

## Other independent inputs

- **Fuel:** EIA publishes weekly on-highway diesel and gasoline prices for the U.S., PADD regions and selected states. For each route, use the latest available regional price weighted by the route's mileage in each region; do not hard-code one national fuel price.
- **Driver wages:** BLS May 2025 median annual wages are $58,640 for heavy/tractor-trailer drivers and $44,860 for light-truck drivers. Use local/state/metro wage data where available; these are occupational wage proxies, not mover rates.
- **Loading/unloading labor:** BLS reports $38,220 May 2025 median annual pay for the broader hand-laborer/material-mover group. Treat this as a proxy and use local wages where available; it is not a direct residential-mover wage.
- **Heavy-truck cross-check only:** ATRI's 2026 report says the 2025 average Class 8 trucking operating cost was $2.336/mile, $1.854 excluding fuel. This is a useful sanity check for heavy for-hire trucking cost structure, not a coefficient for a 16–26 ft moving box truck.
- **Government fleet comparison:** GSA's FY2026 bulletin lists a cargo-van mileage rate, but does not provide a directly comparable box-truck class rate in the reviewed table. Do not substitute the cargo-van rate for a box truck.

## Proposed model structure

Keep the calculation decomposed so each component has its own source, unit, update date and uncertainty:

```text
fuel_cost_per_total_mile
  = route_weighted_fuel_price_per_gallon / weighted_VIUS_MPG

maintenance_repair_per_mile
  = weighted_annual_maintenance_and_repair_cost / weighted_annual_miles

vehicle_cost_per_total_mile
  = fuel + maintenance/repairs + tires + insurance + capital/depreciation + permits

loaded_vehicle_cost_per_mile
  = vehicle_cost_per_total_mile / loaded_mileage_share

driver_cost
  = route_driving_hours × local_driver_compensation

handling_cost
  = crew_count × (load_hours + unload_hours) × local_material_mover_compensation

transport_cost
  = loaded_vehicle_cost_per_mile × route_miles × shipment_allocation

full_service_operating_cost
  = transport + driver/handling + packing/materials + tolls/access/storage
```

Important implementation details:

1. **Truck class first.** Derive small/medium/large bands from observed box-truck records (`BTYPE=07`) and GVWR classes, not from arbitrary truck-length labels. Verify the actual mapping against vehicle specifications before showing consumer-facing labels.
2. **Weight and volume both matter.** A household shipment can fill the box before reaching the legal payload, or reach payload before filling the box. Select/allocate the truck using the binding constraint: `max(weight share, volume share)`. Bedroom count remains only a quick default; an optional inventory/volume refinement can improve it.
3. **Dedicated vs shared load.** A dedicated truck generally incurs the full trip cost even when partly empty. A shared-load estimate can allocate cost by the larger of weight share and volume share, subject to a minimum dispatch floor. Never assume price scales linearly with pounds alone.
4. **Empty miles.** Use VIUS loaded, deadhead and reposition mileage shares. Avoid adding a second return-mile factor if the loaded-share adjustment already includes it.
5. **Per-pound-mile is derived, not universal.** For a full/known effective payload:
   `USD per lb-mile = loaded truck cost per mile / effective payload in lb`.
   Convert to `USD per kg-km` by multiplying the lb-mile rate by `2.20462 × 0.621371`. For partial loads, the shipment's volume share and minimum trip cost can dominate; the unit rate must change with utilization.
6. **Separate operating cost from selling price.** Fuel, maintenance, wages and handling can form a source-backed operating-cost estimate. Insurance, capital/depreciation, dispatch overhead, profit and service-specific accessorials need separate evidence or an explicit sensitivity range. Do not silently add an invented mover margin or call the result a quote.

## Validation and release gates

Before any production coefficient changes:

- [x] Extract VIUS weighted distributions for business-related box trucks by GVWR class and fuel type; report PUF counts, weighted vehicle estimates, variable-specific valid counts and random-group CVs. See `B24-VIUS-WEIGHTED-EXTRACTION-2026-11-18.md`.
- [x] Calculate weighted MPG, annual mileage, loaded share, deadhead and reposition distributions. Maintenance/repair bands are extracted as weighted category distributions, but a per-mile estimate is not yet justified: the bands are conditional, coarsened and include not-reported records. Do not assign midpoints as if observed.
- Update 2021 cost components with appropriate official price indexes; refresh fuel with current EIA regional data and labor with current BLS area wages.
- Find independent sources for the still-missing box-truck tire, insurance and capital/depreciation components, or keep them as a separately labelled uncertainty band.
- Test all four shipment sizes and at least three truck classes across short, medium and long routes. Hold out routes/classes not used during development.
- Compare the bottom-up result with public mover ranges only after the model is frozen; use those as a diagnostic, not a fitting target. Preserve each source's definition and sample.
- Keep DIY rental costs, truck + labor and full-service scope distinct. Do not apply a box-truck commercial operating rate to DIY rental prices.
- Do not publish until the estimate materially improves decision usefulness, the assumptions are understandable, and the mobile calculator can explain why weight, volume and truck size change the result.

## Immediate next step (updated 2026-11-18)

A first fuel-only benchmark is now calculated from the extracted VIUS MPG/loaded-share estimates and EIA diesel prices for 2026-11-16 by PADD. It yields about $0.653 per total truck-mile and $0.875 per loaded truck-mile at the U.S. EIA average, before every non-fuel component. Route mileage weighting through PADDs is still missing; do not approximate it by averaging only route endpoints. Next: extract May 2025 BLS state/metro wage estimates for driver and handling occupations, build interval/sensitivity treatment for maintenance/repair, and research tires, insurance, depreciation/capital and overhead. Keep B24 research-only; no per-mile or per-pound-mile rate and no production formula change until components and holdout tests are complete.

## Sources checked 2026-11-16

- BTS, Vehicle Inventory and Use Survey: https://www.bts.gov/vius
- Census API, VIUS 2021 PUF variable dictionary: https://api.census.gov/data/2021/viuspuf/variables.html
- VIUS PUF user guide: https://www2.census.gov/programs-surveys/vius/datasets/2021/vius_2021_puf_user_guide.pdf
- EIA, Gasoline and Diesel Fuel Update: https://www.eia.gov/petroleum/gasdiesel/
- BLS, heavy and tractor-trailer truck drivers: https://www.bls.gov/OOH/transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm
- BLS, delivery/light-truck drivers: https://www.bls.gov/OOH/transportation-and-material-moving/delivery-truck-drivers-and-driver-sales-workers.htm
- BLS, hand laborers and material movers: https://www.bls.gov/OOH/transportation-and-material-moving/hand-laborers-and-material-movers.htm
- ATRI, 2026 Analysis of the Operational Costs of Trucking: https://truckingresearch.org/2026/07/new-atri-report-details-accelerating-costs-and-low-profitability-despite-cuts/
- GSA, 2026 CONUS Fleet Rate Bulletin: https://www.gsa.gov/buy-through-us/products-and-services/transportation-and-logistics-services/fleet-management/vehicle-leasing/vehicle-rates/2026-conus-fleet-rate-bulletin

 
## 2026-11-18 — BLS May 2025 OEWS occupation crosswalk (research only)

BLS May 2025 OEWS includes national, state, and metropolitan/nonmetropolitan occupation estimates. For the VIUS diesel box-truck GVWR 6–7 sample, the following SOC mapping is a defensible *starting proxy* based on the published weight thresholds:

| VIUS GVWR class | GVWR band | Candidate BLS SOC | BLS occupation | Interpretation |
|---|---:|---|---|---|
| 6 | 19,501–26,000 lb | 53-3033 | Light Truck Drivers | BLS definition covers vehicles below 26,001 lb |
| 7 | 26,001–33,000 lb | 53-3032 | Heavy and Tractor-Trailer Truck Drivers | BLS definition covers trucks at least 26,001 lb and tractor-trailer drivers |
| Crew handling | not a truck class | 53-7062 | Laborers and Freight, Stock, and Material Movers, Hand | Broad manual-material-handling proxy for load/unload labor |

**Do not treat these SOCs as exact moving-company job samples.** SOC 53-3032 includes tractor-trailer drivers; SOC 53-3033 includes delivery/light-truck work. SOC 53-7062 includes broad hand-labor and material-moving jobs. The wage estimates are cross-industry wage-and-salary estimates, not household mover rates or contractor invoices. BLS OEWS excludes employer costs for supplementary benefits from its wage measure, so an employer-loaded labor cost needs a separately sourced benefit component. Also distinguish the driver's route time from crew loading/unloading hours; do not multiply every crew member's wage by the full road-driving time.

BLS May 2025 dataset availability and methodology:
- Tables / May 2025 state, metro and all-data downloads: https://www.bls.gov/oes/tables.htm
- May 2025 state estimates: https://www.bls.gov/oes/2025/may/oessrcst.htm
- OEWS technical documentation: https://www.bls.gov/oes/oes_doc.htm
- May 2025 OEWS technical note (sample, model-based estimates, definitions and wage exclusions): https://www.bls.gov/news.release/pdf/ocwage.pdf

**Next extraction task:** parse the official May 2025 state and metro files for SOC 53-3032, 53-3033 and 53-7062, preserving mean, median, 10th/90th percentile wages, employment counts, relative standard errors, area code, and missing/suppressed values. Do not select one wage statistic as a final point estimate yet. Use percentile bands for sensitivity. Resolve how to assign driver wages and loading/unloading wages geographically on an interstate route; origin/destination averaging is not justified without a stated staffing/dispatch assumption. Add employer benefits only from a separate official source. No wage value or coefficient is adopted in the production calculator.
