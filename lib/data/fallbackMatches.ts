import type { Match, Stage, Team } from "@/lib/types";

/**
 * Complete World Cup 2026 schedule (104 matches): 12 groups × 6 = 72 group
 * matches, then the full knockout bracket — Round of 32 (16), Round of 16 (8),
 * Quarter-finals (4), Semi-finals (2), Third place (1), Final (1).
 *
 * Used when the live API has no data yet, so every round is always present and
 * the bracket renders in full. Group teams are a plausible 48-nation field;
 * knockout slots are placeholders ("1A", "W73", "L101") that resolve to real
 * teams once the live data feed populates them. Real fixtures from the provider
 * replace this entirely at runtime.
 */

type Pair = [name: string, code: string];

const GROUPS: Record<string, [Pair, Pair, Pair, Pair]> = {
  A: [["Mexico", "MEX"], ["Croatia", "CRO"], ["Ecuador", "ECU"], ["Norway", "NOR"]],
  B: [["Canada", "CAN"], ["Belgium", "BEL"], ["Morocco", "MAR"], ["Japan", "JPN"]],
  C: [["USA", "USA"], ["Switzerland", "SUI"], ["Senegal", "SEN"], ["Australia", "AUS"]],
  D: [["Argentina", "ARG"], ["Poland", "POL"], ["Egypt", "EGY"], ["South Korea", "KOR"]],
  E: [["France", "FRA"], ["Denmark", "DEN"], ["Nigeria", "NGA"], ["Iran", "IRN"]],
  F: [["Brazil", "BRA"], ["Uruguay", "URU"], ["Ghana", "GHA"], ["Qatar", "QAT"]],
  G: [["Spain", "ESP"], ["Sweden", "SWE"], ["Ivory Coast", "CIV"], ["Panama", "PAN"]],
  H: [["England", "ENG"], ["Serbia", "SRB"], ["Cameroon", "CMR"], ["New Zealand", "NZL"]],
  I: [["Portugal", "POR"], ["Netherlands", "NED"], ["Tunisia", "TUN"], ["Costa Rica", "CRC"]],
  J: [["Germany", "GER"], ["Colombia", "COL"], ["Algeria", "ALG"], ["Jamaica", "JAM"]],
  K: [["Italy", "ITA"], ["Peru", "PER"], ["Mali", "MLI"], ["Honduras", "HON"]],
  L: [["Turkey", "TUR"], ["Chile", "CHI"], ["DR Congo", "COD"], ["Saudi Arabia", "KSA"]],
};

const team = (name: string, code: string, group?: string): Team => ({
  id: `t-${code.toLowerCase()}`,
  name,
  code,
  group,
});

const slot = (label: string, key: string): Team => ({
  id: `tbd-${key}`,
  name: label,
  code: label,
  placeholder: true,
});

const iso = (date: string, hour: number) =>
  `${date}T${String(hour).padStart(2, "0")}:00:00Z`;

const addDays = (date: string, days: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

// Round-robin pairings for a 4-team group across 3 matchdays.
const ROUND_ROBIN = [
  { a: 0, b: 1, md: 1 },
  { a: 2, b: 3, md: 1 },
  { a: 0, b: 2, md: 2 },
  { a: 1, b: 3, md: 2 },
  { a: 0, b: 3, md: 3 },
  { a: 1, b: 2, md: 3 },
];
const MD_DATE: Record<number, string> = { 1: "2026-06-11", 2: "2026-06-17", 3: "2026-06-23" };

function buildGroupStage(): Match[] {
  const out: Match[] = [];
  let n = 0;
  Object.entries(GROUPS).forEach(([g, pairs], gi) => {
    const teams = pairs.map(([name, code]) => team(name, code, g));
    ROUND_ROBIN.forEach((m, j) => {
      const finished = m.md === 1; // matchday 1 already played, for a lived-in demo
      out.push({
        id: `g${n + 1}`,
        stage: "group",
        group: g,
        home: teams[m.a],
        away: teams[m.b],
        kickoff: iso(MD_DATE[m.md], 13 + ((gi * 2 + (j % 2)) % 9)),
        status: finished ? "finished" : "scheduled",
        result: finished ? { home: (gi + j) % 4, away: (gi * 2 + j) % 3 } : undefined,
      });
      n++;
    });
  });
  return out;
}

// 32 qualification slots feeding the Round of 32.
const R32_SLOTS = [
  "1A", "2B", "1C", "2D", "1E", "2F", "1G", "2H", "1I", "2J", "1K", "2L",
  "2A", "1B", "2C", "1D", "2E", "1F", "2G", "1H", "2I", "1J", "2K", "1L",
  "3A", "3B", "3C", "3D", "3E", "3F", "3G", "3H",
];

interface KnockoutSpec {
  stage: Stage;
  count: number;
  startNo: number;
  date0: string;
  /** Match number of the first feeder, or null for R32 (uses slot labels). */
  feederStart: number | null;
  third?: boolean;
}

function buildKnockout(spec: KnockoutSpec): Match[] {
  const out: Match[] = [];
  for (let k = 0; k < spec.count; k++) {
    const no = spec.startNo + k;
    let homeLabel: string;
    let awayLabel: string;
    if (spec.third) {
      homeLabel = "L101";
      awayLabel = "L102";
    } else if (spec.feederStart === null) {
      homeLabel = R32_SLOTS[k * 2];
      awayLabel = R32_SLOTS[k * 2 + 1];
    } else {
      homeLabel = `W${spec.feederStart + k * 2}`;
      awayLabel = `W${spec.feederStart + k * 2 + 1}`;
    }
    out.push({
      id: `${spec.stage}-${no}`,
      stage: spec.stage,
      home: slot(homeLabel, `${spec.stage}-h-${no}`),
      away: slot(awayLabel, `${spec.stage}-a-${no}`),
      kickoff: iso(addDays(spec.date0, Math.floor(k / 2)), 18 + (k % 2) * 3),
      status: "scheduled",
    });
  }
  return out;
}

export const FALLBACK_MATCHES: Match[] = [
  ...buildGroupStage(),
  ...buildKnockout({ stage: "round-of-32", count: 16, startNo: 73, date0: "2026-06-28", feederStart: null }),
  ...buildKnockout({ stage: "round-of-16", count: 8, startNo: 89, date0: "2026-07-04", feederStart: 73 }),
  ...buildKnockout({ stage: "quarter-final", count: 4, startNo: 97, date0: "2026-07-09", feederStart: 89 }),
  ...buildKnockout({ stage: "semi-final", count: 2, startNo: 101, date0: "2026-07-14", feederStart: 97 }),
  ...buildKnockout({ stage: "third-place", count: 1, startNo: 103, date0: "2026-07-18", feederStart: null, third: true }),
  ...buildKnockout({ stage: "final", count: 1, startNo: 104, date0: "2026-07-19", feederStart: 101 }),
];
