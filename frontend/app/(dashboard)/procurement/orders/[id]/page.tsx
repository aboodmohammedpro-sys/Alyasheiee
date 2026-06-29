"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { DataTable } from "@/components/shared/DataTable";
import { Printer, Download, Mail, ExternalLink, ShieldCheck, FileText, Truck } from "lucide-react";

export default function OrderDetailPage() {
    const po = {
        id: "PO-2026-0441",
        vendor: "Al-Tuwairqi Steel Works",
        date: "Jun 12, 2026",
        status: "Ongoing",
        total: "SAR 84,200",
        project: "North Access Road",
        paymentTerms: "Net 30 Days",
        deliveryPoint: "Central Stores Yard #2"
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Purchase Order ${po.id}`}
                description={`Issued for ${po.project} | Vendor: ${po.vendor}`}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <Printer className="h-4 w-4" />
                            Print PO
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Download PDF
                        </Button>
                        <ButtonLink href="/procurement/orders" variant="ghost">Back</ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-4">
                {/* PO Document Preview */}
                <div className="lg:col-span-3">
                    <div className="rounded-2xl border border-border bg-white p-12 shadow-sm text-slate-800 space-y-8 min-h-[800px]">
                        {/* Header */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 mb-1">CONSTRUCTION ERP</h2>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Official Purchase Order</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-mono font-bold text-slate-900">{po.id}</p>
                                <p className="text-sm text-slate-500 italic">Order Date: {po.date}</p>
                            </div>
                        </div>

                        {/* Vendor & Shipping */}
                        <div className="grid grid-cols-2 gap-12 text-sm">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Supplier / Vendor</p>
                                <p className="font-bold text-slate-900">{po.vendor}</p>
                                <p className="text-slate-500">Eng. Ahmed Maher</p>
                                <p className="text-slate-500">+966 11 442 8899</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Delivery Address</p>
                                <p className="font-bold text-slate-900">{po.deliveryPoint}</p>
                                <p className="text-slate-500">{po.project} Site Area</p>
                                <p className="text-slate-500">Attn: Warehouse Manager</p>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Specification</p>
                            <table className="w-full text-sm border-t border-slate-200">
                                <thead className="text-slate-400 text-[10px] uppercase font-bold text-left">
                                    <tr>
                                        <th className="py-4">Item Description</th>
                                        <th className="py-4 text-center">Qty</th>
                                        <th className="py-4 text-center">Unit</th>
                                        <th className="py-4 text-right">Unit Price</th>
                                        <th className="py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 border-b border-slate-200">
                                    {[
                                        { item: "Portland cement 50kg (Standard Mix)", qty: 400, unit: "bag", price: "55.00", total: "22,000.00" },
                                        { item: "Rebar 16mm Structural Grade 60 (12m)", qty: 12, unit: "ton", price: "5,183.33", total: "24,200.00" },
                                    ].map((item, i) => (
                                        <tr key={i} className="text-slate-700">
                                            <td className="py-4 font-medium">{item.item}</td>
                                            <td className="py-4 text-center font-mono">{item.qty}</td>
                                            <td className="py-4 text-center uppercase text-[10px]">{item.unit}</td>
                                            <td className="py-4 text-right font-mono">SAR {item.price}</td>
                                            <td className="py-4 text-right font-mono font-bold">SAR {item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / Total */}
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment & Terms</p>
                                    <p className="text-xs text-slate-600">{po.paymentTerms}</p>
                                </div>
                                <div className="flex items-center gap-2 text-success-text border border-success-border bg-success-bg/10 px-3 py-1.5 rounded-full w-fit">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase">System Verified Digisign</span>
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <div className="flex justify-between gap-12">
                                    <span className="text-slate-400 text-sm">Subtotal</span>
                                    <span className="font-mono text-sm">SAR 84,200.00</span>
                                </div>
                                <div className="flex justify-between gap-12 border-t border-slate-100 pt-2">
                                    <span className="text-slate-900 font-bold">GRAND TOTAL</span>
                                    <span className="font-mono text-xl font-black text-slate-900">SAR 84,200.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Legal Note */}
                        <div className="mt-12 pt-8 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed max-w-2xl">
                            This Purchase Order is electronically generated and governed by the Master Supply Agreement signed between Construction ERP and the Vendor. Prices stated are exclusive of VAT unless specified.
                        </div>
                    </div>
                </div>

                {/* Status Tracker */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Order Status Hub</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">PO Status</span>
                                <Badge tone="success">{po.status}</Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Deliveries</span>
                                <span className="font-mono font-bold">1 / 1</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Invoicing</span>
                                <Badge tone="warning">Pending</Badge>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Integration Links</h4>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs font-semibold">Related Requisition</span>
                                </div>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group">
                                <div className="flex items-center gap-3">
                                    <Truck className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-xs font-semibold">Tracking / Logistics</span>
                                </div>
                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

