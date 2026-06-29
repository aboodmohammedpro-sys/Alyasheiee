"use client";

import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

const suppliers = [
  { code: "SUP-0104", name: "Arabian Steel Co.", category: "Steel", rating: "A", status: "Approved" },
  { code: "SUP-0210", name: "Najd Cement Supply", category: "Cement", rating: "B", status: "Approved" },
  { code: "SUP-0319", name: "Field Safety Trading", category: "PPE", rating: "C", status: "Pending Review" },
];

export default function SuppliersPage() {
  const t = useTranslations("procurement.suppliers");
  const app = useTranslations("app");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("complianceRate")}
        actions={
          <Button variant="accent" className="gap-2">
            <Plus className="h-4 w-4" />
            {app("create")}
          </Button>
        }
      />
      <DataTable
        columns={[
          { accessorKey: "code", header: "Code", meta: { mono: true } },
          { accessorKey: "name", header: t("name") },
          { accessorKey: "category", header: t("contact") },
          { accessorKey: "rating", header: t("rating"), meta: { mono: true } },
          {
            accessorKey: "status",
            header: t("status"),
            cell: ({ getValue }) => {
              const val = getValue() as string;
              return <Badge tone={val === "Approved" ? "success" : "warning"}>{val}</Badge>;
            },
          },
        ]}
        data={suppliers}
      />
    </div>
  );
}
