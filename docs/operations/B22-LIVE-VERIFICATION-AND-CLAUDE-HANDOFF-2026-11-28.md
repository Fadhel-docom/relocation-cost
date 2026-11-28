# B22 — Live production verification and one-pass Claude handoff
**Date:** 2026-11-28  
**Scope:** B22 competitor / AEO / core calculator review. Production is read-only. No pricing, formula, coefficient, route data, source code, or deployment changes were made in this review.

## Executive verdict
The primary-source competitor comparison and the current product promise are coherent. The deployed homepage accurately describes a whole-relocation budget planner rather than a mover quote engine. The production homepage-to-calculator flow and the main calculator interaction passed a focused automated browser smoke test on desktop and a 390px mobile viewport. No console errors, uncaught page errors, or failed network requests were recorded.

**Recommendation:** do not make a production change on the evidence collected. Keep B22 open only for Claude's independent one-pass review of the report and browser evidence, including the explicitly untested accessibility and secondary-action checks. Claude should return one consolidated verdict and, only if a reproducible visitor-facing defect is found, add the smallest justified fix to this same PR before a single final review.

## 1. Production identity and deployment
- Production alias: https://relocation-cost-psi.vercel.app/
- Vercel project: `relocation-cost`, Astro.
- Production deployment state: `READY`.
- Production Git ref: `main`.
- Production commit: `d2f8bf265393204cccafbb1db393c22cccae90e1` (the documentation-only B22 competitor review merge, PR #308).
- The deployed HTML on all four checked pages reports the same `build-commit` meta value, matching the Vercel deployment metadata.

## 2. Live route and metadata checks
Checked through the authenticated Vercel deployment fetch on 2026-11-28:
- `/`: HTTP 200; H1 “Build your full moving budget before you request quotes.”; one quick-start form; three direct links to `/calculator/`.
- `/calculator/`: HTTP 200; H1 “Build your moving budget”; self-canonical; WebApplication and BreadcrumbList JSON-LD; main calculator JS asset served HTTP 200.
- `/methodology/`: HTTP 200; self-canonical; H1 “How the estimates are built”; visible methodology link back to the calculator.
- `/guides/employer-relocation-package/`: HTTP 200; self-canonical; Article and BreadcrumbList JSON-LD; links back to the calculator.
- `/robots.txt`: HTTP 200; `User-agent: * Allow: /`, explicit `OAI-SearchBot Allow: /`, sitemap declaration points to `/sitemap-index.xml`.
- `/sitemap-index.xml`: HTTP 200; references `/sitemap-0.xml`.
- `/sitemap-0.xml`: HTTP 200; 115 URL entries, no duplicate URLs found in the returned XML.
- Unknown test route: HTTP 404 and `noindex` meta.
- `/calculator` (without trailing slash) returned the calculator document with the canonical pointing to `/calculator/`; no canonical mismatch observed.

These checks establish current response/rendered HTML and metadata, not Google's crawl or indexing decision.

## 3. Browser smoke test — actual production UI
Environment: Playwright with Chromium 159 headless on the Vercel sandbox; separate visual desktop browser session also opened the live homepage and calculator.

### Homepage → calculator handoff
1. Opened the live homepage.
2. Selected origin `CA`, destination `TX`, home size value `1.8` (the 3-bedroom band), and move type `1.65` (full-service).
3. Submitted the quick-start form.
4. Browser navigated to `/calculator/?distance=&fromState=CA&toState=TX&size=1.8&type=1.65`.
5. Calculator hydration populated CA, TX, size 1.8, type 1.65 and filled the route-table distance as 1,546 miles.
6. Initial displayed model estimate: **$4,123**; displayed fixed ±20% model band: **$3,299–$4,948**.

### Calculator interaction
- Changed distance from 1,546 to 2,000 miles.
- Displayed estimate changed from **$4,123** to **$4,627**.
- Input error area remained empty.
- Clicked “Share this estimate”; status area produced a share URL containing the current route and all calculator input values. This verifies URL generation/status, not clipboard permission or cross-device opening.

### Mobile layout
- Viewport: 390 × 844, mobile/touch emulation.
- Calculator form was visible and hydrated; result displayed **$4,123** for the same prefilled scenario.
- `document.documentElement.scrollWidth = 390`; `document.body.scrollWidth = 390`; no horizontal overflow.
- No mobile page errors were recorded.

### Runtime and script checks
- Main calculator JavaScript asset and feedback widget asset both returned HTTP 200.
- `node --check` passed on the downloaded calculator and feedback JavaScript assets.
- Playwright captured page errors, console errors, and failed network requests: **none recorded** in the tested flow.
- Desktop visual check showed the homepage hero, navigation and calculator page; calculator uses a sticky bottom estimate/band bar at the tested viewport. No obvious overlap was observed in the visible first-screen capture. This is not a complete visual QA audit.

### Explicitly not tested
- Full keyboard-only and screen-reader workflows; formal WCAG/axe audit; color contrast measurements.
- Additional viewport widths (320, 360, 768) and device/browser combinations.
- Invalid/extreme input boundary cases, all 50-state route pairs, reset behavior, print/PDF output, email-draft action, feedback event handling, clipboard permissions, and browser back/forward restoration.
- Lighthouse/Core Web Vitals, performance budgets, SEO crawler simulation, and a full end-to-end test suite.

## 4. Competitive evidence and product distinction
See the companion report: `B22-CORE-CALCULATOR-COMPETITIVE-RECHECK-2026-11-28.md`.

The review read the current moveBuddha calculator and its public data-refresh announcement, plus U-Pack's current pricing explanation and calculator explainer. Main findings:
- moveBuddha requests origin/destination, move date, property type and home size, and presents a rough moving-price range. Its public monthly-data-volume claims conflict (1,000+ on the current calculator page versus 10,000+ in its June 2026 announcement); neither figure should be repeated as independently audited evidence.
- U-Pack explains its own service price through equipment/space used, availability, date and distance. This is not a general full-service household-mover cost coefficient.
- Relocation Cost's defensible distinction is a broader whole-move budget: transport planning estimate plus user-entered relocation expenses, employer lump-sum/direct-paid support, and a separate pre-income cash buffer. It explicitly discloses that it is not a binding mover quote and does not calculate taxes.
- The homepage H1 and supporting copy accurately describe that scope. No copy or feature change is justified solely by competitor imitation.

## 5. Decision and constraints
- No production code, calculator formula, price, coefficient, benchmark, route-distance data, API request, environment variable, or deployment was changed.
- No date-based, seasonal, capacity-availability, or truck-space price factor is authorized by this review.
- No B24/B15 research was reopened. Those streams remain parked under Claude's 2026-11-27 instruction pending comparable shipment records or real quotes.
- B26 remains parked; the government 400NG workbook is not civilian consumer-price calibration.
- B25 remains unchanged. The next planned Google URL reinspection is around 2026-12-10. Do not resubmit URLs or make mass internal-link changes based on this B22 review.
- PR #308 is already merged; its deployed commit is the production version verified here.

## 6. One-pass request to Claude
Please review this report, the companion competitor report, PR #308, and the live production behavior **once as a consolidated review**. Do not create separate exploratory PRs or reopen unrelated workstreams.

1. Independently verify the competitor-page claims and whether the stated product distinction is fair and useful.
2. Independently reproduce the homepage → calculator query-prefill flow, the CA→TX sample, recalculation, share-URL generation, and 390px no-overflow check.
3. Review the visible homepage/calculator experience and inspect the remaining explicit QA gaps: keyboard focus/order, labels/announcements, contrast, 320/360/768 widths, validation boundaries, reset, print, and email-draft behavior.
4. Review the calculator/methodology disclosures for any misleading implication that the model band is a market range or that the CMR benchmark calibrates the model.
5. Return one consolidated verdict: `ACCEPT / ACCEPT WITH SMALL FIX / REJECT`, with reproducible evidence and a prioritized list of any defects.
6. If a real visitor-facing defect is found, make only the smallest evidence-based correction on this same PR branch and document before/after proof. Do not change prices, formulas, coefficients, or production claims without separate evidence.
7. If no defect is found, recommend closing B22 with the remaining QA limitations explicitly recorded. Do not claim a formal accessibility certification or market-price validation.

**Required final response from Claude:** one review summary, exact tests performed and results, any fix commit(s) if needed, explicit production-change statement, and a single next checkpoint. No additional research loops unless new evidence materially changes the decision.

## Sources
- https://www.movebuddha.com/moving-cost-calculator/
- https://www.movebuddha.com/blog/press-release-movebuddha-refreshes-moving-cost-calculator-with-updated-pricing-data/
- https://www.upack.com/articles/understanding-upack-pricing
- https://www.upack.com/articles/moving-cost-calculator
- Live production pages and assets listed above (fetched 2026-11-28).


## 7. Claude review — 2026-11-28
**Verdict: ACCEPT WITH SMALL FIX.**

Method: local build of the same application code as `d2f8bf2` with Chromium (not the live URL).
- Reproduced: homepage → calculator prefill, 1,546 miles, $4,123 ($3,299–$4,948), $4,627 at 2,000 miles.
- Extra checks: widths 320/360/390/768 on 4 pages, no horizontal overflow; axe on 4 pages at 320/768, light and dark: only one moderate `landmark-complementary-is-top-level` (calculator aside), left as is; first 40 Tab stops had a visible focus style (by computed style, not by eye); no unlabeled form fields; invalid values 0, -5, empty, 999999 show an error and dashes; 499.5 accepted; reset works; print button refuses invalid input; the email link carries the estimate. The only 404 locally is the Vercel analytics script.
- **Defect 1 (fixed):** elements marked `hidden` were still displayed where a utility class set `display`. The printed summary showed an empty employer line and a $0 cash buffer to visitors who used neither.
- **Defect 2 (fixed):** after an invalid input, the browser's own print menu still printed the previous estimate.
- Not verified: competitor claims (moveBuddha, U-Pack) not re-read; no screen reader, real device, real print dialog, Lighthouse, or other browsers.

**B22:** closed with these limits. B25's 2026-12-10 checkpoint is unchanged; B24/B15/B26 stay parked.
