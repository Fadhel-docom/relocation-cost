# تحقق المصادر الأولية لحزمة AI Answers — 2026-11-01

**الطرف:** ChatGPT. **الحالة:** تحقق ويب مباشر؛ لا نشر ولا تعديل إنتاجي.

## U-Haul — تحقق من الصفحة الأصلية
- العنوان: How to Save Money on Truck Rentals.
- آخر تحديث ظاهر: September 10, 2025.
- تتضمن الصفحة جدول متوسطات one-way حسب شرائح المسافة، وتقول إن المتوسطات مقدرة لشهر September 2025.
- تذكر أن سعر one-way يتأثر بالأصل والوجهة وحجم الشاحنة ومخزون الشاحنات.
- المصدر: https://www.uhaul.com/Tips/Packing/How-To-Save-Money-ON-Truck-Rentals-35820/

### المطابقة مع بيانات المشروع
تتطابق القيم السبعة في data/coefficients.json مع الجدول المنشور: $202، $444، $995، $1,657، $2,190، $2,694، $3,517 لشرائح المسافة المتتابعة حتى 2,500+ ميل.

هذا يؤكد أصل benchmark وفترته، لكنه لا يحولها إلى أسعار حية أو عروض لمسار معين أو أسعار خدمة نقل كاملة. استخدامها كحد أدنى لمكوّن DIY هو منطق داخلي في Relocation Cost، وليس ادعاءً صادرًا عن U-Haul.

صياغة آمنة للمسودة #6: The DIY estimate uses historical one-way truck-rental averages published by U-Haul for September 2025, grouped by mileage band, as a lower-bound benchmark in our model. These are not live prices, route-specific quotes, full-service mover prices or guaranteed rental rates. U-Haul notes that one-way rates vary by origin, destination, truck size, move date and truck inventory.

## FMCSA — التحقق من الادعاءات القانونية
- التقدير المكتوب interstate يجب أن يتضمن transportation وaccessorial وadvance charges؛ rate quote ليس estimate.
- binding estimate يحدد المبلغ للخدمات والشحنة المشمولة، مع قواعد للتغييرات والإضافات.
- non-binding estimate ليس ضمانًا للسعر النهائي، وتنطبق قاعدة 110% عند التسليم وفق شرح FMCSA.
- المصدر: https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/what-binding-move-estimate
- مصدر إضافي: https://www.fmcsa.dot.gov/consumer-protection/protect-your-move/how-can-i-avoid-unexpected-moving-costs
- Moving Checklist توصي بثلاثة تقديرات على الأقل ومقارنة التكلفة والخدمات والتحقق من تسجيل الناقل ورقم USDOT: https://www.fmcsa.dot.gov/protect-your-move/moving-checklist

## قرارات التحرير
- #2: حصر القاعدة القانونية في interstate moves داخل الولايات المتحدة، وعدم الجزم بنوع المعاينة أكثر مما يثبته المصدر.
- #4: فصل contingency الداخلي 10% عن قاعدة FMCSA 110%.
- #5: نطاق 80%–120% منطق داخلي وليس قاعدة FMCSA.
- #6: يمكن ذكر U-Haul والفترة September 2025 مع توضيح أنها بيانات تاريخية وليست أسعارًا حية.
- #7: فصل حقائق FMCSA عن توصيتنا بمقارنة عروض ذات inventory/services متطابقة.
- #8: نسبة توصية ثلاثة عروض والتحقق من التسجيل إلى FMCSA؛ بقية عناصر التحضير نصائح عملية من المشروع.
- #9: وصف المقارنة بأنها مقارنة حزمة صاحب العمل مع تقدير الحاسبة، لا حكمًا ضريبيًا.
- #10: الصفر يعني أن القيمة لم تدخل الإجمالي، ولا يعني أن المصروف لن يحدث.

لم يتم تعديل coefficients أو الإنتاج أو نشر الإجابات أو طلب الفهرسة أو التواصل الخارجي. يلزم اجتياز بوابة القياس في 2026-11-05 ومراجعة قانون القيمة قبل النشر.