"use client";

import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Search, LayoutDashboard, HardHat, Package, ShoppingCart, Users, Settings, Bell,
  FileText, Truck, BarChart3, Menu
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useLayoutStore } from "@/store/use-layout-store";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { sidebarOpen, toggleSidebar, setCommandPaletteOpen } = useLayoutStore();

  const navigation = [
    {
      group: t("operations"),
      items: [
        { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
        { href: "/projects", label: t("projects"), icon: HardHat },
      ],
    },
    {
      group: t("fieldRecords"),
      items: [
        { href: "/field-records/progress", label: t("progressLogs"), icon: FileText },
        { href: "/field-records/attendance", label: t("attendance"), icon: Users },
        { href: "/field-records/fuel", label: t("fuelDispatch"), icon: Truck },
        { href: "/field-records/daily-operations", label: t("dailyOperations"), icon: FileText },
      ],
    },
    {
      group: t("resources"),
      items: [
        { href: "/resources/employees", label: t("employees"), icon: Users },
        { href: "/resources/equipment", label: t("equipment"), icon: Settings },
        { href: "/resources/teams", label: t("teams"), icon: Users },
      ],
    },
    {
      group: t("supplyChain"),
      items: [
        { href: "/procurement/requisitions", label: t("requisitions"), icon: ShoppingCart },
        { href: "/procurement/suppliers", label: t("suppliers"), icon: Users },
        { href: "/inventory/warehouses", label: t("warehouses"), icon: LayoutDashboard },
        { href: "/inventory/items", label: t("itemCatalog"), icon: Package },
      ],
    },
    {
      group: t("analytics"),
      items: [
        { href: "/reports", label: t("reports"), icon: BarChart3 },
      ],
    },
  ];

  const appT = useTranslations("app");
  const topbarT = useTranslations("topbar");

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <CommandPalette />

      {/* Sidebar — position depends on RTL */}
      <aside
        className={cn(
          "fixed inset-y-0 z-20 w-[280px] border-border bg-sidebar px-4 py-5 overflow-y-auto transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : isRTL ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0",
          isRTL
            ? "right-0 border-l sidebar-fixed"
            : "left-0 border-r sidebar-fixed"
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent font-mono text-sm font-bold text-white shadow-lg shadow-accent/20">
            ERP
          </span>
          <span>
            <span className="block text-sm font-bold text-sidebar-foreground">
              {isRTL ? "نظام إدارة المشاريع" : appT("name")}
            </span>
            <span className="block text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">
              {appT("tagline")}
            </span>
          </span>
        </Link>

        <nav className="mt-8 space-y-6">
          {navigation.map((section) => (
            <div key={section.group}>
              <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
                {section.group}
              </p>
              <div className="mt-3 space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-all group",
                        isRTL ? "flex-row-reverse justify-end" : "",
                        isActive
                          ? "bg-accent text-white shadow-md shadow-accent/20"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground")} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          isRTL ? "lg:pr-[280px]" : "lg:pl-[280px]"
        )}
      >
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground lg:hidden" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden items-center gap-2 md:flex">
              <HardHat className="h-4 w-4 text-accent" />
              <select className="h-9 rounded-md border-none bg-transparent px-1 text-sm font-semibold focus:ring-0 cursor-pointer">
                <option>{t("allProjects")}</option>
                <option>{isRTL ? "طريق الوصول الشمالي" : "North Access Road"}</option>
                <option>{isRTL ? "توسعة الساحة المركزية" : "Central Yard Expansion"}</option>
              </select>
            </div>
          </div>

          <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "")}>
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden h-9 w-64 items-center gap-2 rounded-md border border-border bg-muted/50 px-3 text-muted-foreground transition-all hover:bg-muted md:flex hover:border-accent/40"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="text-xs flex-1 text-start">{topbarT("search")}</span>
              <kbd className="rounded bg-background px-1.5 font-mono text-[10px] border border-border">
                {topbarT("searchShortcut")}
              </kbd>
            </button>

            <LanguageSwitcher />
            <ThemeToggle />

            <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-muted transition-colors">
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent animate-pulse" />
              <Bell className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className={cn("flex items-center gap-3 border-border", isRTL ? "pr-2 border-r mr-2" : "pl-2 border-l ml-2")}>
              <div className="h-8 w-8 rounded-full bg-primary text-[10px] font-bold text-primary-foreground grid place-items-center shadow-inner">AD</div>
              <div className="hidden flex-col md:flex">
                <span className="text-xs font-bold leading-none">{isRTL ? "المسؤول" : "Admin User"}</span>
                <span className="text-[10px] text-muted-foreground">{isRTL ? "مدير المشروع" : "Project Manager"}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
