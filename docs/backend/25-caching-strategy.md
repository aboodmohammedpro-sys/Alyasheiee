# 25. Caching Strategy

## Implementation Layers

### 1. Application Cache (Redis)
- **Picklists**: Store Warehouse lists, Supplier lists, and Category trees. TTL: 1 hour.
- **Auth**: User permissions and roles. Cleared on permission update via Spatie.
- **Aggregates**: Dashboard stats (Total active projects, Stock alerts). Recalculated every 15 minutes.

### 2. Query Results
- Cache expensive queries like "Average fuel consumption per equipment" for 10 minutes.

### 3. Model Caching
- Use `laravel-model-caching` for static tables like `EquipmentTypes` or `Departments`.

## Cache Invalidation
- Use **Tags** for easy clearing.
- Example: When a PO is received, clear the `warehouse_stock_{id}` tag.
