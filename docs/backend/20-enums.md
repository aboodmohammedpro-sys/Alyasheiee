# 20. Enums Strategy

## Why Enums?
Avoid "Magic Strings". Enums provide validity at the code level.

## Core Enumerations

### ProjectStatus
- `PLANNING`
- `ACTIVE`
- `ON_HOLD`
- `COMPLETED`
- `CANCELLED`

### ResourceAssignmentStatus
- `ACTIVE`
- `ENDED`
- `RECALLED`

### EquipmentStatus
- `AVAILABLE`
- `WORKING`
- `MAINTENANCE`
- `STOPPED`

### ProcurementStatus
- `DRAFT`
- `PENDING_APPROVAL`
- `APPROVED`
- `SHIPPED`
- `RECEIVED`
- `REJECTED`

### StockMovementType
- `RECEIPT` (In from Vendor)
- `ISSUE` (Out to Site)
- `RETURN` (Site back to WH)
- `TRANSFER` (WH to WH)
- `ADJUSTMENT` (Inventory corrections)
