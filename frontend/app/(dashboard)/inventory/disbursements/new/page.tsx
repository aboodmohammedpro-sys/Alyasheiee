"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProjects, useCreateDisbursement, useMaterials } from "@/lib/hooks/useApi";
import { disbursementSchema, type DisbursementFormData } from "@/lib/schemas";
import { Plus, Trash2, Package } from "lucide-react";
import { Gate } from "@/components/shared/Gate";

const DISBURSEMENT_TYPES = [
    { value: "material", label: "مواد" },
    { value: "spare_part", label: "قطع غيار" },
    { value: "fuel", label: "وقود / ديزل" },
    { value: "oil", label: "زيت" },
];

export default function NewDisbursementPage() {
    const router = useRouter();
    const { data: projects = [] } = useProjects();
    const { data: materials = [] } = useMaterials();
    const create = useCreateDisbursement();

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<DisbursementFormData>({
        resolver: zodResolver(disbursementSchema),
        defaultValues: {
            type: "material",
            items: [{ item_name: "", quantity: 1, unit: "", material_id: undefined }],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "items" });

    const onSubmit = (data: DisbursementFormData) => {
        create.mutate(data, {
            onSuccess: () => router.push("/inventory/disbursements"),
        });
    };

    const projectData = watch("project_id");

    // Filter to this project's actual data
    const projectOptions = (projects as any)?.data?.data ?? projects;

    return (
        <Gate permission="create_disbursement_request">
            <div className="mx-auto max-w-5xl space-y-6">
                <PageHeader
                    title="طلب صرف جديد"
                    description="أنشئ طلب صرف مواد أو وقود أو قطع غيار من المستودع"
                    actions={
                        <ButtonLink href="/inventory/disbursements" variant="ghost">إلغاء</ButtonLink>
                    }
                />

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
                    {/* Header */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Package className="h-5 w-5" />
                                <h3 className="text-sm font-bold uppercase tracking-wider">بيانات الطلب</h3>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold">المشروع <span className="text-danger-text">*</span></label>
                                <select
                                    {...register("project_id")}
                                    className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:border-accent outline-none"
                                >
                                    <option value="">اختر المشروع</option>
                                    {(projectOptions as any[]).map((p: any) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                                {errors.project_id && (
                                    <p className="text-xs text-danger-text">{errors.project_id.message}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold">نوع الصرف <span className="text-danger-text">*</span></label>
                                <select
                                    {...register("type")}
                                    className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:border-accent outline-none"
                                >
                                    {DISBURSEMENT_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold">ملاحظات</label>
                                <textarea
                                    {...register("notes")}
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:border-accent outline-none resize-none"
                                    placeholder="أي ملاحظات..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                                <h3 className="text-sm font-bold uppercase tracking-wider">البنود</h3>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2 text-accent"
                                    onClick={() => append({ item_name: "", quantity: 1, unit: "" })}
                                >
                                    <Plus className="h-4 w-4" /> إضافة بند
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted text-xs uppercase text-muted-foreground border-b border-border">
                                        <tr>
                                            <th className="px-4 py-3 text-start">اسم الصنف</th>
                                            <th className="px-4 py-3 w-24 text-start">الكمية</th>
                                            <th className="px-4 py-3 w-24 text-start">الوحدة</th>
                                            <th className="px-4 py-3 w-16 text-center">حذف</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border bg-card">
                                        {fields.map((field, idx) => (
                                            <tr key={field.id} className="group hover:bg-muted/10">
                                                <td className="px-4 py-2">
                                                    <input
                                                        {...register(`items.${idx}.item_name`)}
                                                        className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none"
                                                        placeholder="اسم المادة أو الصنف"
                                                    />
                                                    {errors.items?.[idx]?.item_name && (
                                                        <p className="text-xs text-danger-text mt-0.5">{errors.items[idx]?.item_name?.message}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        {...register(`items.${idx}.quantity`)}
                                                        type="number"
                                                        step="0.01"
                                                        className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 font-mono text-sm focus:bg-background focus:border-accent outline-none"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        {...register(`items.${idx}.unit`)}
                                                        className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none"
                                                        placeholder="لتر، حبة..."
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(idx)}
                                                        disabled={fields.length === 1}
                                                        className="p-2 text-muted-foreground hover:text-danger-text opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-25"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {create.isError && (
                            <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger-text">
                                فشل إرسال الطلب. الرجاء المحاولة مجدداً.
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <ButtonLink href="/inventory/disbursements" variant="ghost">إلغاء</ButtonLink>
                            <Button type="submit" variant="accent" isLoading={create.isPending} className="px-8">
                                إرسال الطلب
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Gate>
    );
}
