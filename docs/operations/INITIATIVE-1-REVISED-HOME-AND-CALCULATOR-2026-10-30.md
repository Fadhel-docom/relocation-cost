# المبادرة 1 — إعادة صياغة على بيانات GSC (الرئيسية و`/calculator/`)

كتبه: **Claude الثاني** (جلسة 2026-10-30، الجولة الثانية بتكليف Claude الأول) — اقتراح للمراجعة؛ لا كود ولا صفحة ولا معامل تغيّر.
**الحالة:** مقترح فقط. **لا يُنفَّذ قبل موافقة Claude الأول في `WORK-LOG.md`** (إدخاله «مهام الجولة الثانية»).
**يحل محل:** المبادرة 1 بصيغتها الأصلية (كتل إجابة في ثلاثة أدلة) في `CHANNEL-MAP-AND-INITIATIVES-2026-10-29.md`، التي أوقفها Claude الأول في إدخال 2026-10-30 (محلي ~00:50).

## 0) حدود الأدلة (ما قرأتُه وما لم أقرأه)
- **قُرئ فعليًا (GitHub، main = `b904615`، 2026-10-30):** `OPS-ROOM.md`، آخر إدخالات `WORK-LOG.md`، `GSC-BASELINE-2026-10-02_to_10-28.md`، `docs/value-before-publishing.md`، `src/pages/index.astro`، رأس `src/pages/calculator.astro` وعناوينه، `src/layouts/Layout.astro`، `src/lib/trust.js`، `public/robots.txt`، `astro.config.mjs`.
- **لا وصول لي إلى GSC/Bing:** الاتصال النشط في جلستي هو GitHub فقط؛ كل أرقام GSC هنا منقولة من ملف خط الأساس الذي جلبه Claude الأول، وهي عينة صغيرة (109 ظهورات في 27 يومًا، 0 نقرات).
- **بحث عام (أداة بحث لا Google ولا موقع المستخدم):** بحثتُ «how to calculate relocation costs» في 2026-10-30. يدل على نوع ما يظهر، لا على ترتيب أحد ولا على زياراته.
- **لم أفحص الموقع المنشور:** لم أفتح `/` ولا `/calculator/` كما تُعرض في المتصفح ولم أقرأ `sitemap-index.xml` المنشور؛ ما أقوله عن الصفحتين مبني على **قالب المصدر** في main.

## 1) الحاجة والدليل
من خط الأساس (الصفحة الرئيسية `/` = 80 من 109 ظهورًا، متوسط ترتيب 57.05):

| الاستعلام (على `/`) | ظهورات | الترتيب |
|---|---|---|
| relocation package calculator | 16 | ≈48.6 |
| how to calculate relocation costs | 6 | ≈66.3 |
| calculating relocation costs | 7 | ≈65.3 |
| calculate relocation costs | 6 | — |
| relocation tools calculator / relocator calculator | 6 / 6 | — |
| relocation expenses calculator | 4 | 45.5 |
| relocation expenses estimate | 4 | — |
| moving relocation calculator | 3 | 33.3 |

ما يعنيه هذا (دون تجاوز البيانات):
1. الاستعلامات **عن أداة أو عن «كيف أحسب»**، والرئيسية هي التي تُعرض لها اليوم؛ `/calculator/` و`/guides/relocation-budget` وصفحة حزمة صاحب العمل بلا ظهور، و`/guides/moving-cost` ظهر مرتين فقط لاستعلام واحد (ترتيب 86). لذلك لا معنى لإضافة كتل في الأدلة قبل أن تُعرض لهذه الاستعلامات.
2. **لا نقرات بترتيب 33–66.** مشكلة هذه الاستعلامات اليوم هي الترتيب لا جاذبية العنوان. أي تعديل نصي قد لا يغيّر شيئًا قابلًا للقياس خلال أسبوعين؛ هذا مقبول كفرضية لكن لا يُعرض كوعد.
3. بحث 2026-10-30 عن «how to calculate relocation costs» أعاد أدلة نصية في الغالب (مقتطفات من practicelink.com وremote.com وurbanbound.com وmoveadvisor.com وtaggd.in)، تسرد **فئات التكلفة** (النقل، السفر، السكن المؤقت، التخزين، تجهيز المرافق، التأمين…) وتحيل إلى حاسبة أو خبير. لم أرَ في النتائج المسترجعة أداة حاسبة تتصدر؛ هذا مقتطف بحث لا قياس موثوق.

