# R4 provider terms review — HeiGIT and FOSSGIS
**Date:** 2026-11-02 · **Reviewer:** ChatGPT  
**Scope:** public source review only; not legal advice. No API key, account dashboard, or new API request was accessed in this review.

## HeiGIT / openrouteservice

### Findings supported by current public sources
- **Commercial use:** a HeiGIT team member answered on 2026-10-12 that commercial usage is allowed under the Standard Plan. This is a direct staff statement in the official forum, but it is not a substitute for the account-specific Terms of Service or legal advice: https://ask.openrouteservice.org/t/free-plan-in-an-app-with-a-paid-tier-license-cc-by-sa-4-0-personal-data-and-attribution-questions/8079
- **Result licence:** the same staff reply explicitly says API results are licensed CC-BY-SA 4.0. The underlying OpenStreetMap data has its separate ODbL obligations. Do not label the entire output as ODbL-only.
- **Quota:** the official ORS FAQ documents the Standard Directions limit as 2,000 requests/day and 40 requests/minute. The daily window resets 24 hours after the first request, not necessarily at midnight. The FAQ says remaining quota can be checked with `x-ratelimit-remaining` and `x-ratelimit-reset` response headers: https://giscience.github.io/openrouteservice/v9.10.0/frequently-asked-questions
- **API-key handling:** the same FAQ says each key belongs to one person and must not be exposed client-side; requests should be proxied server-side or each end user should supply their own key. The project builder keeps the key in a GitHub Actions secret and does not print it.
- **Endpoint migration:** HeiGIT's 2026-04-28 migration announcement maps the old Directions endpoint to `https://api.heigit.org/openrouteservice/v2/directions`. The old host is scheduled for shutdown during 2026-11-02 to 2026-11-06; since 2026-08-27 it has only 10% of plan quota. New requests must use the new host: https://ask.openrouteservice.org/t/deprecating-api-openrouteservice-org-in-favour-of-api-heigit-org/7912 and https://ask.openrouteservice.org/t/reducing-the-quota-of-deprecated-api-api-openrouteservice-org/8013
- **Endpoint limits:** the published FAQ and restrictions describe a maximum 6,000 km route for driving Directions. This explains the AK|FL route-limit failure; it is not a quota issue.

### What remains unresolved
- The account Terms URL linked from the official FAQ (`https://account.heigit.org/info/tos`) returned no readable text in this review environment. The account page is a client-rendered app; the browser fetch returned zero lines. Therefore I cannot quote current Terms clauses on storage, caching, retention, redistribution, attribution placement, or the exact scope of share-alike obligations.
- The staff reply confirms the CC-BY-SA 4.0 licence but explicitly declines to interpret its legal consequences. It does not establish whether a derived distance lookup table used only as a calculator input makes the whole website or another dataset an Adapted Material.
- The staff reply confirms commercial use on Standard, but does not by itself resolve every possible monetisation arrangement or account-specific restriction. The owner should retain the exact reply and current dashboard plan evidence.
- Attribution is required, but the exact required text/placement for this product has not been verified from readable current API Terms. Do not treat a proposed credit line as a final legal determination.

## FOSSGIS public OSRM server
- The operator's public server page states: show required attribution and a "fix the map" link, use a valid User-Agent/referrer, maximum one request per second, and no scraping or heavy usage: https://routing.openstreetmap.de/about.html
- The full German terms page was blocked by an anti-bot challenge in this review: https://www.fossgis.de/arbeitsgruppen/osm-server/nutzungsbedingungen/
- Because the full terms could not be read and the project has commercial intent (including possible affiliate revenue), I cannot confirm that the public FOSSGIS server permits this use. Do not use it as a substitute provider.

## R4 decision
1. Keep the generated dataset isolated from production. Do not wire it into the calculator yet.
2. Current evidence supports that Standard permits commercial use and that the API output is CC-BY-SA 4.0; it does **not** settle all downstream storage/share-alike/attribution questions.
3. Do not make new batch requests. The dataset already contains 1,171 successful pairs from 1,220 Directions requests; quota remaining is unknown.
4. The two network failures may be retried by the reviewed workflow after its test passes; do not retry point-not-found or route-limit failures blindly.
5. Before public adoption, obtain a readable current Terms copy or written HeiGIT clarification on storing/reusing precomputed distance values, derived datasets, attribution placement, and the exact permitted commercial use. Keep straight-line distance as the production method until the separate 2026-11-05 measurement gate and 20-route validation.
