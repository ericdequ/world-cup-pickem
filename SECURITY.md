# Security Model

This app handles money, so security is layered. Summary of what's in place and
what must be done before taking real funds.

## Identity & accounts
- **Passwordless magic-link auth (Supabase).** No passwords are stored or sent,
  so there's nothing to brute-force, phish, or leak in a breach.
- **CAPTCHA anti-spam.** Cloudflare Turnstile on sign-in (`components/security/Turnstile.tsx`),
  enforced server-side via Supabase Auth → Attack Protection. Blocks automated
  sign-up/abuse. Enable by setting `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + the secret in Supabase.
- **Supabase Auth rate limits** throttle OTP/email sends per IP out of the box.
- **Row-Level Security (RLS)** on every table: a user can only read/write their
  own rows (`supabase/migrations/0001_predictions.sql`). The anon key is safe to
  ship because RLS — not the key — is the boundary.

## Money & transactions (non-custodial)
- **We never hold user funds or private keys.** Entry fees go into an on-chain
  escrow contract; users sign every transaction in their own wallet. This removes
  the biggest custodial attack surface.
- **The escrow contract** (`lib/crypto/escrow/PoolEscrow.sol`) uses OpenZeppelin
  `SafeERC20` + `ReentrancyGuard`, follows checks-effects-interactions, caps the
  operator rake, and is one-entry-per-address.
- **Client-side transaction verification** (`lib/crypto/escrow.ts`): the chain ID
  is checked before signing (no wrong-network sends), double-entry is blocked, and
  every tx waits for an on-chain receipt before being treated as done.
- **Transparency:** anyone can read the pot balance + entrant count on-chain, so
  funds are publicly auditable.

## Prediction locking (non-spoofable)
- **Authoritative lock in the database.** A trigger (`supabase/migrations/0003`)
  rejects any insert/update to a prediction once the match's kickoff has passed,
  judged by the **server's** `now()`. A user changing their device clock cannot
  bypass it. The trigger also **server-stamps `submitted_at`**, so submission
  time can't be forged (the scoring rules depend on it).
- **Client uses trusted time, not the device clock.** `lib/time/serverTime.ts`
  syncs an offset from a server `Date` header and `isLocked()` is evaluated
  against that (`useNow`), so a spoofed local clock doesn't even change the UI.
- Keep `match_kickoffs` populated (via the cache-fixtures function) so every
  match is enforced; unknown kickoffs are permissive by design.

## Network / DDoS
- **Vercel edge** provides automatic DDoS mitigation; enable the **WAF + Attack
  Challenge Mode** in the Vercel dashboard for spikes.
- **Security headers** (`vercel.json`): strict CSP, HSTS (preload), `nosniff`,
  `X-Frame-Options: DENY` / `frame-ancestors 'none'`, Referrer-Policy, Permissions-Policy.
- **Economic Sybil/DDoS resistance:** the global pool is pay-to-play with a wallet
  requirement, so flooding it with fake entries costs real money — a natural rate limit.
- **Read amplification is capped** by the server-side fixtures cache (one API
  fetch serves all clients), so traffic spikes don't fan out to third-party APIs.

## Before mainnet / real money — REQUIRED
1. **Professional smart-contract audit** of `PoolEscrow.sol` (it is currently UNAUDITED).
2. **Legal structure:** paid contests are regulated (gambling / contest / money
   transmission). Eligibility, geofencing, KYC where required, and Terms — with counsel.
3. Turn on Vercel WAF + Supabase CAPTCHA enforcement.
4. Pen-test the auth + join flows; review RLS policies.
5. Test the full flow on **Base Sepolia** with test USDC first.
