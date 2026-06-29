# 04. User Journeys

## Critical User Flows

---

### Flow 1: Project Manager Checks Project Status

**Goal**: Know the real-time status of a project on a Monday morning.

```
Start → Dashboard
  → See "Active Projects" card [1 click]
  → Click project name → Project Overview page [2 clicks]
  → View: Progress %, Phase status, Team assignments, Equipment, Pending PRs
  → Done — Full picture in 2 clicks
```

**Optimizations**:
- Project cards on dashboard link directly to Project Overview.
- Project Overview shows ALL context in one tabbed page.
- No need to visit 4 different modules to understand one project.

---

### Flow 2: Warehouse Keeper Records Goods Receipt

**Goal**: Record delivery of materials from a PO.

```
Start → Inventory module (via sidebar) [1 click]
  → Click "New Receipt" button [2 clicks]
  → Form opens:
    → Search/Select PO reference [type to search]
    → Items auto-populate from PO
    → Enter received quantities
    → Select warehouse
    → Click "Submit" [3 clicks + keyboard inputs]
```

**Optimizations**:
- Automatic PO matching: Prevents manual entry of item lines.
- Quick search filters: Filter POs by supplier or project.
- Over-receipt guard: Visual indicator when received quantity exceeds ordered quantity.

---

### Flow 3: Procurement Officer Converts Requisition (PR) to Order (PO)

**Goal**: Convert an approved PR into a formal Purchase Order and send it to the supplier.

```
Start → Dashboard Alerts
  → Click "Approved PRs Waiting PO" alert [1 click]
  → List loads, click on PR-2026-089 [2 clicks]
  → PR Detail opens: review items and suppliers
  → Click "Convert to PO" button [3 clicks]
  → Form pre-populates with supplier, items, and pricing from vendor agreement
  → Click "Submit PO" [4 clicks total]
```

**Optimizations**:
- Warning triggers if item prices exceed historical averages.
- Multi-supplier split: If a PR contains items from different categories, the system offers to automatically generate split POs in one click.

---

### Flow 4: Fuel Dispatcher Logs Fuel Issuance

**Goal**: Fast logging of fuel dispensed to heavy machinery at the project site.

```
Start → Command Palette (Ctrl+K) [1 key combination]
  → Type "Fuel Dispatch" and hit Enter [Form opens in a side panel]
  → Form inputs:
    → Select/Scan Equipment ID (e.g. CAT-320D) [type to autocomplete]
    → Current Hour Meter value
    → Liters dispensed (auto-read from digital flow nozzle or manual entry)
    → Select Dispatch Tank/Fuel Truck
  → Press Ctrl+Enter [Save & ready next entry]
```

**Optimizations**:
- Headless, ultra-fast entry form designed for high-glare environments.
- Smart validations: Flag warnings if hour meter is lower than the previous log or if liters exceed tank capacity.

---

### Flow 5: Senior Recorder Reviews and Locks Daily Logs

**Goal**: Review daily progress and equipment logs submitted by multiple site Recorders before pushing to ERP payroll/finance.

```
Start → Field Records module [1 click]
  → Click "Daily Logs Pending Review" [2 clicks]
  → Interactive grid shows list of logs grouped by Project and Recorder
  → Scroll through entries, check discrepancies (flagged in red)
  │   → Use keyboard down/up arrows to move, spacebar to view details
  → Multi-select approved entries [spacebar/checkbox click]
  → Click "Bulk Approve & Lock" floating button [3 clicks]
```

**Optimizations**:
- Discrepancy detector: Flags anomalies (e.g., employee logged on two different sites simultaneously, or equipment running 25 hours in a day).
- Excel-like table interaction for rapid correction.
