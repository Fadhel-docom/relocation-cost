# B24/B15 — 2026 400NG tariff, Washington Tariff 15-C, and size-to-weight evidence
**Date:** 2026-11-26  
**Status:** research only. No production use, formula, price, or coefficient changes.

## Executive finding

- The current official 2026 Defense Domestic 400NG tariff was located and read. It is effective **15 May 2026 through 14 May 2027**.
- The official 2026 **400NG Baseline Rates** workbook was located in the Department of War Personal Property Activity resource center, but its media.defense.gov download returned HTTP 403 in this environment. The workbook's tables and discount levels therefore remain **unread / unverified**. Do not use or quote baseline amounts until the workbook is attached and inspected.
- Washington UTC Tariff 15-C provides a useful, explicitly limited bridge from measured cubic feet to a *constructive/estimated weight basis*: **at least 7 lb per cubic foot** for specified Washington intrastate household-goods estimates and circumstances. It does not establish actual shipment weights or a national bedroom-to-weight conversion.
- The calculator's four existing size options are volume bands, not measured weights. The 7 lb/cu ft rule can produce Washington-specific lower-bound/constructive-weight scenarios for those bands, but it does not authorize national weight assignments or production coefficients.
- No universal shared-load cost-allocation coefficient is established. Weight-and-distance tariffs show one way a carrier may rate an individual shipment without allocating the whole truck's costs by bedroom count; they do not prove consumer-market price equivalence.

## 1. Current official 400NG tariff

### Primary source and term
- Official 2026 Domestic 400NG PDF: https://media.defense.gov/2026/Apr/10/2003911212/-1/-1/0/2026%20400NG%20%285%20DEC%2025%29%20FINAL.PDF
- Official USTRANSCOM document page: https://www.business.ustranscom.mil/dp3/pdfs.cfm
- Official PPA resource-centre listing: https://www.ppa.mil/Industry-Government-Resource-Center/smdcat76928/PPCIG/smdpage76928/12/smdsort76928/publicationdate/
- The PDF states effective **15 May 2026 through 14 May 2027**.

### Relevant tariff mechanics
1. The 400NG uses shipment weight and mileage. Appendix A says the rating engine needs shipment weight, pickup date, origin/destination ZIP codes; ZIP3s map to Base Point Cities; mileage between those BPCs and shipment weight feed the baseline linehaul amount.
2. TSP linehaul and storage-in-transit discounts apply to baseline amounts. Seasonal charges also apply, including peak season dates (15 May–30 September).
3. Item 56 sets a **1,000 lb net minimum** for HHG transportation charges based on weight. This is a tariff minimum, not a conversion from bedroom count or a statement that every real shipment weighs 1,000 lb.
4. The 400NG contains a 7 lb/cu ft constructive weight only for **Professional Books, Papers, and Equipment (PBP&E)** when scales are not readily available. It also gives a separate 25 lb/cu ft rule for gun safes without a data plate. These are article-specific provisions, not a general whole-household-shipment density conversion.
5. The tariff is a DoW/Coast Guard government-program tariff. It is not a retail consumer quote dataset or a direct market-price estimate for Relocation Cost.

### Baseline Rates workbook — located, not downloaded
- Listed as **“400NG Baseline Rates – 2026”**, publication date 12/5/2025, by the official PPA resource center.
- Official file URL exposed by that listing: https://media.defense.gov/2026/May/14/2003930419/-1/-1/0/400NG%20BASELINE%20RATES.XLSX
- Download attempt failed with HTTP 403 from the official host. No alternative/third-party copy was substituted.
- Consequently, no workbook sheets, baseline values, route/weight cells, discounts, or rating calculations have been inspected. Request owner to attach this exact XLSX so it can be read locally.
- Even after workbook inspection, do not translate baseline amounts into consumer estimates without a source for the relevant TSP discounts and a documented comparison of service scope.

## 2. Washington UTC Tariff 15-C — source-backed volume/weight link

### Primary sources and scope
- Official Tariff 15-C PDF (effective 1 Jan 2026): https://www.utc.wa.gov/sites/default/files/2026-01/Tariff%2015-C%20TV-250890.pdf
- UTC mover tariff page: https://www.utc.wa.gov/MovingCompanies
- UTC docket TV-260270 (2026 tariff supplements): https://www.utc.wa.gov/casedocket/2026/260270
- Tariff scope is household-goods transportation **between points within Washington State**. It is not a national rule and does not apply to interstate CA→TX-type routes.

### Relevant provisions
- Tariff definition of “Constructive Weight”: **7 pounds per cubic foot of properly loaded van space occupied by the customer's goods**.
- Item 85 requires a long-distance estimate to include estimated total shipment weight and an explanation of the formula; the formula may not be based on less than **7 lb per cubic foot**.
- Item 115 says long-distance tariff charges use net shipment weight plus applicable additives; the carrier must use certified tare/loaded weights. Constructive weight may be used only if no certified scale is available at origin, along the route, or at destination.
- Tariff mileage rates are weight-based; the tariff explains that actual transportation charges are shipment weight multiplied by the applicable rate.
- The tariff's current 2026-3 supplement was authorized 29 Oct 2026: 7.1% increase to the top band, effective 1 Nov 2026 through 31 Jan 2027. This updates applicable tariff rates; it does not alter the 7 lb/cu ft measurement concept.

### What the calculator's existing volume bands imply under this Washington-only rule

