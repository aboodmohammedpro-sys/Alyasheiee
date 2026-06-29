"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ArrowRightLeft, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TransferPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations("inventory.transactions");
  const app = useTranslations("app");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title={t("transferTitle")} description={t("transferDesc")} />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{t("transferSource")} ← {t("transferDest")}</h3>
            <Select label={t("transferSource")} options={[{ value: "wh-1", label: "Central Stores" }]} required />
            <div className="flex justify-center py-2">
              <div className="p-2 bg-accent/10 rounded-full text-accent">
                <ArrowRightLeft className="h-5 w-5 rotate-90" />
              </div>
            </div>
            <Select label={t("transferDest")} options={[{ value: "wh-2", label: "North Field Depot" }]} required />
            <Input label={t("transferDate")} type="date" required defaultValue={new Date().toISOString().split("T")[0]} />
            <Input label={t("vehicleRef")} placeholder="e.g. Truck #42 - Ahmed Salem" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <h3 className="text-sm font-bold uppercase tracking-wider">{t("transferItems")}</h3>
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {app("add")}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-start">{t("material")}</th>
                    <th className="px-4 py-3 text-end">{t("available")}</th>
                    <th className="px-4 py-3 text-end">{t("quantity") ?? "Qty"}</th>
                    <th className="px-4 py-3 text-center">{app("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { id: 1, name: "Portland cement 50kg", available: "6,200", transfer: "500" },
                    { id: 2, name: "Rebar 16mm", available: "38", transfer: "5" },
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3 font-semibold">{row.name}</td>
                      <td className="px-4 py-3 text-end font-mono text-muted-foreground">{row.available}</td>
                      <td className="px-4 py-3 text-end">
                        <input
                          type="number"
                          className="h-9 w-24 rounded-md border border-input bg-background px-3 text-end font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                          defaultValue={row.transfer}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="p-2 text-muted-foreground hover:text-danger-text"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-muted/5 border-t border-border flex justify-end gap-3">
              <Button variant="ghost" type="button">{app("draft")}</Button>
              <Button variant="accent" type="submit" isLoading={isLoading} className="px-8">
                {t("confirmTransfer")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
