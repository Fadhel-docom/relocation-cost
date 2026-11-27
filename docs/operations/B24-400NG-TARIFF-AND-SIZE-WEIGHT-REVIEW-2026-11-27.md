# B24/B15 — 2026 400NG tariff and shipment-weight evidence review
**Date:** 2026-11-27  
**Status:** research only. No production use, price/coefficient changes, or calculator changes.

## Executive finding

Two useful primary-source findings are now established:

1. The current 2026 U.S. Department of War / Coast Guard Domestic 400NG tariff is effective **15 May 2026 through 14 May 2027**. Its rating method uses shipment weight, pickup date, origin/destination ZIP3-derived base point cities, and mileage. This confirms that a real household-goods tariff can be weight-and-distance based, with date and geographic factors.
2. The U.S. Department of State's 14 FAM provides an itemized household-effects inventory guide with average cubic feet and average estimated net weight per item. It is a defensible starting source for an **itemized inventory estimator**, not a source for converting bedroom count or our existing size multipliers directly into shipment weight.

Neither source supplies a general consumer moving-price coefficient for Relocation Cost. The 400NG is a government-program tariff, and the 14 FAM table is a guide based on average item weights, not a population-wide household-size dataset.

## 1. Current 400NG tariff — verified rules, not consumer prices

