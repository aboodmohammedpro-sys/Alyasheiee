"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { projects, equipment as mockEquipment } from "@/lib/design-data";
import {
    Plus,
    Settings,
    Truck,
    Calendar,
    Clock,
    ArrowRight,
    Activity,
    BarChart3,
    AlertCircle,
    Package
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export default function DailyOperationsDashboard() {
    const t = useTranslations("fieldRecords.dailyOperations");
    const common = useTranslations("app");
    const locale = useLocale();
    const isRTL = locale === "ar";

    const [selectedProject, setSelectedProject] = React.useState("PRJ-2026-014");
    const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split('T')[0]);
    const [selectedShift, setSelectedShift] = React.useState("morning");

    const shifts = [
        { id: "morning", label: t("shifts.morning") },
        { id: "night1", label: t("shifts.night1") },
        { id: "night2", label: t("shifts.night2") },
    ];

    // Mock data for the dashboard
    const shiftStats = {
        equipment: {
            operating: 12,
            workingHours: 84.5,
            idleHours: 12.0,
            breakdownHours: 4.5,
        },
        transport: {
            trucks: 8,
            trips: 46,
            quantity: 1150,
            materials: [
                { name: isRTL ? "تربة أساس" : "Sub-base", count: 28, qty: 700 },
                { name: isRTL ? "مادة زفتية" : "Asphalt", count: 18, qty: 450 },
            ]
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={t("title")}
                description={t("description")}
                actions={
                    <div className="flex gap-2">
                        <Link href="/field-records/daily-operations/summary">
                            <Button variant="outline" className="gap-2">
                                <BarChart3 className="h-4 w-4" />
                                {t("summary.dailySummary")}
                            </Button>
                        </Link>
                    </div>
                }
            />

            {/* Selection Filter Bar */}
            <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm md:grid-cols-3 lg:grid-cols-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{common("date")}</label>
                    <div className="relative">
                        <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background ps-10 pe-4 text-sm focus:border-accent outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{"Project"}</label>
                    <Select
                        value={selectedProject}
                        onChange={setSelectedProject}
                        options={projects.map(p => ({ value: p.code, label: p.name }))}
                    />
                </div>

                <div className="lg:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("shifts.selector")}</label>
                    <div className="flex p-1 bg-muted/50 rounded-lg gap-1 border border-border">
                        {shifts.map((shift) => (
                            <button
                                key={shift.id}
                                onClick={() => setSelectedShift(shift.id)}
                                className={cn(
                                    "flex-1 h-8 rounded-md text-xs font-bold transition-all",
                                    selectedShift === shift.id
                                        ? "bg-accent text-white shadow-sm"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                {shift.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Shift Live Summary Dashboard */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Equipment Summary */}
                <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-card to-muted/50">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                    <Settings className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{t("equipment.title")}</h3>
                                    <p className="text-xs text-muted-foreground">{t("dashboard.liveSummary")}</p>
                                </div>
                            </div>
                            <Link href={`/field-records/daily-operations/equipment-hours?project=${selectedProject}&date=${selectedDate}&shift=${selectedShift}`}>
                                <Button size="sm" variant="accent" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    {common("add")}
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-border bg-background p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl font-black text-accent">{shiftStats.equipment.operating}</span>
                                <span className="text-[10px] font-bold uppercase text-muted-foreground mt-1">{t("dashboard.operatingEquipment")}</span>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-4 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl font-black text-success-text">{shiftStats.equipment.workingHours}h</span>
                                <span className="text-[10px] font-bold uppercase text-muted-foreground mt-1">{t("equipment.workingHours")}</span>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-4 flex flex-col items-center justify-center text-center text-warning-text">
                                <span className="text-2xl font-black">{shiftStats.equipment.idleHours}h</span>
                                <span className="text-[10px] font-bold uppercase text-muted-foreground mt-1">{t("equipment.idleHours")}</span>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-4 flex flex-col items-center justify-center text-center text-danger-text">
                                <span className="text-2xl font-black">{shiftStats.equipment.breakdownHours}h</span>
                                <span className="text-[10px] font-bold uppercase text-muted-foreground mt-1">{t("equipment.breakdown")}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Transportation Summary */}
                <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-card to-muted/50">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{t("trips.title")}</h3>
                                    <p className="text-xs text-muted-foreground">{t("dashboard.liveSummary")}</p>
                                </div>
                            </div>
                            <Link href={`/field-records/daily-operations/truck-trips?project=${selectedProject}&date=${selectedDate}&shift=${selectedShift}`}>
                                <Button size="sm" variant="accent" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    {common("add")}
                                </Button>
                            </Link>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 rounded-xl bg-primary/5 border border-primary/10 p-4 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-primary">{shiftStats.transport.trips}</p>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{t("dashboard.totalTrips")}</p>
                                </div>
                            </div>
                            <div className="flex-1 rounded-xl bg-success/5 border border-success/10 p-4 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center text-success-text">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-success-text">{shiftStats.transport.quantity} m³</p>
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{t("dashboard.materialQuantities")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{t("trips.autoCalculate")}</p>
                            {shiftStats.transport.materials.map((m, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-accent" />
                                        <span className="text-sm font-bold">{m.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-semibold text-muted-foreground">{m.count} {t("trips.title")}</span>
                                        <span className="text-sm font-black">{m.qty} m³</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Navigation and Quick Links */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4 border-border/50 hover:border-accent/40 transition-all group cursor-pointer">
                    <Link href="/field-records/daily-operations/equipment-hours" className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                            <Settings className="h-6 w-6 group-hover:text-accent transition-colors" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold">{t("equipment.record")}</h4>
                            <p className="text-xs text-muted-foreground">{t("equipment.oneRecordPerShift")}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-all" />
                    </Link>
                </Card>
                <Card className="p-4 border-border/50 hover:border-accent/40 transition-all group cursor-pointer">
                    <Link href="/field-records/daily-operations/truck-trips" className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                            <Truck className="h-6 w-6 group-hover:text-accent transition-colors" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold">{t("trips.record")}</h4>
                            <p className="text-xs text-muted-foreground">{t("trips.autoCalculate")}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-all" />
                    </Link>
                </Card>
                <Card className="p-4 border-border/50 hover:border-accent/40 transition-all group cursor-pointer bg-accent/5 ring-1 ring-accent/20">
                    <Link href="/field-records/daily-operations/summary" className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-accent">{t("summary.dailySummary")}</h4>
                            <p className="text-xs text-accent/70">{t("summary.autoCombined")}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-accent" />
                    </Link>
                </Card>
            </div>

            {/* Info Alert */}
            <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-warning-text shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-bold text-warning-text">{isRTL ? "ملاحظة هامة للنظام" : "Important System Note"}</p>
                    <p className="text-muted-foreground mt-1">
                        {isRTL
                            ? "يتم حفظ كل وردية كسجل مستقل تماماً. التبديل بين الورديات يعرض البيانات الخاصة بكل وردية في نفس اليوم والمشروع."
                            : "Each shift is saved as a completely independent record. Switching between shifts displays the specific data for each one on the same day and project."
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}
