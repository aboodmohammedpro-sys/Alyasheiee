"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/shared/DataTable";
import { usePurchaseRequests } from "@/lib/hooks/useApi";
import { Plus, Search, Loader2 } from "lucide-react";
import type { PurchaseRequest } from "@/lib/api/types";

export default function RequisitionsPage() {
  const [search, setSearch] = React.useState("");
  const { data: prs, isLoading, isError } = usePurchaseRequests({ status: search || undefined });

  // Fallback map for tone
  const statusTone = (status: string) => {
    switch (status) {
      case "approved": return "success";
      case "submitted": return "info";
      case "ordered": return "warning";
      case "rejected": return "danger";
      default: return "neutral";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="طلبات الشراء (PR)"
        description="إدارة ومتابعة وتتبع طلبات الشراء للمشاريع والمستودعات"
        actions={
          <ButtonLink href="/procurement/requisitions/new" variant="accent" className="gap-2">
            <Plus className="h-4 w-4" />
            طلب جديد
          </ButtonLink>
        }
      />

      <section className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-4">
        <select
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 rounded-md border border-input bg-surface px-3 text-sm focus:border-accent outline-none"
        >
          <option value="">تم العرض: جميع الحالات</option>
          <option value="draft">مسودة</option>
          <option value="submitted">بانتظار المراجعة</option>
          <option value="approved">معتمد</option>
          <option value="ordered">تم الطلب (PO)</option>
          <option value="rejected">مرفوض</option>
        </select>
      </section>

      {isLoading && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          جار التحميل...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-6 text-center text-danger-text">
          فشل تحميل بيانات طلبات الشراء.
        </div>
      )}

      {prs && (
        <DataTable
          columns={[
            {
              accessorKey: "id",
              header: "رقم الطلب",
              meta: { mono: true },
              cell: ({ getValue }) => {
                const id = getValue() as string;
                return `PR-${id.slice(0, 8).toUpperCase()}`;
              }
            },
            {
              accessorKey: "project",
              header: "المشروع",
              cell: ({ row }) => (row.original as any).project?.name || "N/A"
            },
            {
              accessorKey: "requester",
              header: "صاحب الطلب",
              cell: ({ row }) => (row.original as any).requester?.name || "N/A"
            },
            {
              accessorKey: "items",
              header: "عدد البنود",
              meta: { align: "center", mono: true },
              cell: ({ row }) => row.original.items.length
            },
            {
              accessorKey: "required_date",
              header: "تاريخ الاحتياج",
              meta: { mono: true },
              cell: ({ getValue }) => getValue()
                ? new Date(getValue() as string).toLocaleDateString("en-GB")
                : "غير محدد"
            },
            {
              accessorKey: "status",
              header: "الحالة",
              cell: ({ getValue }) => {
                const val = (getValue() as string) || "draft";
                return <Badge tone={statusTone(val)}>{val}</Badge>;
              },
            },
            {
              id: "actions",
              header: "إجراء",
              cell: () => (
                <ButtonLink href="#" variant="ghost" size="sm" className="opacity-50 pointer-events-none">
                  عرض details
                </ButtonLink>
              ),
            },
          ]}
          data={prs}
        />
      )}

      {prs && prs.length === 0 && !isLoading && (
        <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center text-muted-foreground">
          <p className="text-sm font-medium">لا توجد طلبات شراء</p>
        </div>
      )}
    </div>
  );
}
