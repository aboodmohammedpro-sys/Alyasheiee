# 21. Business Rules

## 1. Project Constraints
- New projects default to `PLANNING`.
- Movement to `ACTIVE` requires at least one assigned Supervisor.
- Budget modifications must be tracked in audit logs.

## 2. Resource Assignment Rules
- An Employee cannot be assigned to two projects simultaneously on overlapping dates.
- Equipment assigned to a project must have its status updated to `WORKING`.
- Assignments must have a recorded `Created By` user ID.

## 3. Inventory Rules
- Every balance change MUST have a `reference_no` (PO No, PR No, or manual Adjustment Ticket).
- Transfers require "Source WH" and "Target WH".
- "Issue" to Equipment requires the Equipment type to consume that item (e.g., Diesel Issue only to machinery, not to Food Warehouse).

## 4. Procurement Approval Rules
- POs with value > $X require CEO level approval (Financial Tier logic).
- Items cannot be received at a Warehouse if they are not in an `APPROVED` PO.
