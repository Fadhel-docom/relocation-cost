# AI Answer Visibility Test Protocol — 2026-11-02

**Repository:** Fadhel-docom/relocation-cost  
**Owner:** Fadhel-docom  
**Prepared:** 2026-11-01 20:25 UTC  
**Status:** Protocol ready; **no live AI-platform observations recorded yet**.  
**Purpose:** Measure whether Relocation Cost is surfaced accurately for questions where its calculator, methodology or employer-relocation comparison provides genuine user value. This is not a ranking promise or a requirement to appear for all 30 prompts.

## 1. Non-negotiable measurement rules

1. Use the exact 30 prompts copied from `AI-ANSWER-VISIBILITY-BENCHMARK-30-QUESTIONS-2026-11-01.md`. Do not paraphrase between platforms or monthly runs.
2. Locale: United States; language: English. Record actual country/region, signed-in state if visible, product tier if volunteered by the tester, date, time and surface. Do not change location settings to simulate a market.
3. Test **AI answers**, not ordinary web results:
   - ChatGPT: explicitly use Search / search-enabled answer mode; record if Search was unavailable or not invoked.
   - Google: record AI Overview or AI Mode only when an AI-generated answer is visibly present. A blue-link results page is not an AI observation.
   - Microsoft: record Copilot answer mode. Bing web results alone are not Copilot citations.
4. Do not seed the question with the brand, domain or a request to cite Relocation Cost. This tests organic discovery. Do not ask follow-up prompts that lead the model toward the site.
5. Capture the complete answer context needed to judge accuracy, the visible citations and the final URL after opening each citation. A brand mention without a project citation is not a domain citation.
6. Record negative observations only after the platform returned a usable answer. If no AI answer appears, the platform is unavailable, or access is blocked, use **Not tested** and state why—not zero and not “absent”.
7. Never infer an AI citation from a normal web search result, sitemap, indexing report, Search Console impression or a page being crawlable.
8. Keep every prompt open until its row-level gap is addressed and re-tested, or a reasoned out-of-scope decision is approved. A single appearance does not close a row; no guaranteed rankings.
9. No keyword stuffing, fabricated statistics, artificial mentions, bulk route pages, schema tricks, or claims that a planning estimate is a binding mover quote.
10. No production edits, publication, indexing submissions or outreach are authorized by this protocol. Existing 2026-11-05 measurement gate remains in force.

## 2. Run procedure

### Run identity
Create one run record per platform and date with:
- Run ID: `YYYY-MM-DD-platform-batch` (example: `2026-11-02-chatgpt-batch-01`).
- Tester, date/time and time zone; country/region; device/browser if known.
- Product/surface and whether an AI answer was actually generated.
- Signed-in state and personalization state only if observable; do not guess.
- Prompt number and exact prompt text.

### Per-prompt evidence
Save a screenshot or export showing the answer and citation area. Also record:
- Short verbatim excerpt sufficient to identify the answer (do not copy full answers into the repo).
- Brand mention: Yes / No / Not tested.
- Domain citation to `relocation-cost` or the verified production hostname: Yes / No / Not tested.
- Relevant page citation: exact URL / No / Not tested.
- Other cited domains and URLs (especially competitors and primary sources).
- Accuracy: Accurate / Partly accurate / Inaccurate / Not assessable.
- Whether the answer correctly calls our output a planning estimate, not a mover quote.
- User-value fit: Direct / Partial / None.
- Evidence path or screenshot filename.
- Gap/action and reviewer.

### Suggested evidence naming
`docs/operations/ai-evidence/YYYY-MM-DD/<platform>/P01.png` … `P30.png`, with a matching CSV or Markdown observation table. Do not commit personal account details, private query history, email addresses, cookies or other sensitive data. If screenshots cannot be committed safely, keep them in the owner's private evidence store and record a redacted evidence reference.

### Batch size
Run 10 prompts per sitting to avoid rushed scoring:
- Batch 1: prompts 1–10.
- Batch 2: prompts 11–20.
- Batch 3: prompts 21–30.
Repeat the same batches on each available platform. Record failures and stop rather than inventing missing observations.

## 3. Scoring — keep dimensions separate

