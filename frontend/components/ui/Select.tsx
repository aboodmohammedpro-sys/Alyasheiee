import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
    label?: string;
    options: { label: string; value: string }[];
    error?: string;
    onChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className = "", label, options, error, required, children, onChange, value, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-semibold leading-none text-foreground/80">
                        {label}
                        {required && <span className="ml-1 text-danger">*</span>}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            "flex h-10 w-full appearance-none rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all focus:border-accent",
                            error ? "border-danger focus-visible:ring-danger/20" : "",
                            className
                        )}
                        ref={ref}
                        required={required}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        {...props}
                    >
                        {children || options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
                {error && <p className="text-xs font-medium text-danger animate-in fade-in slide-in-from-top-1 duration-200">{error}</p>}
            </div>
        );
    }
);
Select.displayName = "Select";

export { Select };

