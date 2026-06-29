"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { equipment, toneForStatus } from "@/lib/design-data";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EquipmentPage() {
  const t = useTranslations("resources.equipment");
  const app = useTranslations("app");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button variant="accent" className="gap-2">
            <Plus className="h-4 w-4" />
            {app("create")}
          </Button>
        }
      />
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <DataTable
          columns={[
            { accessorKey: "code", header: t("assetCode"), meta: { mono: true } },
            { accessorKey: "model", header: t("model") },
            { accessorKey: "project", header: "المشروع" },
            { accessorKey: "hours", header: t("engineHours"), meta: { mono: true, align: "right" } },
            {
              accessorKey: "status",
              header: t("status"),
              cell: ({ getValue }) => {
                const val = getValue() as string;
                return <Badge tone={toneForStatus(val)}>{val}</Badge>;
              },
            },
          ]}
          data={equipment as any}
        />
      </div>
    </div>
  );
}
