"use client";

import { ButtonLink } from "@/components/ui/Button";
import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { DashboardChart } from "@/components/shared/DashboardChart";
import { dashboardStats, projects, requisitions, toneForStatus } from "@/lib/design-data";
import { useTranslations } from "next-intl";
import { Plus, Truck } from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const navT = useTranslations("nav");
  const projectsT = useTranslations("projects");
  const ordersT = useTranslations("procurement.orders");
  const appT = useTranslations("app");
  const authT = useTranslations("auth");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={authT("heroSubtitle")}
        actions={
          <div className="flex gap-2">
            <ButtonLink href="/procurement/requisitions/new" variant="accent" className="gap-2">
              <Plus className="h-4 w-4" />
              {t("newRequisition")}
            </ButtonLink>
            <ButtonLink href="/field-records/fuel/new" variant="outline" className="gap-2">
              <Truck className="h-4 w-4" />
              {t("newFuelLog")}
            </ButtonLink>
          </div>
        }
      />
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          let label = stat.label as string;
          if (stat.label === "Active projects") label = t("activeProjects");
          if (stat.label === "Pending PR approvals") label = t("pendingApprovals");
          if (stat.label === "Diesel available") label = t("dieselAvailable");
          if (stat.label === "Open warehouse alerts") label = t("warehouseAlerts");

          return (
            <StatsCard
              key={stat.label}
              {...stat}
              label={label}
            />
          );
        })}
      </section>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-6">{t("projectsOverview")}</h3>
            <DashboardChart />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("projectsOverview")}</h2>
              <ButtonLink href="/projects" variant="ghost">{appT("view")} {navT("projects")}</ButtonLink>
            </div>
            <DataTable
              columns={[
                { accessorKey: "code", header: projectsT("projectCode"), meta: { mono: true } },
                { accessorKey: "name", header: projectsT("projectName") },
                { accessorKey: "manager", header: projectsT("manager") },
                {
                  accessorKey: "status",
                  header: appT("status"),
                  cell: ({ getValue }) => {
                    const val = getValue() as string;
                    return <div className="font-semibold">{val}</div>;
                  }
                },
                { accessorKey: "progress", header: projectsT("progress"), meta: { mono: true } },
                { accessorKey: "budget", header: projectsT("budget"), meta: { mono: true } },
              ]}
              data={[...projects]}
            />
          </div>
        </div>
        <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{t("pendingApprovals")}</h2>
          <div className="mt-4 space-y-3">
            {requisitions.map((item) => (
              <div key={item.id} className="rounded-lg border border-border bg-surface p-3 transition-colors hover:border-accent/40">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{item.id}</p>
                <p className="mt-1 text-sm font-bold">{item.project}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-accent">{item.total}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