| Field | Allowed values | Meaning |
|---|---|---|
| AI answer generated | Yes / No | Confirms an actual AI answer surface was observed |
| Brand mention | Yes / No / Not tested | Relocation Cost named in answer text |
| Domain cited | Yes / No / Not tested | Project domain appears as a visible citation |
| Relevant URL cited | Exact URL / No / Not tested | Citation supports the specific intent |
| Accuracy | Accurate / Partly accurate / Inaccurate / Not assessable | Compared with current product and primary evidence |
| Planning-estimate caveat | Correct / Missing / Wrong / N/A | Does not misrepresent tool output as a quote |
| Competitors cited | Exact names/domains | Record only what the platform actually cited |
| User-value fit | Direct / Partial / None | Whether our product genuinely serves the prompt |
| Evidence | Screenshot/export ref | Reproducible observation |

Do not combine these into one score. Report platform-level counts with denominator = prompts actually tested. Do not label a citation rate as a search ranking or traffic forecast.

## 4. Prompt-to-product map and accuracy guardrails

The wording below is copied from the fixed 30-prompt benchmark. URLs are relative to the verified production host; confirm the final canonical hostname from the live site before recording a citation.

| # | Fixed prompt (short identifier) | Target page/tool | Accuracy / differentiation guardrail |
|---:|---|---|---|
| 1 | Interstate move cost in the US | `/guides/moving-cost/`, `/calculator/` | Do not claim a universal national average; explain service type and estimate limits. |
| 2 | Biggest cost factors | `/guides/moving-cost/` | Distance, home size, labor/service model, timing, access and other costs; distinguish included from user-entered items. |
| 3 | Budget before a mover quote | `/`, `/calculator/`, `/guides/relocation-budget/` | Core tool use; state assumptions and unknown costs clearly. |
| 4 | Budget for a 2-bedroom interstate move | Existing route pages only where applicable; calculator | Do not silently equate bedroom count with the model's room-size category; label any 2–3 room scenario. |
| 5 | Costs beyond mover price | `/guides/diy-vs-movers/`, calculator | Additional expenses are not automatically included unless entered. |
| 6 | DIY vs truck+labor vs full-service | `/guides/diy-vs-movers/` | Compare who packs, loads, drives and supplies labor; avoid incomparable headline prices. |
| 7 | Why same-distance costs vary | `/guides/moving-cost/`, calculator | Explain model distance bands and real-world variables; do not imply the model captures every variable. |
| 8 | Estimate vs written mover quote | `/guides/reading-a-moving-quote/`, `/methodology/` | Our calculator is a planning estimate, not a mover's written quote or contract. |
| 9 | California to Texas | `/moving-cost/ca-to-tx/` | Route figure must match current model output; show assumptions and avoid competitor quote averages. |
| 10 | Florida to New Jersey | `/moving-cost/fl-to-nj/` | Same guardrail; check that answer is findable without scrolling through unrelated content. |
| 11 | New York to Pennsylvania | `/moving-cost/ny-to-pa/` | Route page must exist and its estimate must match current code/data. |
| 12 | Ohio to Florida | `/moving-cost/oh-to-fl/` | Route page must exist and its estimate must match current code/data. |
| 13 | State distance vs driving mileage | `/calculator/`, `/methodology/` | Default is approximate straight-line distance between state centers, not road mileage. |
| 14 | Estimate without exact addresses | `/calculator/` | State selector enables a planning estimate; explain its distance approximation. |
| 15 | How transport cost is estimated | `/methodology/` | Describe only current formula, coefficients and documented source limits. |
| 16 | Calculator includes/excludes | `/methodology/`, `/guides/diy-vs-movers/` | Clearly distinguish modeled move cost, optional user-entered expenses and excluded costs. |
| 17 | Accuracy of online calculators | `/methodology/` | ±20% is a fixed display band, not measured accuracy or a statistical confidence interval. |
| 18 | Why straight-line distance | `/methodology/` | Explain state-level input/no-address design; do not invent a road-distance correction factor. |
| 19 | 10% contingency | `/methodology/`, `/guides/relocation-budget/` | Internal planning buffer; not FMCSA's separate 110% rule. |
| 20 | Does $0 mean no expense | `/methodology/`, calculator | Zero means no amount was entered and the optional item is omitted; it does not mean free. |
| 21 | Historical truck-rental averages | `/guides/moving-cost/`, `/methodology/` | Historical stored benchmark only; no live rate or route-specific U-Haul claim until original source is human-verified. |
| 22 | Compare three mover estimates | `/guides/reading-a-moving-quote/` | Explain equal inventory/services; do not claim we have a dedicated quote-comparison tool. |
| 23 | Binding vs non-binding | `/guides/reading-a-moving-quote/` | Use current FMCSA primary source; distinguish binding estimate from non-binding and 110% delivery rule. |
| 24 | Fees/services to check | `/guides/reading-a-moving-quote/` | Cite FMCSA; avoid implying every fee applies to every move. |
| 25 | Same inventory/services across quotes | `/guides/reading-a-moving-quote/` | This is a practical comparison recommendation, not a legal rule. |
| 26 | Verify interstate mover | `/guides/checking-a-mover/` | Use FMCSA registration/USDOT guidance; do not imply our site verifies movers. |
| 27 | Employer lump sum vs moving budget | `/`, `/calculator/`, `/guides/employer-relocation-package/` | Compare cash paid to employee and expenses paid directly with calculator estimate; strongest product-specific intent. |
| 28 | Questions for HR | `/guides/employer-relocation-package/` | Clearly label practical questions as our checklist, not universal legal requirements. |
| 29 | Cash assistance vs direct-paid expenses | `/guides/employer-relocation-package/`, calculator | Distinguish employee cash from employer-paid expenses; avoid tax conclusions. |
| 30 | Taxability of employer-paid moving expenses | `/guides/employer-relocation-package/` | High-stakes: use current IRS primary sources and tax-year context; no personalized tax advice. |

