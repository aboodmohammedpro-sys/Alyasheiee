# 12. Response Format

## Standard JSON Structure

### Success Response
```json
{
    "success": true,
    "data": { ... },
    "meta": {
        "timestamp": "2024-03-20T10:00:00Z",
        "version": "1.0.0"
    }
}
```

### Collection Response (Paginated)
```json
{
    "success": true,
    "data": [ ... ],
    "links": {
        "first": "...",
        "last": "...",
        "prev": null,
        "next": "..."
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 5,
        "per_page": 15,
        "to": 15,
        "total": 75
    }
}
```

### Error Response
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_FAILED",
        "message": "The given data was invalid.",
        "details": {
            "field_name": ["This field is required."]
        }
    }
}
```

## HTTP Codes
- **200 OK**: Request successful.
- **201 Created**: Resource created successfully.
- **400 Bad Request**: Logic error or business rule violation.
- **401 Unauthorized**: Missing/Invalid token.
- **403 Forbidden**: Token valid but lack of permissions.
- **404 Not Found**: Resource doesn't exist.
- **422 Unprocessable Entity**: Validation errors.
- **500 Internal Server Error**: Unexpected crash.
