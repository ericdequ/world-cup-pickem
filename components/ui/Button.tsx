import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "gold" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  gold: "bg-[linear-gradient(135deg,#c9a84c,#e8c96b)] text-pitch font-bold hover:brightness-105",
  ghost: "bg-transparent border border-pitch-border text-muted hover:border-gold hover:text-gold",
  danger: "bg-red-500/15 border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/25",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "gold", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "cursor-pointer rounded-lg px-4 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
