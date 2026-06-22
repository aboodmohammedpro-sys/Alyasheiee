# 07. Relationships

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
