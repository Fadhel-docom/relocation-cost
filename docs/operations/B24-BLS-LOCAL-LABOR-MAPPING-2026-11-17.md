# B24 — BLS local labor evidence mapping (2026-11-17)

**Status:** Phase 1 source-register work. Geography and occupation mapping verified; local wage observations not yet extracted. No labor coefficient accepted. No production code, price, formula, UI, or deployment changed.

## 1. Decision summary

The next labor evidence layer should combine two different BLS views without confusing them:

1. **May 2025 OEWS metro occupational wages** for local occupation-level context across the project's existing 18 U.S. city markets.
2. **CES industry earnings for NAICS 48421 (Used household and office goods moving)** as a more directly industry-matched national benchmark, not as a local crew wage or loaded labor cost.

The direct industry benchmark is a useful discovery: BLS CES Table B-3a lists average hourly earnings for NAICS 48421. The latest non-missing value visible in the inspected May 2026 table is **$31.03/hour for April 2026 (preliminary)**; the corresponding average weekly earnings are **$1,045.71**. The table marks the May 2026 value as unavailable in that row. These are average earnings of all employees in private nonfarm payrolls in the industry, not a mover-specific occupational rate, not employer total compensation, and not local metro data. Keep it contextual only.

## 2. May 2025 OEWS source and 18-city geography crosswalk

Official May 2025 OEWS tables provide national, state, metropolitan/nonmetropolitan, and national industry-specific estimates. The BLS area file `oe.area` identifies each metropolitan area with a seven-digit area code. The codes below are copied from that official file, not inferred from city names.

| Project city | Official May 2025 OEWS area label | OEWS area code |
|---|---|---:|
| New York | New York-Newark-Jersey City, NY-NJ | 0035620 |
| Los Angeles | Los Angeles-Long Beach-Anaheim, CA | 0031080 |
| Chicago | Chicago-Naperville-Elgin, IL-IN | 0016980 |
| Houston | Houston-Pasadena-The Woodlands, TX | 0026420 |
| Phoenix | Phoenix-Mesa-Chandler, AZ | 0038060 |
| Dallas | Dallas-Fort Worth-Arlington, TX | 0019100 |
| Austin | Austin-Round Rock-San Marcos, TX | 0012420 |
| San Francisco | San Francisco-Oakland-Fremont, CA | 0041860 |
| Seattle | Seattle-Tacoma-Bellevue, WA | 0042660 |
| Denver | Denver-Aurora-Centennial, CO | 0019740 |
| Miami | Miami-Fort Lauderdale-West Palm Beach, FL | 0033100 |
| Atlanta | Atlanta-Sandy Springs-Roswell, GA | 0012060 |
| Boston | Boston-Cambridge-Newton, MA-NH | 0014460 |
| Las Vegas | Las Vegas-Henderson-North Las Vegas, NV | 0029820 |
| Portland | Portland-Vancouver-Hillsboro, OR-WA | 0038900 |
| San Diego | San Diego-Chula Vista-Carlsbad, CA | 0041740 |
| Charlotte | Charlotte-Concord-Gastonia, NC-SC | 0016740 |
| Nashville | Nashville-Davidson--Murfreesboro--Franklin, TN | 0034980 |

**Geography guardrail:** These are BLS OEWS area codes and area definitions for the May 2025 release. Do not join to BEA/ACS by display name alone. Retain BLS area code, label, release vintage, and the crosswalk separately. Cross-state metros require special care: New York's OEWS label is NY-NJ (not the BEA NY-NJ-PA label); Boston is MA-NH; Portland OR-WA; Charlotte NC-SC; Chicago IL-IN.

## 3. Candidate occupation mapping — proxies, not mover classifications

| SOC | BLS occupation | Potential model role | Limitation / rule |
|---|---|---|---|
| 53-3033 | Light Truck Drivers | Primary local wage proxy for drivers operating vehicles below 26,000 lb GVW | BLS definition describes light delivery/pickup vehicles. It is not specific to household movers and may include parcel/delivery work. |
| 53-3032 | Heavy and Tractor-Trailer Truck Drivers | Conditional wage proxy for heavy truck drivers where the modeled vehicle/role genuinely matches | Do not apply to every box truck. BLS definition includes tractor-trailer drivers and trucks with capacity at least 26,000 lb GVW; likely poor fit for smaller classes. |
| 53-7062 | Laborers and Freight, Stock, and Material Movers, Hand | Primary broad proxy for loading/unloading crew labor | Broad occupation across freight, stock and material movement; not a household-moving crew classification. |
| 53-7064 | Packers and Packagers, Hand | Optional proxy only where packing service is included | Broad hand-packing occupation, not necessarily household packers. Keep separate from loading/unloading. |

Do not average these occupations into one blended crew rate. A driver and a mover perform different work; the model must separately specify driver hours, loader/unloader hours, packing hours (if any), crew count, task overlap, paid waiting, and overtime. The occupation-to-task mapping remains an explicit modeling assumption requiring validation.

