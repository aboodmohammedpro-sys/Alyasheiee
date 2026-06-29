"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/Button";
import { Plus, Users } from "lucide-react";
import { useTranslations } from "next-intl";

const teamsData = [
    { id: "TEAM-01", name: "Road Grading A", supervisor: "Khaled Saleh", size: 12, project: "North Access Road", status: "Active" },
    { id: "TEAM-02", name: "Steel Works B", supervisor: "M. Ahmed", size: 8, project: "North Access Road", status: "Active" },
    { id: "TEAM-03", name: "Utility Team", supervisor: "Fahad Omar", size: 6, project: "Central Yard Expansion", status: "Standby" },
];

export default function TeamsPage() {
    const t = useTranslations("resources.teams");
    const app = useTranslations("app");

    return (
        <div className="space-y-6">
            <PageHeader
                title={t("title")}
                description={t("description")}
                actions={
                    <Button variant="accent" className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t("createTeam")}
                    </Button>
                }
            />

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <DataTable
                    columns={[
                        { accessorKey: "id", header: t("teamId"), meta: { mono: true } },
                        { accessorKey: "name", header: t("teamName") },
                        { accessorKey: "supervisor", header: t("supervisor") },
                        { accessorKey: "size", header: t("membersCount"), meta: { align: "right" } },
                        { accessorKey: "project", header: t("assignedProject") },
                        { accessorKey: "status", header: app("status") },
                    ]}
                    data={teamsData}
                />
            </div>
        </div>
    );
}
