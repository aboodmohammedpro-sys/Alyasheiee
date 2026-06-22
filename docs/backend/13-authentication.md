# 13. Authentication Strategy

## Core mechanism
- **Package**: Laravel Sanctum.
- **Provider**: Standard `users` table.

## Features
1. **Token Lifetime**: 24 hours (configurable in `config/sanctum.php`).
2. **Device Tracking**: Every token creation must specify a device name (e.g., "iPhone 13 - Site Supervisor App").
3. **Revocation**:
    - `POST /logout`: Revoke current token.
    - `POST /logout-all`: Revoke all active sessions for the user.
4. **Secure Storage**: Tokens should be hashed in the DB (Sanctum default).

## Implementation Flow
- User logs in via Email/Password.
- Server validates and returns a Plain-text token.
- Mobile/Web client stores token in Secure Storage / HttpOnly Cookie.
- All subsequent requests include `Authorization: Bearer <token>`.
