"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Gate } from "@/components/shared/Gate";
import { useFuelTanks, useEquipment, useProjects, useDispenseFuel, useEmployees } from "@/lib/hooks/useApi";
import { fuelDispenseSchema, type FuelDispenseFormData } from "@/lib/schemas";
import { Info, Gauge } from "lucide-react";

export default function DispatchFuelPage() {
  const router = useRouter();
  const dispense = useDispenseFuel();

  const { data: tanks = [] } = useFuelTanks();
  const { data: equipments = [] } = useEquipment();
  const { data: projects = [] } = useProjects();
  const { data: employees = [] } = useEmployees();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FuelDispenseFormData>({
    resolver: zodResolver(fuelDispenseSchema) as any,
  });

  const onSubmit = (data: FuelDispenseFormData) => {
    // Backend doesn't explicitly have driver_id in fuel transaction table down in the migration,
    // so we append it to notes if it exists, or just send it if backend modified to accept it.
    const finalNotes = data.driver_id
      ? `[Driver UUID: ${data.driver_id}] ${data.notes || ""}`.trim()
      : data.notes;

    const payload = {
      ...data,
      notes: finalNotes,
    };

    dispense.mutate(payload, {
      onSuccess: () => router.push("/field-records/fuel"),
    });
  };

  const selectedTank = watch("from_tank_id");
  const tankObj = tanks.find((t: any) => t.id === selectedTank);

  const projectOptions = (projects as any)?.data?.data ?? projects;
  const equipmentOptions = (equipments as any) ?? [];
  const employeeOptions = (employees as any) ?? [];

  return (
    <Gate permission="manage_fuel">
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title="صرف وقود"
          description="تسجيل عملية تزويد معدة أو سيارة بالوقود"
          actions={<ButtonLink href="/field-records/fuel" variant="ghost">إلغاء</ButtonLink>}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
          {/* Source Panel */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 space-y-4">
            <h3 className="text-sm font-bold text-accent uppercase tracking-wider">مصدر الوقود</h3>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">خزان الصرف (المصدر) <span className="text-danger-text">*</span></label>
              <select
                {...register("from_tank_id")}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:border-accent outline-none"
              >
                <option value="">اختر الخزان...</option>
                {tanks.map((t: any) => (
                  <option key={t.id} value={t.id} disabled={t.current_balance <= 0}>
                    {t.name} (متوفر: {t.current_balance} لتر)
                  </option>
                ))}
              </select>
              {errors.from_tank_id && <p className="text-xs text-danger-text">{errors.from_tank_id.message}</p>}
            </div>

            {tankObj && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background rounded-lg p-3">
                <Info className="h-4 w-4 shrink-0 text-accent" />
                <p>الرصيد المتاح في {tankObj.name} هو <strong className="text-foreground">{tankObj.current_balance} لتر</strong>. لا يمكن تجاوز هذا الرقم للصرف.</p>
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold">المشروع <span className="text-danger-text">*</span></label>
              <select
                {...register("project_id")}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:border-accent outline-none"
              >
                <option value="">تحديد المشروع...</option>
                {(projectOptions as any[]).map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.project_id && <p className="text-xs text-danger-text">{errors.project_id.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">المعدة / السيارة المستلمة <span className="text-danger-text">*</span></label>
              <select
                {...register("equipment_id")}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:border-accent outline-none"
              >
                <option value="">اختر المعدة...</option>
                {equipmentOptions.map((e: any) => (
                  <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
                ))}
              </select>
              {errors.equipment_id && <p className="text-xs text-danger-text">{errors.equipment_id.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">السائق / المشغل</label>
              <select
                {...register("driver_id")}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:border-accent outline-none"
              >
                <option value="">اختر السائق...</option>
                {employeeOptions.map((e: any) => (
                  <option key={e.id} value={e.id}>{e.name} ({e.code})</option>
                ))}
              </select>
              {errors.driver_id && <p className="text-xs text-danger-text">{errors.driver_id.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">الكمية المصروفة (لتر) <span className="text-danger-text">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  {...register("quantity")}
                  className="h-10 w-full rounded-md border border-input bg-card px-3 font-mono text-sm focus:border-accent outline-none pe-12"
                />
                <span className="absolute end-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-mono">
                  L
                </span>
              </div>
              {errors.quantity && <p className="text-xs text-danger-text">{errors.quantity.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">قراءة العداد (ساعة/كم)</label>
              <div className="relative">
                <Gauge className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  {...register("odometer_reading")}
                  className="h-10 w-full rounded-md border border-input bg-card ps-9 pe-3 font-mono text-sm focus:border-accent outline-none"
                />
              </div>
              {errors.odometer_reading && <p className="text-xs text-danger-text">{errors.odometer_reading.message}</p>}
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold">ملاحظات إضافية</label>
              <textarea
                {...register("notes")}
                rows={2}
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:border-accent outline-none resize-none"
                placeholder="اسم الكابتن، موقع الاستلام..."
              />
            </div>
          </div>

          {dispense.isError && (
            <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger-text">
              حدث خطأ أثناء حفظ المعاملة. هل الكمية أكبر من رصيد الخزان المتاح؟
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <ButtonLink href="/field-records/fuel" variant="ghost">إلغاء</ButtonLink>
            <Button type="submit" variant="accent" isLoading={dispense.isPending} className="px-8">
              حفظ وتأكيد الصرف
            </Button>
          </div>
        </form>
      </div>
    </Gate>
  );
}
