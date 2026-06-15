const MEDALS = ["🥇", "🥈", "🥉"];

export function RankBadge({ rank }: { rank: number }) {
  if (rank < MEDALS.length) return <span className="text-[22px]">{MEDALS[rank]}</span>;
  return (
    <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-pitch-border text-xs font-bold text-muted">
      {rank + 1}
    </span>
  );
}
