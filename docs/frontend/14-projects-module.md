# 14. Projects Module Specification

This document defines the functional requirements, page inventories, interactive dialogs, and filters required for the **Projects Module (Phase 1)**.

---

## 1. Page Inventory & Routing

The Projects Module is structured under the `/projects` directory:

| Route Path | Screen Type | Render Context | Purpose |
| :--- | :--- | :--- | :--- |
| `/projects` | List Screen | Client Component | Overview of all active and completed projects with search, sort, and status filters. |
| `/projects/new` | Create Screen | Client Component (Drawer) | Wizard layout to define project code, budget, location, managers, and timeline. |
| `/projects/[id]` | Details Screen | Mixed (Server Shell) | Multi-tab view mapping the complete project health (Overview, Phases, Crew, Machineries). |
| `/projects/[id]/edit` | Edit Screen | Client Component (Drawer) | Modifies budget, metadata, and active manager configurations. |
| `/projects/[id]/reports` | Reports Screen | Client Component | Dynamic analytical graphs comparing project budget, fuel usage, and progress. |

---

## 2. Screen Specifications

### 2.1 Project List Screen (`/projects`)
- **Key Columns**: Project Code (monospaced), Project Name, Manager, Start/End Dates, Budget Utilization %, Progress Bar, Current Status.
- **Filters Panel**:
  - *Status*: `Active`, `Draft`, `On Hold`, `Completed`, `Delayed`.
  - *Manager*: Dropdown autocomplete of Project Managers.
  - *Date Range*: Date picker filter by start dates.
- **Primary Actions**:
  - `Create Project` (slides in the creation drawer).
  - `Bulk Status Update` (floating action bar, e.g. put selected projects on hold).

### 2.2 Project Details Tab System (`/projects/[id]`)

```
   ┌──────────────────────────────────────────────────────────┐
   │ [Overview]  [Phases]  [Teams & Labor]  [Equipment]  [Log] │
   └──────────────────────────────────────────────────────────┘
```

#### Tab 1: Overview
- **Visuals**: Primary Gantt chart displaying active milestones.
- **Widgets**:
  - Budget Utilization Gauge.
  - Days Remaining Counter.
  - Fuel Consumption Trend (ApexCharts sparkline).

#### Tab 2: Phases & Milestones
- **Layout**: Column grid mapping phases (e.g. *Phase 1: Excavation*, *Phase 2: Foundation*).
- **Interactive States**:
  - Inline progress percentage updater slider.
  - Action to `Add Milestone` (opens a drawer).
  - Drag-and-drop to re-order phase priorities.

#### Tab 3: Teams & Labor
- **Layout**: Tabular grid of active workers assigned to the project.
- **Actions**:
  - `Assign Crew/Team` (triggers a combobox selector dialog).
  - `Log Attendance` (redirects to quick progression log page).

#### Tab 4: Equipment & Machinery
- **Layout**: List of heavy equipment registered on the project site.
- **Metrics**: Current machine hours meter, Fuel usage logs, status (`Working`, `Idle`, `Down for Maintenance`).

---

## 3. Drawers & Dialogs Inventory

- **Create/Edit Project Drawer (`<ProjectFormDrawer />`)**:
  - Form slides out from the right.
  - Validations: Project Code must be unique, End Date must be after Start Date.
- **Create Phase Drawer (`<PhaseFormDrawer />`)**:
  - Fields: Phase Name, Estimated Start/End, Budget Allocation, Supervisor ID.
- **Assign Team Dialog (`<AssignTeamDialog />`)**:
  - Modal overlay containing select inputs to allocate pre-configured teams or individual employees.
- **Allocate Equipment Dialog (`<AllocateEquipmentDialog />`)**:
  - Searchable grid of idle equipment with checkbox selectors. Shows location distance if available.
