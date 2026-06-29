"use client";

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { TrendingDown } from "lucide-react";

export function ProjectOverview({ project, phasesData }: { project: any, phasesData: any }) {
    const pt = useTranslations("projects");
    const app = useTranslations("app");
    const locale = useLocale();
    const isRTL = locale === "ar";

    return (
        <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2 space-y-6">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className={`mb-6 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                        <h3 className="text-lg font-bold">{pt("timeline")}</h3>
                        <div className={`flex gap-4 text-xs ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-accent" /> {isRTL ? "نشط" : "Active"}</div>
                            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-full bg-success-text" /> {isRTL ? "مكتمل" : "Completed"}</div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {phasesData.map((phase: any) => (
                            <div key={phase.id} className="relative">
                                <div className={`mb-2 flex items-center justify-between text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                                    <span className="font-bold">{phase.name}</span>
                                    <span className="font-mono text-xs text-muted-foreground">{phase.progress}%</span>
                                </div>
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-1000",
                                            phase.status === "Completed" ? "bg-success-text" :
                                                phase.status === "Working" ? "bg-accent" : "bg-muted-foreground/20"
                                        )}
                                        style={{ width: `${phase.progress}%` }}
                                    />
                                </div>
                                <div className={`mt-2 flex justify-between font-mono text-[10px] text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}>
                                    <span>{app("date")}: {phase.start}</span>
                                    <span>{isRTL ? "الانتهاء المتوقع" : "Est. Completion"}: {phase.end}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className={`mb-4 text-lg font-bold ${isRTL ? "text-right" : ""}`}>{isRTL ? "النشاطات الميدانية الأخيرة" : "Recent Site Activity"}</h3>
                    <div className="space-y-4">
                        {[
                            { user: isRTL ? "مسجل الموقع" : "Site Recorder", action: isRTL ? "سجل 420م3 حفريات" : "logged 420m3 excavation", time: isRTL ? "منذ ساعتين" : "2 hours ago" },
                            { user: isRTL ? "المشتريات" : "Procurement", action: isRTL ? "اعتمد طلب PR-2026-1011" : "approved PR-2026-1011", time: isRTL ? "منذ 5 ساعات" : "5 hours ago" },
                        ].map((item, i) => (
                            <div key={i} className={`flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <div className="h-8 w-8 rounded-full bg-accent/10 grid place-items-center text-[10px] font-bold text-accent">AD</div>
                                <div className={isRTL ? "text-right" : ""}>
                                    <p className="text-sm">
                                        <span className="font-bold">{item.user}</span> {item.action}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h4 className={`mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground ${isRTL ? "text-right" : ""}`}>{isRTL ? "حالة الموازنة" : "Budget Status"}</h4>
                    <div className="space-y-4">
                        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span className="text-sm text-muted-foreground">{isRTL ? "المخصص" : "Allocated"}</span>
                            <span className="font-mono text-sm font-bold">{project.budget}</span>
                        </div>
                        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span className="text-sm text-muted-foreground">{isRTL ? "المستهلك" : "Consumed"}</span>
                            <span className="font-mono text-sm font-bold text-accent">SAR 12.5M</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-accent" style={{ width: "68%" }} />
                        </div>
                        <p className={`text-[10px] text-muted-foreground leading-relaxed ${isRTL ? "text-right" : ""}`}>
                            {isRTL ? "المشروع حالياً" : "Project is currently"} <span className="font-bold text-success-text">{isRTL ? "تحت الميزانية" : "under budget"}</span> {isRTL ? "بنسبة 4.2% بالنسبة لتقدم المراحل." : "by 4.2% relative to phase progress."}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className="p-2 bg-accent/10 rounded-lg text-accent">
                            <TrendingDown className="h-5 w-5" />
                        </div>
                        <div className={isRTL ? "text-right" : ""}>
                            <p className="text-xs text-muted-foreground">{isRTL ? "انحراف الجدول" : "Schedule Variance"}</p>
                            <p className="text-lg font-bold">-4 {isRTL ? "أيام" : "Days"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
