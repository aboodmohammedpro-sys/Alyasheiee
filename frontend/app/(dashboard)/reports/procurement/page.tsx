"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/shared/DataTable";
import { Download, ChevronLeft, TrendingDown } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useTranslations, useLocale } from "next-intl";

export default function ProcurementReportPage() {
    const t = useTranslations("reports.procurement");
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
                        <Button variant="outline"><Download className="h-4 w-4 me-2" /> {app("export")}</Button>
                        <ButtonLink href="/reports" variant="ghost">
                            {isRTL ? <></> : <ChevronLeft className="h-4 w-4 me-2" />}
                            {app("back")}
                            {isRTL ? <ChevronLeft className="h-4 w-4 ms-2 rotate-180" /> : <></>}
                        </ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { label: t("committed"), value: "SAR 2.84M", sub: reports("lastPeriod"), tone: "info" },
                    { label: t("prCycleTime"), value: "4.2 Days", sub: isRTL ? "أداء ممتاز" : "Great performance", tone: "success" },
                    { label: t("supplierCompliance"), value: "91.4%", sub: isRTL ? "من إجمالي 8 موردين" : "Out of 8 suppliers", tone: "warning" },
                ].map((stat, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <p className={`text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 ${isRTL ? "text-right" : ""}`}>{stat.label}</p>
                        <p className="text-3xl font-bold font-mono">{stat.value}</p>
                        <p className={`text-[10px] text-muted-foreground mt-1 ${isRTL ? "text-right" : ""}`}>{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <div className="p-4 bg-muted/20 border-b border-border">
                    <h3 className={`text-sm font-bold uppercase ${isRTL ? "text-right" : ""}`}>{t("performanceMatrix")}</h3>
                </div>
                <DataTable
                    columns={[
                        { accessorKey: "name", header: isRTL ? "المورد" : "Supplier" },
                        { accessorKey: "onTime", header: t("onTime"), meta: { align: "right" } },
                        { accessorKey: "avgLead", header: t("avgLeadTime"), meta: { align: "right" } },
                        { accessorKey: "rating", header: t("rating"), meta: { mono: true } },
                    ]}
                    data={[
                        { name: "Arabian Steel Co.", onTime: "94%", avgLead: "6.1 days", rating: "A" },
                        { name: "Najd Cement Supply", onTime: "88%", avgLead: "4.8 days", rating: "B+" },
                    ]}
                />
            </div>
        </div>
    );
}
