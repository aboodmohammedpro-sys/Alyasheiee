"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { useMaterial } from "@/lib/hooks/useApi";
import { Loader2, AlertCircle, Package } from "lucide-react";

export default function MaterialDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: material, isLoading, isError } = useMaterial(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> جار التحميل...
            </div>
        );
    }

    if (isError || !material) {
        return (
            <div className="rounded-xl border border-danger/20 bg-danger/5 p-8 text-center text-danger-text">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                لم يتم العثور على هذه المادة
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-6">
            <PageHeader
                title={material.name}
                description={`كود: ${material.code} | الفئة: ${material.category}`}
                actions={<ButtonLink href="/procurement/materials" variant="outline">رجوع</ButtonLink>}
            />

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">{material.name}</h2>
                        <p className="text-sm text-muted-foreground font-mono">{material.code}</p>
                    </div>
                </div>

                <dl className="space-y-4">
                    {[
                        { label: "الفئة", value: material.category },
                        { label: "وحدة القياس", value: material.unit },
                        { label: "الوصف", value: material.description ?? "—" },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex items-start justify-between py-3 border-b border-border last:border-0">
                            <dt className="text-sm text-muted-foreground">{label}</dt>
                            <dd className="text-sm font-semibold text-end max-w-xs">{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
