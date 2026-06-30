"use client";

import { usePathname } from "next/navigation";
import { useAuthStore, type Permission } from "@/store/use-auth-store";
import { ShieldAlert, ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

// Map paths to permissions
// Keys are URL prefixes, values are required permissions
const accessRules: Record<string, Permission> = {
    "/projects": "manage_projects",
    "/resources": "manage_projects",
    "/field-records/attendance": "create_daily_log",
    "/field-records/daily-operations": "create_daily_log",
    "/field-records/fuel": "manage_fuel",
    "/procurement": "manage_projects", // Assumed fallback
    "/inventory/disbursements": "create_disbursement_request",
    "/reports/cost-control": "view_financial_reports",
};

export function PermissionGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { can, isSuperAdmin } = useAuthStore();

    // Super admins skip route guards
    if (isSuperAdmin()) return <>{children}</>;

    // Check rules matching the current pathname
    const requiredPermission = Object.entries(accessRules).find(([path]) =>
        pathname.startsWith(path)
    )?.[1];

    // If match found and user lacks permission -> 403
    if (requiredPermission && !can(requiredPermission)) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="h-24 w-24 rounded-full bg-danger/10 text-danger flex items-center justify-center shadow-inner">
                    <ShieldAlert className="h-12 w-12 text-danger" />
                </div>
                <div className="space-y-2 max-w-md">
                    <h1 className="text-3xl font-black tracking-tight text-foreground">403</h1>
                    <h2 className="text-xl font-bold">الوصول مرفوض (Forbidden)</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        عذراً، لا تملك الصلاحيات (Roles & Permissions) الكافية لعرض هذه الصفحة أو تنفيذ هذه العملية. يرجى التواصل مع مدير النظام إذا كنت تعتقد أن هذا خطأ.
                    </p>
                </div>
                <ButtonLink href="/dashboard" variant="outline" className="gap-2 text-sm mt-4">
                    <ChevronRight className="h-4 w-4" />
                    العودة للرئيسية
                </ButtonLink>
            </div>
        );
    }

    // Allowed
    return <>{children}</>;
}
