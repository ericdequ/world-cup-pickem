-- Authoritative, non-spoofable prediction lock.
--
-- The client checks lock state against trusted (server-synced) time for UX, but
-- the REAL gate is here: a trigger on `predictions` that rejects any insert/update
-- once kickoff has passed, judged by the database's own clock (`now()`), which a
-- client cannot influence. It also server-stamps `submitted_at`, so the pick's
-- submission time can't be forged either.

-- Kickoff times the trigger checks against. Populate from the live feed (e.g. the
-- cache-fixtures Edge Function upserts these alongside the fixtures cache).
create table if not exists public.match_kickoffs (
  match_id text        primary key,
  kickoff  timestamptz not null
);

alter table public.match_kickoffs enable row level security;
drop policy if exists "public_read_kickoffs" on public.match_kickoffs;
create policy "public_read_kickoffs" on public.match_kickoffs for select using (true);

create or replace function public.enforce_prediction_lock()
returns trigger
language plpgsql
security definer
as $$
declare
  ko timestamptz;
begin
  select kickoff into ko from public.match_kickoffs where match_id = new.match_id;

  -- Locked once kickoff has passed (server time). If the kickoff is unknown we
  -- allow the write; keep match_kickoffs populated so every match is enforced.
  if ko is not null and now() >= ko then
    raise exception 'Predictions are locked for match % (kickoff %)', new.match_id, ko
      using errcode = 'check_violation';
  end if;

  -- Server-stamp the submission time; ignore any client-supplied value.
  new.submitted_at := now();
  return new;
end;
$$;

drop trigger if exists predictions_lock on public.predictions;
create trigger predictions_lock
  before insert or update on public.predictions
  for each row execute function public.enforce_prediction_lock();
