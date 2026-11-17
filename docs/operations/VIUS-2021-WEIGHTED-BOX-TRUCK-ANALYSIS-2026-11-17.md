# VIUS 2021 — Weighted Box-Truck Extraction and Limits

**Date:** 2026-11-17  
**Scope:** Read-only analysis of the 2021 VIUS Public Use File (CSV), its data dictionary, and the Census Bureau Data User Guide.  
**Status:** Research evidence for the independent cost-model experiment only. No production formula, coefficient, UI, or published estimate changed.

## Executive conclusion

VIUS can support a defensible description of the U.S. box-truck population represented by the 2021 survey: vehicle-weight classes, fuel-type mix, annual vehicle mileage, and categorical 2021 maintenance/repair costs. It also contains loaded-mile, deadhead, repositioning, truckload, and less-than-truckload survey fields, but several are restricted to narrow applicability domains, have substantial nonresponse, and/or carry an explicit high-nonsampling-error warning.

VIUS does **not** provide a reliable box-truck fuel-consumption coefficient for this model, actual fuel expenditure, driver hours, operating hours, idle time, average trip speed, crew hours, or a direct household-goods mover classification. It cannot by itself produce a 2026 cost-per-mile, per-pound-mile, or daily truck-cost coefficient.

**Do not label any VIUS subset “the household moving fleet.”** BTYPE=07 means Box truck; PRIMPROD=23 means furniture, mattresses, lamps, etc. as the vehicle's primary product. Neither field identifies residential moving companies or household-goods shipments.

## 1. Source and method

- Census Bureau, *2021 Vehicle Inventory and Use Survey Public Use File – Data User Guide*, issued December 2023: https://www2.census.gov/programs-surveys/vius/datasets/2021/vius_2021_puf_user_guide.pdf
- PUF landing/download page: https://www.census.gov/data/datasets/2021/econ/vius/2021-vius-puf.html
- Local inputs analyzed: vius_2021_puf.csv (67,952 records × 168 variables), vius-2021-puf-data-dictionary.xlsx, and the guide PDF.
- PUF totals and annual mileage must use TABWEIGHT. The guide defines vehicle count as sum of weights, annual vehicle miles as sum of TABWEIGHT × MILESANNL, and average annual miles as the ratio of those two estimates.
- For the allowed CV estimates below, the Census random-groups method was implemented exactly: eight groups; replicate total for group g = 8 × its weighted group sum; variance = sum of squared deviations of replicate totals from the full estimate divided by 8 × 7; CV = standard error / estimate × 100. For average annual miles, each replicate is the replicate mileage total divided by the replicate vehicle total. All eight groups were non-empty for the reported domains.
- PUF confidentiality treatments matter: the guide notes noise for MILESANNL, MILESLIFE, and TABWEIGHT, mileage topcoding, category swapping, and rounded weights. PUF CVs can be lower than published design-based CVs.
- No CV is reported here for MPG, fuel categories, cost bands, or the loaded/empty-mile percentages. The guide's explicit examples/formulas cover vehicle counts, annual vehicle miles, and average annual miles; we do not extend that methodology to other variables without a documented method.

## 2. Domain definitions and weighted scale

| Domain | PUF records | Weighted vehicle estimate | Share of all Box-truck records | Share of all Box-truck weighted estimate |
|---|---:|---:|---:|---:|
| All BTYPE=07 Box trucks | 6,039 | 1,317,003.1 | 100.0% | 100.0% |
| GVWR classes 3–8 | 5,329 | 1,145,099.8 | 88.2% | 86.9% |
| PRIMCOMMACT 11/12/13 (goods/products activity) | 3,132 | 629,924.0 | 51.9% | 47.8% |
| PRIMPROD=23 (furniture etc. primary product) | 303 | 67,404.5 | 5.0% | 5.1% |

The subsets overlap; they are alternative sensitivity definitions, not mutually exclusive populations. PRIMCOMMACT 11/12/13 means transporting goods/products belonging to the owner/company, another person/company, or local online goods respectively. PRIMPROD records one primary product, not all goods carried.

## 3. GVWR mix within Box trucks

Weighted distribution (weights sum to 1,317,003.1):

