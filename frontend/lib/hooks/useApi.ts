import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    projectsApi, resourcesApi, dailyOpsApi, fuelApi,
    warehouseApi, materialsApi, disbursementApi, grnApi,
    suppliersApi, purchaseRequestsApi, purchaseOrdersApi, reportsApi
} from '@/lib/api/endpoints';

// ============================================================
// Query Keys
// ============================================================
export const queryKeys = {
    projects: {
        all: ['projects'] as const,
        list: (params?: object) => ['projects', 'list', params] as const,
        detail: (id: string) => ['projects', 'detail', id] as const,
    },
    resources: {
        employees: (params?: object) => ['resources', 'employees', params] as const,
        equipment: (params?: object) => ['resources', 'equipment', params] as const,
    },
    dailyOps: {
        logs: (params?: object) => ['daily-ops', 'logs', params] as const,
        log: (id: string) => ['daily-ops', 'log', id] as const,
    },
    fuel: {
        tanks: ['fuel', 'tanks'] as const,
        transactions: (params?: object) => ['fuel', 'transactions', params] as const,
    },
    warehouse: {
        list: ['warehouse', 'list'] as const,
        detail: (id: string) => ['warehouse', id] as const,
        stock: (warehouseId: string) => ['warehouse', 'stock', warehouseId] as const,
    },
    materials: {
        list: (params?: object) => ['materials', 'list', params] as const,
        detail: (id: string) => ['materials', id] as const,
    },
    disbursement: {
        list: (params?: object) => ['disbursement', 'list', params] as const,
        detail: (id: string) => ['disbursement', id] as const,
    },
    suppliers: {
        list: ['suppliers', 'list'] as const,
        detail: (id: string) => ['suppliers', id] as const,
    },
    purchaseRequests: {
        list: (params?: object) => ['pr', 'list', params] as const,
        detail: (id: string) => ['pr', id] as const,
    },
    purchaseOrders: {
        list: (params?: object) => ['po', 'list', params] as const,
        detail: (id: string) => ['po', id] as const,
    },
    reports: {
        projectDashboard: (id: string) => ['reports', 'project', id] as const,
    },
};

// ============================================================
// Projects
// ============================================================
export function useProjects(params?: { page?: number; status?: string }) {
    return useQuery({
        queryKey: queryKeys.projects.list(params),
        queryFn: () => projectsApi.list(params).then(r => r.data),
    });
}

export function useProject(id: string) {
    return useQuery({
        queryKey: queryKeys.projects.detail(id),
        queryFn: () => projectsApi.show(id).then(r => r.data.data),
        enabled: !!id,
    });
}

export function useCreateProject() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: projectsApi.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.projects.all }),
    });
}

// ============================================================
// Resources
// ============================================================
export function useEmployees(params?: { project_id?: string; status?: string }) {
    return useQuery({
        queryKey: queryKeys.resources.employees(params),
        queryFn: () => resourcesApi.employees(params).then(r => r.data.data),
    });
}

export function useEquipment(params?: { project_id?: string; status?: string }) {
    return useQuery({
        queryKey: queryKeys.resources.equipment(params),
        queryFn: () => resourcesApi.equipment(params).then(r => r.data.data),
    });
}

// ============================================================
// Daily Operations
// ============================================================
export function useDailyLogs(params?: { project_id?: string; date?: string; shift?: string }) {
    return useQuery({
        queryKey: queryKeys.dailyOps.logs(params),
        queryFn: () => dailyOpsApi.list(params).then(r => r.data.data),
    });
}

export function useDailyLog(id: string) {
    return useQuery({
        queryKey: queryKeys.dailyOps.log(id),
        queryFn: () => dailyOpsApi.show(id).then(r => r.data.data),
        enabled: !!id,
    });
}

export function useCreateDailyLog() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: dailyOpsApi.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.dailyOps.logs() }),
    });
}

export function useSubmitDailyLog() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => dailyOpsApi.submit(id).then(r => r.data.data),
        onSuccess: (_, id) => {
            qc.invalidateQueries({ queryKey: queryKeys.dailyOps.log(id) });
            qc.invalidateQueries({ queryKey: queryKeys.dailyOps.logs() });
        },
    });
}

export function useApproveDailyLog() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => dailyOpsApi.approve(id).then(r => r.data.data),
        onSuccess: (_, id) => {
            qc.invalidateQueries({ queryKey: queryKeys.dailyOps.log(id) });
            qc.invalidateQueries({ queryKey: queryKeys.dailyOps.logs() });
        },
    });
}

// ============================================================
// Fuel
// ============================================================
export function useFuelTanks() {
    return useQuery({
        queryKey: queryKeys.fuel.tanks,
        queryFn: () => fuelApi.tanks().then(r => r.data.data),
    });
}

export function useFuelTransactions(params?: { project_id?: string }) {
    return useQuery({
        queryKey: queryKeys.fuel.transactions(params),
        queryFn: () => fuelApi.transactions(params).then(r => r.data.data),
    });
}

export function useDispenseFuel() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: fuelApi.dispense,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.fuel.tanks });
            qc.invalidateQueries({ queryKey: queryKeys.fuel.transactions() });
        },
    });
}

export function useCreateFuelTank() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: fuelApi.createTank,
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.fuel.tanks }),
    });
}

