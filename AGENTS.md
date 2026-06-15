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
  predictions/        PredictionsBoard (Groups|Bracket hub), GroupStage, MatchCard
  bracket/            BracketView + BracketNode (interactive knockout tree)
  match/ team/         MatchModal (predict + open team), TeamModal (squad/players)
  lineup/ players/     LineupDisplay, PlayerResearch (fed by dataProvider)
  pool/ tournament/    PoolPanel (friends + global + rules), PotPanel (transparency)
  profile/            AccountCard (Supabase magic-link), FavoriteTeamCard, NotificationsCard
capacitor.config.ts   Wraps the static `out/` export into native iOS/Android
```

Key rules:
- **Static export.** `next.config.ts` sets `output: "export"` so the app stays a
  client-only SPA wrappable by Capacitor. No server actions / route handlers.
- **Locking is sacred & non-spoofable.** `isLocked` is evaluated against trusted
  server-synced time (`useNow`/`lib/time/serverTime.ts`), never the device clock.
  The authoritative lock is a DB trigger (migration 0003) that rejects post-kickoff
  edits by server time and server-stamps `submitted_at`. Users preselect anytime
  and get a lineup-announced reminder (~1h before) to revise before it locks.
- **Data swap = one line.** Components depend on `MatchDataProvider`, not the
  vendor. Default is TheSportsDB; API-Football or the self-hosted
  `rezarahiminia/worldcup2026` API drop in via `lib/data/index.ts`.
- **Graceful degradation.** No Supabase env → local-only mode. No pot contract →
  transparency panel shows placeholder/testnet. App always runs.
- **Pot is non-custodial.** USDC escrow on Base (test on Base Sepolia first);
  on-chain reads make the pot + entrants publicly verifiable. Real money is
  regulated — gate eligibility/geofencing/terms before launch.

## Cloud sync, crypto & the API quota cache

```
supabase/
  migrations/0001_predictions.sql    predictions table + RLS (own rows only)
  migrations/0002_fixtures_cache.sql fixtures_cache table + public read
  functions/cache-fixtures/          Deno Edge Function: cron-refresh the cache
lib/data/
  predictionsRepo.ts                 Supabase CRUD for predictions
  cachedProvider.ts                  reads fixtures_cache first, falls back to live
lib/crypto/
  stablecoins.ts   registry — add a host country's coin, point NEXT_PUBLIC_STABLECOIN at it
  config.ts        chain/token/escrow/fee/rake, all env-driven
  client.ts        viem public client (read-only)
  escrow.ts        readPot / hasEntered / enterPool (approve → enter)
  escrowAbi.ts     typed ABI (as const)
  escrow/PoolEscrow.sol  documented, OZ-based, ReentrancyGuard, rake-capped (UNAUDITED)
  pot.ts           pure economics (operatorTake, prizePool)
hooks/  usePredictions (local+cloud merge), useWallet (EIP-1193), useOnChainPot
```

Rules:
- **Predictions sync** local-first; on sign-in, local ⨉ cloud merge keeps the
  newest pick per match, then writes through to Supabase.
- **Free-tier API quota.** A rate-limited source (e.g. API-Football ~100/day)
  must NOT be called per client. The `cache-fixtures` Edge Function fetches once
  on a cron into `fixtures_cache`; `cachedProvider` makes every client read that
  table. Default TheSportsDB has no hard cap, but the cache path is already wired.
- **Stablecoin is swappable** for the host country: add it to `stablecoins.ts`
  and set `NEXT_PUBLIC_STABLECOIN`. Decimals + address come from the registry.
- **Crypto deps:** only `viem` (audited, minimal). Wallet via the injected
  EIP-1193 standard — no extra SDK or project keys; the user signs everything.
- **The escrow contract is UNAUDITED.** Testnet only until audited; paid contests
  are regulated.

## i18n, time/locale & security

```
lib/i18n/
  config.ts        i18next init (lng:"en" fixed for hydration), LANGUAGES + dir
  format.ts        native Intl date/number/currency formatters (no date lib)
  locales/*.json   en, es, fr, pt, de
hooks/useLocale.ts active locale + user timezone + bound formatters
components/i18n/    LanguageProvider (detect + RTL after mount), LanguageSwitcher
components/security/Turnstile.tsx   optional Cloudflare CAPTCHA on sign-in
vercel.json        CSP + HSTS + frame/permissions security headers
SECURITY.md        threat model + pre-mainnet checklist
```

Rules:
- **Language:** translate UI via `useTranslation().t("namespace.key")`; add strings
  to all `locales/*.json`. Detection runs post-mount (deterministic SSR paint),
  switching persists to localStorage and flips `<html dir>` for RTL.
- **Time/dates:** never `toLocaleString` directly — use `useLocale().formatDateTime`
  so every kickoff renders in the viewer's timezone + language via native `Intl`.
- **Security layers:** magic-link auth (no passwords) + Turnstile + Supabase rate
  limits + RLS; non-custodial escrow with chain-ID/double-entry checks + receipt
  waits; Vercel WAF/headers + pay-to-play for DDoS/Sybil resistance. See SECURITY.md.
