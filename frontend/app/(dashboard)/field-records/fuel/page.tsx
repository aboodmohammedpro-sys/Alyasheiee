"use client";

import { DataTable } from "@/components/shared/DataTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

const fuelLogs = [
  { id: "FUEL-2026-881", equipment: "EQ-CAT-320-08", tank: "Mobile Fuel Truck 02", qty: "180 L", status: "Recorded" },
  { id: "FUEL-2026-882", equipment: "EQ-GEN-250-03", tank: "Mobile Fuel Truck 02", qty: "75 L", status: "Recorded" },
  { id: "FUEL-2026-883", equipment: "EQ-CRN-50T-02", tank: "Central Diesel Tank", qty: "120 L", status: "Pending Review" },
];

export default function FuelPage() {
  const t = useTranslations("fieldRecords.fuel");
  const app = useTranslations("app");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("listTitle")}
        description={t("listDesc")}
        actions={<ButtonLink href="/field-records/fuel/new" variant="accent">{t("logDispatch")}</ButtonLink>}
      />
      <DataTable
        columns={[
          { accessorKey: "id", header: "Log ID", meta: { mono: true } },
          { accessorKey: "equipment", header: t("targetEquipment"), meta: { mono: true } },
          { accessorKey: "tank", header: t("sourceTank") },
          { accessorKey: "qty", header: t("quantityDispatched"), meta: { mono: true } },
          { accessorKey: "status", header: app("status") },
        ]}
        data={fuelLogs}
      />
    </div>
  );
}
