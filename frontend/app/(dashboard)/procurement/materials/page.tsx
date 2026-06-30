"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/shared/DataTable";
import { Gate } from "@/components/shared/Gate";
import { useMaterials } from "@/lib/hooks/useApi";
import { Plus, Loader2, Search } from "lucide-react";
import type { Material } from "@/lib/api/types";

export default function MaterialsPage() {
    const [search, setSearch] = React.useState("");
    const [category, setCategory] = React.useState("");
    const { data, isLoading, isError } = useMaterials({ search: search || undefined, category: category || undefined });

    const categories = ["Cement", "Steel", "Fuel", "Spare Parts", "PPE", "Tools", "Other"];

    return (
        <div className="space-y-6">
            <PageHeader
                title="كتالوج المواد"
                description="جميع المواد والأصناف المستخدمة في المشاريع"
                actions={
                    <Gate permission="manage_projects">
                        <ButtonLink href="/procurement/materials/new" variant="accent" className="gap-2">
                            <Plus className="h-4 w-4" />
                            إضافة مادة
                        </ButtonLink>
                    </Gate>
                }
            />

            {/* Filters */}
            <section className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-3">
                <label className="relative flex items-center md:col-span-2">
                    <Search className="absolute start-3 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="ابحث عن مادة..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="h-10 w-full rounded-md border border-input bg-surface ps-10 pe-4 text-sm focus:border-accent outline-none"
                    />
                </label>
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="h-10 rounded-md border border-input bg-surface px-3 text-sm"
                >
                    <option value="">الفئة: الكل</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </section>

            {isLoading && (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" /> جار التحميل...
                </div>
            )}

            {isError && (
                <div className="rounded-xl border border-danger/20 bg-danger/5 p-6 text-center text-danger-text">
                    فشل تحميل قائمة المواد. الرجاء التحقق من اتصال الشبكة.
                </div>
            )}

            {data && (
                <DataTable
                    columns={[
                        { accessorKey: "code", header: "الكود", meta: { mono: true } },
                        { accessorKey: "name", header: "اسم المادة" },
                        { accessorKey: "category", header: "الفئة" },
                        { accessorKey: "unit", header: "الوحدة", meta: { mono: true } },
                        {
                            id: "actions",
                            header: "الإجراءات",
                            cell: ({ row }: { row: { original: Material } }) => (
                                <ButtonLink href={`/procurement/materials/${row.original.id}`} variant="ghost" size="sm">
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
                    <p className="text-sm font-medium">لا توجد مواد في الكتالوج</p>
                    <p className="text-xs mt-1">ابدأ بإضافة مادة جديدة</p>
                </div>
            )}
        </div>
    );
}
