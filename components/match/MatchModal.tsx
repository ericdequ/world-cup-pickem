"use client";

import { useTranslation } from "react-i18next";
import type { Match, Team } from "@/lib/types";
import { usePredictions } from "@/hooks/usePredictions";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { MatchCard } from "@/components/predictions/MatchCard";

/** Match detail: predict the score, and open either team's squad. */
export function MatchModal({
  match,
  onSelectTeam,
  onClose,
}: {
  match: Match;
  onSelectTeam: (team: Team) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { predictions, setPrediction } = usePredictions();

  return (
    <Modal onClose={onClose}>
      <MatchCard
        match={match}
        prediction={predictions[match.id]}
        onChange={(score) => setPrediction(match.id, score)}
      />
      <div className="mt-3 flex gap-2">
        {[match.home, match.away].map((team) => (
          <Button
            key={team.id}
            variant="ghost"
            className="flex-1"
            disabled={team.placeholder}
            onClick={() => onSelectTeam(team)}
          >
            {t("match.viewTeam", { team: team.code })}
          </Button>
        ))}
      </div>
    </Modal>
  );
}
