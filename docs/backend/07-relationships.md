# 07. Relationships

### 3. علاقات العمليات الجديدة
- **المشروع (Project) 1 : N السجل اليومي (DailyLog)**.
- **السجل اليومي (DailyLog) 1 : N حضور العمال (LaborAttendance)**.
- **المعدات (Equipment) 1 : N معاملات الوقود (FuelTransactions)**.
- **الموزع (User/FuelDispatcher) 1 : N عمليات التعبئة (Dispensing)**.

## Mapping Laravel Eloquent Relations

### Project Module
- **Project**:
    - `phases()`: `HasMany(ProjectPhase)`
    - `assignments()`: `HasMany(ProjectAssignment)`
    - `attachments()`: `MorphMany(Media)`
    - `stockMovements()`: `MorphMany(StockMovement, 'destination')`

### Resource Module
- **Employee**:
    - `assignments()`: `MorphMany(ProjectAssignment, 'assignable')`
- **Equipment**:
    - `assignments()`: `MorphMany(ProjectAssignment, 'assignable')`
    - `movements()`: `MorphMany(StockMovement, 'destination')`

### Procurement Module
- **PurchaseRequest**:
    - `items()`: `HasMany(PurchaseRequestItem)`
    - `order()`: `HasOne(PurchaseOrder)`
    - `requester()`: `BelongsTo(User)`
- **PurchaseOrder**:
    - `supplier()`: `BelongsTo(Supplier)`
    - `request()`: `BelongsTo(PurchaseRequest)`
    - `movements()`: `HasMany(StockMovement)` (Goods Receipt)

### Warehouse Module
- **Warehouse**:
    - `movements()`: `HasMany(StockMovement)`
- **StockMovement**:
    - `warehouse()`: `BelongsTo(Warehouse)`
    - `destination()`: `MorphTo()` (Project, Equipment, maintenance, etc.)
    - `source()`: `MorphTo()` (PurchaseOrder, Adjustment, etc.)
