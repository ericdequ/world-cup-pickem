"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Match, Team } from "@/lib/types";
import { useMatches } from "@/hooks/useMatches";
import { usePredictions } from "@/hooks/usePredictions";
import { cn } from "@/lib/cn";
import { GroupStage } from "./GroupStage";
import { BracketView } from "@/components/bracket/BracketView";
import { MatchModal } from "@/components/match/MatchModal";
import { TeamModal } from "@/components/team/TeamModal";

type View = "groups" | "bracket";

export function PredictionsBoard() {
  const { t } = useTranslation();
  const { data: matches, loading, error } = useMatches();
  const { predictions, setPrediction } = usePredictions();

  const [view, setView] = useState<View>("groups");
  const [openMatch, setOpenMatch] = useState<Match | null>(null);
  const [openTeam, setOpenTeam] = useState<Team | null>(null);

  const { groupMatches, knockoutMatches } = useMemo(
    () => ({
      groupMatches: matches.filter((m) => m.stage === "group"),
      knockoutMatches: matches.filter((m) => m.stage !== "group"),
    }),
    [matches],
  );

  if (loading)
    return <p className="py-12 text-center text-sm text-muted">{t("predict.loading")}</p>;
  if (error && matches.length === 0)
    return <p className="py-12 text-center text-sm text-red-400">{t("predict.error")}</p>;

  const tabs: { key: View; label: string }[] = [
    { key: "groups", label: t("predict.groups") },
    { key: "bracket", label: t("predict.bracket") },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={cn(
              "flex-1 rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors",
              view === tab.key
                ? "border-gold bg-gold/10 text-gold-light"
                : "border-pitch-border bg-pitch-card text-muted hover:text-cream",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "groups" ? (
        <GroupStage
          matches={groupMatches}
          predictions={predictions}
          onPredict={setPrediction}
          onTeamClick={setOpenTeam}
        />
      ) : (
        <BracketView
          matches={knockoutMatches}
          predictions={predictions}
          onSelect={setOpenMatch}
        />
      )}

      {openMatch && (
        <MatchModal
          match={openMatch}
          onSelectTeam={(team) => {
            setOpenMatch(null);
            setOpenTeam(team);
          }}
          onClose={() => setOpenMatch(null)}
        />
      )}

      {openTeam && <TeamModal team={openTeam} onClose={() => setOpenTeam(null)} />}
    </div>
  );
}
