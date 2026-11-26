# B24/B15 — Offline partial-cost scenario prototype (2026-11-26)

**Status:** research-only prototype; awaiting independent Claude execution/review. No production code, coefficient, formula, route distance, or displayed price changed.

## Purpose

Build an auditable comparison layer from existing repository inputs without promoting an incomplete cost model to a consumer quote. The script is `tools/b24-offline-scenario-comparison.py`; it reads existing route geometries, TIGER state boundaries, EIA weekly diesel prices, the audited VIUS fuel-use result, May 2025 BLS OEWS state wages, and CMR's published booked-price bands. It writes only to ignored/local `artifacts/`.

Run:

```bash
python3 tools/b24-offline-scenario-comparison.py
```

## Cost components

For each route that passes the existing PADD allocator's strict geometry and coverage checks:

1. **Fuel:** route mileage within each state/PADD × EIA diesel price for reference week 2026-11-16 × VIUS weighted gallons per mile (0.122605). This is fuel-only and uses the existing audited per-record 1/MPG estimate, not price divided by arithmetic-mean MPG.
2. **Driver road-time wages:** HeiGIT/ORS provider route duration × origin-state BLS May 2025 median hourly wage proxy. The proxy blends SOC 53-3033 and 53-3032 by the VIUS weighted vehicle counts in GVWR classes 6 and 7 (239,835 and 77,450). Origin state is a dispatch/home-base proxy, not an observed carrier assignment. Route duration is not HOS schedule time or full paid duty time.
3. **Handling wages:** total crew man-hours × BLS SOC 53-7062 origin/destination state median hourly wages, split 50/50 across the two labour markets. No employer burden is added.

The prototype deliberately does not add ATRI combination-truck insurance/tires or convert VIUS maintenance categories into point estimates. Their population and scope mismatch/interval censoring remain explicit. No capital/depreciation, overhead, permits, tolls, packing, profit or other missing components are invented.

## Crew-hour scenarios — not evidence

`data/research/b24-crew-hours-scenarios-2026-11-26.json` contains low/base/high analyst-selected total crew man-hours by shipment-size group. These are scenario controls only: not measured, not sourced to VIUS, not BLS-derived, not Bellhop averages, not national estimates, and not confidence limits. The split between origin and destination is also an explicit modeling assumption. Claude should challenge the values and may replace them, but only with clearly labelled scenario assumptions unless mover-specific observations are obtained.

Crew man-hours mean the sum of individual movers' handling hours. They are not elapsed clock hours and are not multiplied by crew size again. Driver route time is a separate role and is not multiplied by the handling crew.

## CMR comparison

For each passing route, shipment-size group and low/base/high scenario, the report compares the **partial modeled subtotal** against the corresponding CMR 25th–75th percentile band and median. CMR is one mover network's booked-estimate dataset, not the national market. The 4+ bedroom 1,500–1,999 mile CMR cell has a different historical observation window; small sample cells remain marked in the source data.

This is intentionally not apples-to-apples: the prototype subtotal omits several real carrier costs and service components, while CMR represents full-service booked estimates. A gap to CMR is a diagnostic of missing cost scope and model assumptions, not proof that the calculator should raise or lower a price.

## Fail-closed behavior

- Routes rejected by the existing route-distance reconciliation or >=99.999% PADD coverage gate are marked blocked; they are not endpoint-priced or silently normalized.
- Missing route duration or BLS wage rows blocks that route.
- The EIA price week and CMR booking counts are carried into output.
- No network calls, live API requests, site builds, production imports, or calculator mutations are performed by this research script.

## Known limitations / review questions

1. Confirm the VIUS weighted gallons-per-mile cohort and class-6/7 vehicle weights against the extraction audit.
2. Confirm BLS state CSV row filtering and SOC blend; test all states/metros if the role model is revised.
3. Confirm the route-duration semantics and whether provider duration is acceptable for this restricted driver-wage proxy.
4. Decide whether origin-state wage is a defensible dispatch proxy; do not average origin/destination driver wages without evidence.
5. Challenge crew-hour scenario grid; keep it labelled as assumptions, not facts.
6. Verify all 44 route files and report blocked routes. The existing manifest flags three stored-distance mismatches (>1%) that must remain blocked until reconciled.
7. Interpret the CMR comparison only as a partial-cost diagnostic; no production calibration or price action follows from it.

## Sources already documented in the repository

- 2021 VIUS weighted extraction and caveats: `docs/operations/B24-VIUS-WEIGHTED-EXTRACTION-2026-11-18.md`.
- EIA weekly on-highway diesel, week 2026-11-16: `data/research/eia-diesel-padd-prices-2026-11-16.json`.
- BLS OEWS May 2025 state extract: `data/research/bls-oews-2025/state-soc-53-3032-3033-7062.csv`; structural QA in `docs/operations/B24-BLS-OEWS-CSV-QA-2026-11-21.md`.
- Route geometries and PADD method: `data/route-geometries/city/`, `tools/b24_padd_allocation.py`, and `docs/operations/B24-PADD-ALLOCATION-METHOD-2026-11-18.md`.
- CMR booked bands: `data/cmr-full-service-ranges.json`.
- Historical task-time context and limits: `data/research/b24-moving-labor-time-evidence-2026-11-18.json`.
