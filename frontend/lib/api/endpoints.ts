import { api } from './client';
import type {
    ApiResponse, PaginatedResponse,
    Project, Employee, Equipment,
    DailyLog, LaborAttendance, EquipmentUsage, DailyTrip, DailyAchievement,
    FuelTank, FuelTransaction,
    Warehouse, Material, InventoryStock, DisbursementRequest, GoodsReceivedNote,
    Supplier, PurchaseRequest, PurchaseOrder,
    ProjectBudget, CostLog, ProjectFinancialSummary,
    LoginResponse, AuthUser,
} from './types';

// ============================================================
// Auth
// ============================================================
export const authApi = {
    login: (email: string, password: string, device_name: string) =>
        api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password, device_name }),
    logout: () => api.post<ApiResponse<null>>('/auth/logout'),
    me: () => api.get<ApiResponse<AuthUser>>('/user'),
};

// ============================================================
// Projects
// ============================================================
export const projectsApi = {
    list: (params?: { page?: number; status?: string }) =>
        api.get<PaginatedResponse<Project>>('/projects', { params }),
    show: (id: string) =>
        api.get<ApiResponse<Project>>(`/projects/${id}`),
    create: (data: {
        name: string; code: string; client_name?: string; location?: string;
        start_date?: string; expected_end_date?: string; estimated_budget?: number;
        status?: string; description?: string;
    }) => api.post<ApiResponse<Project>>('/projects', data),
};

// ============================================================
// Resources
// ============================================================
export const resourcesApi = {
    employees: (params?: { project_id?: string; status?: string }) =>
        api.get<ApiResponse<Employee[]>>('/resources/employees', { params }),
    equipment: (params?: { project_id?: string; status?: string }) =>
        api.get<ApiResponse<Equipment[]>>('/resources/equipment', { params }),
};

// ============================================================
// Daily Operations
// ============================================================
export const dailyOpsApi = {
    list: (params?: { project_id?: string; date?: string; shift?: string; status?: string }) =>
        api.get<ApiResponse<DailyLog[]>>('/daily-operations/logs', { params }),
    show: (id: string) =>
        api.get<ApiResponse<DailyLog>>(`/daily-operations/logs/${id}`),
    create: (data: {
        project_id: string; date: string; shift: string; general_notes?: string;
        attendance?: { employee_id: string; hours_worked: number; overtime_hours?: number; status: string; notes?: string }[];
        equipment?: { equipment_id: string; operator_id?: string; start_meter: number; end_meter: number; work_hours: number; idle_hours?: number; breakdown_hours?: number; status: string; notes?: string }[];
        trips?: { equipment_id: string; driver_id?: string; material_type: string; from_location: string; to_location: string; trip_count: number; quantity: number }[];
        achievements?: { activity_name: string; quantity: number; unit: string; notes?: string }[];
    }) => api.post<ApiResponse<DailyLog>>('/daily-operations/logs', data),
    submit: (id: string) =>
        api.post<ApiResponse<DailyLog>>(`/daily-operations/logs/${id}/submit`),
    approve: (id: string) =>
        api.patch<ApiResponse<DailyLog>>(`/daily-operations/logs/${id}/approve`),
};

// ============================================================
// Fuel Management
// ============================================================
export const fuelApi = {
    tanks: () =>
        api.get<ApiResponse<FuelTank[]>>('/warehouse/tanks'),
    transactions: (params?: { project_id?: string; type?: string }) =>
        api.get<ApiResponse<FuelTransaction[]>>('/warehouse/fuel/transactions', { params }),
    dispense: (data: {
        from_tank_id: string; equipment_id: string; project_id: string;
        quantity: number; odometer_reading?: number; notes?: string;
    }) => api.post<ApiResponse<FuelTransaction>>('/warehouse/dispense', data),
    createTank: (data: { name: string; type: string; capacity: number; project_id?: string }) =>
        api.post<ApiResponse<FuelTank>>('/warehouse/tanks', data),
};

// ============================================================
// Warehouse
// ============================================================
export const warehouseApi = {
    list: () =>
        api.get<ApiResponse<Warehouse[]>>('/warehouse/warehouses'),
    show: (id: string) =>
        api.get<ApiResponse<Warehouse>>(`/warehouse/warehouses/${id}`),
    stock: (warehouseId: string) =>
        api.get<ApiResponse<InventoryStock[]>>(`/warehouse/warehouses/${warehouseId}/stock`),
};

