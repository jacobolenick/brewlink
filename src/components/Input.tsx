import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefix, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-[var(--text-muted)]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-sm text-[var(--text-faint)] pointer-events-none select-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg border bg-[var(--bg-elevated)] text-[var(--text)] text-sm",
              "placeholder:text-[var(--text-faint)]",
              "border-[var(--border)] focus:border-[var(--accent)] transition-colors duration-150",
              "py-2.5 px-3",
              prefix && "pl-[calc(0.75rem+var(--prefix-width,0px))]",
              error && "border-[var(--red)] focus:border-[var(--red)]",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[var(--red)]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
