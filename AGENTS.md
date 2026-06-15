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

## Future: realtime data + 2030

Live scores/standings are intended to come from a self-hosted
`rezarahiminia/worldcup2026` API (separate backend). When wiring it in, add a
`lib/api/` data layer and have it feed `usePlayers`/scoring — keep components
config- and prop-driven so the swap stays localized.
