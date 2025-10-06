import { cn } from "@/lib/utils";
import React from "react";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("container mx-auto max-w-screen-2xl px-4", className)} {...props} />;
}
