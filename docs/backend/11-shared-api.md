# 11. منطق API المشترك (Shared API Logic)

## المرافق المشتركة
1. **إدارة الملفات**: نقطة نهاية موحدة لرفع مستندات المشروع، صور الهوية، أو فواتير الموردين.
2. **عمليات البحث (Picklists)**:
    - `/api/v1/lookups/warehouses`
    - `/api/v1/lookups/item-categories`
    - `/api/v1/lookups/suppliers`
3. **ملف المستخدم**:
    - `/api/v1/me`
    - `/api/v1/me/notifications`

## تكامل المعمارية
تقع واجهات البرمجة المشتركة في `app/Modules/Shared/Controllers`. وتستخدم خدمات مشتركة للمهام العابرة للموديولات مثل توليد الباركود أو تحويل العملات.
