"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/shared/DataTable";
import { Gate } from "@/components/shared/Gate";
import { useDisbursements } from "@/lib/hooks/useApi";
import { useTranslations } from "next-intl";
import { Plus, Loader2 } from "lucide-react";
import type { DisbursementRequest } from "@/lib/api/types";
import type { BadgeTone } from "@/lib/design-data";

function statusTone(status: string): BadgeTone {
    if (status === "issued") return "success";
    if (status === "approved") return "info";
    if (status === "confirmed") return "warning";
    if (status === "rejected") return "danger";
    return "neutral";
}

function typeTone(type: string): BadgeTone {
    if (type === "material") return "info";
    if (type === "fuel") return "warning";
    if (type === "spare_part") return "neutral";
    return "neutral";
}

export default function DisbursementsPage() {
    const [statusFilter, setStatusFilter] = React.useState("");
    const [typeFilter, setTypeFilter] = React.useState("");
    const { data, isLoading, isError } = useDisbursements({
        status: statusFilter || undefined,
        type: typeFilter || undefined,
    });
    const t = useTranslations("app");

    const statuses = ["draft", "confirmed", "approved", "issued", "rejected"];
    const types = ["material", "spare_part", "fuel", "oil"];

    return (
        <div className="space-y-6">
            <PageHeader
                title="طلبات الصرف"
                description="إدارة طلبات صرف المواد والوقود وقطع الغيار"
                actions={
                    <Gate permission="create_disbursement_request">
                        <ButtonLink href="/inventory/disbursements/new" variant="accent" className="gap-2">
                            <Plus className="h-4 w-4" />
                            طلب صرف جديد
                        </ButtonLink>
                    </Gate>
                }
            />

            {/* Filters */}
            <section className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-3">
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-surface px-3 text-sm"
                >
                    <option value="">الحالة: الكل</option>
                    {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-surface px-3 text-sm"
                >
                    <option value="">النوع: الكل</option>
                    {types.map(tp => (
                        <option key={tp} value={tp}>{tp}</option>
                    ))}
                </select>
            </section>

            {isLoading && (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" /> جار التحميل...
                </div>
            )}

            {isError && (
                <div className="rounded-xl border border-danger/20 bg-danger/5 p-6 text-center text-danger-text">
                    فشل تحميل البيانات. تحقق من اتصال الشبكة.
                </div>
            )}

            {data && (
                <DataTable
                    columns={[
                        { accessorKey: "request_number", header: "رقم الطلب", meta: { mono: true } },
                        {
                            accessorKey: "project",
                            header: "المشروع",
                            cell: ({ row }) => row.original.project?.name ?? row.original.project_id,
                        },
                        {
                            accessorKey: "type",
                            header: "النوع",
                            cell: ({ getValue }) => (
                                <Badge tone={typeTone(getValue() as string)}>{getValue() as string}</Badge>
                            ),
                        },
                        {
                            accessorKey: "status",
                            header: "الحالة",
                            cell: ({ getValue }) => (
                                <Badge tone={statusTone(getValue() as string)}>{getValue() as string}</Badge>
                            ),
                        },
                        {
                            accessorKey: "items",
                            header: "عدد البنود",
                            meta: { mono: true, align: "right" },
                            cell: ({ getValue }) => (getValue() as any[]).length,
                        },
                        { accessorKey: "created_at", header: "تاريخ الطلب", meta: { mono: true } },
                        {
                            id: "actions",
                            header: t("actions"),
                            cell: ({ row }: { row: { original: DisbursementRequest } }) => (
                                <ButtonLink
                                    href={`/inventory/disbursements/${row.original.id}`}
                                    variant="ghost"
                                    size="sm"
                                >
                                    عرض
                                </ButtonLink>
                            ),
                        },
                    ]}
                    data={data}
                />
            )}

            {data && data.length === 0 && !isLoading && (
                <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center text-muted-foreground">
                    <p className="text-sm font-medium">لا توجد طلبات صرف</p>
                    <p className="text-xs mt-1">ابدأ بإنشاء طلب صرف جديد</p>
                </div>
            )}
        </div>
    );
}
