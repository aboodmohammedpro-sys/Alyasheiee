# 06. تصميم علاقات الكيانات (ERD Design)

## تصور Mermaid ERD

```mermaid
erDiagram
    PROJECT ||--o{ PROJECT_PHASE : "يحتوي على"
    PROJECT ||--o{ ASSIGNMENT : "لديه"
    EMPLOYEE ||--o{ ASSIGNMENT : "معين لـ"
    EQUIPMENT ||--o{ ASSIGNMENT : "معن لـ"
    
    PURCHASE_REQUEST ||--o{ PURCHASE_REQUEST_ITEM : "يحتوي على"
    PURCHASE_ORDER ||--o{ PURCHASE_ORDER_ITEM : "يحتوي على"
    PURCHASE_REQUEST ||--o| PURCHASE_ORDER : "يتحول إلى"
    SUPPLIER ||--o{ PURCHASE_ORDER : "يوفر"
    
    WAREHOUSE ||--o{ STOCK_MOVEMENT : "يسجل"
    STOCK_MOVEMENT }o--|| PROJECT : "وجهة (Morph)"
    STOCK_MOVEMENT }o--|| EQUIPMENT : "وجهة (Morph)"
    STOCK_MOVEMENT }o--|| PURCHASE_ORDER : "مرجع (المصدر)"
```

## تفاصيل العلاقات
1. **التعيينات (Assignments)**: جدول جسر يتعامل مع كل من الموظفين والمعدات باستخدام علاقات Laravel Polymorphic. هذا يحافظ على نظافة نموذج المشروع ويسمح بتتبع موحد لموارد الموقع.
2. **حركات المخزون (Stock Movements)**: "الوجهة" متعددة الأشكال. هذا أمر بالغ الأهمية لأن الديزل يمكن صرفه لـ "شاحنة" (معدة) أو "مشروع" (موقع عام) أو "صيانة" (داخلي).
3. **التسلسل الهرمي**: المشاريع -> المراحل -> المهام (المهام تضاف في المرحلة الثانية).
