"use client";

import { useTranslations, useLocale } from "next-intl";
import { DataTable } from "@/components/shared/DataTable";

export function ProjectEquipment({ project, equipment }: { project: any, equipment: any }) {
    const pt = useTranslations("projects");
    const app = useTranslations("app");
    const locale = useLocale();
    const isRTL = locale === "ar";

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <DataTable
                columns={[
                    { accessorKey: "code", header: "Code", meta: { mono: true } },
                    { accessorKey: "model", header: pt("equipment") },
                    { accessorKey: "status", header: app("status") },
                    { accessorKey: "hours", header: isRTL ? "إجمالي الساعات" : "Total Hours", meta: { align: "right" } },
                ]}
                data={equipment.filter((e: any) => e.project === project.name)}
            />
        </div>
    );
}
