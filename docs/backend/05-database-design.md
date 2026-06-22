# 05. تصميم قاعدة البيانات (Database Design)

## اتفاقيات التسمية
- **الجداول**: بصيغة الجمع snake_case (مثل `projects`).
- **الأعمدة**: snake_case.
- **المفاتيح الخارجية**: `entity_id` (مثل `project_id`).
- **UUID**: يجب أن يستخدم كل جدول UUID كمعرف أساسي للروابط الخارجية. المعرفات الداخلية يمكن أن تكون BigInt للأداء.

## الجداول الأساسية (الحقول الهيكلية)

### المشاريع (Projects)
- `id` (UUID)
- `code` (فريد، مثل PRJ-2024-001)
- `name` (الاسم)
- `client_name` (اسم العميل)
- `location` (الموقع)
- `start_date`, `expected_end_date` (تاريخ البدء والانتهاء المتوقع)
- `estimated_budget` (الميزانية التقديرية - Decimal 15,2)
- `progress_percentage` (نسبة الإنجاز - SmallInt 0-100)
- `status` (الحالة: التخطيط، نشط، متوقف مؤقتاً، مكتمل، ملغي)
- `description` (الوصف)
- `created_by`, `updated_by`, `deleted_by` (تتبع المستخدمين)
- الطوابع الزمنية والحذف الناعم (Soft Deletes)

### تعيينات الموارد (Resource Assignments)
- `id` (UUID)
- `project_id`
- `assignable_id` (UUID - معرف الموظف أو المعدة)
- `assignable_type` (نوع المورد - Employee أو Equipment)
- `start_date`, `end_date` (تاريخ البدء والانتهاء)
- `status` (Enum: نشط، منتهي)

### المشتريات (Procurement)
- `purchase_requests`: الكود، صاحب الطلب، القسم، الحالة، المبلغ الإجمالي.
- `purchase_orders`: الكود، مرجع طلب الشراء، المورد، الحالة، المبلغ الإجمالي، تاريخ التوصيل.
- `items`: اسم الصنف، الكمية، سعر الوحدة، الإجمالي.

### المستودعات والمخزون (Warehouse & Stock)
- `warehouses`: الاسم، الموقع، النوع (ديزل، قطع غيار، إلخ).
- `stock_movements` (حركات المخزون):
    - `type`: (استلام، صرف، تحويل، إرجاع، تعديل)
    - `quantity`: الكمية (سالبة أو موجبة)
    - `destination_id`: (متعدد الأشكال: مشروع، معدة، إلخ)
    - `reference_no`: رقم المرجع (مثل رقم أمر الشراء)
