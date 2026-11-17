# B24 — VIUS field audit and practical evidence decisions — 2026-11-17

**Scope:** source and variable audit from official Census/BTS documentation. This is not a completed PUF analysis and accepts no numerical fuel, deadhead, maintenance, or cost coefficient. Production remains untouched.

## 1. Key result: VIUS is more useful than the earlier fuel-only framing

The official 2021 VIUS PUF variable catalogue exposes fields that may help investigate not only fuel economy but also fleet operating patterns:

| Field | Official definition / values | Potential use | Limitation / decision |
|---|---|---|---|
| `BTYPE` | Body type; code `07` = Box truck | Select box trucks directly instead of treating all straight trucks as equivalent | Body type alone does not prove household-moving service or a particular box size |
| `GVWR_CLASS` | Administrative GVWR class; includes 10,001–14,000; 14,001–16,000; 16,001–19,500; 19,501–26,000; 26,001–33,000; >33,000 lb | Cross-tab box trucks by vehicle weight class | GVWR is a rating class, not actual payload or usable cargo capacity |
| `MPG` | Miles per gallon; integer PUF field | Candidate fuel-economy distribution | User Guide says the question-specific method used to calculate MPG is not released; no loaded-only MPG is supplied. Do not treat as loaded long-haul moving-truck MPG |
| `LOADEDPCT` | Percent of annual mileage while loaded | Describe loaded-mile share for a defined box-truck/GVWR subset | All products/tools/equipment/materials; not household goods specifically; cannot convert the MPG field into loaded-only MPG |
| `DEADHEADPCT` | Percent of annual mileage driven empty directly back to home base | Empirical deadhead context | Not equivalent to every empty return/repositioning leg; annual fleet behavior, not a route-specific rule |
| `REPOSITIONPCT` | Percent of annual mileage driven to reposition an empty vehicle to a new location for the next load | Separate repositioning from direct deadhead | Fleet-wide annual share; not a deterministic trip multiplier |
| `TRUCKLOADPCT` | Percent of annual mileage with truckload service (single shipment at a time) | Identify dedicated/single-shipment operating pattern | Does not identify household-moving service |
| `LTRUCKLOADPCT` | Percent of annual mileage with less-than-truckload service (multiple shipments at a time) | Identify shared/multiple-shipment operating pattern | Not proof of a household-goods consolidated linehaul model |
| `WEIGHOUTPCT` | Percent of annual mileage filled to weight limit | Context for weight-limited utilization | Does not reveal cargo weight for each trip or the actual payload capacity |
| `GM_COST`, `ER_COST` | General maintenance and extensive-repair annual cost categories | Possible cost-distribution context after matching vehicle domain and survey definitions | Categorical, self-reported annual costs; not a per-mile rate and not complete maintenance cost. Extensive repairs and general maintenance must be checked for overlap before combining |

Sources: Census PUF variable catalogue and variable metadata; Census 2021 VIUS PUF User Guide, especially pages 2–6; Census 2021 VIUS methodology.

## 2. Practical extraction design — no numbers until the PUF is processed

First analysis domain to test:

- `BTYPE = 07` (Box truck)
- Commercial use only, using the appropriate documented commercial-use indicator
- Cross-tabulate by `GVWR_CLASS`; do not combine weight classes prematurely
- Retain only valid reported `MPG` values after checking its flag/missing-value metadata
- Report raw record count, weighted record estimate, weighted MPG distribution, missingness, and all eight random-group replicate results
- Separately report distributions of `LOADEDPCT`, `DEADHEADPCT`, `REPOSITIONPCT`, `TRUCKLOADPCT`, `LTRUCKLOADPCT`, and `WEIGHOUTPCT`

For a weighted MPG mean, the candidate ratio estimator is:

`weighted mean MPG = sum(TABWEIGHT × valid MPG) / sum(TABWEIGHT over the same valid-MPG records)`

For random-group variance, apply the User Guide's eight-group ratio procedure to the numerator and denominator replicate totals, using only non-empty groups. Before accepting results, reproduce the guide's published example and national/state totals exactly (within stated rounding). Do not substitute a generic standard error or an arbitrary minimum raw n for the prescribed method.

**Important:** this formula is an analysis plan, not a result. Check MPG flag codes and any special values in the data dictionary before implementation. The user guide explicitly says the method used to calculate MPG was not released; even a statistically stable estimate remains a fleet-use benchmark, not measured loaded MPG for interstate household moves.

## 3. Immediate correction to the experiment's evidence model

