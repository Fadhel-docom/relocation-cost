# GSC + Bing read-only refresh — 2026-11-11

Property: https://relocation-cost-psi.vercel.app/  
Window: Google Search Analytics 2026-10-13 through 2026-11-09 (latest available in this read).  
Scope: read-only. No indexing requests, URL submissions, sitemap submissions, site/formula/data changes.

## Google Search Console

- Search Analytics returned 461 impressions and 1 click across the date dimension (28 days); page and query dimensions each reconcile to 461 impressions.
- The only click remains 2026-10-31 on /moving-cost/co-to-wa/ (5 impressions; average position 21.4).
- Daily impressions rose from 18.6/day (2026-10-22..10-28) to 31.0/day (2026-11-02..11-08); this is a descriptive comparison, not causal evidence.
- 9 URLs had impressions: homepage 388; /moving-cost/ca-to-az/ 32; /moving-cost/ca-to-tx/ 11; /moving-cost/fl-to-ma/ 8; /moving-cost/fl-to-nj/ 8; /moving-cost/ny-to-pa/ 6; /moving-cost/co-to-wa/ 5; /budget-tracker/ 2; /moving-cost/fl-to-ny/ 1.
- Top query groups still show intent mismatch risk: relocation package calculator (62 impressions, position 34.1), relocation expenses calculator (34, 33.7), calculate relocation costs (28, 47.8), how to calculate relocation costs (25, 54.5), relocation compensation calculator (19, 53.7). Route-specific queries remain sparse and mostly positions 60–100.
- URL Inspection again returned "URL is unknown to Google" for /calculator/, /guides/checking-a-mover/, and /guides/relocation-budget/. The prior 2026-11-10 inspection for /guides/moving-cost/ was "Submitted and indexed"; not re-inspected in this pass.
- GSC lists sitemap-0.xml as successfully downloaded 2026-11-08, 115 submitted, 0 errors and 0 warnings. Its indexed count is returned as 0, but the API field is deprecated and conflicts with URL inspections / Search Analytics; do not interpret it as proof that zero pages are indexed. The sitemap index also reports the same deprecated count.
- The Page indexing report and the full list of 22 indexed URLs remain unavailable through this connection. The 22 figure remains the owner's earlier screenshot, not a current API result.

## Bing Webmaster Tools

- Main sitemap feed https://relocation-cost-psi.vercel.app/sitemap-0.xml: Success, 115 URLs, last crawled 2026-11-08 21:45:55 UTC.
- Legacy individually submitted paths /calculator/, /guides/moving-cost/, /moving-cost/, and / each report "The feed was empty" with 0 URLs. These are old feed submissions and are not the current sitemap; do not resubmit them.
- Crawl issues report returned no rows. Crawl stats are stale (latest returned date 2026-11-03); at that point Bing reported 46 in-index, 47 HTTP 2xx and 3 crawled pages that day. These are Bing-reported counters, not the 115 sitemap count.
- Submission quota endpoint returned capacity fields 100 daily and 2,000 monthly for URL and content submissions; these are quota limits, not remaining counters.
- URL Inspection for /calculator/ returned discovery 2026-11-08 and last crawl 2026-11-08 07:43:37 UTC, but http_status=0, document_size=0, anchor_count=0. This is insufficient to infer successful fetch or indexing. Homepage inspection metadata was similarly sparse and last crawl dated 2026-10-03.
- A read-only LIST_CHILD_URLS request for the root returned an empty items array without an error. Therefore the previous ErrorCode 17 was not reproduced on this single call, but the full URL list is still unavailable. Do not conclude the throttle is cleared or submit URLs until the child URL listing yields actual URL records and index status.

## Internal-link diagnosis and decision

- Source review of src/pages/index.astro confirms two direct links to /calculator/ in the homepage hero and an additional calculator link in the explanatory section via HOME_ANSWER_LINKS.calculator.href. src/pages/calculator.astro also links to the homepage through its breadcrumb and has links to methodology and relevant guides.
- Therefore, "no internal link to the calculator" is not supported by the current source. A live crawl / rendered link graph and GSC Page indexing examples are still needed to diagnose why Google reports the URL unknown.
- No production code, canonical, robots, sitemap, route data, formula or pricing changes. No repeated indexing requests or Bing submissions.
- Vercel Analytics counts were not read: the Vercel toolkit has no active connection. No conversion baseline or claim of improved calculator use.

## Next

1. Around 2026-11-12, rerun the same GSC Search Analytics window with the latest complete dates and inspect the three unknown URLs once.
2. Obtain the GSC Page indexing report / examples from the interface if still not exposed by the connector.
3. Retry Bing child URL listing only after this empty result; if it returns real records, paginate to exhaustion, classify indexed vs not indexed, and submit only eligible non-indexed URLs within quota.
4. Keep B3 open until actual Vercel Analytics event counts can be read and compared; do not enable/change analytics without approval.


## GSC follow-up — 2026-11-11 19:40 UTC

- Re-read the connected property `https://relocation-cost-psi.vercel.app/` (siteOwner). Sitemap index was downloaded 2026-11-11 18:53 UTC; child `sitemap-0.xml` downloaded 2026-11-08 21:45 UTC. Both report 115 submitted, 0 errors, 0 warnings, not pending. The API schema marks `contents.indexed` as deprecated; its returned value of 0 is not evidence that no URLs are indexed.
- Search Analytics 2026-10-11..2026-11-07: homepage 334 impressions; daily impressions reached 37 on Nov 7. The date series shows 12 on Oct 22 and 37 on Nov 7. This is evidence that Google Search activity is not completely stopped, although impressions do not prove fresh crawling.
- URL Inspection: homepage, /moving-cost/ca-to-tx/, /moving-cost/co-to-wa/, and /budget-tracker/ are all `Submitted and indexed`, fetch successful, indexing allowed, canonical matches user canonical. Last crawls: homepage Oct 21, CA→TX Oct 19, CO→WA Oct 12, Budget Tracker Oct 19. Referring URLs included /moving-cost/co-to-wa/ and /guides/moving-cost/ to homepage; /calculator/ to CA→TX; /moving-cost/ to CO→WA; and /moving-cost/ny-to-tx/ plus /checklist/ to Budget Tracker.
- /calculator/ still returns `URL is unknown to Google` in URL Inspection, despite crawlable standard HTML links from homepage and global navigation/footer in source. Treat as a real inconsistency to investigate, not proof of a broken link: the same URL appears as a referring URL for CA→TX.
- Source graph review: Layout.astro provides standard anchor links in the global header and footer to core tools/hubs; homepage links to calculator and featured state/city routes; /moving-cost/ lists every state route; /moving-cost/cities/ lists city routes; route detail pages link to the route hub, calculator and related routes. Core cluster architecture is structurally reasonable (hubs + contextual links), but this source review does not prove Google has crawled all 115 sitemap URLs or that every URL has sufficient incoming links.
- Current verdict: internal linking is not absent and does not look like the sole cause. The most actionable anomaly is /calculator/ being unknown despite clear HTML links. Need a rendered crawl/link graph for all sitemap URLs and the GSC Page indexing report; inspect URL Inspection again on/after Nov 12. No production edits or indexing requests made.
