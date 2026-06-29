"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HardHat, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

export default function LoginPage() {
    const router = useRouter();
    const t = useTranslations("auth");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const [isLoading, setIsLoading] = React.useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className={`flex min-h-screen ${isRTL ? "flex-row-reverse" : ""}`}>
            {/* Visual Side */}
            <div className="relative hidden w-1/2 overflow-hidden bg-accent lg:block">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2070')] bg-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent/80 to-transparent" />

                <div className="relative z-10 flex h-full flex-col p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-white/10 p-2 backdrop-blur-md">
                            <HardHat className="h-8 w-8 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">
                            {isRTL ? "نظام إدارة المشاريع الإنشائية" : "CONSTRUCTION ERP"}
                        </span>
                    </div>

                    <div className="mt-auto max-w-lg">
                        <h1 className={`text-5xl font-black leading-tight tracking-tight ${isRTL ? "text-right" : ""}`}>
                            {t("heroTitle")}
                        </h1>
                        <p className={`mt-6 text-lg text-white/70 leading-relaxed ${isRTL ? "text-right" : ""}`}>
                            {t("heroSubtitle")}
                        </p>
                        <div className={`mt-12 flex items-center gap-8 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                            <div className={`space-y-1 ${isRTL ? "text-right" : ""}`}>
                                <p className="text-3xl font-black">{t("heroStat1Value")}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{t("heroStat1Label")}</p>
                            </div>
                            <div className={`space-y-1 ${isRTL ? "text-right" : ""}`}>
                                <p className="text-3xl font-black">{t("heroStat2Value")}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{t("heroStat2Label")}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2 bg-background">
                <div className="absolute top-4 right-4 z-10">
                    <LanguageSwitcher />
                </div>

                <div className={`w-full max-w-md space-y-8 ${isRTL ? "text-right" : "text-left"}`}>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-foreground">{t("welcomeBack")}</h2>
                        <p className="text-muted-foreground">{t("loginSubtitle")}</p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <Input
                                label={t("email")}
                                placeholder={t("emailPlaceholder")}
                                type="email"
                                required
                                className="bg-muted/30 focus:bg-background"
                            />
                            <Input
                                label={t("password")}
                                type="password"
                                placeholder={t("passwordPlaceholder")}
                                required
                                className="bg-muted/30 focus:bg-background"
                            />
                        </div>

                        <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                            <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <input type="checkbox" id="remember" className="h-4 w-4 rounded border-border bg-muted checked:bg-accent" />
                                <label htmlFor="remember" className="text-xs font-semibold text-muted-foreground">{t("rememberMe")}</label>
                            </div>
                            <button type="button" className="text-xs font-bold text-accent hover:underline">{t("forgotPassword")}</button>
                        </div>

                        <Button type="submit" className={`w-full h-12 text-sm font-bold gap-2 ${isRTL ? "flex-row-reverse" : ""}`} variant="accent" isLoading={isLoading}>
                            {t("accessSystem")}
                            <ArrowRight className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                        </Button>
                    </form>

                    <div className={`mt-10 flex items-center gap-2 rounded-xl bg-muted/50 p-4 border border-border ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <p className={`text-[10px] text-muted-foreground leading-snug ${isRTL ? "text-right" : ""}`}>
                            {t("securityNote")}
                        </p>
                    </div>

                    <p className="mt-8 text-center text-xs text-muted-foreground">
                        {t("copyright")}
                    </p>
                </div>
            </div>
        </div>
    );
}
