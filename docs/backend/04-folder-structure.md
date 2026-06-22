# 04. هيكل المجلدات (Folder Structure)

## مخطط المشروع

```text
alyasheiee/
├── app/
│   ├── Modules/                # قلب النظام (المكونات البرمجية)
│   │   ├── ProjectManagement/  # إدارة المشاريع
│   │   ├── ResourceAllocation/ # تخصيص الموارد
│   │   ├── Procurement/        # المشتريات
│   │   ├── Warehouse/          # المستودعات
│   │   └── Shared/              # المنطق المشترك (الوسائط، الوسوم، إلخ)
│   ├── Core/                    # امتدادات فريمورك لارافيل
│   │   ├── Traits/
│   │   ├── Contracts/
│   │   └── AbstractClasses/
│   └── Providers/
├── config/                      # الإعدادات
├── database/
│   ├── migrations/             # التهجير (مركزي لسهولة النشر)
│   ├── seeders/
│   └── factories/
├── docs/
│   └── backend/                # التوثيق الحالي (بالعربية)
├── public/                      # الملفات العامة
├── resources/                   # المصادر
├── routes/                      # المسارات
│   ├── api_v1.php              # مدخل API الإصدار الأول
│   └── web.php
└── tests/                       # الاختبارات
    ├── Unit/
    └── Feature/
```

## تفاصيل داخلية للموديول
- **الخدمات (Services)**: يجب أن تنفذ Interface إذا كان سيتم استدعاؤها من موديولات أخرى.
- **DTOs**: تستخدم حصرياً لمدخلات الخدمات.
- **Enums**: يجب أن تكون جميع الحالات والأنواع والفئات من نوع Enum (ميزات PHP 8.1+).
- **Repositories**: توحيد جلب البيانات (مثل Scopes محددة للمشاريع "النشطة").
