import { cn } from "@/lib/utils";
import React from "react";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-muted-2 bg-white px-3 text-sm text-ink",
          "focus:outline-none focus:ring-2 focus:ring-gold-strong/70",
          'appearance-none bg-[url(\'data:image/svg+xml;utf8,<svg fill="%23111827" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 7.5l4.5 4.5 4.5-4.5"/></svg>\')] bg-no-repeat bg-[right_0.75rem_center]',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";
