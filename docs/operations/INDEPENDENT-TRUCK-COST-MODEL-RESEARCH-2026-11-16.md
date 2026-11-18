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


## 2026-11-18 — BLS May 2025 state/metro wage extraction: source verification

The official BLS May 2025 OEWS tables page confirms that national, state, and metropolitan/nonmetropolitan estimates are published, and that percentile wages are available in the downloadable XLSX and the One Screen Data Search. The state index confirms the May 2025 reference period and links to the downloadable state file and query system.

**Extraction outcome in this session: not complete.** The official state XLSX download resolves to `https://www.bls.gov/oes/special-requests/oesm25st.zip`; the available web retrieval rejected the ZIP content type, and the container download attempt failed. The official One Screen query opens its general query shell, but the state/occupation/year selection and result export are interactive and were not completed by the available retrieval path. No official May 2025 state/metro row values were therefore extracted or independently checked.

Search results also surfaced secondary sites reproducing May 2025 BLS values and an old May 2023 BLS state page. These are **not adopted**: no scraped/secondary value is copied into project data, and May 2023 values must not be mixed with the May 2025 dataset. The national benchmark already in `data/bls-2025.txt` remains a context benchmark only.

**Decision:** keep the BLS geographic wage input pending. Do not infer state/metro wages from secondary sites, do not use May 2023 values as substitutes, and do not update any coefficient. The next extraction attempt must obtain the official May 2025 XLSX or complete the BLS One Screen query, then retain for each SOC/area: employment, employment RSE, mean and median hourly/annual wage, 10th/25th/75th/90th percentiles, and suppression/missingness status. Prefer state estimates for endpoints unless a route-city metro estimate is available and has acceptable reliability; do not average state and metro estimates together.

**Official references checked:**
- BLS May 2025 OEWS tables: https://www.bls.gov/oes/tables.htm
- BLS May 2025 state index: https://www.bls.gov/oes/current/oessrcst.htm
- BLS One Screen Data Search (linked from the state index): https://data.bls.gov/oes/
- Official state download endpoint: https://www.bls.gov/oes/special-requests/oesm25st.zip
- BLS OEWS documentation: https://www.bls.gov/oes/oes_doc.htm

This is an access/extraction limitation, not evidence that BLS has no data. No application code, pricing, formulas, route data, or production settings changed.


## 2026-11-18 — Official national BLS May 2025 wage cross-check

The official BLS May 2025 OEWS national table reports for SOC 53-7062 (Laborers and Freight, Stock, and Material Movers, Hand): mean hourly wage **$20.32**, mean annual wage **$42,260**, and median hourly wage **$19.35**. The BLS Occupational Outlook Handbook's May 2025 detailed-occupation table reports a median annual wage of **$40,240** for this same detailed occupation. This reconciles the existing `data/coefficients.json` mean benchmark with a separately sourced median; mean and median are not interchangeable.

The BLS OOH also reports May 2025 national median annual wages of **$58,640** for heavy and tractor-trailer truck drivers (SOC 53-3032) and **$44,860** for light truck drivers (SOC 53-3033). These are broad national occupational proxies. SOC 53-3032 includes tractor-trailer drivers; SOC 53-3033 includes delivery/light truck work; SOC 53-7062 covers manual freight/material movement across industries. None is a residential-moving-only wage sample.

**Important distinction:** the broader OOH group “Hand Laborers and Material Movers” has a median of $38,220, but the detailed SOC 53-7062 median is $40,240. For the project's SOC 53-7062 handling proxy, use the detailed occupation value and label the scope accurately. Do not substitute the broader group median.

These national figures improve the research baseline but do not resolve the pending state/metro extraction, driver/handling geographic allocation, or employer benefit loading. They remain context benchmarks only; no production coefficient or formula is changed.

Official sources:
- BLS May 2025 OEWS national table: https://www.bls.gov/news.release/ocwage.t01.htm
- BLS May 2025 OOH, heavy and tractor-trailer truck drivers: https://www.bls.gov/ooh/transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm
- BLS May 2025 OOH, delivery truck drivers and driver/sales workers: https://www.bls.gov/ooh/transportation-and-material-moving/delivery-truck-drivers-and-driver-sales-workers.htm
- BLS May 2025 OOH, hand laborers and material movers: https://www.bls.gov/ooh/transportation-and-material-moving/hand-laborers-and-material-movers.htm


