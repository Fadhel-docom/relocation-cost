# 2024 BEA metro price-index refresh — 18-city verification
**Checked:** 2026-11-03  
**Scope:** Existing US city set only; no city expansion.  
**Purpose:** Refresh the cost-of-living comparison from 2023 metro data to the latest available 2024 metro-area BEA RPP release and expose the rent component separately.

## Source trail

1. BEA RPP landing page: https://www.bea.gov/data/prices-inflation/regional-price-parities-state-and-metro-area  
   It identifies the current release as February 19, 2026, states that metro-area RPP data is available, and defines RPP as price-level comparisons across states and metropolitan areas.
2. BEA MARPP 2024 data table, readable FRED release table: https://fred.stlouisfed.org/release/tables?eid=233895&rid=403&snid=234317  
   The table is titled Regional Price Parities (MSA), has a 2024 column and identifies the underlying data as BEA. The rows provide both “Regional Price Parities: All Items” and “RPPs: Services: Rents”.
3. BEA methodology: https://www.bea.gov/sites/default/files/methodologies/Methodology-for-Regional-Price-Parities_0.pdf

## Verified values

Values below are copied from the 2024 metro table. The first number is all-items RPP; the second is the services: rents component. Both are indices, not dollar amounts.

| Current city | 2024 metro geography in source | All items | Services: rents |
|---|---|---:|---:|
| New York | New York-Newark-Jersey City, NY-NJ-PA | 112.563 | 148.616 |
| Los Angeles | Los Angeles-Long Beach-Anaheim, CA | 113.566 | 170.433 |
| Chicago | Chicago-Naperville-Elgin, IL-IN-WI | 103.595 | 112.010 |
| Houston | Houston-The Woodlands-Sugar Land, TX | 98.629 | 104.510 |
| Phoenix | Phoenix-Mesa-Scottsdale, AZ | 103.316 | 121.236 |
| Dallas | Dallas-Fort Worth-Arlington, TX | 103.090 | 117.874 |
| Austin | Austin-Round Rock, TX | 98.066 | 120.361 |
| San Francisco | San Francisco-Oakland-Hayward, CA | 115.613 | 194.718 |
| Seattle | Seattle-Tacoma-Bellevue, WA | 111.133 | 151.314 |
| Denver | Denver-Aurora-Lakewood, CO | 105.782 | 146.919 |
| Miami | Miami-Fort Lauderdale-West Palm Beach, FL | 114.155 | 155.551 |
| Atlanta | Atlanta-Sandy Springs-Roswell, GA | 100.058 | 111.022 |
| Boston | Boston-Cambridge-Newton, MA-NH | 108.266 | 148.424 |
| Las Vegas | Las Vegas-Henderson-Paradise, NV | 100.215 | 115.538 |
| Portland | Portland-Vancouver-Hillsboro, OR-WA | 105.421 | 125.114 |
| San Diego | San Diego-Carlsbad, CA | 111.887 | 179.267 |
| Charlotte | Charlotte-Concord-Gastonia, NC-SC | 97.348 | 97.635 |
| Nashville | Nashville-Davidson--Murfreesboro--Franklin, TN | 96.338 | 104.626 |

## Geography and interpretation cautions

- These are metropolitan-area estimates assigned to the current city names. A metro may include multiple counties and states; it is not the city boundary.
- Metro names and definitions can change between vintages. The 2024 labels are preserved exactly as shown in the source table rather than silently retaining the 2023 labels.
- All-items RPP is a broad relative price-level measure. Services: rents is a relative rent-price component. Neither is a median rent in dollars, a neighborhood-level figure, an individual household budget or a moving-company quote.
- The rent component should not be described as “rent is X dollars” or as a guaranteed percentage change in a particular renter's bill.
- The comparison remains a contextual planning aid. It does not change moving-cost coefficients, estimate mover prices or justify city-specific moving-cost multipliers.

## Implementation scope

- Updated `data/cost-of-living.json` from 2023 to 2024 and added `housingRpp`.
- Updated the cost-of-living comparison logic and UI to display all-items and rent-component comparisons separately.
- Updated the manual source-monitor URL and verification date.
- Added tests that pin all 18 pairs of values and check the comparison calculations.
- No new cities, route estimates, moving-cost formulas, public city landing pages, deployments or indexing requests were introduced.

## Verification status

Vercel preview build status: checked separately on PR #174. Unit tests are included in the repository test script but were not run locally in this environment because the GitHub host could not be resolved from the execution container. Do not describe the test suite as passed until CI or a local test run confirms it.
