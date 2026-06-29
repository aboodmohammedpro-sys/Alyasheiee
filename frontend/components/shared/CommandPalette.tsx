    "use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
    Search,
    Plus,
    LayoutDashboard,
    HardHat,
    Package,
    ShoppingCart,
    Users,
    Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useLayoutStore } from "@/store/use-layout-store";
import { useTranslations, useLocale } from "next-intl";

export function CommandPalette() {
    const { commandPaletteOpen: open, setCommandPaletteOpen: setOpen } = useLayoutStore();
    const router = useRouter();
    const t = useTranslations("topbar");
    const nav = useTranslations("nav");
    const dashboard = useTranslations("dashboard");
    const locale = useLocale();
    const isRTL = locale === "ar";

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(!useLayoutStore.getState().commandPaletteOpen);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-background/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200">
                <Command className="flex h-full w-full flex-col">
                    <div className={`flex items-center border-b border-border px-3 ${isRTL ? "flex-row-reverse" : ""}`} cmdk-input-wrapper="">
                        <Search className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4 shrink-0 opacity-50`} />
                        <Command.Input
                            placeholder={t("searchAnything")}
                            className={`flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${isRTL ? "text-right" : ""}`}
                        />
                    </div>
                    <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 scrollbar-thin scrollbar-thumb-border">
                        <Command.Empty className="py-6 text-center text-sm">{t("noResults")}</Command.Empty>

                        <Command.Group heading={t("quickActions")} className={`px-2 pb-2 text-xs font-medium text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                            <Command.Item
                                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                                onSelect={() => runCommand(() => router.push("/procurement/requisitions/new"))}
                            >
                                <Plus className="h-4 w-4" />
                                <span>{dashboard("newRequisition")}</span>
                                <span className={`${isRTL ? "mr-auto" : "ml-auto"} text-[10px] uppercase font-bold text-muted-foreground`}>N + P</span>
                            </Command.Item>
                            <Command.Item
                                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                                onSelect={() => runCommand(() => router.push("/field-records/fuel/new"))}
                            >
                                <Plus className="h-4 w-4" />
                                <span>{dashboard("newFuelLog")}</span>
                                <span className={`${isRTL ? "mr-auto" : "ml-auto"} text-[10px] uppercase font-bold text-muted-foreground`}>N + F</span>
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading={t("navigation")} className={`px-2 py-2 text-xs font-medium text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                            <Command.Item
                                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                                onSelect={() => runCommand(() => router.push("/dashboard"))}
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>{nav("dashboard")}</span>
                            </Command.Item>
                            <Command.Item
                                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                                onSelect={() => runCommand(() => router.push("/projects"))}
                            >
                                <HardHat className="h-4 w-4" />
                                <span>{nav("projects")}</span>
                                <span className={`${isRTL ? "mr-auto" : "ml-auto"} text-[10px] uppercase font-bold text-muted-foreground`}>G + P</span>
                            </Command.Item>
                            <Command.Item
                                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                                onSelect={() => runCommand(() => router.push("/inventory/items"))}
                            >
                                <Package className="h-4 w-4" />
                                <span>{nav("itemCatalog")}</span>
                                <span className={`${isRTL ? "mr-auto" : "ml-auto"} text-[10px] uppercase font-bold text-muted-foreground`}>G + I</span>
                            </Command.Item>
                            <Command.Item
                                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                                onSelect={() => runCommand(() => router.push("/procurement/requisitions"))}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                <span>{nav("requisitions")}</span>
                            </Command.Item>
                            <Command.Item
                                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                                onSelect={() => runCommand(() => router.push("/resources/employees"))}
                            >
                                <Users className="h-4 w-4" />
                                <span>{nav("employees")}</span>
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading={nav("analytics")} className={`px-2 py-2 text-xs font-medium text-muted-foreground ${isRTL ? "text-right" : ""}`}>
                            <Command.Item
                                className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm text-foreground hover:bg-muted cursor-pointer transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                                onSelect={() => runCommand(() => router.push("/reports"))}
                            >
                                <Settings className="h-4 w-4" />
                                <span>{nav("reports")}</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>

                    <div className={`flex items-center justify-between border-t border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}>
                        <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span><kbd className="rounded bg-background px-1 border border-border">Esc</kbd> {t("escToClose")}</span>
                            <span><kbd className="rounded bg-background px-1 border border-border">↵</kbd> {t("enterToSelect")}</span>
                        </div>
                        <span>{t("erpCommandCenter")}</span>
                    </div>
                </Command>
            </div>
            <div
                className="absolute inset-0 -z-10"
                onClick={() => setOpen(false)}
            />
        </div>
    );
}

