# Canada research handoff — R-CA-3, R-CA-5 and R-CA-6
**Date:** 2026-11-03 · **Reviewer:** ChatGPT  
**Scope:** official-source research and product decisions only. No Canada calculator, pricing coefficients, pages, deployment or indexing changes.

## Executive decisions
- **R-CA-3 — labour hours and truck fuel by home size:** no authoritative Canadian public dataset was found mapping bedrooms/household size to professional moving labour hours or moving-truck fuel use. Keep labour hours and truck fuel consumption as user inputs; do not invent national per-bedroom coefficients. Provider-published local-move ranges may be shown later as attributed examples, not national defaults.
- **R-CA-5 — reuse terms:** Statistics Canada and CMHC both permit commercial reuse and value-added products subject to different attribution and downstream conditions. Their licences are not interchangeable. Use the exact adapted-data notice for each agency and check product pages for third-party material.
- **R-CA-6 — Québec language:** before actively carrying on business/offering services in Québec, provide a complete French version of commercial website content and French customer information/service. French must be clearly predominant in commercial advertising/public signage. Treat full French experience as a Québec market-entry gate, not a pre-Nov-5 task.

## R-CA-3 — moving labour hours and truck fuel by home size

### Evidence reviewed
1. NRCan's **2026 Fuel Consumption Guide** (published Feb. 4, 2026) provides model-specific consumption for current model-year light-duty vehicles; it does not provide moving-truck fuel rates by home size: https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/fuel-consumption-guide
2. NRCan's **Fuel Efficiency Benchmarking in Canada's Trucking Industry** reports 39.5 L/100 km for participating heavy-duty fleets in 1999, with up to 5 L/100 km seasonal variation. This is old freight-fleet evidence, not a current rental moving-truck specification and not segmented by household size: https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/fuel-efficiency-benchmarking-canada-s-trucking-industry
3. Canadian movers publish different local-move hours by bedrooms and crew, e.g. BOSS Moving (Vancouver) and Movers4You (GTA). These are provider-specific, local-move estimates, not national representative data:
   - https://www.bossmoving.ca/pricing
   - https://movers4you.ca/cost-estimator/
4. No official Canadian statistical series was found that converts bedrooms/household size into mover labour hours or litres of moving-truck fuel.

### Decision
- Keep **labour hours** user-entered (or explicitly selected as a user-controlled scenario).
- Keep **truck fuel consumption (L/100 km)** and fuel price as user inputs; route distance is a separate measured input.
- Do not infer fuel consumption from bedrooms. Bedrooms are a weak proxy for shipment volume, vehicle type, load, route, terrain, weather and driving conditions.
- If examples are later useful, show dated provider examples with location, crew size, local-move scope and source; never call them Canadian averages or use them as hidden universal coefficients.
- Do not use NRCan's 1999 39.5 L/100 km fleet benchmark as a current moving-truck default.

**Status: DECIDED — keep these variables as user inputs; no coefficient added.**

## R-CA-5 — Statistics Canada CPI and CMHC data reuse

### Statistics Canada Open Licence
Official licence: https://www.statcan.gc.ca/en/terms-conditions/open-licence  
Official FAQ: https://www.statcan.gc.ca/en/terms-conditions/open-licence-faq

The licence grants a worldwide, royalty-free, non-exclusive right to use, reproduce, publish, distribute or sell Statistics Canada information and value-added products. It requires accurate reproduction, no false endorsement/misrepresentation, and attribution. Third-party materials identified on the site are excluded and require separate rights review.

Required notices:
- Raw reproduction: `Source: Statistics Canada, name of product, reference date. Reproduced and distributed on an "as is" basis with the permission of Statistics Canada.`
- Adapted / incorporated into a value-added product: `Adapted from Statistics Canada, name of product, reference date. This does not constitute an endorsement by Statistics Canada of this product.`

