# B24 — Weighted VIUS box-truck extraction (2026-11-18)

## Result

The first reproducible weighted extraction is complete. It is a descriptive operating-profile dataset, **not a moving-price model**. No production coefficient or calculator output was changed.

The extraction applies both filters required by the research plan:

- `BTYPE = 07`: Box truck.
- `BUSRELATED = 1`: Some commercial activity.

The 2021 VIUS PUF contains 67,952 records. This filter leaves 4,364 business-related box-truck records, representing a weighted estimate of approximately **885,459 vehicles**. The unfiltered box-truck subset has 6,039 PUF records.

## Main candidate group: diesel box trucks, GVWR classes 6–7

GVWR class 6 is 19,501–26,000 lb; class 7 is 26,001–33,000 lb.

| Measure | Weighted estimate | Random-group CV | Valid PUF records |
|---|---:|---:|---:|
| Vehicles represented | 317,285 | — | 1,556 |
| Fuel economy | 9.10 mpg | 1.5% | 1,080 |
| Annual miles per vehicle | 25,011 miles | 3.9% | 1,556 |
| Loaded-mile share | 74.6% | 1.0% | 1,045 |
| Deadhead share | 23.2% | 4.6% | 750 |
| Reposition share | 12.4% | 7.8% | 771 |

The deadhead and reposition estimates are descriptive only. The data dictionary specifically warns that these survey responses may have high non-sampling error; the random-group CV does not measure that non-sampling error.

## Cell-level weighted profiles

Weighted means use `TABWEIGHT`. CVs use the eight `RGROUP` replicate groups as described in the VIUS PUF User Guide. Valid record counts differ by variable because some questions were not applicable or were not reported.

| GVWR class | Fuel | PUF n | Weighted vehicles | MPG (CV) | Annual miles (CV) | Loaded % (CV) | Deadhead % (CV) | Reposition % (CV) |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| 10,001–14,000 lb | Diesel | 167 | 33,886 | 12.71 (3.8%) | 12,283 (15.2%) | 75.3 (4.4%) | 19.5 (20.6%) | 13.9 (25.4%) |
| 10,001–14,000 lb | Gasoline | 786 | 172,013 | 11.24 (2.3%) | 14,776 (3.8%) | 80.1 (2.7%) | 22.5 (14.9%) | 12.5 (15.7%) |
| 14,001–16,000 lb | Diesel | 316 | 69,870 | 11.76 (1.8%) | 17,496 (7.7%) | 76.5 (3.3%) | 22.8 (11.4%) | 8.0 (22.2%) |
| 14,001–16,000 lb | Gasoline | 342 | 66,119 | 10.43 (3.2%) | 17,260 (8.4%) | 78.0 (2.4%) | 23.8 (9.2%) | 9.2 (13.6%) |
| 16,001–19,500 lb | Diesel | 269 | 63,934 | 10.60 (1.8%) | 20,674 (8.9%) | 76.6 (3.1%) | 22.7 (15.5%) | 13.2 (22.8%) |
| 16,001–19,500 lb | Gasoline | 70 | 13,864 | 10.58 (5.6%) | 12,840 (12.3%) | 84.5 (5.1%) | 30.7 (23.6%) | 24.6 (31.6%) |
| 19,501–26,000 lb | Diesel | 989 | 239,835 | 9.39 (1.6%) | 25,325 (2.9%) | 73.4 (1.7%) | 23.0 (4.0%) | 13.1 (8.1%) |
| 19,501–26,000 lb | Gasoline | 78 | 13,801 | 8.57 (2.9%) | 14,088 (17.7%) | 82.2 (4.4%) | 20.0 (25.6%) | 8.8 (25.8%) |
| 26,001–33,000 lb | Diesel | 567 | 77,450 | 8.30 (2.4%) | 24,038 (10.9%) | 77.7 (2.8%) | 24.0 (10.5%) | 9.9 (15.1%) |
| 26,001–33,000 lb | Gasoline | 13 | 1,132 | 11.99 (15.4%) | 19,420 (27.3%) | 82.7 (11.1%) | 15.2 (95.4%) | 23.4 (47.1%) |
| Over 33,000 lb | Diesel | 242 | 26,738 | 7.02 (3.1%) | 23,996 (7.0%) | 73.0 (4.3%) | 23.6 (9.8%) | 16.7 (15.2%) |
| Over 33,000 lb | Gasoline | 4 | 275 | 22.94 (40.9%) | 14,238 (67.2%) | 68.6 (37.7%) | — | — |

The tiny gasoline cells in GVWR classes 7 and 8 are not suitable for calibration. The table is not evidence that the population of residential moving trucks has exactly this profile: VIUS covers business-related box trucks across many uses, not only household movers.