| GVWR class | Administrative GVWR range | PUF records | Weighted vehicles | Weighted share |
|---|---|---:|---:|---:|
| 1 | 0–6,000 lb | 6 | 2,219.6 | 0.17% |
| 2A | 6,001–8,500 lb | 46 | 9,659.6 | 0.73% |
| 2B | 8,501–10,000 lb | 658 | 160,024.1 | 12.15% |
| 3 | 10,001–14,000 lb | 1,304 | 297,667.5 | 22.60% |
| 4 | 14,001–16,000 lb | 1,047 | 257,206.8 | 19.53% |
| 5 | 16,001–19,500 lb | 414 | 99,871.2 | 7.58% |
| 6 | 19,501–26,000 lb | 1,443 | 348,954.2 | 26.50% |
| 7 | 26,001–33,000 lb | 741 | 100,903.9 | 7.66% |
| 8 | Over 33,000 lb | 380 | 40,496.2 | 3.07% |

Classes 3–8 represent 86.9% of the weighted Box-truck estimate. This is useful for sensitivity definitions, not proof that every vehicle in those classes is suitable for household moving. GVWR is not payload capacity; do not substitute it for legal/usable payload.

## 4. Fuel-type mix

FUELTYPE means type of fuel most often used. Weighted share of all Box trucks:

| Fuel type | PUF records | Weighted vehicles | Weighted share |
|---|---:|---:|---:|
| Gasoline | 2,411 | 586,513.7 | 44.53% |
| Diesel | 2,853 | 563,774.3 | 42.81% |
| Not applicable | 604 | 133,293.2 | 10.12% |
| Not reported | 156 | 30,663.4 | 2.33% |
| Combination | 7 | 1,434.5 | 0.11% |
| Alcohol fuels | 3 | 596.2 | 0.05% |
| Propane | 4 | 456.7 | 0.03% |
| Compressed natural gas | 1 | 271.1 | 0.02% |

Within the 303-record furniture-primary-product subset, the weighted mix is 54.86% diesel, 44.80% gasoline, and 0.34% not reported. This is a small subset and still does not identify residential movers.