The current calculator source labels are:
- Studio / 1 bedroom: **under 400 cu ft**
- 2 bedrooms: **400–800 cu ft**
- 3 bedrooms: **800–1,200 cu ft**
- 4+ bedrooms: **1,200+ cu ft**

Applying 7 lb/cu ft to the *measured cube* gives these tariff-specific lower-bound bands:

| Existing calculator volume band | 7 lb/cu ft arithmetic | Interpretation |
|---|---:|---|
| Under 400 cu ft | below 2,800 lb at the upper boundary; actual floor depends on actual measured cube | Not a single weight estimate |
| 400–800 cu ft | 2,800–5,600 lb | Washington constructive/estimate basis only |
| 800–1,200 cu ft | 5,600–8,400 lb | Washington constructive/estimate basis only |
| 1,200+ cu ft | 8,400 lb and above | Washington constructive/estimate basis only |

**Important precision:** these are arithmetic translations of the tariff's 7 lb/cu ft rule, not observed average household weights, not certified net weights, and not a nationwide conversion. The first band cannot be represented as a fixed 2,800 lb minimum because the volume may be far below 400 cu ft. The boundaries are not independent weight observations.

## 3. Federal rule — why no universal bedroom-to-weight coefficient follows

- 49 CFR §375.507(c) requires a written explanation when a mover converts volume-based estimates into weight-based rates.
- 49 CFR §375.405 requires reasonably accurate nonbinding estimates based on estimated weight or volume, services required, and physical survey where required; where volume is later converted to weight, the formula must be explained in writing.
- These federal rules require transparent, shipment-specific conversion; they do **not** prescribe a universal 7 lb/cu ft density or a bedroom-count-to-weight schedule.
- A bedroom label is not an inventory, measured cubic-foot quantity, or scale ticket. The current calculator volume bands can be a user-entered/selected planning proxy, but cannot be represented as verified shipment weight.

## 4. Research decision for B24/B15

1. **Best sourced conceptual link:** actual measured shipment cube → applicable jurisdiction/carrier tariff's documented volume-to-weight formula → shipment weight basis. Washington 15-C supplies a concrete 7 lb/cu ft rule, but only for Washington intrastate tariff use.
2. **400NG alternative:** obtain actual/estimated shipment weight and route mileage; rate each shipment independently through its tariff's baseline schedule, then apply the relevant program discounts/accessorial rules. This avoids inventing a shared truck cost split for that tariff context.
3. **No nationwide size-to-weight mapping is sourced.** Do not turn the four calculator bands into fixed pound values, do not apply Washington's 7 lb/cu ft nationally, and do not treat 400NG's 1,000 lb minimum as a shipment-weight conversion.
4. **No shared-load coefficient is authorized.** 400NG and Tariff 15-C are pricing systems for defined jurisdictions/programs, not proof of how private movers allocate fuel, driver, or vehicle cost pools.
5. **No production changes.** No calculator code, formula, size option, displayed price, coefficient, route data, API call, or deployment changed.

## 5. Unresolved evidence / next action
- Owner to attach the official **400NG Baseline Rates – 2026.xlsx** because the official host returned HTTP 403 here. After upload: inspect workbook sheets, relevant linehaul tables, geographic schedules, weight/mileage bands, and any separate discount/rating inputs; record sheet/cell citations and limitations.
- Do not ask Claude to derive consumer prices from the baseline file until the official tariff and workbook are jointly understood and a source exists for TSP discounts/service-scope comparability.
- If the business needs a US-wide weight proxy, the next defensible dataset must link measured shipment inventories/cube to certified shipment weights across a representative sample of household-goods moves. No bedroom-count proxy is approved by the sources reviewed here.

## Sources
- USTRANSCOM, 2026 Domestic 400NG Tariff (effective 15 May 2026–14 May 2027): https://media.defense.gov/2026/Apr/10/2003911212/-1/-1/0/2026%20400NG%20%285%20DEC%2025%29%20FINAL.PDF
- USTRANSCOM 400NG document listing: https://www.business.ustranscom.mil/dp3/pdfs.cfm
- PPA official listing for 2026 400NG Baseline Rates: https://www.ppa.mil/Industry-Government-Resource-Center/smdcat76928/PPCIG/smdpage76928/12/smdsort76928/publicationdate/
- 2026 400NG Baseline Rates XLSX (download blocked here): https://media.defense.gov/2026/May/14/2003930419/-1/-1/0/400NG%20BASELINE%20RATES.XLSX
- Washington UTC, Tariff 15-C: https://www.utc.wa.gov/sites/default/files/2026-01/Tariff%2015-C%20TV-250890.pdf
- Washington UTC, docket TV-260270 / supplement history: https://www.utc.wa.gov/casedocket/2026/260270
- 49 CFR 2025, §375.405 and §§375.507–375.509: https://www.govinfo.gov/content/pkg/CFR-2025-title49-vol5/xhtml/CFR-2025-title49-vol5-subtitleB.html

## Claude review requested
- Confirm tariff interpretation and that the 400NG 7 lb/cu ft passage is article-specific, not a whole-shipment rule.
- Challenge the Washington Tariff 15-C scope and 7 lb/cu ft use; verify supplement 2026-3 against the official order.
- Independently assess whether any public source supports a US-wide conversion from the calculator's four volume bands to household shipment weights.
- Inspect the 2026 Baseline Rates workbook after the owner supplies it; do not substitute third-party copies.
- Keep research-only: no crew-hour extension, no production changes, no calculator formulas, prices, or coefficients.
