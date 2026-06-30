"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Gate } from "@/components/shared/Gate";
import { useProjects, useEquipment, useEmployees, useCreateDailyLog } from "@/lib/hooks/useApi";
import { dailyLogTripsSchema, type DailyLogTripsFormData } from "@/lib/schemas";
import { Plus, Trash2, Truck, AlertCircle } from "lucide-react";

export default function TruckTripsPage() {
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
        formState: { errors },
    } = useForm<DailyLogTripsFormData>({
        resolver: zodResolver(dailyLogTripsSchema) as any,
        defaultValues: {
            project_id: searchParams.get("project") || "",
            date: searchParams.get("date") || new Date().toISOString().split("T")[0],
            shift: (searchParams.get("shift") as any) || "morning",
            trips: [] as any[],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "trips" });

    const onSubmit = (data: any) => {
        const payload = {
            project_id: data.project_id,
            date: data.date,
            shift: data.shift,
            trips: data.trips,
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
                    title="رحلات الشاحنات"
                    description="تسجيل رحلات القلابات والشاحنات للمواد المنقولة خلال الوردية"
                    actions={<ButtonLink href="/field-records/daily-operations" variant="ghost">رجوع للعمليات</ButtonLink>}
                />

                <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                    <div className="grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">التاريخ</label>
                            <input
                                type="date"
                                {...register("date")}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:border-accent outline-none"
                            />
                            {errors.date && <p className="text-xs text-danger-text">{errors.date.message}</p>}
                        </div>

                        <div className="space-y-1.5">
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
                    </div>

                    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-accent" />
                                <h3 className="text-sm font-bold uppercase tracking-wider">سجل الرحلات</h3>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-accent"
                                onClick={() => append({
                                    equipment_id: "", driver_id: "",
                                    material_type: "", from_location: "", to_location: "",
                                    trip_count: 1, quantity: 0
                                })}
                            >
                                <Plus className="h-4 w-4" /> إضافة رحلة
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted text-xs uppercase text-muted-foreground border-b border-border">
                                    <tr>
                                        <th className="px-4 py-3 text-start w-48">الشاحنة / القلاب</th>
                                        <th className="px-4 py-3 text-start w-48">السائق</th>
                                        <th className="px-4 py-3 text-start">نوع المادة</th>
                                        <th className="px-4 py-3 text-start">من</th>
                                        <th className="px-4 py-3 text-start">إلى</th>
                                        <th className="px-4 py-3 text-start w-24">عدد الرحلات</th>
                                        <th className="px-4 py-3 text-start w-24">الكمية (م3)</th>
                                        <th className="px-4 py-3 text-center w-12">حذف</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-card">
                                    {fields.map((field, idx) => (
                                        <tr key={field.id} className="group hover:bg-muted/10">
                                            <td className="px-4 py-2">
                                                <select
                                                    {...register(`trips.${idx}.equipment_id`)}
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none"
                                                >
                                                    <option value="">اختر...</option>
                                                    {equipmentOptions.map((e: any) => (
                                                        <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
                                                    ))}
                                                </select>
                                                {errors.trips?.[idx]?.equipment_id && (
                                                    <p className="text-xs text-danger-text mt-0.5">{errors.trips[idx]?.equipment_id?.message}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                <select
                                                    {...register(`trips.${idx}.driver_id`)}
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none"
                                                >
                                                    <option value="">لا يوجد</option>
                                                    {employeeOptions.map((e: any) => (
                                                        <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
                                                    ))}
                                                </select>
                                                {errors.trips?.[idx]?.driver_id && (
                                                    <p className="text-xs text-danger-text mt-0.5">{errors.trips[idx]?.driver_id?.message}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    {...register(`trips.${idx}.material_type`)}
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none"
                                                />
                                                {errors.trips?.[idx]?.material_type && (
                                                    <p className="text-xs text-danger-text mt-0.5">{errors.trips[idx]?.material_type?.message}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    {...register(`trips.${idx}.from_location`)}
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    {...register(`trips.${idx}.to_location`)}
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    {...register(`trips.${idx}.trip_count`)}
                                                    type="number"
                                                    className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 font-mono text-sm focus:bg-background focus:border-accent outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input
                                                    {...register(`trips.${idx}.quantity`)}
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
                                    لا توجد رحلات. انقر على "إضافة رحلة" للبدء.
                                </div>
                            )}
                        </div>
                        {errors.trips && errors.trips.message && (
                            <div className="p-4 bg-danger/5 border-t border-danger/10 text-sm text-danger-text flex gap-2 items-center">
                                <AlertCircle className="h-4 w-4" />
                                {errors.trips.message}
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
