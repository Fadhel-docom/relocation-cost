# B24 — BLS May 2025 OEWS wage extraction handoff

**Status (2026-11-21): BLOCKED only on obtaining the two official ZIP files in this execution environment.** No wage rows have been extracted, no WageDex values are accepted, and no wage input has been added to the model.

## Official source and release

BLS's May 2025 OEWS tables page lists downloadable State and Metropolitan/Nonmetropolitan workbooks. The release reference period is May 2025; the tables page was last modified May 15, 2026.

- State ZIP: https://www.bls.gov/oes/special-requests/oesm25st.zip
- Metropolitan/nonmetropolitan ZIP: https://www.bls.gov/oes/special-requests/oesm25ma.zip
- Official tables index: https://www.bls.gov/oes/tables.htm
- Official May 2025 technical notes: https://www.bls.gov/oes/2025/may/oes_tec.htm
- State HTML tables: https://www.bls.gov/oes/2025/may/oessrcst.htm
- Metro/nonmetro HTML tables: https://www.bls.gov/oes/2025/may/oessrcma.htm

BLS technical notes describe OEWS as employer-survey estimates for wage-and-salary workers in nonfarm establishments. May 2025 uses six semiannual panels over three years and model-based estimation; the survey covers roughly 1.1 million establishments. These are broad occupational wage proxies, not moving-company payroll observations or mover-specific labor rates.

## Retrieval attempt and blocker

- Attempted direct runtime downloads of both ZIPs from the BLS host using the current hyphenated `special-requests` path and the older dotted `special.requests` path. Both downloads failed in the available runtime.
- The web reader can open the official tables index and the HTML landing pages, but clicking the XLSX/ZIP download returns an unsupported binary content-type error (`application/x-zip-compressed`). This does not mean BLS has removed the files; the official tables page still lists them.
- Claude independently reported on 2026-11-21 that its session could not reach the OEWS ZIPs either.
- Therefore this session did not parse any BLS file. No synthetic or secondary-source substitution is permitted.

**Required handoff:** upload the two original files `oesm25st.zip` and `oesm25ma.zip` from the official links above. Keep them unmodified; do not unzip/re-zip or convert them before upload. Once available, ChatGPT/Claude can extract and validate the rows locally.

## Required extraction contract

Target SOC 2018 occupations:

| SOC | BLS occupation | Intended use / limitation |
|---|---|---|
| 53-3032 | Heavy and Tractor-Trailer Truck Drivers | Broad driver wage proxy; not a mover-specific rate |
| 53-3033 | Light Truck Drivers | Broad light-truck driver wage proxy |
| 53-7062 | Laborers and Freight, Stock, and Material Movers, Hand | Broad loading/unloading/handling proxy; not a dedicated moving-labor classification |

For each available State and Metro/Nonmetro area row, preserve at minimum:

- `AREA`, `AREA_TITLE`, `AREA_TYPE` (or exact source field equivalent), `PRIM_STATE` where supplied;
- `OCC_CODE`, `OCC_TITLE`;
- `TOT_EMP`, `EMP_PRSE` when published;
- hourly and annual median: `H_MEDIAN`, `A_MEDIAN`;
- hourly and annual mean: `H_MEAN`, `A_MEAN`;
- `MEAN_PRSE` and all available wage percentile fields;
- original suppression / unavailable markers and any source notes.

Do not invent a median RSE if BLS does not publish one in the source file. Preserve missing/suppressed cells as missing with their original status; do not replace them with zero, statewide values, neighboring areas, or commercial estimates. Keep area codes as strings (including leading zeros) and distinguish metro areas crossing state lines from single-state areas.

## QA before any model use

1. Verify ZIP filenames, file hashes, workbook names, sheet names, and field descriptions; record retrieval date and source URL.
2. Check unique area/occupation keys, duplicate rows, expected SOC codes, valid wage units, and state/metro coverage.
3. Reconcile the state list with the 50 states + DC required by the project. Do not assume every occupation is published in every area.
4. Report exact row counts by SOC and geography, suppression/missing counts, and employment/RSE availability.
5. Keep state and metro datasets separate. Do not average state and metro estimates together or weight the 44 city nodes with statewide values where metro rows are absent.
6. Treat OEWS as one independent labor-cost proxy. It does not by itself establish mover crew composition, hours per move, employer burden, overtime, benefits, payroll taxes, or the correct number of workers.
7. Do not change production calculator logic, prices, coefficients, or the stored road-distance matrix from this extraction. Any later calibration requires the project's independent cost evidence and holdout gates.

## Next after the ZIPs are available

- Complete the validated state/metro wage extraction.
- Continue independent evidence for tires, insurance, truck acquisition/depreciation/capital, and labor task-time/crew assumptions.
- Build a transparent experimental cost model with explicit component definitions and uncertainty; test it on routes not used in calibration.
- Only then decide whether any research result qualifies for B16/production review.

**No production change is authorized by this handoff.**