## 2026-11-18 — VIUS PUF coverage audit: missing insurance/tire prices and operating hours

A direct audit of the official Census 2021 VIUS PUF variable dictionary (173 listed variables) and the PUF User Guide clarifies which model inputs VIUS can and cannot supply:

- The PUF contains `GM_COST` and `ER_COST` as categorical total-cost bands for 2021 general maintenance and extensive repairs. These are not exact invoices; the existing weighted distributions and missingness treatment remain the correct use.
- The PUF contains `REARAXLETIRES` (number of tires on the rear axle) and tire-equipment indicators such as low-rolling-resistance tires / automatic inflation, but the dictionary has no tire-purchase or tire-expense variable and no insurance-premium variable. A text search of the complete dictionary returned no insurance or tire-cost field.
- The User Guide explicitly lists approximate operating hours and idling share among data items excluded from the PUF. Therefore VIUS cannot directly provide actual driver-hours or an idling-cost calculation for this model.
- The PUF does provide annual mileage, MPG, loaded/deadhead/reposition shares and vehicle characteristics, so it remains useful for the operating profile and fuel/utilization side of the model.

**Model consequence:** do not infer tire expense from tire count, insurance cost from truck value or GVWR, or driver hours from annual mileage alone. Source tires, insurance, capital/depreciation, and labor-time assumptions independently; keep each as a transparent sensitivity or unresolved component until supported. This narrows the research gap and prevents pretending VIUS has cost data it does not contain.

Official sources: https://api.census.gov/data/2021/viuspuf/variables.html ; https://www2.census.gov/programs-surveys/vius/datasets/2021/vius_2021_puf_user_guide.pdf


## 2026-11-18 — Employer benefit loading: BLS ECEC June 2026 benchmark

BLS Employer Costs for Employee Compensation (ECEC), June 2026, provides a current employer-benefit benchmark to address the fact that OEWS wage estimates exclude employer benefit costs. In the private-industry Table 4:

- The broad occupational group **Transportation and material moving occupations** reports wages and salaries of **$24.97/hour**, total benefits of **$11.41/hour**, and total compensation of **$36.38/hour**. Benefits are 31.4% of total compensation, or 45.7% of wages; the implied total-compensation / wage multiplier is **1.457**.
- The broad **Transportation and warehousing industry** reports wages and salaries of **$32.95/hour**, total benefits of **$16.90/hour**, and total compensation of **$49.86/hour**. Benefits are 33.9% of total compensation, or 51.3% of wages; implied multiplier **1.513**.

These two ratios form a plausible **sensitivity bracket**, not a specific SOC 53-7062 or residential-mover benefits rate. ECEC occupational group and industry group are separate aggregates; do not combine them as if they were a cross-tab, and do not apply the factor as a production constant. It includes all employer benefits (paid leave, supplemental pay, insurance, retirement/savings, and legally required benefits), not only insurance. ECEC excludes self-employed workers and does not identify household-moving firms separately.

**Research use:** use 1.457–1.513 only as a provisional sensitivity range when translating OEWS wages into employer-loaded labor cost, until a more specific source is found. Keep the un-loaded wage and benefit component visible separately; do not double count overtime or paid leave if the hours/cost model already includes them. No production coefficient changed.

Official source: https://www.bls.gov/news.release/ecec.htm (June 2026, Table 4; release September 9, 2026). The ECEC technical note describes benefit categories, survey coverage, and exclusion of self-employed workers.


## 2026-11-18 — Geographic OEWS wage proxy extraction and PADD utility

### State wage coverage (research-only, secondary transcription)
A May 2025 OEWS state wage extract was assembled for the 19 state endpoints used by the current state-route pages: AZ, CA, CO, FL, GA, IL, MA, MI, NC, NJ, NV, NY, OH, OR, PA, TN, TX, VA, WA. It contains annual median, hourly median, and employment for:
- SOC 53-3032 Heavy and Tractor-Trailer Truck Drivers
- SOC 53-3033 Light Truck Drivers
- SOC 53-7062 Laborers and Freight, Stock, and Material Movers, Hand

