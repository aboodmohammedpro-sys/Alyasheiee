# 18. طبقة المستودعات (Repository Layer)

## الغرض
نمط الـ Repository يفصل طبقة الوصول للبيانات عن منطق العمل. هذا يضمن أن الخدمة لا تهتم إذا كانت البيانات تأتي من Eloquent، ذاكرة تخزين مؤقت، أو API خارجي.

## الطرق الإلزامية لكل Repository
- `findById(string $uuid): ?Model`
- `allActive(): Collection`
- `create(array $data): Model`
- `update(string $uuid, array $data): Model`
- `delete(string $uuid): bool`

## أفضل الممارسات
- **لا لمنطق العمل**: يجب أن تقوم الـ Repositories فقط بعمليات `where`, `join`, و `order`.
- **Query Scopes**: الـ Repositories هي المكان المثالي لتطبيق منطق مثل `whereModule(x)->active()`.
- **التصفح**: التعامل مع معاملات تصفح API هنا.
