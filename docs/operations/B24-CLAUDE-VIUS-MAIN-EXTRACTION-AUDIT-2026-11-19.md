# B24 — Claude audit of the 2026-11-18 weighted VIUS extraction (2026-11-19)

**Reviewed:** `B24-VIUS-WEIGHTED-EXTRACTION-2026-11-18.md` and the fuel-only benchmark in `B24-RESEARCH-UPDATE-2026-11-18.md` (main b039a92).
**Method:** recomputed from the raw `vius_2021_puf.csv` the owner uploaded on 2026-11-17 (TABWEIGHT, RGROUP replicate method of the Census guide). I did not run `tools/b24-vius-box-truck-extract.py`; I re-implemented the filters independently.
**Scope:** docs only. No production code, coefficient, price or UI changed.

## 1. What reproduces exactly

Filters `BTYPE=07`, `BUSRELATED=1` (4,364 records, 885,459 weighted vehicles) and the focus cell `GVWR_CLASS` 6 or 7, `FUELTYPE=20` (Diesel per the dictionary): 1,556 records, 317,285 vehicles.

| Measure | Valid records | Claude | Report |
|---|---:|---:|---:|
| MPG (weighted mean) | 1,080 | 9.10, CV 1.5 % | 9.10, CV 1.5 % |
| Annual miles | 1,556 | 25,011, CV 3.9 % | 25,011, CV 3.9 % |
| Loaded % | 1,045 | 74.59, CV 1.0 % | 74.6, CV 1.0 % |
| Deadhead % | 750 | 23.22, CV 4.6 % | 23.2, CV 4.6 % |
| Reposition % | 771 | 12.36, CV 7.8 % | 12.4, CV 7.8 % |

Derived fuel-only figures also reproduce arithmetically: 5.937 / 9.10 = $0.652-0.653 per truck-mile; divided by 0.746 = $0.875 per loaded mile. I did not re-check the other table cells (other GVWR classes, gasoline) or the GM_COST/ER_COST shares for this cohort.

## 2. Finding: the fuel $/mile uses the wrong average of MPG

The report divides the price by the **weighted arithmetic mean of MPG** (9.10). Fuel cost per mile is price x gallons per mile, so the quantity that must be averaged is gallons per mile (1/MPG). The arithmetic mean of MPG understates the average of 1/MPG (Jensen's inequality), so the benchmark is biased low.

Same 1,080 records, same $5.937 price (national average, EIA week of 2026-11-16):

| MPG aggregation | Fleet MPG | Fuel $/truck-mile | vs report |
|---|---:|---:|---:|
| Weighted arithmetic mean (report) | 9.10 | 0.653 | - |
| Weighted harmonic mean, all valid MPG | 8.16 | 0.728 | +11.5 % |
| Harmonic, MPG 3-25 (sensitivity) | 8.29 | 0.717 | +9.5 % |
| Harmonic, MPG 4-20 (sensitivity) | 8.33 | 0.713 | +8.6 % |
| Harmonic, MPG 5-20 (sensitivity) | 8.49 | 0.699 | +7.6 % |
| Mile-weighted gallons per mile (fleet gal/mile) | 8.24 | 0.721 | +10.4 % |

By class (all valid MPG): class 6 arithmetic 9.39 -> $0.632 vs harmonic 8.46 -> $0.702; class 7 arithmetic 8.30 -> $0.715 vs harmonic 7.43 -> $0.799.

The harmonic mean is sensitive to implausible low self-reports: 30 of the 1,080 records report MPG 1-4 (2.4 % of weight, minimum 1.0 mpg). The trims above are arbitrary sensitivity bounds, not a recommendation. The VIUS guide does not document how MPG was computed, so the raw MPG field stays a self-reported value of unknown method.

**Correction asked of the report:** keep the 9.10 mpg as a descriptive weighted mean, but do not derive fuel $/mile from it. Carry the fuel benchmark as a range of about $0.65-0.73 per truck-mile (about $0.88-0.98 per loaded mile at 74.6 %) with the aggregation named, or compute gallons per mile per record and average that. The national $5.937 is also not route-weighted; the PADD allocation (PR #274) is still the route-level step.

## 3. Limits that stay

- The cohort is business-related box trucks, not household movers (BUSRELATED=1 does not identify moving).
- Deadhead/reposition keep the Census non-sampling-error warning; the CV does not measure it.
- Fuel is one component; nothing here is a price, a coefficient or an acceptance of the independent model.

## 4. Next

1. ChatGPT updates the VIUS extraction report and the research update with the range above (or per-record gallons per mile).
2. Claude re-reads PR #274 and the OEWS/ECEC data files next; BLS and EIA hosts are blocked from Claude's sandbox, so source pages cannot be re-read by Claude and those values stay unverified by Claude until the owner uploads the files.

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>
