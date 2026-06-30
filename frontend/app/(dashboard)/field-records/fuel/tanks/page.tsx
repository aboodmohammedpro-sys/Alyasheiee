"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Gate } from "@/components/shared/Gate";
import { useFuelTanks } from "@/lib/hooks/useApi";
import { Loader2, Plus, Droplets, AlertCircle } from "lucide-react";
import type { FuelTank } from "@/lib/api/types";

export default function FuelTanksPage() {
    const { data: tanks = [], isLoading, isError } = useFuelTanks();

    return (
        <div className="space-y-6">
            <PageHeader
                title="خزانات الوقود"
                description="متابعة أرصدة خزانات الوقود في جميع المشاريع"
                actions={
                    <Gate permission="manage_fuel">
                        <ButtonLink href="/field-records/fuel/tanks/new" variant="accent" className="gap-2">
                            <Plus className="h-4 w-4" />
                            إضافة خزان
                        </ButtonLink>
                    </Gate>
                }
            />

            {isLoading && (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" /> جار التحميل...
                </div>
            )}

            {isError && (
                <div className="rounded-xl border border-danger/20 bg-danger/5 p-6 text-center text-danger-text">
                    فشل تحميل بيانات الخزانات.
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tanks.map((tank: FuelTank) => {
                    const fillPercent = tank.capacity > 0 ? (tank.current_balance / tank.capacity) * 100 : 0;
                    const tone: "success" | "warning" | "danger" =
                        fillPercent > 40 ? "success" : fillPercent > 15 ? "warning" : "danger";

                    return (
                        <div key={tank.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                                        <Droplets className="h-5 w-5 text-warning-text" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{tank.name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{tank.type}</p>
                                    </div>
                                </div>
                                <Badge tone={tone}>{fillPercent.toFixed(0)}%</Badge>
                            </div>

                            {/* Fill Bar */}
                            <div>
                                <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
                                    <span>{tank.current_balance.toLocaleString()}L</span>
                                    <span>{tank.capacity.toLocaleString()}L</span>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : "bg-danger"
                                            }`}
                                        style={{ width: `${Math.min(fillPercent, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {tank.project && (
                                <p className="text-xs text-muted-foreground">
                                    المشروع: <span className="font-semibold">{tank.project.name}</span>
                                </p>
                            )}

                            {fillPercent <= 15 && (
                                <div className="flex items-center gap-2 text-xs text-danger-text bg-danger/5 px-3 py-2 rounded-lg">
                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                    مستوى الوقود منخفض جداً
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {tanks.length === 0 && !isLoading && (
                <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center text-muted-foreground">
                    <Droplets className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-medium">لا توجد خزانات وقود</p>
                    <p className="text-xs mt-1">ابدأ بإضافة خزان وقود جديد</p>
                </div>
            )}
        </div>
    );
}
