-- Server-side fixtures cache. A scheduled Edge Function fetches from the sports
-- API ONCE and writes here; every client reads from this table instead of
-- calling the API directly. This is what protects a rate-limited free tier
-- (e.g. API-Football's ~100 requests/day): 1 server request serves all users.

create table if not exists public.fixtures_cache (
  id         text        primary key,        -- e.g. 'wc2026'
  data       jsonb       not null,           -- array of Match objects
  updated_at timestamptz not null default now()
);

-- Anyone may read the cache; only the service role (Edge Function) writes it.
alter table public.fixtures_cache enable row level security;

drop policy if exists "public_read" on public.fixtures_cache;
create policy "public_read" on public.fixtures_cache for select using (true);
