# 16. Validation Strategy

## Two-Tier Validation

### 1. Request Validation (Syntactic)
- **Tool**: Laravel `FormRequests`.
- **Location**: `app/Modules/{Module}/Requests/`.
- **Purpose**: Validate data types, existence of foreign keys, and string lengths.
- **Example**: `quantity` is numeric and > 0.

### 2. Service Validation (Semantic/Business)
- **Tool**: Domain Exceptions / Custom logic.
- **Location**: Inside `app/Modules/{Module}/Services/`.
- **Purpose**: Complex cross-check logic.
- **Example**: "Can we issue 50L of Diesel?"
    - Check current stock in Warehouse A.
    - Check if Project B is active.
    - Check if Equipment C is working.
- **Throw**: `StockInsufficientException`.

## Validation Rules Best Practices
- Never use direct strings in validation; use Enums for `status` (e.g., `Rule::enum(ProjectStatus::class)`).
- Use `exists:table,id` carefully in multi-tenant environments (verify ownership).
