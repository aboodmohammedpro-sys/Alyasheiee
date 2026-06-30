"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Gate } from "@/components/shared/Gate";
import { useDailyLog, useSubmitDailyLog, useApproveDailyLog } from "@/lib/hooks/useApi";
import { CheckCircle2, Loader2, AlertCircle, Users, Settings, Truck, Award } from "lucide-react";
import type { DailyLogStatus } from "@/lib/api/types";

const statusColors: Record<DailyLogStatus, string> = {
    draft: "bg-muted text-muted-foreground",
    submitted: "bg-info/10 text-info-text",
    approved: "bg-success/10 text-success-text",
};

const statusSteps: DailyLogStatus[] = ["draft", "submitted", "approved"];

export default function DailyLogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: log, isLoading, isError } = useDailyLog(id);

    const submit = useSubmitDailyLog();
    const approve = useApproveDailyLog();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> جار التحميل...
            </div>
        );
    }

    if (isError || !log) {
        return (
            <div className="rounded-xl border border-danger/20 bg-danger/5 p-8 text-center text-danger-text">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                لم يتم العثور على السجل اليومي
            </div>
        );
    }

    const currentStep = statusSteps.indexOf(log.status);

    return (
        <div className="space-y-6">
            <PageHeader
                title={`سجل يومية - ${log.project?.name ?? log.project_id}`}
                description={`التاريخ: ${log.date} | الوردية: ${log.shift}`}
                actions={
                    <div className="flex gap-2 items-center">
                        <Badge
                            tone={log.status === "approved" ? "success" : log.status === "submitted" ? "info" : "neutral"}
                        >
                            {log.status}
                        </Badge>
                        <ButtonLink href="/field-records/daily-operations" variant="ghost">رجوع للعمليات</ButtonLink>
                    </div>
                }
            />

            {/* Progress Steps */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    حالة السجل
                </h3>
                <div className="flex items-center gap-2">
                    {statusSteps.map((step, idx) => (
                        <React.Fragment key={step}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${idx <= currentStep ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                                }`}>
                                {idx < currentStep && <CheckCircle2 className="h-3 w-3" />}
                                {step}
                            </div>
                            {idx < statusSteps.length - 1 && (
                                <div className={`h-0.5 flex-1 ${idx < currentStep ? "bg-accent" : "bg-border"}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    {/* Attendance Section */}
                    <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
                            <Users className="h-4 w-4 text-accent" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">سجل الحضور</h3>
                        </div>
                        {/* The backend data structure will dictate how we loop here. Assuming an array of attendance. */}
                        <div className="p-4 text-sm text-muted-foreground italic">
                            سيتم عرض قائمة الحضور هنا (يتطلب ربط العلاقات في الـ API)
                        </div>
                    </section>

                    {/* Equipment Section */}
                    <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
                            <Settings className="h-4 w-4 text-accent" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">تشغيل المعدات</h3>
                        </div>
                        <div className="p-4 text-sm text-muted-foreground italic">
                            سيتم عرض ساعات تشغيل المعدات هنا
                        </div>
                    </section>

                    {/* Trips Section */}
                    <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
                            <Truck className="h-4 w-4 text-accent" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">رحلات الشاحنات</h3>
                        </div>
                        <div className="p-4 text-sm text-muted-foreground italic">
                            سيتم عرض رحلات النقل هنا
                        </div>
                    </section>

                    {/* Achievements Section */}
                    <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                        <div className="flex items-center gap-2 p-4 border-b border-border bg-muted/20">
                            <Award className="h-4 w-4 text-accent" />
                            <h3 className="text-sm font-bold uppercase tracking-wider">الإنجازات اليومية</h3>
                        </div>
                        <div className="p-4 text-sm text-muted-foreground italic">
                            سيتم عرض الأعمال المنجزة هنا
                        </div>
                    </section>
                </div>

                {/* Actions Panel */}
                <div className="space-y-4">
                    {/* Submit Action (Recorder) */}
                    {log.status === "draft" && (
                        <Gate permission="create_daily_log">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold">إرسال للمراجعة</h3>
                                <p className="text-xs text-muted-foreground">قم بإنهاء جميع الإدخالات ثم أرسل السجل لمدير المشروع.</p>
                                <Button
                                    variant="accent"
                                    className="w-full"
                                    isLoading={submit.isPending}
                                    onClick={() => submit.mutate(id)}
                                >
                                    إرسال السجل
                                </Button>
                            </div>
                        </Gate>
                    )}

                    {/* Approve Action (PM/Senior) */}
                    {log.status === "submitted" && (
                        <Gate permission="approve_daily_log">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                                <h3 className="text-sm font-bold">اعتماد السجل</h3>
                                <p className="text-xs text-muted-foreground">
                                    الاعتماد سيقفل السجل للاستعراض فقط وسيقوم بتحديث لوحة قياس التكاليف بشكل آلي.
                                </p>
                                <Button
                                    variant="accent"
                                    className="w-full"
                                    isLoading={approve.isPending}
                                    onClick={() => approve.mutate(id)}
                                >
                                    اعتماد نهائي
                                </Button>
                            </div>
                        </Gate>
                    )}

                    {/* Info */}
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-xs space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">تاريخ الإنشاء</span>
                            <span className="font-mono">{new Date(log.created_at).toLocaleDateString("ar-SA")}</span>
                        </div>
                        {log.general_notes && (
                            <div className="pt-2 border-t border-border">
                                <span className="text-muted-foreground">ملاحظات: </span>
                                <span>{log.general_notes}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
