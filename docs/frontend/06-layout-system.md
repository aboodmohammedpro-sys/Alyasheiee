# 06. Layout System

This document describes the layout grid system, structure templates, and responsive layouts designed for the **Construction ERP System**. The layout structure maximizes spatial usage, ensures consistent navigation, and adapts to screen widths ranging from 4K monitors to handheld mobile devices.

---

## 1. Global Shell Layout

The global application shell is wrapped in a top-level layout with the following hierarchy:

```
+-------------------------------------------------------------------------+
|                                  TOPBAR                                 |
| [Project Selector] [Global Search (Ctrl+K)]     [Notifications] [Profile]|
+-------------------+-----------------------------------------------------+
|                   |                                                     |
|                   |                      CONTENT CANVAS                 |
|      SIDEBAR      |                                                     |
| (Collapsible,     |  +-----------------------------------------------+  |
|  grouped by       |  | Page Header                                   |  |
|  domains)         |  | [Page Title]                 [Action Buttons] |  |
|                   |  +-----------------------------------------------+  |
|                   |  |                                               |  |
|                   |  |                 PAGE CONTENT                  |  |
|                   |  |       (Grid Layout / Cards / Data Table)      |  |
|                   |  |                                               |  |
|                   |  +-----------------------------------------------+  |
+-------------------+-----------------------------------------------------+
```

### Next.js 15 Directory Shell Structure
```
app/
└── (dashboard)/
    ├── layout.tsx         # Left sidebar + topbar layout wrapper
    ├── page.tsx           # Global landing page
    ├── projects/
    │   ├── layout.tsx     # Project sub-navigation layout (tabbed menu)
    │   └── page.tsx
    └── inventory/
        └── page.tsx
```

---

## 2. Sidebar States
The sidebar serves as the main command center and features three distinct layouts:

1. **Expanded (Default Desktop - width: `280px`)**: Displays full titles, sub-menus, and resource badges (e.g. number of pending approvals).
2. **Collapsed (Compact Desktop - width: `72px`)**: Shows icons only, with hover tooltips displaying sub-menus. Activates when screen size is small or by user choice (saved in localStorage).
3. **Off-canvas (Tablet/Mobile)**: Completely hidden. Slides in from the left when clicking the hamburger menu icon in the topbar.

---

## 3. The Grid & Alignment System
The layout utilizes a structured CSS Grid/Flexbox approach using Tailwind spacing guidelines.

- **Main Container Padding**: 
  - Desktop: `px-8 py-6` (large breathing space).
  - Tablet: `px-6 py-4` (medium utility density).
  - Mobile: `px-4 py-4` (compact spacing).
- **Responsive Grid Columns**:
  - Dashboard panels use a 12-column grid system:
    - Primary KPIs: `grid-cols-1 md:grid-cols-2 xl:grid-cols-4` (4 items in a row on widescreen, stacked on mobile).
    - Analytics + Logs: `grid grid-cols-1 lg:grid-cols-3 gap-6` (2/3 width for ApexCharts, 1/3 width for action items).

---

## 4. Modal, Dialog & Drawer Strategy
We divide temporary context overlays into two categories based on screen space and content length:

```
          [ Context Dialog Selection ]
                       │
             Content size & complexity?
             /                        \
      (Short & Simple)            (Long Form / Deep Detail)
           /                            \
   [ Center Modal ]                [ Right Drawer ]
   - Confirmation popups           - Create/Edit forms
   - Quick settings                - Detail inspection sheets
   - Barcode scanners              - Sub-item lists
```

### Center Modals (Dialogs)
- **Use Cases**: Delete confirmations, quick item transfers, nozzle calibration inputs.
- **Implementation**: Radix UI Dialog wrapper styled with Shadcn.
- **Constraints**: Maximum width of `md:max-w-[480px]`.

### Right Drawers (Sheets)
- **Use Cases**: Create Requisition Form, Project Phase Editor, Employee Profile summary.
- **Implementation**: Portal-rendered panel that slides from the right edge, filling `100%` viewport height and `width: 100%` on mobile, `450px` to `650px` on desktop.
- **Optimizations**: Prevents loss of page context. Background content scroll is locked, and pressing `ESC` checks for form dirty-states before closing.
