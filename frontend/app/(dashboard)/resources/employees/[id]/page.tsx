"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { employees, toneForStatus } from "@/lib/design-data";
import { Mail, Phone, MapPin, Briefcase, ShieldCheck } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function EmployeeDetailPage() {
    const t = useTranslations("resources.employees");
    const app = useTranslations("app");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const employee = employees[0];

    return (
        <div className="space-y-6">
            <PageHeader
                title={employee.name}
                description={`${t("employeeCode")}: ${employee.id} | ${employee.role}`}
                actions={
                    <div className="flex gap-2">
                        <Badge tone={toneForStatus(employee.status)}>{employee.status}</Badge>
                        <ButtonLink href="/resources/employees" variant="outline">{app("back")}</ButtonLink>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                            {employee.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <h2 className="mt-4 text-xl font-bold">{employee.name}</h2>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                        <div className={`mt-6 space-y-3 border-t border-border pt-6 ${isRTL ? "text-right" : "text-left"}`}>
                            <div className={`flex items-center gap-3 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{employee.name.toLowerCase().replace(" ", ".")}@construction.com</span>
                            </div>
                            <div className={`flex items-center gap-3 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>+966 5X XXX XXXX</span>
                            </div>
                            <div className={`flex items-center gap-3 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{isRTL ? "المملكة العربية السعودية، مكتب الرياض" : "KSA, Riyadh Office"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className={`mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                            {t("currentAssignment")}
                        </h3>
                        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div className={isRTL ? "text-right" : ""}>
                                <p className="text-sm font-bold">{employee.project}</p>
                                <p className="text-xs text-muted-foreground">{isRTL ? "معين منذ يناير 2026" : "Assigned since Jan 2026"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className={`mb-6 text-lg font-bold ${isRTL ? "text-right" : ""}`}>{isRTL ? "تفاصيل التوظيف" : "Employment Details"}</h3>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className={`space-y-1 ${isRTL ? "text-right" : ""}`}>
                                <p className="text-xs text-muted-foreground">{t("department")}</p>
                                <p className="text-sm font-semibold text-foreground">Project Management</p>
                            </div>
                            <div className={`space-y-1 ${isRTL ? "text-right" : ""}`}>
                                <p className="text-xs text-muted-foreground">{isRTL ? "المسؤول المباشر" : "Reports To"}</p>
                                <p className="text-sm font-semibold text-foreground">Senior Project Director</p>
                            </div>
                            <div className={`space-y-1 ${isRTL ? "text-right" : ""}`}>
                                <p className="text-xs text-muted-foreground">{t("joiningDate")}</p>
                                <p className="text-sm font-semibold text-foreground">Oct 15, 2022</p>
                            </div>
                            <div className={`space-y-1 ${isRTL ? "text-right" : ""}`}>
                                <p className="text-xs text-muted-foreground">{isRTL ? "نوع التوظيف" : "Employment Type"}</p>
                                <p className="text-sm font-semibold text-foreground">Full-time Permanent</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className={`mb-6 text-lg font-bold ${isRTL ? "text-right" : ""}`}>{t("performanceSummary")}</h3>
                        <div className="space-y-4">
                            <div className={`flex items-center justify-between rounded-lg bg-success-bg/20 p-4 border border-success-border ${isRTL ? "flex-row-reverse" : ""}`}>
                                <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                                    <ShieldCheck className="h-5 w-5 text-success-text" />
                                    <span className="text-sm font-semibold text-success-text">{isRTL ? "تصريح السلامة الميداني فعال" : "Site Safety Clearance Active"}</span>
                                </div>
                                <span className="text-xs text-success-text">{isRTL ? "صالح حتى ديسمبر 2026" : "Valid until Dec 2026"}</span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-xl bg-muted/30 p-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-1">{isRTL ? "إجمالي الساعات" : "Total Hours"}</p>
                                    <p className="text-xl font-bold font-mono">1,824</p>
                                </div>
                                <div className="rounded-xl bg-muted/30 p-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-1">{isRTL ? "معدل الحوادث" : "Incident Rate"}</p>
                                    <p className="text-xl font-bold font-mono text-success-text">0.0%</p>
                                </div>
                                <div className="rounded-xl bg-muted/30 p-4 text-center">
                                    <p className="text-xs text-muted-foreground mb-1">{isRTL ? "الامتثال" : "Compliance"}</p>
                                    <p className="text-xl font-bold font-mono">100%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
