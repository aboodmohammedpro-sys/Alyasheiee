"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Gate } from "@/components/shared/Gate";
import { useProjects, useProjectReport } from "@/lib/hooks/useApi";
import { PieChart, Loader2, AlertCircle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function CostControlReportsPage() {
    const [selectedProjectId, setSelectedProjectId] = React.useState<string>("");
    const { data: projects = [] } = useProjects();
    const { data: report, isLoading, isError } = useProjectReport(selectedProjectId);

    const projectOptions = (projects as any)?.data?.data ?? projects;

    React.useEffect(() => {
        if (projectOptions.length > 0 && !selectedProjectId) {
            setSelectedProjectId(projectOptions[0].id);
        }
    }, [projectOptions, selectedProjectId]);

    return (
        <Gate permission="view_financial_reports">
            <div className="space-y-6">
                <PageHeader
                    title="تقارير مراقبة التكاليف"
                    description="لوحة التكاليف التفصيلية، الميزانيات، ونسب الإنجاز المالي"
                />

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center gap-4">
                    <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">اختر المشروع:</label>
                    <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="h-10 max-w-sm w-full rounded-md border border-input bg-background px-3 text-sm focus:border-accent outline-none"
                    >
                        {(projectOptions as any[]).map((p: any) => (
                            <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                        ))}
                    </select>
                </div>

                {!selectedProjectId && !isLoading && (
                    <div className="rounded-2xl border-2 border-dashed border-border py-20 text-center text-muted-foreground">
                        <PieChart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-medium">الرجاء اختيار مشروع لعرض التقرير</p>
                    </div>
                )}

                {isLoading && selectedProjectId && (
                    <div className="flex items-center justify-center py-32 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" /> جلب البيانات المالية...
                    </div>
                )}

                {isError && selectedProjectId && (
                    <div className="rounded-xl border border-danger/20 bg-danger/5 p-8 text-center text-danger-text">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        فشل تحميل التقرير. المشروع قد لا يحتوي على ميزانية معتمدة بعد.
                    </div>
                )}

                {report && (
                    <div className="space-y-6">
                        {/* Top Stat Cards */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-2 text-muted-foreground">
                                    <DollarSign className="h-5 w-5" />
                                    <h3 className="text-sm font-bold">الميزانية التقديرية (SAR)</h3>
                                </div>
                                <p className="text-3xl font-mono font-bold tracking-tight text-foreground">
                                    {report.financials.total_estimated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-2 text-muted-foreground">
                                    <TrendingUp className="h-5 w-5" />
                                    <h3 className="text-sm font-bold">إجمالي المصروف (SAR)</h3>
                                </div>
                                <p className="text-3xl font-mono font-bold tracking-tight text-accent">
                                    {report.financials.total_actual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-2 text-muted-foreground">
                                    <h3 className="text-sm font-bold">معدل الحرق الإجمالي</h3>
                                    <TrendingDown className="h-5 w-5" />
                                </div>
                                <div className="flex items-end gap-3 mt-1">
                                    <p className="text-3xl font-mono font-bold tracking-tight">
                                        {report.financials.total_estimated > 0
                                            ? ((report.financials.total_actual / report.financials.total_estimated) * 100).toFixed(1)
                                            : 0}%
                                    </p>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full mt-4 overflow-hidden">
                                    <div
                                        className="h-full bg-accent"
                                        style={{ width: `${Math.min((report.financials.total_actual / (report.financials.total_estimated || 1)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Categories Details */}
                        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                            <div className="p-5 border-b border-border">
                                <h3 className="font-bold">تفصيل التكاليف حسب البنود الرئيسية</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-b border-border">
                                        <tr>
                                            <th className="px-5 py-3 text-start">الفئة</th>
                                            <th className="px-5 py-3 text-end">الميزانية (SAR)</th>
                                            <th className="px-5 py-3 text-end">المصروف (SAR)</th>
                                            <th className="px-5 py-3 text-end">المتبقي (SAR)</th>
                                            <th className="px-5 py-3 text-end w-32">النسبة</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {report.financials.categories.map((cat: any) => {
                                            const categoryNames: Record<string, string> = {
                                                labor: "العمالة والموظفين",
                                                material: "المواد والمشتريات",
                                                equipment: "الآليات والمعدات",
                                                fuel: "الوقود والديزل",
                                                misc: "مصروفات أخرى"
                                            };

                                            const tone = cat.burn_rate > 90 ? "danger" : cat.burn_rate > 70 ? "warning" : "success";

                                            return (
                                                <tr key={cat.category} className="hover:bg-muted/10">
                                                    <td className="px-5 py-4 font-semibold capitalize">{categoryNames[cat.category] || cat.category}</td>
                                                    <td className="px-5 py-4 text-end font-mono">
                                                        {cat.estimated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-5 py-4 text-end font-mono text-accent font-medium">
                                                        {cat.actual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-5 py-4 text-end font-mono">
                                                        {cat.variance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-5 py-4 flex items-center justify-end gap-2">
                                                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[60px]">
                                                            <div
                                                                className={`h-full ${tone === 'danger' ? 'bg-danger' : tone === 'warning' ? 'bg-warning' : 'bg-success'}`}
                                                                style={{ width: `${Math.min(cat.burn_rate, 100)}%` }}
                                                            />
                                                        </div>
                                                        <Badge tone={tone} className="w-14 justify-center">{cat.burn_rate.toFixed(0)}%</Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Gate>
    );
}
