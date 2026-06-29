"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Plus, Trash2, FileText, ShoppingCart, Send } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NewRequisitionPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [items, setItems] = React.useState([{ id: 1, materialId: "", qty: 1, memo: "" }]);
  const t = useTranslations("procurement.requisitions");
  const app = useTranslations("app");

  const addItem = () => setItems([...items, { id: items.length + 1, materialId: "", qty: 1, memo: "" }]);
  const removeItem = (id: number) => setItems(items.filter((i) => i.id !== id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title={t("newTitle")}
        description={t("newDesc")}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost">{app("draft")}</Button>
            <Button variant="accent" className="gap-2" onClick={handleSubmit} isLoading={isLoading}>
              <Send className="h-4 w-4" />
              {t("submitForApproval")}
            </Button>
          </div>
        }
      />

      <form className="grid gap-6 lg:grid-cols-3">
        {/* Header */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground">
              <FileText className="h-5 w-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">{t("header")}</h3>
            </div>
            <Select
              label={t("targetProject")}
              options={[
                { value: "prj-01", label: "North Access Road" },
                { value: "prj-02", label: "Central Yard Expansion" },
              ]}
              required
            />
            <Input label={t("requiredDate")} type="date" required />
            <Select
              label={t("priority")}
              options={[
                { value: "normal", label: t("priority_options.normal") },
                { value: "high", label: t("priority_options.high") },
                { value: "critical", label: t("priority_options.critical") },
              ]}
              required
            />
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80">{t("remarks")}</label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-card px-3 py-2 text-sm focus:border-accent outline-none"
                placeholder={t("remarksPlaceholder")}
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-bold uppercase tracking-wider">{t("lineItems")}</h3>
              </div>
              <Button variant="ghost" size="sm" type="button" onClick={addItem} className="gap-2 text-accent">
                <Plus className="h-4 w-4" />
                {t("addItem")}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-xs uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-start">{t("materialSearch")}</th>
                    <th className="px-4 py-3 w-28 text-start">{t("quantity")}</th>
                    <th className="px-4 py-3 text-start">{t("spec")}</th>
                    <th className="px-4 py-3 text-center">{app("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {items.map((item) => (
                    <tr key={item.id} className="group transition-colors hover:bg-muted/10">
                      <td className="px-4 py-3">
                        <Select
                          options={[
                            { value: "", label: t("materialSearch") },
                            { value: "mat-1", label: "Portland cement 50kg" },
                            { value: "mat-2", label: "Rebar 16mm (Structural)" },
                            { value: "mat-3", label: "Hydraulic Pump Filter Set" },
                          ]}
                          className="border-none bg-surface p-0 shadow-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 font-mono focus:bg-background focus:border-accent transition-all outline-none"
                          defaultValue={item.qty}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          className="h-9 w-full rounded-md border border-transparent bg-muted/30 px-3 text-xs placeholder:text-muted-foreground/50 focus:bg-background focus:border-accent transition-all outline-none"
                          placeholder={t("specPlaceholder")}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-muted-foreground hover:text-danger-text opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {items.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                <p>{t("addItem")}</p>
              </div>
            )}
            <div className="p-4 bg-accent/5 border-t border-border">
              <p className="text-[10px] text-accent leading-relaxed">{t("proTip")}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