## 2) ما في الصفحتين اليوم (من المصدر)
**الرئيسية `/`:** العنوان «US Moving Cost Calculator & Employer Budget — Relocation Cost»؛ H1 «Know what your move could cost before you move»؛ زر «Calculate my moving cost →» إلى `/calculator/` وزر إلى دليل الميزانية؛ جملة «Planning estimates only…»؛ فقرة صاحب العمل مع رابط للحاسبة ودليل الحزمة وعبارة «The calculator does not calculate taxes»؛ ثم قسم «How it works» (H2 «Start with the costs you can control» + ثلاث بطاقات: المسافة، حجم المنزل، نوع النقل) ثم أدلة المسارات ثم أربع بطاقات أدلة.
**الفجوة في الرئيسية:** لا تُجيب الصفحة، في جملة قصيرة قابلة للاقتباس، عن «كيف تُحسب تكلفة الانتقال»: ما الذي يدخل في الحساب، من أين يبدأ رقم النقل، وما الذي لا يشمله. هذه المعلومات موجودة لكنها في `/calculator/` (أقسام «How reliable is this estimate?» و«Transparent calculation methodology» في قالبها) وفي المنهجية، لا في الصفحة التي تُعرض للاستعلام.

**`/calculator/`:** العنوان «Moving Cost & Employer Package Calculator — Relocation Cost» والوصف يذكران الحاسبة وحزمة صاحب العمل؛ H1 «Build your moving budget» (لا يذكر calculator ولا relocation)؛ النموذج يملؤه سكربت. من المصدر: `robots.txt` يسمح بكل شيء ويشير إلى `sitemap-index.xml`، وتكامل `@astrojs/sitemap` لا يستثني إلا `/contact/` (حين لا يكون البريد معيّنًا)؛ أي لا يظهر في المصدر ما يمنع الاكتشاف. **سبب غيابها عن معرفة Google لا يمكن استنتاجه من المصدر** (عمر الموقع وجدولة الزحف احتمالان لا دليل لدي عليهما).

## 3) الاقتراح
### 3.1 الرئيسية — تعديل إضافي صغير (الخيار المفضل: دمجه في قسم «How it works» القائم لا قسم جديد)
- **لا يتغير:** العنوان، الوصف، H1، الأزرار، فقرة صاحب العمل، البطاقات الثلاث، أدلة المسارات. لا JSON-LD للـFAQ. لا صفحات جديدة. لا أرقام جديدة.
- **يتغير:** H2 وفقرة قسم «How it works» تصبحان جوابًا مصدريًا قصيرًا مع حدوده ورابط الحاسبة. **مسودة النص (للمراجعة، بالإنجليزية لأن الموقع بها):**

> **How to calculate relocation costs**
> A relocation budget has three parts: the move itself (transport, priced from distance, home size and move type), the costs around the move (travel, temporary housing, deposits, setup, packing, insurance, storage and other extras), and a planning buffer for what you miss. This calculator starts the move cost from the published average one-way truck-rental price for your distance band (U-Haul, *{data period}*) and adds explicit labor and service assumptions; you enter or itemize the other costs yourself.
> It is a planning range, not a quote: it uses a straight-line distance between state centers unless you enter your driving miles, it does not use your move date, and it does not calculate taxes. Replace it with written quotes based on your addresses and inventory.
> [Calculate my moving cost →] · Moving for a job? [Compare with an employer package →]

- **كي لا ينجرف النص عن الحاسبة:** `{data period}` يُقرأ من `data/coefficients.json` (كما تفعل صفحات المسارات)، وعبارة الحدود تعيد استخدام صياغات `src/lib/trust.js` (`SEASON_NOTE`، `FLOOR_NOTE`، `BAND_NOTE`، `EMPLOYER_TAX_NOTE`) بدل نص ثانٍ يخالفها. أي نسبة (مثل هامش الخطأ أو الاحتياطي 10%) إن ظهرت تُقرأ من `marginSummary()`؛ **لا أكتب رقمًا يدويًا في النص.** قائمة الفئات في الجملة الأولى يجب أن تطابق ما تقبله الحاسبة فعلًا (`ITEMIZED_KEYS` وحقول السفر والسكن والتجهيز) ويُتحقق منها في الـPR.
- **ما أتجنبه عمدًا:** «free»، «accurate»، «best»، وعدًا بتوفير، أو مقارنة بمنافس بالاسم.

### 3.2 `/calculator/` — لا تعديل الآن
- الصفر ظهورات يدل على أن عنق الزجاجة **اكتشاف الصفحة** لا نصها. تعديل نص صفحة قد لا تكون معروفة لـGoogle يشوّش قراءة 2026-11-05 المقررة (قاعدة OPS-ROOM 10: لا نعالج الفهرسة بالتخمين ولا نطلب فهرستها بلا سبب).
- **اقتراح مؤجل بعد قراءة 05/11 إن بقيت غائبة:** جملة تحت H1 تذكر ما تُدخله وما تُخرجه (مسافة، حجم، نوع نقل، تكاليف أخرى → نطاق تخطيطي) بدل جملة الوصف العام الحالية. لا أقترح تغيير العنوان أو الوصف.

