# 15. Roles and Permissions Matrix

## Default Roles
1. **System Admin**: Full system access, config management.
2. **Company Manager**: Global overview, high-level reports.
3. **Project Manager**: Project site control, assignment oversight.
4. **Procurement Officer**: Supplier management, PO creation.
5. **Warehouse Keeper**: Stock movements, Goods Receipting.
6. **Accountant**: Financial reports, pricing verification.

## Permission Map (Examples)
| Module | Permission | Admin | PM | Procurement | WH Keeper |
|---|---|---|---|---|---|
| Project | `view` | Yes | Own | Yes | Yes |
| Project | `create` | Yes | No | No | No |
| Assignment | `manage` | Yes | Yes | No | No |
| Procurement | `request` | Yes | Yes | Yes | No |
| Procurement | `approve`| Yes | No | Yes | No |
| Inventory | `transfer`| Yes | No | No | Yes |
| Inventory | `view-qty`| Yes | Yes | Yes | Yes |

## Policy Customizations
- Policies should check both the **Permission String** and the **Ownership** (e.g., "Can I edit this PO? Yes, if I have `procurement.edit` AND its status is `draft`").
