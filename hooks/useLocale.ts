"use client";

import { useTranslation } from "react-i18next";
import { detectTimeZone, formatDateTime, formatNumber } from "@/lib/i18n/format";

/**
 * Active locale + the user's timezone, plus bound formatters. Use this instead
 * of calling `toLocaleString` directly so every date/number respects the
 * selected language and the viewer's region.
 */
export function useLocale() {
  const { i18n } = useTranslation();
  const locale = i18n.language || "en";
  const timeZone = detectTimeZone();

  return {
    locale,
    timeZone,
    formatDateTime: (iso: string, options?: Intl.DateTimeFormatOptions) =>
      formatDateTime(iso, locale, timeZone, options),
    formatNumber: (value: number) => formatNumber(value, locale),
  };
}
