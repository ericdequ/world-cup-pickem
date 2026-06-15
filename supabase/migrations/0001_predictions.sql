-- Predictions: one row per (user, match). Cloud copy of each user's picks so
-- they sync across devices. Apply with the Supabase SQL editor or `supabase db push`.

create table if not exists public.predictions (
  user_id      uuid        not null references auth.users (id) on delete cascade,
  match_id     text        not null,
  home_score   integer     not null check (home_score >= 0),
  away_score   integer     not null check (away_score >= 0),
  submitted_at timestamptz not null default now(),
  primary key (user_id, match_id)
);

-- Row-level security: a user can only ever read or write their own predictions.
alter table public.predictions enable row level security;

drop policy if exists "own_predictions" on public.predictions;
create policy "own_predictions"
  on public.predictions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
