import { cn } from "@/lib/utils";
import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-muted-2 bg-white px-3 text-sm text-ink placeholder:text-muted-1/70",
          "focus:outline-none focus:ring-2 focus:ring-gold-strong/70",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
