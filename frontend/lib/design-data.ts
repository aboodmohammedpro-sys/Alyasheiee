export type BadgeTone = "success" | "warning" | "info" | "danger" | "neutral";

export const dashboardStats = [
  { label: "Active projects", value: "18", detail: "4 delayed milestones", tone: "info" },
  { label: "Pending PR approvals", value: "27", detail: "12 high priority", tone: "warning" },
  { label: "Diesel available", value: "42.8k L", detail: "76% across tanks", tone: "success" },
  { label: "Open warehouse alerts", value: "9", detail: "3 low stock items", tone: "danger" },
] as const;

export const projects = [
  {
    code: "PRJ-2026-014",
    name: "North Access Road",
    manager: "A. Hassan",
    status: "Active",
    progress: "68%",
    budget: "SAR 18.4M",
    dates: "Jan 12 - Sep 30",
  },
  {
    code: "PRJ-2026-019",
    name: "Central Yard Expansion",
    manager: "M. Alotaibi",
    status: "Delayed",
    progress: "41%",
    budget: "SAR 9.2M",
    dates: "Mar 01 - Dec 15",
  },
  {
    code: "PRJ-2026-023",
    name: "Pump Station Civil Works",
    manager: "S. Nasser",
    status: "Draft",
    progress: "12%",
    budget: "SAR 6.7M",
    dates: "Jul 05 - Nov 20",
  },
] as const;

export const inventoryItems = [
  { sku: "MAT-CEM-50KG", item: "Portland cement 50kg", category: "Cement", uom: "bag", qty: "8,420", unitPrice: "SAR 15.00", status: "In Stock" },
  { sku: "STL-RBR-16MM", item: "Rebar 16mm", category: "Steel", uom: "ton", qty: "38", unitPrice: "SAR 2,800.00", status: "Low Stock" },
  { sku: "FUE-DIESEL", item: "Diesel fuel", category: "Fuel", uom: "L", qty: "42,800", unitPrice: "SAR 1.15", status: "In Stock" },
  { sku: "PPE-HELMET", item: "Safety helmet", category: "PPE", uom: "pcs", qty: "0", unitPrice: "SAR 25.00", status: "Out of Stock" },
] as const;

export const requisitions = [
  { id: "PR-2026-1008", project: "North Access Road", requester: "Site Recorder", status: "Pending Review", total: "SAR 84,200" },
  { id: "PR-2026-1011", project: "Central Yard Expansion", requester: "Project Manager", status: "Approved", total: "SAR 21,450" },
  { id: "PR-2026-1014", project: "Pump Station Civil Works", requester: "Warehouse Keeper", status: "Rejected", total: "SAR 9,860" },
] as const;

export const equipment = [
  { code: "EQ-CAT-320-08", model: "CAT 320 Excavator", project: "North Access Road", status: "Working", hours: "4,218 h" },
  { code: "EQ-GEN-250-03", model: "250KVA Generator", project: "Central Yard Expansion", status: "Standby", hours: "1,944 h" },
  { code: "EQ-CRN-50T-02", model: "50T Mobile Crane", project: "Workshop", status: "Breakdown", hours: "3,102 h" },
] as const;

export const employees = [
  { id: "EMP-0142", name: "Khaled Saleh", role: "Supervisor", project: "North Access Road", status: "Assigned" },
  { id: "EMP-0218", name: "Fahad Omar", role: "Recorder", project: "Central Yard Expansion", status: "Assigned" },
  { id: "EMP-0331", name: "Yousef Ali", role: "Fuel Dispatcher", project: "Pump Station Civil Works", status: "Available" },
] as const;

export const warehouses = [
  { name: "Central Stores", keeper: "N. Saad", value: "SAR 4.8M", alerts: "3 alerts", status: "Operational" },
  { name: "North Field Depot", keeper: "A. Fawaz", value: "SAR 1.2M", alerts: "1 alert", status: "Operational" },
  { name: "Mobile Fuel Truck 02", keeper: "H. Salem", value: "SAR 276K", alerts: "0 alerts", status: "Operational" },
] as const;

export function toneForStatus(status: string): BadgeTone {
  if (["Approved", "Active", "Assigned", "In Stock", "Working", "Operational", "Available"].includes(status)) {
    return "success";
  }
  if (["Pending Review", "Draft", "Low Stock", "Standby"].includes(status)) {
    return "warning";
  }
  if (["Delayed", "Rejected", "Out of Stock", "Breakdown"].includes(status)) {
    return "danger";
  }
  return "neutral";
}
