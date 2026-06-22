# 14. Authorization Strategy

## Core Implementation
- **Package**: Spatie Laravel-Permission.
- **Method**: Combination of **Roles** and **Level 2 Permissions**.

## Architectural Rules
1. **RBAC (Role Based Access Control)**: High-level access (e.g., "Project Manager" can see all project menus).
2. **Permission Based**: Granular access (e.g., `projects.edit`, `procurement.approve`).
3. **Laravel Policies**: All Controller methods MUST authorize through a Policy.
    - Example: `$this->authorize('update', $project);` calls `ProjectPolicy@update`.

## Hierarchy logic
- `System Admin`: Inherits all permissions (Gate::before check).
- `Company Manager`: Can see all data across all projects but cannot delete logs.
- `Project Manager`: Restricted to projects assigned to them (via Custom Scopes in Policy).