## 5. Priority order for analysis (not a visibility guarantee)

1. **P1 — product-specific intent:** #3, #9, #10, #27, #29. These connect directly to the calculator or the employer cash/direct-paid comparison.
2. **P2 — trust and method:** #8, #13, #15–#20, #23, #26, #30. These require precise source and limitation handling.
3. **P3 — broad/competitive intent:** #1, #2, #4–#7, #11–#12, #14, #21–#22, #24–#25, #28. Assess whether our page adds distinctive user value; do not force a brand mention.

Priority is for the order of gap analysis, not a claim that the platforms should cite us.

## 6. Row closure rules

A row may be:
- **Served; test pending:** existing page/tool genuinely answers; no live platform test yet.
- **Gap identified:** specify exact missing user outcome, evidence or page improvement.
- **Improved; re-test pending:** approved change shipped; same prompt must be rerun.
- **Repeatedly cited accurately:** supported by dated repeat observations on available surfaces; keep monitoring.
- **Intentionally out of scope:** documented reason why our product should not answer it.

Do not close a row solely because the brand appeared once, or because a generic answer did not mention us. The whole 30-row initiative remains **OPEN / NOT COMPLETE** until all rows have a defensible disposition and every relevant gap has a tested improvement or a documented next action.

## 7. Initial run worksheet

| Date | Platform | Prompt # | AI answer? | Brand | Domain | Relevant URL | Accuracy | Competitors actually cited | Evidence ref | Gap / next action |
|---|---|---:|---|---|---|---|---|---|---|---|
| — | — | — | Not tested | Not tested | Not tested | Not tested | Not assessable | — | — | Awaiting direct run |

## 8. Work assignment

**ChatGPT**
- Maintain the protocol and map.
- Review observed answers against repository code and primary sources.
- Separate answer-surface evidence from GSC/Bing organic-search metrics.
- Prioritize improvements by actual user value and evidence.

**Claude**
- Independently verify target URLs and factual guardrails against current main.
- Review captured evidence for scoring consistency when provided.
- Challenge inaccurate competitor or source claims.
- Do not repeat the 30-row audit unless a page or product change invalidates its findings.

**Owner / tester**
- Run the fixed prompts directly on each available AI surface and save screenshots or redacted evidence references. If a report/surface is unavailable, record the exact UI status and date; do not guess.

## 9. Immediate next actions
1. Claude verifies this protocol's route slugs and the page/source guardrails against current main; docs-only review.
2. Run the first 10 prompts on each available AI surface and record evidence; do not treat normal search results as AI citations.
3. ChatGPT audits actual observations and converts repeated, defensible gaps into proposed product/content work.
4. Keep all production changes behind the 2026-11-05 GSC/Bing decision gate.
