# B24 — BLS May 2025 OEWS extracted CSV independent QA

**Date:** 2026-11-21  
**Reviewer:** ChatGPT  
**Status:** structural and core-field QA passed with one documented metro coverage exception. Research only; not a wage model or production input.

## 1. What was inspected

Read both committed CSV files directly from GitHub; no ZIP download or re-extraction was performed.

| Check | State file | Metro file |
|---|---:|---:|
| Header columns | 32 | 32 |
| Data rows | 162 | 1,178 |
| Distinct area codes | 54 | 393 |
| SOC 53-3032 rows | 54 | 393 |
| SOC 53-3033 rows | 54 | 393 |
| SOC 53-7062 rows | 54 | 392 |
| Malformed rows / field-count mismatch | 0 | 0 |

Both files retain the same 32-column header, including area identifiers, occupation codes/titles, employment, employment RSE, hourly/annual mean, mean RSE, median and percentile wage fields, and the original annual/hourly marker columns.

## 2. Core-field checks

For each dataset, all rows in the target SOC extracts have nonblank values in:
- TOT_EMP
- EMP_PRSE
- H_MEAN
- A_MEAN
- MEAN_PRSE
- H_MEDIAN
- A_MEDIAN
- H_PCT10, H_PCT25, H_PCT75, H_PCT90

The inspected values in these fields parse as numeric. No suppression marker (*) or blank was found in these core employment/wage fields in the extracted target rows.

This statement is limited to the core fields above. Some other columns are blank by design in these rows (for example PCT_TOTAL, PCT_RPT, and the trailing ANNUAL/HOURLY flags); do not describe every cell in the 32-column table as numeric or populated.

## 3. Coverage details and exception

### State file
- 54 distinct areas per SOC: 51 area-type-2 entries (50 states plus District of Columbia) and 3 area-type-3 entries (Guam, Puerto Rico, and U.S. Virgin Islands).
- 54 rows for each of the three SOCs.
- No missing core employment/wage values in the target rows.

### Metro file
- 393 distinct metro area codes for SOC 53-3032 and 53-3033.
- 392 distinct metro area codes for SOC 53-7062.
- The one missing SOC 53-7062 area is 25980 — Hinesville, GA. The 53-3032 and 53-3033 rows exist for that area.
- This is a coverage difference, not a blank wage value. Do not impute Hinesville's 53-7062 wage from another occupation or neighboring metro.

## 4. Corrections to prior documentation

The README phrase “all 30 original columns” is inaccurate for the committed CSVs: the actual header has 32 columns. This QA note records the observed 32-column structure.

The WORK-LOG entry saying the extraction had “all 30 columns” was a mistaken column count, not a different extraction. The source file hashes and row counts in the README remain as recorded; this QA did not independently re-open the original ZIPs to recalculate their SHA-256 values.

## 5. Interpretation limits

- These are broad OEWS occupation wage estimates, not household-goods mover payroll observations.
- SOC 53-3032 is heavy and tractor-trailer truck drivers; 53-3033 is light truck drivers; 53-7062 is laborers and freight/material movers.
- OEWS wage estimates do not supply crew size, paid hours per move, task productivity, employer payroll taxes, benefits, workers' compensation, or commercial-auto premiums.
- Do not map a single SOC mechanically to every driver or mover in a household-goods crew without an explicit role model.
- Do not treat A_MEAN as total employer cost. No wage loading or price coefficient is approved by this QA.

## 6. Decision

**CSV structural/core-field QA: PASS with one explicit metro coverage exception (Hinesville, GA absent for SOC 53-7062).**

The data are suitable as a traceable occupational-wage evidence layer for subsequent research and role-mapping. They are not, by themselves, sufficient to calculate labor cost per move. No production change is authorized.
