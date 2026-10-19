-- Shared base collection of practice texts: everyone signed in can read, only admins can add or remove.
create table if not exists public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.app_admins enable row level security;
-- A user may see only their own row (so the app can tell whether to show the admin buttons). Rows are added in the SQL editor.
create policy "admins_select_own" on public.app_admins for select using (auth.uid() = user_id);

create table if not exists public.base_texts (
  id uuid primary key default gen_random_uuid(),
  text jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.base_texts enable row level security;
create policy "base_texts_select" on public.base_texts for select to authenticated using (true);
create policy "base_texts_insert_admin" on public.base_texts for insert to authenticated
  with check (exists (select 1 from public.app_admins a where a.user_id = auth.uid()));
create policy "base_texts_delete_admin" on public.base_texts for delete to authenticated
  using (exists (select 1 from public.app_admins a where a.user_id = auth.uid()));
