# 21. Mobile & Tablet Responsiveness

This document details the layout adjustments, touch guidelines, and design strategies implemented to ensure a high-quality user experience on mobile and tablet devices.

---

## 1. Field Device Specifications

Field operations are primarily executed on **tablets (e.g., iPad, Galaxy Tab)** carried by Supervisors and Dispatchers, or **smartphones** carried by Recorders in trucks.

- **Min Target Size**: Any interactive element (buttons, tabs, inputs, checkboxes) must have a tap target of at least **48px x 48px** to accommodate fingers and industrial gloves.
- **Form Field Gaps**: Horizontal padding within forms is increased on touch interfaces (`py-3` instead of `py-1.5`) to prevent accidental taps on surrounding fields.
- **Typography Adjustment**: Small `text-xs` (12px) text used in desktop grids is scaled up to `text-sm` (14px) on screens below `768px` to ensure readability outdoors.

---

## 2. Table Scrolling & Layout Strategy

Data tables are difficult to fit on small mobile screens. We apply two distinct viewport adaptations:

### Option A: Frozen Column Horizontal Scroll (Tablet - `768px - 1024px`)
- The table container allows horizontal scroll (`overflow-x-auto`).
- The primary identifying column (e.g., *Equipment Code* or *Worker Name*) is sticky to the left side and remains frozen as the user scrolls horizontally to view quantities or dates.
- A subtle gradient overlay indicates that more columns are visible by scrolling.

### Option B: Card Transformation (Mobile - `<768px`)
- Tabular grids are transformed into a vertical list of cards:
  ```
  +--------------------------------------------+
  | SKU: CMN-001 (Cement Portland Type I)      |
  | Warehouse: Central Yard                    |
  | Stock Level: 450 Bags [ In Stock ]         |
  +--------------------------------------------+
  | SKU: STL-12M (Steel Rebar 12mm)            |
  | Warehouse: Site B Depot                    |
  | Stock Level: 12.3 Tons [ Low Stock ]       |
  +--------------------------------------------+
  ```
- Columns are stacked vertically within each card, and actions (e.g. edit, delete) are housed inside a dropdown context menu trigger in the card corner.

---

## 3. Touch-First Interactions & Gestures

- **Hover Fallbacks**: Tooltips and hover cards are replaced by explicit click/tap actions on touch devices. For example, hovering an equipment status icon showing details is converted to a tap that opens a small bottom sheet.
- **Swipe Actions**: Lists (e.g. daily logs waiting review) support touch swipe actions:
  - Swipe Right: Approve log (reveals green background).
  - Swipe Left: Open details drawer (reveals grey background).
- **Sticky Actions Footer**: In forms or checklists, the submit button locks to the bottom of the device viewport (`sticky bottom-0 bg-background/95 backdrop-blur-md border-t`), saving the user from scrolling all the way to the end to save.

---

## 4. Progressive Web App (PWA) Capabilities

To ensure the application behaves like a native app on field tablets:
- **Manifest Configuration**: Includes app icons, splash screens, and matches address-bar styling to primary theme colors.
- **Service Worker Caching**: Static assets (CSS, fonts, layout components) are cached locally on first load, enabling the application shell to load instantly even without an active internet connection.
- **Local Database Sync**: If the device loses internet connection, the application displays a persistent offline status badge, caching data mutations locally until connection is restored.
