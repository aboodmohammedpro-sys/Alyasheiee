# 08. تصميم واجهة البرمجة (API Design)

## المبادئ العامة
1. **ترويسات RESTful**:
    - `Accept: application/json`
    - `Content-Type: application/json`
    - `Authorization: Bearer <token>`
2. **الإصدارات (Versioning)**:
    - البادئة: `/api/v1`
3. **تسمية المسارات**:
    - مصادر بصيغة الجمع: `/projects`, `/warehouses`.
    - التداخل المنطقي: `/projects/{id}/phases`.
4. **بعد الحالة (Statelessness)**: لا توجد حالة جلسة (Session)، استخدم توكنات Sanctum.

## العمليات الشائعة
| الطريقة | المسار | الوصف |
|---|---|---|
| GET | `/api/v1/{module}` | قائمة مع فلاتر وصفحات |
| POST | `/api/v1/{module}` | إنشاء مورد جديد |
| GET | `/api/v1/{module}/{id}`| الحصول على التفاصيل |
| PUT/PATCH | `/api/v1/{module}/{id}` | تحديث |
| DELETE | `/api/v1/{module}/{id}` | حذف ناعم |

## أفضل الممارسات
- **التصفح (Pagination)**: استخدم `lengthawarepagination`.
- **الفلترة**: استخدم `Spatie/laravel-query-builder` لتوحيد الفلاتر.
- **الترتيب**: المعيار `?sort=-created_at`.
- **الحقول**: السماح بـ `?fields=id,name` لتقليل حجم البيانات.
