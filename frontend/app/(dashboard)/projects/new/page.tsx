"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Gate } from "@/components/shared/Gate";
import { useCreateProject } from "@/lib/hooks/useApi";
import { projectSchema, type ProjectFormData } from "@/lib/schemas";

const STATUS_OPTIONS = [
  { value: "planning", label: "مرحلة التخطيط" },
  { value: "active", label: "نشط / جاري العمل" },
  { value: "on_hold", label: "متوقف مؤقتاً" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const create = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: {
      status: "planning",
      estimated_budget: 0,
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    create.mutate(data, {
      onSuccess: () => router.push("/projects"),
    });
  };

  return (
    <Gate permission="manage_projects">
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader
          title="مشروع جديد"
          description="إضافة مشروع وعقد مقاولة جديد إلى النظام"
          actions={<ButtonLink href="/projects" variant="ghost">إلغاء</ButtonLink>}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="رمز المشروع"
              placeholder="مثال: PRJ-2026-04"
              required
              {...register("code")}
              error={errors.code?.message}
            />
            <Input
              label="اسم المشروع"
              placeholder="مثال: إنشاء طريق مكة"
              required
              {...register("name")}
              error={errors.name?.message}
            />

            <Input
              label="اسم العميل (المالك)"
              placeholder="مثال: وزارة النقل"
              {...register("client_name")}
            />

            <Input
              label="موقع المشروع"
              placeholder="المدينة / المنطقة"
              {...register("location")}
            />

            <Input
              type="date"
              label="تاريخ البدء"
              {...register("start_date")}
            />

            <Input
              type="date"
              label="تاريخ الانتهاء المتوقع"
              {...register("expected_end_date")}
            />

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">الميزانية التقديرية (SAR)</label>
              <input
                type="number"
                {...register("estimated_budget")}
                className="h-10 w-full rounded-md border border-input bg-card px-3 font-mono text-sm focus:border-accent outline-none"
              />
              {errors.estimated_budget && <p className="text-xs text-danger-text">{errors.estimated_budget.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">حالة المشروع <span className="text-danger-text">*</span></label>
              <select
                {...register("status")}
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus:border-accent outline-none"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.status && <p className="text-xs text-danger-text">{errors.status.message}</p>}
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-semibold">وصف المشروع / ملاحظات</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:border-accent outline-none resize-none"
                placeholder="نطاق العمل الأساسي..."
              />
            </div>
          </div>

          {create.isError && (
            <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger-text">
              فشل إنشاء المشروع. الرجاء التحقق من البيانات والمحاولة مجدداً.
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <ButtonLink href="/projects" variant="ghost">إلغاء</ButtonLink>
            <Button type="submit" variant="accent" isLoading={create.isPending} className="px-8">
              حفظ المشروع
            </Button>
          </div>
        </form>
      </div>
    </Gate>
  );
}
