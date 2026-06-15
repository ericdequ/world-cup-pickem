"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { type Match, type Stage } from "@/lib/types";
import { useMatches } from "@/hooks/useMatches";
import { usePredictions } from "@/hooks/usePredictions";
import { MatchCard } from "./MatchCard";

const STAGE_ORDER: Stage[] = [
  "group",
  "round-of-32",
  "round-of-16",
  "quarter-final",
  "semi-final",
  "third-place",
  "final",
];

export function PredictionsBoard() {
  const { t } = useTranslation();
  const { data: matches, loading, error } = useMatches();
  const { predictions, setPrediction } = usePredictions();

  const grouped = useMemo(() => {
    const map = new Map<Stage, Match[]>();
    for (const match of matches) {
      const list = map.get(match.stage) ?? [];
      list.push(match);
      map.set(match.stage, list);
    }
    return STAGE_ORDER.filter((s) => map.has(s)).map((stage) => ({
      stage,
      matches: map.get(stage)!,
    }));
  }, [matches]);

  if (loading)
    return <p className="py-12 text-center text-sm text-muted">{t("predict.loading")}</p>;
  if (error && matches.length === 0)
    return <p className="py-12 text-center text-sm text-red-400">{t("predict.error")}</p>;

  return (
    <div className="flex flex-col gap-7">
      {grouped.map(({ stage, matches: stageMatches }) => (
        <section key={stage}>
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.15em] text-gold">
            {t(`stage.${stage}`)}
          </h2>
          <div className="flex flex-col gap-3">
            {stageMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={predictions[match.id]}
                onChange={(score) => setPrediction(match.id, score)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