## Maintenance and repair bands — classes 6–7 diesel

The PUF reports annual maintenance and extensive-repair costs as categories, not exact dollar amounts. In the focus group (1,556 PUF records), the weighted category distribution among records with a valid category code is:

**General maintenance (`GM_COST`)**

| Published band | Weighted share |
|---|---:|
| Less than $100 | 0.5% |
| $100–$499 | 3.8% |
| $500–$999 | 7.8% |
| $1,000–$1,999 | 15.2% |
| $2,000–$4,999 | 24.3% |
| $5,000–$9,999 | 20.7% |
| $10,000 or more | 13.1% |
| Not reported | 14.6% |

**Extensive repairs (`ER_COST`)**

| Published band | Weighted share |
|---|---:|
| $501–$999 | 6.3% |
| $1,000–$1,999 | 16.9% |
| $2,000–$4,999 | 30.0% |
| $5,000–$9,999 | 20.1% |
| $10,000–$19,999 | 14.3% |
| $20,000 or more | 2.7% |
| Not reported | 9.6% |

These percentages include the explicit “Not reported” category and exclude blank and not-applicable (`X`) records. The cost questions are conditional on the relevant maintenance/repair applicability. They cannot be treated as exact average costs for every truck, and their bands must not be silently replaced with midpoints. The User Guide also notes that `GM_*` categorical values can be swapped between records for disclosure protection.

## Method

For each cell and numeric variable, the weighted mean is:

`weighted mean = sum(TABWEIGHT × value) / sum(TABWEIGHT)`

For the mean's sampling variability, the script calculates the eight random-group replicate ratios and applies the VIUS User Guide formula:

`variance = sum((replicate mean - full-sample mean)^2) / (G × (G - 1))`

`CV = sqrt(variance) / abs(weighted mean) × 100`

Empty replicate groups are excluded from `G`, as instructed in the guide. The output records variable-specific valid counts and valid weight totals; it does not hide missingness behind the overall cell count.

## Data-quality and interpretation limits

- VIUS is a national truck-population survey, not a sample of household moving companies or residential moves.
- The User Guide says noise was applied to `MILESANNL` and `TABWEIGHT`; annual mileage is also top-coded. The resulting weighted estimates are survey estimates, not exact fleet ledgers.
- General-maintenance categories may be swapped between records; maintenance and extensive-repair costs are interval categories.
- The data dictionary cautions that `DEADHEADPCT` and `REPOSITIONPCT` may have high non-sampling error. Random-group CVs do not cover this.
- Annual maintenance/repair bands do not supply tire costs, insurance, depreciation/capital, permits, dispatch overhead, profit, packing, or residential handling.
- A business-related box truck is not automatically a residential moving truck. No truck-length label is inferred from GVWR without a separate vehicle-specification mapping.
- No `$/truck-mile`, `$/lb-mile`, `$/kg-km`, mover selling price, or production coefficient is produced by this extraction.

## Decision

**B24 extraction milestone: complete for weighted descriptive distributions; pricing model remains research-only.** The evidence supports fuel-economy and fleet-utilization inputs for the next model stage, but not a finished consumer moving price.

Next model work, still outside production:
1. Combine VIUS MPG by class/fuel with current EIA regional fuel prices and route mileage through fuel-price regions.
2. Treat maintenance/repair as interval-censored, with sensitivity bounds and explicit applicability/missingness; do not force one midpoint.
3. Add current local BLS driver and handling wages as separate labor components.
4. Research independent tires, insurance, depreciation/capital and overhead inputs.
5. Build shipment allocation from both volume and payload constraints, then hold out routes and sizes before any production discussion.

## Reproduction

The extraction is implemented in `tools/b24-vius-box-truck-extract.py` (Python standard library only):

```bash
python3 tools/b24-vius-box-truck-extract.py vius_2021_puf_csv.zip --output b24-vius-results.json
```

The input ZIP is the Census/BTS 2021 VIUS PUF CSV, not committed to this repository. The owner-provided data dictionary and User Guide were used to interpret codes and weights.

## Sources

- U.S. Census Bureau / BTS, [2021 VIUS Public Use File](https://www.census.gov/data/datasets/2021/econ/vius/2021-vius-puf.html).
- U.S. Census Bureau / BTS, [2021 VIUS PUF Data User Guide](https://www2.census.gov/programs-surveys/vius/datasets/2021/vius_2021_puf_user_guide.pdf), especially the PUF weighting, disclosure-protection and random-group variance sections.
- 2021 VIUS PUF Data Dictionary supplied for this project; used to map `BTYPE=07`, `BUSRELATED=1`, GVWR and fuel codes, and maintenance/repair bands.
