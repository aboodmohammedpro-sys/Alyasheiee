# 11. Shared API Logic

## Shared Utilities
1. **File Management**: Unified endpoint for uploading project docs, ID photos, or supplier invoices.
2. **Lookups (Picklists)**:
    - `/api/v1/lookups/warehouses`
    - `/api/v1/lookups/item-categories`
    - `/api/v1/lookups/suppliers`
3. **User Profile**:
    - `/api/v1/me`
    - `/api/v1/me/notifications`

## Architecture Integration
Shared APIs reside in `app/Modules/Shared/Controllers`. They utilize shared services for cross-module tasks like barcode generation or currency conversion.
