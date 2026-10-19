-- Götterquiz: Online-Duelle zwischen Nutzern der Plattform (asynchron, wie Quizduell).
-- Wer herausfordert, spielt sieben Fragen und legt das Duell offen in die Arena. Wer annimmt, spielt dieselben Fragen;
-- gewonnen hat, wer mehr richtig hat, bei Gleichstand die kürzere Zeit.
create table if not exists public.gq_duels (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  challenger uuid not null default auth.uid() references auth.users(id) on delete cascade,
  challenger_name text not null,
  arena text not null,
  questions jsonb not null,
  challenger_result jsonb not null,
  opponent uuid references auth.users(id) on delete set null,
  opponent_name text,
  opponent_result jsonb,
  finished_at timestamptz,
  status text not null default 'open' check (status in ('open', 'done'))
);
alter table public.gq_duels enable row level security;

-- Alle angemeldeten Nutzer sehen die Arena (offene und fertige Duelle).
drop policy if exists gq_duels_read on public.gq_duels;
create policy gq_duels_read on public.gq_duels for select to authenticated using (true);
-- Herausfordern nur im eigenen Namen.
drop policy if exists gq_duels_insert on public.gq_duels;
create policy gq_duels_insert on public.gq_duels for insert to authenticated with check (challenger = auth.uid() and status = 'open' and opponent is null);
-- Eigene offene Herausforderung zurückziehen.
drop policy if exists gq_duels_delete on public.gq_duels;
create policy gq_duels_delete on public.gq_duels for delete to authenticated using (challenger = auth.uid() and status = 'open');

-- Annehmen geht nur über diese Funktion: Sie setzt ausschließlich die Felder des Gegners und nur bei offenen fremden Duellen.
create or replace function public.gq_answer(duel uuid, name text, result jsonb) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  update public.gq_duels
     set opponent = auth.uid(), opponent_name = left(name, 40), opponent_result = result, status = 'done', finished_at = now()
   where id = duel and status = 'open' and challenger <> auth.uid() and auth.uid() is not null;
  return found;
end $$;
revoke all on function public.gq_answer(uuid, text, jsonb) from public;
grant execute on function public.gq_answer(uuid, text, jsonb) to authenticated;
