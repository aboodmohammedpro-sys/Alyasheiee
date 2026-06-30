"use client";

import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Search, LayoutDashboard, HardHat, Package, ShoppingCart, Users, Settings, Bell,
  FileText, Truck, BarChart3, Menu, LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useLayoutStore } from "@/store/use-layout-store";
import { useAuthStore, type Permission } from "@/store/use-auth-store";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const { sidebarOpen, toggleSidebar, setCommandPaletteOpen } = useLayoutStore();
  const { user, can, isSuperAdmin, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  // Define navigation with required permissions
  type NavItem = { href: string; label: string; icon: any; permission?: Permission };
  type NavGroup = { group: string; items: NavItem[] };

  const navigation: NavGroup[] = [
    {
      group: t("operations"),
      items: [
        { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
        { href: "/projects", label: t("projects"), icon: HardHat, permission: "manage_projects" },
      ],
    },
    {
      group: t("fieldRecords"),
      items: [
        { href: "/field-records/attendance", label: t("attendance"), icon: Users, permission: "create_daily_log" },
        { href: "/field-records/fuel", label: t("fuelDispatch"), icon: Truck, permission: "manage_fuel" },
        { href: "/field-records/daily-operations", label: t("dailyOperations"), icon: FileText, permission: "create_daily_log" },
      ],
    },
    {
      group: t("resources"),
      items: [
        { href: "/resources/employees", label: t("employees"), icon: Users, permission: "manage_projects" },
        { href: "/resources/equipment", label: t("equipment"), icon: Settings, permission: "manage_projects" },
      ],
    },
    {
      group: t("supplyChain"),
      items: [
        { href: "/procurement/requisitions", label: t("requisitions"), icon: ShoppingCart },
        { href: "/procurement/suppliers", label: t("suppliers"), icon: Users },
        { href: "/inventory/warehouses", label: t("warehouses"), icon: LayoutDashboard },
        { href: "/inventory/disbursements", label: "طلبات الصرف", icon: Package },
        { href: "/inventory/items", label: t("itemCatalog"), icon: Package },
      ],
    },
    {
      group: t("analytics"),
      items: [
        { href: "/reports/cost-control", label: "مراقبة التكاليف", icon: BarChart3, permission: "view_financial_reports" },
      ],
    },
  ];

  // Logic to filter menu items based on exact permissions
  const filteredNav = navigation.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (!item.permission) return true; // public items
      if (isSuperAdmin()) return true; // super admin sees everything
      return can(item.permission);
    }),
  })).filter(section => section.items.length > 0);

  const appT = useTranslations("app");
  const topbarT = useTranslations("topbar");

  // Format initials
  const initials = user?.name
    ? user.name.split(" ").map(n => n.charAt(0)).slice(0, 2).join("").toUpperCase()
    : "U";

  // Use the primary role for display
  const primaryRole = user?.roles[0]?.replace("_", " ") || "User";

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
          {filteredNav.map((section) => (
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

            <div className={cn("flex items-center gap-3 border-border", isRTL ? "pr-2 border-r mr-2" : "pl-2 border-l ml-2")}>
              <div className="h-8 w-8 rounded-full bg-primary text-[10px] font-bold text-primary-foreground grid place-items-center shadow-inner">
                {initials}
              </div>
              <div className="hidden flex-col md:flex">
                <span className="text-xs font-bold leading-none">{user?.name || "Guest User"}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{primaryRole}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-muted-foreground hover:text-danger-text hover:bg-danger/10 rounded-md transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
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
