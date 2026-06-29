# 16. Procurement & Purchasing Module Spec

This document details the interfaces, approval loops, and tracking panels for the **Procurement and Purchasing Module (Phase 1)**.

---

## 1. Page Inventory & Routing

The Procurement Module is structured under the `/procurement` directory:

| Route Path | Screen Type | Render Context | Purpose |
| :--- | :--- | :--- | :--- |
| `/procurement/suppliers` | List Screen | Client Component | Directory of approved vendors, ratings, contact terms. |
| `/procurement/requisitions` | List Screen | Client Component | Purchase Requisition (PR) center showing approval stages. |
| `/procurement/requisitions/[id]` | Details Screen | Client Component | PR Review panel with item line validation and approval actions. |
| `/procurement/requisitions/new` | Create Screen | Client Component | Item requisition form builder (with autocomplete). |
| `/procurement/orders` | List Screen | Client Component | Purchase Order (PO) tracking log. |
| `/procurement/orders/[id]` | Details Screen | Client Component | PO review with PDF export and delivery status timeline. |

---

## 2. Screen Specifications

### 2.1 Purchase Requisition (PR) List & Detail View
- **PR List Columns**: Requisition ID (monospaced), Requesting Project, Creator (Recorder/Supervisor), Submission Date, Total Estimated Value, Current Stage Badge (`Draft` -> `Pending PM` -> `Pending Central Manager` -> `Approved` -> `Converted to PO`).
- **PR Details Board (`/procurement/requisitions/[id]`)**:
  - Split layout: Left panel shows requisition headers and timeline logs; right panel lists item quantities and cost estimates.
  - **Approval Control Pad**:
    - Accessible only to authorized roles.
    - Buttons: `Approve Requisition` (green), `Reject Requisition` (red, triggers reason dialog).

### 2.2 Requisition Form wizard (`/procurement/requisitions/new`)
- **Step 1: Header Info**: Select Project, Target Delivery Date, Delivery Location.
- **Step 2: Items Array**: Dynamic table utilizing `useFieldArray`.
  - Item selector autocomplete connects to the global catalog.
  - Input field for required quantities.
  - Auto-calculates total estimated cost based on average item purchase costs in the inventory system.
- **Step 3: Justification**: Text field for requisition justification, and drag-and-drop zone to attach specifications (drawings, engineer requirements).

### 2.3 Purchase Order (PO) Details & PDF Print Layout
- **Objective**: Detailed contract template generated for the vendor.
- **Preview Canvas**:
  - Rendered in a crisp, high-contrast document viewer inside the app.
  - Displays company logo, vendor details, payment terms, shipment terms (FOB/CIF), and an itemized pricing table.
  - Action Panel:
    - `Print PO` or `Download PDF`.
    - `Send to Vendor` (sends PDF attachment to supplier email automatically).
    - `Record Delivery Status` (quick link to Goods Receipt Form).

---

## 3. Drawers & Dialogs Inventory

- **Rejection Comment Dialog (`<RejectionDialog />`)**:
  - Modal prompt appearing when an approver clicks "Reject".
  - Forces the user to select a reason code (e.g. "Over Budget", "Inaccurate SKU", "Existing Inventory Available") and provide a descriptive feedback note.
- **Create Supplier Drawer (`<SupplierFormDrawer />`)**:
  - Fields: Vendor Business Name, TAX/VAT Registration ID, Trade License Number, Categories list, Credit Limit Days, Contact Person details.
- **Split PO Dialog (`<SplitPODialog />`)**:
  - If a Requisition contains items belonging to different suppliers, this popup lets the Procurement Officer check-off which items go to which supplier, generating split PO drafts in a single action.
