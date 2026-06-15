"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ensureNotificationPermission } from "@/lib/notifications";

export function NotificationsCard() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "granted" | "denied">("idle");

  const enable = async () => {
    const granted = await ensureNotificationPermission();
    setStatus(granted ? "granted" : "denied");
  };

  return (
    <Card className="p-5">
      <h2 className="mb-1 text-[13px] font-bold uppercase tracking-[0.15em] text-gold">
        {t("profile.reminders")}
      </h2>
      <p className="mb-3 text-[12px] text-muted">{t("profile.remindersHint")}</p>
      {status === "granted" ? (
        <p className="text-[13px] text-green-400">✓ {t("profile.notifsOn")}</p>
      ) : (
        <>
          <Button onClick={enable}>{t("profile.enableNotifs")}</Button>
          {status === "denied" && (
            <p className="mt-2 text-[12px] text-red-400">
              Blocked — enable notifications in your device settings.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
