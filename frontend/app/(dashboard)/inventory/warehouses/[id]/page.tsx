"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { DataTable } from "@/components/shared/DataTable";
import { warehouses, inventoryItems, toneForStatus } from "@/lib/design-data";
import { MapPin, Box, ArrowUpRight, ArrowDownLeft, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function WarehouseDetailPage() {
    const warehouse = warehouses[0];

    return (
        <div className="space-y-6">
            <PageHeader
                title={warehouse.name}
                description={`Warehouse Keeper: ${warehouse.keeper} | Total Stock Value: ${warehouse.value}`}
                actions={
                    <div className="flex gap-2">
                        <Badge tone={toneForStatus(warehouse.status)}>{warehouse.status}</Badge>
                        <ButtonLink href="/inventory/warehouses" variant="outline">Back</ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Quick Stats */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Total SKU Count</p>
                    <p className="text-2xl font-bold font-mono">142</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm border-l-4 border-l-warning">
                    <p className="text-xs text-muted-foreground mb-1">Low Stock Alerts</p>
                    <p className="text-2xl font-bold font-mono text-warning-text">3</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Items Dispatched (24h)</p>
                    <p className="text-2xl font-bold font-mono text-accent">2,410</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Utilization</p>
                    <p className="text-2xl font-bold font-mono">82%</p>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                            <h3 className="text-sm font-bold uppercase tracking-wider">Current Stock Inventory</h3>
                            <div className="flex gap-2">
                                <button className="text-xs font-bold text-accent px-3 py-1 bg-accent/10 rounded-full">All Items</button>
                                <button className="text-xs font-bold text-muted-foreground px-3 py-1 hover:bg-muted rounded-full">Low Stock Only</button>
                            </div>
                        </div>
                        <DataTable
                            columns={[
                                { accessorKey: "sku", header: "SKU", meta: { mono: true } },
                                { accessorKey: "item", header: "Item Description" },
                                { accessorKey: "qty", header: "On Hand", meta: { mono: true, align: "right" } },
                                { accessorKey: "uom", header: "Unit" },
                                { accessorKey: "status", header: "Status" },
                            ]}
                            data={inventoryItems as any}
                        />
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Storage Location</h3>
                        <div className="aspect-square bg-muted rounded-xl grid place-items-center relative overflow-hidden">
                            <MapPin className="h-8 w-8 text-danger-text z-10" />
                            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/46.6753,24.7136,12,0/400x400?access_token=placeholder')] opacity-40 bg-cover" />
                            <p className="absolute bottom-3 left-3 text-[10px] font-bold bg-background/80 px-2 py-1 rounded">24.7136° N, 46.6753° E</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Latest Operations</h3>
                        <div className="space-y-4">
                            {[
                                { type: "IN", ref: "GRN-2026-441", time: "1 hour ago", icon: ArrowDownLeft, color: "text-success-text" },
                                { type: "OUT", ref: "DIS-2026-902", time: "4 hours ago", icon: ArrowUpRight, color: "text-accent" },
                                { type: "ADJ", ref: "STK-ADJ-012", time: "Yesterday", icon: AlertCircle, color: "text-warning-text" },
                            ].map((op, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-lg bg-muted/60", op.color)}>
                                        <op.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold font-mono">{op.ref}</p>
                                        <p className="text-[10px] text-muted-foreground">{op.time}</p>
                                    </div>
                                    <span className={cn("text-[10px] font-bold", op.color)}>{op.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
