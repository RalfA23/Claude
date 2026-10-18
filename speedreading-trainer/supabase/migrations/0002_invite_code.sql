-- Self-registration only with a valid invite code. The app sends it as user metadata (invite_code) on sign-up.
-- Codes live in invite_codes; no policies, so only the SQL editor and this trigger can read them.
create table if not exists public.invite_codes (
  code text primary key,
  note text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.invite_codes enable row level security;

create or replace function public.require_invite_code() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (
    select 1 from public.invite_codes
    where active and code = new.raw_user_meta_data ->> 'invite_code'
  ) then
    raise exception 'invalid invite code';
  end if;
  -- Do not keep the code in the user record.
  new.raw_user_meta_data := new.raw_user_meta_data - 'invite_code';
  return new;
end $$;

drop trigger if exists require_invite_code on auth.users;
create trigger require_invite_code before insert on auth.users
  for each row execute function public.require_invite_code();
