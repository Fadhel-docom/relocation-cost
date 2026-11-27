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


## Owner screenshot confirmation — 2026-11-26 10:49 UTC

The owner supplied the Google Search Console Overview screenshot showing:
- 94 unindexed URLs.
- 22 indexed URLs.
- 1 click on web search pages in the displayed performance chart.

This confirms the aggregate overview counts. It does not show why the URLs are excluded, and it does not prove that these 94 URLs are the same targets as Ahrefs' 94 one-dofollow-internal-link notices. The matching count alone is not evidence of shared URL membership or causation.

The GSC sitemap inventory reports 115 submitted URLs, while the overview shows 116 indexed + unindexed URLs. These are not necessarily identical populations or synchronized counts. Compare the exact sitemap URL list, GSC Page indexing examples, and Ahrefs affected-URL export before drawing conclusions.

**Next evidence required:** GSC Indexing → Pages reason table with examples, plus Ahrefs export of all 94 affected URLs and their linking-source URLs. No new indexing requests, sitemap submission, production changes, or deployment.


## Owner-provided GSC Page indexing reason detail — 2026-11-26

Property: `https://relocation-cost-psi.vercel.app/`.

The owner supplied the full visible reason-group detail from Indexing → Pages:

| Reason | Count | Source | Validation | Start date | Last updated |
|---|---:|---|---|---|---|
| Detected, currently not indexed | 93 | Google Systems | Started | 2026-10-20 | 2026-11-16 |
| Another page with the correct canonical tag | 1 | Website | Not started | — | — |
| Explored, currently not indexed | 0 | Google Systems | Not applicable | — | — |

All 93 example URLs displayed in the owner-provided report are on `relocation-cost-psi.vercel.app`; each has `Latest exploration: Not applicable`. The examples span core pages, guides, state-to-state routes and city-to-city routes. The report shows 93 examples (1–93 of 93).

### Updated interpretation

- The dominant reported state is discovery without a recorded exploration, not a set of pages that Google crawled and then rejected for indexing.
- The zero count for `Explored, currently not indexed` means this screenshot provides no evidence that Google evaluated the content of those 93 URLs and rejected it.
- One alternate-canonical URL is a separate, low-count item; verify its selected canonical separately, but it does not explain the 93 detected URLs.
- This is stronger evidence about the current bottleneck than the previous overview-only screenshot. It still does not establish why Google has not scheduled/fetched the URLs, nor prove a technical block.
- The validation process is marked Started from 2026-10-20, but that status alone is not proof that the underlying cause has been fixed or that all 93 URLs were rechecked.

### Ahrefs comparison still required

Ahrefs reported 94 URLs with one dofollow incoming internal link. The numerical proximity to 93 is not evidence that the URL sets overlap. Obtain the exact Ahrefs target URLs and their linking-source URLs, then match them against these 93 GSC examples and the generated sitemap list. Prioritize any high-value calculator/trust pages that are both detected-not-indexed and weakly linked. Add only contextual links that improve navigation; do not mass-add links.

### Next diagnostic gate

1. Compare the Ahrefs 94-URL export and linking-source URLs with the 93 GSC examples.
2. Verify whether each example URL is in the generated 115-URL sitemap and confirm its canonical target.
3. Inspect the actual deployed rendered HTML and response for representative pages from each cluster (calculator/trust, guide, state route, city route), including internal links and status.
4. Only then decide whether there is a specific technical/discovery defect or whether a narrower crawl-priority/internal-link intervention is justified.

No URL submissions, sitemap resubmission, production code/content changes or deployment were performed.
