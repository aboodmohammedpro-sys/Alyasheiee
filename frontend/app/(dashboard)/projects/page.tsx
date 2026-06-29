"use client";

import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { projects, toneForStatus } from "@/lib/design-data";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ProjectsPage() {
  const t = useTranslations("projects");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href="/projects/new">
            <Button variant="accent" className="gap-2">
              <Plus className="h-4 w-4" />
              {t("new")}
            </Button>
          </Link>
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <DataTable
          columns={[
            { accessorKey: "code", header: t("projectCode"), meta: { mono: true } },
            { accessorKey: "name", header: t("projectName") },
            { accessorKey: "location", header: t("location") },
            { accessorKey: "startDate", header: t("startDate") },
            { accessorKey: "endDate", header: t("endDate") },
            {
              accessorKey: "progress",
              header: t("progress"),
              cell: ({ getValue }) => (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${getValue() as number}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono">{String(getValue())}%</span>
                </div>
              ),
            },
            {
              accessorKey: "status",
              header: t("status"),
              cell: ({ getValue }) => {
                const val = getValue() as string;
                return <Badge tone={toneForStatus(val)}>{val}</Badge>;
              },
            },
          ]}
          data={projects as any}
        />
      </div>
    </div>
  );
}
