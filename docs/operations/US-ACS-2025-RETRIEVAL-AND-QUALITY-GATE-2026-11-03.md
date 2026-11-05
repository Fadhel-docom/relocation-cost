# ACS 2025 one-year rent-data retrieval and quality gate — 2026-11-03

**Scope:** research-only support for the existing 18 US city profiles. No production import or city-page change.

## Confirmed official acquisition route

The 2025 ACS 1-year release is available (released 2026-10-29) for MSAs and places meeting the 65,000 population threshold. The Census Bureau publishes a table-based 1-year Summary File containing detailed-table estimates and margins of error for all published geographies, plus a separate geography file and table list. This means the rent extraction does **not** depend on a Census API key.

Official references:
- [2025 ACS release notes](https://www.census.gov/programs-surveys/acs/news/data-releases/2025/release.html)
- [2025 ACS 1-year data documentation](https://www.census.gov/data/developers/data-sets/acs-1year.2025.html)
- [2025 ACS table-based Summary File page](https://www.census.gov/programs-surveys/acs/data/summary-file.2025.html)
- [2025 1-year Summary File data directory](https://www2.census.gov/programs-surveys/acs/summary_file/2025/table-based-SF/data/1YRData/)
- [2025 B25064 data file](https://www2.census.gov/programs-surveys/acs/summary_file/2025/table-based-SF/data/1YRData/acsdt1y2025-b25064.dat)
- [2025 ACS table shells and table list](https://www.census.gov/programs-surveys/acs/technical-documentation/table-shells.2025.html)

The Census FTP directory listing was inspected and explicitly lists `acsdt1y2025-b25064.dat` (196 KB). The 2025 Summary File page lists the matching 2025 1-year geography file (1.0 MB) and the 2025 ACS 1-Year Table List. The data file is therefore a specific, published source artifact—not an inferred filename.

## Table definition and fields

- Table: **B25064 — Median Gross Rent (Dollars)**.
- Universe: **renter-occupied housing units paying cash rent**.
- Estimate variable: `B25064_001E`.
- 90% margin-of-error variable: `B25064_001M`.
- Preserve estimate and MOE annotation fields where present (`B25064_001EA`, `B25064_001MA`) rather than coercing special values to zero.
- Keep the estimate in current-year USD/month; do not inflation-adjust silently.
- The MOE is the Census 90% margin of error, not a standard deviation or a 95% interval.

The table definition and universe are confirmed by the Census B25064 table metadata; the 2025 release documentation confirms the one-year geography threshold. The table-based Summary File documentation states that the detailed-table file contains both estimates and MOEs and is joined to geography labels using the geography file.

## Required extraction protocol

1. Read the 2025 geography file and identify exact MSA geography records and GEOIDs for the 18 target metro areas. Do not derive CBSA codes from city names or reuse a 2024/older metro vintage without checking.
2. Preserve the exact Census geography name, geography type, GEOID/CBSA code, state/county context where supplied, and the geography-file vintage.
3. Parse the B25064 data file using the Census 2025 table-based Summary File instructions—not ad-hoc fixed-width assumptions.
4. Join the table rows to the geography file by the official geography key; verify one and only one row per intended MSA.
5. Capture estimate, MOE, annotations, table ID, universe, source URL, release date, retrieval date, and geography vintage.
6. Check for null/suppressed/non-numeric values, duplicate joins, missing markets, and unexpectedly large MOEs. Never convert missing or suppressed values to zero.
7. Compare each result against the corresponding 2025 data.census.gov table view when possible. Retain a reproducible validation record.
8. If adding city-place values, keep them in a separate field and label them as place-boundary estimates. Never blend city-place and MSA estimates into one series.
9. Publish nothing until all 18 MSA joins and QA checks pass; if one or more markets fail, report coverage honestly and keep the rest unpublished until the product treatment is decided.

## What this closes—and what remains open

**Closed:** the official 2025 ACS release and the existence/location of the B25064 table-based data file, geography file and table list are verified. An API key is not a prerequisite for obtaining the data.

**Still open:** the 18 exact 2025 MSA GEOIDs, extracted estimate/MOE rows, the parser/join QA, optional place-level comparison, and approval to add the data to the site. The file was not downloaded or parsed in this session because the available runtime could not resolve the Census FTP host; no values have been guessed or imported.

## Product-use boundary

ACS median gross rent is a broad metro housing-cost context indicator for renter-occupied units paying cash rent. It is not a moving quote, a current apartment listing, a neighborhood rent, or a complete first-month housing cash requirement. It may enrich a city profile only if displayed with the year, geography, universe and uncertainty, and paired with practical explanation for a relocating household.
