# Activating affiliate partners

Partner slots are built in but hidden. Nothing shows until a program approves the site.

1. Apply to programs in these categories: moving quotes / lead generation, truck rental, storage, moving insurance. Networks to try: Awin, CJ, ShareASale, PartnerStack, plus direct programs from the companies themselves.
2. When one approves, paste its tracking link into `href` for the matching entry in `src/lib/partners.js` (must start with `https://`).
3. Open a PR. CI must be green. `tools/verify-seo.mjs` fails the build if any affiliate link lacks `rel="sponsored"`.
4. After merge, the block appears on the calculator, state route pages and city route pages, and the disclosure page switches its wording automatically.

Rules: no estimate may be changed to favour a partner, and every partner link is labelled as an affiliate link.
