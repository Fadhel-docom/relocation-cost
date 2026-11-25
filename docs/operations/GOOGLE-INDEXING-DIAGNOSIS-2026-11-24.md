# Google indexing diagnosis — 2026-11-24

**Owner:** ChatGPT  
**Scope:** Read-only investigation of the persistent Google discovery/indexing gap.  
**Production impact:** None. No deployment, URL submission, sitemap resubmission, or production source change was made.

## 1. Verified Search Console property and sitemap state

Active Search Console property: `https://relocation-cost-psi.vercel.app/` (permission: siteOwner).

Read-only sitemap inventory:
- `https://relocation-cost-psi.vercel.app/sitemap-0.xml`: 115 submitted, 0 errors, 0 warnings; last downloaded 2026-11-18.
- `https://relocation-cost-psi.vercel.app/sitemap-index.xml`: 115 submitted, 0 errors, 0 warnings; last downloaded 2026-11-20.
- Both entries are present in the property. Do not treat the API `contents.indexed=0` field as the site's indexed-page total; the sitemap indexed counter is deprecated and is not a substitute for the Page indexing report.

The user's reported total of approximately 22 pages known/indexed by Google was not independently confirmed from the API. The Search Console API does not expose the Page indexing report's site-wide indexed/not-indexed totals or reason-group table.

## 2. Read-only URL Inspection sample

Inspected only high-value representative URLs. No Request indexing action was taken.

| URL | Google index status | Key signals |
| --- | --- | --- |
| `/` | Submitted and indexed | PASS; fetch successful; robots allowed; indexing allowed; user and Google canonical match; last crawl 2026-10-21 |
| `/moving-cost/ca-to-az/` | Submitted and indexed | PASS; fetch successful; robots allowed; indexing allowed; user and Google canonical match; last crawl 2026-10-10 |
| `/guides/moving-cost` | Alternate page with proper canonical tag | Google selected `/guides/moving-cost/`; both canonical values point to slash version. This is a URL-variant normalization, not a substantive indexing error. |
| `/calculator/` | URL is unknown to Google | No crawl date; fetch/robots/indexing fields unspecified |
| `/methodology/` | URL is unknown to Google | No crawl date; fetch/robots/indexing fields unspecified |
| `/guides/employer-relocation-package/` | URL is unknown to Google | No crawl date; fetch/robots/indexing fields unspecified |
| `/guides/relocation-budget/` | URL is unknown to Google | No crawl date; fetch/robots/indexing fields unspecified |

Interpretation: the four core product/trust pages are currently reported as unknown to Google, not as crawled-but-rejected, blocked by robots, or explicitly noindexed. This is an **URL discovery/Google-known-state gap** in the current inspection data. It does not by itself establish why those URLs are unknown.

## 3. Search performance cross-check

A read-only page-dimension Search Analytics query for 2026-08-25 through 2026-11-21 returned 14 page rows with impressions (715 total impressions in those returned rows). The homepage had 591; route pages including CA→AZ, FL→NJ, CA→TX and others also received impressions. Search Analytics rows prove that those specific page URLs appeared in search results during the date window, but they are not a complete list of indexed URLs.

## 4. Source and deployment checks

Current main source review:
- `astro.config.mjs` uses the correct production origin `https://relocation-cost-psi.vercel.app`, `trailingSlash: "always"`, static output, and `@astrojs/sitemap`. Its explicit sitemap filter excludes only `/contact/` when the contact page is noindex due to missing contact details.
- `public/robots.txt` allows all crawlers and declares the sitemap index URL.
- `src/layouts/Layout.astro` emits a self-referential canonical based on the Astro pathname. `noindex` is emitted only when a page explicitly passes `noindex=true`; the default is false.
- The homepage contains a crawlable HTML form action to `/calculator/` and a normal anchor to the employer relocation package guide. The shared layout links to the calculator, route hub, moving-cost guide and relocation-budget guide.
- `/moving-cost/` renders normal anchor links to every state route in `data/route-pages.json`; `/moving-cost/cities/` renders normal anchor links to city-route entries.
- The state route hub is linked from shared navigation/footer, so route pages have a crawlable hub path in source.
- Current Vercel production deployment is READY and points to main commit `45d1d59e1d46c819780371a21bfa9edaef1495e7`.

These checks do not show an obvious global robots, canonical, or internal-link-template defect. However, source review is not a substitute for a fresh fetch of the deployed HTML and the actual generated sitemap XML. The public web reader returned cache-miss/unavailable responses for the live host in this session, so the generated sitemap URL list and deployed rendered HTML were not independently downloaded.

## 5. Important API limitation

Google's Search Console API exposes Search Analytics, Sitemaps, Sites and URL Inspection. It does not expose the Page indexing report's site-wide reason groups. URL Inspection is per URL and read-only; it is not the Request indexing button. The separate Indexing API is not a supported route for ordinary calculator or guide pages.

Official references:
- Search Console API reference: https://developers.google.com/webmaster-tools/v1/api_reference_index
- Page indexing report: https://support.google.com/webmasters/answer/7440203
- URL Inspection API result fields: https://developers.google.com/webmaster-tools/v1/urlInspection.index/UrlInspectionResult
- Google technical requirements: https://developers.google.com/search/docs/essentials/technical

## 6. Next diagnostic gate — required before code changes

Obtain the Page indexing report in the Search Console UI for this exact property:
1. Open Indexing → Pages.
2. Capture/export the summary graph and the full **Why pages aren't indexed** reason table, including counts and the source column.
3. For each reason group, obtain the example URLs (especially Discovered - currently not indexed, Crawled - currently not indexed, Duplicate/alternate, Redirect, noindex, and Not found).
4. Compare those examples with the actual generated sitemap URL list and deployed HTML, then fix the demonstrated cause only.

Do not mass-submit or repeatedly request indexing. Do not change canonical, robots, sitemap filters, page count, or content templates until the Page indexing reason groups and generated sitemap URLs are compared.

## 7. Manual Request indexing quota error

The repeated manual `Request indexing` quota error is separate from the read-only API checks above. This session did not attempt the button again and did not claim to identify the exact quota bucket or reset schedule. The API does not expose the UI's request-indexing quota state. Capture the exact UI error only if the Page indexing report does not explain the wider discovery gap; do not retry the request as a diagnostic experiment.
