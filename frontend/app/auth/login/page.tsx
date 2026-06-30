"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HardHat, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi } from "@/lib/api/endpoints";
import { useAuthStore } from "@/store/use-auth-store";

const loginSchema = z.object({
    email: z.string().email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [showPassword, setShowPassword] = React.useState(false);
    const [serverError, setServerError] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        setServerError("");
        try {
            // Hardware/App generic device name
            const res = await authApi.login(data.email, data.password, "web-app");
            const responseData = res.data.data;

            // Store in Session Zustand
            setAuth(responseData.user, responseData.token);

            router.push("/dashboard");
        } catch (error: any) {
            if (error.response?.status === 422 || error.response?.status === 401) {
                setServerError("بيانات الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور.");
            } else {
                setServerError("تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-3xl border border-border shadow-2xl relative overflow-hidden">

                {/* Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-bl-[100px] z-0 pointer-events-none" />

                <div className="text-center relative z-10 space-y-2">
                    <div className="mx-auto h-14 w-14 bg-accent text-white grid place-items-center rounded-2xl shadow-lg shadow-accent/20 mb-6">
                        <HardHat className="h-7 w-7" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">مرحباً بعودتك</h1>
                    <p className="text-sm text-muted-foreground">قم بتسجيل الدخول للوصول إلى نظام إدارة المشاريع</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 relative z-10">
                    {serverError && (
                        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-start gap-3 text-danger-text text-sm">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            <p className="leading-tight">{serverError}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Input
                            label="البريد الإلكتروني"
                            placeholder="name@company.com"
                            type="email"
                            dir="ltr"
                            {...register("email")}
                            error={errors.email?.message}
                        />

                        <div className="space-y-1.5 relative">
                            <Input
                                label="كلمة المرور"
                                type={showPassword ? "text" : "password"}
                                dir="ltr"
                                placeholder="••••••••"
                                {...register("password")}
                                error={errors.password?.message}
                            />
                            <button
                                type="button"
                                className={`absolute end-3 top-[32px] text-muted-foreground hover:text-foreground transition-colors ${errors.password ? '-translate-y-3' : ''}`}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" {...register("rememberMe")} className="rounded text-accent focus:ring-accent" />
                            <span className="text-muted-foreground">تذكرني</span>
                        </label>
                        <a href="#" className="font-semibold text-accent hover:underline">
                            نسيت كلمة المرور؟
                        </a>
                    </div>

                    <Button type="submit" variant="accent" className="w-full h-12 text-base rounded-xl" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> جاري التحقق...</>
                        ) : (
                            "تسجيل الدخول"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
