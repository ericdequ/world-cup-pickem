"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { syncServerTime, trustedNow } from "@/lib/time/serverTime";

/** Trusted current time, refreshed app-wide from one timer. */
export const NowContext = createContext<Date>(new Date(0));

export function NowProvider({
  children,
  tickMs = 30_000,
}: {
  children: ReactNode;
  tickMs?: number;
}) {
  // Deterministic initial value for SSR/first paint; real time applied after mount.
  const [now, setNow] = useState<Date>(() => new Date(0));

  useEffect(() => {
    let active = true;
    const update = () => active && setNow(trustedNow());
    syncServerTime().then(update);
    update();
    const id = setInterval(update, tickMs);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [tickMs]);

  return <NowContext.Provider value={now}>{children}</NowContext.Provider>;
}
