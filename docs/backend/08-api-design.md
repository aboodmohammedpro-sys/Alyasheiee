# 08. API Design

## مجموعات APIs الجديدة
1. **العمليات اليومية (Daily Operations)**: `/api/v1/daily-logs`.
2. **إدارة الوقود (Fuel)**: `/api/v1/fuel-dispense`.

## General Principles
1. **RESTful Headers**:
    - `Accept: application/json`
    - `Content-Type: application/json`
    - `Authorization: Bearer <token>`
2. **Versioning**:
    - Prefix: `/api/v1`
3. **URL Naming**:
    - Plural resources: `/projects`, `/warehouses`.
    - Logical nesting: `/projects/{id}/phases`.
4. **Statelessness**: No session state, use Sanctum tokens.

## Common Operations
| Method | URI | Description |
|---|---|---|
| GET | `/api/v1/{module}` | List with filters/pagination |
| POST | `/api/v1/{module}` | Create a resource |
| GET | `/api/v1/{module}/{id}`| Get details |
| PUT/PATCH | `/api/v1/{module}/{id}` | Update |
| DELETE | `/api/v1/{module}/{id}` | Soft Delete |

## Best Practices
- **Pagination**: Use `lengthawarepagination`.
- **Filtering**: Use `Spatie/laravel-query-builder` for standardized filtering.
- **Sorting**: Standard `?sort=-created_at`.
- **Fields**: Allow `?fields=id,name` to reduce payload.
