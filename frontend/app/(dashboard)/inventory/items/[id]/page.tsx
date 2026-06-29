"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { DataTable } from "@/components/shared/DataTable";
import { inventoryItems, toneForStatus } from "@/lib/design-data";
import { Tag, DollarSign, Package, Layers, Activity } from "lucide-react";

export default function ItemDetailPage() {
    const item = inventoryItems[0];

    return (
        <div className="space-y-6">
            <PageHeader
                title={item.item}
                description={`SKU: ${item.sku} | Category: ${item.category}`}
                actions={
                    <div className="flex gap-2">
                        <Badge tone={toneForStatus(item.status)}>{item.status}</Badge>
                        <ButtonLink href="/inventory/items" variant="outline">Back</ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                    {/* Specification Card */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Item Specifications</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Unit of Measure</span>
                                <span className="text-sm font-bold uppercase">{item.uom}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Unit Cost</span>
                                <span className="text-sm font-mono font-bold">SAR 42.00</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Reorder Level</span>
                                <span className="text-sm font-mono font-bold">1,000 bags</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Lead Time</span>
                                <span className="text-sm font-bold">3-5 Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Metrics */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm bg-accent/5">
                        <div className="flex items-center gap-3 mb-2 text-accent">
                            <Layers className="h-5 w-5" />
                            <h4 className="text-sm font-bold uppercase tracking-wider">Projected Runway</h4>
                        </div>
                        <p className="text-2xl font-bold font-mono">14 Days</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Based on last 3 months average consumption.</p>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {/* Stock Distribution per Warehouse */}
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/20">
                            <h3 className="text-sm font-bold uppercase tracking-wider">Stock Distribution</h3>
                        </div>
                        <DataTable
                            columns={[
                                { accessorKey: "warehouse", header: "Warehouse Name" },
                                { accessorKey: "location", header: "Location" },
                                { accessorKey: "qty", header: "Quantity", meta: { mono: true, align: "right" } },
                                { accessorKey: "status", header: "Status" },
                            ]}
                            data={[
                                { warehouse: "Central Stores", location: "Riyadh", qty: "6,200", status: "In Stock" },
                                { warehouse: "North Field Depot", location: "Section A", qty: "2,220", status: "In Stock" },
                                { warehouse: "Jeddah Hub", location: "Port Site", qty: "0", status: "Out of Stock" },
                            ]}
                        />
                    </div>

                    {/* Price History Chart Placeholder */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Unit Price History</h3>
                            <Activity className="h-5 w-5 text-muted-foreground opacity-30" />
                        </div>
                        <div className="h-40 bg-muted/20 rounded-xl relative overflow-hidden grid place-items-center">
                            <p className="text-xs text-muted-foreground">Trend Analysis Chart Loading...</p>
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,var(--accent),transparent)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
