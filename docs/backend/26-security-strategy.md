# 26. Security Strategy

## Multi-Layer Security

### 1. Infrastructure
- **Rate Limiting**: Applied via Laravel Middleware to all API routes (e.g., 60 requests/min).
- **SSL**: Force HTTPS.

### 2. Application
- **UUIDs**: Prevent ID enumeration attacks (hiding total count of entries).
- **Mass Assignment**: Use `$fillable` or `$guarded` strictly.
- **Path Traversal**: Validate and sanitize all file uploads. Store files outside of `public/` using Symlinks.

### 3. Data
- **Soft Deletes**: Prevent accidental data loss.
- **Audit Logs**: Record who changed what.
- **Hashing**: Passwords must use `argon2id` (Laravel default).

### 4. Input Validation
- **Sanitization**: Strip tags from text inputs logic.
- **Strong Types**: Use Type Hinting throughout the Service layer.
