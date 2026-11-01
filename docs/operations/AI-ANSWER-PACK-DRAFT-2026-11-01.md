# AI Answer Pack — مسودات الإجابات الأولى
**التاريخ:** 2026-11-01  
**الحالة:** مسودات بحثية داخل المستودع فقط؛ لم تُنشر.  
**القاعدة:** الأجوبة الرقمية لا تعتمد إلا على منطق الكود والمصادر المعلنة. تُراجع قبل تحويلها إلى نص ظاهر للزوار.

## 1) How does Relocation Cost estimate distance between states?
**مسودة جواب:** By default, Relocation Cost uses an approximate straight-line distance between the geographic centers of the selected states. That is not the same as road mileage between your addresses. If you know the actual driving miles for your move, you can replace the default distance in the calculator. The result should therefore be treated as a planning estimate, not a route-navigation measurement.

**الدليل الداخلي:** `src/pages/calculator.astro` help text; `src/pages/moving-cost/[route].astro` calculates distance between state centroids.  
**الرابط المقترح:** /calculator/ + /methodology/  
**شرط النشر:** التأكد من تطابق شرح methodology مع التطبيق والروابط المعبأة في صفحات المسارات.

## 2) Is the Relocation Cost result a binding moving quote?
**مسودة جواب:** No. Relocation Cost provides a planning estimate, not a mover's written quote or contract. An interstate mover's written estimate should describe the shipment and services. Under FMCSA guidance, a binding estimate is a written agreement for the listed quantities and services; a non-binding estimate is not a guaranteed final price. Ask the mover for a written estimate based on an actual or virtual survey.

**مصدر أولي:** FMCSA — https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/what-binding-move-estimate  
**مصدر إضافي:** https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/select-mover  
**الرابط المقترح:** /calculator/ + /guides/moving-cost/  
**شرط النشر:** تحديد نطاق الجملة القانونية بوضوح على أنها تخص interstate moves في الولايات المتحدة، ومراجعة الصياغة مع صفحة الحقوق الحالية لـFMCSA.

## 3) What does the calculator include in its moving budget?
**مسودة جواب:** The calculator estimates a moving-cost component from distance, home-size category and move type. You can add costs you already know, such as travel, temporary housing, deposits or setup, fuel, insurance, packing, equipment, utilities, storage and access-related costs. A 10% planning contingency is added to the move and entered costs. Items left at $0 are excluded; $0 does not mean the expense is free.

**الدليل الداخلي:** `src/lib/calculator.js`, `src/pages/calculator.astro`.  
**الرابط المقترح:** /calculator/ + /methodology/  
**شرط النشر:** لا توحِ بأن البنود الصفرية محسوبة تلقائيًا؛ اشرح أن المستخدم يضيف المبالغ التي يعرفها.

## 4) What does the 10% contingency mean?
**مسودة جواب:** Relocation Cost adds a 10% planning buffer to the modeled move cost and the additional amounts entered by the user. This is a budgeting assumption built into this calculator; it is not a prediction of actual overruns, a measured confidence interval, or an FMCSA rule. It is also different from FMCSA's 110% rule for certain non-binding interstate mover estimates at delivery.

**الدليل الداخلي:** `DEFAULT_CONTINGENCY_RATE = 0.10` in `src/lib/calculator.js`.  
**مصدر أولي للمقارنة القانونية:** FMCSA — https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/what-binding-move-estimate  
**الرابط المقترح:** /methodology/  
**شرط النشر:** إبراز الفرق بين buffer الخاص بالأداة و110% rule حتى لا يخلط المستخدم بينهما.

## 5) Why is the calculator's range not a guaranteed accuracy range?
**مسودة جواب:** The displayed low and high figures are calculated as 80% and 120% of the model total. They are a planning band chosen by the tool, not a statistically validated confidence interval and not a promise that a mover's final quote will fall inside it. Actual prices depend on the shipment, services, route, date and mover's terms.

**الدليل الداخلي:** `DEFAULT_RANGE_LOW = 0.80` and `DEFAULT_RANGE_HIGH = 1.20` in `src/lib/calculator.js`.  
**مصدر أولي للسياق:** FMCSA written estimates — https://www.fmcsa.dot.gov/protect-your-move/how-to/subpartD  
**الرابط المقترح:** /methodology/ + /calculator/  
**شرط النشر:** هذا جواب ذو قيمة عالية للثقة؛ يجب أن يظهر قرب نتيجة الحاسبة إن وافق المالك على تعديل المحتوى بعد بوابة القياس.

## 6) How does the calculator use U-Haul price data?
**مسودة جواب:** The calculator uses U-Haul's published one-way rental averages by mileage band as a lower bound for its DIY moving-cost base. It does not treat those figures as a universal per-mile rate, a full-service mover price, a route-specific quote or a guaranteed rental rate. U-Haul says actual one-way prices vary by origin, destination, truck size, move date and inventory.

