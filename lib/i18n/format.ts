/**
 * Locale + timezone formatting via the native `Intl` API — zero dependencies,
 * accurate for every region, and the modern recommended approach (moment/luxon
 * are unnecessary here). All formatters take the active locale; dates also take
 * the user's timezone so kickoffs show in their local time automatically.
 */

/** The user's IANA timezone (e.g. "America/Mexico_City"), or UTC if unavailable. */
export function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function formatDateTime(
  iso: string,
  locale: string,
  timeZone: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  },
): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(new Date(iso));
}

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Format a money amount. Falls back to a plain number for non-ISO symbols (e.g. USDC). */
export function formatCurrency(value: number, locale: string, currency = "USD"): string {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
  } catch {
    return formatNumber(value, locale);
  }
}
