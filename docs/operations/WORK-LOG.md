# سجل العمل المشترك — Relocation Cost

## 2026-10-29 ليلًا (محلي ~23:40) — الطرف: Claude (الثاني) (اليوم 43: خريطة القنوات والمبادرات الثلاث)
- **المهمة / الهدف:** تنفيذ `CLAUDE-2-GROWTH-BRIEF.md`: خريطة قنوات الزيارات، ثم 3 مبادرات، ثم تنفيذ الأعلى أثرًا بعد تأكيد عدم التداخل.
- **ما قُرئ:** OPS-ROOM وCLAUDE-ONBOARDING وCLAUDE-2-GROWTH-BRIEF وLINK-RESEARCH وأحدث إدخالات السجل وبنية `src/pages`.
- **ما نُفّذ:** ملف `docs/operations/CHANNEL-MAP-AND-INITIATIVES-2026-10-29.md` (وثائق فقط). المبادرة 1 المقترحة: كتل إجابة مصدرية في 3 أدلة (`moving-cost` و`relocation-budget` و`employer-relocation-package`)؛ المبادرتان 2 و3 مؤجلتان.
- **ما لم يُنجز / لم يُتحقق:** لم أقرأ نص الأدلة الثلاثة الحالية بعد؛ لا وصول لي إلى GSC وBing (حالة اتصال Composio «initiated» دون حساب)؛ فُتحت صفحة منافس واحدة فقط (northamerican.com). لم يُغيَّر أي كود، ولم يُرسل أي شيء خارجيًا. الفرع القديم `docs/claude-growth-strategy-20261029` مسودة سابقة تُحذف.
- **نطاق العمل المعلن للمبادرة 1:** الملفات `src/pages/guides/moving-cost.astro` و`relocation-budget.astro` و`employer-relocation-package.astro` + اختبار جديد. لا أمسّ `checking-a-mover` (PR #118).
- **ما يحتاجه الطرف التالي:** Claude الأول/ChatGPT: تأكيد في السجل أن هذا النطاق لا يتداخل مع عملكما. Claude الأول: تصدير GSC (Queries وPages) في 2026-11-05. ChatGPT: فتح صفحتي teamzlab وAIRINC وتسجيل ميزاتهما.
- **الخطوة التالية (Claude الثاني):** بعد التأكيد: قراءة الأدلة الثلاثة، فإن لم تحوِ الكتل نُفّذت المبادرة 1 في PR مع CI أخضر.

---

## 2026-10-29 ليلًا (محلي ~23:10) — الطرف: Claude (الأول) (اليوم 43: مراجعة PR #116)
- **المهمة / الهدف:** «ابدأ العمل» في غرفة العمليات: قراءة السجل والـPRs المفتوحة وإكمال ما هو معلّق.
- **الحالة عند البدء:** PR #116 من ChatGPT مفتوح (حذف عبارة «page shows an update date of April 30, 2026» من دليل حزمة صاحب العمل لأن صفحة IRS المفتوحة لا تعرض تاريخًا)؛ build أحمر؛ لا PR من Claude الثاني بعد.
- **سبب الفشل (مُثبت محليًا):** `employer-package.js` يُسقط `pageUpdated` (يصير `undefined`) حين تكون القيمة null في `data/source-checks.json`، بينما اختبارا ChatGPT توقّعا `null`. أصلحتُ التوقع إلى `undefined` على فرعه؛ `npm test` كاملًا 204/204 محليًا، وCI build + render خضراء.
- **القرار:** دمج #116 (main 969d7bf). الإزالة صحيحة: لا تُعرض تواريخ لا تدعمها صفحة مفتوحة؛ التاريخ الأصلي جاء من قراءتي السابقة عبر ملخص WebFetch ولم يُثبت من نص الصفحة، فأقرّ هنا بأنه كان غير مدعوم. بعد الدمج: Build وVerify live site ناجحان على 969d7bf.
- **ما لم يُنجز / لم يُتحقق:** لم أفتح صفحة IRS بنفسي مرة أخرى (اعتمدتُ على قراءة ChatGPT وعلى غياب النص من الشيفرة)؛ لم أرَ الصفحة في متصفح.
- **ما يحتاجه الطرف التالي:** Claude الثاني: بدء خريطة القنوات حسب `CLAUDE-2-GROWTH-BRIEF.md` وتسجيل النطاق. ChatGPT: تحقق من وجود تواريخ «page updated» أخرى في الأدلة الأخرى مأخوذة من ملخصات لا من نص الصفحة (quote-guide: 2023-10-26 و2024-11-04) ودوّن النتيجة دون تعديل الشيفرة.
- **الخطوة التالية (Claude الأول):** GSC في 2026-11-05.

---

## 2026-10-29 UTC — ChatGPT: refine IRS date wording after catalog-page discrepancy
- **Quality correction:** The IRS catalog search result snippet reports the 2025 Form 3903 instructions as posted 11/21/2025, but opening the catalog URL in this audit rendered a different page of results and did not show the matching row. I therefore do **not** present 11/21/2025 as independently verified in the guide.
- **Final user-facing wording:** Removed all update-date commentary from the guide's factual tax statement. It now states only the substantive rule supported by the opened 2025 instructions. The unsupported 2026-04-30 date remains cleared from source metadata (`pageUpdated: null`).
- **Tests:** Updated the regression assertion so the guide must not display either unsupported date or claim a page-update date. The employer-package test is included in `npm test`.
- **Next:** PR #116 CI is pending; review test/build/SEO/render checks before merge. No claim that tests passed until CI reports it.

---

## 2026-10-29 UTC — ChatGPT: verify and remove unsupported Form 3903 update date
- **Task from operations-room handoff:** Independently verify the claimed IRS Form 3903 update date before Claude’s next review.
- **Sources opened:** Official IRS instructions page https://www.irs.gov/instructions/i3903 (opened 2026-10-29; page text lines 128–161 identifies “Instructions for Form 3903 (2025)” and the tax rule; searches for “Updated,” “April 30,” and “Last Reviewed” returned no matches); official IRS forms catalog https://www.irs.gov/forms-instructions-and-publications?find=Inst&page=9 (catalog shows the 2025 revision posted 11/21/2025); official PDF https://www.irs.gov/pub/irs-pdf/i3903.pdf (PDF identifies 2025 instructions, dated Aug 18, 2025).
- **Finding:** The visible official sources do **not** support saying the instructions page was updated April 30, 2026. The HTML text has no visible update date; the catalog identifies revision 2025 and posted 11/21/2025. This does not prove that no backend CMS edit occurred, only that the displayed claim was not verified from visible official evidence.
- **Changes on this branch:** Updated `src/lib/employer-package.js` to remove the unsupported date claim and describe the visible evidence; set `data/source-checks.json` `irs-i3903.pageUpdated` to null and `lastVerified` to 2026-10-29; updated `docs/operations/CITATION-AUDIT-ChatGPT.md` with sources, date, and limitation.
- **Validation:** No tests/build run yet. The source-check entry is manual-monitored, so clearing `pageUpdated` avoids displaying an unsupported date; review tests and build in CI before merge.
- **Next for Claude:** Review this diff and run the relevant source-check/data validation plus full CI. Do not restore 2026-04-30 unless an official visible field/version history supports it.

---

## 2026-10-29 ليلًا (محلي ~22:45) — الطرف: Claude (الأول) (اليوم 42: مراجعة PR #109/#114 وتكليف Claude الثاني)
- **المهمة / الهدف:** بعد أن أنهى ChatGPT عمله: مراجعة ما قدّمه، ودمج ما يصلح، وكتابة مهمة محددة لوكيل Claude الجديد (النمو وجلب الزيارات ودراسة المنافسين) بطلب المالك.
- **ما دُمج:** PR #109 (دليل انضمام Claude جديد، وثائق فقط، CI أخضر) ثم PR #114 (مجمّع: HeiGIT وLINK-RESEARCH وCANADA-READINESS وتحديث تدقيق FTC؛ وثائق فقط، CI أخضر، الترويسة في السطر 1). main الآن 51e8da4 قبل هذا الإدخال.
- **ملاحظات المراجعة (لم أتحقق من المصادر الخارجية بنفسي ما عدا ما ذُكر):** (1) HeiGIT: ChatGPT يورد ردًّا من فريق HeiGIT بتاريخ 2026-10-12 يقول إن الاستخدام التجاري مسموح في الخطة Standard، وهذا يخفف عقبة كنت سجّلتها سابقًا (لم أرَ الرد بنفسي)؛ لكن الشروط الكاملة لم تُقرأ، والاستخدام مع إيراد الإحالة والإسناد والتخزين المؤقت لم تُحسم، فيبقى R4 محجوبًا بانتظار رد مكتوب. (2) تاريخ إيقاف الواجهة القديمة: ChatGPT يكتب «قبل 2026-11-16» بينما سجّلتُ سابقًا نافذة 2–6 نوفمبر؛ لم أحسم الفرق، والمرجع صفحة إعلان HeiGIT نفسها عند الحاجة. (3) LINK-RESEARCH صادق في أن معظم صفحات الجامعات ضعيفة الملاءمة؛ لا تواصل. (4) تدقيق FTC: صفوف FTC صارت «مؤكدة» حسب ChatGPT بعد فتح الصفحة؛ لم أعد فتحها. تاريخ Form 3903 («30 أبريل 2026») ما زال غير مؤكد.
- **ما تغيّر هنا:** ملف `docs/operations/CLAUDE-2-GROWTH-BRIEF.md` (مهمة Claude الثاني، قيود، أولويات، تسليم) فقط؛ لا شيفرة تطبيق.
- **ما لم يُنجز:** لم أراجع مضمون PR #114 مصدرًا مصدرًا؛ لم أغيّر أي دليل بناءً على نتائج FTC.
- **ما يحتاجه الطرف التالي:** Claude الثاني: اقرأ `CLAUDE-2-GROWTH-BRIEF.md` وابدأ بخريطة القنوات (البند 1) وسجّل نطاقك قبل لمس ملفات. ChatGPT: إثبات تاريخ Form 3903 المرئي، ثم دعم Claude الثاني بقراءة ما لا يفتحه. المالك: إرسال رسالة HeiGIT (المسودة في `HEIGIT-TERMS-READING.md`) إن رغب.
- **الخطوة التالية (Claude الأول):** مقارنة GSC في 2026-11-05 ثم 2026-11-12؛ مراجعة أول مخرجات Claude الثاني.

---

## 2026-10-29 UTC — ChatGPT: C2 HeiGIT / OpenRouteService terms review
- **Goal:** Assess R4 before any route-distance integration, following `STATUS-AND-PLAN-2026-10-29.md`.
- **Reviewed:** Official API landing page and restrictions page; HeiGIT announcement dated 2026-10-22; a 2026-10-12 forum answer from a HeiGIT team member; the current terms page was not readable in the browser (403).
- **Result:** The HeiGIT forum reply says Standard-plan commercial usage is allowed and identifies CC-BY-SA 4.0 results; available terms excerpts indicate OSM attribution is normally required. Exact attribution wording, caching permission, and current quotas are **not fully verified**. The forum post's 2,000/day and 40/min figures are not treated as primary-source confirmation.
- **Artifact:** Added `docs/operations/HEIGIT-TERMS-READING.md` on branch `docs/heigit-terms-reading-20261029`, with evidence table, limitations, decision, and an English inquiry draft.
- **Decision:** R4 remains blocked. No API key, code, or production behavior changed. Keep current straight-line estimates until current terms/written clarification resolve licensing, attribution, caching, and quotas.
- **Tests:** Not run; documentation-only change. No build/CI result claimed.
- **What remains:** This branch still needs a review/PR and green CI before merge. Owner may send the drafted question to HeiGIT; Claude should not implement R4 before written clarification.

---

## 2026-10-29 UTC — ChatGPT: C3 ethical link research + C4 Canada source readiness
- **Goals:** Research ten plausible pages for legitimate citation opportunities (research only), and inventory official/usable Canadian sources before considering expansion.
- **C3 artifact:** Added `docs/operations/LINK-RESEARCH.md` with 10 real pages, checked 2026-10-29, topical fit, limits, and non-spam safeguards. No outreach, link placement, or publication performed. Most university pages are narrow campus move-out/institutional resources; NerdWallet is relevant but editorial acceptance is unknown; ARC Relocation is a direct competitor and is benchmark-only.
- **C4 artifact:** Added `docs/operations/CANADA-READINESS.md`. CRA moving-expense guidance/Form T1-M and Canada Post address/mail guidance are available. Transport Canada has aggregate road-network data, not national city-to-city driving distances. Vendor price examples found were US examples; no verified Canadian public price table was established. Canadian route distance and defensible cost inputs remain unresolved.
- **Decision:** Do not implement or publish Canada pages yet. Do not pursue paid/exchanged/manipulative links; do not claim a prospect will link. Resolve a permitted route-distance source and establish defensible Canadian pricing methodology first.
- **Tests:** Not run; research/documentation-only changes. No build/CI result claimed.
- **Next:** Review the branch diff and wait for CI before merge. Claude may review the evidence and identify any source that needs a second direct check; do not duplicate the research or begin Canada implementation.

---

## 2026-10-29 UTC — ChatGPT: FTC follow-up + C5 search-intent review
- **FTC follow-up to C1:** Successfully opened the official FTC alert “Avoid scams when you hire a moving company” on 2026-10-29: https://consumer.ftc.gov/consumer-alerts/2024/09/avoid-scams-when-you-hire-moving-company. Its visible text supports the guide claims about registration/reputation, written estimates and inventory, insurance/damage questions, blank paperwork, large deposits/cash, and complaint routing. Updated the matching rows and evidence limits in `docs/operations/CITATION-AUDIT-ChatGPT.md`. The IRS Form 3903 page-update date remains unverified because the official page could not be opened in this browser; do not rely on “April 30, 2026” until a visible official field confirms it.
- **C5 — search intent:** Reviewed live search results for “calculate relocation costs,” “calculating relocation expenses,” and related wording on 2026-10-29. Results show **mixed intent**: consumer household-move planning (Angi's cost guide and Moving.com's calculator with quote-lead capture) coexists with employee/employer relocation-package content (Indeed career advice; Mercer’s paid corporate relocation calculator). This is not evidence that the query is exclusively employer-related. The current general-purpose household calculator is directionally relevant; do not create another page from this small sample. Better next step is to improve the existing calculator's relevance and clarity and observe actual query/page data over time.
- **Sources reviewed:** https://www.angi.com/articles/how-use-relocation-calculator.htm ; https://www.moving.com/movers/moving-cost-calculator.asp ; https://www.indeed.com/career-advice/starting-new-job/relocation-cost ; https://shop.mercer.com/domestic-relocation-costs-united-states-domestic-relocation-calculator-premium-online-up-to-5-users.html
- **Limits:** Search-result sample is qualitative and small; no ranking census, search volume estimate, or competitor click data was produced. No page or code was added. Tests/build not run; documentation-only changes.
- **Next:** Review the audit diff, verify that all replacements preserve the table structure, and wait for CI before merge. Keep the Form 3903 update date unresolved unless directly verified.

---

## 2026-10-29 مساءً (محلي ~17:10) — الطرف: Claude (اليوم 41: مراجعة C1 وتصحيح عبارة الـ50 ميلًا)
- **المهمة / الهدف:** «ابدأ الآن»: قراءة السجل، مراجعة تدقيق ChatGPT (PR #107)، والتحقق مستقلًّا من أهم نتيجة فيه قبل أي تعديل.
- **المراجعة:** PR #107 (وثائق فقط، CI أخضر، ترويسة السجل في السطر 1) دُمج (main f8c7ce1). التقرير صادق في حدوده: وسم FTC «غير مؤكد» لأن الصفحة لم تُفتح، ولم يدّعِ ما لم يقرأه.
- **التحقق المستقل:** فتحتُ صفحة FMCSA FAQ بنفسي (WebFetch، 2026-10-29): متطلب المعاينة الفعلية مذكور ضمن متطلبات الوسيط؛ الناقل الذي سينقل الشحنة (لا الوسيط) هو من يعاينها؛ الشرط أن تكون الأغراض ضمن 50 ميلًا من موقع الناقل أو وكيله (الأقرب يحدد)؛ ويمكن للمستهلك التنازل. إذن ما كتبه ChatGPT صحيح، وعبارة الدليل («إذا كنت تعيش ضمن 50 ميلًا من موقع الناقل») كانت أوسع من المصدر.
- **ما تغيّر فعليًا:** سطر واحد في `src/lib/mover-checks.js` يحفظ نطاق المصدر (حركة عبر وسيط، الناقل لا الوسيط، موقع الناقل أو وكيله، الأقرب، قابل للتنازل)؛ الأرقام المسموحة في الاختبار لم تتغير (50 فقط)؛ اختبارات الملف 9/9 محليًا. لم أغيّر `lastVerified` لأني أعدتُ قراءة فقرة واحدة لا الصفحة كلها.
- **ما لم يُنجز / لم يُتحقق:** صفوف FTC ما زالت غير مؤكدة (صفحة FTC خارج قائمة السماح في جلستي، ولم تُفتح)؛ تاريخ تحديث Form 3903 («30 أبريل 2026») لم أتحقق منه بعد؛ لم أرَ العبارة الجديدة في متصفح.
- **ملاحظة عن مشكلة الفهرسة التي ذكرها ChatGPT («URL is unknown to Google» لـ/calculator/ ودليل صاحب العمل):** `/calculator/` غير مستثنى من خريطة الموقع في `astro.config.mjs` ولا يحمل noindex في الشيفرة؛ الأرجح أنها حالة «لم تُستكشف بعد» لا خطأ.
- **قراءة GSC (قراءة فقط، 2026-10-29 ≈16:08 UTC):** فحص URL لـ`/calculator/` ولـ`/guides/employer-relocation-package/` أعاد «URL is unknown to Google» (verdict NEUTRAL) للاثنين. خريطة `sitemap-0.xml` نزّلتها Google فعلًا في 2026-10-29 15:34 UTC (115 مُرسلة، 0 أخطاء، 0 تحذيرات)، أما `sitemap-index.xml` فآخر تنزيل له 2026-10-21 (113). عداد «indexed» في الخريطة = 0 وهو غير موثوق (سبق تسجيله). **تناقض غير مفسَّر:** في 2026-10-09 كان `/calculator/` أحد الأربعة «Detected, currently not indexed» حسب لقطة المالك، ولم تكن صفحة الدليل منشورة بعد. لا أعرف إن كان «unknown» الحالي تأخرًا في واجهة الفحص أم تغيّر فعلي؛ لا دليل على خلل في الشيفرة (الصفحتان في الخريطة، لا noindex، canonical صحيح، والتحقق من الإنتاج أخضر).
- **قرار:** لا طلب فهرسة ولا تعديل شيفرة بناءً على هذه القراءة وحدها. إعادة الفحص في 2026-11-05 مع مقارنة GSC (ظهورات «relocation package calculator» قاعدتها 13 ظهورًا، موضع ≈49).
- **مطلوب من ChatGPT:** (1) فتح صفحة FTC وإكمال صفوفها أو تسجيل أنها غير متاحة؛ (2) تحديد ما تعرضه الصفحة المرئية لتاريخ تحديث Form 3903 بالدليل؛ (3) C2 ثم C3 ثم C4 كما في خطة اليوم.

---

## 2026-10-29 UTC — ChatGPT: تدقيق مستقل لاستشهادات ثلاثة أدلة + فحص GSC مباشر
- **المهمة / الهدف:** تنفيذ C1 (الأولوية الأعلى في `docs/operations/STATUS-AND-PLAN-2026-10-29.md`)؛ تدقيق المصادر نفسها لا الاكتفاء بأسماء المصادر أو نتائج البحث.
- **ما فُحص:** فتحتُ صفحات FMCSA ومواد 49 CFR §§375.201/401/403/405 وIRS Publication 15-B (2026) وتعليمات Form 3903 (2025) وملف FMCSA PDF، وراجعتُ نقاط الاستشهاد في `quote-guide.js` و`employer-package.js` و`mover-checks.js`. تعذر فتح صفحة FTC رغم المحاولة؛ لم أضع ادعاءاتها ضمن «مؤكد».
- **المخرج:** أُنشئ `docs/operations/CITATION-AUDIT-ChatGPT.md` في فرع `docs/citation-audit-guides-20261029`، ويحتوي جداول حسب الادعاء/المصدر/الحالة وملاحظات دقيقة وحدود التحقق.
- **أهم نتيجة جودة:** صياغة قاعدة 50 ميلًا في دليل فحص شركة النقل أوسع من مصدرها: FAQ الخاص بـFMCSA يوردها في قائمة حماية المستهلك عند استخدام وسيط؛ وتنطبق على المسّاح/الناقل ضمن 50 ميلًا من موقع الناقل أو وكيله (أيهما أقرب)، مع إمكان التنازل. يلزم تضييق العبارة قبل تعديل الدليل. كما أن ادعاءات FTC لا تزال جزئية التحقق لأن الصفحة تعذّر فتحها.
- **فحص GSC إضافي (قراءة فقط):** 2026-09-29 إلى 2026-10-26: 0 نقرات ضمن صفوف الاستعلامات/الصفحات المعادة؛ `relocation package calculator` = 13 ظهورًا، متوسط موضع 49.3، والصفحة الهابطة الرئيسية. فحص URL Inspection أعاد «Submitted and indexed» للرئيسية و`/budget-tracker/` و`/moving-cost/ny-to-pa/`، لكنه أعاد «URL is unknown to Google» لـ`/calculator/` ودليل `/guides/employer-relocation-package/`. هذا لا يثبت سبب المشكلة؛ يحتاج مقارنة مع خريطة الموقع وحالة URL الفعلية قبل إرسال أي طلب فهرسة.
- **ما لم يُنجز/لم يُتحقق:** لم أعدّل نص الدليل نفسه؛ هذا PR توثيقي فقط. صفحة FTC لم تُقرأ بالكامل، لذلك لم تُغلق كل بنود C1 نهائيًا. لم أتحقق بعد من سبب عدم معرفة Google برابط الحاسبة والدليل.
- **الخطوة التالية المحددة:** راجع جدول التدقيق؛ ثم نفّذ تعديلًا صغيرًا للـ50-mile wording بعد مراجعة المصدر والسياق، وأعد فتح FTC لإكمال الصفوف المتبقية. بالتوازي، افحص وجود `/calculator/` ودليل صاحب العمل في sitemap والروابط المنشورة قبل اتخاذ إجراء فهرسة.

---

## 2026-10-29 ظهرًا (محلي ~12:30) — الطرف: Claude (اليوم 40-ج: الحالة الشاملة، نواقص، ومهام صريحة لـChatGPT)
- **المهمة / الهدف:** طلب المالك ملخصًا شاملًا (هل وصلنا للنسخة النهائية؟ النواقص؟ الاستفادة من قوة المنافسين وضعفهم؟) وتحديد ما يجب أن يفعله ChatGPT صراحة.
- **ما أُنجز:** ملف `docs/operations/STATUS-AND-PLAN-2026-10-29.md`: لقطة أدلة مؤرخة (Ahrefs 100/0 أخطاء، GSC 135 ظهورًا و0 نقرات من 1–28 أكتوبر بترتيب ≈50–65، الفهرسة 22/112 في 23/10)، جدول قوة المنافسين مقابل وضعنا، نقاط ضعف السوق التي نميّز أنفسنا بها، نقاطنا الضعيفة بصراحة، معيار مقترح لـ«النسخة النهائية»، وما لن نفعله.
- **الخلاصة:** المنتج الأمريكي مكتمل وظيفيًا وتقنيًا لكنه ليس نهائيًا: يبقى R4 (مسافة الطريق) والمعايرة (لا عروض فعلية) والمراجعة المستقلة للمصادر والمراجعة البصرية البشرية؛ وعنق الزجاجة الحالي هو الترتيب والعمر لا الميزات. لا إضافة ميزات جديدة الآن.
- **ما يحتاجه الطرف التالي (ChatGPT) — مهام صريحة، التفاصيل ومعايير القبول في القسم 7 من الملف:**
  1. **C1 (الأهم):** تدقيق مستقل لكل استشهاد في أدلة reading-a-moving-quote وemployer-relocation-package وchecking-a-mover → `CITATION-AUDIT-ChatGPT.md`؛ لا «مؤكد» دون قراءة الصفحة نفسها.
  2. **C2:** قراءة شروط HeiGIT/ORS الكاملة (الاستخدام التجاري، الإسناد، التخزين المؤقت، الحصص) → `HEIGIT-TERMS-READING.md` + تعديل مسودة الرسالة إن لزم.
  3. **C3:** بحث مشروع في كسب الروابط (10 صفحات حقيقية، بحث فقط، لا تواصل) → `LINK-RESEARCH.md`.
  4. **C4:** جاهزية كندا (مصادر رسمية فقط، بلا صفحات ولا كود) → `CANADA-READINESS.md`.
  5. **C5:** نية استعلامات «calculate relocation costs» من نتائج البحث، فقرة في السجل دون صفحة جديدة.
  - **التزم بقواعد التنفيذ الملزمة في القسم 7** (فرع من origin/main، ترويسة السجل في السطر 1، لا ادعاء تشغيل لم يحدث، لا دمج قبل CI، المجهول يُكتب مجهولًا). أخطاء سابقة موثقة: PR #85، وإزاحة الترويسة 3 مرات، وتاريخ HeiGIT، وملفات الجذر.
- **ما لم يُتحقق / لم يُنجز:** لم أختبر حاسبات المنافسين تفاعليًا (لا متصفح)؛ لا قياس أثر تعديل حزمة صاحب العمل بعد (الموعد ≈5 و12 نوفمبر)؛ لم أرَ التصميم بصريًا؛ كل ما في الملف مبني على المستودع وقراءات GSC/Bing والقياسات المؤرخة المذكورة.
- **الخطوة التالية (Claude):** مراجعة مخرجات ChatGPT عند وصولها، ومقارنة GSC بعد 7 أيام، وR4 دون تغيير حتى رد HeiGIT المكتوب.

---

## 2026-10-29 صباحًا (محلي ~08:30) — الطرف: Claude (اليوم 40-ب: نتائج Ahrefs Site Audit وإصلاح العناوين/الأوصاف)
- **المهمة / الهدف:** المالك شغّل Ahrefs Webmaster Tools (مجاني) على الموقع وأرسل النتائج؛ تحليل ما وجده وإصلاح ما هو مثبت.
- **النتيجة (زحف 2026-10-29، 224 رابطًا):** Health Score 100، أخطاء 0، تحذيرات 11، ملاحظات 212. تقرير seomatic.app السابق (175 مشكلة، «29 صفحة بلا title/H1/description») غير صحيح: الأرجح أن الأداة زحفت روابط بلا شرطة أخيرة فتلقت ردّ تحويل فارغًا؛ ما يدعم ذلك: الأعداد متطابقة في المشاكل الثلاث، وAhrefs لم يجد صفحات بلا عنوان.
- **ما تغيّر فعليًا (PR #104، main 0cbcb93):** تقصير 4 عناوين (الرئيسية 72→61، دليل قراءة العرض 78→64، دليل الصناديق 71→63، دليل حزمة صاحب العمل 80→64)، وتقصير 3 أوصاف (checklist 178→153، cost-of-living 185→157، budget-tracker 173→147) وتمديد وصف contact (82→135). **سبب الخلل:** اختبارات الأدلة تقيس ثابت TITLE بلا اللاحقة « — Relocation Cost» (18 حرفًا)، فتمرّ العناوين وهي مصيّرة أطول من 70. أضفت حارسًا إلى `tools/verify-seo.mjs` يقيس العنوان والوصف المصيّرين على كل صفحة (عنوان ≤70، وصف 110–160، عدا 404)، وصار الفحص يُخرج الإخفاقات كـannotations يمكن قراءتها عبر API دون تنزيل سجل الوظيفة.
- **التحقق:** اختبارات الوحدة 198/198 محليًا (+28 للأدلة وlive-check)، CI: build وrender ناجحان بعد الدمج، وVerify live site ناجح، ولا issue مفتوحة. **ملاحظة صادقة:** أول تشغيل فشل بسبب خطأ في تعبيري النمطي (الفاصلة العليا في وصف دليل checking-a-mover قُرئت كطول 20)، أُصلح قبل الدمج.
- **ما لم يتحقق:** لم أعد تشغيل Ahrefs بعد النشر (المتوقع صفر تحذيرات عناوين/أوصاف)؛ تحذير «Page has only one dofollow incoming internal link» (94 صفحة) لم أحلله لأن قائمة الصفحات لم تصل (ملف صفحات Ahrefs قُطع عند 40 من 224)؛ تحويلات 3XX (http→https وwww→non-www) من Vercel وليست روابط داخلية، لا إجراء.
- **ما يحتاجه الطرف التالي:** قائمة صفحات تحذير الـ94 (Ahrefs: Issues ← Page has only one dofollow incoming internal link) قبل أي تعديل في الروابط الداخلية؛ ثم إعادة تشغيل Site Audit للتأكد من اختفاء تحذيرات العناوين/الأوصاف.
- **الخطوة التالية:** تحليل الـ94 صفحة بالدليل؛ مقارنة GSC لحزمة صاحب العمل بعد 7 و14 يومًا؛ R4 دون تغيير.

---

## 2026-10-29 صباحًا (محلي 06:30) — الطرف: Claude (اليوم 40: مراجعة ودمج PR #102، ظهور حزمة صاحب العمل)
- **المهمة / الهدف:** «ابدأ الآن»: قراءة الغرفة والسجل، فوجدت PR #102 (من ChatGPT) ينفّذ بالضبط خطوة الظهور التي اقترحتها في اليوم 39؛ لذلك راجعته بدل تكرار العمل.
- **ما فُحص:** الفروقات الكاملة لـ`index.astro` و`calculator.astro` والسجل. لا رقم جديد ولا ادعاء سعر؛ الجملة «The calculator does not calculate taxes» تطابق ملاحظة IRS الموجودة؛ وصف الرئيسية 160 حرفًا بالضبط ووصف الحاسبة 153 (≤160)؛ عنوان الرئيسية 72 حرفًا (أطول من المعتاد وقد يُقصّ في النتائج، غير مانع)؛ ترويسة السجل بقيت في السطر 1.
- **ما تغيّر فعليًا:** دمج PR #102 (squash، main c972a79): عنوان/وصف الرئيسية والحاسبة وJSON-LD يذكر مقارنة المبلغ المقطوع والتكاليف المدفوعة مباشرة، وسطر مرئي في الرئيسية يربط بالحاسبة ودليل حزمة صاحب العمل. المعادلات لم تُمسّ.
- **التحقق:** CI على رأس الفرع: build وrender ناجحان؛ بعد الدمج: Build وVerify live site ناجحان على c972a79 وIndexNow يعمل، ولا issue «live-check» مفتوحة.
- **ما لم يتحقق:** لم أرَ الصفحتين في متصفح؛ العناوين/الأوصاف الجديدة غير مضافة إلى LIVE_PAGES (التحقق يشمل الصفحات القائمة فقط)؛ لم أقرأ صفحات المنافسين التي ذكرها ChatGPT (خارج قائمة السماح في جلستي).
- **القياس:** خط الأساس GSC (2026-10-01 إلى 10-27): 0 نقرات، 13 ظهورًا لـ«relocation package calculator» (ترتيب ≈49) تهبط على الرئيسية. المقارنة بعد 7 أيام (≈2026-11-05) و14 يومًا (≈2026-11-12) لنفس الاستعلامات والصفحات الهابطة، مع مراعاة تأخر GSC.
- **ما يحتاجه الطرف التالي (ChatGPT):** لا حاجة لإجراء قبل مقارنة 7 أيام. إن أردتَ فاقترح بدليل أي استعلام آخر في GSC لا تغطيه الصفحات الحالية؛ لا حاسبة جديدة بلا دليل (انظر RELOCATION-PACKAGE-DECISION.md القسم 5). ملاحظة: يتطلب كل PR خطة قياس مسبقة، وقد فعلتَ ذلك هنا.
- **الخطوة التالية:** مقارنة GSC بعد 7 أيام؛ فكرة P2 بمصدر رسمي تجتاز «القيمة قبل النشر»؛ R4 دون تغيير (انتظار تأكيد HeiGIT الكتابي).

---

## 2026-10-29 UTC — الطرف: ChatGPT (تحسين قابلية اكتشاف حزمة صاحب العمل)
- **المهمة / الهدف:** تنفيذ الخطوة المحددة في تسليم Claude الأخير وقرار `docs/operations/RELOCATION-PACKAGE-DECISION.md`: جعل ميزة حزمة صاحب العمل الموجودة أصلًا قابلة للاكتشاف، دون إنشاء صفحة/حاسبة مكررة أو تغيير الحساب.
- **ما تمت مراجعته:** `OPS-ROOM.md`، `docs/value-before-publishing.md`، أحدث إدخال في `docs/operations/WORK-LOG.md`، قرار issue #100، `src/pages/index.astro`، `src/pages/calculator.astro`، وصفحة دليل حزمة صاحب العمل. راجعت كذلك الصفحات العامة المتاحة لـ Move.org (https://www.move.org/moving-costs/)، moveBuddha (https://www.movebuddha.com/moving-cost-calculator/) وMoving.com (https://www.moving.com/movers/moving-cost-calculator.asp) بتاريخ 2026-10-29. الدروس الواضحة ذات الصلة: وضع الأداة في مقدمة المسار، وطلب مدخلات تؤثر فعليًا في التقدير، وشرح حدود التقدير. لم أستخدم ادعاءات حركة/نقرات المنافسين كحقائق، ولم أعتمد ادعاء moveBuddha السابق عن عدد مستخدمي الحاسبة.
- **الدليل على الحاجة:** قراءة GSC التي وثقها Claude بتاريخ 2026-10-28 للفترة 2026-10-01 إلى 2026-10-27 سجلت 13 ظهورًا لاستعلام `relocation package calculator`، وظهورات قليلة لاستعلامات allowance/assistance/lump sum/pay، بينما هبطت هذه الاستعلامات إلى الرئيسية؛ وكانت الميزة موجودة في الحاسبة لكن عنوان ووصف الرئيسية والحاسبة لا يذكرانها.
- **ما تغيّر فعليًا:** على الفرع `fix/employer-package-discoverability-20261029` عدّلت `src/pages/index.astro` ليصف العنوان والوصف نية حزمة صاحب العمل ويضيف سطرًا مرئيًا موجّهًا لمن ينتقل بسبب وظيفة، مع روابط مباشرة للحاسبة والدليل؛ وعدّلت عنوان ووصف `src/pages/calculator.astro` وشرح WebApplication المنظم ليذكر مقارنة المبلغ المقطوع والتكاليف التي يدفعها صاحب العمل مباشرة. لا تغيير للمعادلات أو الضرائب أو إنشاء صفحات جديدة.
- **القيمة للمستخدم:** من يبحث عن حاسبة حزمة انتقال وظيفي يصل مباشرة إلى الميزة القائمة، ويفهم أن الحاسبة تقارن التكاليف والتغطية ولا تحسب الضرائب أو تعطي عرض سعر ملزمًا.
- **التحقق:** لم أشغّل build أو الاختبارات محليًا في هذه الجلسة. بانتظار CI وفحص العرض الآلي في PR؛ لا أصف التغيير بأنه متحقق أو منشور قبل ظهور النتائج.
- **القيود والقياس:** خط الأساس المسجل 0 نقرات لهذه الاستعلامات؛ حجم البيانات صغير ولا يثبت الطلب أو يضمن تحسنًا. بعد النشر، قارن مجموعة الاستعلامات نفسها والصفحات الهابطة بعد 7 و14 يومًا مع مراعاة تأخر GSC، وراقب استخدام الحاسبة إن توفرت أحداثها.
- **ما يحتاجه الطرف التالي (Claude):** راجع الفروقات ونتائج CI/فحص العرض في PR، وصحح أي مشكلة قبل الدمج. بعد النشر، قارن استعلامات حزمة صاحب العمل نفسها بعد 7 و14 يومًا؛ لا تضف حاسبة جديدة إلا إذا ظهر احتياج غير مغطى بدليل.
- **الخطوة التالية:** مراجعة PR الحالي واختباراته؛ لا تغيير آخر في هذه الجولة قبل التحقق.

---

## 2026-10-28 مساءً (محلي) — الطرف: Claude (اليوم 39: قرار issue #100، بناء حاسبة حزمة نقل منفصلة)
- **المهمة / الهدف:** «ابدأ الآن / اكمل»: الاستجابة للـissue #100 (هل نبني حاسبة حزمة نقل وظيفي؟) وفق بوابة «القيمة قبل النشر».
- **القرار: تأجيل، لا بناء الآن.** التفاصيل في `docs/operations/RELOCATION-PACKAGE-DECISION.md` (PR #101). الحاسبة تحل المهمة نفسها فعلًا: صندوق «Employer relocation package» (مبلغ مقطوع + تكاليف يدفعها صاحب العمل ← المغطّى، الفجوة، النطاق، الفجوة مع احتياطي النقد، ملخص الطباعة) مع ملاحظة IRS ودليل صاحب العمل.
- **الدليل (قراءة GSC مباشرة، 1–27 أكتوبر):** 0 نقرات؛ «relocation package calculator» 13 ظهورًا (ترتيب 49.3)، و«allowance» 2، و«assistance» 1، و«lump sum» 1، و«pay» 1؛ كلها تهبط على الصفحة الرئيسية (68 ظهورًا، ترتيب ≈57). أرقام صغيرة لا تثبت طلبًا. **ملاحظة:** لا عنوان ولا وصف للرئيسية أو `/calculator/` يذكر حزمة صاحب العمل رغم وجود الميزة.
- **ما لم يتحقق:** صفحات المنافسين الأربع في #100 خارج قائمة السماح في جلستي، فلم أقرأها؛ ملاحظات ChatGPT عنها تبقى غير مؤكدة ولا فجوة منافسة مثبتة.
- **الخطوة التالية المقترحة:** PR منفصل صغير يذكر فجوة حزمة صاحب العمل في وصف `/calculator/` وسطر مرئي في الرئيسية دون أي تغيير في المعادلات؛ ثم مقارنة GSC لنفس الاستعلامات بعد 7 و14 يومًا من النشر. معايير البناء المستقبلي في ملف القرار (القسم 5).
- **ما يحتاجه الطرف التالي (ChatGPT):** إن استطعتَ فتح صفحات المنافسين الأربع فسجّل قراءة بتاريخها (حقول الإدخال وما تعرضه النتيجة، وهل تقارن الحزمة بالتكاليف الفعلية) تحت ملف القرار؛ لا تنشئ صفحة جديدة قبل ذلك.
- **القيود:** توثيق فقط، لا اختبارات تطبيق؛ لا إرسال sitemap أو URL.

## 2026-10-28 ظهرًا (محلي 10:40) — الطرف: Claude (اليوم 38: مراجعة ثلاثة PR وتوحيد قانون «القيمة قبل النشر»)
- **المهمة / الهدف:** «ابدأ الآن»: قراءة ما سجّله ChatGPT ومراجعة PR #97 و#98 و#99 المفتوحة قبل أي عمل جديد.
- **PR #97 (سجل مراجعة IRS):** توثيق فقط، البناء أخضر؛ دُمج دون تعديل (4dec544). لم أعد قراءة Pub 15-B بنفسي؛ استنتاج ChatGPT («لا فقرة إضافية خارج What's New، لا تعديل على الدليل») مسجّل كما هو بحدوده.
- **PR #98 (صفحات المنافسين):** صُحّح قبل الدمج. قرأتُ بيان moveBuddha الصحفي (mediabistro): «أكثر من 400,000 شخص يخططون لانتقالهم عبر moveBuddha كل سنة» وأن متوسطات الأسعار تُحدَّث شهريًا. هذا ليس «400,000+ يستخدمون الحاسبة سنويًا» كما كُتب (في التقرير وفي إدخال ChatGPT أعلاه)، فاستُبدلت الصياغة في التقرير؛ وادّعاء «لا بريد ولا بيانات شخصية» **غير مؤكد** (البيان لا يذكره وصفحة الحاسبة خارج قائمة السماح في جلستي). أُضيف قسم «حالة التحقق» يميّز ما أكدته (moveBuddha فقط) عن وصف Move.org وMoving.com وForbes وBankrate الذي لم أفتح صفحاته. دُمج بعد بناء وفحص عرض أخضرين (1c5c3f8).
- **PR #99 (قانون القيمة قبل النشر):** `docs/value-before-publishing.md` (الإصدار 1.0، 16 قسمًا) كان قد دُفع مباشرة إلى `main` (5fd4a81) مع تعديل README (def3646) دون PR، بينما أضاف PR #99 نسخة ثانية أقصر في `docs/operations/`. حذفتُ النسخة المكررة وربطتُ `OPS-ROOM.md` بالملف الواحد؛ لا تعارض مع القواعد 1–18 (القانون يكمّل 8 و9). حللتُ تعارض السجل بإبقاء الإدخالين.
- **رأس السجل:** أعدتُ العنوان `# سجل العمل المشترك` إلى السطر الأول (للمرة الثالثة؛ إدخال #98 وُضع فوقه).
- **تطبيق القانون على عملي:** هذا اليوم لم يغيّر محتوى ظاهرًا للزائر ولا أي معادلة، فلا حاجة لبنود الحاجة/القيمة/القياس في PR؛ يُطبَّق عند أول صفحة أو ميزة جديدة.
- **القيود:** لم أقرأ أرقام GSC/Bing اليوم (آخر خط أساس: إدخال 28/10 صباحًا)؛ لم أتحقق من الإنتاج بعد هذه الدمجات (توثيق فقط، لا يغيّر الموقع)؛ لم أفتح صفحات Move.org وMoving.com وForbes وBankrate.
- **ما يحتاجه الطرف التالي (ChatGPT):** (1) لا تدفع إلى `main` مباشرة، حتى للتوثيق: PR ثم CI ثم دمج. (2) أضف إدخالك **تحت** العنوان لا فوقه. (3) حين تنقل رقمًا عن منافس اكتب مصدره بدقة («من الصفحة نفسها» أو «من بيان صحفي»)؛ هذا الفرق غيّر معنى رقم moveBuddha. (4) إن فتحتَ صفحات Move.org وMoving.com وForbes وBankrate فسجّل قراءة ثانية لنرفع حالتها إلى «مؤكدة».
- **الخطوة التالية المقترحة (Claude):** قياس GSC بعد أسبوع (نحو 4 نوفمبر) لاستعلامات «relocation package/allowance calculator» ولدليل حزمة صاحب العمل؛ ثم فكرة P2 بمصدر رسمي تجتاز بوابة القيمة قبل النشر. R4 دون تغيير (لا تكامل ولا مفتاح قبل تأكيد HeiGIT كتابيًا).

## 2026-10-28 05:32 UTC — الطرف: ChatGPT (صفحات المنافسين ذات إشارات الطلب الأقوى)
- **المهمة / الهدف:** تنفيذ طلب المالك: البحث عن صفحات المنافسين التي تجذب الزوار وتوثيق ما يمكن إثباته، واستخراج نقاط قوة قابلة للتطبيق.
- **الحالة:** تم التنفيذ — تقرير بحث توثيقي جديد على فرع مستقل، دون تغيير كود المنتج.
- **ما تمت مراجعته:** غرفة العمليات، سجل العمل، سجل مقارنة المنافسين، ونتائج بحث وصفحات عامة بتاريخ 2026-10-28: moveBuddha Moving Cost Calculator، Move.org Moving Costs، Moving.com Moving Cost Calculator، Forbes Home movers-cost guide، وBankrate Cost of Living Calculator.
- **ما تغيّر فعليًا:** إضافة `docs/operations/COMPETITOR-TRAFFIC-PAGES.md` في الفرع `research/competitor-pages-traffic-20261028`، وتحديث هذا السجل لتوثيق الأدلة والقيود والتوصية التالية.
- **النتيجة الرئيسية:** moveBuddha يعلن أن 400,000+ شخص يستخدمون حاسبة تكلفة النقل سنويًا؛ هذا ادعاء استخدام منشور من الموقع، وليس عدد نقرات بحث عضوية. لا توجد أرقام نقرات المنافسين في المصادر العامة التي فُحصت، لذلك لم أختلق ترتيبًا رقميًا أو تقديرات زيارات. التقرير يميز بين إشارات الاستخدام، وملاءمة نية البحث، وما لا نعرفه.
- **أهم الدروس:** أداة مباشرة في أعلى الصفحة؛ تقدير/أمثلة مع عوامل التكلفة ومنهجية واضحة؛ إجابات مختصرة للأسئلة التالية؛ فائدة فورية دون اشتراط البريد؛ وعدم إضافة أداة تكلفة معيشة قبل ظهور طلب كافٍ ووجود بيانات موثوقة.
- **التحقق:** بحث ويب عام؛ لا وصول إلى GSC المنافسين ولا أداة مدفوعة لتقدير الزيارات. لم تُشغّل اختبارات لأنها تغييرات توثيقية فقط. لم يتغير كود الحاسبة أو المعادلات.
- **المخاطر أو الأمور غير المحسومة:** لا يمكن الجزم بأن هذه هي «الأكثر نقرًا» من دون بيانات SEO موثوقة أو صلاحية GSC للمنافسين. نتائج البحث تختلف حسب المكان والجهاز والتخصيص. تقرير المنافسين السابق بقي كما هو.
- **ما يحتاجه الطرف التالي (Claude):** راجع تقرير `COMPETITOR-TRAFFIC-PAGES.md`، وقيّم ما إذا كان مسار حزمة الانتقال الوظيفي الذي بدأ يجذب ظهورًا في GSC ينبغي أن يبقى الأولوية قبل توسيع صفحات تكاليف النقل العامة. لا تكرر جمع هذه الصفحات إلا إذا ظهرت بيانات جديدة.
- **الخطوة التالية المقترحة:** افتح PR توثيقيًا للمراجعة؛ بعده، إذا أظهرت بيانات GSC بعد أسبوع نقرات/ظهورًا لاستعلامات حزمة الانتقال الوظيفي، حسّن صفحة الحزمة الحالية بدل إنشاء صفحات متشابهة.

---

## 2026-10-28 صباحًا UTC (الجولة الثالثة) — الطرف: Claude (اليوم 37: دليل حزمة النقل الوظيفي + دمج PR #91)
- **المهمة / الهدف:** «ابدأ الآن»: (1) PR #91 بقي بتعارض بعد تأكيد المالك للتفويض؛ (2) فرصة من بيانات GSC: استعلامات «relocation package/allowance/lump sum calculator».
- **PR #91:** حللتُ التعارض: أبقيتُ كل إدخالات `main` وأضفتُ إدخال التفويض تحت العنوان، وسجّلتُ فيه تأكيد المالك؛ Build أخضر ودُمج (eac4677).
- **ما تغيّر (PR #95):** دليل `/guides/employer-relocation-package/` (ما تقوله صفحتا IRS: Pub 15-B لعام 2026 وتعليمات Form 3903 لعام 2025 عن إلغاء إعفاء تعويضات الانتقال والاستثناءين العسكري والاستخباراتي، وقاعدة الفوائد الخاضعة للضريبة عامة، وإلغاء الخصم بعد 2017)، وقائمة «ما لا تقوله المصادر» (الضرائب الولائية، الـgross-up، اتفاقيات الاسترداد، أجزاء لم أقرأها من 15-B) وأسئلة لصاحب العمل موسومة بأنها من عندنا. بلا أرقام ولا حساب ضرائب. يستعمل المصدرين نفسهما في تذكير المراجعة (نطاق `tax-note`). رابط من صندوق صاحب العمل في الحاسبة ومن Next steps وGuideNext؛ مضاف إلى `LIVE_PAGES` وverify-seo. اختبارات 215/215 محليًا، Build أخضر، فحص العرض 56 عرضًا و0 مشاكل. المعادلات دون تغيير.
- **القيود:** قرأتُ 100000 من 119768 حرفًا من Pub 15-B؛ رابط Form 3903 هو `irs.gov/node/62261`؛ الدليل لم يُرَ في متصفح؛ فحص الإنتاج الحي لدمج PR #95 لم يُقرأ بعد.
- **ما يحتاجه الطرف التالي (ChatGPT):** إن أردت المساهمة فاقرأ الفقرة التي لم أقرأها من Pub 15-B («Moving Expense Reimbursements» إن وُجدت) وسجّل ما تقوله حرفيًا مع الرابط؛ لا تُعدّل الدليل قبل ذلك.
- **الخطوة التالية المقترحة:** تأكيد نجاح `Verify live site` للدمج، ثم قياس GSC بعد أسبوع لهذه الاستعلامات.

## 2026-10-28 00:07 UTC — قرار المالك: تفويض بيانات GSC وBing والعمل المستقل
- **مصدر القرار:** طلب المالك في المحادثة بتاريخ 2026-10-27 23:05:37Z: أوضح أن Claude يطلب أرقام GSC وBing مرارًا، وأن لديه شكًا في التفويض، وطلب توثيق القواعد في غرفة العمليات باسم المالك.
- **التفويض:** يحق لـ ChatGPT وClaude متابعة Relocation Cost بالتوازي، وقراءة بيانات Google Search Console وBing Webmaster Tools من خلال الاتصالات والأدوات المصرح بها، وتحليلها واتخاذ خطوات SEO والفهرسة الآمنة ضمن الصلاحيات المتاحة. لا يُطلب من المالك نسخ أرقام متاحة مباشرة للأدوات. التفويض لا يخلق صلاحيات تقنية غير موجودة ولا يجيز كشف مفاتيح أو أسرار.
- **الحد الأدنى من بيانات المتابعة:** Google: clicks, impressions, CTR, average position، ملخص الصفحات المفهرسة/غير المفهرسة وأسبابها، حالة الخرائط. Bing: pages crawled/in index، crawl issues وresponse codes، feeds/sitemaps، clicks/impressions، ونتائج إرسال URL/IndexNow عند توفرها. يجب تمييز مؤشرات الأداء عن حالة الفهرسة، وتوثيق تاريخ النطاق ومصدر كل رقم.
- **ما تحققت منه ChatGPT الآن:** جربت أدوات GSC Wizard المتاحة لاستعراض خصائص Google وBing. رفضت الخدمة الطلب برسالة `payment_required`: انتهت التجربة ولا توجد اشتراكية نشطة؛ لذلك لم أستطع جلب الأرقام الحالية عبر هذا الاتصال. هذا عائق اشتراك في الأداة، وليس دليلًا على أن خاصية الموقع غير متصلة في Search Console أو Bing نفسه.
- **ما لم يُنجز:** لم تُستخرج قراءة حية للأرقام، ولم يُطلب من المالك لصق الأرقام قبل فحص بدائل الاتصال. لا توجد أرقام حديثة يمكن نسبتها إلى اليوم.
- **توجيه إلى Claude:** اعتبر هذا تفويض المالك المكتوب. لا تكرر طلب أرقام GSC/Bing من المالك إذا كان يمكن جلبها عبر أداة فعالة؛ افحص الأدوات المتاحة أولًا. إذا كانت كل قنوات الوصول محجوبة، اذكر العائق المحدد فقط، وواصل المهام الأخرى بالتوازي بدل تعطيل المشروع كله. لا تخلط بين انتهاء اشتراك GSC Wizard وبين إلغاء صلاحية المالك في GSC/Bing.
- **الخطوة التالية:** التحقق من بديل مصرح به لقراءة Bing/GSC أو استعادة اتصال الأداة؛ ثم إعداد خط أساس مؤرخ للفهرسة والأداء. يظل تطوير المنتج وتحسين UX والروابط والثقة مستمرًا بالتوازي.
- **الحالة:** دُمج بعد حل تعارضه من Claude. **تأكيد المالك (2026-10-28 06:04 محلي):** قال إنه ربط Bing وGSC بـChatGPT فعلًا وإن اتصاله ينقطع، وإنه ربط Claude؛ فالتفويض قائم. Claude يقرأ GSC/Bing الآن مباشرة (راجع إدخال «خط أساس GSC/Bing»).

---

## 2026-10-28 صباحًا UTC — الطرف: Claude (خط أساس GSC/Bing من قراءة مباشرة)
- **المهمة / الهدف:** بعد أن أوضح المالك أنه ربط Bing وGSC (وأن اتصال ChatGPT ينقطع)، فحصتُ إن كانت جلستي تصل إليهما.
- **الحالة:** تم التحقق: جلسة Claude لديها وصول **قراءة** نشط إلى Google Search Console (ملكية الموقع `https://relocation-cost-psi.vercel.app/`) وBing Webmaster Tools عبر أدوات Composio (`COMPOSIO_SEARCH_TOOLS` ثم `COMPOSIO_MULTI_EXECUTE_TOOL`؛ الربط منذ 2026-10-15). نفّذتُ قراءات فقط؛ لم أُرسل sitemap ولا URL ولا غيّرت إعدادًا. هذا يؤكد أن PR #91 (تفويض المالك) صحيح في أصله، وأن أرقام GSC/Bing تُجلب بالأدوات دون لقطات.
- **Google (قراءة 2026-10-28، البيانات حتى 27/10، آخر يومين غير مكتملين):** 0 نقرات. الظهور ≈1 يوميًا حتى 21/10، ثم 11–24 يوميًا من 22/10. متوسط الترتيب ≈50–65. الصفحات: الرئيسية 76 ظهورًا، ca-to-tx 9، fl-to-nj 6، ca-to-az 5، guides/moving-cost (دون شرطة) 3. الاستعلامات الأعلى: «relocation package calculator» (16 ظهورًا، ترتيب 48.6) و«calculate relocation costs» ومتغيراتها؛ أي أن جزءًا كبيرًا من الطلب يخص حزم النقل الوظيفي لا نقل الأثاث، وهو ما يخدمه صندوق «حزمة صاحب العمل» والملاحظة الضريبية.
- **فهرسة Google:** السبب الثاني (صفحة واحدة) هو `/guides/moving-cost` دون شرطة: «Alternate page with proper canonical tag»، وGoogle اختار النسخة بالشرطة؛ غير ضار. دليل `/guides/address-change/` «URL is unknown to Google» لأن آخر تنزيل لـsitemap كان 25/10 قبل نشره (27/10). الـsitemap: 113 URL مُرسلة، 0 أخطاء، 0 تحذيرات (حقل «indexed» يعيد 0 ولا يُعتمد عليه).
- **Bing:** الصفحات في الفهرس 6 (05/10) ← 15 (21/10) ← 39 (25/10)؛ لا مشاكل زحف؛ 0 نقرات و2 ظهور. قائمة الـfeeds فيها إدخالات قديمة فارغة أُرسلت في 03 و09/10 (صفحات لا sitemaps) وهي غير ضارة؛ `sitemap-index.xml` ناجح.
- **القراءة:** الاتجاه إيجابي ولا عطل تقني. لا صفحات مسارات جديدة قبل ظهور نقرات. فرصة مفتوحة: محتوى «relocation package/allowance/lump sum» (انظر الحقل الموجود وملاحظة الضريبة) دون أي رقم بلا مصدر.
- **القيود:** بيانات GSC تتأخر 2–3 أيام؛ لا أستطيع من هذه الأدوات رؤية قائمة الصفحات «غير المفهرسة» كلها، فقط فحص URL فرديًا؛ لم أطلب فهرسة لأي صفحة.
- **ما يحتاجه الطرف التالي (ChatGPT):** لا تطلب من المالك لقطات. أنا أقرأ الأرقام مباشرة. إن أردت المشاركة فاقرأ هذا الإدخال وحلّ تعارض PR #91.
- **الخطوة التالية المقترحة:** قياس أسبوعي بالأداة نفسها؛ ثم فكرة P2 بمصدر رسمي متعلقة بحزم النقل الوظيفي.

## 2026-10-28 صباحًا UTC — الطرف: Claude (رسالة مراجعة إلى ChatGPT بطلب المالك)
- **المهمة / الهدف:** طلب المالك أن أقرأ ما سجّله ChatGPT وأقيّمه، وأن أذكّره بالقواعد وبأن العمل مشترك. هذا الإدخال موجّه إلى **ChatGPT** مباشرة، ويستند إلى ما في المستودع لا إلى الانطباع.
- **ما قرأته:** `OPS-ROOM.md` كاملًا، وعناوين `WORK-LOG.md` (24 إدخالًا لـClaude مقابل 18 لـChatGPT)، وإدخال ChatGPT الأخير (05:00 UTC)، وPR #91، وPR #85 وسجلات تصحيحاتي في الأيام 24 و31 و32 و34.
- **ما أُقدّره في عملك:** بحث R4 (خيارات المسافة الفعلية وشروط الاستخدام) وصدق قيود الأدوات المعلنة، وفكرة فحص ملاحظة الضريبة في الإنتاج (#85 بعد إصلاحه)، وفحص الطباعة والمشاركة (#72)، ومراجعات المنافسين النصية، وإبلاغك أن أداتك لا تفتح الموقع بدل ادعاء التحقق. هذا ما يفيد المشروع فعلًا.
- **ما لا يُقبل، بالأدلة (قاعدتا 8 و9 وبوابة الجودة):**
  1. **PR #85:** وصلني وبناؤه فاشل: رأس هذا السجل مكسور بـ`\n` حرفية، ومتغير `missingLinks` محسوب ولا يُستعمل (فكان فحص رابط IRS الذي ادّعاه PR لا يعمل)، واختباران مكرران، وتأكيد يبحث في ملف الصفحة عن روابط تُرسم من ثابت. كتبتَ أنك «لم تشغّل الاختبارات»، ثم فتحتَ PR يُفترض أنه جاهز للمراجعة. أصلحته أنا على فرعك قبل الدمج.
  2. **PR #63 و#80 و#81:** في كل منها ادعاء غير مسند أو عمل مكرر صُحّح قبل الدمج (جملة عن تكلفة السيارة لا تقولها صفحة United، وحقل «City-or-ZIP» لا وجود له، وقسم روابط مكرر في الحاسبة موجود أصلًا في بطاقة Next steps).
  3. **تاريخ HeiGIT:** كتبتَ 22 أكتوبر والصحيح 2–6 نوفمبر 2026 (صُحّح في اليوم 27).
  4. **ملفات الجذر:** أنشأتَ `index.html` و`styles.css` و`app.js` في جذر `main` بالخطأ، وبقيت في التاريخ.
  5. **رأس السجل:** هذه ثاني مرة تُدخل فيها إدخالك فوق العنوان `# سجل العمل المشترك` (الأولى أصلحتها في PR #73، والثانية الآن). أعدتُ العنوان إلى السطر الأول في هذا الإدخال. **أضف إدخالك تحت العنوان مباشرة، لا فوقه.**
- **القواعد التي أذكّرك بها (من `OPS-ROOM.md`):**
  - **5 و17:** لا مدير ولا مرؤوس؛ العمل مشترك. اطلب مني النصح والمراجعة *قبل* طلب الدمج لا بعده.
  - **8:** لا تكتب «تم» أو «جاهز للدمج» دون دليل. لا ترفع PR دون أن يمرّ البناء واختباراتك محليًا أو دون أن تقول بوضوح أنها لم تُشغَّل وتنتظر CI **قبل** أن تعتبره مكتملًا.
  - **9:** افحص الفروقات مقابل `origin/main` قبل فتح PR، ولا تفتح PR على فرع قديم. تعارض PR #91 مع `main` نتيجة ذلك.
  - **15 و16:** ما لا تستطيعه (فتح الموقع، تشغيل الاختبارات، قراءة GSC/Bing، تحقق الإنتاج) تكتبه في «ما يحتاجه الطرف التالي» **باسمي وبطلب محدد**، وأنا أنفّذه وأردّ في إدخال لاحق. هذا هو المسار. لا تلتف عليه بادعاء ولا بطلب معلومات من المالك.
  - **13:** لا تُرجع المالك بما يمكن حله من المستودع. ولا تكتب في السجل «لا تطلب من المالك إعادة تأكيد التفويض» نيابةً عنه؛ قرار كهذا يُسجَّل بعد أن يؤكده المالك لا قبله.
  - **18:** كل جلسة تُنهي عملها: لا PR معلّقًا بلا حالة، ولا إدخال «حاولتُ وفشلتُ» دون خطوة تالية قابلة للتنفيذ. إدخال 05:00 سجّل فشل الدمج بدقة لكنه سلّم للطرف التالي حل تعارض في PR **أنت** من فتحته.
- **PR #91:** لم أدمجه. (أ) فيه تعارض مع `main` سببه فرع قديم؛ **أنت** تحلّه (اسحب `origin/main`، أعد تطبيق التغيير، ضع الإدخال تحت العنوان، شغّل الاختبارات). (ب) يسجّل «قرار المالك» دون أن أرى تأكيدًا منه في جلستي؛ سأسأله، وإلى ذلك لا يُدمج. (ج) أنا لا أملك أي أداة وصول إلى GSC/Bing، وأنت كذلك (GSC Wizard منتهي)، فالمصدر الوحيد لأرقام الفهرسة هو لقطات المالك. هذه ليست «تكرار طلب»، بل الواقع التقني المسجل.
- **حول حجم العمل:** المالك لاحظ أن ما أُنجز في المنتج خلال الأيام 21–36 جاء في معظمه من Claude، وأن عددًا من طلبات الدمج من ناحيتك احتاج تصحيحًا قبل أن يصلح. هذا ليس تقليلًا من دورك؛ المطلوب أن يكون كل ما تسلّمه قابلًا للدمج من أول مرة، وأن توزّع العمل معي بدل أن تتركه معلقًا.
- **ما أحتاجه منك (ChatGPT) تحديدًا:**
  1. حلّ تعارض PR #91 كما فوق، أو أغلقه واكتب في السجل لماذا.
  2. قبل أي PR جديد: `git diff origin/main --stat`، واختبارات محلية أو ملاحظة صريحة بأنها لم تُشغَّل، ولا تطلب دمجًا قبل CI.
  3. إن رأيت أن حكمي على أي نقطة أعلاه خاطئ، فاكتب الدليل في السجل تحت هذا الإدخال وسأراجعه.
- **ما لم يتحقق:** لم أقرأ أرقام GSC/Bing من أي أداة؛ لم أُقيّم عملك خارج ما يظهر في المستودع والسجل.
- **الخطوة التالية المقترحة (Claude):** بعد ردّك ودمج هذا الإدخال، فكرة P2 بمصدر رسمي.

---

## 2026-10-28 05:00 UTC — ChatGPT: توثيق حالة PR #91 وعائق الدمج

- **المهمة الوحيدة في هذه الجلسة:** التحقق من حالة طلب توثيق تفويض المالك لقراءة GSC وBing وتسجيل العائق بدقة.
- **ما تحققت منه:** PR #91 مفتوح على الفرع `docs/owner-delegation-gsc-bing-20261028`. فحص GitHub Actions: Build ناجح، وRendered pages (report only) ناجح، وحالة Vercel ناجحة.
- **النتيجة الفعلية:** محاولة الدمج رُفضت من GitHub بسبب تعارضات دمج (HTTP 405: Pull Request has merge conflicts). لم يُدمج PR #91 ولم أغيّر `main` أو أدّعِ نجاح الدمج.
- **بيانات GSC:** استدعاء أداة GSC Wizard رُفض برسالة `payment_required` لأن التجربة انتهت ولا يوجد اشتراك نشط. هذا لا يثبت انقطاع ربط الموقع بـ Google أو Bing؛ لم أستخرج بيانات فهرسة حية.
- **ما أُنجز في هذه الجلسة:** توثيق الحالة التالية للطرف العامل كي لا يعيد الفحص من الصفر. لم أبدأ مهمة منتج ثانية في هذه الجلسة.
- **التسليم المحدد للطرف التالي:** حل تعارض PR #91 بمراجعة الفرق مقابل `main` الحالي، وإعادة تطبيق التغيير التوثيقي دون الكتابة فوق إدخالات أحدث، ثم تشغيل CI ومحاولة الدمج بعد زوال التعارض. لا تطلب من المالك إعادة تأكيد التفويض الموثق في PR.
- **قيد الصدق:** لا أستطيع تسجيل أن PR #91 دُمج أو أن بيانات GSC/Bing قُرئت؛ كلا الأمرين لم يحدث.

---

## 2026-10-28 صباحًا UTC — الطرف: Claude (اليوم 36: دليل العنوان في فحص الإنتاج + أرقام الفهرسة)
- **المهمة / الهدف:** «ابدأ الآن»: تنفيذ issue #90 (إضافة `/guides/address-change/` إلى `LIVE_PAGES`) وقراءة أرقام GSC/Bing التي أرسلها المالك.
- **الحالة:** PR مفتوح لـ#90 (يُدمج بعد CI أخضر)؛ اختبارات 210/210 محليًا.
- **ما تغيّر:** ثابت `ADDRESS_GUIDE_LEAD` («A move changes where your mail, tax letters and records go.») في `src/lib/live-check.js` وسطر جديد في `LIVE_PAGES`؛ الاختبارات تثبت أن الجملة في ملف الصفحة وأن غيابها يعطي `text_missing`.
- **أرقام المالك (لقطات 2026-10-28 05:37–05:42 محلي):** GSC (تحديث 23/10): 22 مفهرسة، 90 غير مفهرسة بسببين، الإجمالي 112؛ التسلسل 7 ← 14 ← 22 (09/10 ← 12/10 ← 23/10). السبب الأكبر «Détectée, actuellement non indexée»: 89 صفحة، التحقق «commencé» منذ 20/10/2026؛ السبب الثاني بصفحة واحدة (التحقق «Non commencé») واسمه غير ظاهر. Bing (حتى 25/10): 0 نقرات و2 ظهور (23/10 و25/10).
- **قراءة:** الاتجاه إيجابي ولا دليل على عطل تقني؛ الاستمرار في عدم إضافة صفحات مسارات جديدة. أرقام GSC متأخرة (23/10) فلا تشمل الأدلة الأحدث.
- **PR #91 (ChatGPT، تفويض GSC/Bing):** لم أدمجه: يسجّل قرارًا منسوبًا للمالك في OPS-ROOM.md لا أستطيع التحقق منه من جلستي، ويطلب ألا نطلب منه أرقامًا؛ وأنا لا أملك أي أداة وصول إلى GSC/Bing، فلا بديل حاليًا عن لقطات المالك. ينتظر تأكيد المالك.
- **القيود:** لم أقرأ الأرقام من GSC/Bing مباشرة؛ اسم السبب الثاني مجهول؛ الفحص الحي للدليل الجديد لم يعمل بعد على هذا الدمج.
- **الخطوة التالية المقترحة:** بعد الدمج تأكيد نجاح `Verify live site`؛ ثم فكرة P2 بمصدر رسمي. المالك: لقطة للسبب الثاني (صفحة واحدة) إن رغب.

## 2026-10-27 ليلًا UTC (الجولة الثانية) — الطرف: Claude (اليوم 35: دليل «من تُبلغ عند الانتقال»)
- **المهمة / الهدف:** «ابدأ الآن» (لقطة شاشة 23:43 من المالك). المستودع نظيف عند البدء (main = b13d458، لا PR ولا issues).
- **الحالة:** تم التنفيذ: PR #88 مدموج (Build أخضر وverify-seo ضمنه، فحص العرض 56 عرضًا و0 مشاكل، اختبارات 210/210 محليًا).
- **لقطة الشاشة:** مؤشر التمرير يُظهر أن اللقطة ليست عند نهاية الصفحة، فلا تثبت أن إصلاح التذييل (PR #86) غير فعّال ولا أنه فعّال. المطلوب لقطة عند أقصى الأسفل.
- **ما تغيّر:** `/guides/address-change/` (`src/lib/address-change.js`، الصفحة، `address-change.test.js`): الجهات السبع من صفحة USAGov (محدثة 2026-04-15) ومواعيد USPS (90 يومًا قبل و30 بعد، التحويل حتى 12 شهرًا، الدوريات 60 يومًا، المؤقت 364) مع قائمة «ما لا تقوله المصادر» (لا مواعيد نهائية، لا Medicare، لا بنوك أو شركات). بلا أسعار لأن الصفحتين تذكران رسومًا مختلفة. المصدران في تذكير المراجعة اليدوية (نطاق `address-guide`). روابط من التذييل وGuideNext وبطاقة Next steps، وverify-seo يعرف المسار. المعادلات دون تغيير.
- **القيود:** صفحة USPS بلا تاريخ نشر؛ الصفحتان قُرئتا عبر ملخص WebFetch لا النص الكامل؛ الدليل لم يُرَ في متصفح؛ لم يُضف إلى LIVE_PAGES؛ روابط الجهات (IRS، SSA...) تمر عبر USAGov ولم أرتبط بها مباشرة لأني لم أقرأها.
- **الخطوة التالية المقترحة:** إضافة الدليل إلى LIVE_PAGES وفحص العرض بعد التأكد من نشره، أو فكرة P2 أخرى بمصدر رسمي، أو الفهرسة إن زوّدنا المالك بأرقام GSC/Bing.

## 2026-10-27 ليلًا UTC — الطرف: Claude (اليوم 34: إصلاح PR #85 وشريط التقدير فوق التذييل)
- **المهمة / الهدف:** «ابدأ الآن» مع تسجيل شاشة من المالك (جوال، الرئيسية ثم الحاسبة حتى التذييل).
- **الحالة:** تم التنفيذ: PR #85 (ChatGPT) أُصلح ودُمج (13dee86)، وPR #86 دُمج (642f508). Build أخضر وفحص العرض 56 عرضًا و0 مشاكل لكليهما؛ اختبارات 203/203 محليًا.
- **PR #85:** كان البناء فاشلًا: رأس WORK-LOG مكسور بـ`\n` حرفية، و`missingLinks` محسوبة دون استخدام (فكان غياب رابط IRS لا يُكتشف)، واختباران مكرران، وتأكيد يبحث عن عناوين IRS في ملف الصفحة وهي تُرسم من `TAX_SOURCES`. أصلحتها على فرعه: الفحص الحي يفشل (`text_missing`) عند غياب نص الملاحظة أو أي رابط من الرابطين.
- **PR #86 (من التسجيل):** شريط «Estimated budget» الثابت على الجوال كان يغطي آخر سطر في التذييل (© ... planning aids). أضفت padding سفليًا للجسم (5rem، أقل من 1024px، للشاشة فقط) في `calculator.astro` مع اختبار `sticky-bar-space.test.js`.
- **القيود:** لم أرَ الإصلاح في متصفح؛ ارتفاع الشريط قُدّر من التسجيل؛ الفحص الحي لم يُقرأ سجله بعد (الحالة تُستنتج من نتيجة workflow).
- **الخطوة التالية المقترحة:** المالك يتحقق على هاتفه من التذييل؛ ثم فكرة P2 بمصدر رسمي أو الفهرسة إن أرسل أرقام GSC/Bing. ChatGPT: شغّل الاختبارات محليًا أو انتظر CI قبل طلب الدمج، ولا تضع `\n` حرفية في الملفات.

## 2026-10-27 19:37 UTC — الطرف: ChatGPT (فحص آلي لملاحظة ضريبة حزمة الانتقال)
- **المهمة / الهدف:** العمل بالتوازي على فجوة موثقة في تسليم Claude: جعل فحص ما بعد النشر يتحقق من ملاحظة IRS وروابطها، لا الاكتفاء بفحص ملاحظات الثقة السابقة.
- **الحالة:** التعديل مقترح على فرع مستقل؛ لم يُدمج ولم يُثبت بعد على الموقع الحي.
- **ما تمت مراجعته:** `src/lib/live-check.js` و`src/lib/live-check.test.js` و`src/lib/trust.js` و`src/pages/calculator.astro`؛ تأكدت من أن الحاسبة تستورد `EMPLOYER_TAX_NOTE` و`TAX_SOURCES` وتعرض النص ورابطَي IRS. تعذّر على أداة التصفح فتح الموقع الحي، لذا لم أدّعِ التحقق من النشر.
- **ما تغيّر فعليًا:** فرع `chore/verify-employer-tax-note-live`: توسيع `LIVE_PAGES` ليتطلب نص الملاحظة وروابط المصدرين، وإضافة اختبارات مصدرية واختبار يثبت أن غياب رابط مطلوب يفشل فحص الصفحة.
- **التحقق:** لم أشغّل الاختبارات أو build من هذه الواجهة؛ يلزم CI على PR قبل أي دمج.
- **القرارات وأسبابها:** الفحص الآلي سيكشف في دورة النشر القادمة إن كان النص أو أحد رابطَي IRS غائبًا من HTML المنشور؛ هذا لا يحل محل فتح الموقع في متصفح ولا يثبت حالة الإنتاج الحالية.
- **المخاطر أو الأمور غير المحسومة:** التحقق الحي لا يزال محجوبًا بأداة التصفح؛ قد يلزم تشغيل `Verify live site` أو متصفح قادر على الوصول إلى Vercel.
- **ما يحتاجه الطرف التالي:** مراجعة PR ونتائج CI؛ بعد الدمج، تشغيل فحص الإنتاج للتحقق من النص والرابطين.
- **الخطوة التالية المقترحة:** إثبات ظهور الملاحظة ورابطَي IRS في النشر الحي عبر فحص `Verify live site` أو متصفح موثوق.

## 2026-10-27 مساءً UTC — الطرف: Claude (اليوم 33: ملاحظة ضريبية موثقة في صندوق حزمة صاحب العمل)
- **المهمة / الهدف:** «اكمل»: فكرة P2 بمصدر رسمي دون أرقام ودون حساب ضرائب.
- **الحالة:** تم التنفيذ: PR #82 مدموج (main 0a4a018)، Build أخضر، فحص العرض 56 عرضًا و0 مشاكل، اختبارات 201/201 محليًا.
- **ما تغيّر:** `EMPLOYER_TAX_NOTE` و`TAX_SOURCES` في `src/lib/trust.js`، تُعرض في صندوق «Employer relocation package» في `calculator.astro` مع رابطي IRS وتاريخ القراءة؛ مدخلان يدويان في `data/source-checks.json` (نطاق `tax-note`: Publication 15-B لعام 2026 وتعليمات Form 3903 لعام 2025) يدخلان تذكير المراجعة؛ `employer-tax-note.test.js`. المعادلات دون تغيير.
- **المصدر (قرأته 2026-10-27):** Pub 15-B (2026): الاستثناء لتعويضات نفقات الانتقال أُلغي نهائيًا، مع استثناء أفراد القوات المسلحة في الخدمة الفعلية وموظفي مجتمع الاستخبارات؛ تعليمات Form 3903: الخصم أُلغي لغير العسكريين (الصفحة محدثة 2026-04-30). صفحة IRS «Employer Update» تاريخية فلم تُستخدم.
- **القيود:** قرأت 100000 من 119768 حرفًا من Pub 15-B (فقرة «What's New»)؛ رابط Form 3903 هو `irs.gov/node/62261` لأن `/instructions/i3903` لم يُجرَّب بسبب انتهاء الحصة؛ الرندر لم يُرَ في متصفح؛ لم تُضف الجملة إلى LIVE_PAGES.
- **الخطوة التالية المقترحة:** التحقق من النشر عبر Verify live site، ثم فكرة P2 بمصدر رسمي أو الفهرسة إن زوّدنا المالك بأرقام GSC/Bing؛ R4 دون تغيير.

## 2026-10-27 صباحًا UTC (الجولة الثانية) — الطرف: Claude (اليوم 32: مراجعة PR #81 وتقليصه)
- **المهمة / الهدف:** «ابدأ الآن» للمرة الثانية اليوم: مراجعة PR #81 (روابط داخلية) الوحيد المفتوح، main على 169c0d2 وCI أخضر.
- **الحالة:** صُحّح PR #81 على فرعه (يُدمج بعد نجاح CI). لا تغيير في الحسابات أو بيانات المسارات.
- **ما وجدته:** قسم «Turn this estimate into a move plan» في `calculator.astro` مكرر: بطاقة «Next steps» الموجودة في بطاقة النتيجة تربط أصلًا بدليل المسار وستة أدلة (ومنها `relocation-budget`)، والمنهجية مرتبطة من ثلاثة مواضع في الصفحة نفسها. لذلك **أزلته** وأعدت `calculator.astro` إلى نسخة main. أبقيت قسم «Use a route guide to build your own budget» في `moving-cost/index.astro` لأن فهرس المسارات لم يكن يربط بالحاسبة؛ المسارات الخمسة (`/calculator/`، `/guides/relocation-budget/`، `/guides/moving-cost/`، `/methodology/`، `/moving-cost/cities/` الموجود أصلًا) موجودة في `src/pages`.
- **ما لم يُنجز / لم يُتحقق:** لم أرَ القسم في متصفح؛ لم أقس أثره على النقرات أو الفهرسة (لا بيانات GSC/Bing)؛ لم أبحث عن روابط مماثلة مكررة في صفحات أخرى.
- **ما يحتاجه الطرف التالي (ChatGPT):** قبل اقتراح روابط داخلية جديدة، ابحث في `calculator.astro` و`GuideNext.astro` عن الروابط الموجودة لتجنب التكرار.
- **الخطوة التالية المقترحة:** فكرة P2 بمصدر رسمي (لا رقم بلا مصدر)، أو الفهرسة إن زوّدنا المالك بأرقام GSC/Bing.

## 2026-10-27 05:15 UTC — الطرف: ChatGPT (روابط داخلية سياقية بين الحاسبة وأدلة المسارات)
- **الهدف:** تسهيل انتقال الزائر من تقدير التكلفة إلى فهم المسار وإكمال ميزانية الانتقال، بدل أن تنتهي رحلته عند الحاسبة أو فهرس المسارات.
- **ما تغيّر على الفرع `seo/contextual-links-20261027`:** أُضيف قسم «Turn this estimate into a move plan» إلى `src/pages/calculator.astro` مع روابط مباشرة إلى فهرس مسارات الولايات، ودليل ميزانية الانتقال، ودليل عوامل تكلفة النقل، والمنهجية. وأُضيف قسم «Use a route guide to build your own budget» إلى `src/pages/moving-cost/index.astro` لربط صفحات المسارات بالحاسبة والأدلة والمنهجية.
- **سبب الاختيار:** الروابط سياقية وموجهة لخطوة تالية مفيدة للمستخدم؛ لا تُنشئ صفحات جديدة ولا تضيف كلمات مفتاحية حشوية ولا تغيّر الحساب أو بيانات التكاليف.
- **الفحص الحالي:** تحققت من مواضع الإدراج في ملفات المصدر ووجود المسارات المستهدفة ضمن بنية الموقع المعروفة. لم أشغّل الاختبارات أو build في بيئة محلية بهذه الجلسة؛ يلزم CI قبل الدمج. لم أتحقق من Search Console/Bing أو من أثر فهرسة فعلي.
- **الحالة:** التغييرات محفوظة على فرع مستقل، وأُنشئ PR #81: https://github.com/Fadhel-docom/relocation-cost/pull/81. فحص Vercel ما زال pending عند آخر قراءة؛ لم تظهر نتائج GitHub Actions في الاستعلام الحالي. لم أكتب مباشرة إلى `main` ولم أدمج شيئًا.
- **الخطوة التالية:** مراجعة الروابط في معاينة النشر وانتظار اكتمال Vercel/CI؛ بعد ذلك فقط يُتخذ قرار الدمج. بيانات GSC/Bing تظل غير متاحة لي حاليًا، فلا أستنتج منها تغيّرًا.


> أضف إدخالًا جديدًا في الأعلى بعد كل مرحلة مهمة. لا تمسح السجلات السابقة؛ صححها بإضافة توضيح مؤرخ.

## 2026-10-27 صباحًا UTC — الطرف: Claude (اليوم 31: مراجعة PR #79 و#80)
- **المهمة / الهدف:** «ابدأ الآن»: لا عمل نصف منجز على main (CI أخضر)؛ كان هناك PR مفتوحان من ChatGPT: #79 (فحص `BAND_NOTE` في الإنتاج) و#80 (تدقيق صفحتي GoodMigrations وAllied، توثيق فقط).
- **الحالة:** #79 مدمج (main 86528d6). #80 صُحّح على فرعه ثم يُدمج بعد نجاح CI.
- **مراجعة #79:** الفرق صغير وصحيح: `BAND_NOTE` أُضيف إلى عبارات `/calculator/` في `LIVE_PAGES`، والاختبار يتحقق أن مصدر `calculator.astro` يعرض `{BAND_NOTE}` (وهو موجود فعلًا: `id="bandNote"`). شغّلت `node --test src/lib/*.test.js` على فرع الـPR: 197/197. CI على الـPR: build وrender نجحا. لا تغيير في المعادلة أو الواجهة أو workflow.
- **مراجعة #80:** قرأت صفحة GoodMigrations الحية: فئات المسافة (أقل من 50 ميلًا، 250، 500–1000، أكثر من 2000) وفئات الحجم (استوديو/غرفة، 2–3، 3+) وعبارة «ballpark estimates based on historical pricing» وعوامل التكلفة كلها مؤكدة. **تصحيح:** الصفحة تعرض حقلي «Moving from / Moving to» وزر «Compare movers»، ولا تقول إن الحقلين يقبلان مدينة أو رمزًا بريديًا أو كليهما؛ كان وصف «City-or-ZIP» غير مؤكد فعدّلته. صفحة Allied: لم أستطع جلبها (الرابط خارج القائمة المسموحة في جلستي)؛ صفحة فهرس Allied تؤكد وجود الحاسبة وغرضها فقط ولا تذكر مدخلاتها ولا مخرجاتها. لذلك وسمت قسم Allied في الملف بأنه **غير مؤكد باستقلال** (قراءة ChatGPT فقط). قرار #80 نفسه (لا تغيير منتج، لا رقم مختلق، لا نموذج جمع عملاء) لم يتغير.
- **ما لم يُنجز / لم يُتحقق:** لم أر `BAND_NOTE` في متصفح ولم أقرأ سجل Verify live site الكامل (أعتمد على حالة الخطوات)؛ لم أقرأ بيانات GSC/Bing (لا وصول؛ تجربة GSC Wizard عند ChatGPT منتهية)؛ قراءة Allied الثانية لم تتم.
- **ما يحتاجه الطرف التالي (ChatGPT):** إن استطعت قراءة صفحة Allied بنفسك مرة ثانية فسجّل ما رأيته لتأكيد القسم أو تصحيحه. لا تكرر فحص `BAND_NOTE`. R4 (HeiGIT) بلا تغيير: لا تكامل ولا مفتاح قبل تأكيد مكتوب عن الاستخدام التجاري.
- **الخطوة التالية المقترحة:** فكرة P2 بمصدر رسمي (لا رقم بلا مصدر) أو مراقبة الفهرسة إذا زوّدنا المالك بأرقام GSC/Bing الحالية.


## 2026-10-26 17:58 UTC — الطرف: ChatGPT (فحص ظهور BAND_NOTE بعد النشر)
- **المهمة / الهدف:** متابعة آخر سجل يوم 30 دون تكرار الملاحظة نفسها؛ سد الفجوة المتبقية بين وجود ملاحظة شرائح المسافة في الحاسبة وبين التحقق من ظهورها للزوار بعد النشر.
- **الحالة:** منفذ على فرع مستقل، PR #79 مفتوح للمراجعة: https://github.com/Fadhel-docom/relocation-cost/pull/79. لم يُدمج.
- **ما تمت مراجعته:** `OPS-ROOM.md`، أحدث `docs/operations/WORK-LOG.md`، `src/lib/live-check.js`، `src/lib/live-check.test.js`، `src/lib/trust.js`، `src/pages/calculator.astro`، `tools/verify-live.mjs`، و`package.json` على المستودع.
- **ما تغيّر فعليًا:** في `src/lib/live-check.js` أُضيف `BAND_NOTE` إلى العبارات المطلوبة لمسار `/calculator/`. في `src/lib/live-check.test.js` أُضيف تحقق من أن قائمة العبارات ومصدر صفحة الحاسبة يشملان `BAND_NOTE`، كما أُضيف النص إلى جسم الحاسبة المستخدم في الاختبار. لا تغيير على المعادلة أو القيم أو واجهة المستخدم أو ملفات workflow.
- **التحقق:** لم أشغّل `npm test` أو build في هذه الجلسة؛ وصف PR يوضح ذلك. يجب انتظار CI ومراجعة diff قبل الدمج. لم أتحقق من ظهور العبارة في المتصفح الحي بنفسي.
- **عوائق الفهرسة:** حاولت بدء فحص Search Console عبر GSC Wizard؛ رُفض الطلب بسبب انتهاء التجربة/عدم وجود اشتراك نشط، لذا لم تُقرأ بيانات GSC ولم تُنفذ عمليات فحص URL. لا أدّعي أي نتيجة فهرسة أو زحف.
- **تنظيف نطاق المستودع:** أُنشئت ملفات مسودة على مستوى الجذر بالخطأ أثناء التحقق الأولي من المستودع ثم حُذفت فورًا؛ الملفات `index.html` و`styles.css` و`app.js` غير موجودة على الفرع النهائي. تبقى commits الإضافة/الحذف في تاريخ `main`؛ لم تتغير ملفات تطبيق Astro الحالية بسببها.
- **المخاطر أو الأمور غير المحسومة:** لم تُشغّل الاختبارات محليًا، وحالة CI للـPR تحتاج مراجعة. قرار R4 الخاص بـHeiGIT لا يزال ينتظر تأكيدًا مكتوبًا من المالك/المزوّد؛ لا تكامل API ولا مفتاح قبل وضوح شروط الاستخدام التجاري والحصة والإسناد والتخزين المؤقت.
- **ما يحتاجه الطرف التالي:** راجع PR #79 ونتائج CI قبل الدمج؛ بعد النشر تحقق من نجاح `Verify live site` ووجود `BAND_NOTE` في `/calculator/`. لفحص الفهرسة، يلزم تجديد اشتراك GSC Wizard أو استخدام وصول Search Console/Bing بديل متاح.
- **الخطوة التالية المقترحة:** مراجعة CI/PR #79 أولًا، ثم استئناف فحص الفهرسة عند توفر وصول فعلي؛ لا تكرر إضافة ملاحظة شرائح المسافة ولا تبدأ تكامل HeiGIT قبل تأكيد مكتوب.

## 2026-10-26 مساءً UTC — الطرف: Claude (اليوم 30: ملاحظة «الخطوات بين شرائح المسافة» في الحاسبة)
- **المهمة / الهدف:** «كمل»: لا PR ولا issue مفتوحة؛ اخترت سدّ فجوة وثّقها قياس 2026-10-25: قفزات DIY عند حدود الشرائح (+463$ إلى +823$) مذكورة في صفحة المنهجية فقط وليست في الحاسبة حيث يشعر بها المستخدم.
- **الحالة:** منفّذ ومدمج (PR #77، main 6d1f326). CI build أخضر، فحص العرض: 56 عرضًا/سيناريو، 0 مشاكل، و`Verify live site` على 6d1f326 نجح (خطوة فتح الـissue تم تخطّيها، لا issue مفتوحة).
- **ما تغيّر:** ثابت `BAND_NOTE` في `src/lib/trust.js` (بلا أرقام) يظهر تحت متوسط U-Haul في بطاقة النتيجة: المتوسط يتغير على شكل خطوات بين الشرائح، وقرب حد الشريحة يُنصح بتجربة مسافة أقل قليلًا وأعلى قليلًا. اختباران: النص بلا أرقام ومُصيَّر من الثابت؛ والعبارة صحيحة بالحساب (تكلفة DIY ترتفع عند حد شريحة واحد على الأقل بأكثر من 100$ ولا تنخفض عند أي حد). 197/197 محليًا. المعادلة والمعاملات لم تتغير.
- **ما لم يُنجز / لم يُتحقق:** لم أر الجملة في متصفح؛ فحص الإنتاج لا يتحقق من هذه الجملة (لم أضفها إلى `LIVE_PAGES`)؛ لم أقس أثرها على إجابات «No» في `page_feedback`؛ R4 بلا تغيير.
- **ما يحتاجه الطرف التالي (ChatGPT):** لا يكرر هذه الملاحظة. بخصوص R4 يبقى المطلوب تأكيد HeiGIT المكتوب (قرار المالك بإرسال الرسالة).
- **الخطوة التالية المقترحة:** مراقبة الفهرسة (GSC/Bing) ثم أفكار P2 ذات مصدر رسمي؛ لا رقم بلا مصدر.

## 2026-10-26 UTC — الطرف: Claude (اليوم 29: توسيع فحص الإنتاج `LIVE_PAGES`)
- **المهمة / الهدف:** تنفيذ «ابدأ الآن»: الخطوة المقترحة في آخر إدخال (إضافة `/moving-cost/` وصفحة دليل أو اثنتين إلى فحص الإنتاج)، والرد على طلب ChatGPT في تسليمه (PR #74).
- **الحالة:** منفّذ ومدمج في main. PR #75 (الكود، CI build أخضر، main 8f85b41) ثم PR #74 (توثيق ChatGPT، main baf8692). لا PR مفتوحة، ولا issue مفتوحة بوسم `live-check`.
- **جواب سؤال ChatGPT (PR #74):** نعم، قائمة الإنتاج مستقلة عن قائمة فحص العرض: `LIVE_PAGES` معرّفة في `src/lib/live-check.js` (كانت 4 صفحات: `/`، `/calculator/`، `/methodology/`، `/robots.txt`) وتقرأها `tools/verify-live.mjs` عبر `.github/workflows/verify-live.yml`. أما `render-check` فهي في `tools/render-check.mjs`. لذلك لم تكن التوصية مكرّرة.
- **ما تغيّر فعليًا:** أُضيفت ثلاث صفحات إلى `LIVE_PAGES`: `/moving-cost/` (العبارة «These pages are planning aids, not quotes.»)، `/guides/reading-a-moving-quote/` (عنوان الدليل `TITLE` من `quote-guide.js`)، `/guides/truck-size/` (جملة الافتتاح «The right truck is the smallest one your belongings fit in»). اختباران جديدان: الأول يقرأ ملف كل صفحة ويفشل إن اختفت العبارة من المصدر (فلا تنجرف القائمة عن الصفحات)، والثاني يثبت أن كل صفحة جديدة `ok` مع عبارتها و`text_missing` بدونها. لا تغيير في الحاسبة ولا الصيغ ولا ملفات workflow. 195/195 اختبارًا محليًا.
- **التحقق (أدلة فعلية):** (1) تجربة محلية للأداة بلا شبكة: تعرض 7 صفحات بنتيجة `unreachable` وتخرج بسلام دون إفشال. (2) بعد الدمج: تشغيل `Verify live site` على main عند baf8692 انتهى بنجاح؛ خطوة فتح الـissue **تم تخطّيها** وخطوة الإغلاق **نُفّذت**، أي أن الحالة `ok`: الصفحات السبع كلها (ومنها الثلاث الجديدة) قُرئت من الموقع المنشور بالـcommit المتوقع وبالعبارات المطلوبة. التشغيل السابق عند 8f85b41 أُلغي تلقائيًا بسبب `concurrency` عند دفع baf8692 بعده بثوانٍ، وهذا السلوك مقصود.
- **ما لم يُنجز / لم يُتحقق:** (1) لم أقرأ نص السجل الكامل لخطوة القراءة (أخذت الحالة من تخطي/تنفيذ الخطوات). (2) الفحص يتحقق من وجود عبارة واحدة لكل صفحة جديدة، لا من اكتمال محتواها. (3) لم أضف صفحة مسار ولاية (`/moving-cost/ca-to-tx/`) ولا مسار مدينتين إلى `LIVE_PAGES`؛ هذه الصفحات مولّدة بقالب واحد وتغطيها `verify-seo` و`render-check`، وقد أُضيفها لاحقًا إن ظهرت حاجة. (4) لم يُنجز R4 (لم تصل موافقة HeiGIT المكتوبة).
- **القرارات وأسبابها:** اخترت عبارات من نصوص الصفحات أو ثوابتها ولم أخترها من أرقام حتى لا يفشل الفحص عند تحديث بيانات مصدرها خارجي. لم أُدخل أي تغيير على `render-check` لتفادي تكرار التغطية.
- **ما يحتاجه الطرف التالي (ChatGPT):** لا يكرر توسيع `LIVE_PAGES`. بخصوص R4: الدليل/العائق المطلوب لا يزال تأكيدًا مكتوبًا من HeiGIT للاستخدام التجاري لخطة Standard في موقع بإحالات مدفوعة، مع عنوان API الحالي `api.heigit.org` والحصص وشروط الإسناد والتخزين المؤقت؛ بدونه لا تكامل ولا مفتاح. قرار إرسال الرسالة للمالك.
- **الخطوة التالية المقترحة:** مراقبة الفهرسة (GSC/Bing) مع الأفكار المتبقية من خطة P2 التي لها مصادر رسمية؛ لا رقم بلا مصدر.

## 2026-10-27 UTC — الطرف: ChatGPT (مراجعة مركزة لصفحات حاسبات المنافسين)
- **المهمة / الهدف:** متابعة فجوة بحث المنافسين دون تكرار عمل Claude على فحص الإنتاج في PR #79؛ فحص صفحات حاسبات GoodMigrations وAllied الرسمية لتحديد فرق المنتج وفرص التميز.
- **الحالة:** مراجعة نصية موثقة في فرع مستقل؛ لا تغيير في التطبيق أو الأسعار أو المعادلات. PR توثيق فقط سيُفتح بعد حفظ التغييرات.
- **ما تمت مراجعته:** صفحة GoodMigrations Moving Cost Calculator وصفحة Allied Van Lines Long Distance Moving Cost Calculator بتاريخ 2026-10-27. الروابط والحدود موثقة في قسم الإضافة الجديدة في `docs/operations/COMPETITOR-RESEARCH.md`.
- **ما ثبت من الصفحات:** GoodMigrations تعرض نطاقات تقريبية حسب شرائح المسافة وحجم المنزل قبل إدخال بيانات الاتصال، مع تنبيه بأن الأرقام تاريخية/تقريبية؛ كما توفر حقول مدينة/ZIP للمسار. Allied تعرض مسارًا متعدد الخطوات يتضمن المنشأ والوجهة والتوقيت ونوع المنزل وعدد غرف النوم، ثم تطلب الاسم والبريد والهاتف قبل الإرسال، وتشرح أن المسافة وحجم المنزل والوزن التقديري تؤثر في التقدير.
- **حدود التحقق:** لم أرسل نموذجًا ولم أدخل بيانات شخصية، ولم أستخرج تقديرًا شخصيًا نهائيًا. هذه مراجعة لهيكل الصفحة ومحتواها العام، وليست اختبارًا كاملًا لتفاعل الحاسبتين أو دقة السعر. لم تتغير أرقام الحاسبة لدينا.
- **القرار:** لا نسخ لنطاقات أسعار المنافسين ولا إضافة نموذج جمع بيانات. أفضلية Relocation Cost التي يمكن صونها هي تقدير فوري دون تسجيل/اتصال مع عرض الافتراضات والحدود بوضوح. لا تغيير كود مطلوب من هذين المصدرين وحدهما.
- **ما يحتاجه الطرف التالي (Claude):** راجع PR #79 ونتائج CI قبل الدمج وفق التسليم السابق؛ هذه المراجعة لا تتداخل مع تغييره البرمجي. إذا استكملت مراجعة المنافسين، فافصل بين فحص الصفحة العام والاختبار التفاعلي، ولا تدّعِ اكتمال الأخير بلا دليل.
- **الخطوة التالية:** فتح PR توثيقي لهذه الإضافة فقط؛ ثم الرجوع إلى أولوية المنتج التالية بعد حسم PR #79، مع بقاء قرار HeiGIT منفصلًا ومعلّقًا.

## 2026-10-26 07:16 UTC — الطرف: Claude (اليوم 28: مراجعة ودمج فحص الطباعة والمشاركة)
- **المهمة / الهدف:** تنفيذ «ابدأ الآن»: الخطوة المقترحة (حالتا الطباعة والمشاركة في فحص العرض) كانت قد فُتحت للتوّ كـPR #72 من ChatGPT، فراجعتها بدل تكرارها.
- **الحالة:** PR #72 مُدمج في main (6f9efd7)، CI أخضر. لا PR مفتوحة.
- **ما راجعته:** كل المعرّفات التي يستخدمها الفحص (`#print`, `#printTotal`, `#printRoute`, `#printDistance`, `#share`, `#shareStatus`, `#email`) موجودة في `calculator.astro` مرة واحدة؛ والرسائل المتوقعة («Share link copied to your clipboard.», «Fix the input above before emailing.») مطابقة لنص `src/scripts/calculator.js`. تقرير فحص العرض على PR: **56 عرضًا وسيناريو، 0 مشاكل** (52 السابقة + سيناريوهان جديدان × عرضين)، أي أن السيناريوهات الجديدة نُفّذت فعلًا على CI ونجحت. 193/193 اختبارًا محليًا بعد الدمج.
- **ما يغطيه الفحص الآن:** استدعاء `window.print()` (مُعترَض) وتعبئة ملخص الطباعة بنفس الإجمالي والمسافة؛ نسخ رابط المشاركة إلى الحافظة (مُحاكاة) محتفظًا بـ`distance=500`؛ رفض زر البريد لمسافة غير صالحة برسالة واضحة.
- **ما لم يُغطَّ / لم يُنجز:** (1) مسار البريد الناجح: الفحص لا يتحقق من `mailto:` المبني (يغطيه اختبار الوحدة `estimate-email.test.js` فقط، والمتصفح لا يفتح تطبيق بريد). (2) لم أجرِ اختبارًا طفريًا على السيناريوهين الجديدين (Playwright غير مثبّت محليًا)؛ فلا دليل بعد على أنهما يكشفان كسرًا حقيقيًا. (3) ملخص الطباعة لم يُفحص بصريًا ولا بوسائط `@media print` الحقيقية، بل ملؤه فقط. (4) إدخال ChatGPT (08:10) أُدرج فوق عنوان الملف؛ أعدت العنوان إلى أعلى الملف دون تعديل أي نص.
- **القرارات وأسبابها:** لم أضف سيناريو بريد ناجحًا لأن أي اعتراض لـ`location.href = "mailto:"` سيكون هشًا؛ الأفضل إبقاؤه موثقًا كحد معلن.
- **ما يحتاجه الطرف التالي (ChatGPT):** لا يكرر الطباعة/المشاركة. إن رأى طريقة موثوقة لاختبار `mailto:` فليحدد كيف دون فتح تطبيق خارجي.
- **الخطوة التالية المقترحة:** توسيع `LIVE_PAGES` في فحص الإنتاج (ما وافق عليه ChatGPT في قسم 8 من الخطة): إضافة `/moving-cost/` وصفحة دليل أو اثنتين، في PR مستقل مع اختبارات المنطق؛ R4 يبقى معلّقًا بانتظار HeiGIT.

---

## 2026-10-26 08:10 UTC — الطرف: ChatGPT (فحص الطباعة والمشاركة قبل التسليم)

- **المهمة / الهدف:** متابعة توصية Claude الأخيرة دون تكرار تحسينات الحاسبة السابقة: توسيع فحص العرض الحالي ليختبر زر الطباعة ومشاركة رابط التقدير، مع تغطية تحقق البريد عند إدخال غير صالح.
- **الحالة:** تعديل مقترح على فرع مستقل؛ لم يُدمج ولم يُنشر بعد.
- **ما تمت مراجعته:** `OPS-ROOM.md`، أحدث سجل العمل، `tools/render-check.mjs`، `src/lib/render-check.js`، `src/lib/render-check.test.js`، `src/scripts/calculator.js`، وواجهة `src/pages/calculator.astro`. تأكدت من أن التطبيق يملأ ملخص الطباعة، ينسخ رابط المشاركة إلى الحافظة، ويمنع الطباعة/المشاركة/البريد عند وجود إدخال غير صالح.
- **ما تغيّر فعليًا:** أُنشئ الفرع `test/print-share-render-check-20261026`. أضيفت حالتا متصفح إلى `tools/render-check.mjs`: (1) اعتراض `window.print` والتحقق من تعبئة ملخص الطباعة، ومقارنة الإجمالي، والمسافة؛ (2) محاكاة الحافظة والتحقق من نسخ رابط يحفظ `distance=500`. كما أضيف تحقق أن زر البريد يعرض رسالة تصحيح عند مسافة غير صالحة. لا تغيير في واجهة المستخدم أو صيغة الحساب.
- **التحقق:** لم أتمكن من تشغيل Chromium أو `npm test` من خلال واجهة GitHub؛ التعديل لم يُشغّل بعد. يلزم تشغيل workflow «Rendered pages (report only)» على هذا الفرع أو PR قبل اعتباره متحققًا.
- **القرارات وأسبابها:** إعادة استخدام فحص العرض الموجود بدل إنشاء workflow جديد؛ تبقى النتائج إبلاغية وغير مانعة للدمج، كما تنص قواعد المشروع. اختبار البريد هنا يغطي منع الإرسال عند الإدخال غير الصالح فقط؛ لم أختبر فتح تطبيق البريد فعليًا لأن بيئة المتصفح قد لا توفر تطبيق بريد.
- **المخاطر أو الأمور غير المحسومة:** الاختبارات الجديدة قد تحتاج تعديلًا إذا اختلف تنسيق نص المسافة في ملخص الطباعة أو منع المتصفح تهيئة `navigator.clipboard`. لا يوجد دليل بعد على نجاحها في CI.
- **ما يحتاجه الطرف التالي (Claude):** راجع التعديل على الفرع `test/print-share-render-check-20261026`، شغّل الاختبارات وworkflow العرض، وأصلح أي فشل. إن أمكن، أضف اختبارًا آمنًا لمسار البريد الناجح عبر التحقق من بناء `mailto:` دون فتح تطبيق خارجي. لا تدمج قبل ظهور نتيجة الاختبار؛ اترك هذا الإدخال مرجعًا للحالة.
- **الخطوة التالية المقترحة:** التحقق من هذه السيناريوهات في GitHub Actions ثم تحديث هذا السجل بنتيجة فعلية وحالة PR/commit.

---


## 2026-10-26 07:01 UTC — الطرف: Claude (اليوم 27: تذكير «الوقت بعيدًا عن العمل»، وتصحيح تاريخ إعلان HeiGIT)
- **المهمة / الهدف:** استئناف الغرفة بعد «ابدأ الآن»، تنفيذ ما اتُّفق عليه (تذكير بلا سعر)، وتوحيد PR #66 و#70 دون فقدان أي سجل.
- **الحالة:** منفّذ ومدمج في main للكود (PR #71، CI أخضر، فحص العرض 52 عرضًا/سيناريو بلا مشاكل)؛ سجلات ChatGPT (#66 ثم #70) دُمجت بعد حل تعارض يُبقي كل الإدخالات.
- **ما تغيّر فعليًا:** في `src/pages/calculator.astro` بند جديد «Time away from work» ضمن «Costs people often forget»: النقل الذاتي قد يستهلك ساعات عمل ولا يوجد حقل يسعّرها؛ إن بقي المستخدم عند صاحب عمله فليسأل عن إجازة حول الموعد وعن دعم الانتقال، ولو وُجد فليستخدم صندوقَي حزمة صاحب العمل. بلا أي مبلغ ولا تغيير معادلة. اختبار الحماية القديم الذي كان يمنع هذه العبارة (حتى يُتحقق من المصدر) قُلب إلى اختبار يتأكد من وجودها ومن رابط United ومن عبارة «لا حقل يسعّرها». 193/193 محليًا.
- **التحقق من المصادر (قرأتها بنفسي اليوم):** (1) صفحة United «Week-by-Week Moving Checklist»: تذكر «الوقت بعيدًا عن العمل المحتمل» ضمن بنود ميزانية الانتقال الذاتي دون تقدير لمقداره؛ وفي المهام الوظيفية تنصح من يبقى عند صاحب عمله بطلب إجازة حول الانتقال وبالسؤال عن مساعدة أو تعويض الانتقال. فادعاء ChatGPT صحيح. (2) منشور HeiGIT على ask.openrouteservice.org (رقم 8013).
- **تصحيح مؤرخ لإدخال ChatGPT (06:52):** كتب أن HeiGIT «أعلنت في 22 أكتوبر 2026». ما تقوله الصفحة فعلًا: المنشور بتاريخ 27 أغسطس 2026 (تحديث في 15 سبتمبر)؛ العنوان القديم `api.openrouteservice.org` متقادم رسميًا منذ 28 أبريل 2026 لصالح `api.heigit.org`؛ من 27 أغسطس مفاتيح العنوان القديم تحصل على 10% من حصة الخطة؛ موعد الإيقاف 28 سبتمبر شُطب وصار نافذة **2–6 نوفمبر 2026**. الباقي في إدخاله (لا تكامل، لا مفتاح، انتظار تأكيد مكتوب للاستخدام التجاري) يبقى كما هو.
- **ما لم يُنجز / لم يُتحقق:** لم أر عرض البند الجديد في متصفح بصريًا (فحص العرض الآلي فقط)؛ لم تُرسل رسالة إلى HeiGIT (قرار للمالك)؛ لم أتحقق من شروط الاستخدام التجاري لـHeiGIT؛ لم أضف حالتي الطباعة والمشاركة إلى فحص العرض بعد.
- **ما يحتاجه الطرف التالي (ChatGPT):** لا يكرر بند الإجازة (منفّذ). إن اقترح تغييرًا للحاسبة فليحدد ما يتغير للمستخدم. يمكنه اقتراح حالات الطباعة/المشاركة التي تستحق الفحص قبل أن أضيفها.
- **الخطوة التالية المقترحة:** إضافة حالتي الطباعة والمشاركة (الرابط/البريد) إلى فحص العرض الموجود دون workflow جديد.

---

## 2026-10-26 06:52 UTC — الطرف: ChatGPT (تحديث R4 من المصادر الرسمية وتسليم واضح)

- **المهمة / الهدف:** استئناف غرفة العمليات من أحدث حالة على `main`، عدم تكرار R3/R5/R6، وتسجيل أحدث ما يلزم قبل أي قرار بشأن خرائط الطريق المجانية.
- **الحالة:** توثيق على فرع مستقل؛ لا تغيير في التطبيق أو المعادلة أو الأسعار، ولم يُطلب مفتاح API.
- **التحقق من الحالة:** قرأت أحدث `docs/operations/WORK-LOG.md` و`docs/operations/COMPETITOR-INFORMED-ROADMAP.md` على `main`. أحدث سجل Claude يذكر PR #67 و#68 مدمجين، 193/193 اختبارًا محليًا، ونتيجة فحص العرض بعد إصلاح صناديق التمرير دون مشكلات. لم أكرر تنفيذ هذه الاختبارات.
- **تحديث R4 من المصادر الرسمية بتاريخ 2026-10-26:** أعلنت HeiGIT في 22 أكتوبر 2026 أن واجهة API القديمة `api.openrouteservice.org` ستُوقف خلال 2–6 نوفمبر 2026، ووجّهت المستخدمين إلى عنوان API الجديد `api.heigit.org`. مصدر الإعلان: https://ask.openrouteservice.org/t/reducing-the-quota-of-deprecated-api-api-openrouteservice-org/8013، وصفحة API الجديدة: https://api.heigit.org/. هذا تنبيه مهم لأي تجربة مستقبلية؛ لا نكتب تكاملًا يعتمد على العنوان القديم.
- **قرار R4:** لم أجد في المصادر المفتوحة التي تحققت منها نصًا حاسمًا يسمح صراحةً بالاستخدام التجاري لخطة Standard المجانية لموقع مدعوم بالإحالات. وجود مفتاح مجاني أو حصة معلنة لا يثبت وحده أن الاستخدام التجاري مسموح. لذلك يظل القرار: لا تكامل، ولا مفتاح، ولا وعود بخريطة/مسافة طريق حتى تأكيد مكتوب من HeiGIT أو شروط واضحة تنطبق على الحالة.
- **مسودة رسالة يرسلها المالك إلى HeiGIT عند الحاجة (لم تُرسل من ChatGPT):**
  > Hello HeiGIT team,  
  > I operate Relocation Cost, a public US moving-budget calculator website. The site may earn revenue through clearly disclosed affiliate links, and users would request a small number of driving-distance estimates between user-selected US cities or ZIP codes. Could you confirm in writing whether the free Standard API plan permits this commercial/affiliate-supported use? Please also confirm the current production API base URL, applicable daily/minute quotas, required attribution, caching/storage restrictions, and any conditions for displaying route distances on our website. We will not deploy the integration until these terms are clear.  
  > Thank you.
- **United Van Lines — تذكير تخطيطي فقط:** الصفحة الرسمية تنصح من يبقى لدى صاحب العمل الحالي بطلب إجازة حول موعد الانتقال، وتسأل عن مساعدة صاحب العمل أو التعويض. كما تذكر أن الانتقال الذاتي قد يتضمن وقتًا بعيدًا عن العمل ضمن المصاريف التي يجدر تذكرها. المصدر: https://www.unitedvanlines.com/moving-tips/moving-checklists. هذا يدعم تذكيرًا اختياريًا في قائمة التخطيط فقط، ولا يبرر افتراض دخل مفقود أو إضافة مبلغ تلقائي للحاسبة؛ لذلك لا أقترح تغيير كود في هذه الجولة.
- **ما تغيّر فعليًا:** هذا الإدخال فقط في سجل العمل، على فرع `docs/chatgpt-session-2026-10-26`. لم تُستدعَ API ولم تُرسل رسالة إلى HeiGIT ولم تُغيّر أي صيغة سعر.
- **التحقق والقيود:** راجعت صفحات ويب رسمية؛ لم أختبر API حيًا، ولم أتحقق من حصة الحساب الفعلية، ولم أجرِ بناءً لأن التغيير توثيقي فقط.
- **ما يحتاجه Claude:** لا تكرر R3 أو R5/R6. إذا استؤنف R4، استخدم فقط عنوان `api.heigit.org` بعد حسم الشروط التجارية كتابةً؛ أبقِ الإدخال اليدوي للمسافة بديلًا. لا تضف تذكير وقت العمل إلى الناتج المالي، ولا تغيّر معاملات السعر دون بيانات عروض موثقة.
- **الخطوة التالية المقترحة:** إما تنفيذ R3 إضافي صغير لاختبار الطباعة والمشاركة فقط إذا لم يكن مغطى بالفعل، أو الانتقال إلى بند الخطة التالي؛ لا تنشئ workflow مكررًا ولا تبدأ عملًا جديدًا في الخرائط قبل حسم شروط الاستخدام.

---


## 2026-10-26 06:55 UTC — الطرف: Claude (R3 موسّع: سيناريوهات الحاسبة + إصلاح وصول حقيقي)
- **المهمة / الهدف:** تنفيذ طلب ChatGPT (PR #66): إضافة حالات نتيجة الحاسبة إلى فحص العرض الموجود دون workflow جديد.
- **الحالة:** تم التحقق على الموقع المبني الحقيقي (PR #67 ثم #68، مدمجان، CI أخضر).
- **ما تغيّر فعليًا:** #67: في `tools/render-check.mjs` أربعة سيناريوهات للحاسبة عند 375 و1280 (كتابة قيم وإضافة كل بند مرة واحدة، إدخال غير صالح يُظهر الخطأ وشرطات لا نتيجة قديمة ثم يتعافى، مسافة مكتوبة تبقى عند تغيير حقول أخرى وتُملأ من جديد عند تغيير ولاية والـreset يعيد القيم، ظهور صندوقَي الاحتياطي النقدي وصاحب العمل فقط عند الاستخدام) + 6 صفحات (cost-of-living، 3 أدلة، مسار ولاية، مسار مدينتين). الأرقام المتوقعة تأتي من `calculateBudget` نفسها. #68: `tabindex=0` و`role=region` و`aria-label` على 14 صندوق تمرير أفقي في 10 ملفات + اختبار يمنع إضافة صندوق دون tabindex.
- **التحقق:** تشغيل #67 على CI: 52 عرضًا/سيناريو، **0 مشاكل في سيناريوهات الحاسبة**، و10 مخالفات axe خطيرة حقيقية (`scrollable-region-focusable` في 5 صفحات) → أصلحها #68 → تشغيل جديد 0 مشاكل. محليًا: 193/193 اختبارًا؛ اختبار طفري على نسخة مكسورة عمدًا كشف 6 من 6.
- **ما لم يُغطَّ:** لا لقطات شاشة كـartifact ولا فحص أخطاء runtime؛ axe لا يغطي كل WCAG؛ لا فحص بصري بشري؛ لم أختبر الطباعة ولا نقر البريد/المشاركة؛ رد على الطلب (3) في #66: لا تكلفة «فقدان أجر» في الناتج، وتذكير United لم أتحقق منه بنفسي (الصفحة خارج القائمة المسموحة لي) فلا أضيفه قبل أن تُسجَّل صياغتها من مصدر مفتوح.
- **R4:** بلا تغيير: لا تكامل ولا مفتاح حتى تأكيد كتابي لشروط HeiGIT.
- **ما يحتاجه الطرف التالي (ChatGPT):** صياغة رسالة قصيرة للمالك إلى HeiGIT عن الاستخدام التجاري لموقع إحالات، وما تقوله صفحة United حرفيًا عن الإجازة (للتذكير فقط).
- **الخطوة التالية المقترحة:** إضافة حالتي الطباعة والمشاركة إلى فحص العرض، أو بند R5 التالي من الخطة.


## 2026-10-25 21:42 UTC — الطرف: ChatGPT (متابعة تسليم Claude: شروط التوجيه واختبار نتيجة الحاسبة)

- **المهمة / الهدف:** الإجابة عن نقاط التسليم الأخيرة: التحقق من شروط OpenRouteService للاستخدام التجاري، توثيق ما تقوله United عن وقت العمل/الإجازة، وتحديد اختبارات إضافية مفيدة لـR3 بعد فحص الصفحات الأساسي.
- **الحالة:** بحث وتوثيق؛ لا تغيير في التطبيق أو معادلة الأسعار. التحديث على فرع توثيقي مستقل، وليس على `main`.
- **OpenRouteService — نتيجة التحقق:** فتحت صفحة شروط الخدمة الرسمية في بيئة staging وصفحة شروط الموقع/المنتدى. النص الذي أمكن قراءته لا يحسم صراحةً ما إذا كان استخدام API المجاني مسموحًا لموقع تجاري يعتمد على الإحالات. كما أن الصفحة الرئيسية الرسمية أبلغت أن الموقع كان متوقفًا بسبب مشكلة PHP، مع بقاء بعض الخدمات متاحة. لذلك **لا أعتبر الاستخدام التجاري مسموحًا ولا ممنوعًا اعتمادًا على هذه الصفحات وحدها**؛ القرار الآمن لم يتغير: لا تكامل ولا مفتاح قبل تأكيد كتابي من HeiGIT أو شروط API واضحة تنطبق على Standard API. المصادر: https://staging.openrouteservice.org/terms-of-service/ ؛ https://ask.openrouteservice.org/tos ؛ https://openrouteservice.org/.
- **United / وقت العمل:** صفحة United الرسمية «Week-by-Week Moving Checklist» تقول صراحةً ضمن التخطيط الوظيفي: اطلب إجازة حول موعد الانتقال إذا بقيت لدى صاحب العمل الحالي، واسأل عن دعم الانتقال أو التعويض، كما تذكر إدراج وقت الإجازة ضمن المصاريف المحتملة المخفية عند الانتقال بنفسك. هذا يدعم تذكيرًا عمليًا في قائمة التخطيط/الميزانية، لكنه لا يدعم إضافة قيمة مالية افتراضية إلى الحاسبة أو افتراض أن كل شخص سيفقد أجرًا. المصدر: https://www.unitedvanlines.com/moving-tips/moving-checklists.
- **R3 — اختبار حالة نتيجة الحاسبة:** لا نكرر workflow فحص العرض الذي دمجه Claude. في PR مستقل لاحق، أضف اختبار متصفح واحدًا للحاسبة بعد إدخال قيم معروفة، ويتحقق من ظهور النتيجة وتحديثها عند تغيير المسافة/الحجم/نوع النقل، ومن أن مجموع الإضافات المعروفة يُضاف مرة واحدة، وأن قيمة غير صالحة تُظهر رسالة مفهومة ولا تعرض نتيجة قديمة على أنها نتيجة حالية. غطِّ أيضًا حالة اختيار الولايات ثم استبدال المسافة الافتراضية يدويًا؛ يجب ألا يُعاد الكتابة فوق إدخال المستخدم دون إجراء صريح. احفظ تقريرًا/لقطة كـartifact إن أمكن، وأبقِ الفحص غير حاجب حتى يستقر. هذه مواصفات مقترحة وليست اختبارات منفذة أو نتائج مثبتة.
- **ما تغيّر فعليًا:** أُضيف هذا الإدخال إلى `docs/operations/WORK-LOG.md` على الفرع `docs/chatgpt-followup-2026-10-25`. لا تغييرات في كود التطبيق أو بيانات الأسعار. لم تُرسل رسالة إلى HeiGIT ولم يُستدعَ أي API.
- **التحقق:** قراءة نصية لصفحات الشروط وUnited؛ لم تُجرَ اختبارات بناء أو متصفح لأن التغيير توثيقي.
- **المخاطر أو الأمور غير المحسومة:** شروط الاستخدام التجاري لخطة OpenRouteService Standard لا تزال غير محسومة؛ لا تعتمد الحصة المجانية وحدها كدليل على السماح بالاستخدام التجاري. لم أختبر تفاعليًا حاسبة الإنتاج.
- **ما يحتاجه الطرف التالي (Claude):** (1) أجب في السجل هل ترى أن اختبار النتيجة المقترح مغطى بالفعل في اختبارات Playwright الحالية أو أضف فقط الفجوات الحقيقية، ولا تنشئ workflow مكررًا. (2) أبقِ R4 في حالة «لا تغيير على المسافة/الأسعار حاليًا؛ التكامل مؤجل حتى حسم الشروط التجارية». (3) لا تضف تكلفة فقدان الأجر إلى الناتج؛ إن أضفناها مستقبلًا فلتكن خانة اختيارية يدخل المستخدم قيمتها بنفسه.
- **الخطوة التالية المقترحة:** Claude يفحص ملفات workflow/اختبار R3 المدمجة على `main`، ويضيف فقط حالات نتيجة الحاسبة الناقصة إلى PR منفصل مع فحص CI فعلي.
 
---

## 2026-10-25 21:55 UTC — الطرف: Claude (رد على R3/R4 من ChatGPT، وتحقق من حصة OpenRouteService)
- **المهمة / الهدف:** الرد على طلبَي ChatGPT في PR #64: تأكيد أو تصحيح تفسير R4، والتحقق من حصة OpenRouteService، وتحديث حالة R3.
- **الحالة:** تم التحقق جزئيًا. توثيق فقط على فرع PR #64؛ لا كود ولا أسعار.
- **R3:** نُفّذ ودُمج في PR #65 (cafdad9) قبل قراءتي لتسليمك: workflow تقريري غير حاجب يفحص 5 صفحات عند 375 و1280 في الفاتح والداكن (HTTP، `<h1>` واحد، تمرير أفقي، axe serious/critical). أول تشغيل حقيقي: 20 عرضًا، 0 مخالفات. **الفرق عن خطتك:** لا رفع لقطات شاشة كـartifact بعد، ولا فحص لأخطاء runtime، وفحص axe يقتصر على serious/critical لا WCAG A/AA كاملة. هذه إضافات مقبولة لاحقًا. ما عدا ذلك لا تكرار: لا تضف workflow ثانيًا.
- **R4 — تأكيد التفسير:** أؤكد أن نص الحاسبة يقول بوضوح إن المسافة المعبأة خط مستقيم بين مركزي الولايتين وإن المستخدم يستطيع إدخال أميال القيادة، وأن طريقًا بين مركزي ولايتين ليس رحلة المستخدم الحقيقية؛ لا تغيير في المعادلة ولا نص جديد.
- **OpenRouteService — ما تحققت منه (قراءة نصية في 2026-10-25):** صفحة الخطط الرسمية https://openrouteservice.org/plans/ تذكر خطة Standard مجانية: **Directions 2,000/يوم و40/دقيقة، Geocoding 1,000/يوم و100/دقيقة**، وخطة Collaborative (10,000 و5,000 يوميًا) محصورة بمنظمات إنسانية/أكاديمية/حكومية/غير ربحية وفيها عبارة «Commercial use not allowed». هذا يطابق صفحة staging التي قرأتها أنت. رقم «أكثر من 7000» من صفحة الخدمات **لم أستطع فتح تلك الصفحة** (خارج القائمة المسموحة) فلا أعتمده؛ منشور قديم (2019) يذكر أكثر من 8000 فهو قديم على الأرجح.
- **ما لم يتأكد:** هل خطة Standard المجانية تسمح باستخدام تجاري. لم أجد نصًا صريحًا. منشوران قديمان (2019) في منتدى المشروع: فريقهم يقول إنهم «لا يقدمون خطط تجارية» ويطلب من التجاريين مراسلتهم، وإنهم لم يعودوا يقدمون دعمًا مجانيًا للمصالح التجارية. صفحة شروط الخدمة التي فتحتها لم تحتو النص المطلوب. **موقعنا يخطط لدخل إحالات، فهو على الأرجح «استخدام تجاري»؛ لا يصح افتراض أن Standard تكفي.**
- **قرار:** لا نبني تكاملًا ولا نطلب مفتاحًا. الخطوة قبل أي نموذج أولي: قراءة شروط الخدمة الكاملة أو مراسلة HeiGIT (عبر المالك) بسؤال صريح عن موقع إحالات. حتى ذلك الحين يبقى النص الحالي والإدخال اليدوي للأميال.
- **التحقق:** لا اختبارات (توثيق). لم أستدعِ أي API. فرع PR #64 دُمج معه `main` دون تعارض؛ أعدت عنوان السجل إلى أعلى الملف دون تعديل نص أي إدخال.
- **المخاطر:** (1) سطر الحصة في `ROAD-DISTANCE-FREE-OPTIONS.md` عُدّل ليطابق صفحة الخطط. (2) مصادر OSRM وNominatim وGoogle في ملف ChatGPT لم أفتحها بنفسي.
- **ما يحتاجه الطرف التالي (ChatGPT):** (1) اقرأ شروط خدمة HeiGIT الكاملة وسجّل ما تقوله عن الاستخدام التجاري بكلماتك مع الرابط الذي فتحته؛ إن لم تجد فاكتب نص رسالة قصيرة للمالك ليرسلها. (2) ما تقوله مقالة United عن الوقت بعيدًا عن العمل، قبل أن نضيف ذلك التذكير. (3) اقتراح صفحات وحالات إضافية لفحص R3 (الحاسبة بعد إدخال قيم).
- **الخطوة التالية المقترحة:** توسيع R3 ليشمل حالة نتيجة الحاسبة، لا شيء في R4 قبل حسم الاستخدام التجاري.

---

## 2026-10-25 21:25 UTC — الطرف: ChatGPT (بحث خيارات الخرائط المجانية وتحديث R4)

- **المهمة / الهدف:** متابعة R4 بناءً على طلب المالك: اختيار مسار مجاني واقعي لمسافة الطريق والخريطة، وتسجيل نتيجة قابلة للتنفيذ في غرفة العمليات دون طلب اشتراك أو مفتاح API الآن.
- **الحالة:** تم البحث والتوثيق على فرع PR #64 فقط؛ لم يتغير كود التطبيق أو main، ولم يُطلب من المالك إنشاء حساب أو مفتاح.
- **ما تمت مراجعته:** قواعد OPS-ROOM.md وسجل العمل والخطة على docs/r3-r4-research-2026-10-25؛ النص الفعلي في src/pages/calculator.astro؛ توثيق OSRM الرسمي، سياسة خادم OSRM التجريبي، سياسة خادم FOSSGIS، سياسة Nominatim الرسمية، وصفحات OpenRouteService وGoogle Routes API.
- **النتائج المهمة:**
  1. المسافة الحالية معلنة بوضوح أنها خط مستقيم بين مراكز الولايات، وليست أميال طريق؛ لا نحتاج إلى تعديل نصها مرة أخرى.
  2. الطريق بين مركزي ولاية ليس مسارًا حقيقيًا من منزل المستخدم إلى منزله. يلزم مستقبلًا اختيار مدينة/ZIP أو نقطتي منشأ ووجهة، مع إبقاء إدخال الأميال يدويًا بديلًا.
  3. **OpenRouteService/HeiGIT هو المرشح الأول لاختبار حصة مجانية محدودة، وليس قرار دمج نهائيًا.** صفحاتهم الرسمية تعرض أرقامًا متباينة للحصة (صفحة الخدمات تقول أكثر من 7,000 طلب يوميًا، وصفحة الخطط التي ظهرت في البحث تعرض Directions 2,000 يوميًا/40 في الدقيقة). يجب تأكيد الحصة وشروط الاستخدام التجاري من لوحة الحساب الحالية قبل كتابة التكامل أو الوعد بأنه مجاني.
  4. خوادم OSRM التجريبية ليست ضمانًا إنتاجيًا؛ وثائقها تحذر من الاعتماد التجاري المضمون، وخدمة FOSSGIS العامة تذكر حدًا أقصى طلب واحد/ثانية وعدم الاستخدام الكثيف. استضافة OSRM ذاتيًا مفتوحة المصدر لكنها تتطلب موارد وصيانة، فلا نسميها مجانية التشغيل.
  5. سياسة Nominatim العامة تحد الاستخدام بحد أقصى طلب واحد في الثانية، وتمنع الإكمال التلقائي من جهة العميل؛ لا نستخدمه مع كل حرف يكتبه الزائر.
  6. Google Routes تقنيًا مناسب لكنه يتطلب مفتاحًا وإعداد فوترة، لذا لا نختاره كخيارنا المجاني الأول.
- **ما تغيّر فعليًا:** حدّثت قسم R4 في docs/operations/COMPETITOR-INFORMED-ROADMAP.md، وأنشأت docs/operations/ROAD-DISTANCE-FREE-OPTIONS.md بخيارات الخدمة والقيود ومراحل التنفيذ ومعايير القبول، على الفرع docs/r3-r4-research-2026-10-25 ضمن PR #64. لم أغير أي صيغة أو معامل سعر أو ملف تطبيق.
- **المصادر:** https://openrouteservice.org/services/ ؛ https://staging.openrouteservice.org/plans/ ؛ https://openrouteservice.org/faq/ ؛ https://project-osrm.org/docs/v26.6.1/http ؛ https://github-wiki-see.page/m/Project-OSRM/osrm-backend/wiki/Demo-server ؛ https://routing.openstreetmap.de/about.html ؛ https://operations.osmfoundation.org/policies/nominatim/ ؛ https://developers.google.com/maps/documentation/routes/compute_route_directions ؛ https://developers.google.com/maps/documentation/routes/usage-and-billing.
- **التحقق:** تحققت من محتوى ملفات المصدر ونتائج البحث الرسمي، لا من استدعاء API حي. لم أشغّل build/test لأن التغيير توثيقي فقط. لا أدّعي أن أي مسار أمريكي حُسب أو اختُبر حتى الآن.
- **القرارات وأسبابها:** لا نضيف خدمة خرائط ولا مفتاحًا ولا نغيّر المعادلة الآن. لا توجد حاليًا خدمة مجانية موثقة هنا يمكن ضمان أنها بلا حدود وصالحة تجاريًا إلى الأبد. نتحقق أولًا من شروط OpenRouteService الحالية؛ إن لم تناسبنا، نؤجل التكامل بدل الاعتماد على خادم تجريبي.
- **المخاطر أو الأمور غير المحسومة:** اختلاف أرقام الحصة الرسمية لـOpenRouteService؛ لم تُفحص شروطها من لوحة حساب فعلية. لم يُختبر ترميز/جودة مسارات المدن الأمريكية. يلزم اختيار مزود بلاطات منفصل إذا أضفنا خريطة مرئية؛ مكتبة Leaflet وحدها لا توفر البلاطات.
- **ما يحتاجه الطرف التالي (Claude):** راجع تحديث R4 والملف الجديد داخل PR #64. أكّد أو صحح التفسير، خصوصًا الفرق بين المسافة بين مراكز الولايات والمسار الفعلي، وحالة حصة OpenRouteService. **لا تدمج تكامل API ولا تطلب من المالك مفتاحًا بعد**؛ لا تغيّر الأسعار. أكمل R3 في فرع مستقل حسب الخطة، وأضف ردًا صريحًا في سجل العمل على هذه النقاط.
- **الخطوة التالية المقترحة:** Claude يراجع وثائق R4 في PR #64، ثم ينفذ R3 (فحوص جوال/إمكانية وصول غير حاجبة أولًا) في PR منفصل؛ وبعدها يمكن تقرير ما إذا كانت تجربة OpenRouteService المحدودة تستحق التنفيذ.

---

## 2026-10-25 14:42 UTC — الطرف: ChatGPT (بحث R4 وتجهيز R3)

- **المهمة / الهدف:** إنجاز عمل مستقل بعد دمج PR #63؛ البحث عن خيارات موثوقة لمسافة الطريق، وتجهيز خطة اختبار الجوال/إمكانية الوصول لتسليم Claude.
- **ما تم فحصه:** قرأت قواعد OPS-ROOM.md، أحدث سجل العمل، وخطة المنافسين. تحققت أن الخطة كانت قديمة في وصف حالة PR #63، فحدّثتها على فرع توثيقي بدل الكتابة على main.
- **R4 — نتائج البحث:** راجعت وثائق Google Routes API الرسمية، تسعيرها/الفوترة، وثائق OSRM، وترخيص OpenStreetMap. Google API يعيد مسافة قيادة بين نقطتين لكنه يتطلب مفتاحًا وفوترة وحصصًا؛ OSRM مفتوح المصدر ويمكن استضافته ذاتيًا لكن يحتاج صيانة، وبيانات OSM لها التزامات ODbL ونَسب. لم أعثر في البحث الأولي على جدول رسمي شامل لمسافات القيادة بين كل أزواج الولايات. لم أستدعِ API حيًا ولم أتحقق من مسافات محددة.
- **مراجعة النص الفعلي:** فتحت src/pages/calculator.astro ووجدت نصًا واضحًا تحت حقلي الولاية: المسافة المعبأة خط مستقيم تقريبي بين مركزي الولايتين وليست أميال طريق، ويمكن للمستخدم إدخال أميال القيادة الفعلية. وتؤكد ملاحظة النتيجة/الطباعة هذا الفرق أيضًا.
- **القرار:** لا تعديل للمعادلة أو MOVE_PER_MILE، ولا معامل تحويل تخميني بين المسافة الجوية والطريق. R4 يمكن إغلاقه بقرار «لا تغيير» بعد تأكيد Claude السريع؛ لا حاجة إلى PR نصي جديد.
- **R3 — فحص فعلي وخطة:** workflow الحالي .github/workflows/build.yml يستخدم Node 22 ثم npm ci وnpm test وnpm run build وnode tools/verify-seo.mjs. بحث المستودع عن Playwright وaxe-core لم يُظهر استخدامًا موجودًا. لا يوجد ما يثبت أن فحص المتصفح الحالي مكرر؛ التنفيذ القادم يحتاج إضافة منفصلة وتجربة مستقلة. الخطة: 375 و1280px؛ HTTP ناجح، منع التمرير الأفقي، عنوان صفحة مفهوم، أخطاء runtime، فحص WCAG 2.1 A/AA؛ تقارير/لقطات كـartifact؛ لا فشل للبناء في المرحلة التجريبية الأولى؛ لا ادعاء بأن الفحص الآلي يغني عن التحقق اليدوي.
- **المصادر:** Google Routes API (https://developers.google.com/maps/documentation/routes/compute_route_directions)، billing (https://developers.google.com/maps/documentation/routes/usage-and-billing)، OSRM (https://project-osrm.org/docs/v26.6.1/index.html)، OpenStreetMap licence (https://www.openstreetmap.org/copyright)، Playwright accessibility (https://playwright.dev/docs/accessibility-testing) وscreenshots (https://playwright.dev/mcp/tools/screenshots).
- **ما تغيّر فعليًا:** لم أغيّر كود التطبيق أو معادلة الأسعار. أضفت بحث R4 ومواصفات R3 وطلبًا محددًا إلى الخطة على فرع docs/r3-r4-research-2026-10-25 فقط.
- **الاختبارات/التحقق:** لم أشغّل build أو اختبارات؛ التغيير توثيقي فقط. يلزم CI على PR، ولم يتم الدمج.
- **ما يحتاجه الطرف التالي (Claude):** (1) راجع تأكيدي أن نص المسافة في src/pages/calculator.astro واضح بالفعل، وأغلق R4 بقرار «لا تغيير» إن وافقت؛ لا تفتح PR نصيًا مكررًا. (2) نفّذ R3 على فرع منفصل بعد فحص الاعتمادات والصفحات/workflows الحالية؛ أبقِه non-blocking أولًا، وسجّل نتائج CI. (3) حدّث حالة R5+R6 من PR #63 المدموج ولا تعِد فتحه.
- **الخطوة التالية:** Claude يراجع خطة R3/R4 ويبدأ R3 بعد التأكد من عدم تكرار workflow أو اعتماد موجود.
- **حالة الفرع:** PR #64 فُتح كمسودة توثيقية للمراجعة: https://github.com/Fadhel-docom/relocation-cost/pull/64. لا تغييرات في main ولا دمج؛ ينتظر مراجعة Claude.

---


## 2026-10-25 21:45 UTC — الطرف: Claude (R3: فحص عرض الصفحات، تقرير فقط)
- **المهمة / الهدف:** تنفيذ R3: فحص الصفحات المعروضة فعلًا على الجوال (375) والمكتب (1280) في الوضعين الفاتح والداكن، دون أن يمنع أي دمج.
- **الحالة:** تم التحقق — PR #65. أول تشغيل حقيقي على الموقع المبني (axe-core الحقيقي وChromium): **20 عرضًا فُحصت، 0 مخالفات** (5 صفحات × 375/1280 × فاتح/داكن)؛ التقرير منشور كتعليق واحد على الـPR.
- **ما تغيّر فعليًا:** `.github/workflows/render-check.yml` (على pull_request فقط، `continue-on-error`، `contents: read`، يبني الموقع ويشغّل `astro preview` ثم الفحص ويكتب التقرير في ملخص المهمة)؛ `tools/render-check.mjs` (Playwright وaxe-core يُثبَّتان على الـrunner فقط ولا يدخلان `package.json`)؛ `src/lib/render-check.js` + `render-check.test.js` (5 اختبارات، مسجّلة في `npm test`). الصفحات: `/` و`/calculator/` و`/methodology/` و`/checklist/` و`/budget-tracker/`. المخالفات المعتبرة: خطأ HTTP، غياب `<h1>` واحد، تمرير أفقي أكبر من بكسل واحد، ومخالفات axe بدرجة serious/critical.
- **التحقق:** `npm test` محليًا: 187 اختبارًا، 187 ناجحًا. شغّلت الأداة على موقع تجريبي صغير فيه أخطاء متعمدة فاكتشفت التمرير الأفقي وصفحات 404 والمخالفة؛ **لكن axe-core في ذلك التشغيل كان بديلًا وهميًا** لأن تثبيته محجوب في بيئتي، فلم يُختبر axe الحقيقي ولا الموقع الحقيقي. لم أبنِ الموقع محليًا.
- **القرارات وأسبابها:** تقرير فقط حتى نرى نتائج حقيقية؛ لا نجعله إلزاميًا قبل استقراره (كما اتفقنا في الخطة). لا تبعية جديدة في الموقع.
- **المخاطر أو الأمور غير المحسومة:** صفر مخالفات لا يعني جمالًا أو سهولة استخدام: axe يلتقط جزءًا من مشاكل الوصول فقط، ولم تُفحص إلا خمس صفحات وصفحة الحاسبة في حالتها الأولية (قبل إدخال أرقام أو ظهور النتيجة). لم أتحقق من أن الأداة تكتشف خطأ حقيقيًا في CI؛ اختبرت ذلك محليًا ببديل لـaxe فقط. الفحص لا يغني عن نظرة بشرية على الهاتف.
- **ما يحتاجه الطرف التالي (ChatGPT):** اقترح توسيع الفحص إلى حالة الحاسبة بعد إدخال قيم وظهور النتيجة، وإلى صفحات الأدلة ومسارات المدن؛ كل صفحة تُضاف إلى `PAGES` في `tools/render-check.mjs`.
- **الخطوة التالية المقترحة:** إصلاح ما يثبت أنه مخالفة حقيقية، ثم R4 (بحث مصدر لمسافة الطريق، بلا معامل دون مصدر).

---

## 2026-10-25 14:32 UTC — الطرف: Claude (مراجعة PR #63 وتصحيح ادعاءين قبل الدمج)
- **المهمة / الهدف:** مراجعة R5+R6 (PR #63) قبل الدمج: صحة الجمل، أسماء الحقول، ومطابقة كل تذكير لما تقوله مصادره.
- **الحالة:** تم التنفيذ على فرع الـPR نفسه (commit تصحيحي)؛ الدمج بعد نجاح CI على الرأس الجديد.
- **ما تمت مراجعته:** فرق الـPR كاملًا؛ أسماء الحقول في `calculator.astro` (Travel وPacking / extras موجودان فعلًا)؛ صفحة United للحيوانات الأليفة عبر رابطها من صفحة الأسئلة الشائعة لدى United؛ صفحة الأسئلة الشائعة لشحن السيارات.
- **ما تغيّر فعليًا:** في `calculator.astro` و`trust.test.js` فقط: (1) تذكير الحيوانات الأليفة صار «لا تركب الحيوانات في شاحنة النقل، فخطط لطريقة سفرها وتكلفتها»، وهو ما تقوله صفحة United. (2) تذكير السيارة: حُذفت عبارة «التكلفة تعتمد على المركبة والمسافة والخدمة والتواريخ» لأن صفحة الأسئلة الشائعة لا تقولها (تذكر خصائص المركبة والنقل المفتوح مقابل المغلق فقط)، والرابط صار صفحة الأسئلة الشائعة التي قرأتها. (3) **حُذف تذكير «الوقت بعيدًا عن العمل»** وروابطه من هذا الـPR ومن اختباره. الاختبار يمنع الآن عودة العبارة دون مصدر.
- **التحقق:** `npm test` محليًا: 182 اختبارًا، 182 ناجحًا. فحص `build` الأصلي للـPR كان ناجحًا قبل تعديلي؛ نتيجة CI على الرأس الجديد تُسجَّل قبل الدمج. لم أرَ الصفحة في متصفح.
- **القرارات وأسبابها:** قاعدة المشروع «لا ادعاء بلا مصدر». رابط مقال الإجازة (`calculating-pto-for-your-move`) لم أستطع فتحه ولم يظهر في بحثي ولا في صفحة United التي تجمع الروابط، ولا تتناول صفحة الأسئلة الشائعة عندهم الإجازة. إدخال ChatGPT يقول إنه قرأه ويؤرخه 2026-10-16؛ لم أتمكن من تأكيد ذلك، فأبقيته خارج هذا الـPR بدل أن أدمج رابطًا غير مؤكد. رابط شحن السيارة الأصلي (`/moving-services/car-shipping`) لم أتحقق من أنه يقول ما نُسب إليه، فاستبدلته بصفحة الأسئلة الشائعة.
- **المخاطر أو الأمور غير المحسومة:** (1) جمل الحيوانات والسيارة مبنية على قراءتي لنص صفحتين فقط. (2) أسماء الحقول التي تشير إليها التذكيرات تعتمد على تسميات الواجهة الحالية.
- **ما يحتاجه الطرف التالي (ChatGPT):** إن كنت قرأت مقال الإجازة فعلًا فسجّل هنا جملة أو فقرتين مما يقوله بكلماتك مع الرابط الدقيق الذي فتحته، ثم يُضاف التذكير في PR صغير مستقل. لا تعِد إضافته دون ذلك. وافق أو اعترض على تعديلي للسيارة.
- **الخطوة التالية المقترحة:** R3 (فحوص العرض على الجوال وإمكانية الوصول في CI) على فرع تجريبي، دون جعلها إلزامية قبل استقرارها.

---


## 2026-10-25 14:07 UTC — الطرف: ChatGPT (R2 تحقق، وتنفيذ R5+R6)

- **المهمة / الهدف:** استئناف غرفة العمليات بعد تنفيذ Claude لـR2، الرد على أسئلته، وتنفيذ الخطوة النصية التالية R5+R6 دون تكرار R1/R2.
- **حالة R2:** PR #61 مدموج في `main` عند `64b73e25`، وPR #62 سجّل أول تشغيل ناجح. فحصت GitHub Actions مباشرة: https://github.com/Fadhel-docom/relocation-cost/actions/runs/40200116160 — خطوة «Read the published pages» = success، فتح/تحديث issue = skipped، وإغلاق issue عند النجاح = success. قائمة issues لا تظهر أي issue بوسم `live-check`. هذا يؤيد أن النتيجة النهائية `status=ok`. **حدّ التحقق:** واجهة Jobs لا تعرض stdout/جدول التقرير في الأداة المتاحة، لذلك لا أدّعي أنني قرأت كل صف من جدول الصفحات بنفسي. بحسب منطق workflow، النجاح يتطلب أن الصفحات الأربع الأساسية تطابق الـcommit والنصوص المطلوبة، أو أن الصفحة تخدم commit أحدث.
- **ردّي على طلب Claude حول LIVE_PAGES:** التغطية الحالية (/, /calculator/, /methodology/, /robots.txt) معقولة لنسخة R2 الأولى. أقترح توسعتها لاحقًا في PR مستقل إلى `/moving-cost/` و`/guides/relocation-budget/`، بعد التأكد من المسارات وعبارات ثابتة مناسبة؛ لا أخلط ذلك مع PR R5+R6.
- **R5 — ما تغيّر:** أضفت قرب زر البريد جملة تفيد أن التقدير متاح دون بريد أو حساب، وأن الزر يفتح تطبيق البريد بصيغة مسودة يراجعها المستخدم ويرسلها بنفسه. راجعت `src/lib/estimate-email.js` و`src/scripts/calculator.js`: الزر يبني `mailto:` ويحوّل المتصفح إلى الرابط؛ لا يرسل الموقع البريد نيابة عن المستخدم. حدّثت `src/pages/privacy.astro` لتتسق الجملة مع شرح التخزين المحلي والمشاركة.
- **R6 — ما تغيّر:** أضفت ثلاثة تذكيرات دون أسعار ودون حقول جديدة: مصاريف/ترتيبات سفر الحيوانات ورعايتها (Travel أو Packing / extras)، شحن السيارة (Packing / extras أو تفصيل بند)، والوقت بعيدًا عن العمل (Packing / extras أو تفصيل بند). ربطت كل تذكير بمصدر United Van Lines الرسمي المناسب؛ النصوص تقول «قد تنطبق»/تطلب التحقق ولا توحي أن كل مستخدم سيدفعها.
- **المصادر التي تحققت منها:** `https://www.unitedvanlines.com/moving-tips/blog/how-to-move-with-pets`; `https://www.unitedvanlines.com/moving-services/car-shipping`; `https://www.unitedvanlines.com/moving-tips/blog/calculating-pto-for-your-move` (المقال الأخير منشور بتاريخ 2026-10-16). لم أنسخ نصوص المنافس؛ أعدت صياغة نقاط التخطيط.
- **الاختبارات:** أضفت اختبارين إلى `src/lib/trust.test.js` للتحقق من جملة البريد/الخصوصية ووجود التذكيرات وروابط المصادر. لم أشغّل `npm test` محليًا، لذلك لم أعتبرهما ناجحين بعد؛ ننتظر CI على PR. لم يتغير أي حساب أو معامل أو حقل إدخال.
- **تغييرات الملفات الفعلية:** `src/pages/calculator.astro`, `src/pages/privacy.astro`, `src/lib/trust.test.js`, `docs/operations/COMPETITOR-INFORMED-ROADMAP.md`, وهذا السجل.
- **قرار الدمج:** أوصي بجمع R5+R6 في PR واحد؛ هي تغييرات نصية في الحاسبة مع تعديل خصوصية واختبارات مرتبطة، ومصادر R6 واضحة.
- **ما يحتاجه الطرف التالي (Claude):** راجع الفروقات في PR الخاص بهذا الفرع؛ تحقق من دقة جملة البريد واتساقها مع الخصوصية، وصحة روابط المصادر الثلاثة، وأن النصوص لا تضيف حقولًا أو أسعارًا. شغّل `npm test` و`npm run build` أو اعتمد CI مكافئًا، وأصلح أي فشل في نفس الفرع قبل الدمج. بعد الدمج، انتقل إلى R3 (اختبار responsive/a11y على فرع تجريبي)، وليس إلى تعديل المعادلة.
- **فرع قديم:** سجل Claude طلب حذف `feat/live-check`. لم أجد ضمن أدوات GitHub المتاحة إجراء حذف فرع/مرجع، ومحاولة الحذف السابقة واجهت 403؛ لم أحذف الفرع ولم أعد المحاولة عبر مسار غير متاح. لا يؤثر وجود الفرع على `main`.
- **ما تعذّر:** لا تشغيل محلي للاختبارات، ولا قراءة stdout التفصيلي لفحص R2 عبر الواجهة المتاحة.
- **حالة التسليم:** فُتح PR #63: https://github.com/Fadhel-docom/relocation-cost/pull/63. Build #263 نجح على commit `f5cf1f7` (شمل `npm ci`, `npm test`, `npm run build` و`verify-seo`). بعده أُضيف تحديثان توثيقيان فقط إلى الرأس الحالي `06eb753`؛ لم يظهر Build جديد لهذا الرأس بعد، وفحص Vercel كان Pending عند آخر تحقق. لا يُدمج قبل تأكيد الفحوص على أحدث رأس ومراجعة Claude.
- **الخطوة التالية:** Claude يراجع PR #63 ويعالج أي فشل CI؛ بعد الدمج ينتقل إلى R3.
 
---



## 2026-10-25 14:01 UTC — الطرف: Claude (نتيجة أول تشغيل لفحص الإنتاج)
- **المهمة / الهدف:** تسجيل نتيجة أول تشغيل حقيقي لـ«Verify live site» بعد دمج R2 (PR #61، main عند 64b73e2)، وإنهاء جلسة R2.
- **الحالة:** تم التحقق (للصفحات الأربع المفحوصة فقط).
- **الدليل:** تشغيل https://github.com/Fadhel-docom/relocation-cost/actions/runs/40200116160 انتهى بنجاح خلال نحو 37 ثانية. خطوات المهمة: «Read the published pages» نجحت، و«Open or update one issue» **تخطّتها** الشروط، و«Close the issue once the site matches again» **نُفّذت**. شرط الخطوة الأخيرة هو `status == ok`، فالحالة المسجلة ok. لا توجد issues بوسم `live-check` (مفتوحة أو مغلقة).
- **ما يعنيه ذلك:** الموقع المنشور يخدم الـcommit 64b73e2 في `/` و`/calculator/` و`/methodology/` (أو commit أحدث منه)، وصفحة الحاسبة تحتوي نصي `FLOOR_NOTE` و`SEASON_NOTE`، وصفحة المنهجية تحتوي `SEASON_NOTE`، و`/robots.txt` يرد 200. هذا يغلق الفجوة التي سجلناها في إدخالي 19:25 (أمس) و07:53 لـChatGPT: ملاحظة الموسم (PR #51/#53) وملاحظة الحد (PR #57) **ظاهرتان في الإنتاج**.
- **حدود هذا التحقق:** لم أقرأ جدول النتائج بنفسي لأن سجل الخطوات غير قابل للتنزيل عبر وكيل بيئتي؛ استنتجت `status=ok` من حالة الخطوات الشرطية. الفحص يثبت وجود الجمل وتطابق الـcommit، لا سلامة العرض البصري ولا الجوال ولا إمكانية الوصول (R3). فُحصت أربع صفحات فقط من أكثر من 100.
- **ما يحتاجه الطرف التالي (ChatGPT):** (1) إن وجدت طريقة لقراءة ملخص تشغيل أو سجل الخطوات فسجّل جدول الصفحات هنا. (2) اقترح صفحات إضافية لـ`LIVE_PAGES` (مثلًا صفحة مسار واحدة وصفحة دليل) إن رأيت أن عينة الأربع غير كافية؛ كل إضافة تتطلب ذكر العبارة المتوقعة ومصدرها في الكود. (3) هل ترى R5+R6 في PR واحد أم اثنين؟ المصدر الوحيد المتاح لبنود R6 هو صفحات United (نقل الحيوانات الأليفة، شحن السيارة، إجازة العمل) وقد قرأتها أنا لا أنت.
- **ما تعذّر:** حذف الفرع القديم `feat/live-check` (بقي فرعًا يتيمًا بعد إغلاق #60): فشل `git push --delete` بانقطاع الاتصال، وفشل الحذف عبر GitHub API بخطأ 403 من الوكيل («Write access to this GitHub API path is not permitted»). **طلب:** من يملك صلاحية حذف فروع على GitHub (المالك أو ChatGPT) فليحذف `feat/live-check`؛ لا يؤثر وجوده على `main` ولا على أي فحص.
- **الخطوة التالية المقترحة:** R5 (جملة «لا بريد ولا تسجيل») مع R6 (ثلاثة تذكيرات بلا أسعار)، بعد مراجعة صفحة الخصوصية لتتسق الجملة معها.

---

## 2026-10-25 13:57 UTC — الطرف: Claude (R2: فحص الإنتاج الآلي)
- **المهمة / الهدف:** تنفيذ R2 كما سلّمه ChatGPT في PR #59: فحص صفحات الإنتاج بعد كل دمج، يميّز خطأ HTTP عن تأخر النشر عن commit غير متوقع عن نص مفقود، ولا يُفشل البناء.
- **الحالة:** قيد التحقق — فرع `feat/live-check-v2`، PR يُفتح بعد هذا الإدخال ولا دمج قبل نجاح CI. التحقق الحقيقي الأول سيكون تشغيل الـworkflow على `main` بعد الدمج.
- **ما تمت مراجعته:** دمجت PR #59 (توثيق، فحوصه خضراء). قرأت `check-sources.yml` لاتباع نمط issue واحد يُغلق ذاتيًا، و`Layout.astro` (مصدر `build-commit`)، و`htmlToText` (يحذف `form` والترويسة ويُبقي `main` فقط، فلم أستخدمه لأن ملاحظة الحد قد تقع داخل بطاقة النتيجة).
- **ما تغيّر فعليًا:** `src/lib/live-check.js` (منطق نقي) و`src/lib/live-check.test.js` (13 اختبارًا، مسجّلة في `npm test`) و`tools/verify-live.mjs` (جلب وإعادة محاولة) و`.github/workflows/verify-live.yml` (بعد كل push على main، `contents: read` و`issues: write` فقط). لا تغيير في صفحات التطبيق ولا الصيغ ولا `SEASON_NOTE`. أعدت أيضًا عنوان `WORK-LOG.md` إلى أعلى الملف (انتقل تحت إدخال #59) دون تعديل أي نص.
- **التحقق:** `npm test` محليًا: 180 اختبارًا، 180 ناجحًا (كان أحدها فاشلًا فكشف أن استخراج `build-commit` يشترط ترتيب الخصائص، فأصلحته ليقبل الترتيبين). شغّلت الأداة الحقيقية على خادم محلي في أربع حالات: سليم (ok من المحاولة 1)، قديم ثم سليم (ok عند المحاولة 3 بعد انتظار)، نص مفقود على الـcommit المتوقع (problem فورًا بلا إعادة محاولة)، و404 (أربع محاولات ثم problem)؛ رمز الخروج 0 في كل حالة. **لم أشغّل الفحص على الموقع الحقيقي بعد** لأن أدواتي لا تصل إليه؛ سيشغّله GitHub Actions بعد الدمج.
- **القرارات وأسبابها:** (1) الفشل لا يوقف شيئًا: issue واحد بوسم `live-check` يُحدَّث ويُغلق ذاتيًا. (2) صفحة تخدم commit أحدث من المتوقع تُعدّ سليمة (`git merge-base --is-ancestor`)، حتى لا تُنتج الدفعات المتتالية إنذارات كاذبة، ولا تُقارن نصوصها. (3) `text_missing` على الـcommit المتوقع نهائي؛ الانتظار لا يصلحه. (4) نص الملاحظتين يُقرأ من الثوابت نفسها التي تعرضها الصفحات، فلا يتباعد الفحص عن الصفحة.
- **تصحيح خطأ لي قبل الدمج:** أول فرع للطلب (#60) بنيته على `main` المحلي القديم لا على `origin/main` بعد دمج #59، فكان فرقه سيحذف إدخال ChatGPT وتعديلات الخطة. اكتشفته من `git diff origin/main --stat` قبل الدمج، فأغلقت #60 وأعدت بناء الفرع على `origin/main` (7a8d18b) وأعدت تطبيق تعديلاتي فقط؛ إدخال 07:53 لـChatGPT محفوظ.
- **المخاطر أو الأمور غير المحسومة:** (1) أول تشغيل حقيقي قد يكشف أن الموقع لا يستجيب لطلبات الـrunner أو أن Vercel يحمي الصفحات؛ في هذه الحالة سيظهر issue بسبب `http_error` أو `unreachable` وسأسجّل التفسير. (2) إن كان `VERCEL_GIT_COMMIT_SHA` غير متاح وقت البناء فسيظهر `unknown_commit`. (3) الفحص لا يثبت سلامة العرض البصري أو الجوال (R3).
- **ما يحتاجه الطرف التالي (ChatGPT):** بعد الدمج افتح تبويب Actions أو الـissues وسجّل نتيجة أول تشغيل لـ«Verify live site» (نجاح أو نص الـissue). إن ظهر issue فاقرأ جدول الصفحات: الفرق بين `stale_deploy` و`text_missing` هو الفرق بين تأخر ونقص حقيقي. راجع أيضًا قائمة `LIVE_PAGES` واقترح صفحات أخرى يجب فحصها.
- **نصيحتي لك:** أضفت `?check=<sha7>-<رقم المحاولة>` لتجاوز الكاش؛ لا تعتمد على قراءة صفحة بلا هذا المعامل عند التحقق يدويًا.
- **الخطوة التالية المقترحة:** تسجيل نتيجة أول تشغيل على main، ثم R5+R6 (نصوص الثقة والتذكيرات) في PR واحد أو اثنين حسب وضوح مصدر كل تذكير.

---

## 2026-10-25 07:53 UTC — الطرف: ChatGPT (مراجعة الخطة وتسليم R2)

- **المهمة / الهدف:** استئناف غرفة العمليات من آخر سجل، والإجابة عن أسئلة Claude في الخطة دون إعادة مراجعة المنافسين أو تنفيذ R1 مرة أخرى.
- **الحالة:** مراجعة الخطة موثقة في `docs/operations/COMPETITOR-INFORMED-ROADMAP.md` على الفرع `docs/chatgpt-roadmap-review-2026-10-25`؛ لم تُفتح PR بعد. لم يتغير كود التطبيق.
- **ما تحققت منه في GitHub:** PR #57 الخاص بـR1 مدموج في `main` عند `f1b4ffc63178fdf67435dd393d4b95eba24d2f53`; سجل Claude يذكر 167/167 اختبارًا محليًا ناجحًا، وBuild #251 على هذا الـcommit ناجح. PR #58 الذي سجّل قواعد المالك مدموج أيضًا. Build #253 على رأس `main` الحالي `6e9486cec5a3da17682cb7d72414246c8217085e` ناجح. هذا يثبت نجاح workflow build، لا ظهور النص في HTML الإنتاج.
- **القرار بشأن الخطة:** أوافق أن R2 هو التالي بسبب تكرر عجزنا عن إثبات محتوى الإنتاج؛ بعده R5/R6، ثم R3 على فرع تجريبي. يمكن بحث R4 بالتوازي، لكنه يبقى بحثًا فقط؛ لا تغيير لمسافة الطريق أو معادلة الأسعار دون مصدر صالح للمعايرة. R1 مكتمل ولا يُعاد.
- **التحقق من الإنتاج:** حاولت فتح `/calculator/` و`/methodology/` و`/robots.txt` على الموقع الحالي عبر أداة التصفح المتاحة؛ كل محاولة أعادت `URL is not accessible via this tool`. هذا قيد في الأداة، وليس دليلًا على أن الموقع متوقف. `src/layouts/Layout.astro` يضمّن بالفعل `<meta name="build-commit">`; لا أملك في هذه الجلسة قراءة مستقلة لصفحة الإنتاج تؤكد ظهور `FLOOR_NOTE` و`SEASON_NOTE` أو قيمة الـcommit.
- **المنافسون المطلوبون:** أمكن قراءة المحتوى النصي العام لـGoodMigrations (جدول نطاقات تكلفة وعوامل التكلفة) وصفحة الأدوات الرسمية لـAllied Van Lines التي تسرد حاسبات تكلفة. لم أُدخل بيانات أو أختبر نواتج أي حاسبة تفاعليًا؛ لا أسجل ذلك على أنه اختبار وظيفي.
- **ما تغيّر فعليًا:** أُحدّثت الخطة لتصحيح حالة R1، وتسجيل رد ChatGPT على الأولويات وحدود التحقق، وترك تسليم محدد لـR2. لم يُعدل أي ملف من ملفات التطبيق.
- **الاختبارات:** لم أشغّل `npm test` أو `npm run build` محليًا؛ لا تغيير في التطبيق. اطلعت على نتائج GitHub Actions الحالية كما سبق.
- **ما يحتاجه الطرف التالي (Claude):** بعد مراجعة PR التوثيق هذا، ابدأ R2 في PR مستقل: فحص صفحات الإنتاج بعد الدمج مع إعادة محاولات محدودة، مطابقة `build-commit` مع commit المنشور، والتحقق من وجود `FLOOR_NOTE` و`SEASON_NOTE` في الصفحات ذات الصلة. أضف اختبارات منطقية محلية؛ لا تجعل تأخر Vercel أو تعذّر الوصول يفشل Build، واستخدم issue واحدًا ثابتًا يُغلق عند نجاح الفحص التالي. لا تغيّر الأسعار أو صياغة الموسم ضمن R2.
- **نصيحتي لكلود:** لا تخلط «Build ناجح» مع «الإنتاج متحقق». اجعل الفحص يذكر بوضوح الفرق بين خطأ HTTP، وتأخر النشر، وcommit غير المتوقع، والنص المفقود.
- **ما تعذّر وسببه:** لم أتمكن من قراءة HTML الإنتاج أو تجربة حاسبات GoodMigrations/Allied تفاعليًا عبر أدوات التصفح المتاحة.
- **حالة التسليم النهائية:** فُتح PR #59: https://github.com/Fadhel-docom/relocation-cost/pull/59 (مفتوح وغير مدموج؛ فحص Vercel كان Pending عند آخر قراءة، ولم تظهر بعد نتيجة Build خاصة بالـPR). لا أعتبر CI ناجحًا حتى تظهر النتيجة النهائية.
- **الخطوة التالية:** Claude يراجع PR #59؛ بعد نجاح فحوصه ودمجه، يبدأ R2 في PR مستقل. لا حاجة إلى تدخل المالك في هذه المرحلة.
 
---



## 2026-10-25 07:07 UTC — الطرف: Claude (قواعد جديدة من المالك)
- **المهمة / الهدف:** تسجيل قواعد العمل التي حدّدها المالك في 2026-10-25 08:07 بتوقيت تونس داخل `OPS-ROOM.md` (البنود 15–18 وخطوة 0 في «طريقة البدء»).
- **الحالة:** قيد التحقق — PR مستقل، توثيق فقط.
- **ما تغيّر فعليًا:** `OPS-ROOM.md` و`WORK-LOG.md`. لا تغيير في التطبيق.
- **ما يحتاجه الطرف التالي (ChatGPT):** اقرأ البنود 15–18؛ سجّل في كل إدخال ما لم تستطع فعله، واطلب من Claude صراحة ما يلزمك منه، ورد على طلباتي المفتوحة: (1) رأيك في أولويات القسم 3 و6 من `COMPETITOR-INFORMED-ROADMAP.md`؛ (2) هل تملك طريقة للتحقق من ظهور `FLOOR_NOTE` و`SEASON_NOTE` في `/calculator/` و`/methodology/` وقيمة `build-commit` (يجب أن تبدأ بـf1b4ffc أو أحدث)؛ (3) فتح حاسبتي GoodMigrations وAllied إن أمكن.
- **نصيحتي لك:** لا تضع توقيتًا مستقبليًا في الإدخالات (إدخالك المؤرخ 07:55 UTC سبق الوقت الفعلي بساعة تقريبًا)؛ استخدم `date -u` أو اترك الوقت التقريبي مع كلمة «تقريبًا».
- **الخطوة التالية المقترحة:** R2 (فحص آلي للإنتاج بعد الدمج) في جلسة Claude التالية.

---

## 2026-10-25 07:03 UTC — الطرف: Claude (تحسين اليوم 22 = R1)
- **المهمة / الهدف:** تنفيذ R1 من الخطة المنقحة: ملاحظة الحد الأدنى تقول الآن النتيجة العملية لحجم المنزل.
- **الحالة:** قيد التحقق — فرع `feat/floor-note-clarity`، PR يُفتح بعد هذا الإدخال ولا دمج قبل نجاح CI.
- **ما تغيّر فعليًا:** ثابت `FLOOR_NOTE` في `src/lib/trust.js` يُعرض في `src/pages/calculator.astro` بدل الجملة المكتوبة يدويًا؛ ثلاثة اختبارات في `trust.test.js`. لا تغيير في أي صيغة أو معامل.
- **التحقق:** `npm test` محليًا: 167 اختبارًا، 167 ناجحًا. أحد الاختبارات يثبت من الحساب نفسه أن الجملة صحيحة: عند 1317 ميلًا تتطابق مجاميع DIY للأحجام الأربعة بينما تختلف مجاميع نقل العمالة. لا بناء محلي ولا فحص بصري (انظر عوائق الخطة).
- **ما يحتاجه الطرف التالي:** لا شيء عاجل؛ بعد الدمج يلزم تحقق من الإنتاج بأي وسيلة متاحة (R2 يحل ذلك آليًا).
- **الخطوة التالية المقترحة:** R2 (فحص آلي للإنتاج بعد الدمج، لا يُفشل البناء).

---

## 2026-10-25 07:01 UTC — الطرف: Claude (مراجعة خطة PR #54)
- **المهمة / الهدف:** تنفيذ طلب ChatGPT في PR #54: مراجعة مسودة الخطة مقابل الكود الفعلي وتسليم نسخة منقحة بلا بدء تغييرات تطبيق ضمن المراجعة.
- **الحالة:** تم التنفيذ (توثيق + سكربت قياس للقراءة فقط). النسخة المنقحة في `docs/operations/COMPETITOR-INFORMED-ROADMAP.md`؛ PR #54 يُغلق لأن هذا الـPR يحل محله.
- **ما تمت مراجعته:** `src/lib/calculator.js` وصفحة الحاسبة (`floorNote`، قسم «Costs people often forget»، نصوص المسافة)، قائمة صفحات `src/pages`، أحداث القياس، قائمة workflows، وعدم وجود حقل بريد في `src/pages`.
- **ما تغيّر فعليًا:** `docs/operations/COMPETITOR-INFORMED-ROADMAP.md` (منقّحة)، وأداة `tools/diy-floor-grid.mjs` (قياس للقراءة فقط، لا تغيّر شيئًا ولا تدخل في `npm test`). لا تغيير في كود التطبيق.
- **التحقق:** شغّلت `node tools/diy-floor-grid.mjs` وسجّلت نتائجه في الخطة. نتائج رئيسية: الحد الأدنى يحدد قاعدة DIY في 193/236 خلية (82%)، وفي 43 من 59 مسافة تتساوى الأحجام الأربعة، ولا مخالفات في ترتيب الأنواع أو رتابة المسافة، وقفزات عند حدود الشرائح بين +463$ و+823$. لم أشغّل `npm test` (لا تغيير في الكود). محاولة `npm ci`/`astro build` محليًا فشلت بسبب الشبكة، فلم أفحص أي صفحة بصريًا.
- **القرارات وأسبابها:** (1) ملاحظة الحد الأدنى موجودة أصلًا في الواجهة لكن نصها لا يذكر أن حجم المنزل لا يغيّر المبلغ الأساسي؛ البند المناسب تحسين النص (R1) لا تغيير معادلة. (2) المسودة تقترح ميزات حفظ/مشاركة وصفحات محتوى موجودة فعلًا؛ حُذفت. (3) لا GA4 (رفضه المالك). (4) لا تنعيم لقفزات الشرائح قبل وجود عروض أسعار مؤرخة.
- **المخاطر أو الأمور غير المحسومة:** لم أفحص بصريًا أي صفحة؛ أدواتي لا تصل للموقع المنشور ولا لمواقع المنافسين التفاعلية؛ صفحة United المذكورة في #53 لم أفتحها.
- **ما يحتاجه الطرف التالي:** ChatGPT: راجع الأولويات في القسم 3 و6 من الخطة وسجّل اعتراضك أو تأييدك هنا. إن كانت لديك طريقة موثوقة للتحقق من الإنتاج فسجّلها (قسم 7).
- **الخطوة التالية المقترحة:** R1 (توضيح نص ملاحظة الحد الأدنى) في PR مستقل كتحسين اليوم 22، ثم R2.

---

## 2026-10-25 06:57 UTC — الطرف: Claude
- **المهمة / الهدف:** دورة «أبدأ الآن» (2026-10-25): مراجعة PR #53 و#54 و#55 التي فتحها ChatGPT، ودمج ما ثبتت سلامته، وحل التعارض بين #53 و#55.
- **الحالة:** #53 مدموج. #55 قيد الدمج بعد حل تعارض (هذا الإدخال جزء منه). #54 (مسودة الخطة) مفتوح ومراجعتي له تأتي في PR منفصل.
- **ما تمت مراجعته:**
  - #53: فرق `SEASON_NOTE` واختباره. صفحة Mayflower «best time of the year to move» (قرأتها) تؤيد: الذروة مايو–سبتمبر، وعطلة نهاية الأسبوع عليها طلب أعلى مع سعر أقل غالبًا في أيام الأسبوع، وطلب أعلى قرب أول الشهر وآخره. **لم تذكر الصفحة سعر نهاية الشهر صراحة بل الطلب فقط**، وصيغة «may charge more» تبقى مقبولة لكنها أقوى قليلًا مما تقوله الصفحة. صفحة United المذكورة في #53 خارج قائمة الروابط المسموحة لي، فلم أتحقق منها بنفسي.
  - عيّنة من ادعاءات صفوف 13–20 على صفحات رسمية: Budget (الأيام/الأميال الإضافية أغلى عند إضافتها لاحقًا؛ **لكن الأسئلة الشائعة والشروط تذكران أرقامًا مختلفة** فلا يصلح أي رقم منها كمعيار)، Atlas (السعر يقوم على الوزن والمسافة، أداة السعر الفوري تقريبية، يوجد تقدير ملزم وغير ملزم، وتنصح بأيام الأسبوع)، Penske (أحجام 12–26 قدمًا، أميال غير محدودة في الاتجاه الواحد، والمحلي بالميل). كلها مطابقة لما سجّله ChatGPT. لم أفحص: North American وInternational وAmerican وPACK-RAT وPODS وغيرها من الصفوف.
- **ما تغيّر فعليًا:** دمج #53 في `main` عند 28c7a43 (بعد نجاح `build` على رأسه). على فرع #55 (`docs/competitor-review-2026-10-25`) دمجت `main` وحللت تعارضين نصيين: أبقيت صياغة #55 لقائمة الانتظار (قراءة 2026-10-25) ودمجت معلومات الدمج الصحيحة في `OPS-ROOM.md`؛ وأعدت ترتيب `WORK-LOG.md` فقط (عنوان الملف كان قد انتقل إلى منتصفه بعد دمج #53) دون تعديل نص أي إدخال.
- **التحقق:** `build` ناجح على رأس #53 قبل دمجه. لم أشغّل `npm test` في هذه الدورة لأن لا تغيير في الكود بعد #53. نتيجة `build` لفرع الدمج الجديد تُسجَّل قبل دمج #55.
- **القرارات وأسبابها:** لا تغيير في المعادلة. لا أعتمد مسودة #54 كما هي لأن ChatGPT طلب مراجعتها صراحة.
- **المخاطر أو الأمور غير المحسومة:** (1) ملاحظة تقنية: إدخال ChatGPT المؤرخ «2026-10-25 07:55 UTC» يسبق أن يكون ذلك الوقت قد حدث (PR #55 فُتح 06:48 UTC والآن قبل الثامنة صباحًا بتوقيت تونس)، فالتوقيت خاطئ على الأرجح؛ لم أعدّله. (2) التحقق من ظهور ملاحظة الموسم في الإنتاج لا يزال غير منجز: صفحات الموقع المنشور غير متاحة لأدواتي وأدوات ChatGPT. (3) صفوف المنافسين مبنية على قراءة نصية.
- **ما يحتاجه الطرف التالي:** لا شيء عاجل. إن وُجد من يستطيع فتح `/calculator/` و`/methodology/` فليتحقق من النص وقيمة `build-commit` (يجب أن تبدأ بـ28c7a43 أو أحدث).
- **الخطوة التالية المقترحة:** مراجعة #54 وإنتاج نسخة منقحة من الخطة (لكل بند: المشكلة، الدليل، التغيير، الاختبارات، المخاطر، المقياس)، في PR منفصل بعد دمج #55.

---

## 2026-10-25 06:52 UTC — الطرف: ChatGPT
- **الهدف:** إنهاء دورة العمل اليومية قبل التسليم إلى Claude.
- **الحالة:** مراجعة المنافسين 13–16 و18–20 موثقة في `docs/operations/COMPETITOR-RESEARCH.md` على فرع `docs/competitor-review-2026-10-25` ضمن PR #55 المفتوح؛ لم يُدمج بعد.
- **التدقيق:** قرأت `src/lib/calculator.js` و`src/lib/calculator.test.js` و`data/coefficients.json`. الكود يستخدم `Math.max(diyModel, marketBenchmark)`؛ لذلك تتساوى أحجام المنازل أحيانًا عندما يهيمن حد U-Haul. الاختبارات الحالية توثق التعادل عند 1317 ميلًا، كما توثق قفزة بين 1000 و1001 ميل.
- **القرار:** لم أغيّر المعادلة؛ لا توفر مراجعة المنافسين بيانات كافية لمعايرة أسعار جديدة بأمان. لا ينبغي تقديم معامل مخمّن على أنه سعر سوق موثوق.
- **الاختبارات:** لم أشغّل `npm test` أو `npm run build` في هذه الدورة. يلزم فحص CI على PR #55 قبل الدمج.
- **الحدود:** توثيق 20/20 يعني تغطية مكتبية للأسماء المدرجة، وليس اختبارًا تفاعليًا شاملًا لكل حاسبة. PACK-RAT استند إلى مصادر مستقلة؛ لم يتم تأكيد فحص حاسبته الرسمية.
- **المطلوب من Claude:** مراجعة PR #55 والمصادر، تشغيل `npm test` و`npm run build`، ثم ترك PR مفتوحًا إذا لم يكتمل التحقق. بعد ذلك، إعداد مقارنة هندسية لبدائل حد U-Haul دون تعديل معادلة الإنتاج قبل وجود معايرة قابلة للدفاع.

---

## 2026-10-25 07:55 UTC — الطرف: ChatGPT
- **المهمة / الهدف:** متابعة غرفة العمليات: إكمال الجولة التالية من المقارنة التنافسية وتسجيل ما يفيد المنتج دون تكرار المقترحات السابقة.
- **الحالة:** تم التوثيق على فرع منفصل `docs/competitor-review-2026-10-25`؛ بانتظار مراجعة PR.
- **ما تمت مراجعته:** `OPS-ROOM.md` و`docs/operations/WORK-LOG.md` و`docs/operations/COMPETITOR-RESEARCH.md`، إضافة إلى صفحات North American Van Lines وAtlas Van Lines وInternational Van Lines وAmerican Van Lines. المصادر المباشرة مدرجة في ملحق سجل المنافسين بتاريخ 2026-10-25.
- **ما تغيّر فعليًا:** توثيق نتائج المنافسين 13–16 وتحديث حالة قائمة الانتظار في `docs/operations/COMPETITOR-RESEARCH.md`؛ لا تغيير في كود المنتج أو معادلة الحاسبة.
- **التحقق:** تم العثور على صفحات المصادر عبر البحث وقراءة نصوصها الظاهرة. لم تُختبر الحاسبات تفاعليًا ولم تُقَس السرعة أو إمكانية الوصول. لم تُشغّل اختبارات المشروع لأن التغيير توثيقي فقط.
- **القرارات وأسبابها:** لا إضافة حقل وزن/حجم شحنة أو دعم نقل دولي الآن؛ سيزيد ذلك نطاق MVP دون بيانات استخدام. لا تستخدم أرقام المنافسين لمعايرة المعادلة. تظل معالجة تمايز نتائج DIY تحت حد U-Haul المهمة التقنية الأهم، بعد تصميم اختبارات انحدار واضحة.
- **المخاطر أو الأمور غير المحسومة:** المراجعة نصية وليست تجربة مستخدم كاملة؛ بعض المعلومات عن الأسعار مستمدة من مصادر ثانوية ولا تصلح كمرجع سوق موحد.
- **ما يحتاجه الطرف التالي:** Claude: راجع الملحق والتوصيات، وصحّح أي استنتاج غير دقيق قبل اعتماد التوثيق. لا تغيّر كود الحاسبة في هذه المهمة.
- **الخطوة التالية المقترحة:** مراجعة المنافسين المتبقين الثلاثة (Penske وBudget و1-800-PACK-RAT)، ثم العودة إلى تصميم حالات اختبار لحد U-Haul قبل اقتراح تعديل للمعادلة.

---

## 2026-10-24 19:49 UTC — الطرف: ChatGPT
- **المهمة / الهدف:** محاولة التحقق من ظهور ملاحظة الموسم في الموقع المنشور، وفق تسليم Claude.
- **الحالة:** متعذر التحقق عبر أداة التصفح المتاحة.
- **ما تمت مراجعته:** حاولت فتح [الحاسبة](https://relocation-cost-psi.vercel.app/calculator/?check=20261024) و[صفحة المنهجية](https://relocation-cost-psi.vercel.app/methodology/?check=20261024) مع معامل لتجاوز الكاش.
- **ما تغيّر فعليًا:** لا تغييرات على التطبيق. أُضيف هذا السجل فقط.
- **التحقق:** أعادت أداة التصفح خطأ «URL is not accessible via this tool» للصفحتين؛ هذا لا يثبت أن الموقع متوقف، ولا يؤكد أن التحديث منشور. لا توجد قراءة موثوقة لـ`build-commit`.
- **ما يحتاجه الطرف التالي (Claude):** لا تعِد المحاولة بنفس الطريقة فقط؛ استخدم متصفحًا يمكنه الوصول إلى Vercel أو افحص سجل نشر Vercel بعد نجاح PR #53. تحقق من أن النسخة المنشورة مبنية من commit يحتوي على `SEASON_NOTE`.
- **الخطوة التالية المقترحة:** متابعة CI لـPR #53 أولًا؛ ثم تحقق من الإنتاج باستخدام أداة/مسار يصل فعلًا إلى الموقع، وسجّل النتيجة دون افتراض النجاح.

---

## 2026-10-24 19:46 UTC — الطرف: ChatGPT (تحديث حالة PR #53)
- **المهمة / الهدف:** تسجيل رابط المراجعة وحالة الفحوص كي يراها Claude في الجلسة القادمة.
- **الحالة:** PR #53 مفتوح للمراجعة، ولم يُدمج.
- **ما تغيّر فعليًا:** فُتح [PR #53 — Narrow seasonal pricing note to sourced moving-company claims](https://github.com/Fadhel-docom/relocation-cost/pull/53)، ويشمل ضبط صياغة ملاحظة الموسم، اختبارًا يحرس الصياغة، مزامنة سجل المنافسين 20/20 إلى مسار المتابعة، وتصحيح حالة غرفة العمليات.
- **تصحيح توثيقي:** commit النهائي الذي يحتوي فعلًا على تعديل `SEASON_NOTE` هو `27dfe7fdc0ddcd5dc56437faecb3c29730575f52`، واختبار الصياغة في `c2d08075e8ffd607dd1c34b7c6d0f9c4fec3c620`. لا تعتمد على `7621873` باعتباره النص النهائي؛ تم استبداله بتعديل صريح لاحق.
- **التحقق:** فحص Vercel على رأس PR #53 ما زال `pending`: https://vercel.com/relocation-cost/relocation-cost/BEy7Y2fpLeff6NaZm8xKhSF8ejyd . لم تظهر workflow runs مرتبطة بالرأس في الاستعلام. لم تُشغّل الاختبارات محليًا في هذه الجولة. لا دمج قبل نتيجة CI ونجاح build والاختبارات.
- **ما يحتاجه الطرف التالي (Claude):** راجع PR #53 والفروقات، وتحقق من أن اختبار `trust.test.js` يمر. لا تدمج قبل نجاح CI. ملاحظة الموسم الأساسية موجودة بالفعل من PR #51؛ هذا تعديل دقة في نطاق الادعاء فقط.
- **الخطوة التالية المقترحة:** انتظار Vercel/CI على PR #53، ثم مراجعة النتيجة وتحديث هذا السجل قبل أي دمج.

---

## 2026-10-24 19:42 UTC — الطرف: ChatGPT
- **المهمة / الهدف:** مواصلة غرفة العمليات، قراءة آخر تسليم Claude، تثبيت سجل المنافسين المكتمل، ومراجعة صياغة ملاحظة الموسم بناءً على المصادر.
- **الحالة:** تغييرات توثيقية ومراجعة صغيرة للكود على الفرع `fix/season-note-sourcing`؛ بانتظار CI ومراجعة PR.
- **ما تمت مراجعته:** `OPS-ROOM.md` وسجل العمل وسجل المنافسين؛ حالة PR #50 وPR #51؛ `src/lib/trust.js` و`src/lib/trust.test.js` ومواضع `SEASON_NOTE` في `src/pages/calculator.astro` و`src/pages/methodology.astro`. راجعت مصادر الشركات الرسمية: [United Van Lines — How to Cut Moving Costs](https://www.unitedvanlines.com/moving-tips/blog/how-to-cut-moving-costs) و[Mayflower — Best Time of the Year to Move](https://www.mayflower.com/moving-tips/blog/best-time-of-the-year-to-move)، بتاريخ 2026-10-24.
- **ما تغيّر فعليًا:** نقل سجل المنافسين المحدّث (20/20) إلى فرع المتابعة؛ تحديث حالة الغرفة في `OPS-ROOM.md` لتذكر أن PR #50 وPR #51 مدمجان؛ تعديل `SEASON_NOTE` ليقصر ادعاء تغير الأسعار الموسمية ونهاية الشهر/الأسبوع على شركات النقل، بدل تعميمه على تأجير الشاحنات؛ وتعديل اختبار `trust.test.js` لمنع عودة عبارة `truck rentals` دون دليل. commits: `762187399a3578154462db3a71b9463ec1a3309c` و`c2d08075e8ffd607dd1c34b7c6d0f9c4fec3c620` (كود)، وتُضاف commits التوثيق في هذا الفرع.
- **ما أكدته نصيحة Claude:** ملاحظة الموسم موجودة بالفعل في `main` عبر PR #51؛ لا نكرر تنفيذها. كان التحفظ بشأن weekend/month-end مفيدًا: وجدنا مصدرًا رسميًا من Mayflower يذكر أن عطلة نهاية الأسبوع ونهاية الشهر تكونان أعلى طلبًا وقد تكونان أقل تكلفة خارج الذروة، وUnited يذكر ازدحام نهاية الشهر وفترة مايو–منتصف سبتمبر. لذلك بقيت الفكرة لكن صيغ الادعاء أضيق ومقصورة على شركات النقل؛ لا توجد نسبة موسمية في النموذج.
- **التحقق:** PR #50 مدمج وفحص Vercel المرتبط بدمجه نجح؛ PR #51 مدمج، وسجل Claude يذكر نجاح `npm test` محليًا 164/164. لم أشغّل الاختبارات بنفسي في هذه الجولة. يجب انتظار CI على فرع المتابعة؛ لا أدّعي نجاح build جديد حتى تظهر نتيجته.
- **المخاطر أو الأمور غير المحسومة:** لم أتحقق بعد من ظهور ملاحظة الموسم في الموقع المنشور أو من قيمة `build-commit`. كما أن السجل التنافسي جولة نصية أولى، وليس تدقيقًا تفاعليًا أو قياسًا للأداء والوصول.
- **ما يحتاجه الطرف التالي (Claude):** راجع التعديل الصغير في `SEASON_NOTE` واختباره، ثم راجع سجل المنافسين الذي نُقل إلى فرع المتابعة. لا تعِد تنفيذ ملاحظة الموسم؛ ركّز على فتح حاسبة GoodMigrations وحاسبات Allied نفسها إذا أمكن، أو وثّق عائق الوصول.
- **الخطوة التالية المقترحة:** افتح PR من `fix/season-note-sourcing` إلى `main` بعد فحص الفروقات وحالة CI؛ بعد ذلك تحقق من ظهور ملاحظة الموسم على `/calculator/` و`/methodology/` في الإنتاج.

---

## 2026-10-24 19:25 UTC — الطرف: Claude (تحديث حالة لإدخال 19:12)
- **الحالة:** تم الدمج: PR #50 (الغرفة) على `main` عند 015069d، وPR #51 (ملاحظة الموسم، اليوم 21) عند 6cfbb72، وفحص `build` ناجح على رأس كل منهما قبل الدمج. إدخال 19:12 أدناه كتب «قيد التحقق» قبل الدمج؛ هذا الإدخال يحل محله في الحالة.
- **التحقق من الموقع المنشور:** لم يتم. محاولة قراءة `/methodology/` عبر WebFetch لم تُكمل لأن إذن الرابط لم يُجب. لا يوجد دليل بعد أن الملاحظة ظاهرة في الإنتاج، ولا قيمة `build-commit` مفحوصة. على من يملك وصولًا للموقع (ChatGPT أو المالك) أن يتحقق من ظهورها على `/calculator/` و`/methodology/` وأن `build-commit` يبدأ بـ6cfbb72 (أضف `?check=x` لتجنب الكاش).
- **الخطوة التالية:** فحص المنافسين 13–16، ثم فتح حاسبة GoodMigrations وAllied (ثغرة الصفوف 9–10).

---

## 2026-10-24 19:12 UTC — الطرف: Claude
- **المهمة / الهدف:** تنفيذ تحسين اليوم 21: سد فجوة «الموسم/التاريخ» التي وثّقتها في إدخال 19:05، بعد تفويض المالك بالعمل الحر عبر الغرفة.
- **الحالة:** قيد التحقق — الفرع `feat/season-note`، PR يُفتح بعد هذا الإدخال، ولا دمج قبل نجاح CI.
- **ما تمت مراجعته:** دمجت PR #50 (توثيق فقط، فحص build ناجح، 3 ملفات) فصارت الغرفة على `main` (015069d). راجعت `src/lib/trust.js` و`src/pages/calculator.astro` و`src/pages/methodology.astro`.
- **ما تغيّر فعليًا:** ثابت `SEASON_NOTE` في `trust.js` (نص بلا أي رقم أو نسبة)، يظهر في الحاسبة (قسم «How reliable is this estimate?») وفي «Known limits» بصفحة المنهجية؛ اختباران في `trust.test.js`. لا تغيير في أي صيغة أو معامل.
- **التحقق:** `npm test` محليًا: 164 اختبارًا، 164 ناجحًا، 0 فاشلًا. لم أشغّل build محليًا (npm ci محجوب في بيئتي سابقًا)؛ مرجعنا CI على GitHub. لم أرَ الصفحة في متصفح.
- **القرارات وأسبابها:** لا نسبة موسمية لأن لا مصدر منشورًا يغذي النموذج؛ النص يقول فقط إن التاريخ غير مستخدم وإن الأسعار الفعلية قد تتغير. نص «الربيع والصيف» مبني على ما ذكره Mayflower وUnited، وقد يختلف تعريف الذروة بين الشركات.
- **المخاطر أو الأمور غير المحسومة:** صياغة «نهاية الأسبوع ونهاية الشهر» وردت في ملاحظتي من معرفة عامة بالسوق ولم أجد لها مصدرًا في الصفحات التي قرأتها؛ إن لم يؤكدها مصدر فيجب حذفها في تعديل لاحق.
- **ما يحتاجه الطرف التالي:** لا شيء عاجل. ChatGPT مدعو لمراجعة الصياغة أو فتح حاسبة GoodMigrations/Allied (الثغرة المفتوحة في الصفوف 9–10).
- **الخطوة التالية المقترحة:** بعد الدمج: التحقق من ظهور النص على الموقع المنشور عبر build-commit، ثم فحص الصفوف 13–16.

---

## 2026-10-24 19:05 UTC — الطرف: Claude
- **المهمة / الهدف:** دورة «أبدأ الآن» الثانية من جهة Claude: فحص منافسين 9–12، ومطابقة أفكار الصفوف 6–8 مع ما هو موجود فعلًا في الموقع قبل اقتراح أي تنفيذ.
- **الحالة:** تم التنفيذ (توثيق فقط) — لا تغييرات على كود التطبيق ولا على `main`.
- **ما تمت مراجعته:** الفرع `docs/operations-room` عند a0f16a7؛ نصوص صفحات GoodMigrations (مقال تقييم الحاسبات)، وAllied (صفحة الأدوات)، وMayflower (مقالان)، وUnited Van Lines (صفحتان) عبر WebFetch؛ في المستودع: `src/pages/calculator.astro` (عناوين الأقسام وحقول الإدخال) وبحث نصي في `src` عن كلمات الموسم/الذروة/«بلا بريد».
- **ما تغيّر فعليًا:** `docs/operations/COMPETITOR-RESEARCH.md` (صفوف 9–12 مضافة، وتحديث قائمة الانتظار والعنوان إلى 13 من 20) وهذا الإدخال. commit على الفرع نفسه؛ لا PR جديد.
- **التحقق:** PR #50 مفتوح وغير مدمج وقابل للدمج (`mergeable_state: clean`) وفحص `build` ناجح على الرأس a0f16a7، قبل إيداعي الحالي. قراءة نصية فقط للمنافسين؛ لم أفتح الحاسبات نفسها ولم أقِس سرعة أو وصولًا. لم أشغّل اختبارات التطبيق لأنني لم أغيّره.
- **القرارات وأسبابها:**
  1. **تصحيح لفكرة الصف 7 (ChatGPT):** بطاقة «ما الذي قد يغيّر هذا التقدير؟» مغطاة جزئيًا أصلًا: أقسام «How to read your estimate» و«How reliable is this estimate?» و«Costs people often forget» موجودة في الحاسبة، ودليل «قراءة عرض السعر» يشرح الملزم وغير الملزم بمصادر FMCSA. لذلك لا أقترح بطاقة جديدة بهذا العنوان.
  2. **الفجوة الحقيقية التي وجدتها:** الموسم/تاريخ الانتقال. Mayflower وUnited ذكراه كعامل سعر في الصفحات التي قرأتها (وFreightWaves كما وثّقه الصف 7 من قراءة ChatGPT، ولم أعد فحصه)، وبحث `src` عن «season / peak / busy / summer» لم يعطِ أي نتيجة. الحاسبة لا تأخذ تاريخًا ولا تنبّه إلى أن التقدير لا يعدّل حسب الموسم. الحل الأدنى: فقرة بلا أرقام في الحاسبة والمنهجية («السعر الفعلي قد يرتفع في موسم الذروة، وهذا التقدير لا يعدّل حسب التاريخ»). لا أضيف نسبة موسمية قبل وجود مصدر منشور.
  3. أرقام United في دليل المسافات الطويلة لا مصدر لها ولا تاريخ ولا منهجية في الصفحة، فلا تدخل في أي معايرة لدينا.
- **المخاطر أو الأمور غير المحسومة:** (1) صفحة حاسبة GoodMigrations وحاسبات Allied الثلاث لم تُفتح، فمدخلاتها ومخرجاتها غير موثقة. (2) تعديلات «آخر تعديل» الوصفية في أبريل 2026 على مقالات Mayflower وUnited لا تعني أن المحتوى حُدّث. (3) ما قيل عن نص الجملة «بلا بريد» لدينا مبني على بحث نصي في `src`؛ قد تكون صفحة الخصوصية تقول شيئًا مشابهًا بصياغة مختلفة.
- **ما يحتاجه الطرف التالي:** لا شيء عاجل. إن أراد ChatGPT فتح حاسبة GoodMigrations أو Allied في متصفح فهذا يسد ثغرتي (1). قرار دمج PR #50 يبقى للمالك (أرجأته لأنه ما زال يضيف فيه توثيقًا).
- **الخطوة التالية المقترحة:** تحسين اليوم 21 على فرع منفصل وPR مستقل: فقرة «الموسم لا يدخل في هذا التقدير» في الحاسبة وصفحة المنهجية مع اختبار نصي بسيط، دون تغيير أي صيغة. بعده: صفوف 13–16 (ناقلون وطنيون آخرون)، مع التركيز على ما لا نملكه فقط.

---

## 2026-10-24 18:58 UTC — الطرف: ChatGPT
- **المهمة / الهدف:** متابعة دورة «أبدأ الآن» من الحالة الفعلية، والتحقق من PR #50، ثم إكمال دفعة المنافسين التالية دون لمس كود التطبيق.
- **الحالة:** تم التنفيذ — توثيق منافسين 6–8 على فرع `docs/operations-room`.
- **ما تمت مراجعته:** `OPS-ROOM.md` و`docs/operations/WORK-LOG.md` و`docs/operations/COMPETITOR-RESEARCH.md` على `docs/operations-room`؛ حالة PR #50 عبر GitHub (مفتوح، غير مدمج، قابل للدمج، 3 ملفات توثيق)؛ صفحات PODS https://www.pods.com/en-us/moving-services/moving-costs ، وFreightWaves https://www.freightwaves.com/checkpoint/moving-costs/ ، وExtra Space Storage https://www.extraspace.com/moving/tools/ من النصوص العامة الظاهرة في نتائج البحث بتاريخ 2026-10-24.
- **ما تغيّر فعليًا:** تحديث `docs/operations/COMPETITOR-RESEARCH.md` وإضافة توثيق الصفوف 6–8؛ commit: `ba8cc617ea9de0df06045206b6495707a8ba5f2e`. لا تغييرات على كود التطبيق، ولا دمج لـ PR #50.
- **التحقق:** سجل المنافسين يحتوي الآن على 9 من 20 منافسًا موثقًا (الصفوف 1–8 و17). مراجعة نصية فقط؛ لم تُختبر الحاسبات تفاعليًا، ولم تُقَس السرعة أو إمكانية الوصول، ولا تُعد هذه النتائج تدقيقًا كاملًا.
- **القرارات وأسبابها:** أقوى درس قابل للتطبيق الآن هو توضيح ما قد يغير التقدير والفصل بين تقدير التخطيط وعرض السعر الملزم. لم تُقترح إضافة حاسبة حاويات أو أدوات كثيرة في هذه المرحلة لتجنب توسيع النطاق قبل تثبيت جودة الحاسبة الحالية.
- **المخاطر أو الأمور غير المحسومة:** أوصاف الأدوات مبنية على صفحاتها العامة؛ لم تُتحقق من دقة الأسعار أو ادعاءات الجهات، ولا تمثل أسعار PODS أو FreightWaves متوسطًا مستقلًا للسوق.
- **ما يحتاجه الطرف التالي:** لا شيء عاجل؛ عند متابعة العمل، يجب قراءة التغييرات الجديدة وتجنب تكرار الصفوف 6–8.
- **الخطوة التالية المقترحة:** مراجعة الصفوف 9–16 (GoodMigrations وشركات النقل الوطنية) بالتتابع، مع إعطاء الأولوية للمعلومات التي تكشف فجوة عملية في تجربة الحاسبة، ثم مراجعة PR #50 دون دمجه حتى تكتمل المراجعة.

---

## قالب إلزامي لكل إدخال
### YYYY-MM-DD HH:MM UTC — الطرف: ChatGPT / Claude
- **المهمة / الهدف:**
- **الحالة:** مقترح / قيد العمل / تم التنفيذ / تم التحقق / متوقف بسبب عائق
- **ما تمت مراجعته:** ملفات، صفحات، بيانات، منافسون أو أدوات (مع روابط عند توفرها)
- **ما تغيّر فعليًا:** أسماء الملفات والروابط أو أرقام PR/commit. اكتب «لا تغييرات» إن لم يحدث تعديل.
- **التحقق:** الاختبارات والأوامر والنتائج الفعلية؛ لا تكتب «نجح» دون دليل.
- **القرارات وأسبابها:**
- **المخاطر أو الأمور غير المحسومة:**
- **ما يحتاجه الطرف التالي:**
- **الخطوة التالية المقترحة:** مهمة واحدة محددة، غير مكررة.

---

## 2026-10-24 18:55 UTC — الطرف: Claude
- **المهمة / الهدف:** أول دورة «أبدأ الآن» من جهة Claude: مراجعة الغرفة، تقييم ملاحظة حد U-Haul، وفحص ثلاثة منافسين من قائمة الانتظار.
- **الحالة:** تم التنفيذ (توثيق فقط) — لا تغييرات على كود التطبيق.
- **ما تمت مراجعته:** الملفات الثلاثة على `docs/operations-room` (commit 5c1632b)؛ قارنتها بـ`main` (37284a4): الكود متطابق والفرق الوحيد ملفات الغرفة. قرأت `src/lib/calculator.js` و`calculator.test.js` على main. نصوص صفحات HireAHelper وU-Pack وU-Haul عبر WebFetch.
- **ما تغيّر فعليًا:** `docs/operations/COMPETITOR-RESEARCH.md` (صفوف 4 و5 و17 مضافة، وأُزيلت من قائمة الانتظار) وهذا الإدخال. لا PR على main؛ التغييرات على فرع `docs/operations-room`.
- **التحقق:** تأكدت من الكود أن `diyBase = Math.max(diyModel, marketBenchmark)` (السطر 111) وأن `moveFloored` يُعاد من الدالة. وجدت في الاختبارات حالة موجودة أصلًا بعنوان «audit: DIY home sizes tie while the benchmark floor dominates, truck and full-service never tie». لم أشغّل الاختبارات في هذه الجولة (npm ci محجوب في بيئتي سابقًا؛ مرجعنا CI على GitHub). فحص المنافسين قراءة نصية فقط، لا اختبار تفاعلي ولا قياس سرعة أو وصول.
- **القرارات وأسبابها:** تصحيح لإدخال ChatGPT السابق: تساوي مجاميع DIY ليس اكتشافًا جديدًا؛ هو موثق في اختبار وفي شرح على صفحة الحاسبة (PR #17، 2026-10-09). لذلك لا نصمم معادلة بديلة الآن: القرار السابق في المشروع هو إبقاء المعادلة والمعاملات كما هي حتى تتوفر عروض أسعار حقيقية مؤرخة للمعايرة.
- **المخاطر أو الأمور غير المحسومة:** (1) لم أتحقق في هذه الجولة من أن الشرح ما زال ظاهرًا في الصفحة المنشورة. (2) ادعاءات HireAHelper عن حجم بياناتها هي ادعاءات الموقع نفسه ولم نتحقق منها. (3) فشل أول رابط لـU-Pack وتم استخدام رابط آخر من نتائج البحث.
- **ما يحتاجه الطرف التالي:** لا شيء عاجل. إن أراد ChatGPT اقتراح تحسين لسلوك الحد الأدنى فليُعرّف أولًا ما يتغير للمستخدم رغم وجود الشرح الحالي.
- **الخطوة التالية المقترحة:** فحص PODS وFreightWaves وExtra Space Storage (الصفوف 6 و7 و8) بالطريقة نفسها. بعد ذلك مراجعة PR يدمج ملفات الغرفة في main إن وافق المالك.

---

## 2026-10-24 18:44 UTC — الطرف: ChatGPT
- **المهمة / الهدف:** بدء دورة العمل من غرفة العمليات، ومراجعة المنتج والبدء في المقارنة التنافسية.
- **الحالة:** تمت مراجعة أولية؛ المنافسون 3/20 موثقون، والتوصية التقنية التالية قيد التحليل.
- **ما تمت مراجعته:** قرأت OPS-ROOM.md وdocs/operations/WORK-LOG.md وdocs/operations/COMPETITOR-RESEARCH.md على فرع docs/operations-room. قرأت من main ملفات README.md وpackage.json وastro.config.mjs وsrc/pages/index.astro وsrc/pages/calculator.astro وsrc/layouts/Layout.astro وsrc/lib/calculator.js وsrc/lib/calculator.test.js وdata/coefficients.json وsrc/pages/methodology.astro وsrc/pages/guides/moving-cost.astro وpublic/robots.txt. تمت مراجعة الصفحات المنشورة للمنافسين: https://www.movebuddha.com/moving-cost-calculator/ وhttps://www.moving.com/movers/moving-cost-calculator.asp وhttps://www.move.org/moving-costs/.
- **ما تغيّر فعليًا:** تحديث سجل المنافسين بثلاثة أمثلة موثقة وقائمة انتظار إضافية. لا تغييرات على كود التطبيق في هذه الجولة.
- **التحقق:** أظهر مصدر الكود أن calculateBudget يستخدم Math.max(diyModel, marketBenchmark)، واختبار CA → TX home-size comparison with DIY يتوقع المجموع نفسه للأحجام الأربعة (1, 1.35, 1.8, 2.4) عند 1317 ميلًا. هذا يعني أن تأثير حجم المنزل قد يختفي في هذا السيناريو عندما يهيمن حد U-Haul على نموذج DIY. لم تُشغّل الاختبارات فعليًا، ولم تُختبر الصفحة التفاعلية في المتصفح؛ الاستنتاج مستند إلى الكود والاختبار المصدري فقط.
- **القرارات وأسبابها:** لا نغيّر المعادلة قبل تحديد سلوك مقصود ومدعوم واختبارات انحدار؛ فالحد المنشور مرجع أدنى وليس سعرًا عالميًا، وأي بديل يحتاج شفافية ولا يجوز أن يوحي بدقة غير موجودة.
- **المخاطر أو الأمور غير المحسومة:** قد يؤدي الحد الأدنى الحالي إلى إخفاء أثر حجم المنزل في تقديرات DIY لبعض المسافات الطويلة. يلزم فحص أثره على أنواع النقل المختلفة، ثم اختيار حل يضمن عدم النزول عن benchmark وعدم ثبات التقدير على نحو مضلل.
- **ما يحتاجه الطرف التالي:** مراجعة التشخيص واقتراح معادلة بديلة مع اختبارات تثبت رتابة المسافة والحجم وترتيب أنواع النقل، وتراجع الحالات التي تعتمد على benchmark. لا تغيّر الأرقام المنشورة دون تفسير واضح.
- **الخطوة التالية المقترحة:** بناء حالات اختبار تغطي تفاعل المسافة × حجم المنزل × نوع الانتقال وحدود شرائح U-Haul، ثم اقتراح إصلاح صغير على فرع منفصل بعد الاتفاق على الخصائص المطلوبة.

## 2026-10-24 — تأسيس غرفة العمليات
### الطرف: ChatGPT
- **المهمة / الهدف:** إنشاء نظام مشترك للتوثيق والتسليم بين ChatGPT وClaude.
- **الحالة:** مسودة على فرع منفصل؛ لم تُدمج في main.
- **ما تم:** إعداد الصفحة الرئيسية للقواعد، وسجل العمل، وسجل المنافسين على فرع docs/operations-room.
- **ما لم يتم:** لم يُجرَ في هذه الخطوة تدقيق جديد للموقع أو فحص 20 منافسًا، ولم تُشغّل اختبارات المشروع.
- **ما يحتاجه الطرف التالي:** مراجعة الملفات الثلاثة، واقتراح تحسينات عملية ثم اعتمادها عبر PR بعد التأكد من عدم تعارضها مع المستودع.
- **الخطوة التالية المقترحة:** مراجعة آلية غرفة العمليات والتأكد من أن Claude يستطيع الوصول إلى هذه الملفات؛ ثم متابعة تدقيق المنافسين وتسجيل الأدلة بدل إرسال ملخصات متكررة للمالك.

## 2026-10-28 06:25 UTC — ChatGPT: مراجعة مصدر IRS المتبقي لدليل حزمة النقل الوظيفي
- **المهمة / الهدف:** تنفيذ طلب التسليم من إدخال Claude الأخير: مراجعة الجزء الذي لم يقرأه من IRS Publication 15-B (2026) قبل اقتراح أي تعديل على الدليل.
- **ما تم التحقق منه:** راجعت الصفحة الرسمية الكاملة المنشورة على موقع IRS: https://www.irs.gov/publications/p15b. في الفهرس، بند “Moving expense reimbursement” يحيل إلى “What’s New” فقط؛ لا يظهر قسم مستقل لاحق بهذا الاسم. النص الرسمي في الأسطر 352–354 يذكر أن P.L. 119-21 ألغى بشكل دائم استثناء تعويضات نفقات الانتقال من دخل الموظف، مع استثناء عضو القوات المسلحة في الخدمة الفعلية عند تغيير دائم للمحطة بأمر عسكري، واستثناء موظف/معيّن جديد في مجتمع الاستخبارات عند تغيير مهمة يتطلب الانتقال؛ وفي الحالتين يقتصر الاستثناء على النفقات التي كان يمكن للفرد خصمها لو دفعها دون تعويض. المصدر يوجه أيضًا إلى Pub. 3 لتحديد النفقات المؤهلة للقوات المسلحة.
- **النتيجة:** لم أعثر في Publication 15-B (2026) على فقرة إضافية بعنوان “Moving Expense Reimbursements” خارج ملخص “What’s New”. لذلك لا أضيف ادعاءً جديدًا إلى الدليل من هذا المصدر وحده. لا أستنتج منه تفاصيل ضريبية أخرى أو معاملة كل نوع من المدفوعات.
- **الحدود:** هذه مراجعة للنص الرسمي المتاح على الويب، وليست استشارة ضريبية. لم أعدّل صفحة الدليل أو محتواها.
- **ما يحتاجه الطرف التالي (Claude):** لا يوجد تعديل مطلوب بناءً على هذا الفحص؛ احتفظ بالحدود الحالية في الدليل، ويمكن استخدام Pub. 3 كمصدر مستقل فقط إذا قررنا توسيع استثناء القوات المسلحة.
- **الحالة:** اكتمل فحص المصدر وتوثيقه؛ لم تُغيّر معادلات الحاسبة أو صفحة المنتج.

## 2026-10-28 — ChatGPT: اعتماد قانون القيمة قبل النشر
- ربطتُ غرفة العمليات (`OPS-ROOM.md`) بقانون «القيمة قبل النشر» الإلزامي لجميع الصفحات والأدوات والميزات وتغييرات SEO. **نسخة واحدة فقط:** `docs/value-before-publishing.md` (الإصدار 1.0، موجودة في `main` ويربطها README). النسخة المكررة `docs/operations/VALUE-BEFORE-PUBLISHING.md` التي كانت في هذا PR حُذفت (تعديل Claude، 2026-10-28) لأن وجود نصّين لـ«القانون» يخلق تعارضًا.
- يشترط القانون حاجة حقيقية ودليلًا، وقيمة مميزة عن البدائل، والتحقق من المصادر والدقة والجوال والوصولية وSEO، وتوثيق ما اختُبر وخطة قياس لاحقة.
- لم تُشغّل اختبارات التطبيق لأن التغيير توثيقي فقط. لا دمج أو نشر حتى الآن.
- مراجعة Claude: لا تعارض مع قواعد `OPS-ROOM.md` 1–18؛ القانون يكمّل القواعد 8 و9 ولا يلغيها. ملاحظة: كان `docs/value-before-publishing.md` وREADME قد دُفعا مباشرة إلى `main` (5fd4a81 وdef3646) دون PR؛ القاعدة المسجلة أن كل تعديل عبر PR مع CI. يُرجى الالتزام بها حتى للتوثيق.
- الخطوة التالية: مراجعة PR، ثم تطبيق القانون على كل تطوير جديد.
- إجراء المالك: لا شيء.



## 2026-10-29 18:40 UTC — الطرف: ChatGPT — توضيح غرفة العمليات وتجهيز دخول Claude جديد
- **المهمة / الهدف:** تصحيح سوء فهم في تسليم Claude الجديد وتثبيت أن غرفة العمليات مساحة مشتركة يديرها ChatGPT وClaude عبر المستودع، وليست مستندًا على المالك نقله أو صيانته يدويًا.
- **الحالة:** تم تجهيز التغييرات على فرع مستقل؛ بانتظار مراجعة PR والدمج.
- **ما تمت مراجعته:** OPS-ROOM.md، وdocs/operations/WORK-LOG.md، وdocs/value-before-publishing.md، وحالة المستودع الحالية. تأكدت أن غرفة العمليات موجودة في جذر المستودع، وأن سجل العمل موجود في docs/operations/WORK-LOG.md. راجعت أيضًا PR #102 الذي أُدمج، وتأكدت أن تغيير ظهور حاسبة حزمة الانتقال الوظيفي لا يضيف صفحة أو معادلة جديدة.
- **ما تغيّر فعليًا:** إعداد دليل انضمام مستقل لـ Claude الجديد يتضمن الروابط والقوانين وطريقة القراءة والتوثيق والتنسيق وتقسيم العمل ومعايير الجودة. إضافة رابط الدليل إلى غرفة العمليات. لا تغييرات على كود التطبيق.
- **التحقق:** تأكدت من وجود الملفات وروابطها في main قبل التعديل. لم تُشغّل اختبارات التطبيق لأن التغييرات توثيقية فقط؛ يجب التحقق من diff وفتح PR قبل اعتمادها.
- **القرارات وأسبابها:** لا يُطلب من المالك نقل تقارير بين الوكلاء. يجب على كل وكيل قراءة غرفة العمليات والسجل مباشرةً، ثم تسجيل ما أنجزه وما يحتاجه الطرف الآخر. لا يجوز الادعاء بأن Claude الجديد قرأ السجل تلقائيًا؛ عليه فتح الروابط داخل مستودعه/أدواته المتاحة.
- **المخاطر أو الأمور غير المحسومة:** قد لا يمتلك Claude الجديد صلاحيات GitHub أو اتصالًا مباشرًا بالمستودع؛ عندئذٍ يجب أن يسجل العائق المحدد ويواصل الأعمال الممكنة بدل مطالبة المالك بإعادة شرح المشروع.
- **ما يحتاجه الطرف التالي (Claude):** عند مراجعة هذا PR، تحقق من أن دليل الانضمام لا يكرر أو يناقض القوانين القائمة، وخصوصًا قانون القيمة قبل النشر وسياسة الفروع وPR/CI.
- **الخطوة التالية المقترحة:** مراجعة ودمج PR التوثيقي إن كان متوافقًا، ثم على Claude الجديد قراءة OPS-ROOM.md وdocs/operations/WORK-LOG.md وآخر إدخال، وفحص الحالة الحالية، واختيار مهمة واحدة ذات أثر دون تكرار.
