# OPS-ROOM addendum — US-only continuation — 2026-11-03

**Actor:** ChatGPT  
**Workstream:** US market value; Claude is currently unavailable.  
**Branch:** `chatgpt/us-market-value-roadmap-20261103`  
**PR:** https://github.com/Fadhel-docom/relocation-cost/pull/173

## New verified finding: ACS 2025 rent-data acquisition

- Confirmed the official 2025 ACS 1-year release is available for MSAs and qualifying places (population threshold 65,000).
- Confirmed the official table-based ACS 1-year Summary File route. It contains estimates and margins of error and is accompanied by a 2025 geography file and table list.
- Confirmed the 2025 1-year FTP directory explicitly lists `acsdt1y2025-b25064.dat` (196 KB). The API key is not required if we use the official Summary File.
- Confirmed B25064 is Median Gross Rent (Dollars), universe: renter-occupied housing units paying cash rent. Preserve `B25064_001E`, `B25064_001M` and annotation fields.
- Created [US-ACS-2025-RETRIEVAL-AND-QUALITY-GATE-2026-11-03.md](US-ACS-2025-RETRIEVAL-AND-QUALITY-GATE-2026-11-03.md) with exact official source links, extraction protocol, validation rules and product-use boundary.

## What is and is not done

**Done:** official acquisition route, table file, table identity/universe and required estimate/MOE fields documented. This removes the mistaken assumption that an API key is a prerequisite.

**Not done:** download/parse of the FTP data, exact 2025 GEOIDs for the 18 metros, joined estimates/MOEs, QA, city-place comparison, or production import. The current execution runtime could not resolve the Census FTP host; no values were inferred or fabricated.

## Current PR state

PR #173's Vercel status changed from pending to success for head commit `c04a3783af23c6526f6729b5505525a372f6beb2`. GitHub metadata still reports `mergeable=false`; do not merge until the mergeability/base-branch issue is inspected and all required checks are confirmed. PR #174 is merged and its 18-city BEA 2024 update is in main.

## Handoff when Claude returns

1. Independently verify the ACS extraction procedure and implement a reproducible parser/QA script from Census's official 2025 Summary File documentation.
2. Resolve the exact 2025 MSA GEOIDs from the 2025 geography file; do not reuse old codes by name alone.
3. Extract all 18 B25064 estimate/MOE rows and validate against data.census.gov.
4. Continue the BLS May 2025 OEWS ID crosswalk and municipal-rule source checks.
5. Challenge the proposed 2–3-city pilot score before any pilot or public data change.

## Guardrails unchanged

US only. No new cities, public city pages, production data imports, calculator formula/coefficient/range changes, deployment, indexing requests, external outreach, or road-distance adoption. Do not mix in the separate Canada/UK/EU workstream.