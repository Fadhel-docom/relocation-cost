# Google discovery and Ahrefs internal-link recheck — 2026-11-26

**Owner:** ChatGPT  
**Scope:** B25 read-only GSC refresh plus owner-provided Ahrefs/HeiGIT email review.  
**Production impact:** None. No URL submission, sitemap resubmission, production edit, deployment, or HeiGIT request.

## Google Search Console — refreshed 2026-11-26

Property: `https://relocation-cost-psi.vercel.app/`.

| Sitemap | Submitted | Errors | Warnings | Last downloaded |
|---|---:|---:|---:|---|
| `sitemap-0.xml` | 115 | 0 | 0 | 2026-11-24 16:49 UTC |
| `sitemap-index.xml` | 115 | 0 | 0 | 2026-11-20 |

The child sitemap is not pending. The API's `indexed=0` field is deprecated and must not be used as the site's indexed-page count.

### Priority URL inspections

| URL | Result | Interpretation |
|---|---|---|
| `/calculator/` | URL is unknown to Google | Neutral; fetch/robots/indexing unspecified |
| `/methodology/` | URL is unknown to Google | Neutral; fetch/robots/indexing unspecified |
| `/guides/employer-relocation-package/` | URL is unknown to Google | Neutral; fetch/robots/indexing unspecified |
| `/guides/relocation-budget/` | URL is unknown to Google | Neutral; fetch/robots/indexing unspecified |

All four inspections succeeded as API calls. None proves a robots block or crawl rejection. The Page indexing report's reason groups are still unavailable through this API.

## Ahrefs — owner-provided email dated 2026-11-26

- 212 internal URLs analyzed.
- Health Score 100.
- 0 errors.
- 3 warnings: 3XX redirects.
- 94 notices: page has only one dofollow incoming internal link.
- Other notices include 2 HTTP→HTTPS redirects and 1 redirect chain.

The affected URL list and each page's linking-source URL were not included in the email. Therefore we cannot yet identify which pages are weakly linked, whether they are important landing pages, or whether any link path is broken. A single-incoming-link notice is not itself an indexing error, and the aggregate notice does not prove causation.

### Required next evidence

1. Export the 94 affected URLs from Ahrefs, including incoming-link source URLs and target URLs.
2. Obtain the GSC Indexing → Pages reason table, counts, source and example URLs for the exact property.
3. Compare both lists with the generated 115-URL sitemap and a fresh rendered crawl.
4. Classify targets as route hubs, state/city route pages, guides, calculator or utility pages.
5. Add only contextual internal links that help visitors reach a relevant next task; do not mass-add links or change templates from the aggregate notice alone.

## HeiGIT endpoint notice — owner-provided email

The forum notification says `api.openrouteservice.org` was removed on 2026-11-24 in favor of `api.heigit.org`. This confirms the migration is final. It does not require regenerating stored road distances or spending quota. No endpoint, workflow, secret, route file or API request was changed.

## Decision

Keep B25 open. Do not repeat Request indexing, resubmit the sitemap, mass-add internal links, or edit production until the Page indexing reason groups, affected Ahrefs URLs and deployed HTML are compared.

## Verification record

- GSC sitemap inventory: successful.
- Four priority URL inspections: successful.
- No write actions taken in Search Console.
- Documentation-only changes; no application tests/build required.
