# 04. Folder Structure

## Project Layout

```text
alyasheiee/
├── app/
│   ├── Modules/                # The Core of the system
│   │   ├── ProjectManagement/
│   │   ├── ResourceAllocation/
│   │   ├── Procurement/
│   │   ├── Warehouse/
│   │   └── Shared/              # Shared logic (Media, Tags, etc.)
│   ├── Core/                    # Framework extensions
│   │   ├── Traits/
│   │   ├── Contracts/
│   │   └── AbstractClasses/
│   └── Providers/
├── config/
├── database/
│   ├── migrations/             # Standard Laravel migrations (centralized for deployment simplicity)
│   ├── seeders/
│   └── factories/
├── docs/
│   └── backend/                # Current Documentation
├── public/
├── resources/
├── routes/
│   ├── api_v1.php              # Global API entry
│   └── web.php
└── tests/
    ├── Unit/
    └── Feature/
```

## Module Internal Details
- **Services**: MUST implement an interface if they are meant to be called from other modules.
- **DTOs**: Used strictly for input to Services (Service parameters should ideally be DTOs).
- **Enums**: All statuses, types, and categories must be Enums (PHP 8.1+ features).
- **Repositories**: Standardize data fetching (e.g., specific scopes for "Active" projects).
