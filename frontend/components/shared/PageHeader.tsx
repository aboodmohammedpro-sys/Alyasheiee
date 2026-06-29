"use client";

import type { ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const t = useTranslations("app");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <header className={`flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end ${isRTL ? "lg:justify-between flex-row-reverse" : "lg:justify-between"}`}>
      <div className={isRTL ? "text-right" : ""}>
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {isRTL ? "نظام إدارة المشاريع الإنشائية" : t("name")}
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
