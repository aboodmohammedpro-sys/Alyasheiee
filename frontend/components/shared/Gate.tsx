"use client";

import type { ReactNode } from "react";
import type { Permission, UserRole } from "@/store/use-auth-store";
import { useAuthStore } from "@/store/use-auth-store";

interface GateProps {
    permission?: Permission;
    role?: UserRole | UserRole[];
    fallback?: ReactNode;
    children: ReactNode;
}

/**
 * Renders children only if the current user has the required permission or role.
 * Renders fallback (or nothing) otherwise.
 */
export function Gate({ permission, role, fallback = null, children }: GateProps) {
    const { can, hasRole } = useAuthStore();

    if (permission && !can(permission)) return <>{fallback}</>;
    if (role && !hasRole(role)) return <>{fallback}</>;

    return <>{children}</>;
}
