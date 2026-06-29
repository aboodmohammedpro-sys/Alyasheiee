"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/shared/DataTable";
import { Download, ChevronLeft, Activity, Fuel, Settings } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useTranslations, useLocale } from "next-intl";

export default function EquipmentReportsPage() {
    const t = useTranslations("reports.equipment");
    const reports = useTranslations("reports");
    const app = useTranslations("app");
    const locale = useLocale();
    const isRTL = locale === "ar";

    return (
        <div className="space-y-6">
            <PageHeader
                title={t("title")}
                description={t("description")}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline"><Download className="h-4 w-4 me-2" /> {app("export")} XLS</Button>
                        <ButtonLink href="/reports" variant="ghost">
                            {isRTL ? <ChevronLeft className="h-4 w-4 ms-2 rotate-180" /> : <ChevronLeft className="h-4 w-4 me-2" />}
                            {app("back")}
                        </ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { label: t("fleetUtil"), value: "84.2%", icon: Activity, color: "text-accent" },
                    { label: t("fuelPerHour"), value: "22.4 L", icon: Fuel, color: "text-warning-text" },
                    { label: t("inMaintenance"), value: "4", icon: Settings, color: "text-danger-text" },
                ].map((stat, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <div className={`flex items-center gap-3 mb-4 ${stat.color} ${isRTL ? "flex-row-reverse" : ""}`}>
                            <stat.icon className="h-5 w-5" />
                            <h4 className={`text-sm font-bold uppercase ${isRTL ? "text-right" : ""}`}>{stat.label}</h4>
                        </div>
                        <p className="text-3xl font-bold font-mono">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="p-4 bg-muted/20 border-b border-border">
                    <h3 className={`text-sm font-bold uppercase ${isRTL ? "text-right" : ""}`}>{t("healthIndex")}</h3>
                </div>
                <DataTable
                    columns={[
                        { accessorKey: "code", header: isRTL ? "رمز الأصل" : "Asset Code", meta: { mono: true } },
                        { accessorKey: "model", header: isRTL ? "الموديل" : "Model" },
                        { accessorKey: "utilization", header: t("utilPercent"), cell: ({ getValue }) => `${getValue()}%`, meta: { align: "right" } },
                        { accessorKey: "fuelEff", header: t("fuelEff"), meta: { mono: true, align: "right" } },
                        { accessorKey: "status", header: app("status") },
                    ]}
                    data={[
                        { code: "EQ-CAT-320-08", model: "CAT 320 Excavator", utilization: 92, fuelEff: "18.5", status: isRTL ? "مثالي" : "Optimal" },
                        { code: "EQ-GEN-250-03", model: "250KVA Generator", utilization: 76, fuelEff: "12.8", status: isRTL ? "في الاستعداد" : "Standby" },
                        { code: "EQ-KOM-D85-12", model: "Komatsu D85", utilization: 88, fuelEff: "34.2", status: isRTL ? "وقود حرج" : "Critical Fuel" },
                    ]}
                />
            </div>
        </div>
    );
}
