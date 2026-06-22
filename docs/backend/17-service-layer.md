# 17. Service Layer

## The Role of Services
In this architecture, Services are the **Single Source of Truth** for business logic.

## Rules for Services
1. **No Request Objects**: Service methods must take DTOs or Primitives, never a `Request` object.
2. **Transaction Handling**: Complex services involving multiple tables must wrap logic in `DB::transaction()`.
3. **Internal Only**: Services should return DTOs or Models. They should not return HTTP responses.
4. **Inversion of Control**: For heavy cross-module work (e.g., Procurement talking to Warehouse), use an interface or Domain Events.

## Example Service Signature
```php
class ProjectService {
    public function assignEmployee(AssignmentDTO $data): ProjectAssignment {
        // 1. Business Validation
        // 2. Resource Conflict Check
        // 3. Database Write (via Repository)
        // 4. Fire Domain Event
        // 5. Return Result
    }
}
```
