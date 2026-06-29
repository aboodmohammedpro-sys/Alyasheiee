"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { setLocale } from "@/i18n/actions";
import type { Locale } from "@/i18n/request";
import { Languages } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
    const locale = useLocale() as Locale;
    const t = useTranslations("language");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleChange = (newLocale: Locale) => {
        if (newLocale === locale) return;
        startTransition(async () => {
            await setLocale(newLocale);
            router.refresh();
        });
    };

    return (
        <div className="relative flex items-center gap-1.5">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <select
                value={locale}
                disabled={isPending}
                onChange={(e) => handleChange(e.target.value as Locale)}
                className="h-8 appearance-none bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer disabled:opacity-50"
                aria-label={t("switchTo")}
            >
                <option value="ar">{t("ar")}</option>
                <option value="en">{t("en")}</option>
            </select>
        </div>
    );
}
