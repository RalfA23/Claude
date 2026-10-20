-- Wortwürfel: Online-Duelle zwischen Nutzern der Plattform (asynchron, wie das Götterduell).
-- Wer herausfordert, spielt ein Brett und legt das Duell offen hin. Wer annimmt, spielt dasselbe Brett mit derselben Zeit.
-- Gewertet wird wie im Original: Wörter, die beide gefunden haben, zählen nicht.
create table if not exists public.ww_duels (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  challenger uuid not null default auth.uid() references auth.users(id) on delete cascade,
  challenger_name text not null check (length(challenger_name) <= 40),
  cells jsonb not null,
  seed integer not null,
  seconds integer not null check (seconds in (60, 120, 180, 300)),
  min_len integer not null check (min_len in (3, 4)),
  challenger_result jsonb not null,
  opponent uuid references auth.users(id) on delete set null,
  opponent_name text,
  opponent_result jsonb,
  finished_at timestamptz,
  status text not null default 'open' check (status in ('open', 'done'))
);
alter table public.ww_duels enable row level security;

-- Alle angemeldeten Nutzer sehen offene und fertige Duelle.
drop policy if exists ww_duels_read on public.ww_duels;
create policy ww_duels_read on public.ww_duels for select to authenticated using (true);
-- Herausfordern nur im eigenen Namen.
drop policy if exists ww_duels_insert on public.ww_duels;
create policy ww_duels_insert on public.ww_duels for insert to authenticated with check (challenger = auth.uid() and status = 'open' and opponent is null);
-- Eigene offene Herausforderung zurückziehen.
drop policy if exists ww_duels_delete on public.ww_duels;
create policy ww_duels_delete on public.ww_duels for delete to authenticated using (challenger = auth.uid() and status = 'open');

-- Annehmen geht nur über diese Funktion: Sie setzt ausschließlich die Felder des Gegners und nur bei offenen fremden Duellen.
create or replace function public.ww_answer(duel uuid, name text, result jsonb) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  update public.ww_duels
     set opponent = auth.uid(), opponent_name = left(name, 40), opponent_result = result, status = 'done', finished_at = now()
   where id = duel and status = 'open' and challenger <> auth.uid() and auth.uid() is not null;
  return found;
end $$;
revoke all on function public.ww_answer(uuid, text, jsonb) from public;
grant execute on function public.ww_answer(uuid, text, jsonb) to authenticated;
