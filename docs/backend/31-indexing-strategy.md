# 31. Indexing Strategy

## Optimized PostgreSQL Indexes

### 1. Unique Constraints
- `projects(code)`: Critical for business logic.
- `suppliers(code)`: Business identifier.
- `warehouses(name)`: Within a specific region/type.

### 2. Foreign Key Indexes
- Every `_id` field must be indexed. Laravel doesn't do this by default in migrations without explicit calls.

### 3. Date-Based Indexes
- `stock_movements(created_at)`: Necessary for time-series reports.
- `project_assignments(start_date, end_date)`: For checking overlaps.

### 4. Search Indexes
- Use PostgreSQL **GIN** indexes for searchable text fields like `project description` or `inventory names` to support partial matching without full-table scans.
