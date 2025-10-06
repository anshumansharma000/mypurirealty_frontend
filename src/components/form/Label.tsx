import { cn } from "@/lib/utils";
import React from "react";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("block text-sm font-medium text-ink mb-1.5", className)} {...props} />
  );
}
