"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/Button";
import { DataTable } from "@/components/shared/DataTable";
import { toneForStatus } from "@/lib/design-data";
import { FileText, User, CheckCircle2, XCircle, Clock, MessageSquare } from "lucide-react";

export default function RequisitionDetailPage() {
    const [isProcessing, setIsProcessing] = React.useState(false);
    const pr = {
        id: "PR-2026-1008",
        project: "North Access Road",
        requester: "Site Recorder",
        status: "Pending Review",
        date: "Jun 24, 2026",
        priority: "High",
        total: "SAR 84,200",
        notes: "Critical shortage of rebar for Phase 2 foundation works."
    };

    const handleAction = (type: "approve" | "reject") => {
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 1500);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Requisition ${pr.id}`}
                description={`Project: ${pr.project} | Status: ${pr.status}`}
                actions={
                    <div className="flex gap-2">
                        <Badge tone={pr.priority === "High" ? "danger" : "info"}>{pr.priority} Priority</Badge>
                        <ButtonLink href="/procurement/requisitions" variant="outline">Back</ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Main Details and Items */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                            <FileText className="h-5 w-5" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Requested Line Items</h3>
                        </div>
                        <DataTable
                            columns={[
                                { accessorKey: "sku", header: "Material ID", meta: { mono: true } },
                                { accessorKey: "name", header: "Item Description" },
                                { accessorKey: "qty", header: "Qty", meta: { mono: true, align: "right" } },
                                { accessorKey: "uom", header: "Unit" },
                                { accessorKey: "est", header: "Est. Total", meta: { mono: true, align: "right" } },
                            ]}
                            data={[
                                { sku: "MAT-CEM-50KG", name: "Portland cement 50kg", qty: "400", uom: "bag", est: "SAR 22,000" },
                                { sku: "STL-RBR-16MM", name: "Rebar 16mm (Structural)", qty: "12", uom: "ton", est: "SAR 62,200" },
                            ]}
                        />
                        <div className="mt-4 flex justify-end border-t border-border pt-4">
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Estimated Requisition Value</p>
                                <p className="text-3xl font-bold font-mono text-foreground">{pr.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" /> Requester Remarks
                        </h3>
                        <p className="text-sm text-foreground p-4 bg-muted/30 rounded-xl italic">
                            &quot;{pr.notes}&quot;
                        </p>
                    </div>
                </div>

                {/* Action Panel and Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Approval Card */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm bg-accent/5">
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Approval Actions</h4>
                        <div className="space-y-3">
                            <Button
                                className="w-full gap-2 bg-success-text hover:bg-success-text/90 border-none"
                                onClick={() => handleAction("approve")}
                                isLoading={isProcessing}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Approve PR
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full gap-2 text-danger-text hover:bg-danger-bg/10 border-danger-border"
                                onClick={() => handleAction("reject")}
                                isLoading={isProcessing}
                            >
                                <XCircle className="h-4 w-4" />
                                Reject / Return
                            </Button>
                        </div>
                        <p className="mt-4 text-[10px] text-center text-muted-foreground italic">
                            Actions are audited and will notify the site team immediately.
                        </p>
                    </div>

                    {/* Activity Tracking */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Request Lifecycle</h4>
                        <div className="space-y-6 relative ml-1">
                            <div className="absolute left-[-17px] top-2 bottom-2 w-0.5 bg-muted" />
                            {[
                                { status: "Pending Review", time: "Active", icon: Clock, color: "text-warning-text" },
                                { status: "Submitted", time: "24 Jun 2026", icon: CheckCircle2, color: "text-success-text" },
                                { status: "Draft Created", time: "23 Jun 2026", icon: FileText, color: "text-muted-foreground" },
                            ].map((step, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className={`absolute left-[-22px] top-1 h-3 w-3 rounded-full bg-card border-2 ${step.color.replace('text', 'border')}`} />
                                    <p className={`text-xs font-bold ${step.color}`}>{step.status}</p>
                                    <p className="text-[10px] text-muted-foreground font-mono">{step.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