### City/metro handling wage coverage
A May 2025 SOC 53-7062 metro extract now covers 17 of the 18 city nodes in `data/cities.json`: New York, Los Angeles, Chicago pending, Houston, Phoenix, Dallas, Austin, San Francisco, Seattle, Denver, Miami, Atlanta, Boston, Las Vegas, Portland, San Diego, Charlotte, and Nashville. The current JSON contains 17 published metro records; Chicago is intentionally missing because the occupation-specific metro row was not recovered in this extraction. The metro observations retain employment and available percentiles; not every search result exposed every percentile.

### Provenance and restrictions
The downloadable BLS state/metro XLSX ZIPs remain inaccessible through the current retrieval path. To avoid discarding the research progress, `data/research/b24-oews-may-2025-proxies.json` records a **secondary transcription** from WageDex pages which state that their rows are computed from the BLS OEWS May 2025 state/metro files. This is not a direct BLS file extraction. The data file explicitly sets RSE to null (unknown, not zero), notes missing cells, and prohibits production use. OEWS is cross-industry wage-and-salary employment, not household-moving-only; the three SOCs are broad occupational proxies. Keep state and metro rows separate; do not average them. The city metro geography can cross state boundaries (e.g. Boston MA-NH, Portland OR-WA, Charlotte NC-SC, New York NY-NJ).

Official BLS tables: https://www.bls.gov/oes/tables.htm ; state index: https://www.bls.gov/oes/current/oessrcst.htm ; metro index: https://www.bls.gov/oes/current/oessrcma.htm. Secondary transcription source and download metadata: https://wagedex.com/data. WageDex data pages: https://wagedex.com/jobs/heavy-and-tractor-trailer-truck-drivers ; https://wagedex.com/jobs/light-truck-drivers ; https://wagedex.com/jobs/laborers-and-freight-stock-and-material-movers-hand.

### PADD allocation utility
The route-distance matrix has only scalar state-pair distances; the 18 city nodes and 44 city pairs use city-center planning data. Neither provides the actual road polyline or states traversed. A geometry-based allocator has therefore been added in `tools/b24_padd_allocation.py`, with unit tests and an isolated GitHub Actions workflow. It samples a supplied ORS/TIGER GeoJSON route against state polygons, groups miles by EIA PADD, and prices fuel by route-mile share. It fails closed if over 0.5% of mileage is unassigned, the geometry differs from an expected route distance by more than 1%, or a traversed PADD price is missing. EIA PADD mapping source: https://www.eia.gov/tools/glossary/index.php?id=Petroleum+Administration+for+Defense+District.

**Not yet complete:** no route GeoJSON bundle or Census/TIGER state-boundary GeoJSON has been added, so no PADD mileage shares or new route fuel costs have been calculated. The allocator is a tested method awaiting its required input data. Fuel output is fuel-only, not a full truck operating cost.

No production calculator formula, coefficient, price, or route distance changed.


## 2026-11-18 — Independent non-fuel comparator and labor-time boundaries

### ATRI 2024 peer-group cost-per-mile comparator
The public ATRI sample carrier report provides a 2024 Truckload peer group of carriers with 81–200 trucks. Published peer medians and middle-50% ranges (USD per truck-mile) are recorded in `data/research/b24-atri-2024-truckload-comparator.json`:
- Fuel: median $0.469; middle 50% $0.426–$0.521.
- Truck/trailer lease or purchase: $0.391; $0.323–$0.464.
- Repair and maintenance excluding tires: $0.161; $0.122–$0.186.
- Tires: $0.032; $0.030–$0.035.
- Auto-liability insurance premium: $0.093; $0.074–$0.114.
- Company driver wages: $0.620; $0.495–$0.647.
- Company driver benefits: $0.157; $0.089–$0.210.

The same report gives context for the peer group: 6.96 MPG, 15.18% deadhead, 1.61 hours average dwell per stop, 4.1-year average truck age, and 77,342 annual miles per truck. These figures are useful as an external reasonableness comparator only. They describe freight tractor-trailers, not household-goods box trucks or mover crews; they are not a representative all-carrier national estimate. Component medians are separate marginal medians and must not be summed to construct one synthetic truck. Equipment payment is lease/purchase, not pure depreciation; insurance premium and incident cost are separate related lines. ATRI's 2026 release reports a distinct 2025 all-in truck operating cost of $2.336/mile and $1.854/mile excluding fuel; that is a broader, different-year reference and must not be mixed with the 2024 peer component medians.

