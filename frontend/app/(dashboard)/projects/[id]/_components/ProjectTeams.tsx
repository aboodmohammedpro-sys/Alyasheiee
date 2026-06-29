"use client";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { DataTable } from "@/components/shared/DataTable";

export function ProjectTeams({ project, employees }: { project: any, employees: any }) {
    const locale = useLocale();
    const isRTL = locale === "ar";
    const app = useTranslations("app");

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <DataTable
                columns={[
                    { accessorKey: "id", header: "ID", meta: { mono: true } },
                    { accessorKey: "name", header: isRTL ? "الاسم الكامل" : "Full Name" },
                    { accessorKey: "role", header: isRTL ? "المنصب" : "Designation" },
                    { accessorKey: "status", header: app("status") },
                ]}
                data={employees.filter((e: any) => e.project === project.name)}
            />
        </div>
    );
}
