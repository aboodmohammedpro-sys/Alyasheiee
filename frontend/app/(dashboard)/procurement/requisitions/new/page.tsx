"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Gate } from "@/components/shared/Gate";
import { useProjects, useMaterials, useCreatePurchaseRequest } from "@/lib/hooks/useApi";
import { purchaseRequestSchema, type PurchaseRequestFormData } from "@/lib/schemas";
import { Plus, Trash2, ShoppingCart, AlertCircle } from "lucide-react";

export default function NewRequisitionPage() {
  const router = useRouter();
  const create = useCreatePurchaseRequest();

  const { data: projects = [] } = useProjects();
  const { data: materials = [] } = useMaterials();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PurchaseRequestFormData>({
    resolver: zodResolver(purchaseRequestSchema),
    defaultValues: {
      items: [{ material_id: "", quantity: 1, estimated_unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const onSubmit = (data: PurchaseRequestFormData) => {
    create.mutate(data, {
      onSuccess: () => router.push("/procurement/requisitions"),
    });
  };

  const projectOptions = (projects as any)?.data?.data ?? projects;
  const materialOptions = (materials as any) ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="طلب شراء جديد (PR)"
        description="إنشاء طلب شراء مواد ومستلزمات للمشروع"
        actions={<ButtonLink href="/procurement/requisitions" variant="ghost">إلغاء</ButtonLink>}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
        {/* Header Data */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <ShoppingCart className="h-5 w-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">البيانات الأساسية</h3>
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
              {errors.project_id && <p className="text-xs text-danger-text">{errors.project_id.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">تاريخ الاحتياج المطلوب</label>
              <input
                type="date"
                {...register("required_date")}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:border-accent outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">مبرر الطلب / الملاحظات</label>
              <textarea
                {...register("notes")}
                rows={4}
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:border-accent outline-none resize-none"
                placeholder="أسباب طلب الشراء..."
              />
            </div>
          </div>
        </div>

        {/* PR Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <h3 className="text-sm font-bold uppercase tracking-wider">بنود الطلب والتسعير التقديري</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 text-accent"
                onClick={() => append({ material_id: "", quantity: 1, estimated_unit_price: 0 })}
              >
                <Plus className="h-4 w-4" /> إضافة صنف
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-start">المادة المطلوبة</th>
                    <th className="px-4 py-3 w-28 text-start">الكمية</th>
                    <th className="px-4 py-3 w-32 text-start">السعر التقريبي</th>
                    <th className="px-4 py-3 w-16 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {fields.map((field, idx) => (
                    <tr key={field.id} className="group hover:bg-muted/10">
                      <td className="px-4 py-2">
                        <select
                          {...register(`items.${idx}.material_id`)}
                          className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-sm focus:bg-background focus:border-accent outline-none cursor-pointer"
                        >
                          <option value="">اختر المادة...</option>
                          {materialOptions.map((m: any) => (
                            <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                          ))}
                        </select>
                        {errors.items?.[idx]?.material_id && (
                          <p className="text-xs text-danger-text mt-0.5">{errors.items[idx]?.material_id?.message}</p>
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
                      <td className="px-4 py-2 relative">
                        <input
                          {...register(`items.${idx}.estimated_unit_price`)}
                          type="number"
                          step="0.01"
                          className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 font-mono text-sm focus:bg-background focus:border-accent outline-none pe-10"
                          placeholder="0.00"
                        />
                        <span className="absolute end-6 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">SAR</span>
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
            {errors.items && errors.items.root && (
              <div className="p-4 bg-danger/5 border-t border-danger/10 text-sm text-danger-text flex gap-2 items-center">
                <AlertCircle className="h-4 w-4" />
                {errors.items.root.message}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <ButtonLink href="/procurement/requisitions" variant="ghost">إلغاء</ButtonLink>
            <Button type="submit" variant="accent" isLoading={create.isPending} className="px-8 h-10">
              إرسال طلب الشراء
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
