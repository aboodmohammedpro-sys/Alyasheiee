# 07. العلاقات البرمجية (Relationships)

## رسم علاقات Laravel Eloquent

### موديول المشاريع
- **المشروع (Project)**:
    - `phases()`: `HasMany(ProjectPhase)` (لديه العديد من المراحل)
    - `assignments()`: `HasMany(ProjectAssignment)` (لديه العديد من التعيينات)
    - `attachments()`: `MorphMany(Media)` (لديه مرفقات متعددة)
    - `stockMovements()`: `MorphMany(StockMovement, 'destination')` (حركات المخزون الصادرة له)

### موديول الموارد
- **الموظف (Employee)**:
    - `assignments()`: `MorphMany(ProjectAssignment, 'assignable')`
- **المعدة (Equipment)**:
    - `assignments()`: `MorphMany(ProjectAssignment, 'assignable')`
    - `movements()`: `MorphMany(StockMovement, 'destination')` (حركات المخزون المسجلة عليها كالديزل)

### موديول المشتريات
- **طلب الشراء (PurchaseRequest)**:
    - `items()`: `HasMany(PurchaseRequestItem)`
    - `order()`: `HasOne(PurchaseOrder)`
    - `requester()`: `BelongsTo(User)`
- **أمر الشراء (PurchaseOrder)**:
    - `supplier()`: `BelongsTo(Supplier)`
    - `request()`: `BelongsTo(PurchaseRequest)`
    - `movements()`: `HasMany(StockMovement)` (إيصالات الاستلام)

### موديول المستودعات
- **المستودع (Warehouse)**:
    - `movements()`: `HasMany(StockMovement)`
- **حركة المخزون (StockMovement)**:
    - `warehouse()`: `BelongsTo(Warehouse)`
    - `destination()`: `MorphTo()` (مشروع، معدة، صيانة، إلخ)
    - `source()`: `MorphTo()` (أمر شراء، تعديل، إلخ)
