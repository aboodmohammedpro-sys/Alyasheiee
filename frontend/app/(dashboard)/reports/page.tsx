"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Layers, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DashboardChart } from "@/components/shared/DashboardChart";
import { useTranslations, useLocale } from "next-intl";

export default function ReportsPage() {
  const t = useTranslations("reports");
  const app = useTranslations("app");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const reportCategories = [
    {
      id: "procurement",
      name: t("procurement.title"),
      scope: t("procurement.description"),
      tone: "info",
      href: "/reports/procurement",
    },
    {
      id: "inventory",
      name: t("inventory.title"),
      scope: t("inventory.description"),
      tone: "warning",
      href: "/reports/inventory",
    },
    {
      id: "equipment",
      name: t("equipment.title"),
      scope: t("equipment.description"),
      tone: "success",
      href: "/reports/equipment",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t("exportAll")}
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              {t("lastPeriod")}
            </Button>
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-3">
        {reportCategories.map((report) => (
          <Link
            key={report.id}
            href={report.href}
            className="group block rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:bg-muted/10 hover:border-accent/40"
          >
            <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className={`p-2 rounded-lg bg-${report.tone}-bg/10 text-${report.tone}-text`}>
                <Layers className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold text-accent opacity-0 group-hover:opacity-100 transition-opacity ${isRTL ? "flex-row-reverse" : ""}`}>
                {isRTL ? "استعراض" : "Explore"} <ChevronRight className={`h-3 w-3 ${isRTL ? "rotate-180" : ""}`} />
              </div>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isRTL ? "text-right" : ""}`}>{report.name}</h3>
            <p className={`text-sm text-muted-foreground leading-relaxed ${isRTL ? "text-right" : ""}`}>{report.scope}</p>
            <div className="mt-8 flex h-16 items-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
              {[30, 70, 45, 90, 65, 80, 55, 75, 40, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-accent/40 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </Link>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={isRTL ? "text-right" : ""}>
              <h3 className="text-lg font-bold">{t("consolidatedExpenditure")}</h3>
              <p className="text-xs text-muted-foreground">{t("consolidatedSub")}</p>
            </div>
            <div className={`flex items-center gap-2 text-success-text text-xs font-bold ${isRTL ? "flex-row-reverse" : ""}`}>
              <TrendingUp className="h-4 w-4" />
              +12.4% Variance
            </div>
          </div>
          <DashboardChart />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className={`text-lg font-bold mb-6 ${isRTL ? "text-right" : ""}`}>{t("distribution")}</h3>
          <div className="flex items-center justify-center h-[300px]">
            <div className="relative">
              <div className="h-48 w-48 rounded-full border-[16px] border-accent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-black font-mono">SAR 4.2M</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{t("totalValuation")}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[
              isRTL ? "حديد (42%)" : "Steel (42%)",
              isRTL ? "أسمنت (18%)" : "Cement (18%)",
              isRTL ? "وقود (24%)" : "Fuel (24%)",
              isRTL ? "أخرى (16%)" : "Others (16%)",
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="h-2.5 w-2.5 rounded-full bg-accent shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
