/**
 * Trusted "now" for lock enforcement.
 *
 * The device clock can be changed by the user, so it can't be the only gate on
 * when a pick locks. We sync an offset against a server's `Date` response header
 * (same-origin on the web; the deployed site URL in the native app) and expose
 * `trustedNow()` = deviceClock + offset. A spoofed local clock no longer moves
 * the lock in the UI.
 *
 * NOTE: this is the client-side / UX layer. The AUTHORITATIVE lock is enforced
 * in the database against the server clock (see supabase/migrations/0003), which
 * a client cannot bypass at all.
 */
let offsetMs = 0;
let syncPromise: Promise<void> | null = null;

const TIME_SOURCE = process.env.NEXT_PUBLIC_SITE_URL || "";

async function readServerDate(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    const header = res.headers.get("date");
    return header ? new Date(header).getTime() : null;
  } catch {
    return null;
  }
}

/** Sync the offset once (cached). Safe to call from many places. */
export function syncServerTime(): Promise<void> {
  if (syncPromise) return syncPromise;
  syncPromise = (async () => {
    if (typeof window === "undefined") return;
    // Same-origin first (Vercel serves the Date header); fall back to the
    // configured site URL for the native app where origin isn't an HTTP server.
    const serverMs =
      (await readServerDate(window.location.origin)) ??
      (TIME_SOURCE ? await readServerDate(TIME_SOURCE) : null);
    if (serverMs !== null) offsetMs = serverMs - Date.now();
  })();
  return syncPromise;
}

/** Current time corrected by the server offset. */
export function trustedNow(): Date {
  return new Date(Date.now() + offsetMs);
}
