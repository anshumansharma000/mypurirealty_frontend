import { cn } from "@/lib/utils";
import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "link";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const base =
  "inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantMap: Record<Variant, string> = {
  primary: "bg-gold-500 text-white hover:bg-gold-600 hover:text-ink shadow-soft cursor-pointer",
  secondary: "bg-gold-300 text-white hover:bg-ink/90 cursor-pointer",
  ghost: "text-ink/80 hover:text-ink hover:bg-muted-2/40",
  outline: "border border-muted-2 text-ink hover:bg-white/60 cursor-pointer",
  link: "text-gold hover:text-gold-600 underline underline-offset-4 p-0 h-auto cursor-pointer",
};

const sizeMap: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variantMap[variant], sizeMap[size], className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
