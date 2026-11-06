# AI Answer Visibility Benchmark — 30 prompts
**Created:** 2026-11-01 | **Status:** test protocol prepared; live AI-platform observations not yet captured.

## Test protocol
- Keep wording, locale (English, United States), and run date consistent. Record product/surface, signed-in state if known, answer text excerpt, cited domains/URLs, whether Relocation Cost is named, whether a project URL is cited, competitors cited, factual accuracy, and screenshot/evidence reference.
- Run each prompt in ChatGPT Search, Google AI Overviews/AI Mode where shown, and Microsoft Copilot. A normal web search result is not an AI answer citation. Do not infer an AI mention from indexed pages.
- Repeat the same 30 prompts monthly, not repeatedly every day. AI answers vary by location, personalization, model and time; this is a directional sample, not a ranking guarantee.
- Score each platform separately: brand mention (0/1), domain citation (0/1), relevant page citation (0/1), answer accuracy (0/1), competitor citations (list). Do not add scores across platforms as if they were search volume.
- For prompts asking current prices, verify source date and geography. Do not reward the site for being cited if the answer misrepresents the estimate as a quote.

## Prompt set
### A. Core intent and cost (1–8)
1. How much does an interstate move cost in the United States?
2. What factors have the biggest effect on the cost of moving between states?
3. How can I estimate a moving budget before I have a mover quote?
4. How much should I budget for a 2-bedroom interstate move?
5. What costs should I include beyond the moving company price?
6. How do DIY, rental truck with labor, and full-service moving compare?
7. Why do moving costs vary so much for the same distance?
8. What is the difference between a moving cost estimate and a written mover quote?

### B. Route-specific intent (9–14)
9. How much might it cost to move from California to Texas?
10. What should I budget to move from Florida to New Jersey?
11. What affects the cost of moving from New York to Pennsylvania?
12. How should I estimate a move from Ohio to Florida?
13. Is state-to-state distance the same as driving mileage when estimating a move?
14. How can I estimate costs for a route before I know the exact addresses?

### C. Methodology and trust (15–21)
15. How does a moving cost calculator estimate transportation costs?
16. What does a moving budget calculator include and exclude?
17. How accurate are online moving cost calculators?
18. Why might a calculator use straight-line distance instead of road miles?
19. What does a 10% contingency allowance mean in a moving budget?
20. Does a $0 optional cost mean I will not have that expense?
21. How should I use historical rental-truck averages when planning a move?

### D. Comparing real mover estimates (22–26)
22. How do I compare three interstate moving company estimates fairly?
23. What is the difference between binding and non-binding moving estimates?
24. What fees or services should I check before accepting a mover estimate?
25. How can I tell whether two mover estimates cover the same inventory and services?
26. What should I verify about an interstate mover before booking?

### E. Employer relocation (27–30)
27. How do I compare an employer relocation lump sum with my moving budget?
28. What should I ask HR about relocation benefits before accepting a job?
29. What is the difference between cash relocation assistance and expenses paid directly?
30. Are employer-paid moving expenses taxable in the United States?

## Target page map
| Prompt range | Main page(s) | Citation / accuracy guardrail |
|---|---|---|
| 1–8 | /guides/moving-cost/, /calculator/, plus /guides/diy-vs-movers/ (5–6), /guides/relocation-budget/ (3), /guides/reading-a-moving-quote/ (8) | No universal national average without a defensible sample; label outputs as planning estimates. |
| 9–14 | Existing route pages only where present; /calculator/ | Route-specific values must come from the calculator/model and show straight-line vs road-mile distinction. |
| 15–21 | /methodology/ and /calculator/ | Explain assumptions, U-Haul September 2025 benchmark, zero fields, 10% contingency and ±20% planning band accurately. |
| 22–26 | /guides/reading-a-moving-quote/ (22–25), /guides/checking-a-mover/ (26) — corrected 2026-11-01, see AI-BENCHMARK-30-ROW-AUDIT-2026-11-01.md | Use FMCSA primary sources; distinguish mover quote types and compare equal inventory/services. |
| 27–30 | /guides/employer-relocation-package/ and /calculator/ | No tax advice; prompt 30 requires current IRS primary-source verification before publishing a substantive answer. |

## Competitor recording
Record only competitors actually cited by the platform for each prompt. Likely comparison set to watch, not assumed citations: moveBuddha, HireAHelper, Moving.com, U-Haul, This Old House, FMCSA, and relevant mover/provider sites.

## Initial run — 2026-11-01
- Google web-search spot check: exact-domain queries for the production Vercel hostname plus core brand/methodology terms returned no results in the web search tool. This is a limited tool observation, not proof the site is absent from Google Search or AI Overviews; it does not substitute for Search Console or a direct browser session.
- AI answer surfaces: no direct answer/citation observation was available in this session for ChatGPT Search, Google AI Overviews/AI Mode, or Copilot. Status is **Not tested**, not zero citations.
- Bing AI Performance: official documentation confirms the report measures cited URLs, citation counts, grounding queries and trends across Copilot, Bing AI summaries and selected partner integrations. The report is aggregated and sampled; it is not a prompt-by-prompt answer log. Verify availability in the actual property dashboard.
- Google: official guidance says normal SEO fundamentals and distinctive, useful content remain foundational; it rejects special AEO hacks, unnecessary llms.txt, and inauthentic mentions. A Google generative AI performance report is described in current guidance, but account availability must be checked directly.


## Evidence-based spot checks — 2026-11-01 (web search, not AI-answer tests)
These observations are from public web search result pages returned during this session. They are not direct tests of ChatGPT Search, Google AI Overviews/AI Mode, or Copilot answers.

