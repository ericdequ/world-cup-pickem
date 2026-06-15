"use client";

import { useTranslation } from "react-i18next";
import type { PlayerProfile, Team } from "@/lib/types";
import { useTeamSquad } from "@/hooks/useTeamSquad";
import { Modal } from "@/components/ui/Modal";

function PlayerRow({ player }: { player: PlayerProfile }) {
  return (
    <div className="flex items-center gap-3 border-b border-pitch-border py-2 last:border-0">
      {player.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={player.thumb} alt={player.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pitch text-sm">
          👤
        </div>
      )}
      <div className="min-w-0">
        <div className="text-[14px] font-semibold text-cream break-words">{player.name}</div>
        {player.position && <div className="text-[11px] text-muted">{player.position}</div>}
      </div>
    </div>
  );
}

export function TeamModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const { t } = useTranslation();
  const { data: squad, loading } = useTeamSquad(team.placeholder ? null : team.name);

  return (
    <Modal onClose={onClose}>
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-10 w-12 items-center justify-center rounded-lg bg-pitch text-sm font-bold text-gold-light">
          {team.code}
        </span>
        <h3 className="text-lg font-bold">{team.name}</h3>
      </div>

      {team.placeholder ? (
        <p className="py-6 text-center text-[13px] text-muted">{t("team.tbd")}</p>
      ) : loading ? (
        <p className="py-6 text-center text-[13px] text-muted">{t("team.loading")}</p>
      ) : squad.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-muted">{t("team.none")}</p>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto">
          <h4 className="mb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-gold">
            {t("team.squad")}
          </h4>
          {squad.map((p) => (
            <PlayerRow key={p.id} player={p} />
          ))}
        </div>
      )}
    </Modal>
  );
}