The dictionary contains FUELTYPE, FUELWHERE (refueling location), and LP_FUELCONT (whether a leased vehicle's agreement includes a fuel contract). It does **not** contain FUELCOST, FUELCOSTPER, or FUELCOSTYEAR, and no field supplies gallons consumed or fuel spend. Therefore VIUS cannot yield fuel dollars per mile.

## 5. Annual mileage estimates (Census-weighted)

| Domain | Weighted annual vehicle miles | CV of annual miles | Weighted mean annual miles/vehicle | CV of mean |
|---|---:|---:|---:|---:|
| All Box trucks | 24.812 billion | 2.89% | 18,839 | 2.66% |
| GVWR 3–8 | 21.594 billion | 3.52% | 18,858 | 2.83% |
| Goods activity 11/12/13 | 11.758 billion | 3.82% | 18,665 | 3.28% |
| Furniture primary product 23 | 1.066 billion | 10.65% | 15,809 | 9.88% |

The furniture subset has materially higher uncertainty and only 303 PUF records. Annual miles describe annual vehicle utilization, not the duration or speed of a particular move. Weighted mean annual miles among valid records should not be converted into trip hours without separate evidence.

## 6. Loaded, deadhead and repositioning fields

All percentages below are weighted means among records with a numeric response only; missing/not-applicable records are not treated as zero.

| Field | Census dictionary meaning | Box-truck valid records / weighted coverage | Weighted mean | Furniture subset valid records / weighted coverage | Weighted mean |
|---|---|---:|---:|---:|---:|
| LOADEDPCT | Share of 2021 annual miles carrying products, tools, equipment or materials | 2,983 / 45.5% | 77.84% | 301 / 99.4% | 69.85% |
| DEADHEADPCT | Share of annual miles driven empty directly back to home base | 1,816 / 27.7% | 22.41% | 229 / 81.3% | 24.81% |
| REPOSITIONPCT | Share of annual miles driven to reposition an empty vehicle for the next load | 1,851 / 28.2% | 12.09% | 230 / 81.2% | 13.61% |

The guide explicitly warns that DEADHEADPCT and REPOSITIONPCT may have high nonsampling error and advises caution. Their applicability is limited to trucks with known empty miles. These are distinct survey concepts; do not add their averages or treat them as a complete universal empty-mile factor. LOADEDPCT also concerns loaded vehicle mileage, not shipment weight/volume utilization.

TRUCKLOADPCT is mileage share in truckload service (one shipment carried at a time); LTRUCKLOADPCT is mileage share in less-than-truckload service (multiple shipments carried at a time). They are only applicable to a narrow group of trucks primarily carrying goods/products belonging to another person/company with known loaded miles. Only 456 Box-truck records (7.6% weighted coverage) have numeric responses; the furniture subset has 112. The guide also warns of high nonsampling error. These fields are contextual evidence about freight service patterns, not direct estimates for dedicated household moves or consolidated household shipments.

## 7. MPG: do not use as a model coefficient

MPG is present, but the Census guide explicitly lists the method used to calculate MPG among information not provided in the PUF. It is nonmissing for 3,719/6,039 Box-truck records (61.6% by record count; 56.3% weighted coverage). A weighted mean can be calculated mechanically, but without the documented calculation method, vehicle configuration, and operating conditions, it is not accepted as a reliable fuel-economy coefficient for a moving truck. No MPG CV is reported.

## 8. Maintenance and repair cost bands

The only PUF variables with “COST” in their names are GM_COST and ER_COST. Both are **categorical 2021 annual cost bands**, not continuous per-mile costs.

Among Box trucks with a numeric reported category (excluding “not applicable” and “not reported”):

- GM_COST (total general maintenance): 4,024 records, weighted estimate 821,564.5. Weighted distribution: <$100 1.49%; $100–499 13.20%; $500–999 12.23%; $1,000–1,999 19.07%; $2,000–4,999 28.66%; $5,000–9,999 16.74%; $10,000+ 8.60%.
- ER_COST (total extensive repairs): 1,557 records, weighted estimate 326,138.3. Weighted distribution: $501–999 10.21%; $1,000–1,999 20.25%; $2,000–4,999 36.17%; $5,000–9,999 20.79%; $10,000–19,999 10.10%; $20,000+ 2.49%.

These bands can be retained as a historical plausibility check for annual maintenance/repair burden, with the exact 2021 period and survey scope disclosed. They cannot be converted to a 2026 per-mile rate without a valid conversion method, and they do not include a complete ownership-cost model. The PUF has no directly usable insurance, depreciation/capital, financing, driver-hour, or overhead cost coefficient.

## 9. What the experiment may and may not use

**Potentially useful, with labels and limitations:**
- Weighted distribution of Box-truck GVWR classes for sensitivity and vehicle-class framing.
- Fuel-type mix to decide which EIA fuel-price series to investigate; not fuel consumption.
- Weighted annual miles/vehicle as an annual utilization descriptor.
- 2021 maintenance/repair bands as a broad historical sanity check, not a per-mile coefficient.
- Loaded/deadhead/repositioning and truckload/LTL fields as exploratory context only, with restricted coverage and high nonsampling-error warnings.

**Not supported by VIUS alone:**
- A 2026 fuel-economy or fuel-cost-per-mile coefficient.
- A universal empty-return or repositioning multiplier.
- A household-mover fleet profile or residential move shipment utilization rate.
- Vehicle operating cost per mile, daily truck ownership cost, or cost per pound-mile.
- Driver speed, driving hours, crew size, loading/unloading hours, idle time, or labor cost.
- A direct dedicated-versus-consolidated household-moving cost differential.

## 10. Recommended next research step

Keep the experimental model separate. Use VIUS only for the descriptive inputs above. Obtain independent, current sources matched to the exact vehicle class for fuel consumption and non-fuel operating costs; obtain BLS local occupational wage data and a separate, explicit employer-burden assumption for labor; source truck usable cargo volume and payload from a consistent representative vehicle specification. Continue to leave any unsupported parameter unresolved. Do not change production coefficients or publish these VIUS results as a national household-moving cost study.

## Reproducibility note

The weighted tables were calculated from the supplied CSV and data dictionary. Vehicle counts, annual miles and average annual miles use the Census formulas and random-groups method described in the cited Data User Guide. Other descriptive weighted percentages are weighted distributions/means among valid records; no sampling CV is claimed for them. The PUF is a public-use survey file, not a direct census of moving companies.
