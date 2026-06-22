# 12. تنسيق الاستجابة (Response Format)

## هيكل JSON الموحد

### استجابة النجاح (Success)
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

### استجابة المجموعات (Paginated)
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
        "total": 75
    }
}
```

### استجابة الخطأ (Error)
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_FAILED",
        "message": "البيانات المقدمة غير صالحة.",
        "details": {
            "field_name": ["هذا الحقل مطلوب."]
        }
    }
}
```

## أكواد HTTP
- **200 OK**: نجاح الطلب.
- **201 Created**: تم إنشاء المورد بنجاح.
- **400 Bad Request**: خطأ منطقي أو انتهاك لقاعدة عمل.
- **401 Unauthorized**: توكن مفقود أو غير صالحة.
- **403 Forbidden**: التوكن صالحة ولكن لا تملك الصلاحية.
- **404 Not Found**: المورد غير موجود.
- **422 Unprocessable Entity**: أخطاء في التحقق من البيانات (Validation).
- **500 Internal Server Error**: خطأ غير متوقع في الخادم.
