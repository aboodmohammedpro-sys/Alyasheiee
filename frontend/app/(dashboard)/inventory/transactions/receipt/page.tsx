"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Scan, Save, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

const initialRows = [
  { id: "1", item: "Portland cement 50kg", ordered: 2000, received: 1980, pending: 20 },
  { id: "2", item: "Rebar 16mm", ordered: 12, received: 12, pending: 0 },
];

export default function ReceiptPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations("inventory.transactions");
  const app = useTranslations("app");

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("receiptTitle")}
        description={t("receiptDesc")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Scan className="h-4 w-4" />
              {t("scanBarcode")}
            </Button>
            <Button variant="accent" className="gap-2" onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 2000); }} isLoading={isLoading}>
              <Save className="h-4 w-4" />
              {t("postReceipt")}
            </Button>
          </div>
        }
      />

      <form className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{t("lineItems")}</h3>
            <Select
              label={t("purchaseOrder")}
              options={[{ value: "PO-001", label: "PO-2026-0441 - Al-Tuwairqi Steel" }]}
              required
            />
            <Select
              label={t("receivingWarehouse")}
              options={[
                { value: "wh-1", label: "Central Stores" },
                { value: "wh-2", label: "North Field Depot" }
              ]}
              required
            />
            <Input label={t("deliveryNote")} placeholder="e.g. DN-88120" required />
            <Input
              label={t("receivingDate")}
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <h3 className="text-sm font-bold uppercase tracking-wider">{t("lineItems")}</h3>
              <Button variant="ghost" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {t("addManualRow")}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-start">{t("material")}</th>
                    <th className="px-4 py-3 text-end">{t("ordered")}</th>
                    <th className="px-4 py-3 text-end">{t("received")}</th>
                    <th className="px-4 py-3 text-end">{t("balance")}</th>
                    <th className="px-4 py-3 text-center">{app("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {initialRows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3 font-semibold">{row.item}</td>
                      <td className="px-4 py-3 text-end font-mono text-muted-foreground">{row.ordered}</td>
                      <td className="px-4 py-3 text-end">
                        <input
                          type="number"
                          className="h-9 w-24 rounded-md border border-input bg-background px-3 text-end font-mono focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                          defaultValue={row.received}
                        />
                      </td>
                      <td className="px-4 py-3 text-end font-mono font-bold text-accent">{row.pending}</td>
                      <td className="px-4 py-3 text-center">
                        <button className="p-2 text-muted-foreground hover:text-danger-text"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-muted/10 border-t border-border">
              <p className="text-xs text-muted-foreground italic">{t("varianceNote")}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
