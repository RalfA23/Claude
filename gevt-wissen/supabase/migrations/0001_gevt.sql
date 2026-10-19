-- GEVT-Wissensdatenbank: Zugriff nur für freigeschaltete Konten, Inhalte nur verschlüsselt und nur für die Edge Function lesbar.
-- Einmal im SQL-Editor ausführen. Danach das eigene Konto freischalten (E-Mail einsetzen, nicht ins Repository schreiben):
--   insert into public.gevt_members (user_id, role) select id, 'admin' from auth.users where email = '…';

-- Wer die Wissensdatenbank nutzen darf. Nur manuelle Einzelfreigaben, keine Einladungscodes.
-- Jede Person sieht nur die eigene Zeile (damit die Seite weiß, ob sie freigeschaltet ist); schreiben kann nur der SQL-Editor.
create table if not exists public.gevt_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'reader' check (role in ('reader', 'admin')),
  note text,
  created_at timestamptz not null default now()
);
alter table public.gevt_members enable row level security;
drop policy if exists "gevt_members_select_own" on public.gevt_members;
create policy "gevt_members_select_own" on public.gevt_members for select using (auth.uid() = user_id);

-- Die Abschnitte der Wissensdatenbank, je Abschnitt AES-256-GCM-verschlüsselt (Schlüssel nur als Secret der Edge Function).
-- Keine Policies: weder Besucher noch angemeldete Konten können die Tabelle lesen, nur die Edge Function (service role).
create table if not exists public.gevt_chunks (
  id integer primary key,
  iv text not null,
  ct text not null,
  created_at timestamptz not null default now()
);
alter table public.gevt_chunks enable row level security;
revoke all on public.gevt_chunks from anon, authenticated;

-- Tageszähler für Fragen (Kostenbremse). Keine Policies, nur die Edge Function.
create table if not exists public.gevt_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null default current_date,
  count integer not null default 0,
  primary key (user_id, day)
);
alter table public.gevt_usage enable row level security;
revoke all on public.gevt_usage from anon, authenticated;
