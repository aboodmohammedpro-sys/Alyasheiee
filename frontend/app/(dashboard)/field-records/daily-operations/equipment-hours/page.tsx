"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Gate } from "@/components/shared/Gate";
import { useProjects, useEquipment, useEmployees, useCreateDailyLog } from "@/lib/hooks/useApi";
import { dailyLogEquipmentSchema, type DailyLogEquipmentFormData } from "@/lib/schemas";
import { Plus, Trash2, Settings, AlertCircle } from "lucide-react";

export default function EquipmentHoursPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const create = useCreateDailyLog();

    const { data: projects = [] } = useProjects();
    const { data: equipments = [] } = useEquipment();
    const { data: employees = [] } = useEmployees();

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<DailyLogEquipmentFormData>({
        resolver: zodResolver(dailyLogEquipmentSchema) as any,
        defaultValues: {
            project_id: searchParams.get("project") || "",
            date: searchParams.get("date") || new Date().toISOString().split("T")[0],
            shift: (searchParams.get("shift") as any) || "morning",
            equipment: [],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "equipment" });

    const onSubmit = (data: any) => {
        const payload = {
            project_id: data.project_id,
            date: data.date,
            shift: data.shift,
            general_notes: data.general_notes,
            equipment: data.equipment,
        };

        create.mutate(payload as any, {
            onSuccess: () => router.push("/field-records/daily-operations"),
        });
    };

    const projectOptions = (projects as any)?.data?.data ?? projects;
    const equipmentOptions = (equipments as any) ?? [];
    const employeeOptions = (employees as any) ?? [];

    return (
        <Gate permission="create_daily_log">
            <div className="mx-auto max-w-7xl space-y-6">
                <PageHeader
                    title="ساعات المعدات"
                    description="تسجيل ساعات عمل المعدات وقراءات العداد للوردية المحددة"
                    actions={<ButtonLink href="/field-records/daily-operations" variant="ghost">رجوع للعمليات</ButtonLink>}
                />

                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                    <div className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">التاريخ</label>
                            <input
                                type="date"
                                {...register("date")}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-accent outline-none"
                            />
                            {errors.date && <p className="text-xs text-danger-text">{errors.date.message}</p>}
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">المشروع</label>
                            <select
                                {...register("project_id")}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-accent outline-none"
                            >
                                <option value="">اختر المشروع</option>
                                {(projectOptions as any[]).map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            {errors.project_id && <p className="text-xs text-danger-text">{errors.project_id.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">الوردية</label>
                            <select
                                {...register("shift")}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-accent outline-none"
                            >
                                <option value="morning">ورديّة صباحية</option>
                                <option value="night_1">وردية مسائية أولى</option>
                                <option value="night_2">وردية مسائية ثانية</option>
                            </select>
                        </div>

                        <div className="space-y-1.5 md:col-span-4">
                            <input
                                {...register("general_notes")}
                                placeholder="ملاحظات عامة على الوردية (اختياري)..."
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-accent outline-none"
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                            <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4 text-accent" />
                                <h3 className="text-sm font-bold uppercase tracking-wider">سجل المعدات</h3>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-accent"
                                onClick={() => append({
                                    equipment_id: "", operator_id: "",
                                    start_meter: 0, end_meter: 0, work_hours: 0,
                                    idle_hours: 0, breakdown_hours: 0, status: "working"
                                })}
                            >
                                <Plus className="h-4 w-4" /> إضافة معدة
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted text-xs uppercase text-muted-foreground border-b border-border">
                                    <tr>
                                        <th className="px-4 py-3 text-start w-52">المعدة</th>
                                        <th className="px-4 py-3 text-start w-48">السائق/المشغل</th>
                                        <th className="px-4 py-3 text-start w-28">الحالة</th>
                                        <th className="px-4 py-3 text-start w-20">بداية</th>
                                        <th className="px-4 py-3 text-start w-20">نهاية</th>
                                        <th className="px-4 py-3 text-start w-20">ساعات عمل</th>
                                        <th className="px-4 py-3 text-start w-20">عطل</th>
                                        <th className="px-4 py-3 text-center w-12">حذف</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {fields.map((field, idx) => (
                                        <tr key={field.id} className="group hover:bg-muted/10">
                                            <td className="px-4 py-2">
                                                <select
                                                    {...register(`equipment.${idx}.equipment_id`)}
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none"
                                                >
                                                    <option value="">اختر...</option>
                                                    {equipmentOptions.map((e: any) => (
                                                        <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
                                                    ))}
                                                </select>
                                                {errors.equipment?.[idx]?.equipment_id && (
                                                    <p className="text-xs text-danger-text mt-0.5">{errors.equipment[idx]?.equipment_id?.message}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                <select
                                                    {...register(`equipment.${idx}.operator_id`)}
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none"
                                                >
                                                    <option value="">لا يوجد</option>
                                                    {employeeOptions.map((e: any) => (
                                                        <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
                                                    ))}
                                                </select>
                                                {errors.equipment?.[idx]?.operator_id && (
                                                    <p className="text-xs text-danger-text mt-0.5">{errors.equipment[idx]?.operator_id?.message}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                <select
                                                    {...register(`equipment.${idx}.status`)}
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none"
                                                >
                                                    <option value="working">عمل</option>
                                                    <option value="standby">انتظار</option>
                                                    <option value="breakdown">عطل</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    {...register(`equipment.${idx}.start_meter`)}
                                                    type="number"
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 font-mono text-sm focus:bg-background focus:border-accent outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    {...register(`equipment.${idx}.end_meter`)}
                                                    type="number"
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 font-mono text-sm focus:bg-background focus:border-accent outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    {...register(`equipment.${idx}.work_hours`)}
                                                    type="number" step="0.5"
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 font-mono text-sm focus:bg-background focus:border-accent outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    {...register(`equipment.${idx}.breakdown_hours`)}
                                                    type="number" step="0.5"
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 font-mono text-sm focus:bg-background focus:border-accent outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(idx)}
                                                    className="p-2 text-muted-foreground hover:text-danger-text opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {fields.length === 0 && (
                                <div className="py-12 text-center text-muted-foreground">
                                    لا توجد معدات. انقر على "إضافة معدة" للبدء.
                                </div>
                            )}
                        </div>
                        {errors.equipment && errors.equipment.message && (
                            <div className="p-4 bg-danger/5 border-t border-danger/10 text-sm text-danger-text flex gap-2 items-center">
                                <AlertCircle className="h-4 w-4" />
                                {errors.equipment.message}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="submit" variant="accent" isLoading={create.isPending} className="px-8 h-12">
                            حفظ السجل
                        </Button>
                    </div>
                </form>
            </div>
        </Gate>
    );
}
