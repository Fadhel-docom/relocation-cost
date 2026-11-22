# Search discovery recheck — 2026-11-22

**Property:** `https://relocation-cost-psi.vercel.app/`  
**Scope:** B4 / B25 read-only diagnosis. No production, sitemap, canonical, robots, or submission changes.

## Decision

No confirmed technical defect was found that justifies a production change or another indexing submission. Keep B25 open as `doing`; the Google URL Inspection state for `/calculator/` and `/methodology/` remains unknown with unspecified fetch/robots fields, not a confirmed block. Do not resubmit the sitemap or bulk-submit URLs.

## Google Search Console

### Performance — two completed 28-day windows

| Window | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| 2026-09-25 to 2026-10-22 | 0 | 20 | 0% | 59.35 |
| 2026-10-23 to 2026-11-19 | 1 | 661 | 0.151% | 44.76 |

This is a substantial increase from a near-zero baseline, but it does not establish that any particular site change caused it, and one click is too small a sample for a stable CTR conclusion.

Page-dimension rows in the current window:
- Homepage: 561 impressions, 0 clicks, average position 44.59.
- `/moving-cost/co-to-wa/`: 6 impressions, 1 click, average position 18.5.
- `/moving-cost/ca-to-az/`: 49 impressions, 0 clicks, average position 53.04.
- `/moving-cost/fl-to-ma/`: 14 impressions, 0 clicks, average position 25.86.
- `/moving-cost/fl-to-nj/`: 11 impressions, 0 clicks, average position 46.55.
- `/moving-cost/ca-to-tx/`: 10 impressions, 0 clicks, average position 74.30.
- `/moving-cost/ca-to-nv/`: 4 impressions, 0 clicks, average position 36.25.
- `/moving-cost/ny-to-pa/`: 6 impressions, 0 clicks, average position 4.17.
- Remaining reported pages each had 1–2 impressions.

Top generic query groups continue to resolve to the homepage in the page-level report. Examples: `relocation package calculator` (83 impressions, position 32.48), `relocation expenses calculator` (43, position 32.67), `calculate relocation costs` (36, position 43.39), `relocation cost calculator` (24, position 39.79), and `relocation tools calculator` (32, position 37.16). These are early samples; no title rewrite or landing-page reassignment is justified from these figures alone.

### Sitemap metadata

- Child sitemap `/sitemap-0.xml`: 115 submitted, 0 errors, 0 warnings, not pending; last downloaded 2026-11-18 15:06 UTC.
- Sitemap index `/sitemap-index.xml`: 115 submitted, 0 errors, 0 warnings, not pending; last downloaded 2026-11-20 12:37 UTC.
- The API's `indexed=0` field is not treated as an actual site-wide index count; prior URL Inspection returns indexed pages despite the same sitemap counter.

### URL Inspection

- `/`: PASS / Submitted and indexed; mobile crawl; fetch successful; robots allowed; user and Google canonical both point to the homepage; last crawl 2026-10-21.
- `/moving-cost/co-to-wa/`: PASS / Submitted and indexed; mobile crawl; fetch successful; robots allowed; self-canonical; last crawl 2026-10-12.
- `/calculator/`: URL is unknown to Google; verdict neutral; indexing, fetch and robots fields unspecified.
- `/methodology/`: URL is unknown to Google; verdict neutral; indexing, fetch and robots fields unspecified.

The unknown result is not a reported noindex, robots block, failed fetch, or canonical mismatch. It does not identify the underlying cause.

## Bing Webmaster Tools

- Primary sitemap `/sitemap-0.xml`: Success, 115 URLs, last crawled 2026-11-08.
- Sitemap index: Success, one URL, last crawled 2026-10-18.
- Old standalone submissions for `/calculator/`, `/guides/moving-cost/`, `/moving-cost/`, and `/` still report “The feed was empty” with zero URLs. These are stale page URLs registered as feed endpoints, not failures of the real XML sitemap.
- Crawl statistics on 2026-11-21: `in_index=67`, 0 crawl errors. The crawl-issues report returned no rows.
- Individual URL Inspection returned `ErrorCode 4 / ThrottleUser`. No immediate retry was made.

No feed deletion or URL submission was attempted. The existing successful sitemap is the correct discovery feed; the stale feed records are not evidence that pages are empty.

## Source-code discovery checks

Read current `main` source:
- `astro.config.mjs` sets the canonical site host to the verified Vercel hostname and `trailingSlash: "always"`; the sitemap integration excludes only the contact page when its contact email is absent.
- `src/layouts/Layout.astro` builds a self-referencing canonical from `Astro.url.pathname` and `Astro.site`. Its shared navigation includes a visible `/calculator/` link.
- `src/pages/index.astro` includes a form with `action="/calculator/"` and a separate calculator CTA.
- `src/pages/calculator.astro` uses the shared layout without setting `noindex`.
- `tools/verify-seo.mjs` lists `/calculator/` among expected static pages and checks that static canonicals appear in the generated sitemap. This session inspected the check's source but did not run a new build or claim a fresh CI result.

These checks make a missing source-level link, an intentional noindex, or a wrong configured hostname unlikely. They do not prove what the current live XML/HTML response contains.

## Verification limits

- Direct live fetch attempts from the available browser/web readers returned HTTP 403 or cache-miss errors for the site, including the XML and HTML URLs. This is a fetch-proxy limitation; it is not evidence that Googlebot or Bingbot receives HTTP 403.
- The connected Search Console tools do not expose the full Page indexing reason-group report or the complete indexed-URL inventory.
- Bing child-URL listing was not retried after the observed throttle.
- No complete 115-URL rendered crawl was run.

## Next action

1. Keep the sitemap as-is; do not resubmit unchanged URLs.
2. Recheck the two unknown URLs after a normal crawl interval, and use the Page indexing report if the connected UI/API exposes it.
3. Revisit query-to-landing alignment only after the calculator's index state changes or a specific mismatch is established. The homepage currently offers a working move-start form and a direct calculator link, so no safe source-level routing fix is demonstrated.
4. If the next inspection still says unknown, obtain a full GSC Page indexing report and a genuine live fetch/rendered crawl before changing code.

**No production code, canonical, robots, sitemap, pricing, calculator logic, or Bing/Google submission state was changed.**
