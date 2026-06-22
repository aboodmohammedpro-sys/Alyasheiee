# 28. معالجة الأخطاء (Error Handling)

## المعالجة المركزية
- **الموقع**: `app/Exceptions/Handler.php`.

## التسلسل الهرمي للأخطاء
1. **ValidationException**: إرجاع كود 422 مع تفاصيل الحقول.
2. **AuthenticationException**: إرجاع كود 401.
3. **AuthorizationException**: إرجاع كود 403.
4. **DomainException**: (قاعدة مخصصة لمنطق العمل) إرجاع كود 400 مع كود خطأ واضح (مثال: `INSUFFICIENT_STOCK`).
5. **ModelNotFoundException**: إرجاع كود 404.
6. **استثناء عام**: إرجاع كود 500 (إخفاء التفاصيل في الإنتاج، وتسجيلها في Sentry).

## تحويل الاستجابة
تأكد من أن جميع الأخطاء تتبع التنسيق المحدد في وثيقة `12-response-format.md`.
```json
{
  "success": false,
  "error": { "code": "...", "message": "..." }
}
```
