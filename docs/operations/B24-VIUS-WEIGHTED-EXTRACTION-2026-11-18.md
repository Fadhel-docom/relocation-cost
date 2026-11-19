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


## First fuel-only benchmark using current EIA prices (2026-11-16)

EIA's November 17, 2026 release reports on-highway diesel retail prices for the week of November 16, including taxes. The earlier calculation divided each regional price by the arithmetic weighted mean of MPG (9.0959). Claude's independent raw-PUF audit found this is not a valid estimator of average fuel cost per truck-mile: fuel cost is proportional to gallons per mile, so transform each record to 1/MPG before averaging. In the same 1,080 valid records, the weighted harmonic MPG is 8.16, producing about $0.728 per truck-mile at the national $5.937/gal price. Sensitivity trims produce $0.699–$0.717; the mileage-weighted gallons-per-mile estimate is about $0.721. Thus use a transparent provisional sensitivity range of about $0.699–$0.728 per total truck-mile (not the old $0.653). Dividing these scenarios by the marginal loaded-mile share (0.7459) gives approximately $0.937–$0.976 per loaded truck-mile. These are alternative aggregation scenarios, not a confidence interval. The extraction script now computes the TABWEIGHT-weighted mean of per-record 1/MPG and its RGROUP replicate CV; rerun it on the owner-supplied PUF to obtain the exact reproducible estimate and CV. Do not use price / arithmetic-mean MPG.

| EIA region | Diesel price ($/gal) | Fuel-only $/total truck-mile | Fuel-only $/loaded truck-mile |
|---|---:|---:|---:|
| U.S. | 5.937 | 0.699–0.728 (sensitivity range) | 0.937–0.976 (scenario allocation) |
| East Coast (PADD 1) | 5.782 | 0.681–0.709 (sensitivity range) | 0.913–0.950 (scenario allocation) |
| Midwest (PADD 2) | 5.967 | 0.702–0.732 (sensitivity range) | 0.941–0.981 (scenario allocation) |
| Gulf Coast (PADD 3) | 5.547 | 0.653–0.681 (sensitivity range) | 0.876–0.913 (scenario allocation) |
| Rocky Mountain (PADD 4) | 6.011 | 0.707–0.737 (sensitivity range) | 0.948–0.988 (scenario allocation) |
| West Coast (PADD 5) | 6.948 | 0.817–0.852 (sensitivity range) | 1.095–1.142 (scenario allocation) |
| California (PADD 5 subregion) | 7.733 | 0.909–0.948 (sensitivity range) | 1.218–1.271 (scenario allocation) |
| West Coast less California | 6.269 | 0.737–0.768 (sensitivity range) | 0.988–1.030 (scenario allocation) |

### Exact script result (Claude run, 2026-11-19)

`python3 tools/b24-vius-box-truck-extract.py vius_2021_puf_csv.zip` on the owner-supplied PUF, focus cell (BTYPE 07, BUSRELATED 1, GVWR class 6-7, diesel): `gallons_per_mile` = **0.122605** gal/mile (equal to 8.157 mpg as a harmonic mean), random-group CV **1.6 %**, **1,080** valid records, valid weight 207,128.0, 8 non-empty RGROUPs. It uses every record with MPG > 0 (including the 30 records at 1-4 mpg); no trimming. The unit tests (4/4) pass. This independently matches Claude's separate pandas computation (harmonic 8.156).

The exact estimate is the **primary** figure; the trimmed and mile-weighted scenarios above are sensitivities, not a confidence interval. Primary fuel-only values (price x 0.122605; loaded-mile column divides by the 0.7459 loaded share, a different valid-record domain):

| EIA region | $/gal | Primary $/truck-mile | Primary $/loaded mile |
|---|---:|---:|---:|
| U.S. | 5.937 | 0.728 | 0.976 |
| PADD 1 | 5.782 | 0.709 | 0.950 |
| PADD 2 | 5.967 | 0.732 | 0.981 |
| PADD 3 | 5.547 | 0.680 | 0.912 |
| PADD 4 | 6.011 | 0.737 | 0.988 |
| PADD 5 | 6.948 | 0.852 | 1.142 |
| California | 7.733 | 0.948 | 1.271 |
| West Coast less California | 6.269 | 0.769 | 1.030 |

TABWEIGHT weights vehicles, so this is the average per vehicle, not a fleet mile-weighted figure (the mile-weighted scenario is about 0.721 at the U.S. price).

**Interpretation guardrails:** these are fuel-only benchmarks, not a carrier's full operating cost or a consumer quote. The EIA price is a public retail on-highway benchmark (including taxes), not a fleet contract price. The per-record 1/MPG transformation and the loaded-share estimate are weighted marginal estimates with different valid-record sets; dividing by loaded share is a transparent scenario calculation, not a record-level joint estimator. The $0.699–$0.728 range reflects different defensible aggregation/sensitivity choices and is not a statistical confidence interval. It excludes maintenance, tires, labor, insurance, depreciation/capital, permits, dispatch, overhead, profit and service costs. The route-level EIA price still needs to be weighted by actual route miles through each PADD; averaging only origin and destination regions would be a weak shortcut. The sparse gasoline sample in GVWR 6–7 is not used as a parallel calibration.

This benchmark demonstrates why the next model must expose fuel, utilization, labor and vehicle overhead separately. It is **not** used to change the existing $0.56/mile assumption or any production coefficient. The previous $0.653/$0.875 figures are withdrawn because dividing price by arithmetic-mean MPG understates mean fuel use.

Source: [EIA Gasoline and Diesel Fuel Update](https://www.eia.gov/petroleum/gasdiesel/), release November 17, 2026, prices for November 16, 2026. BLS publishes May 2025 state and metro occupational wage tables for the next labor step; see [state OEWS tables](https://www.bls.gov/oes/2025/may/oessrcst.htm), [all OEWS tables](https://www.bls.gov/oes/tables.htm), and the national [heavy-truck driver](https://www.bls.gov/ooh/transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm) and [hand-laborer/material-mover](https://www.bls.gov/ooh/transportation-and-material-moving/hand-laborers-and-material-movers.htm) wage profiles.

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
