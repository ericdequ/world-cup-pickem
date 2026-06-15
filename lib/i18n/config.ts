import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import pt from "./locales/pt.json";
import de from "./locales/de.json";

/** Supported languages. `dir` drives RTL layout if an RTL locale is ever added. */
export const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "pt", label: "Português", dir: "ltr" },
  { code: "de", label: "Deutsch", dir: "ltr" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const STORAGE_KEY = "wc-pickem:lang";

export const dirFor = (code: string): "ltr" | "rtl" =>
  LANGUAGES.find((l) => l.code === code)?.dir ?? "ltr";

/**
 * Initialized with a fixed `lng: "en"` so the server prerender and the first
 * client paint always match (no hydration mismatch). The real language is
 * applied after mount in LanguageProvider.
 */
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    pt: { translation: pt },
    de: { translation: de },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
