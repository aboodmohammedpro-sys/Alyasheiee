# 02. UI & UX Strategy

This document details the UI/UX design philosophy and interaction strategy for the **Construction ERP System**. Operating in the heavy-duty construction sector requires a unique UI/UX approach: field-ready, high-speed, dense, and error-tolerant interfaces.

---

## 1. Core Principles: Field-Ready & High-Speed

Our design is inspired by high-productivity tools like **Linear, Stripe Dashboard, Odoo, and Notion**, optimized for rugged construction management environments.

```
       [ UX Core Pillars ]
  ┌─────────────────────────┐
  │ 1. Zero-Latency Feel    │ ─── Light DOM, caching, instant UI responses
  ├─────────────────────────┤
  │ 2. Command-Driven       │ ─── Command palette (Cmd+K) & keyboard shortcuts
  ├─────────────────────────┤
  │ 3. Data Density         │ ─── Maximum data visible without clutter
  ├─────────────────────────┤
  │ 4. Single-Tap Entry     │ ─── Smart defaults, inline edits, bulk operations
  └─────────────────────────┘
```

- **Speed as a Feature**: Any action that takes more than 100ms to visually reflect is optimized. We use **optimistic UI updates** for frequent operations (e.g., toggling item statuses, adding inventory items).
- **Reduced Click Budget**: No critical business flow should require more than **3 clicks** from the main dashboard.
- **Form Efficiency**: Hand-off from mouse to keyboard must be seamless. All input forms must support logical tab flows, autofocus on initial fields, and keyboard submission (e.g., `Ctrl + Enter` to save).

---

## 2. Interface Density & Typography
Construction ERPs process vast grids of materials, equipment, and labor hours. 

- **Density Modes**:
  - **Compact (Default)**: Tight row heights (36px for table rows), smaller fonts (13px/14px), and minimized padding. Designed for desktop power-users (Accountants, Procurement, PMs).
  - **Standard**: Moderately spaced rows (48px table rows), larger touch targets (14px/16px font size). Designed for tablet-using field managers (Supervisors, Dispatchers).
- **Typography Hierarchy**:
  - Utilizing a modern, clean geometric typeface (e.g., **Inter** or **Outfit**) for high legibility in tables and numbers.
  - Monospace font (`JetBrains Mono` or standard CSS monospace) for all numeric quantities, purchase order IDs, item codes, and status numbers to prevent shifting layouts and align decimals.

---

## 3. Keyboard Navigation & Command Palette

To achieve professional-grade speed, the system integrates a global **Command Palette** and keyboard shortcuts.

```
  ┌────────────────────────────────────────────────────────┐
  │ Search anything, roles, reports or settings...  (Ctrl+K)│
  ├────────────────────────────────────────────────────────┤
  │  Suggestions                                           │
  │  > Create Purchase Requisition (PR)           [N then P]│
  │  > Dispatch Fuel Log                          [N then F]│
  │  > View Active Equipment List                     [G + E]│
  │  > Open Warehouse Receipts Dashboard              [G + W]│
  └────────────────────────────────────────────────────────┘
```

### Global Keyboard Shortcuts
- `Ctrl + K` or `Cmd + K`: Open Command Palette.
- `Esc`: Close any active modal, drawer, or clear search filters.
- `N + P`: Quick create **P**urchase Requisition.
- `N + F`: Quick dispatch **F**uel log.
- `G + P`: **G**o to **P**rojects dashboard.
- `G + I`: **G**o to **I**nventory dashboard.
- `Ctrl + S` / `Cmd + S` (within forms): Save changes.

---

## 4. Bulk Operations & Inline Editing
Power users spend hours managing lists of assets or procurement items.

- **Bulk Select Actions**: Select multiple checkboxes in any TanStack Table to trigger a floating context action bar:
  - *Bulk Approve* (for PRs/POs)
  - *Bulk Transfer* (for inventory items)
  - *Bulk Assign* (assigning multiple equipments to a project)
- **Inline Excel-Like Editing**: double-clicking a cell in tables like "Inventory Adjustments" or "Daily Fuel Logs" switches it to an input field immediately, saving on blur or `Enter` press.

---

## 5. Smart Search & Quick Create

- **Unified Smart Search**: Type-ahead search across tables that queries multiple fields at once (e.g., typing "CAT 320" matches equipment code, model, and current project assignment).
- **Quick Create Drawers**: Clicking "Create" does not redirect users away from their current page. Instead, a right-side drawer slides in. Users fill out the details and hit submit, keeping their work context intact.

---

## 6. Layout Adaptation (Large Screens vs. Tablets)
Field personnel use tablets (iPads, Android tablets) in trucks and field trailers.

- **Desktop (>=1200px)**: Left collapsible navigation sidebar, split-pane tables, active detail sidebars.
- **Tablet (768px - 1024px)**: Touch-optimized sidebar toggles, double-tap actions replaced by explicit icon buttons, scrollable tables with frozen columns (e.g., item name/code always stays visible on horizontal swipe).
