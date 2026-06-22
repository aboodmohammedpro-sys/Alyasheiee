# 32. Soft Delete Strategy

## Implementation
- Every domain model MUST use the `SoftDeletes` trait.
- Column: `deleted_at`.

## Audit Connection
- When a resource is soft deleted, the `Audit Log` must record the user responsible.
- Use `deleted_by` foreign key in the table schema for quick filtering of "Who deleted this project?".

## Rules
- **Cascading Soft Deletes**: Carefully handle children. If a Project is deleted, its Phases should also be marked as deleted (managed via Observers).
- **Uniqueness**: Be aware that soft-deleted items still exist. Use a unique index that includes `deleted_at` or handles `null` values correctly to allow re-creating a project with the same code after deletion.
- **Cleanup**: Provide an "Admin Trash" view where items can be permanently deleted or restored.
