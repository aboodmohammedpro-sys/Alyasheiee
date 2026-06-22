# 03. Module Architecture (Modular Monolith)

## Architectural Pattern
The system follows a **Modular Monolith** approach. While physically residing in one repository, each domain is logically isolated to allow future extraction into microservices if needed.

## Module Structure Template
Every module in `app/Modules/{ModuleName}` will follow this structure:

```text
app/Modules/{ModuleName}/
├── Controllers/         # Thin controllers for API/Web
├── Models/              # Eloquent models & Query Scopes
├── Database/
│   ├── Migrations/
│   ├── Factories/
│   └── Seeders/
├── Services/            # Business Logic (The Brain)
├── Repositories/        # Data Access Layer
├── DTOs/                # Data Transfer Objects
├── Enums/               # Domain-specific Constants
├── Requests/            # Form Validation
├── Resources/           # API Transformation
├── Policies/            # Authorization
├── Events/              # Domain Events
├── Listeners/           # Task triggers
├── Jobs/                # Background processing
├── Exceptions/          # Domain exceptions
└── Observers/           # Model lifecycle hooks
```

## Communication Between Modules
1. **Direct Service Calls**: For synchronous, critical operations.
2. **Domain Events**: For asynchronous, side-effect operations (e.g., notifying PM when a request is approved).
3. **Internal APIs**: One module should not directly access another module's Repository/Model if it doesn't "own" that data (strictly enforced via architecture).
