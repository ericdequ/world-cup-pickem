"use client";

import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { STORAGE_KEY, dirFor, LANGUAGES } from "@/lib/i18n/config";

const supported = new Set<string>(LANGUAGES.map((l) => l.code));

function applyDir(code: string) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = code;
  document.documentElement.dir = dirFor(code);
}

/**
 * Detects the user's language after mount (stored choice → browser language)
 * and applies it, including RTL direction. Detection runs post-hydration so the
 * server/client first paint stay identical.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const browser = navigator.language?.split("-")[0];
    const next = [stored, browser].find((c) => c && supported.has(c));
    if (next && next !== i18n.language) i18n.changeLanguage(next);
    applyDir(next ?? i18n.language);

    const onChange = (lng: string) => applyDir(lng);
    i18n.on("languageChanged", onChange);
    return () => i18n.off("languageChanged", onChange);
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