The earlier plan treated VIUS primarily as a source for fuel economy and considered deadhead a largely unresolved moving-specific input. The newly verified fields allow a better, more nuanced route:

- VIUS can provide *fleet-level empirical distributions* for empty return, repositioning, loaded mileage, truckload/LTL use and weight utilization for box trucks, if subgroup precision is adequate.
- These distributions can inform sensitivity scenarios or contextual priors; they do **not** justify applying one annual fleet percentage directly to every household move.
- Dedicated and consolidated modes should remain distinct. VIUS truckload/LTL percentages describe vehicle annual mileage patterns and cannot, by themselves, price a household's share of a consolidated shipment.
- A route model should keep three legs distinct: loaded linehaul, empty return to base, and empty repositioning to the next load. Do not add all three automatically; assign only legs that the service/operator actually bears.

## 4. Cost-data boundary

VIUS contains annual maintenance/repair cost categories, but it does not close the full non-fuel operating-cost gap:

- `GM_COST` is categorical general-maintenance spend in 2021.
- `ER_COST` is categorical extensive-repair spend in 2021.
- These are annual owner-reported categories, not per-mile costs. The PUF guide notes disclosure protection and coarsening. Any conversion to per-mile cost would require matched mileage, consistent populations, valid cost-category handling, and uncertainty analysis. Do not use category midpoints as if they were observed exact dollars.
- The fields do not supply a complete, compatible set for depreciation/financing, insurance, tires, registration, taxes, or truck-day ownership cost.

Therefore VIUS may narrow the fuel and utilization gaps, but it does not create a defensible complete box-truck cost-per-mile coefficient by itself.

## 5. Labor source correction and usable current context

BLS CES Table B-3b (September 2026, not seasonally adjusted) reports average hourly earnings for all employees in NAICS 48421, Used household and office goods moving, of **$31.04/hour** for September 2026. This is industry-level average hourly earnings, not a mover/driver occupational wage, not a local wage, and not a fully loaded employer cost. Use it only as a broad industry cross-check.

BLS OEWS May 2025 remains the correct route for occupation-specific wage distributions (e.g. driver and hand labor/freight mover) by geography, but the industry-specific OEWS hierarchy lists NAICS 484200 rather than a separate 484210 occupational profile. Do not claim that the broad 484200/484000 occupation values are specific to household-goods movers.

BLS/FRED's annual hourly-compensation index for NAICS 484210 (2025 = 127.238, 2017=100) is an index, not dollars per hour. It can indicate change over time, not supply a wage or cost rate.

## 6. Source references

- Census 2021 VIUS PUF landing page and downloads: https://www.census.gov/data/datasets/2021/econ/vius/2021-vius-puf.html
- Census PUF User Guide (Dec 2023): https://www2.census.gov/programs-surveys/vius/datasets/2021/vius_2021_puf_user_guide.pdf
- Census VIUS methodology: https://www2.census.gov/programs-surveys/vius/technical-documentation/methodology/2021-vius-methodology.pdf
- Census API variable catalogue: https://api.census.gov/data/2021/viuspuf/variables.html
- BLS CES Table B-3b, September 2026: https://www.bls.gov/ces/data/employment-and-earnings/2026/table3b_202609.htm
- BLS May 2025 industry-specific OEWS: https://www.bls.gov/oes/2025/may/oessrci.htm
- BLS/FRED NAICS 484210 hourly-compensation index: https://fred.stlouisfed.org/series/IPUIN484210U120000000

## 7. What remains unresolved and the next exact action

1. Obtain and process the PUF CSV and dictionary; the direct archive retrieval was not completed in this research session.
2. Reproduce the User Guide's national/state weighted totals and wood-chipper example before any Box-truck subgroup estimate.
3. Check box-truck × commercial-use × GVWR raw n, weighted totals, empty random groups, MPG missingness, and random-group CVs. If a cell is unstable, combine only adjacent GVWR classes when technically and substantively defensible; otherwise leave it contextual/unresolved.
4. Obtain matched May 2025 OEWS occupation/geography rows and compare with the NAICS 48421 CES average as a reasonableness check, not as interchangeable measures.
5. Research GSA lodging/per-diem and route-specific toll sources separately; neither is a universal flat per-mile input.
6. Continue to leave box-truck non-fuel per-mile cost, truck-day ownership, crew productivity, and commercial margin unresolved until compatible sources are found.

**Decision:** this is a meaningful narrowing of the evidence gaps, not a calibrated model. No numerical VIUS fuel/deadhead/maintenance coefficient is accepted; no CMR calibration is performed; no production code, price, coefficient, or UI is changed.
