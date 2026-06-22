# 20. استراتيجية Enums

## لماذا Enums؟
لتجنب "النصوص السحرية" (Magic Strings). توفر الـ Enums صلاحية على مستوى الكود.

## التعدادات الأساسية (Core Enumerations)

### حالة المشروع (ProjectStatus)
- `PLANNING` (تخطيط)
- `ACTIVE` (نشط)
- `ON_HOLD` (متوقف مؤقتاً)
- `COMPLETED` (مكتمل)
- `CANCELLED` (ملغي)

### حالة تعيين الموارد (ResourceAssignmentStatus)
- `ACTIVE` (نشط)
- `ENDED` (منتهي)
- `RECALLED` (مستدعى)

### حالة المعدات (EquipmentStatus)
- `AVAILABLE` (متوفرة)
- `WORKING` (تعمل)
- `MAINTENANCE` (صيانة)
- `STOPPED` (متوقفة)

### حالة المشتريات (ProcurementStatus)
- `DRAFT` (مسودة)
- `PENDING_APPROVAL` (بانتظار الموافقة)
- `APPROVED` (معتمد)
- `SHIPPED` (تم الشحن)
- `RECEIVED` (تم الاستلام)
- `REJECTED` (مرفوض)

### أنواع حركة المخزون (StockMovementType)
- `RECEIPT` (استلام من مورد)
- `ISSUE` (صرف للموقع)
- `RETURN` (إرجاع من الموقع للمستودع)
- `TRANSFER` (تحويل بين المستودعات)
- `ADJUSTMENT` (تعديلات جردية)
