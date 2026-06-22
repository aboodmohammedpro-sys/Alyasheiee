# 10. Web API Strategy

## Web-Specific Needs
1. **Complex Dashboards**: Aggregated endpoints for project stats.
2. **Bulk Actions**: Support for bulk approvals or inventory adjustments.
3. **Exporting**: Integration with background jobs for Excel/PDF reports.
4. **Deep Filtering**: High-level managers need complex date range and status filters.

## Dedicated Endpoints
- `/api/v1/web/reports/inventory-aging`
- `/api/v1/web/projects/bulk-update`
- `/api/v1/web/admin/users-activity`

## Technical Requirements
- Use **API Resources** to expose full relational data (include breadcrumbs, counts, etc.).
- Intensive use of `eager loading` (with() / load()) to prevent N+1 issues in large tables.
