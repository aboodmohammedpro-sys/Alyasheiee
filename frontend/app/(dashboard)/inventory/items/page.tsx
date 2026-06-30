"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/shared/DataTable";
import { useWarehouses, useWarehouseStock } from "@/lib/hooks/useApi";
import { Package, Search, Loader2 } from "lucide-react";
import type { InventoryStock } from "@/lib/api/types";

export default function InventoryItemsPage() {
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<string>("");
  const { data: warehouses = [] } = useWarehouses();
  const { data: stockItems, isLoading, isError } = useWarehouseStock(selectedWarehouse);

  React.useEffect(() => {
    if (warehouses.length > 0 && !selectedWarehouse) {
      setSelectedWarehouse((warehouses[0] as any).id);
    }
  }, [warehouses, selectedWarehouse]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="أرصدة المخزون"
        description="استعرض الكميات المتوفرة من المواد وقطع الغيار في جميع المستودعات"
      />

      <section className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-3">
        <label className="relative flex items-center md:col-span-2">
          <Search className="absolute start-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="ابحث بالاسم أو الكود..."
            className="h-10 w-full rounded-md border border-input bg-surface ps-10 pe-4 text-sm focus:border-accent outline-none"
          />
        </label>
        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
          className="h-10 rounded-md border border-input bg-surface px-3 text-sm focus:border-accent outline-none"
        >
          {warehouses.map((w: any) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </section>

      {isLoading && selectedWarehouse && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> جار تحميل الأرصدة...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-6 text-center text-danger-text">
          فشل تحميل بيانات المخزون.
        </div>
      )}

      {stockItems && (
        <DataTable
          columns={[
            {
              accessorKey: "material.code",
              header: "كود المادة",
              meta: { mono: true },
              cell: ({ row }) => (row.original.material as any)?.code || "N/A"
            },
            {
              accessorKey: "material.name",
              header: "اسم الصنف",
              cell: ({ row }) => (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="h-4 w-4 text-accent" />
                  </div>
                  <span className="font-semibold">{((row.original as any).material)?.name}</span>
                </div>
              ),
            },
            {
              accessorKey: "material.category",
              header: "الفئة",
              cell: ({ row }) => ((row.original as any).material)?.category || "N/A"
            },
            {
              accessorKey: "quantity",
              header: "الكمية المتوفرة",
              meta: { mono: true },
              cell: ({ row }) => {
                const qty = row.original.quantity;
                return (
                  <span className="font-mono font-bold">{qty.toLocaleString()} {((row.original as any).material)?.unit}</span>
                )
              }
            },
            {
              id: "status",
              header: "الحالة",
              cell: ({ row }) => {
                const qty = row.original.quantity;
                if (qty <= 0) return <Badge tone="danger">نفاد الكمية</Badge>;
                if (qty < 10) return <Badge tone="warning">رصيد منخفض</Badge>;
                return <Badge tone="success">متوفر</Badge>;
              },
            },
          ]}
          data={stockItems}
        />
      )}

      {stockItems && stockItems.length === 0 && !isLoading && (
        <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center text-muted-foreground">
          <p className="text-sm font-medium">לא يوجد مواد في هذا المستودع</p>
        </div>
      )}
    </div>
  );
}
