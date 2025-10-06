import { cn } from "@/lib/utils";
import React from "react";

export function FormGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5", className)} {...props} />;
}
