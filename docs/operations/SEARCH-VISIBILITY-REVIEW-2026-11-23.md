# Weekly search, indexing and usage review — 2026-11-23

Property: `https://relocation-cost-psi.vercel.app/`  
Repository: `Fadhel-docom/relocation-cost`  
Review window: Google 2026-10-24..2026-11-20 (latest final 28-day window returned); Bing through 2026-11-22; Vercel Analytics 2026-10-26..2026-11-22.

## Executive decision

**No production SEO or content change is justified by the evidence this week.** The highest-impact unresolved issue remains Google's unknown index state for `/calculator/` (and `/methodology/`), not a confirmed source-level canonical, robots or sitemap defect. The homepage is already explicitly titled for moving-cost and relocation-package calculator intent, has a first-screen route form and direct calculator links, and the calculator page has WebApplication/Breadcrumb structured data in source. A title rewrite, sitemap resubmission, mass URL submission, stale Bing-feed deletion or speculative internal-link change would not address a demonstrated cause.

Keep the existing product promise: an editable full relocation cash budget, including employer support and a separate cash buffer. Do not claim a more accurate mover quote than the data supports.

## Google Search Console

### Property and performance

The connected property is confirmed as the exact URL-prefix property above.

| Metric | 2026-10-24..2026-11-20 | Prior non-overlapping 28 days 2026-09-26..2026-10-23 |
|---|---:|---:|
| Impressions | 655 | 36 |
| Clicks | 1 | 0 |
| CTR | 0.153% | 0% |
| Average position | 44.05 | 61.64 |

The increase is from a very small baseline and does not establish a product-quality or ranking improvement. The prior weekly report used 2026-10-23..2026-11-19 (661 impressions); that window overlaps this one and is not a valid independent comparison.

The current result contains 55 query rows and 12 page rows. The homepage received 555 impressions (84.7% of the total) and no clicks. The only click was to `/moving-cost/co-to-wa/` (6 impressions, average position 18.5).

### Query-to-page mapping

The following high-impression generic and employer-support queries all resolve to the homepage in the query+page report:

| Query | Impressions | Average position |
|---|---:|---:|
| relocation package calculator | 82 | 32.23 |
| relocation expenses calculator | 43 | 32.40 |
| calculate relocation costs | 35 | 41.86 |
| calculating relocation costs | 33 | 49.18 |
| how to calculate relocation costs | 32 | 50.09 |
| relocation compensation calculator | 30 | 51.53 |
| relocation cost calculator | 25 | 39.00 |
| relocation allowance calculator | 19 | 47.47 |
| relocation assistance calculator | 17 | 49.47 |

This is a real query-to-page concentration, but the homepage title already reads **“US Moving Cost & Relocation Package Calculator”**, its description explains the employer lump-sum/direct-paid-cost gap, and its hero links directly to the calculator and employer-package guide. The calculator page itself is still unknown to Google. Changing homepage metadata before diagnosing that index state risks treating a crawl/discovery question as a snippet problem.

### URL inspection

| URL | Google result | Important detail |
|---|---|---|
| `/` | PASS — Submitted and indexed | Fetch successful; robots allowed; Google and user canonicals agree; last crawl 2026-10-21 |
| `/moving-cost/co-to-wa/` | PASS — Submitted and indexed | Fetch successful; robots allowed; last crawl 2026-10-12 |
| `/calculator/` | URL is unknown to Google; neutral verdict | Fetch, robots and indexing fields unspecified; this is not a reported noindex or robots block |
| `/methodology/` | URL is unknown to Google; neutral verdict | Fetch, robots and indexing fields unspecified |
| `/guides/employer-relocation-package/` | URL is unknown to Google; neutral verdict | Fetch, robots and indexing fields unspecified |

### Sitemap

- `sitemap-0.xml`: 115 submitted; 0 errors; 0 warnings; last downloaded 2026-11-18.
- `sitemap-index.xml`: 115 submitted; 0 errors; 0 warnings; last downloaded 2026-11-20.
- The API's `indexed=0` field is not treated as a site-wide indexed URL count because it conflicts with passing URL inspections and observed search impressions.

## Bing Webmaster Tools

The verified Bing property is the same production URL.

