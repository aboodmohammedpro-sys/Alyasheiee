# 02. Bounded Contexts

## Context 1: Planning & Projects
**Boundary**: Project lifecycle, site locations, scheduling, and progress tracking.
**Exposed Interface**: Project status and site info for other modules.

## Context 2: Human Resources & Teams
**Boundary**: Employee profiles, internal roles, and team definitions.
**Integration**: Supplies "Who" is available for assignment.

## Context 3: Asset Management (Equipment)
**Boundary**: Heavy machinery profiles, status tracking (Available vs. Maintenance).
**Integration**: Supplies "What" machinery is available for assignment.

## Context 4: Procurement
**Boundary**: Requests, Approvals, Suppliers, and Price tracking.
**Integration**: Bridges the gap between "Requirements" and "Physical Stock".

## Context 5: Warehouse & Inventory
**Boundary**: Physical storage locations, stock levels, and ledger-based movements.
**Integration**: Consumes "Goods Receipts" from Procurement and "Issues" to Projects/Equipment.

## Context Mapping
- **Procurement -> Warehouse**: Upstream (Procurement generates the Goods Receipt).
- **Project -> Resource Assignment**: Consumer (Project requests resources).
- **Stock Movement -> Destination**: Downstream (Movement logic depends on Destination ID/Type).
