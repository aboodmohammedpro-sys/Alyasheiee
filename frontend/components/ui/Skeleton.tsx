import { cn } from "@/lib/utils/cn";

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted/60", className)}
            {...props}
        />
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-9 w-[250px]" />
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                </div>
            </div>
            <div className="rounded-xl border border-border">
                <div className="h-10 bg-muted/30 border-b border-border" />
                <div className="p-0">
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex h-11 items-center border-b border-border last:border-0 px-4 gap-4">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="rounded-xl border border-border p-4 space-y-4">
            <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-48" />
        </div>
    );
}