### Insurance: legal minimum is not premium
FMCSA's current filing chart lists for-hire household-goods carriers operating vehicles with GVWR at least 10,001 lb: $750,000 BIPD liability minimum and $5,000 cargo-insurance minimum. These are regulatory financial-responsibility floors, not market premiums and not enough to price insurance. The ATRI peer median above is an auto-liability premium for a freight-truckload cohort; it does not supply a household-goods cargo premium. No premium is inferred from GVWR or legal minimum coverage.

### Driver hours: regulation is a ceiling, not an average
For property-carrying CMV drivers, FMCSA summarizes an 11-hour driving limit after 10 consecutive hours off duty, a 14-hour duty window, and a 30-minute break after 8 cumulative hours of driving. These rules are constraints for a compliant schedule, not evidence of average route speed, paid driver hours, or number of drivers. The model should use actual route-provider duration for drive-time input when route geometry is obtained, and then model HOS/rest feasibility separately. Crew loading/unloading hours remain unresolved; ATRI's freight dwell time is not equivalent to residential moving load/unload time.

### Current city wage coverage correction
The missing Chicago SOC 53-7062 metro row has now been recovered: Chicago-Naperville-Elgin, IL-IN median annual $40,550, median hourly $19.50, employment 157,920, p10 $31,860, p25 $35,920, p75 $47,640, p90 $56,440. The research JSON now covers **18/18** city nodes for SOC 53-7062. This is still WageDex's secondary transcription of BLS OEWS May 2025, not a direct BLS file extraction; RSE remains unknown/null. Driver occupations are still represented at state level in this extract, not at all 18 metro areas.

Sources:
- ATRI sample peer report (2024 cohort): https://truckingresearch.org/wp-content/uploads/2026/02/sample_customized_yoy_report.pdf
- ATRI 2026 release (2025 broad industry average): https://truckingresearch.org/2026/07/new-atri-report-details-accelerating-costs-and-low-profitability-despite-cuts/
- FMCSA insurance filing requirements: https://www.fmcsa.dot.gov/registration/insurance-filing-requirements
- FMCSA hours-of-service summary: https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations

**Decision:** ATRI is a plausibility comparator only; FMCSA minimum insurance is not a premium; HOS is not an average-time model; residential crew handling hours still require mover-specific evidence. No production formula or coefficient changes.


## 2026-11-18 — HeiGIT route-geometry ingestion pipeline

Added `tools/fetch_heigit_route_geometries.mjs` and manual workflow `.github/workflows/fetch-b24-route-geometries.yml`. The fetcher reads the existing 44 city route definitions and directional state-page routes, uses the exact city-center/state-centroid coordinates and the corresponding stored road-distance matrix key, and requests full GeoJSON geometry plus provider duration from the current endpoint:

`POST https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson`

It explicitly excludes Canada using the ORS `avoid_countries: ["CA"]` routing option, fetches sequentially with a 1.6-second gap to stay below the published 40 requests/minute account rate, and stores provider distance/duration, existing matrix distance, difference percentage, timestamp, licence, and attribution. A >1% difference is flagged and the PADD allocator refuses that geometry until reconciled. API key is read only from the `HEIGIT_API_KEY` GitHub Actions secret; it is never printed or committed.

The manual workflow can fetch all routes, city routes only, or state routes only. It writes successful outputs to a new data branch and opens a PR. If some requests fail, it preserves successful outputs and the manifest in that PR, then marks the run failed so the missing routes are not hidden. No API call has been executed by this PR; no HeiGIT quota has been consumed by adding the pipeline.

Official API references:
- HeiGIT/ORS API playground and V2 GeoJSON Directions endpoint: https://playground.heigit.org/
- ORS routing options, including `avoid_countries`: https://giscience.github.io/openrouteservice/api-reference/endpoints/directions/routing-options
- ORS country list (Canada code/identifier): https://giscience.github.io/openrouteservice/technical-details/country-list
- HeiGIT endpoint migration: https://ask.openrouteservice.org/t/deprecating-api-openrouteservice-org-in-favour-of-api-heigit-org/7912

**Credential requirement:** repository secret `HEIGIT_API_KEY` must be configured before the manual workflow can run. Never put the key in source code, issue comments, or chat. Existing Vercel environment variables are not read or decrypted by this workflow.
