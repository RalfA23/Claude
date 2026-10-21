-- Freigaben im Portal: welche Module (Kurse) ein Konto auf dem Dashboard sieht.
-- Einmal im Supabase-SQL-Editor ausführen. Braucht app_admins aus speedreading-trainer/supabase/migrations/0003_base_texts.sql.
--
-- Regeln:
-- * Konto ohne Zeile in module_access sieht alles (alle Konten von vor dieser Datei bleiben so).
-- * Neue Konten bekommen bei der Registrierung eine Zeile mit den Standardmodulen aus module_defaults.
-- * Admins (app_admins) sehen immer alles und pflegen Freigaben und Standard im Portal unter „Freigaben“.
-- Die Modul-Kennungen sind die ids aus COURSES in portal/index.html (lesen, schach, quiz, …).

create table if not exists public.module_access (
  user_id uuid primary key references auth.users (id) on delete cascade,
  modules text[] not null default '{}',
  updated_at timestamptz not null default now()
);
alter table public.module_access enable row level security;
drop policy if exists "module_access_select_own" on public.module_access;
create policy "module_access_select_own" on public.module_access for select using (auth.uid() = user_id);

create table if not exists public.module_defaults (
  id int primary key default 1 check (id = 1),
  modules text[] not null default '{}'
);
alter table public.module_defaults enable row level security;
insert into public.module_defaults (id, modules)
  values (1, array['lesen', 'quiz', 'wortwuerfel', 'murmelbahn', 'vestaboard'])
  on conflict (id) do nothing;

create or replace function public.is_app_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.app_admins a where a.user_id = auth.uid());
$$;

-- Liste aller Konten mit Freigaben, nur für Admins. modules ist null, wenn das Konto alles sieht.
create or replace function public.admin_module_users()
returns table (user_id uuid, email text, created_at timestamptz, last_sign_in_at timestamptz, modules text[], is_admin boolean)
language plpgsql stable security definer set search_path = '' as $$
#variable_conflict use_column
begin
  if not public.is_app_admin() then raise exception 'not allowed'; end if;
  return query
    select u.id, u.email::text, u.created_at, u.last_sign_in_at, m.modules,
           exists (select 1 from public.app_admins a where a.user_id = u.id)
    from auth.users u left join public.module_access m on m.user_id = u.id
    order by u.created_at;
end $$;

-- mods = null: Konto sieht wieder alles. Sonst genau diese Module.
create or replace function public.admin_set_modules(target uuid, mods text[]) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_app_admin() then raise exception 'not allowed'; end if;
  if mods is null then
    delete from public.module_access where user_id = target;
  else
    insert into public.module_access (user_id, modules, updated_at) values (target, mods, now())
      on conflict (user_id) do update set modules = excluded.modules, updated_at = now();
  end if;
end $$;

create or replace function public.admin_module_defaults() returns text[]
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_app_admin() then raise exception 'not allowed'; end if;
  return coalesce((select d.modules from public.module_defaults d where d.id = 1), '{}');
end $$;

create or replace function public.admin_set_module_defaults(mods text[]) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_app_admin() then raise exception 'not allowed'; end if;
  insert into public.module_defaults (id, modules) values (1, coalesce(mods, '{}'))
    on conflict (id) do update set modules = excluded.modules;
end $$;

-- Voreinstellung für eine bestimmte E-Mail: wer sich mit dieser Adresse registriert, bekommt genau diese Module statt des Standards.
-- Beispiel: insert into public.module_presets (email, modules) values ('name@example.com', array['sprachen:niederlaendisch']);
create table if not exists public.module_presets (
  email text primary key check (email = lower(email)),
  modules text[] not null default '{}'
);
alter table public.module_presets enable row level security;

-- Neue Konten: Voreinstellung zur E-Mail oder sonst die Standardmodule eintragen. Ein Fehler hier darf die Registrierung nie verhindern.
create or replace function public.grant_default_modules() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.module_access (user_id, modules)
    values (new.id, coalesce(
      (select p.modules from public.module_presets p where p.email = lower(new.email)),
      (select d.modules from public.module_defaults d where d.id = 1), '{}'))
    on conflict (user_id) do nothing;
  return new;
exception when others then
  return new;
end $$;

drop trigger if exists grant_default_modules on auth.users;
create trigger grant_default_modules after insert on auth.users
  for each row execute function public.grant_default_modules();