**Primary source:** USTRANSCOM / Defense Personal Property Program, [Domestic 400NG Tariff – 2026 (PDF)](https://media.defense.gov/2026/Apr/10/2003911212/-1/-1/0/2026%20400NG%20%285%20DEC%2025%29%20FINAL.PDF).

Verified in the official tariff:
- The tariff is explicitly for Department of War and Coast Guard personal-property movements and is effective 15 May 2026–14 May 2027.
- Item 56 states transportation charges for household goods are based on actual weight or an applicable minimum weight/volume, and specifies a **1,000 lb net minimum** for HHG when the tariff's minimum provisions apply.
- Appendix A says correct rating requires shipment weight, pickup date, and origin/destination ZIP codes. ZIP3 maps to base point cities; the mileage between those cities and shipment weight/pickup date determine baseline linehaul cost.
- Linehaul and storage-in-transit discounts apply to baseline amounts. Peak-season charges apply to pickups May 15–September 30.
- The tariff points to a separate 2026 '400NG Baseline Rates' ZIP file for the actual baseline dollar tables and accessorial charges.

**Critical limitation:** this is not a public retail moving tariff and not a representative sample of civilian household-mover quotes. It is a government program's tariff/rating framework. Do not transfer its dollar amounts, discount rates, 1,000 lb minimum, seasonal rule, or route factors into the consumer calculator as market prices or universal moving-industry rules.

**Baseline-file retrieval status:** the official USTRANSCOM document page lists '400NG Baseline Rates.zip' under 2026 Business Rules (174.41 KB), but the page fetch timed out and did not expose a direct downloadable file URL in this review. The ZIP itself, its workbook sheets, baseline dollar tables, and applicable discount levels were **not retrieved or audited**. Official listing: [USTRANSCOM DP3 documents page](https://www.business.ustranscom.mil/dp3/pdfs.cfm). This subtask remains open; do not claim the baseline rates have been reviewed.

### What this evidence can and cannot do

- **Can do:** establish weight + mileage + pickup date + geography as a documented government tariff-rating architecture; identify a potentially useful independent comparator for future structural model checks.
- **Cannot do:** establish a consumer market rate, a household-mover box-truck cost per mile, a shared-load allocation coefficient, or a size-to-weight conversion.
- **Decision:** keep 400NG as a methodological reference only. Do not calculate or publish a Relocation Cost price from it.

## 2. Size-to-weight evidence — State Department itemized inventory guide

**Primary source:** U.S. Department of State, [14 FAM 612.3-1 — Estimating Weights and Exhibit 612.3-1](https://fam.state.gov/FAM/14FAM/14FAM0610.html).

The current text of 14 FAM 612.3-1 (CT:LOG-418, 5 June 2025) says:
- Exhibit 612.3-1 is a guide to estimating net shipment weight before packing and lists household effects commonly used to furnish a residence.
- Listed weights are **averages and a guide**, not guaranteed values.
- The exhibit supplies average cubic feet per item as an indication of item size and average estimated net weight.
- For articles not listed, 7 lb/cu ft may be used as a general estimate.
- Actual shipment weight should be determined by scale where possible; a mover's pre-move survey estimate is another tool.

The exhibit contains item-level entries across living rooms, dining rooms, bedrooms, nurseries, kitchens, appliances, outdoor equipment and sports equipment. Examples include:
- 3-cushion sofa: 50 cu ft / 350 lb;
- queen bed including spring and mattress: 40 cu ft / 200 lb;
- king bed including spring and mattress: 70 cu ft / 400 lb;
- large wardrobe: 40 cu ft / 280 lb;
- refrigerator 11 cu ft and over: 60 cu ft / 420 lb.

These examples show why an itemized inventory can estimate both volume and weight more meaningfully than bedroom count alone. They are illustrative source values, not a complete household bill of lading or a guarantee of an actual shipment.

### What remains unsourced

The State Department table does **not** publish:
- average total shipment weight by studio/1BR/2BR/3BR/4+BR;
- a conversion from our current size multipliers (1, 1.35, 1.8, 2.4) to pounds or cubic feet;
- population distributions for furniture ownership, item counts, household occupancy, or packing density;
- a matched consumer moving quote dataset linking those inventory weights to prices.

Therefore, do not create a fixed bedroom-to-pound mapping from this table. A defensible next study would define transparent, editable item-count scenarios, calculate itemized weight and cube from the FAM guide, label all item counts as assumptions, and validate the scenarios against independent real shipment records before any production use. It should preserve separate weight and cube totals rather than collapse them into one unsupported scalar.

## 3. Four omissions raised in Claude's PR #304 review

Add these to the excluded-cost register; the evidence status is deliberately conservative:

| Component | Current evidence status | Treatment |
|---|---|---|
| Long-haul crew lodging and meals | No matched mover-per-move source or rate located in this review | Keep excluded; do not substitute government per-diem rates as commercial mover costs |
| Paid road time of a second crew member | No matched per-move paid-time dataset located | Keep excluded; do not infer second-person hours from driver travel time |
| Sales, marketing, and customer acquisition | No project-fit household-mover cost-per-move allocator located | Keep excluded; no generic marketing percentage |
| Protective equipment (pads, dollies, straps) | 2026 400NG weighing rules require pads, dollies, hand trucks, ramps and other transport equipment to be present at tare/gross weighing; this confirms equipment use, **not** its purchase, replacement, depreciation, or per-move cost | Keep excluded pending matched fleet equipment inventory, useful life, replacement cost, and utilization evidence |

## 4. Research decisions

1. Do not treat 400NG as civilian consumer price evidence.
2. Do not use the 1,000 lb 400NG minimum as a general household-moving minimum.
3. Do not map bedrooms or current size multipliers to weight using an unsupported average.
4. Use the 14 FAM item table only as an item-level estimation reference with clear limitations.
5. Keep cube and weight as separate capacity dimensions; neither alone captures loading geometry or legal payload.
6. Do not resume crew-hour research until the existing review gate is satisfied.
7. No production code, calculator formula, price, coefficient, route data, API call, or deployment changed.

## 5. Next steps / open evidence

- Retrieve the official 2026 400NG Baseline Rates ZIP from the USTRANSCOM document page, inspect workbook sheets and metadata, and record the actual rate tables and discount fields. If access remains blocked, record the exact technical failure and leave this subtask blocked.
- If the file is successfully retrieved, use it only to understand the government tariff structure; explicitly document why its prices are not consumer-market calibration data.
- Design a research-only inventory scenario using FAM item-level average weights and cubic feet, with item counts labelled as assumptions. Do not map scenarios to bedroom categories until independent shipment records validate them.
- Seek anonymized household-goods shipment records containing actual shipment net weight and cube, household size/room count, and route. Without these, no bedroom-to-weight calibration is authorized.
- Claude should review the source interpretation and the proposed boundary between itemized inventory estimation and bedroom-size mapping.

## Sources
- USTRANSCOM, [Domestic 400NG Tariff – 2026 (effective 15 May 2026–14 May 2027)](https://media.defense.gov/2026/Apr/10/2003911212/-1/-1/0/2026%20400NG%20%285%20DEC%2025%29%20FINAL.PDF), especially Item 56 and Appendix A.
- USTRANSCOM, [DP3 document library](https://www.business.ustranscom.mil/dp3/pdfs.cfm), which lists the 2026 400NG Baseline Rates ZIP.
- U.S. Department of State, [14 FAM 612.3-1 and Exhibit 612.3-1](https://fam.state.gov/FAM/14FAM/14FAM0610.html).


## Claude review — 2026-11-27
**Accepted as research, with these limits.**
- Verified by Claude (14 FAM page, read 2026-11-27): paragraph CT:LOG-418 dated 06-05-2025, the 7 lb/cu ft sentence for unlisted articles, and the five example rows (sofa 50/350, queen bed 40/200, king bed 70/400, large wardrobe 40/280, refrigerator 11 cu ft and over 60/420).
- NOT verified by Claude: every 400NG statement (the official PDF could not be fetched from this session).
- Omission: draft PR #305 (one day earlier, same task) recorded two things this report does not: (1) the direct official XLSX address `https://media.defense.gov/2026/May/14/2003930419/-1/-1/0/400NG%20BASELINE%20RATES.XLSX` (HTTP 403 reported there; not re-tried by Claude), so "no direct URL" above is superseded; (2) Washington UTC Tariff 15-C volume-to-weight rule (intrastate only, not verified here). #305 also says the 400NG 7 lb/cu ft passage applies only to professional books and equipment.
- Recommendation: **park B26's workbook retrieval.** The tariff is government-only, discounts are unknown, and the dollar tables cannot become consumer prices under our own rules. Do not ask the owner to fetch it.
- Recommendation: no further B24 source research until there is a data source that could change a price (matched shipment records or comparable quotes). None is identified today.
