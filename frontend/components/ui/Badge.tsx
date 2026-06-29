import type { BadgeTone } from "@/lib/design-data";
import type { ReactNode } from "react";

const toneClass: Record<BadgeTone, string> = {
  success: "border-success-border bg-success-bg text-success-text",
  warning: "border-warning-border bg-warning-bg text-warning-text",
  info: "border-info-border bg-info-bg text-info-text",
  danger: "border-danger-border bg-danger-bg text-danger-text",
  neutral: "border-border bg-muted text-muted-foreground",
};

export function Badge({ children, tone = "neutral", className = "" }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${toneClass[tone]} ${className}`}>
      {children}
    </span>
  );
}
