# 03. Information Architecture & Sitemap

This document maps out the system's Information Architecture (IA) and Sitemap structure. It covers the current Phase 1 modules and makes provisions for future Phase 2 expansions without altering the layout core.

---

## 1. System Navigation Hierarchy

The application navigation is organized into a primary left sidebar categorized into logical operational domains, with secondary views loading as tabs or sub-routes.

```
[ERP Global Shell]
├── Global Topbar (Search, Notifications, Command Palette, Active Project Selector)
├── Collapsible Sidebar (Modular Navigation)
└── Main Content Canvas (Layout determined by route)
```

---

## 2. Phase 1 Module Structure (Sitemap)

The following site structure represents the immediate pages to be built:

### `/dashboard` (The Landing Shell)
- Unified analytics overview tailored to the user's role.

### `/projects` (Project Management Module)
- `/projects` (List view of all active/completed construction projects)
- `/projects/new` (Project Creation Wizard - drawer/page)
- `/projects/[id]` (Project Detail Page - multi-tab view)
  - `tab=overview` (Gantt chart, KPIs, progress %)
  - `tab=phases` (Milestones, work breakdown structure)
  - `tab=teams` (Allocated labor, supervisors, recorders)
  - `tab=equipment` (Allocated machinery, operational hours)
  - `tab=materials` (Material requests, delivery receipts)
- `/projects/[id]/settings` (Budget thresholds, parameters)

### `/resources` (Resources Directory)
- **Employees**:
  - `/resources/employees` (Staff list, positions, contact info)
  - `/resources/employees/[id]` (Performance logs, assignment logs)
- **Equipment**:
  - `/resources/equipment` (Machinery database: excavators, cranes, generators)
  - `/resources/equipment/[id]` (Maintenance logs, current project, fuel history)
- **Teams**:
  - `/resources/teams` (Crew configurations, assigning supervisors)

### `/procurement` (Purchasing & Supply Chain)
- **Suppliers**:
  - `/procurement/suppliers` (Vendor list, ratings, categories)
  - `/procurement/suppliers/[id]` (Payment history, open POs)
- **Purchase Requisitions (PR)**:
  - `/procurement/requisitions` (Requisition status board)
  - `/procurement/requisitions/new` (Requisition creator - items auto-search)
  - `/procurement/requisitions/[id]` (Approval flow, item details)
- **Purchase Orders (PO)**:
  - `/procurement/orders` (PO status tracker)
  - `/procurement/orders/[id]` (Print/PDF preview, delivery milestones)

### `/inventory` (Warehouse & Inventory Management)
- **Warehouses**:
  - `/inventory/warehouses` (List of yards, field depots, central stores)
  - `/inventory/warehouses/[id]` (Stock value, stock logs)
- **Items (Catalog)**:
  - `/inventory/items` (Unified catalog, categories, barcodes/SKUs)
  - `/inventory/items/[id]` (Stock level per warehouse, unit costs)
- **Transactions & Adjustments**:
  - `/inventory/transactions` (Receipts, stock transfers, write-offs)
  - `/inventory/transactions/new-receipt` (Goods receipt note for a PO)
  - `/inventory/transactions/new-transfer` (Inter-warehouse stock moving)

### `/field-records` (Recorders & Dispatchers Operations)
- **Daily Progress Logs**:
  - `/field-records/progress` (Daily progress reports logged by Recorders)
- **Fuel Dispatch**:
  - `/field-records/fuel` (Fuel dispatch board)
  - `/field-records/fuel/new` (Quick Fuel Entry: nozzle logs, equipment hours)

### `/reports` (Reports & Analytics Engine)
- `/reports/procurement` (Spending reports, supplier delays)
- `/reports/inventory` (Inventory valuation, consumption rates)
- `/reports/equipment` (Fuel efficiency, machine hours breakdown)

---

## 3. Future (Phase 2) Integration Slots
The navigation sidebar and routing are designed with toggles to easily activate Phase 2 modules when ready.

```
[Operational Domains]
├── Phase 1 (Active)
│   ├── Projects
│   ├── Resources
│   ├── Procurement
│   ├── Inventory
│   └── Field Records
└── Phase 2 (Hidden/Disabled placeholders in Admin config)
    ├── Fuel Management (Advanced nozzles & telemetry integration)
    ├── Maintenance (Preventive maintenance, work orders)
    ├── Concrete Plant (Batch mix logs, truck schedules)
    ├── HR & Camp (Lodging allocations, transport)
    ├── Payroll & Finance (Timesheet integration, invoicing)
    └── Contractors (Subcontractor progress claims)
```

---

## 4. Global Search & Quick Links
Every screen features a persistent global topbar with search functionality:
- **Scope-Sensitive Queries**: Typing in a specific module defaults search to that module (e.g. typing "excavator" inside `/projects` searches for assigned excavators, while typing it in `/inventory` searches the item catalog).
- **Navigation Shortcuts**: Built-in system paths allowing users to skip menus (e.g., typing `/reports` instantly lists available analytical layouts).
