"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/shared/DataTable";
import { Download, ChevronLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { useTranslations, useLocale } from "next-intl";

export default function InventoryReportPage() {
    const t = useTranslations("reports.inventory");
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
                            {isRTL ? <ChevronLeft className="h-4 w-4 ms-2 rotate-180" /> : <ChevronLeft className="h-4 w-4 me-2" />}
                            {app("back")}
                        </ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-4 md:grid-cols-3">
                {[
                    { label: t("stockValue"), value: "SAR 1.62M", sub: reports("lastPeriod") },
                    { label: t("lowSkus"), value: "7", sub: isRTL ? "يحتاج إعادة طلب عاجل" : "Require urgent reorder" },
                    { label: t("accuracy"), value: "98.3%", sub: isRTL ? "آخر جرد" : "Last physical count" },
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
                    <h3 className={`text-sm font-bold uppercase ${isRTL ? "text-right" : ""}`}>{t("velocity")}</h3>
                </div>
                <DataTable
                    columns={[
                        { accessorKey: "item", header: isRTL ? "المادة" : "Item" },
                        { accessorKey: "consumed", header: t("consumed"), meta: { mono: true, align: "right" } },
                        { accessorKey: "days", header: t("daysLeft"), meta: { mono: true, align: "right" } },
                    ]}
                    data={[
                        { item: "Portland Cement 50kg", consumed: "2,400 Bags", days: "18 Days" },
                        { item: "Rebar 16mm", consumed: "8.2 Tons", days: "31 Days" },
                        { item: "Diesel Fuel", consumed: "12,400 L", days: "9 Days" },
                    ]}
                />
            </div>
        </div>
    );
}
