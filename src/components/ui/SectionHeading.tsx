import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, center, className }: Props) {
  return (
    <div className={cn(center && "text-center", className)}>
      {eyebrow ? (
        <div className={cn(center ? "justify-center" : "", "mb-2")}>
          <Badge>{eyebrow}</Badge>
        </div>
      ) : null}
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm md:text-base text-muted-1">{subtitle}</p> : null}
    </div>
  );
}
