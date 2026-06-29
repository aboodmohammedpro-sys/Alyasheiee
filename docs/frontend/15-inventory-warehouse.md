# 15. Inventory & Warehouse Module Spec

This document details the screens, transactions, workflows, and UI specifications for the **Inventory and Warehouse Management Module (Phase 1)**.

---

## 1. Page Inventory & Routing

The Inventory Module is structured under the `/inventory` directory:

| Route Path | Screen Type | Render Context | Purpose |
| :--- | :--- | :--- | :--- |
| `/inventory/items` | List Screen | Client Component | Master Catalog of items, materials, and parts with low-stock alerts. |
| `/inventory/items/[id]` | Details Screen | Mixed (Server Shell) | Specific stock levels across multiple yards, historical consumption, SKU details. |
| `/inventory/warehouses` | Dashboard View | Client Component | Grid of yards, field depots, and warehouses showing overall material values. |
| `/inventory/transactions` | List Screen | Client Component | Ledger list of all stock receipts, transfers, and inventory adjustments. |
| `/inventory/transactions/receipt` | Create Screen | Client Component | Form to record incoming PO deliveries (supports barcode scans). |
| `/inventory/transactions/transfer` | Create Screen | Client Component | Form to transfer stocks between warehouses or projects. |

---

## 2. Screen Specifications

### 2.1 Master Items Catalog (`/inventory/items`)
- **Key Columns**: SKU Code (monospaced), Item Name, Category, UOM (Unit of Measure), Total Available Qty, Unit Price (average cost), Status Badge (In Stock / Low Stock / Out of Stock).
- **Interactive Widgets**:
  - `Import CSV` action (for bulk catalog import).
  - `Export Inventory Report` button.
- **Filters**:
  - *Warehouse*: Multi-select dropdown to view stock count inside particular yards.
  - *Category*: Filter by fuel, cement, steel, mechanical parts, protective gear.
  - *Stock Alert*: Toggle to show ONLY items below their safety stock thresholds.

### 2.2 Goods Receipt Note Screen (`/inventory/transactions/receipt`)
- **Objective**: Create a ledger record when materials arrive on-site from a vendor.
- **Form Layout**:
  - Header: Select Purchase Order (PO) reference number. Selecting a PO automatically fetches item lists, quantities ordered, and prices from the database.
  - Line Items Grid: An editable table showing:
    - Item Description, UOM, Ordered Qty, Received Qty (input), Pending Qty (calculated).
    - Status Indicator: Shows green check if quantities match, amber if under-delivered, red highlight if over-delivered.
  - Action Panel: "Scan Barcode" toggle. Activates camera barcode scanner modal to match items automatically by scanning codes on packaging.

### 2.3 Inter-Warehouse Transfer Screen (`/inventory/transactions/transfer`)
- **Objective**: Log movements of items between storage yards or direct transfer to a project site.
- **Form Layout**:
  - Selection: Source Warehouse (Select), Destination Warehouse/Project (Select).
  - Items Selector: Searchable multiselect combobox. Displays warning if item stock is insufficient in the source warehouse.
  - Quantity Inputs: Dynamic list showing available quantity vs. transfer quantity.

---

## 3. Drawers & Dialogs Inventory

- **Inventory Adjustment Dialog (`<StockAdjustmentDialog />`)**:
  - Triggered by Warehouse Keepers to record write-offs, damages, or discrepancies found during physical stocktakes.
  - Fields: Item SKU, Physical Count, System Count, Adjustment Reason, Attach Inspector Photo.
- **Barcode Scanner Overlay (`<ScannerModal />`)**:
  - Modal overlay accessing camera media streams to capture and decode barcodes/QR codes, populating form quantities instantly.
- **Create Warehouse Drawer (`<WarehouseFormDrawer />`)**:
  - Fields: Yard/Warehouse Name, Location (GPS Coordinates / Map Picker), Warehouse Keeper (Select), Capacity parameters.
