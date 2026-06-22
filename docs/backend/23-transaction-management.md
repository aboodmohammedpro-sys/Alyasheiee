# 23. Transaction Management

## Critical Atomic Operations
The following operations MUST be wrapped in `DB::transaction()` to ensure atomicity.

### 1. Procurement Finalization
- Update `PurchaseOrder` status to `RECEIVED`.
- Create `StockMovement` records for all items.
- Update `Inventory` levels (if caching balance).

### 2. Resource Reassignment
- Mark current `ProjectAssignment` as `ended`.
- Create new `ProjectAssignment` for Target Project.
- Update `Equipment` or `Employee` metadata.

### 3. Stock Transfer
- Create `Issue` movement from Source Warehouse.
- Create `Receipt` movement in Target Warehouse.
- Both must succeed or both fail.

## Usage in Laravel
```php
DB::transaction(function () use ($dto) {
    $this->repo->updateOrder($dto);
    $this->movementRepo->createReceipts($dto->items);
});
```
