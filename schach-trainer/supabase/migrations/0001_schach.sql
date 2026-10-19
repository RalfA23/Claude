-- Schachtraining: one JSON document per user and path ("stand/woodpecker", "sitzungen/<id>", "wertungen/<id>"),
-- the same shape the trainer page keeps in its document store. Row Level Security: everyone sees and writes only their own rows.
create table if not exists public.schach_docs (
  user_id uuid not null references auth.users (id) on delete cascade,
  path text not null check (path ~ '^[a-z]+/[A-Za-z0-9_.:-]+$' and length(path) <= 120),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, path)
);

alter table public.schach_docs enable row level security;

create policy "schach_select_own" on public.schach_docs for select using (auth.uid() = user_id);
create policy "schach_insert_own" on public.schach_docs for insert with check (auth.uid() = user_id);
create policy "schach_update_own" on public.schach_docs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "schach_delete_own" on public.schach_docs for delete using (auth.uid() = user_id);
