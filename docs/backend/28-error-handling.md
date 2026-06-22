# 28. Error Handling

## Centralized Handling
- **Location**: `app/Exceptions/Handler.php` (or Bootstrap approach in Laravel 11/12).

## Error Hierarchy
1. **ValidationException**: Return 422 with field details.
2. **AuthenticationException**: Return 401.
3. **AuthorizationException**: Return 403.
4. **DomainException**: (Custom base for business logic) Return 400 with a clear error code (e.g., `INSUFFICIENT_STOCK`).
5. **ModelNotFoundException**: Return 404.
6. **Generic Exception**: Return 500 (Hide details in production, log to Sentry/Flare).

## Response Transformation
Ensure all errors follow the format defined in `12-response-format.md`.
```json
{
  "success": false,
  "error": { "code": "...", "message": "..." }
}
```
