import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/lib/api/types';

// Backend permissions map exactly from RolesSeeder.php
export type Permission =
    | 'create_daily_log'
    | 'approve_daily_log'
    | 'create_disbursement_request'
    | 'approve_disbursement_request'
    | 'issue_materials'
    | 'manage_fuel'
    | 'view_financial_reports'
    | 'manage_projects'
    | 'manage_users';

export type UserRole =
    | 'super_admin'
    | 'project_manager'
    | 'senior_recorder'
    | 'recorder'
    | 'storekeeper'
    | 'fuel_dispatcher';

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: AuthUser, token: string) => void;
    clearAuth: () => void;
    can: (permission: Permission) => boolean;
    hasRole: (role: UserRole | UserRole[]) => boolean;
    isSuperAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user: AuthUser, token: string) => {
                set({ user, token, isAuthenticated: true });
            },

            clearAuth: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            can: (permission: Permission): boolean => {
                const { user } = get();
                if (!user) return false;
                if (user.roles.includes('super_admin')) return true;
                return user.permissions.includes(permission);
            },

            hasRole: (role: UserRole | UserRole[]): boolean => {
                const { user } = get();
                if (!user) return false;
                if (user.roles.includes('super_admin')) return true;
                const roles = Array.isArray(role) ? role : [role];
                return roles.some(r => user.roles.includes(r));
            },

            isSuperAdmin: (): boolean => {
                const { user } = get();
                return user?.roles.includes('super_admin') ?? false;
            },
        }),
        {
            name: 'erp-auth',
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);
