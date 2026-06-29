# 08. Component Library & Inventory

This document lists the UI components required for the construction ERP system, detailing their functionalities, styling references, and dynamic interactive states.

---

## 1. Core UI Elements (Primitive Components)

Built on top of **Shadcn UI** primitives and styled using Tailwind design system tokens:

- **Button (`<Button />`)**:
  - *Variants*: Primary (Steel Blue), Accent (Safety Orange), Secondary (Slate Muted), Outline (Border-only), Ghost (Text hover), Destructive (Red).
  - *States*: Default, Hover, Active, Disabled, Loading (Spinner replacing text).
- **Badge / Status Indicator (`<Badge />`)**:
  - Used for resource, item, or order statuses.
  - *Types*:
    - `Success`: Green text/tint (e.g., "Received", "Approved").
    - `Warning`: Amber text/tint (e.g., "Pending Review", "Low Stock").
    - `Info`: Blue text/tint (e.g., "In Transit", "Assigned").
    - `Danger`: Red text/tint (e.g., "Overdue", "Rejected").
- **Inputs (`<Input />` & `<Select />`)**:
  - Text fields, numeric input with visual units (e.g., "m³", "Liters", "Hours" pinned to the right edge).
  - Searchable Autocomplete Combobox for heavy lists (e.g., searching amongst 5,000 workers or 12,000 SKUs).

---

## 2. Structural & Layout Components

- **Sidebar (`<Sidebar />`)**:
  - Hosts collapsible group headings ("Operations", "Resources", "Procurement", "Inventory").
  - Hover tooltips for icon-only state.
  - Displays dynamic badges next to items requiring action (e.g., a count badge for pending requisitions).
- **Topbar (`<Topbar />`)**:
  - Houses the Hamburger toggle, global Search bar (`Ctrl+K`), Active Project Selector dropdown, Notification popover, and User Profile menu.

---

## 3. Data Visualization & Analytics

- **KPI Stats Card (`<StatsCard />`)**:
  - Displays a single main metric (e.g., total diesel remaining, active equipment count).
  - Displays a mini trend line chart (sparkline) or a percentage variance indicator (e.g., `+12% vs last week`).
- **Interactive Chart Engine (`<ChartCard />`)**:
  - Framed container around **ApexCharts**.
  - Supports quick timeframe selectors (e.g., `7D`, `30D`, `YTD`) and CSV export triggers.
- **Project Gantt Chart (`<GanttChart />`)**:
  - Built using a lightweight timeline library or customized grid rows showing project phases, milestone lines, and dependency connections.
  - Interactive: Hovering a phase block shows supervisor, budget status, and progress.

---

## 4. Advanced Interactive Modules

- **TanStack Data Grid (`<DataTable />`)**:
  - The workhorse component of the ERP.
  - *Features*: Fixed header, scrollable body, column toggling, multi-sort, global filter input, floating action bar (bulk operations), and custom cell renderers (e.g. inline quantity inputs).
- **Global Command Palette (`<CommandPalette />`)**:
  - Opens on `Ctrl+K`. Uses `cmdk` primitive.
  - Groups commands: "Quick Actions", "Navigation", "Recent Files", and "Search Records".
- **Multi-File/Photo Uploader (`<FileUploader />`)**:
  - Support drag-and-drop file imports (e.g. scanning delivery receipts or equipment inspection photos).
  - Shows thumbnail preview, upload progress bar, and validation alerts (e.g., file too large, invalid format).
- **Barcode & QR Scanner Component (`<BarcodeScanner />`)**:
  - Utilizes device camera or external scan inputs.
  - Placed inside a modal trigger on the Goods Receipt and Stock Transfer forms.
- **Inline Quantity Incrementer (`<QtyInput />`)**:
  - Quick count input with plus/minus buttons, and instant change reflection (used in stocktaking and parts requests).
