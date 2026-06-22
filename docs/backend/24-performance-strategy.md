# 24. Performance Strategy

## Optimization Pillars

### 1. Database Level
- **B-Tree Indexes**: On all Foreign Keys and frequently filtered columns (`status`, `code`, `dates`).
- **Composite Indexes**: Specifically for `StockMovements` (`warehouse_id`, `item_id`, `created_at`).
- **Partial Indexes**: On active assignments only to speed up resource lookups.

### 2. Code Level
- **Eager Loading**: Enforce `with()` in Repositories to prevent N+1 queries.
- **Lazy Collections**: Use for processing large CSV exports or massive stock audits to save RAM.
- **Chunking**: Use `DB::table()->chunk()` for background updates.

### 3. Frontend Integration
- **API Filtering**: Only send the fields requested by the client.
- **Pagination**: Default limit of 15, max 100.
- **Debouncing**: Search inputs on web/mobile to prevent rapid-fire API calls.
