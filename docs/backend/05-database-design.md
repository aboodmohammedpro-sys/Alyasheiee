# 05. Database Design

## Naming Conventions
- **Tables**: Plural snake_case (e.g., `projects`).
- **Columns**: snake_case.
- **Foreign Keys**: `entity_id` (e.g., `project_id`).
- **UUID**: Every table MUST use UUID as the primary key for external IDs. Internal IDs can be BigInt for performance.

## Core Tables (Structural Fields)

### Projects
- `id` (UUID)
- `code` (Unique, e.g., PRJ-2024-001)
- `name`
- `client_name`
- `location`
- `start_date`, `expected_end_date`
- `estimated_budget` (Decimal 15,2)
- `progress_percentage` (SmallInt 0-100)
- `status` (Enum/String: planning, active, on_hold, completed, cancelled)
- `description`
- `created_by`, `updated_by`, `deleted_by` (Foreign UUIDs)
- Timestamps & Soft Deletes

### Resource Assignments (Polymorphic)
- `id` (UUID)
- `project_id`
- `assignable_id` (UUID - Employee or Equipment ID)
- `assignable_type` (String - App\Modules\...\Employee or Equipment)
- `start_date`, `end_date` (Nullable if ongoing)
- `status` (Enum: active, ended)
- `notes`

### Procurement
- `purchase_requests`: code, requester_id, department_id, status, total_amount.
- `purchase_orders`: code, purchase_request_id, supplier_id, status, total_amount, delivery_date.
- `items`: purchase_request_id / purchase_order_id, item_name, quantity, unit_price, total_price.

### Warehouse & Stock
- `warehouses`: name, location, type (diesel, spare_parts, etc.).
- `stock_movements`:
    - `id`
    - `warehouse_id`
    - `item_id`
    - `type` (receipt, issue, transfer, return, adjustment)
    - `quantity` (signed decimal)
    - `destination_id` (Polymorphic: Project, Equipment, etc.)
    - `destination_type`
    - `reference_no` (e.g., PO-123)
    - `user_id` (The one who performed the move)