## 4. Direct industry-specific earnings signal

BLS CES Table B-3a, *Average hourly and weekly earnings of all employees on private nonfarm payrolls by industry sector*, includes 2022 NAICS 48421, “Used household and office goods moving”:

| Observation | Average hourly earnings | Average weekly earnings | Status |
|---|---:|---:|---|
| May 2025 | $30.10 | $1,038.45 | Published |
| March 2026 | $30.83 | $1,042.05 | Published |
| April 2026 | $31.03 | $1,045.71 | Preliminary |
| May 2026 | — | — | Not available in inspected table row |

**Use:** national industry-level reasonableness benchmark for the wage component only. It is more directly aligned to household-goods moving than broad NAICS 484 or a generic transportation occupation.

**Do not use as:** a local city wage, a mover/driver/packer-specific wage, employer-loaded compensation, per-job labor cost, or an hourly crew cost. It averages all employees in the covered private-payroll industry and does not identify job function or hours by task. Do not add an ECEC benefit percentage from a different population to this figure.

## 5. Why OEWS and CES must remain separate

- OEWS is the route for metro occupation-specific hourly wage estimates, but the occupational groups are imperfect proxies for residential moving.
- CES 48421 is industry-specific and nationally aggregated, but does not separate occupations or provide metro-level values in the inspected table.
- BLS ECEC measures employer compensation including wages and benefits, but the available broad occupational/industry groups do not exactly match household movers. Do not mechanically apply a general benefits share to OEWS or CES wages.
- QCEW 484210 may provide local industry employment and average weekly wages. It is a candidate cross-check, but weekly earnings cannot be converted into an hourly rate without compatible hours data. Investigate it separately before use.

## 6. Extraction status and access limitation

The BLS May 2025 tables page and the official `oe.area` file were inspected, and the 18 area codes above were verified. The metropolitan XLSX download link points to `oesm25ma.zip`, but the current retrieval path rejected the ZIP content type and the local container could not resolve the BLS host. Therefore **no metro occupation wage values have yet been extracted or independently checked**. This is a file-retrieval limitation, not evidence that BLS data are unavailable.

Next extraction method: use BLS's May 2025 all-data/metro data file or one-screen area query, parse only the 18 area codes and four SOC codes, preserve hourly median and mean plus employment/relative standard error/footnotes where available, and record suppressed or unavailable cells as missing. Do not substitute state or national estimates silently for a missing metro estimate.

## 7. Fuel-price boundary retained from the source audit

EIA weekly on-highway retail gasoline and diesel prices are published by U.S., PADD region and state, in dollars per gallon including taxes. The series can supply a dated price benchmark once fuel type, trip week, and geography are known. A route-weighted fuel price additionally requires route miles allocated to each price geography. Existing route distance totals alone do not provide that allocation.

Therefore:
- do not assign one origin-state or destination-state price to the whole interstate route;
- do not mix gasoline and diesel prices;
- do not call a retail average a mover fleet-card price;
- do not calculate fuel dollars until compatible vehicle fuel economy is supported;
- do not treat a current weekly price as a permanent coefficient.

## 8. Source register

- BLS May 2025 OEWS tables: https://www.bls.gov/oes/tables.htm
- BLS May 2025 metro estimates: https://www.bls.gov/oes/2025/may/oessrcma.htm
- BLS official OEWS area-code file: https://download.bls.gov/pub/time.series/oe/oe.area
- BLS May 2025 occupation definitions: https://www.bls.gov/oes/2025/may/oes_stru.htm
- BLS SOC definitions: https://www.bls.gov/soc/2018/soc_2018_definitions.pdf
- BLS CES Table B-3a (May 2026): https://www.bls.gov/ces/data/employment-and-earnings/2026/table3a_202605.htm
- BLS NAICS hierarchy crosswalk: https://www.bls.gov/cew/classifications/industry/qcew-naics-hierarchy-crosswalk.htm
- EIA weekly gasoline/diesel prices: https://www.eia.gov/petroleum/gasdiesel/

## 9. Decision and next action

**Accepted:** source roles and BLS geography IDs; CES 48421 as national wage context only.

**Context only:** OEWS occupations as local labor proxies pending extraction and validation; CES 48421 earnings as a broad national industry benchmark.

**Unresolved:** local metro wage observations; mover-specific occupational wages; employer-loaded labor cost; crew productivity/task hours; route-weighted fuel price; real-world loaded MPG; truck non-fuel operating cost and truck-day ownership cost.

**Next bounded task:** obtain and parse the May 2025 OEWS metro data for the 18 area codes × SOC 53-3033/53-3032/53-7062/53-7064, then compare with the national CES 48421 benchmark and investigate QCEW 484210 local wage data. No coefficient or model total is to be accepted until units, geography, period, occupation/industry scope and coverage are reconciled.
