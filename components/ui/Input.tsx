import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const base =
  "w-full rounded-lg border border-pitch-border bg-pitch text-cream outline-none transition-colors focus:border-gold/60";

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, "px-3.5 py-2.5 text-sm", className)} {...props} />;
}

export function NumberInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      min={0}
      className={cn(base, "px-3 py-2 text-center text-base font-bold text-gold-light", className)}
      {...props}
    />
  );
}
