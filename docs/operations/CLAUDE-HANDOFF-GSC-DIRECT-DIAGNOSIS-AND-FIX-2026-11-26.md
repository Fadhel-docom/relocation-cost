# Claude handoff — direct Google Search Console diagnosis and ownership of the fix
Date: 2026-11-26
Priority: URGENT — B25 indexing
Owner request: Claude has direct access to Google Search Console. Use it to obtain the actual Google-side evidence and take ownership of the investigation and any justified fix. Do not ask the owner for screenshots/exports that Claude can retrieve directly.

## Why this is being handed over
The indexing problem has persisted for about a month. The owner wants Claude to work directly in the connected Google account, diagnose the cause and carry the work through to a verified outcome.

Latest owner-provided GSC evidence (2026-11-26):
- Page indexing overview: 22 indexed / 94 not indexed in the screenshot. Owner later described the current indexed count as approximately 24; use the live property value, not the screenshot as a permanent count.
- Reason groups: 93 "Detected, currently not indexed"; 1 "Another page with the correct canonical tag"; 0 "Explored, currently not indexed".
- The 93-group validation is Started (start date 2026-10-20; report last updated 2026-11-16).
- All 93 visible examples display "Latest exploration: Not applicable".
- Examples span core pages (including /calculator/ and /methodology/), guides, state routes and city routes. All shown examples use https://relocation-cost-psi.vercel.app/.

Interpretation: this is evidence of discovery without recorded exploration in the displayed report. It does not prove Google crawled and rejected the content or identify why fetching has not been scheduled.

## Already completed — do not repeat
1. The verified GSC property is https://relocation-cost-psi.vercel.app/. Sitemap index and child sitemap previously each showed 115 submitted URLs, 0 errors/warnings.
2. Earlier URL Inspection showed homepage and selected route pages indexed/PASS; /calculator/, /methodology/ and some guides were "URL is unknown to Google" at that time. Recheck live state.
3. Source audit on main found 50 state-route pages and 44 city-route pages; both hubs link all routes. Homepage links featured routes and both hubs. State templates cross-link related state routes, reverse routes and up to 8 city routes. City templates link 5–13 related city routes plus hub and matching state route where available. Guide navigation links calculator, sibling guides, sample routes and route hub. Shared layout supplies global navigation.
4. Therefore do not assume the route network is globally orphaned and do not mass-add generic links.
5. Ahrefs previously reported 94 pages with one dofollow incoming internal link. Exact target URLs and referring/source URLs have not been matched to GSC's 93 examples. Similar counts are not proof of overlap.
6. No production SEO/code/content/sitemap/canonical/robots change has yet been justified. Do not mass-submit 94 URLs or resubmit sitemap merely to create activity.

## Claude — take direct ownership

### A. Retrieve live Google evidence directly
Use the connected GSC account and exact property https://relocation-cost-psi.vercel.app/. Do not ask owner to collect what your connection can retrieve.

1. Open live Indexing → Pages. Record current totals, all reason groups, counts, validation states/dates and changes since 2026-11-16.
2. Open the 93-item Detected, currently not indexed group. Retrieve the complete URL list/export if GSC provides it; if only examples are available, state the limit and record all available examples.
3. Inspect the one alternate-canonical URL. Record exact URL, user-declared canonical, Google-selected canonical, indexing state and final destination.
4. Inspect representative URLs: homepage, calculator, methodology, one guide, one state route, one city route and the alternate-canonical URL. For each capture URL Inspection verdict, indexing state, last crawl date (or absent), crawl allowed, fetch result, indexing allowed, user-declared and Google-selected canonical, referring/discovery source if available, and sitemap membership.
5. Check Crawl stats for the property/date range: Googlebot requests, response codes, host status, response times, crawl demand/refresh patterns and host availability issues. Separate observations from inference.
6. Check Search Console messages, manual actions and security issues if accessible. Report only what is actually shown.
7. Check sitemap entries and processing/download timestamps. Verify that sitemap URLs are canonical production URLs and whether GSC examples appear in the sitemap. Do not treat deprecated sitemap API indexed=0 as the site's index count.

### B. Reconcile Ahrefs/internal-link evidence
1. Retrieve the 94 Ahrefs affected-page URLs and each referring/source URL if connected Ahrefs access permits.
2. Match Ahrefs targets against GSC's 93 examples, sitemap URLs and indexed URLs where available.
3. Report exact overlap count and URLs, non-overlap count and page type.
4. If Ahrefs is not connected/unavailable, say so and continue with GSC. Do not block the investigation waiting for owner input.

### C. Verify deployed website, not only repository source
1. Fetch live production homepage, calculator, methodology, one guide, one state route and one city route with a browser/crawler that can retrieve the deployed response.
2. Check HTTP status, final URL/redirects, robots meta/header, canonical, sitemap inclusion, rendered HTML, crawlable anchors and whether important links are present in server-rendered HTML.
3. Check production robots.txt and generated sitemap XML.
4. If one fetch method fails, try a second independent method. Distinguish a proxy/tool limitation from an actual Googlebot response; do not claim a crawler 403 based on a blocked research proxy.
5. Compare production deployment commit/alias with main and verify the indexed property hostname exactly matches canonical/sitemap host.

### D. Diagnose, then fix and verify
1. Identify the most likely root cause and cite the direct evidence plus remaining uncertainty.
2. If a concrete defect is proven (sitemap mismatch, wrong canonical/redirect, missing deployed links, real crawl/host response issue, accidental robots/noindex, etc.), implement the smallest safe fix in a branch/PR, run appropriate build/SEO checks, deploy only after checks pass, and verify production.
3. If evidence indicates crawl prioritization/new-site demand and no technical defect, do not manufacture a code change. Recommend the smallest targeted intervention justified by the observed weak URLs and explain why it beats mass submissions/linking.
4. Request indexing only for a small number of highest-value corrected/verified URLs if available and quota permits. Do not repeat failed quota attempts or submit all 94.
5. Do not change calculator prices, formulas, route data or unrelated content.
6. Owner explicitly delegates routine read-only checks and any clearly justified low-risk fix to Claude. Do not wait for another owner instruction to proceed.

## Required result in operations room
Provide timestamp/time zone; live GSC totals and reason groups; 93-list/export availability and URLs inspected; exact alternate canonical; Crawl stats and sitemap facts; Ahrefs/GSC overlap or access limitation; root cause and evidence; PR/deployment/test results or evidence-based no-code decision; production verification and next measurable checkpoint.

The owner is asking for direct execution, not another request to provide screenshots/exports or repeat manual indexing. Use direct Google access and take this to a concrete diagnosis and justified action.
