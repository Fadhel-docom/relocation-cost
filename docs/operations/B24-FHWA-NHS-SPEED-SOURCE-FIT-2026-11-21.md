# B24 — FHWA truck-speed source suitability review

**Prepared:** 2026-11-21 19:32 UTC  
**Owner:** ChatGPT  
**Status:** Source-fit review completed; route-level truck-speed join is **not supported by the public Monthly NHS Traffic Speed table alone**. No speed rows were extracted and no route-time coverage percentage is claimed.

## Decision

Do not calculate route-segment-weighted truck travel time from the public FHWA Monthly NHS Traffic Speed table as currently documented. The published schema contains ten aggregate fields:

- `year`, `month`
- `vehicle_type`, `time_period`
- `area`, `f_system`
- `median_speed`, `median_speed_previousmonth`, `median_speed_previousyear`, `median_speed_2019`

The dataset is described as historical 50th-percentile median speeds for roadway types, months and vehicles. It was last updated 2026-11-05 and has 7,812 rows. The exposed schema has no route ID, state/FIPS key, coordinates, geometry, TMC identifier or linear-reference measure. Consequently, the table cannot be spatially overlaid against the 44 route GeoJSON lines, nor can it provide a defensible route-specific NHS/local-road mileage split. The `area` and `f_system` categories are aggregate dimensions, not segment geometry.

Official source and metadata:
- Dataset landing page: https://data.transportation.gov/Roadways-and-Bridges/Monthly-NHS-Traffic-Speed/ra4w-8xud
- Data.gov catalog and resource metadata: https://catalog.data.gov/dataset/monthly-nhs-traffic-speed
- Columns metadata endpoint: https://data.transportation.gov/api/views/ra4w-8xud/columns.json
- CSV export endpoint: https://data.transportation.gov/api/v3/views/ra4w-8xud/export.csv?accessType=DOWNLOAD

**Extraction boundary:** this session verified the official portal's published schema and dataset metadata only. It did not retrieve the CSV rows or inspect the distinct category values. Therefore no vehicle-category mapping, time-period mapping, speed statistic, row-level QA, or route coverage result is asserted.

## Existing route geometry audit

The committed route-geometry manifest reports 44 requested, 44 fetched, and zero fetch failures. It identifies the route provider profile as `driving-car`, not a truck profile. Individual GeoJSON feature metadata includes `provider_duration_seconds`, but those values are passenger-car routing estimates from openrouteservice/HeiGIT and must not be relabelled as observed truck travel time.

This is a key separation:
- Route geometry is suitable as a spatial line for a future overlay.
- The associated `driving-car` duration is not a truck-speed observation.
- Do not convert car-profile duration into a truck wage-hours or driver-time input without independent truck-specific validation.
- Keep the three stored-distance discrepancies (ATL–BOS, CLT–NYC, BOS–NYC) under the existing owner/Claude restrictions. No matrix edits, gate widening or additional HeiGIT requests are part of this task.

## Better-matched candidate: NPMRDS

FHWA's NPMRDS documentation describes probe-based truck and passenger-car speed/travel-time observations on the National Highway System. It provides:
- Truck and passenger-car modal coverage.
- TMC-level directional roadway segments (approximately 0.5–1 mile in urban/suburban areas and 5–10 miles in rural areas).
- Time intervals as fine as five minutes, with monthly data availability.
- CSV data and ArcGIS shapefiles containing road-segment details.

However, access is not an unrestricted public download. FHWA states that State and local transportation agencies can access it through RITIS after agreeing to a required license agreement. The documentation also warns of missing observations, variable data quality, long rural TMC segments, and NHS-only coverage.

Official documentation:
- FHWA-HOP-20-028: https://ops.fhwa.dot.gov/publications/fhwahop20028/index.htm
- RITIS NPMRDS portal: https://npmrds.ritis.org/

**Assessment:** NPMRDS is the strongest candidate for a real truck-specific route overlay if lawful authorized access is available. It still cannot cover local-road portions; those must remain a separately measured unresolved share, not silently assigned NHS speeds. The project does not currently have evidence of an authorized NPMRDS dataset or license, so this is a candidate, not an acquired source.

## Other public FHWA candidate

FHWA's Freight Performance Measures web tool reports truck operating speeds at selected locations/times on 25 major freight interstates. This could support corridor-level context or spot checks, but the documented network is limited to those interstates and does not establish complete coverage of all 44 routes or their local-road portions.

- FHWA Travel Time in Freight Significant Corridors: https://ops-dr.fhwa.dot.gov/Freight/freight_analysis/travel_time.htm
- FHWA Freight Performance in the United States: https://ops.fhwa.dot.gov/freight/freight_analysis/perform_meas/fpmdata/index.htm

Older published corridor workbooks must not be treated as current observations without checking their year and method.

## Recommended next action

1. Do not force a spatial join from the aggregate Monthly NHS table.
2. Investigate whether the project can obtain a lawful, reusable NPMRDS truck-data extract and matching TMC geometry through an eligible State/MPO data-access arrangement. Do not attempt to bypass its license or access controls.
3. If that is unavailable, assess FHWA FPM public corridor outputs for the subset of route mileage they genuinely cover; label their age and corridor limits.
4. For any candidate dataset, test all 44 geometries and report:
   - route miles intersecting valid truck-speed segments;
   - route miles on NHS but missing speed observations;
   - route miles outside NHS/local access roads;
   - percentage coverage by route and in aggregate;
   - temporal reference window, truck class definition, time-of-day treatment and missingness.
5. Only calculate segment-weighted truck time for covered segments. Leave uncovered mileage unresolved or report a transparent partial-coverage result. Do not extrapolate NHS speed to local roads.
6. Keep residential loading/unloading and crew task hours separate; FHWA road-speed data cannot solve those labour-time questions.

## Project impact

- No production code, displayed price, coefficient, road-distance matrix or route geometry was changed.
- No HeiGIT quota was used.
- No truck-speed rows were extracted; no route-level time result or coverage percentage is claimed.
- The B24 backlog should now treat the aggregate Monthly NHS table as context-only and the NPMRDS/FPM alternatives as the next source-access investigation.