**مصدر البيانات:** U-Haul — https://www.uhaul.com/Tips/Loading/How-To-Save-Money-ON-Truck-Rentals-35820/  
**الدليل الداخلي:** `data/coefficients.json`, `getUhaulBenchmark()`, `calculateBudget()`.  
**الرابط المقترح:** /methodology/ + /guides/moving-cost/  
**شرط النشر:** مراجعة تاريخ البيانات وفترة September 2025 الظاهرة في ملف coefficients، وعدم وصفها بأنها أحدث أسعار 2026.

## 7) Why can two interstate moving estimates be different?
**مسودة جواب:** Two estimates can differ when the shipment inventory, estimated weight, requested services or access requirements differ. FMCSA says an interstate mover's written estimate should include transportation, accessorial and advance charges, and that a non-binding estimate is based on estimated shipment weight and requested services. Compare written estimates with the same inventory and service scope rather than comparing headline totals alone.

**مصدر أولي:** FMCSA — https://www.fmcsa.dot.gov/protect-your-move/how-to/subpartD  
**مصدر مساند:** https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/how-can-i-avoid-unexpected-moving-costs  
**الرابط المقترح:** /guides/moving-cost/  
**شرط النشر:** إضافة checklist قصيرة للمقارنة بعد مراجعة النص الحالي حتى لا نكرر المحتوى.

## 8) What should I prepare before asking an interstate mover for an estimate?
**مسودة جواب:** Prepare a clear inventory, both addresses, preferred dates, access details such as stairs or parking restrictions, special or high-value items, and the services you want included. FMCSA recommends getting written estimates from multiple movers and checking that the interstate mover is registered. Ask each mover to price the same shipment and services so the estimates are comparable.

**مصدر أولي:** FMCSA Moving Checklist — https://www.fmcsa.dot.gov/protect-your-move/moving-checklist  
**مصدر إضافي:** https://www.fmcsa.dot.gov/protect-your-move/select-mover  
**الرابط المقترح:** /guides/moving-cost/  
**شرط النشر:** لا نقدم القائمة بوصفها متطلبات قانونية كاملة؛ هي تجهيز عملي مع إحالة إلى FMCSA.

## 9) How can I compare an employer relocation package with my moving budget?
**مسودة جواب:** Separate money paid to you from expenses the employer pays directly. Enter the cash amount and direct-paid costs in the calculator's employer section, then compare them with the moving budget you entered. This is a budgeting comparison only: it does not determine tax treatment, reimbursement eligibility or what your employer's policy covers.

**الدليل الداخلي:** `src/lib/calculator.js`, `src/pages/guides/employer-relocation-package.astro`.  
**الرابط المقترح:** /calculator/ + /guides/employer-relocation-package/  
**شرط النشر:** إعادة التحقق من IRS source checks قبل أي جواب ضريبي، وعدم إعطاء tax advice.

## 10) Does a $0 optional cost mean that the move is free?
**مسودة جواب:** No. In this calculator, an optional cost left at $0 is omitted from the total because no amount was entered. It does not mean the cost will not occur. Add a realistic amount when you know it, and avoid entering the same expense in both a general field and an itemized field.

**الدليل الداخلي:** `src/pages/calculator.astro` helper text and input handling.  
**الرابط المقترح:** /calculator/  
**شرط النشر:** سؤال مباشر مفيد لمنع سوء فهم النتائج؛ تحقق من تطابق النص مع جميع الحقول الحالية.

## أهم فجوات الثقة المكتشفة من هذا العمل
1. تصحيح بعد مراجعة Claude للكود: شرح straight-line distance ظاهر بالفعل تحت اختيار الولايتين، ومكرر في ملاحظة النتيجة وتعريفات المدخلات؛ لذلك لا يصح وصفه بأنه مدفون في المساعدة فقط. التحسين المحتمل — وليس خللًا مثبتًا — هو اختباره بجوار الرقم النهائي إذا أظهرت ملاحظات المستخدمين حاجة لذلك.
2. ±20% range band يجب ألا يوصف بأنه accuracy guarantee أو statistical confidence interval.
3. 10% contingency يجب فصله بصريًا ومفهوميًا عن FMCSA 110% rule.
4. مصدر U-Haul هو benchmark لأسعار one-way truck rental في فترة سبتمبر 2025؛ لا يمثل كل أنواع خدمات النقل ولا أسعار مسار محدد.
5. الإجابات يجب أن ترتبط بالصفحات الحالية بدل إنشاء عشر صفحات جديدة. هذه المسودات لا تُنشر قبل موافقة التحرير والبوابة المقررة 2026-11-05.

**حالة هذا الملف:** بحث وتوثيق فقط؛ لم تتغير صفحات الإنتاج.
