# Indexing diagnosis — 2026-11-09

Repository: `Fadhel-docom/relocation-cost`  
Live property inspected: `https://relocation-cost-psi.vercel.app/`  
Scope: read-only diagnosis. No production, canonical, robots, sitemap, or indexing submission changes were made.

## Executive finding

There is **no evidence yet of a site-wide broken internal-link system**. The homepage links directly to `/calculator/`, `/moving-cost/`, `/moving-cost/cities/`, and multiple guides; the shared layout also links to the calculator, route directory, and guides. The route directory links to the state-route pages, and the city directory links to all city-route pages. The calculator page is linked from the home CTA and shared navigation. This makes a global missing-navigation defect unlikely, although page-by-page orphan checks and rendered-link checks remain outstanding.

Google's plateau at 22 indexed pages is **not explained by the current evidence alone**. Some sampled pages are indexed and fetch successfully, while several linked pages remain unknown to Google. The next step is to inspect the Page indexing report and exact exclusion reasons, not to add arbitrary internal links.

## Google Search Console evidence

- The only verified property returned by the connected account is the URL-prefix property `https://relocation-cost-psi.vercel.app/` (site owner). This is the Vercel hostname, not a custom-domain property.
- Sitemap `/sitemap-0.xml`: 115 submitted, 0 indexed in the sitemap API response, 0 errors, 0 warnings; last downloaded 2026-11-08 21:45 UTC. Sitemap index `/sitemap-index.xml`: also reports 115 submitted and 0 indexed, no errors/warnings.
- Important inconsistency: individual URL Inspection returned PASS / “Submitted and indexed” for the homepage, `/budget-tracker/`, and `/moving-cost/ca-to-tx/`. Therefore the sitemap API's `indexed: 0` must not be interpreted as proof that no URLs are indexed.
- URL Inspection samples:
  - `/`: PASS, Submitted and indexed, fetch successful, robots allowed, last crawl 2026-10-21; referring URLs include `/moving-cost/co-to-wa/` and `/guides/moving-cost`.
  - `/budget-tracker/`: PASS, Submitted and indexed, fetch successful, robots allowed, last crawl 2026-10-19; referring URLs include `/moving-cost/ny-to-tx/` and `/checklist/`.
  - `/moving-cost/ca-to-tx/`: PASS, Submitted and indexed, fetch successful, robots allowed, last crawl 2026-10-19; referring URL includes `/calculator/`.
  - `/guides/moving-cost/`: coverage says “Alternate page with proper canonical tag”; last crawl 2026-10-05. The response reports both user and Google canonical as this same trailing-slash URL, so the reason needs deeper inspection rather than assuming a canonical defect.
  - `/calculator/`: “URL is unknown to Google” (neutral verdict; crawl/fetch/robots fields unspecified), despite visible home CTA and shared-navigation links.
  - `/guides/relocation-budget/`, `/guides/employer-relocation-package/`, `/moving-cost/`, `/moving-cost/cities/`, `/methodology/`, and `/checklist/`: sampled as “URL is unknown to Google”.
- Search Analytics (2026-10-01 to 2026-11-06, page dimension) returned 11 page rows; one click total in those rows, with impressions concentrated on the homepage (298) and a small number of route pages. This is performance data, not a complete index inventory.
- `robots.txt` allows all crawlers and points to `https://relocation-cost-psi.vercel.app/sitemap-index.xml`. Astro config sets `site` to the same Vercel hostname and `trailingSlash: "always"`; the shared layout emits a canonical based on `Astro.site`.

## Bing Webmaster Tools evidence

- The connected verified Bing site is also exactly `https://relocation-cost-psi.vercel.app/`.
- Primary feed `/sitemap-0.xml`: status Success, 115 URLs, last crawled 2026-11-08 21:45:55 UTC. Sitemap index status Success. This updates the older note that only six URLs had been discovered: Bing's current feed record reports 115 URLs in the primary sitemap.
- Older feed submissions incorrectly treated page URLs (`/`, `/calculator/`, `/moving-cost/`, `/guides/moving-cost/`) as feed URLs; those legacy entries say “The feed was empty.” They are not evidence that those pages are empty; the current primary sitemap is successful.
- Crawl diagnostics report returned no issue rows.
- Quota tool returned limits of 100 URLs/day and 2,200 URLs/month (both URL and content quota families). These are quota limits, not remaining counters.
- Bing child-URL listing and individual URL inspection returned ErrorCode 17, `ThrottleIP`. Do not retry repeatedly. The actual Bing indexed/not-indexed inventory could not be obtained in this session.
- Because the missing URL list is not yet known, no bulk URL submissions were made. Submitting all 115 would waste quota and could resubmit already-indexed pages. The existing sitemap is already successfully processed.

## Internal-link review (source-code inspection)

- `src/layouts/Layout.astro`: shared navigation includes Calculator, Route costs, Moving costs, and Budget guide. Route/guide links are hidden visually below the small-screen breakpoint but remain in the HTML; the Calculator link is always visible.
- `src/pages/index.astro`: prominent Calculator CTA; links to route directories, selected route pages, and guides including the relocation-budget and employer-package guides.
- `src/pages/moving-cost/index.astro`: links to all configured state-route pages and the city-route directory, plus calculator, budget guide, moving-cost guide, and methodology.
- `src/pages/moving-cost/cities/index.astro`: links to all configured city-route pages and back to state routes.
- Result: no obvious missing top-level internal-link path found in the inspected source. This is not a full rendered crawl; Claude should still run a complete internal-link/canonical/status audit over all 115 sitemap URLs.

## Required handoff to Claude

1. Read this addendum and the current `OPS-ROOM.md`, `WORK-LOG.md`, and `BACKLOG.md` before acting.
2. In GSC, retrieve the Page indexing report (all reasons and counts) and compare it to the 115 sitemap URLs. Identify the exact 22 indexed URLs if the report/API exposes them. Do not treat Search Analytics rows as the index list.
3. Inspect a small, prioritized set again after normal crawl time: `/calculator/`, the unknown guide/category pages, and the alternate-canonical guide. Determine whether the URL Inspection data changed; do not repeatedly inspect in a tight loop.
4. In Bing, wait for the ErrorCode 17 throttle to clear. Then page through child URLs from the exact verified root until no items remain, and classify every URL as indexed/not indexed/unknown before submitting anything.
5. Submit only confirmed valid, non-indexed URLs (max 100/day; respect quota). Record exact submitted URLs and response IDs/counts. Do not resubmit the already-successful sitemap or all 115 URLs indiscriminately.
6. Confirm whether the intended public brand domain is still the Vercel hostname or a custom domain. Both search consoles, Astro `site`, canonical URLs, and sitemap currently use the Vercel hostname. Do not change domains, canonical tags, DNS, or search-console properties without the owner's explicit domain decision.
7. No page proliferation, no formula/data edits, and no claims that links are broken until the full rendered audit proves it.

## Limitations

- No Bing index-state list was available because of `ThrottleIP`.
- No complete GSC Page indexing report was exposed by the connected tools in this read.
- No browser-based crawl of all 115 rendered pages was performed.
- No URL submission was made; there is not yet a trustworthy list of missing Bing URLs.
