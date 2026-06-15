import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import type { Match } from "./types";

/** Stable numeric notification id derived from a string (Capacitor needs a number). */
const idFrom = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 2_000_000_000;
};

const isNative = (): boolean => Capacitor.isNativePlatform();

/** Ask for notification permission on the current platform. Returns whether granted. */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (isNative()) {
    const res = await LocalNotifications.requestPermissions();
    return res.display === "granted";
  }
  if (typeof Notification !== "undefined") {
    const res = await Notification.requestPermission();
    return res === "granted";
  }
  return false;
}

/** Web fallback fires while the app is open (native scheduling persists in the OS). */
function scheduleWebNotification(at: Date, title: string, body: string) {
  if (typeof window === "undefined" || typeof Notification === "undefined") return;
  const delay = at.getTime() - Date.now();
  if (delay <= 0 || delay > 2 ** 31 - 1) return;
  window.setTimeout(() => {
    if (Notification.permission === "granted") new Notification(title, { body });
  }, delay);
}

async function schedule(id: number, at: Date, title: string, body: string) {
  if (at.getTime() <= Date.now()) return;
  if (isNative()) {
    await LocalNotifications.schedule({
      notifications: [{ id, title, body, schedule: { at } }],
    });
  } else {
    scheduleWebNotification(at, title, body);
  }
}

/** Remind the user to lock their pick shortly before kickoff. */
export async function scheduleKickoffReminder(match: Match, minutesBefore = 60): Promise<void> {
  const at = new Date(new Date(match.kickoff).getTime() - minutesBefore * 60_000);
  await schedule(
    idFrom(`kickoff:${match.id}`),
    at,
    `${match.home.code} vs ${match.away.code} — kickoff soon`,
    `Lock your prediction. Kickoff in ${minutesBefore} min.`,
  );
}

/** Remind the user to check the final score after a match ends. */
export async function scheduleScoreReminder(match: Match, hoursAfter = 2): Promise<void> {
  const at = new Date(new Date(match.kickoff).getTime() + hoursAfter * 3_600_000);
  await schedule(
    idFrom(`score:${match.id}`),
    at,
    `${match.home.code} vs ${match.away.code} — full time`,
    "Check the result and see how your prediction scored.",
  );
}

/** Schedule kickoff + score reminders for every upcoming game of a team. */
export async function scheduleTeamReminders(teamCode: string, matches: Match[]): Promise<void> {
  const upcoming = matches.filter(
    (m) =>
      (m.home.code === teamCode || m.away.code === teamCode) &&
      new Date(m.kickoff).getTime() > Date.now(),
  );
  for (const match of upcoming) {
    await scheduleKickoffReminder(match);
    await scheduleScoreReminder(match);
  }
}
