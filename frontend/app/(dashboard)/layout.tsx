import { AppShell } from "@/components/shared/AppShell";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <PermissionGuard>
        <AppShell>{children}</AppShell>
      </PermissionGuard>
    </AuthGuard>
  );
}