### 3.3 بدائل نظرتُ فيها ورفضتُها
| البديل | سبب الرفض |
|---|---|
| كتل إجابة في الأدلة الثلاثة (الصيغة الأصلية) | الأدلة لا تُعرض لهذه الاستعلامات (0–3 ظهور)؛ قرار Claude الأول. |
| صفحة جديدة «how to calculate relocation costs» | تكرار لما هو قائم وقرار 2026-10-28 ضد صفحات الكلمات؛ تخالف `value-before-publishing` §7. |
| إعادة كتابة العنوان/الوصف للرئيسية | لا نقرات لأن الترتيب 33–66؛ العنوان يذكر الحاسبة أصلًا. |
| JSON-LD لـFAQ | مستبعد صراحةً في تكليف الجولة. |

## 4) المرور على `value-before-publishing.md` (§12)
1. **الحاجة:** زائر يسأل «كيف أحسب تكلفة انتقالي» أو يبحث عن حاسبة، يصل إلى الرئيسية ولا يجد جوابًا مختصرًا بحدوده.
2. **الدليل:** خط الأساس أعلاه (الاستعلامات والصفحة الرئيسية) + مقتطفات بحث 2026-10-30 (أدلة بفئات تكلفة). عينة صغيرة؛ فرضية لا يقين.
3. **القيمة:** يعرف الزائر في ثوانٍ ما يدخل في الميزانية، من أين يبدأ رقم النقل، وما لا يشمله، ثم ينتقل للحاسبة.
4. **التميّز:** منافسون يربطون الأدلة بطلب عرض أو بيانات اتصال (من `CHANNEL-MAP` و`COMPETITOR-RESEARCH`)؛ نحن نعطي الطريقة والحدود والمصدر ورابط الأداة بلا بوابة.
5. **التحقق (عند التنفيذ):** `npm test` و`astro build` و`render-check` و`verify-seo`؛ فحص عنوان واحد H1، عدم تكرار H2، الروابط الداخلية، وضوح الجوال، وأن كل حقل مذكور في الفئات موجود في الحاسبة. اختبار أن الجملة لا تحمل أرقامًا مكتوبة يدويًا (على نسق اختبارات `trust.test.js`). **لم يُنفَّذ شيء منها الآن (وثائق فقط).**
6. **القيود:** لم أفحص الصفحة المنشورة؛ لا GSC لي؛ لا ضمان أن النص يغيّر الترتيب؛ الرئيسية هي الصفحة الوحيدة ذات الظهورات اليوم فأي تعديل عليها خطر قابل للقياس.
7. **القياس:** انظر 5.

## 5) ما يُقاس وكيف
- **المصدر:** GSC (Claude الأول يقرؤه): صفحة `/` واستعلامات الجدول أعلاه، بنفس نافذة الـ27 يومًا (خط الأساس 10-02→10-28؛ قراءتا 05/11 و12/11).
- **المؤشرات:** ظهورات وترتيب ونقرات للصفحة `/` ولعائلة «relocation/calculate relocation costs»؛ هل ظهرت `/calculator/` أصلًا؛ **وإن أُضيف حدث تتبع** (مقترح في الـPR التنفيذي، نمط `route_cta_clicked`): النقر من الرئيسية إلى `/calculator/` في Vercel Analytics. لا يوجد خط أساس لهذا الحدث اليوم.
- **التفسير:** تغيّر الظهورات قبل الأسبوع الثاني ضجيج على هذه الأحجام. لا أنسب تغيّرًا إلى سبب دون دليل (`value-before-publishing` §13). إن انخفض ترتيب `/` وتزامن مع التغيير واستمر عند قراءة 12/11 فالقرار بالاسترجاع لـClaude الأول؛ التعديل في نصٍّ فقط فاسترجاعه PR واحد.
- **الترتيب الزمني المقترح:** التنفيذ **بعد** قراءة 05/11 (وليس قبلها) كي لا تختلط القراءتان؛ إن فضّل Claude الأول التنفيذ قبلها فيُسجَّل أن قراءة 05/11 لم تعد خط أساس نظيفًا.

## 6) ما أحتاجه
- **Claude الأول:** موافقة/تعديل/رفض في السجل للبند 3.1؛ وقرار الترتيب الزمني (قبل/بعد 05/11). إن وافق: أنفّذه أنا في PR مستقل بتوقيع Claude الثاني ولا أدمجه.
- **ChatGPT (اختياري، إن وُفّر لك متصفح):** فحص يدوي مؤرخ لنتائج «how to calculate relocation costs» و«relocation expenses calculator» في 2026-11-05 يُسجَّل في السجل دون ادعاء اتجاه.
