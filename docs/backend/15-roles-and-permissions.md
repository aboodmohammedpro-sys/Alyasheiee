# 15. Roles and Permissions Matrix

## Default Roles
1. **System Admin**: Full system access, config management.
2. **Company Manager**: Global overview, high-level reports.
3. **Project Manager**: Project site control, assignment oversight.
4. **Procurement Officer**: Supplier management, PO creation.
5. **Warehouse Keeper**: Stock movements, Goods Receipting.
6. **Accountant**: Financial reports, pricing verification.

## الأدوار الاضافية (Operational Roles)
1. **مدير النظام (System Admin)**: وصول كامل.
2. **مدير المشروع**: إشراف كامل على المشروع المعين له.
3. **مراقب أول (Senior Recorder)**: إشراف على المراقبين، اعتماد البيانات التشغيلية اليومية.
4. **مراقب ميداني (Recorder)**: إدخال البيانات اليومية (بدون اعتماد)، محدود بمشاريع محددة.
5. **موزع وقود (Fuel Dispatcher)**: إدارة رصيد الديزل وتعبئة المعدات.
6. **Accountant**: Financial reports, pricing verification.

## Permission Map (Examples)
| Module | الموديول | الصلاحية | أدمن | م. مشروع | مراقب أول | مراقب ميداني | موزع وقود |
|---|---|---|---|---|---|---|---|
| المشاريع | `view` | نعم | ممتلكاته | ممتلكاته | ممتلكاته فقط | لا |
| العمليات اليومية | `create` | نعم | نعم | نعم | نعم | لا |
| العمليات اليومية | `approve` | نعم | نعم | نعم | لا | لا |
| العمليات اليومية | `edit_approved`| لا | لا | لا | لا | لا |
| الوقود | `dispense` | نعم | لا | لا | لا | نعم |
| الوقود | `receive` | نعم | لا | لا | لا | نعم |
| المشتريات | `request` | نعم | نعم | لا | لا | لا |
| Inventory | `view-qty`| Yes | Yes | Yes | Yes |

## Policy Customizations
- Policies should check both the **Permission String** and the **Ownership** (e.g., "Can I edit this PO? Yes, if I have `procurement.edit` AND its status is `draft`").
