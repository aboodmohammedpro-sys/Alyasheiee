"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const token = useAuthStore((state) => state.token);

    // Local state to prevent hydration mismatch while checking localStorage
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Very simple token presence check
        if (!token) {
            // Save attempted URL to return later if needed
            router.replace("/auth/login");
        } else {
            setIsChecking(false);
        }
    }, [token, router, pathname]);

    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                    <p className="text-sm font-semibold tracking-wide uppercase">جارِ التحقق من الصلاحيات...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
