# 35. Important Architectural Notes

## Critical Warnings for Developers
1. **Never Bypass Repositories**: Do not use `Project::where(...)` in a Controller.
2. **Use Enums**: If you see a string like `'active'` in a service, refactor to `ProjectStatus::ACTIVE`.
3. **Check Policies**: Every new action in a Controller MUST have a corresponding policy check.
4. **Mind the N+1**: Always check Laravel Telescope or Debugbar for duplicated queries in index methods.
5. **Polymorphism Power**: Remember that `StockMovement` can point to anything. If you add a "Maintenance" module, it can immediately start receiving stock without changing the Warehouse code.

## Enterprise Mindset
Build for the company that will use this for 10 years, not the developer who wants to finish in 10 minutes.
- **Documentation**: Keep these files updated.
- **Tests**: Write Feature tests for every business flow (Procurement Flow is priority #1).
