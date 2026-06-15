"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Team } from "@/lib/types";
import { useMatches } from "@/hooks/useMatches";
import { useFavoriteTeam } from "@/hooks/useFavoriteTeam";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { ensureNotificationPermission, scheduleTeamReminders } from "@/lib/notifications";

export function FavoriteTeamCard() {
  const { t } = useTranslation();
  const { data: matches } = useMatches();
  const [favorite, setFavorite] = useFavoriteTeam();

  const teams = useMemo(() => {
    const byCode = new Map<string, Team>();
    for (const m of matches) {
      byCode.set(m.home.code, m.home);
      byCode.set(m.away.code, m.away);
    }
    return [...byCode.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);

  const choose = async (code: string) => {
    const next = favorite === code ? null : code;
    setFavorite(next);
    if (next) {
      const granted = await ensureNotificationPermission();
      if (granted) await scheduleTeamReminders(next, matches);
    }
  };

  return (
    <Card className="p-5">
      <h2 className="mb-1 text-[13px] font-bold uppercase tracking-[0.15em] text-gold">
        {t("profile.favorite")}
      </h2>
      <p className="mb-3 text-[12px] text-muted">{t("profile.favoriteHint")}</p>
      <div className="flex flex-wrap gap-2">
        {teams.map((team) => (
          <button
            key={team.code}
            onClick={() => choose(team.code)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors",
              favorite === team.code
                ? "border-gold bg-gold/10 text-gold-light"
                : "border-pitch-border bg-pitch text-muted hover:text-cream",
            )}
          >
            {team.code} · {team.name}
          </button>
        ))}
      </div>
    </Card>
  );
}
