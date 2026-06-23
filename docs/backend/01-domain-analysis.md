# 01. Domain Analysis

## 1. النطاقات الجوهرية (Core Domains)
- **إدارة المشاريع (Project Management)**: الهيكل العام، المراحل، والمخططات.
- **إدارة الموارد (Resource Allocation)**: الموظفين والمعدات الثقيلة.
- **العمليات اليومية (Daily Operations)**: تتبع الحضور، الساعات، الإنجاز الميداني، والنقلات. **(جديد)**
- **الخدمات اللوجستية للوقود (Fuel Logistics)**: إدارة الديزل، التوزيع، ومراقبة الاستهلاك. **(جديد)**
- **المشتريات والمخازن (Procurement & Warehouse)**: طلبات الشراء، المخزون، والموردين.

## 2. Resources Domain (Teams, Employees, Equipment)
- **Aggregate Roots**: `Employee`, `Equipment`, `Team`
- **Entities**: `ProjectAssignment` (Polymorphic/Pivot with history)
- **Business Rules**:
  - Resources are assigned to projects for a specific time range.
  - Equipment availability depends on its current status (Available, Working, Maintenance).
  - Teams are predefined sets of roles (PM, Supervisor, etc.) that can be cloned and assigned.

## 3. Procurement Domain
- **Aggregate Root**: `PurchaseRequest` (PR), `PurchaseOrder` (PO)
- **Entities**: `PurchaseRequestItem`, `PurchaseOrderItem`, `Supplier`
- **Business Rules**:
  - PR requires multiple levels of approval (Defined in Policy/Workflow).
  - PO can only be generated from an Approved PR.
  - Quantities in PO cannot exceed PR approved quantities.

## 4. Inventory & Warehouse Domain
- **Aggregate Root**: `Warehouse`
- **Entities**: `InventoryItem`, `StockMovement`, `ItemCategory`
- **Value Objects**: `Quantity`, `UnitPrice`
- **Business Rules**:
  - Warehouses are independent and not locked to a specific project.
  - Inventory balance is calculated via `StockMovements` summary (or cached snapshots).
  - "Issue" movements must have a valid `Destination` (Project, Equipment, etc.).
  - Stock levels cannot go below zero for physical items.

## 5. Relationships Overview
- `Project` has many `Assignments` (Equipment/Employees).
- `Warehouse` has many `StockMovements`.
- `StockMovement` morphs to `Destination` (Project, Equipment, maintenance).
- `Supplier` has many `PurchaseOrders`.
