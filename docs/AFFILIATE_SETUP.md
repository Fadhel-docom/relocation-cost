# Activating affiliate partners

Partner slots are built in but hidden. Nothing shows until an advertiser approves the site.

## Awin (publisher account approved 2026-10-08)

An approved Awin publisher account is not the same as an approved advertiser. Each advertiser (programme) must accept the site separately.

1. In the Awin dashboard, open the advertiser search / "Join programmes" and apply to US programmes in these categories: moving quotes / lead generation, truck rental, storage, moving insurance. Search keywords: moving, relocation, storage, truck, van, movers, insurance.
2. Wait for each advertiser's approval e-mail. Approval time varies per advertiser.
3. For each approved advertiser, create a link in Awin (Link Builder / "Create a link") for the landing page that matches the category. Copy the full tracking link (it starts with `https://www.awin1.com/`).
4. Paste it into `href` for the matching entry in `src/lib/partners.js`.
5. Open a PR. CI must be green before merging.

What the code does automatically:
- Every Awin link gets a `clickref` equal to the page it was clicked on (for example `calculator` or `moving-cost-new-york-to-florida`). The Awin reports then show which page earns commission.
- `tools/verify-seo.mjs` fails the build if an affiliate link lacks `rel="sponsored"` or an Awin link lacks `clickref`.
- The block appears on the calculator, state route pages and city route pages, and the disclosure page switches its wording automatically.

## Other networks

CJ, ShareASale, PartnerStack and direct programmes from the companies themselves follow the same steps 2 to 5: paste the tracking link into `href`.

## Rules

- No estimate may be changed to favour a partner.
- Every partner link is labelled as an affiliate link.
- Apply only to programmes that fit the content; do not add partners that are unrelated to moving.
