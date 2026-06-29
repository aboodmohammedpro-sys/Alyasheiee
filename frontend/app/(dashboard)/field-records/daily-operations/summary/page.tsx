"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { projects } from "@/lib/design-data";
import {
    Calendar,
    Layers,
    Settings,
    Truck,
    Printer,
    Download,
    AlertCircle,
    Clock,
    Activity,
    CheckCircle2,
    Package
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { useSearchParams } from "next/navigation";

export default function DailySummaryPage() {
    const t = useTranslations("fieldRecords.dailyOperations");
    const common = useTranslations("app");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const searchParams = useSearchParams();

    // Selection State
    const [project, setProject] = React.useState(searchParams.get("project") || "PRJ-2026-014");
    const [date, setDate] = React.useState(searchParams.get("date") || new Date().toISOString().split('T')[0]);

    // Mock Consolidated Data
    const consolidatedStats = {
        equipment: {
            operating: 28,
            workingHours: 215.5,
            idleHours: 32.0,
            breakdownHours: 12.5,
            shifts: {
                morning: { working: 84.5, idle: 12.0 },
                night1: { working: 76.0, idle: 10.5 },
                night2: { working: 55.0, idle: 9.5 }
            }
        },
        transport: {
            trucks: 14,
            trips: 112,
            quantity: 2800,
            shifts: {
                morning: { trips: 46, qty: 1150 },
                night1: { trips: 42, qty: 1050 },
                night2: { trips: 24, qty: 600 }
            },
            materials: [
                { name: isRTL ? "تربة أساس" : "Sub-base", trips: 68, qty: 1700 },
                { name: isRTL ? "مادة زفتية" : "Asphalt", trips: 44, qty: 1100 },
            ]
        },
        status: {
            morning: "submitted",
            night1: "submitted",
            night2: "draft"
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "submitted":
                return <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/10 text-success-text"><CheckCircle2 className="h-3 w-3" /> {isRTL ? "مُعتمد" : "Submitted"}</span>;
            case "draft":
                return <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-warning/10 text-warning-text"><AlertCircle className="h-3 w-3" /> {isRTL ? "مسودة" : "Draft"}</span>;
            default:
                return <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground"><Clock className="h-3 w-3" /> {isRTL ? "قيد الانتظار" : "Pending"}</span>;
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <PageHeader
                title={t("summary.dailySummary")}
                description={t("summary.autoCombined")}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2 aspect-square p-0 w-10">
                            <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="gap-2 aspect-square p-0 w-10">
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="accent" className="gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            {isRTL ? "اعتماد التقرير اليومي" : "Approve Daily Report"}
                        </Button>
                    </div>
                }
            />

            {/* Global Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border-2 border-border bg-card shadow-sm items-center justify-between">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-lg border border-border/50 flex-1 md:flex-none">
                        <Calendar className="h-4 w-4 text-accent" />
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{common("date")}</p>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-sm font-bold border-none p-0 outline-none w-full" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-lg border border-border/50 flex-1 md:flex-none min-w-[200px]">
                        <Layers className="h-4 w-4 text-accent" />
                        <div className="flex-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{"Project"}</p>
                            <select value={project} onChange={(e) => setProject(e.target.value)} className="bg-transparent text-sm font-bold border-none p-0 outline-none w-full cursor-pointer appearance-none">
                                {projects.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {["morning", "night1", "night2"].map((shift) => (
                        <div key={shift} className="flex flex-col items-center gap-1 shrink-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t(`shifts.${shift}`)}</span>
                            {getStatusBadge(consolidatedStats.status[shift as keyof typeof consolidatedStats.status])}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Consolidated Equipment Summary */}
                <Card className="p-6 border-none shadow-xl bg-gradient-to-br from-card to-accent/5">
                    <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                <Settings className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">{t("equipment.title")}</h3>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("summary.dailySummary")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">{t("equipment.workingHours")}</span>
                                <span className="text-3xl font-black text-success-text">{consolidatedStats.equipment.workingHours}h</span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success-text hidden sm:flex">
                                <Activity className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">{t("equipment.idleHours")}</span>
                                <span className="text-3xl font-black text-warning-text">{consolidatedStats.equipment.idleHours}h</span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center text-warning-text hidden sm:flex">
                                <Clock className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase text-muted-foreground tracking-widest">{isRTL ? "مساهمة الورديات (ساعات العمل)" : "Shift Contribution (Working Hours)"}</h4>
                        <div className="space-y-3">
                            {["morning", "night1", "night2"].map((shift) => {
                                const stats = consolidatedStats.equipment.shifts[shift as keyof typeof consolidatedStats.equipment.shifts];
                                const percentage = (stats.working / consolidatedStats.equipment.workingHours) * 100;

                                return (
                                    <div key={shift} className="space-y-1">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span>{t(`shifts.${shift}`)}</span>
                                            <span>{stats.working}h ({percentage.toFixed(0)}%)</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                                            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${percentage}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                {/* Consolidated Transportation Summary */}
                <Card className="p-6 border-none shadow-xl bg-gradient-to-br from-card to-primary/5">
                    <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">{t("trips.title")}</h3>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("summary.dailySummary")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">{t("dashboard.totalTrips")}</span>
                                <span className="text-3xl font-black text-primary">{consolidatedStats.transport.trips}</span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hidden sm:flex">
                                <Truck className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">{t("dashboard.materialQuantities")}</span>
                                <span className="text-3xl font-black text-success-text">{consolidatedStats.transport.quantity} <span className="text-sm">m³</span></span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center text-success-text hidden sm:flex">
                                <Package className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase text-muted-foreground tracking-widest">{isRTL ? "مساهمة الورديات (الردود)" : "Shift Contribution (Trips)"}</h4>
                        <div className="flex items-end h-32 gap-2 mt-4 bg-muted/10 p-4 rounded-xl border border-border">
                            {["morning", "night1", "night2"].map((shift) => {
                                const stats = consolidatedStats.transport.shifts[shift as keyof typeof consolidatedStats.transport.shifts];
                                const height = (stats.trips / Math.max(...Object.values(consolidatedStats.transport.shifts).map(s => s.trips))) * 100;

                                return (
                                    <div key={shift} className="flex-1 flex flex-col items-center justify-end group">
                                        <span className="text-xs font-black mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{stats.trips}</span>
                                        <div
                                            className="w-full bg-primary/20 group-hover:bg-primary transition-colors rounded-t-sm"
                                            style={{ height: `${height}%` }}
                                        />
                                        <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mt-2 truncate w-full text-center">
                                            {shift === 'night1' ? 'N1' : shift === 'night2' ? 'N2' : 'M'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Material Transport Details */}
            <Card className="p-6 shadow-md border-border/50">
                <h4 className="text-sm font-black uppercase text-foreground tracking-widest mb-6 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-accent" />
                    {isRTL ? "إجماليات المواد المنقولة هذا اليوم" : "Total Transported Materials Today"}
                </h4>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {consolidatedStats.transport.materials.map((m, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between h-full hover:border-accent/30 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <span className="font-black text-lg">{m.name}</span>
                                <div className="h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center text-accent shadow-sm">
                                    <Package className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-auto">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{t("dashboard.totalTrips")}</p>
                                    <p className="font-black mt-0.5">{m.trips}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{t("trips.quantity")}</p>
                                    <p className="font-black text-success-text mt-0.5">{m.qty} <span className="text-xs text-muted-foreground">m³</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