// ============================================================
// Warehouse
// ============================================================
export function useWarehouses() {
    return useQuery({
        queryKey: queryKeys.warehouse.list,
        queryFn: () => warehouseApi.list().then(r => r.data.data),
    });
}

export function useWarehouse(id: string) {
    return useQuery({
        queryKey: queryKeys.warehouse.detail(id),
        queryFn: () => warehouseApi.show(id).then(r => r.data.data),
        enabled: !!id,
    });
}

export function useWarehouseStock(warehouseId: string) {
    return useQuery({
        queryKey: queryKeys.warehouse.stock(warehouseId),
        queryFn: () => warehouseApi.stock(warehouseId).then(r => r.data.data),
        enabled: !!warehouseId,
    });
}

// ============================================================
// Materials
// ============================================================
export function useMaterials(params?: { category?: string; search?: string }) {
    return useQuery({
        queryKey: queryKeys.materials.list(params),
        queryFn: () => materialsApi.list(params).then(r => r.data.data),
    });
}

export function useMaterial(id: string) {
    return useQuery({
        queryKey: queryKeys.materials.detail(id),
        queryFn: () => materialsApi.show(id).then(r => r.data.data),
        enabled: !!id,
    });
}

export function useCreateMaterial() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: materialsApi.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.materials.list() }),
    });
}

// ============================================================
// Disbursement
// ============================================================
export function useDisbursements(params?: { project_id?: string; status?: string; type?: string }) {
    return useQuery({
        queryKey: queryKeys.disbursement.list(params),
        queryFn: () => disbursementApi.list(params).then(r => r.data.data),
    });
}

export function useDisbursement(id: string) {
    return useQuery({
        queryKey: queryKeys.disbursement.detail(id),
        queryFn: () => disbursementApi.show(id).then(r => r.data.data),
        enabled: !!id,
    });
}

export function useCreateDisbursement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: disbursementApi.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.disbursement.list() }),
    });
}

export function useConfirmDisbursement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => disbursementApi.confirm(id).then(r => r.data.data),
        onSuccess: (_, id) => qc.invalidateQueries({ queryKey: queryKeys.disbursement.detail(id) }),
    });
}

export function useApproveDisbursement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { warehouse_id?: string; fuel_tank_id?: string } }) =>
            disbursementApi.approve(id, data).then(r => r.data.data),
        onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: queryKeys.disbursement.detail(id) }),
    });
}

export function useIssueDisbursement() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => disbursementApi.issue(id).then(r => r.data.data),
        onSuccess: (_, id) => qc.invalidateQueries({ queryKey: queryKeys.disbursement.detail(id) }),
    });
}

// ============================================================
// Suppliers
// ============================================================
export function useSuppliers() {
    return useQuery({
        queryKey: queryKeys.suppliers.list,
        queryFn: () => suppliersApi.list().then(r => r.data.data),
    });
}

export function useCreateSupplier() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: suppliersApi.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.suppliers.list }),
    });
}

// ============================================================
// Purchase Requests
// ============================================================
export function usePurchaseRequests(params?: { project_id?: string; status?: string }) {
    return useQuery({
        queryKey: queryKeys.purchaseRequests.list(params),
        queryFn: () => purchaseRequestsApi.list(params).then(r => r.data.data),
    });
}

export function usePurchaseRequest(id: string) {
    return useQuery({
        queryKey: queryKeys.purchaseRequests.detail(id),
        queryFn: () => purchaseRequestsApi.show(id).then(r => r.data.data),
        enabled: !!id,
    });
}

export function useCreatePurchaseRequest() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: purchaseRequestsApi.create,
        onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.purchaseRequests.list() }),
    });
}

export function useUpdatePRStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            purchaseRequestsApi.updateStatus(id, status).then(r => r.data.data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: queryKeys.purchaseRequests.detail(id) });
            qc.invalidateQueries({ queryKey: queryKeys.purchaseRequests.list() });
        },
    });
}

// ============================================================
// Purchase Orders
// ============================================================
export function usePurchaseOrders(params?: { project_id?: string; status?: string }) {
    return useQuery({
        queryKey: queryKeys.purchaseOrders.list(params),
        queryFn: () => purchaseOrdersApi.list(params).then(r => r.data),
    });
}

export function usePurchaseOrder(id: string) {
    return useQuery({
        queryKey: queryKeys.purchaseOrders.detail(id),
        queryFn: () => purchaseOrdersApi.show(id).then(r => r.data.data),
        enabled: !!id,
    });
}

export function useConvertToOrder() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: purchaseOrdersApi.convert,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.purchaseOrders.list() });
            qc.invalidateQueries({ queryKey: queryKeys.purchaseRequests.list() });
        },
    });
}

// ============================================================
// GRN
// ============================================================
export function useCreateGrn() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: grnApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.warehouse.list });
            qc.invalidateQueries({ queryKey: queryKeys.purchaseOrders.list() });
        },
    });
}

// ============================================================
// Reports
// ============================================================
export function useProjectReport(projectId: string) {
    return useQuery({
        queryKey: queryKeys.reports.projectDashboard(projectId),
        queryFn: () => reportsApi.projectDashboard(projectId).then(r => r.data.data),
        enabled: !!projectId,
    });
}
