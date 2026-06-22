# 09. Mobile API Strategy

## Mobile-Specific Needs
1. **Low Latency**: Minimize nested includes. Use `flat` resources where possible.
2. **Offline Support**: Include `updated_at` timestamps for delta-syncing.
3. **Optimized Payloads**: Mobile apps often only need IDs and Names for picklists.
4. **Push Notifications**: Integrated with FCM (Firebase Cloud Messaging).

## Endpoints Focused on Field Workers
- `/api/v1/mobile/assignments`: View current assignments for the logged-in user.
- `/api/v1/mobile/stock-movement`: Quick receipt/issue (Barcode-ready).
- `/api/v1/mobile/projects` (Summary): Quick progress updates.

## Technical Requirements
- **Sanctum Device Name**: Track device type (e.g., "Android - Galaxy S22").
- **Asset Resizing**: Generate thumbnails for project attachments.
