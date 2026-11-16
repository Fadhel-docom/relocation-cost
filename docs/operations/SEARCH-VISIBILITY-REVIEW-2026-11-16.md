# Weekly search and crawl review — 2026-11-16

Property checked: `https://relocation-cost-psi.vercel.app/`
Production host only. No `.com` host was queried or configured.

## Google Search Console

### Performance

Window: 2026-10-17 through 2026-11-13 (28 days; latest final data returned by the connected API).

- 546 impressions
- 1 click
- 0.18% CTR
- 47.53 average position
- Previous 28-day window (2026-09-19 through 2026-10-16): 2 impressions, 0 clicks. This is a near-zero baseline, so the increase is not evidence of a product-quality improvement.

Page distribution:
- Homepage: 465 impressions, 0 clicks, average position 46.52.
- `/moving-cost/co-to-wa/`: 5 impressions, 1 click, 20% CTR, average position 21.4.
- `/moving-cost/ca-to-az/`: 37 impressions, 0 clicks, average position 61.81.
- `/moving-cost/ca-to-tx/`: 11 impressions, 0 clicks, average position 92.27.
- Other reported pages had 1–10 impressions each.

Largest query groups included:
- `relocation package calculator`: 73 impressions, average position 34.21.
- `relocation expenses calculator`: 40, position 33.15.
- `calculate relocation costs`: 31, position 47.61.
- `calculating relocation costs`: 29, position 53.07.
- `how to calculate relocation costs`: 27, position 53.56.
- `relocation cost calculator`: 17, position 43.94.
- `relocation allowance calculator`: 16, position 50.75.
- `relocation assistance calculator`: 13, position 48.46.

Most generic calculator/package queries are currently associated with the homepage. The single click is associated with a route page. These are small early samples; no title or page rewrite is justified from this snapshot alone.

### Indexing and sitemap

- `sitemap-0.xml`: 115 submitted, 0 errors, 0 warnings; last downloaded 2026-11-13 10:27 UTC.
- Sitemap API's `indexed=0` field conflicts with the URL Inspection result for the homepage, so it is not treated as a reliable site-wide indexed count.
- Homepage inspection: `Submitted and indexed`; page fetch successful; robots allowed; user and Google canonical both point to the homepage; last crawl 2026-10-21.
- `/calculator/` inspection: `URL is unknown to Google`, with no fetch/robots verdict. This is not a reported noindex or robots block.

## Bing Webmaster Tools

Data returned:
- Daily totals: 2026-10-07 through 2026-11-14; 16 impressions, 0 clicks.
- Top query: `cost to move from ohio to florida`, 10 impressions, average impression positions 4–5.
- `moving from dallas to houston`: 2 impressions, average position 9.
- Top page `/moving-cost/oh-to-fl/`: 11 impressions, average positions 4–6.
- `/moving-cost/cities/dallas-to-houston/`: 2 impressions, average position 9.
- Crawl statistics: `in_index` rose from 6 on 2026-10-05 to 63 on 2026-11-12/13. Crawl errors were 1 on Nov 9, 3 on Nov 10 and 2 on Nov 11; zero on Nov 12 and 13. The API's URL-level issues report returned no rows.
- Sitemap `/sitemap-0.xml`: Success, 109 URLs, last crawled 2026-11-08.
- Sitemap index: Success, one URL, last crawled 2026-10-18.
- Older standalone feeds for `/calculator/`, `/guides/moving-cost/`, `/moving-cost/` and the homepage report “The feed was empty”; they are old individual URL submissions, not evidence that the current XML sitemap is empty.
- A legacy `/sitemap.xml` feed reports Success with 5 URLs and last crawled 2026-10-03.
- Bing child-URL listing was throttled (`ErrorCode 17 / ThrottleIP`). Do not retry immediately or resubmit unchanged URLs.

## Live production technical checks

Fetched live homepage, calculator and methodology:
- All returned HTTP 200.
- Each page has a self-referencing canonical.
- All three expose production build commit `96cb718868340e8323565e9e84fd4126c50a41b4`.
- Homepage links to `/calculator/`.
- `/calculator/` is present in the live 115-URL `sitemap-0.xml`.
- `robots.txt` explicitly allows OAI-SearchBot and also allows all other user agents.
- No obvious canonical, robots or sitemap omission explains the calculator's “unknown to Google” result.

## AI answer visibility

The connected Google/Bing APIs used in this review did not expose AI citation/grounding-query reports. No conclusion about ChatGPT, Google AI Overviews or Copilot citations is made.

## Decision

No production SEO/content change this week. The calculator is reachable, self-canonical, internally linked and in the sitemap; the remaining Google status is “unknown”, not a confirmed technical block. Bing has begun surfacing a small number of route queries, particularly Ohio → Florida, but the sample is too small to justify another route page or a mass update. Avoid duplicate submissions and do not use impressions/indexing as a proxy for product quality.

Next distribution check: after the next full data window, revisit the existing `/calculator/` inspection and the Ohio → Florida query/page pair. Product priority remains the independent pricing model in `INDEPENDENT-TRUCK-COST-MODEL-RESEARCH-2026-11-16.md`.
