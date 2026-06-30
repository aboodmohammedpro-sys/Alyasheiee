"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Gate } from "@/components/shared/Gate";
import {
    useDisbursement,
    useConfirmDisbursement,
    useApproveDisbursement,
    useIssueDisbursement,
    useWarehouses,
    useFuelTanks,
} from "@/lib/hooks/useApi";
import { CheckCircle2, Loader2, Package, Warehouse, AlertCircle } from "lucide-react";
import type { DisbursementRequest } from "@/lib/api/types";

const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    confirmed: "bg-warning/10 text-warning-text",
    approved: "bg-info/10 text-info-text",
    issued: "bg-success/10 text-success-text",
    rejected: "bg-danger/10 text-danger-text",
};

const statusSteps = ["draft", "confirmed", "approved", "issued"];

export default function DisbursementDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: request, isLoading, isError } = useDisbursement(id);
    const { data: warehouses = [] } = useWarehouses();
    const { data: tanks = [] } = useFuelTanks();

    const confirm = useConfirmDisbursement();
    const approve = useApproveDisbursement();
    const issue = useIssueDisbursement();

    const [selectedWarehouse, setSelectedWarehouse] = React.useState("");
    const [selectedTank, setSelectedTank] = React.useState("");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> جار التحميل...
            </div>
        );
    }

    if (isError || !request) {
        return (
            <div className="rounded-xl border border-danger/20 bg-danger/5 p-8 text-center text-danger-text">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                لم يتم العثور على طلب الصرف
            </div>
        );
    }

    const currentStep = statusSteps.indexOf(request.status);

    return (
        <div className="space-y-6">
            <PageHeader
                title={request.request_number}
                description={`نوع: ${request.type} | المشروع: ${request.project?.name ?? request.project_id}`}
                actions={
                    <div className="flex gap-2 items-center">
                        <Badge
                            tone={request.status === "issued" ? "success" : request.status === "rejected" ? "danger" : "warning"}
                        >
                            {request.status}
                        </Badge>
                        <ButtonLink href="/inventory/disbursements" variant="ghost">رجوع</ButtonLink>
                    </div>
                }
            />

            {/* Progress Steps */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    مسار الموافقة
                </h3>
                <div className="flex items-center gap-2">
                    {statusSteps.map((step, idx) => (
                        <React.Fragment key={step}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${idx <= currentStep ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                                }`}>
                                {idx < currentStep && <CheckCircle2 className="h-3 w-3" />}
                                {step}
                            </div>
                            {idx < statusSteps.length - 1 && (
                                <div className={`h-0.5 flex-1 ${idx < currentStep ? "bg-accent" : "bg-border"}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Items */}
                <div className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
                        <Package className="h-4 w-4 text-accent" />
                        <h3 className="text-sm font-bold uppercase tracking-wider">بنود الطلب</h3>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-muted text-xs uppercase text-muted-foreground border-b border-border">
                            <tr>
                                <th className="px-4 py-3 text-start">اسم الصنف</th>
                                <th className="px-4 py-3 text-end">الكمية</th>
                                <th className="px-4 py-3 text-start">الوحدة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {request.items.map(item => (
                                <tr key={item.id} className="hover:bg-muted/10">
                                    <td className="px-4 py-3 font-semibold">{item.item_name}</td>
                                    <td className="px-4 py-3 text-end font-mono font-bold">{item.quantity}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{item.unit ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Actions Panel */}
                <div className="space-y-4">
                    {/* Confirm Action (Senior Recorder) */}
                    {request.status === "draft" && (
                        <Gate permission="approve_daily_log">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold">تأكيد الطلب</h3>
                                <p className="text-xs text-muted-foreground">قم بمراجعة البنود ثم تأكيد الطلب لإرساله للموافقة.</p>
                                <Button
                                    variant="accent"
                                    className="w-full"
                                    isLoading={confirm.isPending}
                                    onClick={() => confirm.mutate(id)}
                                >
                                    تأكيد الطلب
                                </Button>
                            </div>
                        </Gate>
                    )}

                    {/* Approve Action (PM) */}
                    {request.status === "confirmed" && (
                        <Gate permission="approve_disbursement_request">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold">اعتماد الطلب وتحديد المصدر</h3>
                                {request.type === "fuel" || request.type === "oil" ? (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">خزان الوقود</label>
                                        <select
                                            value={selectedTank}
                                            onChange={e => setSelectedTank(e.target.value)}
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                        >
                                            <option value="">اختر خزان الوقود</option>
                                            {tanks.map(t => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name} ({t.current_balance}L)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase">المستودع</label>
                                        <select
                                            value={selectedWarehouse}
                                            onChange={e => setSelectedWarehouse(e.target.value)}
                                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                                        >
                                            <option value="">اختر المستودع</option>
                                            {warehouses.map(w => (
                                                <option key={w.id} value={w.id}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <Button
                                    variant="accent"
                                    className="w-full"
                                    isLoading={approve.isPending}
                                    onClick={() =>
                                        approve.mutate({
                                            id,
                                            data: {
                                                warehouse_id: selectedWarehouse || undefined,
                                                fuel_tank_id: selectedTank || undefined,
                                            },
                                        })
                                    }
                                >
                                    اعتماد الطلب
                                </Button>
                            </div>
                        </Gate>
                    )}

                    {/* Issue Action (Storekeeper) */}
                    {request.status === "approved" && (
                        <Gate permission="issue_materials">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold">تنفيذ الإصدار</h3>
                                {request.warehouse && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Warehouse className="h-4 w-4" />
                                        {request.warehouse.name}
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    بعد التأكد من تسليم الأصناف، اضغط لتنفيذ الإصدار وتحديث المخزون.
                                </p>
                                <Button
                                    variant="accent"
                                    className="w-full"
                                    isLoading={issue.isPending}
                                    onClick={() => issue.mutate(id, { onSuccess: () => router.push("/inventory/disbursements") })}
                                >
                                    تنفيذ الإصدار
                                </Button>
                            </div>
                        </Gate>
                    )}

                    {/* Info */}
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-xs space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">مقدم الطلب</span>
                            <span className="font-semibold">{(request as any).requester?.name ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">تاريخ الإنشاء</span>
                            <span className="font-mono">{new Date(request.created_at).toLocaleDateString("ar-SA")}</span>
                        </div>
                        {request.confirmed_at && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">تاريخ التأكيد</span>
                                <span className="font-mono">{new Date(request.confirmed_at).toLocaleDateString("ar-SA")}</span>
                            </div>
                        )}
                        {request.approved_at && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">تاريخ الاعتماد</span>
                                <span className="font-mono">{new Date(request.approved_at).toLocaleDateString("ar-SA")}</span>
                            </div>
                        )}
                        {request.notes && (
                            <div className="pt-2 border-t border-border">
                                <span className="text-muted-foreground">ملاحظات: </span>
                                <span>{request.notes}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
