# 30. Reporting Strategy

## Technology Stack
- **Engine**: `Laravel-Excel` (Maatwebsite).
- **Format Support**: XLSX, CSV, PDF (via Snappy or DomPDF).

## Export Architecture
1. User clicks "Export Inventory".
2. Backend creates a `ReportExport` record.
3. Job is dispatched with the `ReportExport` ID.
4. User receives a notification ("Your report is ready").
5. User downloads from a secure temporary URL.

## High Performance Reporting
- Use **Chunking** and **FromQuery** to stream data directly from DB to file without filling RAM.
- Utilize **Eloquent Snapshots** for historical reports (e.g., "Inventory level on Jan 1st").
