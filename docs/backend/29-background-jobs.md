# 29. Background Jobs

## Queue Management
- **Driver**: Redis or Database (Redis preferred for ERP performance).
- **Tool**: Laravel Horizon (highly recommended for monitoring).

## Candidate Tasks
1. **Reporting**: Generating massive Excel files from 10,000+ movements.
2. **Notifications**: Sending emails or push notifications for order approvals.
3. **Synchronization**: Syncing stock levels to cached tables.
4. **Cleanups**: Deleting old export files or rotating logs.
5. **Media Processing**: Resizing equipment photos or site snapshots.

## Queue Priorities
- `high`: Critical alerts, Approval notifications.
- `default`: Regular events, smaller exports.
- `low`: Heavy analytics exports, data cleanup.
