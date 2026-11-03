# US 18-city source/geography crosswalk — 2026-11-03

**Scope:** existing 18 US cities only. This is a source-matching and research-readiness audit, not a public city-page release or a claim that every series is already imported.

## Key decision

Do not join BEA, ACS, BLS and municipal data by city name alone. A displayed city is a principal-city label; most federal datasets describe a metropolitan statistical area (MSA), a county set, or a different metro vintage. Store source geography, vintage and source ID separately from the city slug.

## Source availability and rules

- **BEA RPP 2024:** the current comparison now uses the 2024 all-items and services: rents metro indices for all 18 existing cities. The rent component is an index, not a dollar rent or neighborhood quote. See [BEA RPP](https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area), [2024 table via FRED](https://fred.stlouisfed.org/release/tables?eid=233895&rid=403&snid=234317), and the repo verification report `BEA-METRO-RPP-2024-18-CITY-VERIFICATION-2026-11-03.md`.
- **Census ACS 2025 1-year:** released 2026-10-29; provides estimates for MSAs and places meeting the 65,000 population threshold. The 2025 geography reference distinguishes MSA/micropolitan area (310), principal city within an MSA (312), and metropolitan division (314). The 18 metro areas are large enough to be candidates, but exact 2025 CBSA/geo codes and table variables must be resolved from the 2025 geography and variable files before any data import. Prefer MSA-level median gross rent (B25064) for a broad metro rent context; do not label it as city rent. For a city-boundary measure, use place geography and label it separately.
  - [2025 ACS release notes](https://www.census.gov/programs-surveys/acs/news/data-releases/2025/release.html)
  - [2025 ACS 1-year API/data documentation](https://www.census.gov/data/developers/data-sets/acs-1year.html)
  - [2024 ACS geography reference showing 310/312/314 hierarchy](https://api.census.gov/data/2024/acs/acs1/geography.html) — use the corresponding 2025 geography reference for production extraction.
- **BLS OEWS May 2025:** metro occupational wage estimates are useful as local labor context only, not mover prices. BLS publishes area definitions and county/county-equivalent membership. Its area labels and boundaries do not always match the 2024 BEA names. Use the official [May 2025 MSA definitions](https://www.bls.gov/oes/current/msa_def.htm) and the associated wage table; retain the exact BLS area ID and definition vintage.
- **BLS CPI metro series:** the standard published metro CPI coverage includes 13 of our 18 city markets: Atlanta, Boston, Chicago, Dallas, Denver, Houston, Los Angeles, Miami, New York, Phoenix, San Diego, San Francisco and Seattle. It does not provide a standalone published metro CPI series for Austin, Charlotte or Nashville. Las Vegas and Portland appear as components of broader non-self-representing CPI basic-area aggregates, not as equivalent standalone metro series. Do not fabricate a metro CPI value for the five uncovered cities. CPI components are also more limited and local samples are smaller/more volatile than national CPI. [BLS regional CPI coverage](https://www.bls.gov/cpi/regional-resources.htm) and [CPI area aggregation/methodology](https://www.bls.gov/cpi/additional-resources/cpi-area-aggregation.htm).
- **EIA fuel prices:** use only the geography and frequency actually published (national, PADD, state or selected city/area series). Do not label a state or PADD value as a city price. Fuel spend still requires explicit route miles and vehicle fuel economy. [EIA gasoline and diesel prices](https://www.eia.gov/petroleum/gasdiesel/).
- **Municipal moving/parking rules:** must come from the official city/municipal authority, with the actual jurisdiction and date. An MSA-wide statistic cannot prove a city permit rule. No complete 18-city municipal-rule inventory has yet been verified.

## 18-city crosswalk

BEA names below are the 2024 metro labels currently stored in `data/cost-of-living.json`. BLS names are the May 2025 OEWS area labels found in the official BLS definitions. A changed label is a warning to verify county membership/CBSA IDs before joining—not proof by itself that the underlying geography is identical.

| Current city | BEA 2024 metro label | BLS May 2025 OEWS area label | Standalone metro CPI coverage |
|---|---|---|---|
| New York, NY | New York-Newark-Jersey City, NY-NJ-PA | New York-Newark-Jersey City, NY-NJ | Yes; verify the NY-NJ-PA vs NY-NJ county crosswalk |
| Los Angeles, CA | Los Angeles-Long Beach-Anaheim, CA | Los Angeles-Long Beach-Anaheim, CA | Yes |
| Chicago, IL | Chicago-Naperville-Elgin, IL-IN-WI | Chicago-Naperville-Elgin, IL-IN | Yes; BLS label omits WI |
| Houston, TX | Houston-The Woodlands-Sugar Land, TX | Houston-Pasadena-The Woodlands, TX | Yes; name/vintage changed |
| Phoenix, AZ | Phoenix-Mesa-Scottsdale, AZ | Phoenix-Mesa-Chandler, AZ | Yes; name changed |
| Dallas, TX | Dallas-Fort Worth-Arlington, TX | Dallas-Fort Worth-Arlington, TX | Yes |
| Austin, TX | Austin-Round Rock, TX | Austin-Round Rock-San Marcos, TX | No standalone metro CPI |
| San Francisco, CA | San Francisco-Oakland-Hayward, CA | San Francisco-Oakland-Fremont, CA | Yes; name changed |
| Seattle, WA | Seattle-Tacoma-Bellevue, WA | Seattle-Tacoma-Bellevue, WA | Yes |
| Denver, CO | Denver-Aurora-Lakewood, CO | Denver-Aurora-Centennial, CO | Yes; name changed |
| Miami, FL | Miami-Fort Lauderdale-West Palm Beach, FL | Miami-Fort Lauderdale-West Palm Beach, FL | Yes |
| Atlanta, GA | Atlanta-Sandy Springs-Roswell, GA | Atlanta-Sandy Springs-Roswell, GA | Yes |
| Boston, MA | Boston-Cambridge-Newton, MA-NH | Boston-Cambridge-Newton, MA-NH | Yes; cross-state metro |
| Las Vegas, NV | Las Vegas-Henderson-Paradise, NV | Las Vegas-Henderson-North Las Vegas, NV | No standalone metro CPI; appears in broader CPI aggregate |
| Portland, OR | Portland-Vancouver-Hillsboro, OR-WA | Portland-Vancouver-Hillsboro, OR-WA | No standalone metro CPI; appears in broader CPI aggregate |
| San Diego, CA | San Diego-Carlsbad, CA | San Diego-Chula Vista-Carlsbad, CA | Yes; name changed |
| Charlotte, NC | Charlotte-Concord-Gastonia, NC-SC | Charlotte-Concord-Gastonia, NC-SC | No standalone metro CPI; cross-state metro |
| Nashville, TN | Nashville-Davidson--Murfreesboro--Franklin, TN | Nashville-Davidson--Murfreesboro--Franklin, TN | No standalone metro CPI |

## What this means for the 18 city profiles

1. The 2024 BEA comparison is now refreshed for all 18. It improves broad relative price context but is not enough to call a city profile complete.
2. ACS is the strongest next source for a consistent 2025 MSA-level housing/rent context. Before importing: resolve the exact 2025 MSA codes and B25064 estimate/MOE/annotation fields, check the 2025 geography vintage, and preserve both estimate and margin of error. Where a city-place statistic is used, do not mix it with MSA statistics without visibly labeling the geography.
3. BLS OEWS can add occupational wage context where the correct May 2025 metro geography and occupation are available. It cannot be converted directly into a mover hourly rate or a moving-price coefficient.
4. BLS metro CPI can support a dated inflation/change context only for the covered markets; it is not a rent index or a mover-price series. The five gaps above must remain unavailable rather than be filled with an unrelated region.
5. Municipal truck/parking/permit details are a separate city-level research stream and must cite the responsible official authority.
6. Fuel prices must carry their actual geography, product, frequency and observation date.

## Pilot selection status

**No 2–3-city pilot is approved yet.** A defensible pilot should be selected only after the 2025 ACS extraction and geography crosswalk are verified, the BLS/BEA geography mismatches are resolved, and municipal-source availability is checked. Do not select cities simply because they are famous or have high BEA values.

## Current open work

- Resolve official 2025 ACS MSA codes and city-place codes for all 18; record source IDs and geography vintage.
- Extract and validate ACS median gross rent with estimate, margin of error, universe and year; compare MSA and place figures without conflating them.
- Match BLS May 2025 OEWS area IDs and occupational series to the city list; document any unmatched geographies.
- Verify city-specific official moving-truck/parking rules for a small candidate pilot.
- Only then score source completeness and choose the 2–3-city pilot.

## Limitations

This is a desk-level source and geography crosswalk based on the official BEA, Census, BLS and EIA pages linked above, checked 2026-11-03. It does not contain imported ACS rent observations, BLS wage values, fuel prices, municipal permit fees, or final CBSA codes. It is not an official statistical concordance file. No production data or city pages were changed.
