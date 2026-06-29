# 05. Role-Based User Experience

This document details the dashboard, workflows, permission sets, and custom user interface experiences tailored for each user role in the system.

---

## 1. Role Matrix & Key Characteristics

| Role | Primary Interface | Primary Device | Data Density | Interaction Style |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | Settings, Users, Audits | Desktop | High | Configuration, Form-heavy |
| **Company Manager** | Multi-project Dashboards | Desktop / Tablet | Medium | Analytical, Read-only, Approvals |
| **Project Manager** | Project details, Schedules | Desktop / Tablet | High | Operations, Gantt, Reports |
| **Supervisor** | Progress inputs, Crew logs | Tablet / Mobile | Compact | Quick taps, Simple lists |
| **Senior Recorder** | Review panels, Audits | Desktop | High | Bulk approval, Keyboard grid |
| **Recorder** | Shift entries, Material logs | Tablet / Mobile | High-Contrast | Fast typing, Numeric pad |
| **Procurement Officer**| POs, RFQs, Vendor catalogs | Desktop | High | Form-heavy, Multi-window |
| **Warehouse Keeper** | Receipts, Stock transfers | Tablet / Mobile | Compact | Barcode scanning, Checklist |
| **Fuel Dispatcher** | Dispatch form, Tank levels | Mobile / Tablet | High-Contrast | Numpad inputs, One-click log |
| **Accountant** | Invoices, Inventory cost | Desktop | High | Financial grids, Exports |

---

## 2. Detailed Role Specifications

### 2.1 Project Manager (PM)
- **Primary Pages**: `/projects/[id]`, `/reports/equipment`, `/procurement/requisitions`
- **Daily Operations**: Reviewing milestone progress, identifying equipment delays, approving emergency material requisitions, reviewing daily site logs.
- **Key Data Needed**: Real-time project completion %, budget vs. actual costs, equipment utility rate, pending PR status.
- **Dashboard Profile**: 
  - Gantt chart widget showing active phases.
  - Quick action to "Request Equipment" or "Create PR".
  - Alert badges for delayed milestones.

### 2.2 Recorder & Senior Recorder
- **Primary Pages**: `/field-records/progress`, `/resources/employees`, `/inventory/transactions`
- **Daily Operations**: 
  - *Recorder*: Logging worker attendance, machine operational hours, and weather details.
  - *Senior Recorder*: Checking inputs of multiple site recorders, correcting mistakes, signing off on daily submittals.
- **Key Data Needed**: Attendance list, active equipment on site, phase task list.
- **UX Profile**: 
  - Large button selectors for attendance (Present/Absent/Excused).
  - Fast numeric entry grids for equipment hours.
  - Senior Recorder interface uses split-screen to compare submitted records vs. historical norms.

### 2.3 Warehouse Keeper
- **Primary Pages**: `/inventory/warehouses/[id]`, `/inventory/transactions/new-receipt`
- **Daily Operations**: Inspecting incoming delivery trucks, counting items, matching deliveries with PO numbers, allocating stocks to storage shelves.
- **Key Data Needed**: Expected deliveries for the day, storage location map, item inventory levels.
- **UX Profile**:
  - Tablet-friendly. Large touch targets.
  - Built-in camera barcode scanning interface.
  - Single-page Goods Receipt Wizard with item check-off functionality.

### 2.4 Fuel Dispatcher
- **Primary Pages**: `/field-records/fuel/new`, `/field-records/fuel`
- **Daily Operations**: Pumping fuel into heavy machinery, recording machine hours, tracking fuel truck inventory level.
- **Key Data Needed**: Active fuel truck level, list of heavy equipment, equipment consumption rate.
- **UX Profile**:
  - Ultra-high contrast design (field-tested for outdoor glare).
  - Virtual numpad helper.
  - Single-column flow: Select Machine → Enter Hours → Enter Liters → Tap Save.

### 2.5 Procurement Officer
- **Primary Pages**: `/procurement/requisitions`, `/procurement/orders`, `/procurement/suppliers`
- **Daily Operations**: Analyzing incoming PRs, request supplier pricing quotes, generating POs, monitoring supplier lead times.
- **Key Data Needed**: Open Requisitions list, supplier pricing sheets, delivery performance metrics.
- **UX Profile**:
  - Multi-window layout support.
  - Direct conversion tools (one-click PR to PO conversion).
  - Split-screen comparison for vendor bids.

---

## 3. Role Guards & Permission Strategy

```typescript
type Role = 
  | 'admin'
  | 'company_manager'
  | 'project_manager'
  | 'supervisor'
  | 'senior_recorder'
  | 'recorder'
  | 'procurement_officer'
  | 'warehouse_keeper'
  | 'fuel_dispatcher'
  | 'accountant';

interface UserSession {
  id: string;
  name: string;
  roles: Role[];
  allowedProjects: string[]; // Scope limitation
}
```

- **Scoped Views**: A Project Manager can only see data belonging to their assigned `allowedProjects` array. A Warehouse Keeper is scoped to their specific warehouse ID.
- **Dynamic Action Disabling**: Button elements are wrapper-protected:
  ```tsx
  <RoleGuard roles={['admin', 'procurement_officer']} fallback={null}>
    <Button onClick={createPO}>Generate PO</Button>
  </RoleGuard>
  ```
- **Audit Trails**: Every write operation initiated by a Recorder or Dispatcher includes automated client metadata logging (IP, User-Agent, geo-location if allowed) passed to the Laravel backend for security compliance.
