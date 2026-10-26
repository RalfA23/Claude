-- Fehlermeldungen und Feedback aus dem Portal und den Kursen (Knopf 🐞 unten rechts, portal/fehler.js).
-- Einmal im Supabase-SQL-Editor ausführen. Braucht is_app_admin() aus 0001_module_access.sql.
--
-- Regeln:
-- * Jedes angemeldete Konto legt eigene Meldungen an und sieht nur seine eigenen.
-- * Admins (app_admins) sehen alle Meldungen und setzen Status (offen/erledigt) und Notiz, im Portal unter „🐞 Meldungen“.
-- * Einfache Struktur, damit Claude die Meldungen per SQL lesen kann:
--   select id, created_at, email, bereich, seite, beschreibung, status from public.fehlermeldungen where status = 'offen' order by id;
--   screenshot ist eine data:-URL (JPEG, verkleinert auf höchstens 1280 px) oder null.

create table if not exists public.fehlermeldungen (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  email text,
  bereich text not null,
  beschreibung text not null check (length(beschreibung) between 1 and 5000),
  seite text,
  geraet text,
  screenshot text check (screenshot is null or (screenshot like 'data:image/%' and length(screenshot) < 1500000)),
  status text not null default 'offen' check (status in ('offen', 'erledigt')),
  notiz text,
  erledigt_at timestamptz
);
create index if not exists fehlermeldungen_status_idx on public.fehlermeldungen (status, created_at desc);
alter table public.fehlermeldungen enable row level security;

-- E-Mail kommt immer aus der Anmeldung, nicht vom Formular.
create or replace function public.fehlermeldungen_set_email() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.email := auth.jwt() ->> 'email';
  return new;
end;
$$;
drop trigger if exists fehlermeldungen_set_email on public.fehlermeldungen;
create trigger fehlermeldungen_set_email before insert on public.fehlermeldungen
  for each row execute function public.fehlermeldungen_set_email();

drop policy if exists "fehlermeldungen_insert_own" on public.fehlermeldungen;
create policy "fehlermeldungen_insert_own" on public.fehlermeldungen for insert to authenticated
  with check (user_id = auth.uid() and status = 'offen' and notiz is null and erledigt_at is null);

drop policy if exists "fehlermeldungen_select" on public.fehlermeldungen;
create policy "fehlermeldungen_select" on public.fehlermeldungen for select to authenticated
  using (user_id = auth.uid() or public.is_app_admin());

drop policy if exists "fehlermeldungen_update_admin" on public.fehlermeldungen;
create policy "fehlermeldungen_update_admin" on public.fehlermeldungen for update to authenticated
  using (public.is_app_admin()) with check (public.is_app_admin());

drop policy if exists "fehlermeldungen_delete_admin" on public.fehlermeldungen;
create policy "fehlermeldungen_delete_admin" on public.fehlermeldungen for delete to authenticated
  using (public.is_app_admin());

grant select, insert, update, delete on public.fehlermeldungen to authenticated;
