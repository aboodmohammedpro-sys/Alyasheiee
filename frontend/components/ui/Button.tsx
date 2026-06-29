import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "accent" | "secondary" | "outline" | "ghost" | "danger";

const variantClass: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-strong",
  accent: "bg-accent text-accent-foreground hover:bg-accent-strong",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-strong",
  outline: "border border-border bg-surface text-foreground hover:bg-muted",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-danger text-white hover:bg-danger-strong",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

type Size = "sm" | "default" | "lg";

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-2.5 text-[10px]",
  default: "h-9 px-4 text-sm",
  lg: "h-11 px-8 text-base",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
};

export function Button({ className = "", variant = "primary", size = "default", isLoading, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(base, variantClass[variant], sizeClass[size], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && children}
    </button>
  );
}

export function ButtonLink({ className = "", variant = "primary", size = "default", href, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, variantClass[variant], sizeClass[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
