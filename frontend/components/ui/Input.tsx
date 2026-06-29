import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    unit?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", type, label, error, unit, required, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-semibold leading-none text-foreground/80">
                        {label}
                        {required && <span className="ml-1 text-danger">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        required={required}
                        className={cn(
                            "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-accent",
                            error ? "border-danger focus-visible:ring-danger/20" : "",
                            unit && "pr-16",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {unit && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                                {unit}
                            </span>
                        </div>
                    )}
                </div>
                {error && <p className="text-xs font-medium text-danger animate-in fade-in slide-in-from-top-1 duration-200">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
