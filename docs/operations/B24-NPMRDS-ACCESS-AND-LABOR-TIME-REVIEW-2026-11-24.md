# B24 — NPMRDS access and public labor-time evidence review

**Prepared:** 2026-11-24 08:05 UTC  
**Owner:** ChatGPT  
**Status:** Source-access review completed. No restricted dataset was accessed or requested; no model coefficient or production value was created.

## Decision

Treat NPMRDS as **blocked unless the project obtains authorized access through an eligible State DOT/MPO or another explicitly authorized arrangement**. It is not an unrestricted public dataset that this project can simply download and reuse.

FHWA's Freight Performance Measure Primer distinguishes two resources:

1. **FHWA truck-probe data (FPM):** FHWA states the probe data are available to FHWA and that access may be provided to support innovative research by States, MPOs, regional authorities and academics. The described probe records contain a probe identifier, latitude, longitude, speed and heading, but do not identify truck type, owner, fleet size or commodity. This is not a public self-service download for an independent website.
2. **NPMRDS:** FHWA describes NPMRDS as a derivative of probe data providing historical average travel times. FHWA says it makes NPMRDS available to State DOTs, MPOs and Federal agencies, and that States/MPOs must sign a licensing agreement with the provider. The older FHWA primer describes the access route and monthly availability; it does not grant this project access or reuse rights.

Official source: https://ops.fhwa.dot.gov/publications/fhwahop16089/appc.htm  
Relevant source passages: FHWA probe-data access and fields (sections “TRUCK PROBE DATA”); NPMRDS eligible recipients and licensing (section “NATIONAL PERFORMANCE MANAGEMENT RESEARCH DATA SET”).

The current 23 CFR §490.103 also describes NPMRDS or an FHWA-approved equivalent as the travel-time data source used by State DOTs and MPOs for specified performance measures: https://www.govinfo.gov/content/pkg/CFR-2025-title23-vol1/xhtml/CFR-2025-title23-vol1-chapI-subchapE.html

## What other public sources can and cannot establish

- **BLS industry hours (NAICS 48421):** The FRED/BLS annual series reports 171.329 million hours for 2025 for Used Household and Office Goods Moving. It is an aggregate industry-hours measure, not shipment-level, crew-level, route-level or task-level time. It may be retained as a macro reasonableness benchmark only; it cannot produce a per-move labor coefficient.
  Source: https://fred.stlouisfed.org/series/IPUIN48421L200000000
- **FMCSA hours-of-service rules:** Property-carrying drivers are generally limited to 11 hours of driving after 10 consecutive hours off duty, within a 14-hour on-duty window, with a 30-minute interruption requirement after 8 cumulative driving hours. These are legal operating constraints, not observed average route speeds, typical trip durations, or residential loading/unloading crew hours.
  Source: https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations
  Regulation: https://www.govinfo.gov/content/pkg/CFR-2025-title49-vol5/xhtml/CFR-2025-title49-vol5-part395.html

## B24 implications

- Do not attempt to bypass NPMRDS licensing or infer access from a public portal.
- Do not use FHWA FPM corridor summaries or the aggregate Monthly NHS speed table as a substitute for route-specific truck observations.
- Do not convert FMCSA legal maximums into expected route-time coefficients.
- Do not convert annual BLS industry hours into per-shipment crew hours.
- Keep route driving time, driver on-duty constraints, residential loading/unloading, and crew task hours as separate quantities.
- Keep the current 44-route geometry and fuel-allocation results unchanged. No HeiGIT requests, route-distance edits, production calculator changes, or price/coefficient changes were made.

## Next evidence gate

1. Continue public-source research for matched box-truck tire installed cost and service life, with vehicle class and mileage denominator explicit.
2. Continue capital lifecycle/depreciation evidence that is actually comparable to a moving box truck; do not substitute a combination-truck payment line.
3. Seek mover-specific crew/task-time evidence only where the sample, job size, crew size, and task definitions are disclosed. Otherwise retain the labor-time input as unresolved.
4. Use BLS NAICS 48421 hours only as an aggregate cross-check, not as a calibration input.
5. Revisit NPMRDS only if a lawful eligible institutional access path becomes available and reuse/licensing terms are confirmed.

**Limitations:** This was a documentation/source-fit review. No NPMRDS or raw FHWA FPM data were downloaded; no agency was contacted; no route-time coverage was calculated; no tests/build were needed because no application code changed.
