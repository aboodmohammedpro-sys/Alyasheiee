# 27. Audit Log Strategy

## Tracking Everything
- **Package**: `Spatie Activitylog`.
- **Global Rule**: All major Models (Project, PO, StockMovement) must use the `LogsActivity` trait.

## Information to Record
1. **User**: Who initiated the change.
2. **Action**: `created`, `updated`, `deleted`, `restored`.
3. **Payload**:
    - `old`: Values before update.
    - `attributes`: Values after update.
4. **Metadata**:
    - `ip_address`
    - `user_agent`
    - `request_id` (for tracing)

## Retention Policy
- Audit logs should never be hard deleted from the application. 
- Archive logs older than 2 years to a secondary cold storage database if performance impacts main operations.
