"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Match, Prediction, Stage } from "@/lib/types";
import { cn } from "@/lib/cn";
import { BracketNode } from "./BracketNode";

const COLUMN_ORDER: Stage[] = [
  "round-of-32",
  "round-of-16",
  "quarter-final",
  "semi-final",
  "final",
];
const NODE_SLOT = 66; // px of vertical space reserved per first-round node

/**
 * Interactive knockout bracket. Rounds are columns; each later column uses
 * `justify-around` over a shared height so its fewer nodes center between their
 * feeders — the classic bracket staircase. Horizontally scrollable on mobile.
 */
export function BracketView({
  matches,
  predictions,
  onSelect,
}: {
  matches: Match[];
  predictions: Record<string, Prediction>;
  onSelect: (match: Match) => void;
}) {
  const { t } = useTranslation();

  const { columns, thirdPlace, height } = useMemo(() => {
    const byStage = new Map<Stage, Match[]>();
    for (const m of matches) {
      const list = byStage.get(m.stage) ?? [];
      list.push(m);
      byStage.set(m.stage, list);
    }
    const cols = COLUMN_ORDER.filter((s) => byStage.has(s)).map((stage) => ({
      stage,
      matches: byStage.get(stage)!,
    }));
    const firstCount = cols[0]?.matches.length ?? 0;
    return {
      columns: cols,
      thirdPlace: byStage.get("third-place")?.[0],
      height: Math.max(firstCount * NODE_SLOT, NODE_SLOT),
    };
  }, [matches]);

  if (columns.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-2">
          {columns.map((col, colIndex) => (
            <div key={col.stage} className="flex w-[132px] flex-col">
              <h3 className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-gold">
                {t(`stage.${col.stage}`)}
              </h3>
              <div
                className={cn("flex flex-col justify-around")}
                style={{ height }}
              >
                {col.matches.map((m) => (
                  <BracketNode
                    key={m.id}
                    match={m}
                    prediction={predictions[m.id]}
                    withConnector={colIndex > 0}
                    onClick={() => onSelect(m)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {thirdPlace && (
        <div className="mx-auto w-[132px]">
          <h3 className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-muted">
            {t("stage.third-place")}
          </h3>
          <BracketNode
            match={thirdPlace}
            prediction={predictions[thirdPlace.id]}
            onClick={() => onSelect(thirdPlace)}
          />
        </div>
      )}
    </div>
  );
}
