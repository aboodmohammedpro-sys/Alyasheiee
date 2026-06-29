import { Badge } from "@/components/ui/Badge";
import type { BadgeTone } from "@/lib/design-data";
import { useTranslations } from "next-intl";

export function StatsCard({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: BadgeTone;
}) {
  const t = useTranslations("status");

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Badge tone={tone}>{t("active")}</Badge>
      </div>
      <p className="mt-4 font-mono text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </section>
  );
}

