"use client";

import { useTranslations } from "next-intl";
import { DataTable } from "@/components/shared/DataTable";

export function ProjectPhases({ phasesData }: { phasesData: any }) {
    const pt = useTranslations("projects");
    const app = useTranslations("app");

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            <DataTable
                columns={[
                    { accessorKey: "id", header: "ID", meta: { mono: true } },
                    { accessorKey: "name", header: pt("phases") },
                    { accessorKey: "status", header: app("status") },
                    { accessorKey: "start", header: app("date"), meta: { mono: true } },
                    { accessorKey: "progress", header: pt("progress"), cell: ({ getValue }) => `${getValue() as string}%`, meta: { mono: true, align: "right" } },
                ]}
                data={phasesData}
            />
        </div>
    );
}
