# 19. كائنات نقل البيانات (DTO)

## لماذا DTOs؟
تمرير المصفوفات الارتباطية (associative arrays) بين Controllers و Services عرضة للأخطاء. توفر الـ DTOs أماناً للأنواع وبيانات مهيكلة.

## التنفيذ (خاص بـ Laravel 11/12)
نستخدم خصائص PHP 8 للقراءة فقط (readonly properties).

```php
readonly class CreateProjectDTO {
    public function __construct(
        public string $name,
        public string $code,
        public ProjectStatus $status,
        public DateTime $startDate,
        public string $createdBy
    ) {}

    public static function fromRequest(ProjectRequest $request): self {
        return new self(
            name: $request->validated('name'),
            ...
        );
    }
}
```

## الفوائد
- عقد واضح بين الـ Controller والـ Service.
- لا توجد أخطاء إملائية في المفاتيح مثل `$data['nmae']`.
- إكمال تلقائي في محررات الأكواد (IDE).
