# 18. Reporting & Analytics Screens

This document defines the interface standards, component setups, and analytical models for **Reporting and Analytics screens** utilizing **ApexCharts** and data table exports.

---

## 1. Analytics Layout Grid

Reporting screens are divided into a fluid dashboard layout that prioritizes high-level KPIs before diving into detailed chart breakdowns.

```
+--------------------------------------------------------------------------+
|  [ Date Range: Last 30 Days v ]  [ Project: All v ]      [ Export PDF ]  |
+--------------------------------------------------------------------------+
|  +------------------+  +------------------+  +------------------------+  |
|  | Fuel Dispensed   |  | Material Value   |  | Active Machineries     |  |
|  | 14,250 Liters    |  | $425,100         |  | 82 Units               |  |
|  +------------------+  +------------------+  +------------------------+  |
|                                                                          |
|  +--------------------------------------------------------------------+  |
|  | Primary Consumption Chart (Line / Area ApexChart)                 |  |
|  | [Chart Canvas]                                                     |  |
|  +--------------------------------------------------------------------+  |
|                                                                          |
|  +----------------------------------+  +------------------------------+  |
|  | Expense Allocation (Donut Chart) |  | Supplier Performance (Bar)   |  |
|  | [Chart Canvas]                   |  | [Chart Canvas]               |  |
|  +----------------------------------+  +------------------------------+  |
+--------------------------------------------------------------------------+
```

---

## 2. ApexCharts Component Integrations

To prevent rendering lags on dashboards containing multiple charts, we follow these integration rules:

- **Dynamic Imports**: ApexCharts is dynamically loaded on the client side with Server-Side Rendering (SSR) disabled.
  ```typescript
  import dynamic from 'next/dynamic';
  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
  ```
- **Consistent Configs**: Chart themes are linked to Tailwind CSS tokens. Color hex codes are fetched dynamically from the theme settings (e.g. Primary Steel Blue and Accent Safety Orange) to ensure charts match Light/Dark mode changes instantly.
- **ApexCharts Types Used**:
  - **Area Charts**: Used for cumulative fuel consumption over time and project progress trends.
  - **Bar Charts (Horizontal)**: Used to compare equipment utilization (Working vs. Idle hours) and supplier delivery times.
  - **Donut/Pie Charts**: Used for budget breakdown by project phase and inventory asset valuation by warehouse.
  - **Radial Bar Gauges**: Used to show milestone completion percentages.

---

## 3. Tabular Reporting Sheets

Every chart dashboard is paired with a corresponding tabular detail view below it, providing the raw data source.

- **Sync Filters**: Modifying filters at the top of the reporting dashboard (e.g. date range, project name) updates both the ApexCharts datasets and the TanStack Table data grid simultaneously.
- **Pagination Limits**: Tabular reports default to `100` rows per page to allow rapid scrolling of audit data.

---

## 4. Report Exports & Document Generation

Construction managers require reports in physical or shareable spreadsheets for executive reviews. We support three export pipelines:

1. **CSV Export (Client-Side)**:
   - Raw data downloaded directly as a comma-separated values file using browser buffers. Fast and cost-effective.
2. **Excel Export (xlsx)**:
   - Generated using `xlsx` library on the client or server side, containing formatted grids and summary rows.
3. **PDF Document Generation (Server-Side)**:
   - Clicking "Export PDF" calls a Laravel backend endpoint.
   - The backend renders a clean, styled HTML view and converts it to a print-ready PDF using a tool like DomPDF or Puppeteer.
   - A loading overlay with a progress indicator is displayed on the frontend during the generation process.
