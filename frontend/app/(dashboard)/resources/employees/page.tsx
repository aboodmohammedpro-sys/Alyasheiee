"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { employees, toneForStatus } from "@/lib/design-data";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function EmployeesPage() {
  const t = useTranslations("resources.employees");
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
            { accessorKey: "id", header: t("employeeCode"), meta: { mono: true } },
            { accessorKey: "name", header: t("name") },
            { accessorKey: "role", header: t("position") },
            { accessorKey: "phone", header: t("phone") },
            { accessorKey: "project", header: t("currentProject") },
            {
              accessorKey: "status",
              header: t("status"),
              cell: ({ getValue }) => {
                const val = getValue() as string;
                return <Badge tone={toneForStatus(val)}>{val}</Badge>;
              },
            },
          ]}
          data={employees as any}
        />
      </div>
    </div>
  );
}
