<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# World Cup Pick-Em

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. A leaderboard +
rules app for a World Cup group-stage prediction pool.

## Architecture

```
app/
  layout.tsx        Root layout + fonts
  page.tsx          Thin composition: wires hooks → feature components
  globals.css       Tailwind import + @theme design tokens + keyframes
lib/
  types.ts          Domain types (Player, ScoringRule, TournamentConfig, TabKey)
  config.ts         The active tournament — single source of truth for all copy/values
  scoring.ts        Pure functions: playerTotal, sortByTotal, calculatePot
  cn.ts             Class-name join helper
hooks/
  useLocalStorage.ts  SSR-safe persisted state
  usePlayers.ts       Player CRUD over persisted storage
components/
  ui/               Reusable primitives (Button, Card, Modal, Switch, Input, Badge)
  layout/           Hero, TabBar
  leaderboard/      Leaderboard, PlayerRow, RankBadge, AddPlayer, PrizeBreakdown, PlayerEditModal
  rules/            Rules, ScoringCard, RulesList, FormatExamples, EntryFeeWarning
```

## Conventions

- **Config-driven.** Rounds, scoring, prizes, rules, copy, and seed players all
  live in `lib/config.ts`. Launching a future edition (e.g. the 2030 build) is a
  config change, not a rewrite.
- **Styling.** Tailwind utilities only; colors/fonts/animations come from the
  `@theme` tokens in `globals.css` (`bg-pitch`, `text-gold`, `font-display`,
  `animate-fade-up`, …). Use the `cn()` helper for conditional classes. Reach for
  inline `style` only for genuinely dynamic values (grid templates, animation delays).
- **`@/` path alias** maps to the repo root.
- **Client components** (`"use client"`) only where interactivity/state is needed.

## Platform layer (accounts, data, predictions, native, pot)

```
app/page.tsx          App shell: BottomNav + 5 sections (predict/lineups/players/pool/profile)
lib/
  data/               Free-API data layer (adapter pattern)
    provider.ts         MatchDataProvider interface — the only thing components depend on
    thesportsdb.ts      TheSportsDB impl (free, no key); degrades to fallbackMatches
    index.ts            `dataProvider` — swap this one line to change source
  predictions.ts      Pure locking + scoring (isLocked, scorePrediction, totalPoints)
  notifications.ts    Capacitor LocalNotifications + web fallback (kickoff/score reminders)
  supabase/client.ts  Browser client; null + isSupabaseConfigured when env absent
  crypto/pot.ts       USDC-escrow-on-Base economics + getGlobalTournament (read-only)
hooks/                useMatches/useLineup, usePlayerSearch, usePredictions,
                      useAuth, useFavoriteTeam, useAsyncData
components/
  predictions/        PredictionsBoard, MatchCard (score steppers, kickoff lock)
  lineup/ players/     LineupDisplay, PlayerResearch (fed by dataProvider)
  pool/ tournament/    PoolPanel (friends + global + rules), PotPanel (transparency)
  profile/            AccountCard (Supabase magic-link), FavoriteTeamCard, NotificationsCard
capacitor.config.ts   Wraps the static `out/` export into native iOS/Android
```

Key rules:
- **Static export.** `next.config.ts` sets `output: "export"` so the app stays a
  client-only SPA wrappable by Capacitor. No server actions / route handlers.
- **Locking is sacred.** A prediction locks at kickoff — enforced in one pure
  function (`isLocked`) used everywhere.
- **Data swap = one line.** Components depend on `MatchDataProvider`, not the
  vendor. Default is TheSportsDB; API-Football or the self-hosted
  `rezarahiminia/worldcup2026` API drop in via `lib/data/index.ts`.
- **Graceful degradation.** No Supabase env → local-only mode. No pot contract →
  transparency panel shows placeholder/testnet. App always runs.
- **Pot is non-custodial.** USDC escrow on Base (test on Base Sepolia first);
  on-chain reads make the pot + entrants publicly verifiable. Real money is
  regulated — gate eligibility/geofencing/terms before launch.
