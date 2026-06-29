"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { equipment, toneForStatus } from "@/lib/design-data";
import { Settings, Wrench, Fuel, MapPin, Gauge, History } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function EquipmentDetailPage() {
    const t = useTranslations("resources.equipment");
    const app = useTranslations("app");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const item = equipment[0];

    return (
        <div className="space-y-6">
            <PageHeader
                title={item.model}
                description={`${t("assetCode")}: ${item.code} | Heavy Machinery`}
                actions={
                    <div className="flex gap-2">
                        <Badge tone={toneForStatus(item.status)}>{item.status}</Badge>
                        <ButtonLink href="/resources/equipment" variant="outline">{app("back")}</ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden relative">
                        <div className={`absolute top-0 p-4 opacity-5 ${isRTL ? "left-0" : "right-0"}`}>
                            <Settings className="h-24 w-24" />
                        </div>
                        <h3 className={`text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 ${isRTL ? "text-right" : ""}`}>
                            {t("techSpecs")}
                        </h3>
                        <div className="space-y-4">
                            <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                                <span className="text-sm text-muted-foreground">{t("manufacturer")}</span>
                                <span className="text-sm font-bold">Caterpillar</span>
                            </div>
                            <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                                <span className="text-sm text-muted-foreground">{t("serialNumber")}</span>
                                <span className="text-sm font-mono font-bold">CAT782X-091</span>
                            </div>
                            <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                                <span className="text-sm text-muted-foreground">{t("yearModel")}</span>
                                <span className="text-sm font-bold">2022</span>
                            </div>
                            <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                                <span className="text-sm text-muted-foreground">{t("engineHours")}</span>
                                <span className="text-sm font-mono font-bold text-accent">{item.hours}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className={`mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                            {t("currentDeployment")}
                        </h3>
                        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className="p-2 bg-info-bg rounded-lg text-info-text">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div className={isRTL ? "text-right" : ""}>
                                <p className="text-sm font-bold">{item.project}</p>
                                <p className="text-xs text-muted-foreground">{isRTL ? "الموقع: زون B، القسم 4" : "Located at Zone B, Section 4"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className={`flex items-center gap-3 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <Fuel className="h-4 w-4 text-warning-text" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("fuelLevel")}</span>
                            </div>
                            <p className={`text-2xl font-bold font-mono ${isRTL ? "text-right" : ""}`}>65%</p>
                            <div className="mt-2 h-1.5 w-full bg-muted rounded-full">
                                <div className="h-1.5 bg-warning-text rounded-full" style={{ width: "65%" }} />
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className={`flex items-center gap-3 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <Gauge className="h-4 w-4 text-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("dailyUtil")}</span>
                            </div>
                            <p className={`text-2xl font-bold font-mono ${isRTL ? "text-right" : ""}`}>8.2 h</p>
                            <p className={`text-[10px] text-success-text mt-1 ${isRTL ? "text-right" : ""}`}>{isRTL ? "ضمن النطاق المثالي" : "Within optimal range"}</p>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <div className={`flex items-center gap-3 mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <History className="h-4 w-4 text-info-text" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("nextService")}</span>
                            </div>
                            <p className={`text-2xl font-bold font-mono ${isRTL ? "text-right" : ""}`}>182 h</p>
                            <p className={`text-[10px] text-muted-foreground mt-1 ${isRTL ? "text-right" : ""}`}>{isRTL ? "الموعد: 25 أغسطس 2026" : "Sched: 25 Aug 2026"}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <h3 className="text-lg font-bold">{t("maintenanceLog")}</h3>
                            <button className="text-xs font-bold text-accent hover:underline">{isRTL ? "تحميل التقرير الكامل" : "Download full report"}</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { date: "2026-05-12", title: isRTL ? "تغيير زيت وفلتر روتيني" : "Routine Oil & Filter Change", type: isRTL ? "وقائي" : "Preventive", status: "Completed" },
                                { date: "2026-03-20", title: isRTL ? "فحص ضغط النظام الهيدروليكي" : "Hydraulic System Pressure Check", type: isRTL ? "فحص" : "Inspection", status: "Completed" },
                            ].map((log, i) => (
                                <div key={i} className={`flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0 ${isRTL ? "flex-row-reverse" : ""}`}>
                                    <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                                        <div className="h-10 w-10 bg-muted rounded-lg grid place-items-center">
                                            <Wrench className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className={isRTL ? "text-right" : ""}>
                                            <p className="text-sm font-bold">{log.title}</p>
                                            <p className="text-xs text-muted-foreground">{log.date} | {log.type}</p>
                                        </div>
                                    </div>
                                    <Badge tone="success" className="text-[10px]">{log.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
