import { z } from 'zod';

// ============================================================
// Project
// ============================================================
export const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    code: z.string().min(1, 'Project code is required'),
    client_name: z.string().optional(),
    location: z.string().optional(),
    start_date: z.string().optional(),
    expected_end_date: z.string().optional(),
    estimated_budget: z.coerce.number().min(0).default(0),
    status: z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']).default('planning'),
    description: z.string().optional(),
});
export type ProjectFormData = z.infer<typeof projectSchema>;

// ============================================================
// Material
// ============================================================
export const materialSchema = z.object({
    code: z.string().min(1, 'Material code is required'),
    name: z.string().min(1, 'Material name is required'),
    category: z.string().min(1, 'Category is required'),
    unit: z.string().min(1, 'Unit is required'),
    description: z.string().optional(),
});
export type MaterialFormData = z.infer<typeof materialSchema>;

// ============================================================
// Supplier
// ============================================================
export const supplierSchema = z.object({
    name: z.string().min(1, 'Supplier name is required'),
    contact_person: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
});
export type SupplierFormData = z.infer<typeof supplierSchema>;

// ============================================================
// Fuel Tank
// ============================================================
export const fuelTankSchema = z.object({
    name: z.string().min(1, 'Tank name is required'),
    type: z.enum(['static', 'mobile']),
    capacity: z.coerce.number().min(1, 'Capacity must be greater than 0'),
    project_id: z.string().uuid().optional(),
});
export type FuelTankFormData = z.infer<typeof fuelTankSchema>;

// ============================================================
// Fuel Dispense
// ============================================================
export const fuelDispenseSchema = z.object({
    from_tank_id: z.string().uuid('Please select a fuel tank'),
    equipment_id: z.string().uuid('Please select equipment'),
    project_id: z.string().uuid('Please select a project'),
    quantity: z.coerce.number().min(0.5, 'Minimum quantity is 0.5L'),
    odometer_reading: z.coerce.number().optional(),
    notes: z.string().optional(),
    // Frontend-only: driver selection stored but sent as notes if field not supported
    driver_id: z.string().uuid().optional(),
});
export type FuelDispenseFormData = z.infer<typeof fuelDispenseSchema>;

// ============================================================
// Purchase Request
// ============================================================
export const purchaseRequestItemSchema = z.object({
    material_id: z.string().uuid('Please select a material'),
    quantity: z.coerce.number().min(0.01, 'Quantity must be greater than 0'),
    estimated_unit_price: z.coerce.number().min(0).optional(),
});

export const purchaseRequestSchema = z.object({
    project_id: z.string().uuid('Please select a project'),
    required_date: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(purchaseRequestItemSchema).min(1, 'At least one item is required'),
});
export type PurchaseRequestFormData = z.infer<typeof purchaseRequestSchema>;

// ============================================================
// GRN (Goods Received Note)
// ============================================================
export const grnItemSchema = z.object({
    material_id: z.string().uuid('Please select a material'),
    quantity_received: z.coerce.number().min(0, 'Quantity must be >= 0'),
});

export const grnSchema = z.object({
    purchase_order_id: z.string().uuid('Please select a purchase order'),
    warehouse_id: z.string().uuid('Please select a warehouse'),
    delivery_note_number: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(grnItemSchema).min(1, 'At least one item is required'),
});
export type GrnFormData = z.infer<typeof grnSchema>;

// ============================================================
// Disbursement Request
// ============================================================
export const disbursementItemSchema = z.object({
    item_name: z.string().min(1, 'Item name is required'),
    quantity: z.coerce.number().min(0, 'Quantity must be >= 0'),
    unit: z.string().optional(),
    material_id: z.string().uuid().optional(),
});

export const disbursementSchema = z.object({
    project_id: z.string().uuid('Please select a project'),
    type: z.enum(['material', 'spare_part', 'fuel', 'oil']),
    notes: z.string().optional(),
    items: z.array(disbursementItemSchema).min(1, 'At least one item is required'),
});
export type DisbursementFormData = z.infer<typeof disbursementSchema>;

// ============================================================
// Daily Log Equipment Hours
// ============================================================
export const equipmentUsageSchema = z.object({
    equipment_id: z.string().uuid('Please select equipment'),
    operator_id: z.string().uuid().optional(),
    start_meter: z.coerce.number().min(0),
    end_meter: z.coerce.number().min(0),
    work_hours: z.coerce.number().min(0),
    idle_hours: z.coerce.number().min(0).default(0),
    breakdown_hours: z.coerce.number().min(0).default(0),
    status: z.enum(['working', 'standby', 'breakdown']).default('working'),
    notes: z.string().optional(),
});

export const dailyLogEquipmentSchema = z.object({
    project_id: z.string().uuid('Please select a project'),
    date: z.string().min(1, 'Date is required'),
    shift: z.enum(['morning', 'night_1', 'night_2']),
    general_notes: z.string().optional(),
    equipment: z.array(equipmentUsageSchema).min(1, 'At least one equipment entry is required'),
});
export type DailyLogEquipmentFormData = z.infer<typeof dailyLogEquipmentSchema>;

// ============================================================
// Daily Log Truck Trips  
// ============================================================
export const dailyTripSchema = z.object({
    equipment_id: z.string().uuid('Please select a truck'),
    driver_id: z.string().uuid().optional(),
    material_type: z.string().min(1, 'Material type is required'),
    from_location: z.string().min(1, 'From location is required'),
    to_location: z.string().min(1, 'To location is required'),
    trip_count: z.coerce.number().min(1).default(1),
    quantity: z.coerce.number().min(0),
});

export const dailyLogTripsSchema = z.object({
    project_id: z.string().uuid('Please select a project'),
    date: z.string().min(1),
    shift: z.enum(['morning', 'night_1', 'night_2']),
    trips: z.array(dailyTripSchema).min(1, 'At least one trip is required'),
});
export type DailyLogTripsFormData = z.infer<typeof dailyLogTripsSchema>;

// ============================================================
// Daily Attendance
// ============================================================
export const laborAttendanceSchema = z.object({
    employee_id: z.string().uuid('Please select an employee'),
    hours_worked: z.coerce.number().min(0).max(24),
    overtime_hours: z.coerce.number().min(0).default(0),
    status: z.enum(['present', 'absent', 'leave']).default('present'),
    notes: z.string().optional(),
});

export const dailyAttendanceSchema = z.object({
    project_id: z.string().uuid('Please select a project'),
    date: z.string().min(1),
    shift: z.enum(['morning', 'night_1', 'night_2']),
    attendance: z.array(laborAttendanceSchema).min(1, 'At least one attendance record is required'),
});
export type DailyAttendanceFormData = z.infer<typeof dailyAttendanceSchema>;

// ============================================================
// Daily Achievements
// ============================================================
export const dailyAchievementSchema = z.object({
    activity_name: z.string().min(1, 'Activity name is required'),
    quantity: z.coerce.number().min(0),
    unit: z.string().min(1, 'Unit is required'),
    notes: z.string().optional(),
});

export const dailyAchievementsSchema = z.object({
    project_id: z.string().uuid('Please select a project'),
    date: z.string().min(1),
    shift: z.enum(['morning', 'night_1', 'night_2']),
    achievements: z.array(dailyAchievementSchema).min(1, 'At least one achievement is required'),
});
export type DailyAchievementsFormData = z.infer<typeof dailyAchievementsSchema>;
