# 22. Business Flows

## Purchase-to-Stock Flow

```mermaid
sequenceDiagram
    participant Requester
    participant Manager
    participant Procurement
    participant Warehouse
    
    Requester->>Procurement: Create Purchase Request (PR)
    Procurement->>Manager: Submit for Approval
    Manager-->>Procurement: Approved
    Procurement->>Procurement: Generate Purchase Order (PO)
    Procurement->>Warehouse: Notify Expected Delivery
    Warehouse->>Warehouse: Goods Receipt (GR) on delivery
    Warehouse->>Warehouse: Create Stock Movement (Type: Receipt)
    Warehouse->>Warehouse: Update Inventory Ledger
```

## Inventory-to-Project Flow
1. **Request**: Project Site Supervisor requests 100 bags of cement.
2. **Verification**: Warehouse Keeper checks stock availability.
3. **Dispatch**: Warehouse issues stock.
4. **Tracking**: System creates `StockMovement` (Type: Issue, Destination: Project ID).
5. **Ledger**: Current stock is reduced.
