"use client";

import * as React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ButtonLink } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { HardHat } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const t = useTranslations("projects");
  const app = useTranslations("app");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/projects");
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title={t("createNew")}
        description={t("createSubtitle")}
        actions={<ButtonLink href="/projects" variant="ghost">{app("cancel")}</ButtonLink>}
      />

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label={t("projectName")}
            placeholder={t("projectName")}
            required
            className="md:col-span-2"
          />
          <Input
            label={t("projectCode")}
            placeholder="e.g. PRJ-2026-XXX"
            required
          />
          <Input
            label={t("clientName")}
            placeholder={t("clientName")}
            required
          />
          <Input
            label={t("location")}
            placeholder={t("location")}
            required
          />
          <Input
            label={t("manager")}
            placeholder={t("manager")}
            required
          />
          <Input
            label={t("budget")}
            placeholder="0.00"
            type="number"
            unit="SAR"
            required
          />
          <Input
            label={t("startDate")}
            type="date"
            required
          />
          <Input
            label={t("endDate")}
            type="date"
            required
          />
          <div className="md:col-span-2">
            <label className="text-sm font-semibold leading-none text-foreground/80">{t("description_field")}</label>
            <textarea
              className="mt-1.5 flex min-h-[120px] w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 transition-all focus:border-accent"
              placeholder={t("descriptionPlaceholder")}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Button type="button" variant="ghost" onClick={() => router.back()}>{app("discard")}</Button>
          <Button type="submit" variant="accent" isLoading={isLoading} className="px-8">
            {t("createButton")}
          </Button>
        </div>
      </form>
    </div>
  );
}
