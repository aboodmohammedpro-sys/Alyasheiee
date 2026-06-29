# 17. Recorders & Fuel Dispatchers Operations

This document defines the interface standards, mobile layouts, and validation patterns for field-operational roles: **Recorders, Senior Recorders, and Fuel Dispatchers**.

---

## 1. Interaction Context & Environment Constraints

Unlike office roles, field operators work in challenging conditions:
- **Low Connectivity**: Unstable 4G/3G on construction sites.
- **Glare & Sunlight**: Require high contrast (contrast ratio > 4.5:1) and bold buttons.
- **Fatigue / Gloves**: Touch targets must be at least **48px x 48px** to prevent input errors.
- **Form Speed**: Form entries must take less than 15 seconds to log.

---

## 2. Page & Form Specifications

### 2.1 Recorder: Daily Attendance & Hour Log (`/field-records/attendance`)
This page is structured as a quick-selection grid for team lists:

```
+-------------------------------------------------------------------------+
| [ Project: Red Line Metro ]                        [ Date: 2026-06-23 ] |
+-------------------------------------------------------------------------+
| WORKER ID     │ NAME             │ STATUS                               |
+───────────────┼──────────────────┼──────────────────────────────────────+
| EMP-2098      │ Ahmed Salim      │ ( Present )   [ Absent ]   [ Leave ]  |
| EMP-2101      │ Jose Garcia      │ [ Present ]   ( Absent )   [ Leave ]  |
| EMP-2402      │ Mohammad Khan    │ ( Present )   [ Absent ]   [ Leave ]  |
+───────────────┼──────────────────┼──────────────────────────────────────+
| [Save Shift Log]                 │ Total Present: 2 / 3                 |
+-------------------------------------------------------------------------+
```

- **Tap Toggle**: Clicking the status buttons toggles states instantly, changing color dynamically (Present = Green tint, Absent = Red tint).
- **Auto-populate**: Clicking "Copy from Yesterday" imports the previous day's attendance sheet, letting the Recorder change only exceptions (absences).

### 2.2 Fuel Dispatcher: Mobilized Entry Form (`/field-records/fuel/new`)
A mobile-first layout designed for one-hand operation from fuel trucks:

1. **Step 1: Select Equipment**:
   - Touch-friendly list of equipment active on the project site.
   - Alternatively, triggers camera scan to read barcode sticker on the machine.
2. **Step 2: Log Metrics**:
   - Hour Meter: Numeric field. Auto-displays the last logged meter value (e.g., `4,210 Hrs`). Flags a warning if the entered number is lower or exceeds a 24-hour increment limit (+24 hours).
   - Fuel Dispensed: Shows a prominent number input for liters.
3. **Step 3: Save & Dispatch**:
   - A single prominent "Log & Continue" button. Saving automatically syncs the balance in the fuel truck tank.

### 2.3 Senior Recorder: Review Panel (`/field-records/review`)
- **Objective**: Audit and lock logs before dispatching to payroll/finance.
- **Interface**: 
  - Dual-panel layout on desktop: Left list of logs pending sign-off; right panel comparison view showing discrepancies.
  - **Discrepancy Flags**:
    - Overlapping hours (e.g., employee logged on two different sites).
    - Unusually high machinery usage hours (e.g. equipment logged running 24 hours straight without warning tag).

---

## 3. Offline Guard & Sync Controller

Because connections drop on field projects, the system runs a local synchronizer:

```
[User Submits Form] ──> [Online?]
                          │
                   +──────┴──────+
                 (Yes)          (No)
                  │              │
         [Send API Request]   [Write to LocalStorage (IndexedDB)]
                                 │
                              [Network Restored?] ──> [Batch Upload Logs]
```

- **Visual Sync Status Badge**: A small indicator in the topbar header shows status:
  - `Synced` (Green dot): All logs saved in central Laravel DB.
  - `Offline - 4 pending` (Amber dot): Indicates logs are safely cached locally in IndexedDB and will auto-upload when internet connection is restored.
