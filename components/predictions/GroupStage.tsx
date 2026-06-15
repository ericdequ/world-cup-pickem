"use client";

import { useMemo } from "react";
import type { Match, Prediction, Score, Team } from "@/lib/types";
import { MatchCard } from "./MatchCard";

/** Group-stage matches, grouped under each group's header (A–L). */
export function GroupStage({
  matches,
  predictions,
  onPredict,
  onTeamClick,
}: {
  matches: Match[];
  predictions: Record<string, Prediction>;
  onPredict: (matchId: string, score: Score) => void;
  onTeamClick: (team: Team) => void;
}) {
  const groups = useMemo(() => {
    const byGroup = new Map<string, Match[]>();
    for (const m of matches) {
      const key = m.group ?? "—";
      const list = byGroup.get(key) ?? [];
      list.push(m);
      byGroup.set(key, list);
    }
    return [...byGroup.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [matches]);

  return (
    <div className="flex flex-col gap-7">
      {groups.map(([group, groupMatches]) => (
        <section key={group}>
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[0.15em] text-gold">
            Group {group}
          </h2>
          <div className="flex flex-col gap-3">
            {groupMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={predictions[match.id]}
                onChange={(score) => onPredict(match.id, score)}
                onTeamClick={onTeamClick}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