| Query / prompt sample | Relocation Cost observed? | Competitors / sources actually surfaced | Interpretation |
|---|---|---|---|
| Exact production hostname + brand/methodology terms | No result surfaced in this tool's result set | None | Limited discovery signal only; not proof of Google absence. Check Search Console and direct search surfaces. |
| #1 How much does an interstate move cost? | No Relocation Cost result surfaced | This Old House; moveBuddha; USMove; Moving-Calculator.net; MoveBuddha cost dataset | Generic cost intent is crowded by pages with price ranges and source datasets. Differentiate with transparent assumptions and clear “planning estimate” boundaries. |
| #9 California to Texas cost | No Relocation Cost result surfaced | FreightWaves Checkpoint; GoodMigrations; moveBuddha; Three Movers; other route pages | Route intent is highly competitive and many pages publish quote-derived ranges. Do not imitate market-average claims unless our evidence supports them. |
| #22–25 compare moving estimates / quote comparison | No Relocation Cost result surfaced | MoveDayMap Quote Decoder; Have a Good Move paid quote review/comparison | The quote-comparison concept already has direct competitors. Our concept needs a clearly differentiated, privacy-minimal, no-upload scope-normalization job before any build. |

Competitor evidence:
- This Old House reports a 2026 interstate average based on its analysis of 1,000+ moving quotes: turn423269search0.
- FreightWaves Checkpoint, GoodMigrations, moveBuddha and Three Movers surfaced for California→Texas route intent: turn423269search1 turn423269search2 turn423269search3 turn423269search10.
- MoveDayMap presents a quote decoder and side-by-side comparison; Have a Good Move offers paid human quote comparison: turn423269search6 turn423269search7.

## Platform-level AI visibility measurement
- Bing AI Performance is the best immediate owner-side source to inspect: Microsoft says it reports citations, average cited pages, grounding queries, page-level citations and trends across Copilot, Bing AI summaries and selected partner integrations. A newer Topics Portfolio beta groups topics and opportunity queries; availability may depend on site activity. turn835492search0 turn835492search1
- Google Search Central says AI Overviews/AI Mode rely on foundational SEO and helpful, reliable content; there are no special AI-only technical requirements or required llms.txt/schema. The current Google documentation describes a Generative AI performance report in Search Console, but the actual property view must be checked by an authorized account user. turn835492search4 turn835492search9 turn835492search3
- Direct AI answer tests remain **Not tested** in this environment. The web search engine results above cannot be represented as AI citations. To complete the 30-prompt platform test, run the fixed prompt set directly in each AI surface and capture dated screenshots/URLs, or export Bing AI Performance and Google Search Console reports.

## Blank observation template
| Date | Platform / surface | Prompt # | Brand mention | Domain cited | URL cited | Competitors cited | Answer accurate? | Evidence / notes |
|---|---|---:|---:|---|---|---|---|---|
| — | — | — | Not tested | Not tested | Not tested | — | — | Awaiting direct platform run |

## Decision rule
Do not rewrite pages based on one volatile answer. Look for recurring query clusters, incorrect facts, missing source pages, and repeated competitor citations across multiple prompts and runs. Use Bing AI Performance and GSC for aggregated visibility, and the manual benchmark for qualitative answer sampling.

## Owner decision and revised acceptance criteria — 2026-11-01 13:25 UTC
**Status: OPEN / NOT COMPLETE.** The owner explicitly stated that the initial scan does not complete this work while the questions do not serve the site. The 30 prompts are a test scaffold, not a finished SEO/AI-search outcome.

For every one of the 30 prompts, add a row-level audit with: relevance to Relocation Cost; current target page/tool; whether that page actually answers the intent; unique user value; evidence/source gap; competitor advantage; quality/differentiation action; priority; and dated re-test result. Classify prompts as directly relevant, relevant-but-underserved, or out of scope. Do not force a brand mention for unrelated general questions.

A relevant prompt stays open until the gap is addressed and re-tested on available AI answer surfaces, with brand mention, domain citation, relevant URL, accuracy, competitors and screenshot/evidence recorded. A prompt can be marked out of scope only with a reason. If the platform is unavailable, mark Not tested, not zero. Ordinary web search is not an AI citation. Do not promise appearance on every answer: visibility is earned and volatile. **The overall task stays OPEN until all 30 prompts have documented dispositions and every relevant gap has an evidence-backed action and subsequent test.**

### Next work (Claude + ChatGPT)
Claude: perform an independent 30-row relevance/value/competitor-gap audit and log findings. ChatGPT: convert the audit into prioritized product/content differentiation work, then re-test after approved improvements. No keyword stuffing, fabricated data, mass route pages, or unsupported claims. No production publishing or outreach outside existing approval gates.


## Direct AI surface access attempt — 2026-11-05
- Canonical prompt #3 was attempted once through connected integrations for Google AI Mode, Google AI Overview, Microsoft Copilot and a ChatGPT answer connector. All four returned HTTP 403 before returning content.
- No answer/citation evidence exists; prompt #3 remains Not tested on all four surfaces. The other nine pilot prompts were not run after the access failures. Do not interpret 403 as no brand mention or zero citations.
- The ChatGPT connector is not proof of official ChatGPT Search invocation. The direct Search-enabled surface requirement remains unmet.
- The connected GSC actions expose ordinary analytics, URL inspection and sitemaps, but no generative-AI report action; Bing actions expose ordinary site/page/query performance, but no AI Performance action. Dashboard AI visibility is therefore not tested, not zero.
- Full access-attempt record: [AI-ANSWER-SURFACE-ACCESS-ATTEMPT-2026-11-05.md](AI-ANSWER-SURFACE-ACCESS-ATTEMPT-2026-11-05.md).
