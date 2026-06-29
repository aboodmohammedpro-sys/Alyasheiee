"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Fuel, Clock, Save, History, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NewFuelDispatchPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations("fieldRecords.fuel");
  const app = useTranslations("app");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/field-records/fuel");
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title={t("title")} description={t("description")} />

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        {/* Asset Selection */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2 text-accent">
            <Truck className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">{t("assetSelection")}</h3>
          </div>
          <Select
            label={t("targetEquipment")}
            options={[
              { value: "cat-320", label: "EQ-CAT-320-08 | CAT 320 Excavator" },
              { value: "gen-250", label: "EQ-GEN-250-03 | 250KVA Generator" },
              { value: "kom-d85", label: "EQ-KOM-D85-12 | Komatsu Bulldozer" },
            ]}
            required
          />
          <Input label={t("currentHMR")} placeholder="e.g. 4218.5" type="number" step="0.1" unit="h" required />
        </div>

        {/* Fuel Source */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2 text-warning-text">
            <Fuel className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">{t("sourceTitle")}</h3>
          </div>
          <Select
            label={t("sourceTank")}
            options={[
              { value: "mt-02", label: "Mobile Fuel Truck 02 (4,200L)" },
              { value: "st-01", label: "Stationary Tank Riyadh (12,800L)" },
            ]}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t("nozzleStart")} placeholder="0.0" type="number" unit="L" />
            <Input label={t("nozzleEnd")} placeholder="0.0" type="number" unit="L" />
          </div>
        </div>

        {/* Transaction Details */}
        <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">{t("transactionDetails")}</h3>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Input label={t("quantityDispatched")} placeholder="0.00" type="number" unit="L" required />
            <Input label={t("dispatchDateTime")} type="datetime-local" required defaultValue={new Date().toISOString().slice(0, 16)} />
            <Select label={t("operator")} options={[{ value: "op-1", label: "Hassan Salem" }]} required />
          </div>
          <div className="mt-6 border-t border-border pt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => router.back()}>{app("cancel")}</Button>
            <Button type="submit" variant="accent" className="gap-2 px-8" isLoading={isLoading}>
              <Save className="h-4 w-4" />
              {t("logDispatch")}
            </Button>
          </div>
        </div>
      </form>

      {/* Quick History */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-bold uppercase tracking-wider">{t("todayDispatches")}</h3>
        </div>
        <div className="divide-y divide-border">
          {[
            { id: "FL-9912", target: "CAT 320 Excavator", qty: "420L", time: "10:15 AM" },
            { id: "FL-9910", target: "Komatsu Bulldozer", qty: "115L", time: "08:42 AM" },
          ].map((log) => (
            <div key={log.id} className="p-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-muted-foreground">{log.id}</span>
                <span className="font-bold">{log.target}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="font-mono font-bold text-accent">{log.qty}</span>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
