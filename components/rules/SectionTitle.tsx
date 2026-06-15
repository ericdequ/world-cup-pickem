import type { ReactNode } from "react";

export const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-4 text-[13px] font-bold uppercase tracking-[0.15em] text-gold">{children}</h2>
);
