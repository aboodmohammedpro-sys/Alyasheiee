# 06. ERD Design

## Mermaid ERD Visualization

```mermaid
erDiagram
    PROJECT ||--o{ PROJECT_PHASE : contains
    PROJECT ||--o{ ASSIGNMENT : has
    EMPLOYEE ||--o{ ASSIGNMENT : "assigned to"
    EQUIPMENT ||--o{ ASSIGNMENT : "assigned to"
    
    PURCHASE_REQUEST ||--o{ PURCHASE_REQUEST_ITEM : has
    PURCHASE_ORDER ||--o{ PURCHASE_ORDER_ITEM : has
    PURCHASE_REQUEST ||--o| PURCHASE_ORDER : "converted to"
    SUPPLIER ||--o{ PURCHASE_ORDER : "provides"
    
    WAREHOUSE ||--o{ STOCK_MOVEMENT : records
    STOCK_MOVEMENT }o--|| PROJECT : "destination (morph)"
    STOCK_MOVEMENT }o--|| EQUIPMENT : "destination (morph)"
    STOCK_MOVEMENT }o--|| PURCHASE_ORDER : "reference (source)"
```

## Relationship Details
1. **Assignments**: A bridge table that handles both Employees and Equipment using Laravel's Polymorphic relationships. This keeps the Project model clean and allows unified tracking of site resources.
2. **Stock Movements**: The "Destination" is polymorphic. This is crucial because diesel can be issued to a "Truck" (Equipment) OR a "Project" (Site General) OR "Maintenance" (Internal).
3. **Hierarchy**: Projects -> Phases -> Tasks (Tasks to be added in Phase 2).
