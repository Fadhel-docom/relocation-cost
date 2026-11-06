# GSC gate review after M1/M3a deployment — 2026-11-06

**Property:** https://relocation-cost-psi.vercel.app/  
**Reader:** ChatGPT  
**Read mode:** Search Console and Bing read-only; no URL submissions, sitemap changes, or account changes.  
**Window:** 2026-10-09 through 2026-11-04 inclusive (27 days), matching the length of the stored baseline window 2026-10-02 through 2026-10-28.

## 1. Google Search Console — 27-day comparison

| Metric | Baseline 2026-10-02–10-28 | Gate 2026-10-09–11-04 | Change |
|---|---:|---:|---:|
| Impressions | 109 | 272 | +149.5% |
| Clicks | 0 | 1 | +1 |
| Average position | 59.64 | 50.67 | improved by 8.97 positions |

This is a descriptive comparison of two adjacent, equal-length windows, not proof that a particular change caused the movement. Importantly, the gate window ends on November 4: M1 and M3a were merged/deployed on November 5, so these numbers are a **pre-change decision baseline**, not post-deployment results.

## 2. Landing pages in the gate window

| Page | Impressions | Clicks | Average position |
|---|---:|---:|---:|
| Homepage / | 224 | 0 | 50.27 |
| /moving-cost/co-to-wa/ | 5 | 1 | 21.40 |
| /budget-tracker/ | 2 | 0 | 8.00 |
| /moving-cost/ca-to-az/ | 12 | 0 | 65.75 |
| /moving-cost/ca-to-tx/ | 11 | 0 | 92.27 |
| /moving-cost/fl-to-ma/ | 4 | 0 | 19.00 |
| /moving-cost/fl-to-nj/ | 7 | 0 | 57.43 |
| /moving-cost/fl-to-ny/ | 1 | 0 | 82.00 |
| /moving-cost/ny-to-pa/ | 5 | 0 | 4.80 |
| /privacy/ | 1 | 0 | 10.00 |
| **Total** | **272** | **1** | — |

The only recorded click in the page breakdown went to the Colorado-to-Washington route page (5 impressions, average position 21.4). The homepage still accounts for most impressions (224/272) but recorded no click in this window.

## 3. Query signals

Selected query rows:
- “relocation package calculator”: 41 impressions, average position 35.59.
- “relocation expenses calculator”: 15 impressions, average position 37.47.
- “how to calculate relocation costs”: 15 impressions, average position 58.33.
- “calculate relocation costs”: 16 impressions, average position 50.31.
- “calculating relocation costs”: 13 impressions, average position 59.85.
- “relocation compensation calculator”: 9 impressions, average position 55.89.
- “relocation allowance calculator”: 6 impressions, average position 52.00.

The strongest query cluster remains employee relocation package / expenses / allowance intent. These are small site-level samples, not search-volume estimates. The query breakdown returned zero clicks for its listed query rows; the page breakdown returned one click, so do not assign that click to a particular query.

## 4. Priority URL inspection (2026-11-06)

| URL | Google status | Last crawl returned |
|---|---|---|
| Homepage / | Submitted and indexed; mobile crawl; canonical matches | 2026-10-21 |
| /calculator/ | URL is unknown to Google | No crawl |
| /moving-cost/ca-to-tx/ | Submitted and indexed; mobile crawl; canonical matches | 2026-10-19 |
| /moving-cost/co-to-wa/ | Submitted and indexed; mobile crawl; canonical matches | 2026-10-12 |

The inspection results are cached and predate the November 5 deployment. They do not yet verify Google has crawled M1/M3a. The calculator remains unknown to Google, but this result alone does not identify the cause. Do not alter canonical, robots, or query-string behaviour without new evidence.

## 5. Bing evidence and limitations

Bing's daily totals returned data only through 2026-11-03 in this connection, with zero clicks and very sparse impressions. Its top-query and top-page summaries returned only two rows dated 2026-10-30 (4 impressions for /moving-cost/oh-to-fl/ and 1 for /guides/checking-a-mover/), both with zero clicks. Individual URL inspections continued to return http_status=0, document_size=0, and zero crawl dates for several URLs; these fields are incomplete and must not be treated as proof of an HTTP failure or a definitive indexing state.

No Bing URL submission or sitemap action was taken.

## 6. Decisions and next checkpoints

1. Treat this as the pre-M1/M3a baseline. Keep the new answer-first content unchanged until a comparable post-deployment window is available.
2. Re-read GSC around **November 12** for the first 7-day signal and around **November 19** for the 14-day comparison. Separate impressions, clicks, CTR and position; avoid causal claims from small samples.
3. Review the homepage and state-route answer blocks on the deployed site with actual mobile/desktop rendering evidence where available. The connector's URL inspection is not a visual QA substitute.
4. M3b (mobile scenario-table usability) remains deferred until the planned measurement checkpoint; do not implement it merely because it is next on a roadmap.
5. Keep the AI-answer benchmark OPEN / NOT TESTED: the November 5 direct-surface attempt returned 403 before answers on all four attempted integrations. Do not substitute ordinary web search for direct AI-answer evidence.
6. Keep HeiGIT route-distance execution blocked until the owner records the current account-dashboard quota and explicitly authorizes a specific run. The reported 200 Directions/day is an observed operational limit, not the current remaining balance. No API requests were made in this review.

## 7. Execution boundary

Completed: 27-day GSC totals, query/page breakdowns, four Google URL inspections, Bing daily/top-query/top-page reads, and four Bing URL inspections.  
Not completed: visual rendering QA, direct AI answer tests, AI-specific dashboard reporting, Bing remediation, HeiGIT API execution, and production changes. Reasons are access/evidence limits or explicit safety gates above.

No production code, formulas, route data, sitemap, indexing settings, outreach, or API usage changed in this review.
