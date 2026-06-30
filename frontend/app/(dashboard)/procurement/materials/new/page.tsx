"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Gate } from "@/components/shared/Gate";
import { useCreateMaterial } from "@/lib/hooks/useApi";
import { materialSchema, type MaterialFormData } from "@/lib/schemas";

const CATEGORIES = ["Cement", "Steel", "Aggregate", "Fuel", "Spare Parts", "PPE", "Tools", "Electrical", "Plumbing", "Other"];
const UNITS = ["kg", "ton", "bag", "m3", "m2", "m", "L", "piece", "set", "roll", "box"];

export default function NewMaterialPage() {
    const router = useRouter();
    const create = useCreateMaterial();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<MaterialFormData>({
        resolver: zodResolver(materialSchema),
    });

    const onSubmit = (data: MaterialFormData) => {
        create.mutate(data, {
            onSuccess: () => router.push("/procurement/materials"),
        });
    };

    return (
        <Gate permission="manage_projects">
            <div className="mx-auto max-w-2xl space-y-6">
                <PageHeader
                    title="إضافة مادة جديدة"
                    description="أضف مادة أو صنفاً جديداً إلى كتالوج المواد"
                    actions={<ButtonLink href="/procurement/materials" variant="ghost">إلغاء</ButtonLink>}
                />

                <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <Input
                            label="كود المادة"
                            placeholder="مثال: CEM-PORT-50KG"
                            required
                            {...register("code")}
                            error={errors.code?.message}
                        />
                        <Input
                            label="اسم المادة"
                            placeholder="اسم المادة"
                            required
                            {...register("name")}
                            error={errors.name?.message}
                        />

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">الفئة <span className="text-danger-text">*</span></label>
                            <select
                                {...register("category")}
                                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:border-accent outline-none"
                            >
                                <option value="">اختر الفئة</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.category && <p className="text-xs text-danger-text">{errors.category.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold">وحدة القياس <span className="text-danger-text">*</span></label>
                            <select
                                {...register("unit")}
                                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:border-accent outline-none"
                            >
                                <option value="">اختر الوحدة</option>
                                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                            {errors.unit && <p className="text-xs text-danger-text">{errors.unit.message}</p>}
                        </div>

                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-sm font-semibold">الوصف</label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:border-accent outline-none resize-none"
                                placeholder="وصف اختياري..."
                            />
                        </div>
                    </div>

                    {create.isError && (
                        <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger-text">
                            فشل الحفظ. الرجاء المحاولة مجدداً.
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                        <ButtonLink href="/procurement/materials" variant="ghost">إلغاء</ButtonLink>
                        <Button type="submit" variant="accent" isLoading={create.isPending} className="px-8">
                            حفظ المادة
                        </Button>
                    </div>
                </form>
            </div>
        </Gate>
    );
}
