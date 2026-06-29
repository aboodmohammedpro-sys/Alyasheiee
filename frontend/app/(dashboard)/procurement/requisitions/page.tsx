"use client";

import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { requisitions } from "@/lib/design-data";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export default function RequisitionsPage() {
  const t = useTranslations("procurement.requisitions");
  const app = useTranslations("app");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <ButtonLink href="/procurement/requisitions/new" variant="accent" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("new")}
          </ButtonLink>
        }
      />
      <DataTable
        columns={[
          { accessorKey: "id", header: "PR #", meta: { mono: true } },
          { accessorKey: "project", header: app("status") === "الحالة" ? "المشروع" : "Project" },
          { accessorKey: "requester", header: app("status") === "الحالة" ? "مقدم الطلب" : "Requester" },
          { accessorKey: "total", header: app("total"), meta: { mono: true } },
          {
            accessorKey: "status",
            header: app("status"),
            cell: ({ getValue }) => {
              const val = getValue() as string;
              return <Badge tone={val === "Approved" ? "success" : val === "Rejected" ? "danger" : "warning"}>{val}</Badge>;
            },
          },
        ]}
        data={[...requisitions]}
      />
    </div>
  );
}
