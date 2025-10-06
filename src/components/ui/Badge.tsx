import { cn } from "@/lib/utils";
import React from "react";

type Tone = "neutral" | "success" | "warning";

const toneMap: Record<Tone, string> = {
  neutral: "bg-muted-2 text-ink",
  success: "bg-green-100 text-green-900",
  warning: "bg-yellow-100 text-yellow-900",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneMap[tone],
        className,
      )}
      {...props}
    />
  );
}
