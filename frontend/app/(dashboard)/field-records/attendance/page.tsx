"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { employees } from "@/lib/design-data";
import { Check, X, Clock, Save, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";

export default function AttendancePage() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [attendance, setAttendance] = React.useState<Record<string, string>>(
        Object.fromEntries(employees.map((e) => [e.id, "present"]))
    );
    const t = useTranslations("fieldRecords.attendance");
    const app = useTranslations("app");

    const setStatus = (id: string, status: string) => {
        setAttendance((prev) => ({ ...prev, [id]: status }));
    };

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    const statusOptions = [
        { id: "present", icon: Check, color: "bg-success-text text-white", label: t("present") },
        { id: "absent", icon: X, color: "bg-danger-text text-white", label: t("absent") },
        { id: "late", icon: Clock, color: "bg-warning-text text-white", label: t("late") },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title={t("title")}
                description={t("description")}
                actions={
                    <Button variant="accent" className="gap-2" onClick={handleSave} isLoading={isLoading}>
                        <Save className="h-4 w-4" />
                        {t("submitAttendance")}
                    </Button>
                }
            />

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                <Select
                    options={[{ value: "prj-1", label: "North Access Road" }]}
                    label={t("filterProject")}
                />
                <Select
                    options={[{ value: "crew-all", label: t("allCrews") }]}
                    label={t("filterCrew")}
                />
                <div className="md:col-span-1 xl:col-span-2">
                    <div className="relative mt-5">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            className="h-10 w-full ps-10 pe-4 rounded-md border border-input bg-card text-sm focus:border-accent outline-none"
                            placeholder={t("searchWorker")}
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-muted text-xs uppercase text-muted-foreground border-b border-border">
                        <tr>
                            <th className="px-6 py-4 text-start">{t("workerId")}</th>
                            <th className="px-6 py-4 text-start">{t("designation")}</th>
                            <th className="px-6 py-4 text-start">{t("currentProject")}</th>
                            <th className="px-6 py-4 text-center">{t("attendanceStatus")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {employees.map((worker) => (
                            <tr key={worker.id} className="transition-colors hover:bg-muted/5">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">
                                            {worker.name.split(" ").map((n) => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="font-bold">{worker.name}</p>
                                            <p className="text-[10px] font-mono text-muted-foreground uppercase">{worker.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">{worker.role}</td>
                                <td className="px-6 py-4 text-xs font-semibold">{worker.project}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-1 bg-muted/30 p-1 rounded-lg w-fit mx-auto">
                                        {statusOptions.map((status) => {
                                            const isSelected = attendance[worker.id] === status.id;
                                            return (
                                                <button
                                                    key={status.id}
                                                    onClick={() => setStatus(worker.id, status.id)}
                                                    className={cn(
                                                        "flex h-8 w-10 items-center justify-center rounded-md text-[10px] font-bold transition-all",
                                                        isSelected ? status.color : "text-muted-foreground hover:bg-muted"
                                                    )}
                                                >
                                                    {status.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
