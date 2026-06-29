"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/shared/DataTable";
import { toneForStatus } from "@/lib/design-data";
import { FileCheck, Filter, Search, Plus, Calendar } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

const logsData = [
  { id: "LOG-1022", date: "Jun 24, 2026", project: "North Access Road", recorder: "Fahad Omar", work: "Excavation", status: "Submitted" },
  { id: "LOG-1021", date: "Jun 23, 2026", project: "North Access Road", recorder: "Fahad Omar", work: "Sub-base prep", status: "Approved" },
  { id: "LOG-1020", date: "Jun 24, 2026", project: "Central Yard Expansion", recorder: "Ali Sami", work: "Fencing", status: "Review Required" },
  { id: "LOG-1019", date: "Jun 24, 2026", project: "Pump Station", recorder: "S. Nasser", work: "Site Clearing", status: "Submitted" },
];

export default function ProgressPage() {
  const t = useTranslations("fieldRecords.progress");
  const app = useTranslations("app");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Jun 24, 2026
            </Button>
            <Button variant="accent" className="gap-2">
              <Plus className="h-4 w-4" />
              {t("newLog")}
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: t("submittedLogs"), value: "12", sub: t("pendingReview"), icon: FileCheck },
          { label: t("missingAttendance"), value: "2", sub: t("criticalAlerts"), icon: Filter },
          { label: t("completionRate"), value: "88%", sub: t("vsLastWeek"), icon: Search },
          { label: t("totalManHours"), value: "1,240", sub: t("loggedToday"), icon: Plus },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className="h-4 w-4 text-muted-foreground opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold font-mono">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider">{t("submissionQueue")}</h3>
          <div className="flex gap-2">
            <Badge tone="success">9 {t("validated")}</Badge>
            <Badge tone="warning">3 {t("pending")}</Badge>
          </div>
        </div>
        <DataTable
          columns={[
            { accessorKey: "id", header: t("logId"), meta: { mono: true } },
            { accessorKey: "date", header: app("date") },
            { accessorKey: "project", header: "Project" },
            { accessorKey: "recorder", header: t("loggedBy") },
            { accessorKey: "work", header: t("primaryWork") },
            {
              accessorKey: "status",
              header: t("approvalStatus"),
              cell: ({ getValue }) => {
                const val = getValue() as string;
                return <Badge tone={toneForStatus(val)}>{val}</Badge>;
              },
            },
            {
              id: "actions",
              header: "",
              cell: () => <button className="text-accent font-bold text-[10px] hover:underline uppercase">{app("review")}</button>,
            },
          ]}
          data={logsData}
        />
      </div>
    </div>
  );
}
