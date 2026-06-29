"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { DataTable } from "@/components/shared/DataTable";
import { toneForStatus } from "@/lib/design-data";
import { Building2, Mail, Phone, MapPin, CreditCard, Clock, FileText } from "lucide-react";

export default function SupplierDetailPage() {
    const supplier = {
        id: "SUP-102",
        name: "Al-Tuwairqi Steel Works",
        person: "Eng. Ahmed Maher",
        phone: "+966 11 442 8899",
        email: "sales@tuwairqi.com",
        address: "Eastern Province, Dammam 2nd Industrial City",
        status: "Active",
        rating: "A+"
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={supplier.name}
                description={`Supplier ID: ${supplier.id} | Rating: ${supplier.rating}`}
                actions={
                    <div className="flex gap-2">
                        <Badge tone={toneForStatus(supplier.status)}>{supplier.status}</Badge>
                        <ButtonLink href="/procurement/suppliers" variant="outline">Back</ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                    {/* Supplier Info Card */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10 text-accent">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold">{supplier.name}</h3>
                        <p className="text-sm text-muted-foreground mb-6">Primary Steel & Construction Vendor</p>

                        <div className="space-y-4 border-t border-border pt-6">
                            <div className="flex items-center gap-3 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{supplier.person}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{supplier.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{supplier.email}</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <span>{supplier.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Stats */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm bg-success-bg/5">
                        <div className="flex items-center gap-3 mb-4 text-success-text">
                            <CreditCard className="h-5 w-5" />
                            <h4 className="text-sm font-bold uppercase tracking-wider">Financial Snapshot</h4>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Total Spend</span>
                                <span className="font-mono font-bold">SAR 1.2M</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Pending Balance</span>
                                <span className="font-mono font-bold text-danger-text">SAR 142K</span>
                            </div>
                            <div className="flex justify-between text-sm border-t border-border/20 pt-2">
                                <span className="text-muted-foreground">Avg. Lead Time</span>
                                <span className="font-bold">4.2 Days</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    {/* Active Orders */}
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider">Active Purchase Orders</h3>
                            <span className="text-[10px] bg-accent/10 text-accent font-bold px-2 py-0.5 rounded italic">Ongoing deliveries</span>
                        </div>
                        <DataTable
                            columns={[
                                { accessorKey: "id", header: "PO Number", meta: { mono: true } },
                                { accessorKey: "date", header: "Order Date", meta: { mono: true } },
                                { accessorKey: "total", header: "Total Value", meta: { mono: true, align: "right" } },
                                { accessorKey: "status", header: "Status" },
                            ]}
                            data={[
                                { id: "PO-2026-0441", date: "2026-06-12", total: "SAR 84,200", status: "Ongoing" },
                                { id: "PO-2026-0422", date: "2026-05-20", total: "SAR 12,450", status: "Delivered" },
                                { id: "PO-2026-0398", date: "2026-04-15", total: "SAR 41,000", status: "Delivered" },
                            ]}
                        />
                    </div>

                    {/* Historical Activity */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-lg font-bold mb-6">Recent Interaction Log</h3>
                        <div className="space-y-6 relative ml-1">
                            <div className="absolute left-[-17px] top-2 bottom-2 w-0.5 bg-muted" />
                            {[
                                { title: "Material Delivery Received", desc: "Batch #412 received at Central Stores", time: "2 days ago", icon: FileText },
                                { title: "Payment Disbursed", desc: "SAR 45,000 via Bank Transfer (Ref: 9912)", time: "1 week ago", icon: CreditCard },
                                { title: "PO Created", desc: "Order for 32 tons of structural steel", time: "2 weeks ago", icon: Clock },
                            ].map((log, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute left-[-23px] top-1.5 h-4 w-4 rounded-full bg-card border-2 border-accent" />
                                    <p className="text-sm font-bold">{log.title}</p>
                                    <p className="text-xs text-muted-foreground">{log.desc}</p>
                                    <p className="text-[10px] text-accent font-mono mt-1">{log.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Fixed import from lucide-react
import { User } from "lucide-react";
