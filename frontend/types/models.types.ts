export type ProjectStatus = "Active" | "Delayed" | "Draft" | "Completed";

export interface Project {
    id: string;
    code: string;
    name: string;
    manager: string;
    status: ProjectStatus;
    progress: number;
    budget: string;
    startDate: string;
    endDate: string;
}

export interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    category: string;
    uom: string;
    quantity: number;
    status: "In Stock" | "Low Stock" | "Out of Stock";
}