// ============================================================
// Materials
// ============================================================
export const materialsApi = {
    list: (params?: { category?: string; search?: string }) =>
        api.get<ApiResponse<Material[]>>('/procurement/materials', { params }),
    show: (id: string) =>
        api.get<ApiResponse<Material>>(`/procurement/materials/${id}`),
    create: (data: { code: string; name: string; category: string; unit: string; description?: string }) =>
        api.post<ApiResponse<Material>>('/procurement/materials', data),
};

// ============================================================
// Disbursement
// ============================================================
export const disbursementApi = {
    list: (params?: { project_id?: string; status?: string; type?: string }) =>
        api.get<ApiResponse<DisbursementRequest[]>>('/warehouse/disbursement', { params }),
    show: (id: string) =>
        api.get<ApiResponse<DisbursementRequest>>(`/warehouse/disbursement/${id}`),
    create: (data: {
        project_id: string; type: string; notes?: string;
        items: { item_name: string; quantity: number; unit?: string; material_id?: string }[];
    }) => api.post<ApiResponse<DisbursementRequest>>('/warehouse/disbursement', data),
    confirm: (id: string) =>
        api.post<ApiResponse<DisbursementRequest>>(`/warehouse/disbursement/${id}/confirm`),
    approve: (id: string, data: { warehouse_id?: string; fuel_tank_id?: string }) =>
        api.post<ApiResponse<DisbursementRequest>>(`/warehouse/disbursement/${id}/approve`, data),
    issue: (id: string) =>
        api.post<ApiResponse<DisbursementRequest>>(`/warehouse/disbursement/${id}/issue`),
};

// ============================================================
// GRN
// ============================================================
export const grnApi = {
    create: (data: {
        purchase_order_id: string; warehouse_id: string;
        delivery_note_number?: string; notes?: string;
        items: { material_id: string; quantity_received: number }[];
    }) => api.post<ApiResponse<GoodsReceivedNote>>('/warehouse/grn', data),
};

// ============================================================
// Suppliers
// ============================================================
export const suppliersApi = {
    list: () => api.get<ApiResponse<Supplier[]>>('/procurement/suppliers'),
    show: (id: string) => api.get<ApiResponse<Supplier>>(`/procurement/suppliers/${id}`),
    create: (data: {
        name: string; contact_person?: string; phone?: string; email?: string; address?: string;
    }) => api.post<ApiResponse<Supplier>>('/procurement/suppliers', data),
};

// ============================================================
// Purchase Requests
// ============================================================
export const purchaseRequestsApi = {
    list: (params?: { project_id?: string; status?: string }) =>
        api.get<ApiResponse<PurchaseRequest[]>>('/procurement/purchase-requests', { params }),
    show: (id: string) =>
        api.get<ApiResponse<PurchaseRequest>>(`/procurement/purchase-requests/${id}`),
    create: (data: {
        project_id: string; required_date?: string; notes?: string;
        items: { material_id: string; quantity: number; estimated_unit_price?: number }[];
    }) => api.post<ApiResponse<PurchaseRequest>>('/procurement/purchase-requests', data),
    updateStatus: (id: string, status: string) =>
        api.patch<ApiResponse<PurchaseRequest>>(`/procurement/purchase-requests/${id}/status`, { status }),
};

// ============================================================
// Purchase Orders
// ============================================================
export const purchaseOrdersApi = {
    list: (params?: { project_id?: string; status?: string }) =>
        api.get<PaginatedResponse<PurchaseOrder>>('/procurement/purchase-orders', { params }),
    show: (id: string) =>
        api.get<ApiResponse<PurchaseOrder>>(`/procurement/purchase-orders/${id}`),
    convert: (data: {
        purchase_request_id: string; supplier_id: string;
        pricing: Record<string, number>; // material_id => unit_price
    }) => api.post<ApiResponse<PurchaseOrder>>('/procurement/purchase-orders/convert', data),
};

// ============================================================
// Reports / Cost Control
// ============================================================
export const reportsApi = {
    projectDashboard: (projectId: string) =>
        api.get<ApiResponse<{ project: { id: string; name: string; code: string }; financials: ProjectFinancialSummary; achievements: any[] }>>(`/reports/project-dashboard/${projectId}`),
};
