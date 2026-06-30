// ============================================================
// API Response Types — matches Laravel BaseController responses
// ============================================================

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: {
        data: T[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

// ============================================================
// Auth
// ============================================================
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
}

export interface LoginResponse {
    user: AuthUser;
    token: string;
}

// ============================================================
// Projects
// ============================================================
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';

export interface Project {
    id: string;
    code: string;
    name: string;
    client_name: string | null;
    location: string | null;
    start_date: string | null;
    expected_end_date: string | null;
    estimated_budget: number;
    progress_percentage: number;
    status: ProjectStatus;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectPhase {
    id: string;
    project_id: string;
    name: string;
    start_date: string | null;
    end_date: string | null;
    progress_percentage: number;
    status: string;
}

// ============================================================
// Resources
// ============================================================
export interface Employee {
    id: string;
    code: string;
    name: string;
    position: string;
    hourly_rate: number;
    status: 'active' | 'inactive';
    project_id: string | null;
}

export interface Equipment {
    id: string;
    code: string;
    name: string;
    model: string;
    type: string;
    hourly_rate: number;
    standard_consumption_rate: number;
    status: 'working' | 'standby' | 'breakdown' | 'maintenance';
    project_id: string | null;
}

export interface ProjectAssignment {
    id: string;
    project_id: string;
    assignable_id: string;
    assignable_type: string;
    status: 'active' | 'inactive';
}

// ============================================================
// Daily Operations
// ============================================================
export type DailyLogStatus = 'draft' | 'submitted' | 'approved';
export type ShiftType = 'morning' | 'night_1' | 'night_2';

export interface DailyLog {
    id: string;
    project_id: string;
    recorder_id: string;
    date: string;
    shift: ShiftType;
    status: DailyLogStatus;
    general_notes: string | null;
    created_at: string;
    updated_at: string;
    project?: Project;
}

export interface LaborAttendance {
    id: string;
    daily_log_id: string;
    employee_id: string;
    hours_worked: number;
    overtime_hours: number;
    status: 'present' | 'absent' | 'leave';
    notes: string | null;
    employee?: Employee;
}

export interface EquipmentUsage {
    id: string;
    daily_log_id: string;
    equipment_id: string;
    operator_id: string | null;
    start_meter: number;
    end_meter: number;
    work_hours: number;
    idle_hours: number;
    breakdown_hours: number;
    status: 'working' | 'standby' | 'breakdown';
    notes: string | null;
    equipment?: Equipment;
    operator?: Employee;
}

export interface DailyTrip {
    id: string;
    daily_log_id: string;
    equipment_id: string;
    driver_id: string | null;
    material_type: string;
    from_location: string;
    to_location: string;
    trip_count: number;
    quantity: number;
    equipment?: Equipment;
    driver?: Employee;
}

export interface DailyAchievement {
    id: string;
    daily_log_id: string;
    activity_name: string;
    quantity: number;
    unit: string;
    notes: string | null;
}

// ============================================================
// Fuel Management
// ============================================================
export type FuelTankType = 'static' | 'mobile';

export interface FuelTank {
    id: string;
    name: string;
    type: FuelTankType;
    capacity: number;
    current_balance: number;
    project_id: string | null;
    project?: Project;
}

export type FuelTransactionType = 'receiving' | 'transfer' | 'dispensing';

export interface FuelTransaction {
    id: string;
    type: FuelTransactionType;
    from_tank_id: string | null;
    to_tank_id: string | null;
    equipment_id: string | null;
    project_id: string | null;
    quantity: number;
    odometer_reading: number | null;
    dispatcher_id: string;
    notes: string | null;
    created_at: string;
    equipment?: Equipment;
    project?: Project;
    dispatcher?: { id: string; name: string };
}

// ============================================================
// Warehouse & Inventory
// ============================================================
export interface Warehouse {
    id: string;
    name: string;
    location: string | null;
    type: 'central' | 'site';
    project_id: string | null;
    project?: Project;
}

export interface Material {
    id: string;
    code: string;
    name: string;
    category: string;
    unit: string;
    description: string | null;
}

export interface InventoryStock {
    id: string;
    warehouse_id: string;
    material_id: string;
    quantity: number;
    warehouse?: Warehouse;
    material?: Material;
}

export type DisbursementType = 'material' | 'spare_part' | 'fuel' | 'oil';
export type DisbursementStatus = 'draft' | 'confirmed' | 'approved' | 'issued' | 'rejected';

export interface DisbursementRequestItem {
    id: string;
    request_id: string;
    item_name: string;
    quantity: number;
    unit: string | null;
    material_id?: string | null;
    material?: Material;
}

export interface DisbursementRequest {
    id: string;
    request_number: string;
    project_id: string;
    requester_id: string;
    type: DisbursementType;
    status: DisbursementStatus;
    confirmed_by: string | null;
    confirmed_at: string | null;
    approved_by: string | null;
    approved_at: string | null;
    warehouse_id: string | null;
    fuel_tank_id: string | null;
    notes: string | null;
    created_at: string;
    items: DisbursementRequestItem[];
    project?: Project;
    requester?: { id: string; name: string };
    warehouse?: Warehouse;
}

export interface GoodsReceivedNote {
    id: string;
    grn_number: string;
    purchase_order_id: string;
    warehouse_id: string;
    received_by: string;
    received_date: string;
    delivery_note_number: string | null;
    notes: string | null;
    created_at: string;
    items?: GrnItem[];
    warehouse?: Warehouse;
}

export interface GrnItem {
    id: string;
    goods_received_note_id: string;
    material_id: string;
    quantity_ordered: number;
    quantity_received: number;
    material?: Material;
}

// ============================================================
// Procurement
// ============================================================
export interface Supplier {
    id: string;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    status: 'active' | 'inactive';
}

export type PurchaseRequestStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'ordered';

export interface PurchaseRequestItem {
    id: string;
    purchase_request_id: string;
    material_id: string;
    quantity: number;
    estimated_unit_price: number;
    material?: Material;
}

export interface PurchaseRequest {
    id: string;
    project_id: string;
    requester_id: string;
    status: PurchaseRequestStatus;
    required_date: string | null;
    notes: string | null;
    created_at: string;
    items: PurchaseRequestItem[];
    project?: Project;
    requester?: { id: string; name: string };
}

export type PurchaseOrderStatus = 'draft' | 'sent' | 'partial' | 'completed' | 'cancelled';

export interface PurchaseOrderItem {
    id: string;
    purchase_order_id: string;
    material_id: string;
    quantity: number;
    unit_price: number;
    tax_amount: number;
    total_item_price: number;
    material?: Material;
}

export interface PurchaseOrder {
    id: string;
    po_number: string;
    purchase_request_id: string | null;
    supplier_id: string;
    project_id: string;
    created_by: string;
    order_date: string;
    delivery_date: string | null;
    total_amount: number;
    currency: string;
    status: PurchaseOrderStatus;
    terms_conditions: string | null;
    notes: string | null;
    created_at: string;
    items: PurchaseOrderItem[];
    supplier?: Supplier;
    project?: Project;
}

// ============================================================
// Cost Control
// ============================================================
export interface ProjectBudget {
    id: string;
    project_id: string;
    category: 'labor' | 'material' | 'equipment' | 'fuel' | 'misc';
    estimated_amount: number;
    actual_spent: number;
}

export interface CostLog {
    id: string;
    project_id: string;
    category: string;
    amount: number;
    source_type: string;
    source_id: string;
    description: string | null;
    created_at: string;
}

export interface ProjectFinancialSummary {
    total_estimated: number;
    total_actual: number;
    categories: {
        category: string;
        estimated: number;
        actual: number;
        variance: number;
        burn_rate: number;
    }[];
}