The FAQ explicitly confirms commercial and non-commercial redistribution and sale of value-added products. For Statistics Canada-produced CPI tables incorporated into a calculator or derived chart, use the current StatCan Open Licence and adapted notice. Verify the individual product page for third-party content.

### CMHC licence
Official page: https://www.cmhc-schl.gc.ca/professionals/housing-markets-data-and-research/housing-data/cmhc-licence-agreement-use-of-data

CMHC grants a **revocable**, worldwide, royalty-free, non-exclusive licence to use, reproduce, publish, distribute or sell CMHC information and value-added products, subject to its terms. It requires accurate reproduction and source acknowledgment; no implied endorsement; no misuse of personal information; and downstream redistribution only if recipients agree to be bound by CMHC's terms. CMHC may require use to be limited or discontinued.

Required notices:
- Raw reproduction: `Source: Canada Mortgage and Housing Corporation (CMHC), name of product or information, reference date. This information is reproduced and distributed on an "as is" basis with the permission of CMHC.`
- Adapted / incorporated into a value-added product: `Adapted from Canada Mortgage and Housing Corporation, name of product or information, reference date. This does not constitute an endorsement by Canada Mortgage and Housing Corporation of this product.`

### Implementation guardrails
- Keep StatCan and CMHC source records separate; never apply one agency's notice to the other's data.
- Record dataset/product name, table or series ID, reference date, retrieval date and source URL.
- Keep source notices near any chart/table or in a clearly linked methodology/source register.
- Do not use official logos, crests or symbols without separate permission.
- If redistributing raw CMHC data, make downstream recipients subject to CMHC terms. Do not copy CMHC data into an open dataset without reviewing this condition.
- Both licences disclaim warranties; show dates and methodology and do not imply agency endorsement.

**Status: DECIDED — commercial reuse is permitted subject to the respective licence, attribution and product-specific third-party checks.**

## R-CA-6 — Québec French-language requirements

Official sources:
- OQLF, **Langue du commerce et des affaires** (updated June 3, 2026): https://www.oqlf.gouv.qc.ca/francisation/droits_linguistiques/droits/langue-du-commerce-et-des-affaires.html
- Québec's Charter of the French Language, official consolidated statute: https://www.legisquebec.gouv.qc.ca/en/document/cs/c-11
- OQLF website-enforcement examples:
  - https://www.oqlf.gouv.qc.ca/office/communiques/2023/20230526_infraction_fermos.aspx
  - https://www.oqlf.gouv.qc.ca/office/communiques/2026/202603227_infraction_vision_ctc.aspx

OQLF explains:
- Businesses operating in Québec must inform and serve customers in French.
- Commercial publications, including business website content, must be in French; consumers have a right to a complete French version of a business website.
- Adhesion contracts must be provided in French; another language may be used only where the French version exists, has been offered first, and remains available.
- French must be clearly predominant in commercial advertising and public signage.

### Relocation Cost action
Before launching a Québec-specific offer, ads, affiliate/commercial campaign or service flow:
1. Provide a complete French version of commercial website content, including calculator controls, results, methodology, disclosures, FAQs, navigation and relevant landing pages.
2. Ensure the French version is complete and easy to access.
3. Provide customer support and transaction-related information in French where applicable.
4. Review contracts/terms and commercial communications with Québec counsel or OQLF guidance before launch.
5. Treat this as a market-entry requirement, not a reason to translate all Canadian pages before the November 5 measurement gate.

**Status: DECIDED — a complete French experience is a prerequisite for Québec market entry.**

## Relationship to the current roadmap
- Canada remains first in the expansion sequence, after the 2026-11-05 GSC measurement gate and M1/M3a checks.
- This research does not authorize building a Canadian calculator, inserting default labour/fuel assumptions, publishing country pages, or starting a Québec campaign.
- Claude's R-CA-4 (Job Bank wages and Statistics Canada fuel-price series) remains a separate task.
