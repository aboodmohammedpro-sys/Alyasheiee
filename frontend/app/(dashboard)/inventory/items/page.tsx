"use client";

import * as React from "react";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { inventoryItems, toneForStatus } from "@/lib/design-data";
import { useTranslations } from "next-intl";

export default function ItemsPage() {
  const t = useTranslations("inventory.items");
  const tw = useTranslations("inventory.warehouses");
  const app = useTranslations("app");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("stockDistribution")}
        actions={
          <>
            <Button variant="outline">{app("export")} CSV</Button>
            <Button variant="accent">{app("export")}</Button>
          </>
        }
      />
      <section className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-3">
        <select className="h-10 rounded-md border border-input bg-surface px-3 text-sm">
          <option>{tw("title")}: {app("all")}</option>
        </select>
        <select className="h-10 rounded-md border border-input bg-surface px-3 text-sm">
          <option>{t("category")}: {app("all")}</option>
        </select>
        <label className="flex h-10 items-center gap-2 rounded-md border border-input bg-surface px-3 text-sm">
          <input type="checkbox" />
          {tw("lowOnly")}
        </label>
      </section>
      <DataTable
        columns={[
          { accessorKey: "sku", header: t("sku"), meta: { mono: true } },
          { accessorKey: "item", header: t("itemName") },
          { accessorKey: "category", header: t("category") },
          { accessorKey: "uom", header: t("uom"), meta: { mono: true } },
          { accessorKey: "qty", header: t("onHand"), meta: { mono: true, align: "right" } },
          { accessorKey: "unitPrice", header: t("unitCost"), meta: { mono: true, align: "right" } },
          {
            accessorKey: "status",
            header: app("status"),
            cell: ({ getValue }) => {
              const val = getValue() as string;
              return <Badge tone={toneForStatus(val)}>{val}</Badge>;
            },
          },
        ]}
        data={[...inventoryItems]}
      />
    </div>
  );
}