- Daily totals available from 2026-10-07 through 2026-11-22: **17 impressions, 0 clicks**.
- Most visible relevant query: `cost to move from ohio to florida` (10 impressions across three dates; average impression positions 4–5). `moving from dallas to houston` appeared twice.
- Top page: `/moving-cost/oh-to-fl/` (11 impressions, 0 clicks). `/moving-cost/cities/dallas-to-houston/` appeared twice.
- Latest crawl-stat row, 2026-11-22: `in_index=67`, 0 crawl errors, 3 crawled pages.
- Crawl-issues report returned no rows.
- Primary `sitemap-0.xml`: Success, 115 URLs, last crawled 2026-11-08. Sitemap index: Success, one URL, last crawled 2026-10-18.
- Older standalone feed records for page URLs still say “The feed was empty”; these are stale page-as-feed submissions, not a failure of the current XML sitemap.

Bing URL inspection, child-URL listing and page-performance calls returned `ErrorCode 17 / ThrottleIP`. They were not retried. No URL submissions or feed changes were made.

## Calculator usage — Vercel Web Analytics

For 2026-10-26..2026-11-22, the connected project analytics reported:

- **7 pageviews / 4 visitors** total.
- `/calculator`: 5 pageviews / 3 visitors.
- `/`: 1 pageview / 1 visitor.
- `/moving-cost/cities/new-york-to-los-angeles`: 1 pageview / 1 visitor.
- Referrer hostname was blank for all 4 visitors; no referral channel can be attributed from this sample.

This is a very small sample and may include owner/test traffic; it is not evidence of a stable conversion rate. The Vercel Hobby analytics endpoint only retains the latest 31 days, so a prior non-overlapping 28-day comparison was rejected by the API. Custom-event analytics are plan-gated (402); no calculator-start or calculator-completion count is available. Do not infer interactions from pageviews.

## Live-site, source and deployment checks

- The production deployment record is **READY** for commit `2ef62c9ceb30577b3f9a7c49c298c562d0173a6a` on `main`, with alias `relocation-cost-psi.vercel.app` (created 2026-11-22).
- The available page reader returned the homepage, calculator and methodology content, but marked the snapshot as crawled four days earlier. It is not a fresh uncached HTTP validation of the 2026-11-22 deployment.
- A raw fetch of `robots.txt` and sitemap XML could not be completed by the available reader; container DNS resolution also failed. This is a tool/network limitation, not proof of a crawler failure.
- Current source: `astro.config.mjs` uses the verified production host and `trailingSlash: "always"`; `Layout.astro` emits a self-referencing canonical; the calculator does not pass `noindex`; homepage navigation and the hero form link to `/calculator/`; calculator source includes WebApplication and BreadcrumbList JSON-LD; `public/robots.txt` allows OAI-SearchBot and all user agents and references the sitemap index.
- No new build or test was run because no application code changed.

## Competitor and product position

The 2026-11-11 deep audit and existing competitor research still support this distinction:

- moveBuddha's strongest advantage is a large, frequently refreshed quote/data pipeline and route/date/size-aware comparisons (company-reported claims, not independently audited here).
- Haulest exposes reviewer-reported medians, middle-half ranges, dates and sample counts; those observations are self-selected and are not automatically representative.
- RelocateMath offers broader relocation decision coverage and a detailed methodology.
- Relocation Cost should not claim the most accurate mover quote. Its defensible value is the full cash plan around a move: transport scenario, travel, temporary housing, deposits/setup, employer lump sum and directly paid expenses, and a separate cash reserve, without requiring an email or quote request.

## AI answer visibility

The connected GSC and Bing endpoints used here did not expose AI citation, grounding-query or AI-answer performance reports. No claim is made about citations or mentions in ChatGPT Search, Google AI Overviews or Copilot.

## Decision and next actions

1. **B25 remains open:** obtain the full GSC Page indexing reason-group report and a reliable rendered/live crawl for `/calculator/`, `/methodology/` and the employer-package guide. Only change source after a concrete reason is identified.
2. Do not resubmit the unchanged sitemap or mass-submit URLs. Do not delete the old empty feed records based only on their labels.
3. Let Bing's throttle cool; later request the child URL inventory once, not repeatedly.
4. Preserve the current homepage metadata and hero flow for now. Reassess after the calculator's index state changes or a new page/query mismatch is evidenced.
5. Improve usage measurement only if a permitted, privacy-minimal event measurement path becomes available; current Web Analytics pageviews are too small to evaluate completion, and custom events are plan-gated.
6. Product work remains B24's independent cost-model evidence path. Latest Claude review (2026-11-21) rejects the aggregate NHS speed table for route-time joins, advises against treating passenger-car durations as truck times, and prioritizes mover-specific crew task hours; no labor-time coefficient or production pricing change is justified.

**This review changed documentation/backlog only.** No production SEO, content, calculator, structured data, canonical, robots, sitemap, pricing, indexing submission or external publishing action was changed.
