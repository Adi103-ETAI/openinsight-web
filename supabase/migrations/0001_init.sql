-- OpenInsight validation schema
-- Run this in Supabase SQL Editor, OR via: supabase db push
-- This migration creates the tables, indexes, and RLS policies for the
-- early-access validation backend.
--
-- NOTE (v2): The original version used a custom GUC `app.admin_emails` set via
-- `ALTER DATABASE ... SET ...`. On Supabase, the SQL Editor role does NOT have
-- permission to run `ALTER DATABASE`, which caused:
--   ERROR: 42501: permission denied to set parameter "app.admin_emails"
-- This version replaces that GUC with a plain `admin_emails` table. To
-- add/remove admins, just INSERT/DELETE rows — no special permissions needed.

-- ===========================================================================
-- 1. early_access_submissions
-- ===========================================================================
create table if not exists public.early_access_submissions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  full_name       text not null,
  email           text not null,
  phone           text not null,
  persona         text not null check (persona in ('doctor','student','professional')),
  specialty       text not null,
  other_specialty text,
  institution     text not null,
  city            text not null,
  nmc_number      text,
  use_case        text,
  referral_source text,

  newsletter_opt_in boolean not null default true,
  status          text not null default 'new'
                  check (status in ('new','contacted','approved','rejected')),

  ip_country      text,
  user_agent      text
);

-- Indexes for common admin queries
create index if not exists idx_ea_created_at    on public.early_access_submissions (created_at desc);
create index if not exists idx_ea_email         on public.early_access_submissions (lower(email));
create index if not exists idx_ea_persona       on public.early_access_submissions (persona);
create index if not exists idx_ea_specialty     on public.early_access_submissions (specialty);
create index if not exists idx_ea_status        on public.early_access_submissions (status);
create index if not exists idx_ea_city          on public.early_access_submissions (city);

-- ===========================================================================
-- 2. contact_messages
-- ===========================================================================
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,

  status      text not null default 'new'
              check (status in ('new','read','responded','archived')),
  responded_at timestamptz
);

create index if not exists idx_cm_created_at on public.contact_messages (created_at desc);
create index if not exists idx_cm_status     on public.contact_messages (status);

-- ===========================================================================
-- 3. admin_emails allowlist (replaces the app.admin_emails GUC)
-- ===========================================================================
-- A simple table of admin email addresses. RLS policies below check
-- membership against this table. The table itself is readable by everyone
-- (it only contains email addresses used for access control — no secrets),
-- but only the service role (or a postgres superuser) can write to it.
create table if not exists public.admin_emails (
  email       text primary key,
  created_at  timestamptz not null default now()
);

-- Anyone can read the allowlist (needed for RLS policy evaluation).
-- Writes are restricted to the service role / postgres.
alter table public.admin_emails enable row level security;

drop policy if exists "anyone can read admin allowlist" on public.admin_emails;
create policy "anyone can read admin allowlist"
  on public.admin_emails
  for select
  to anon, authenticated
  using (true);

-- Convenience view: TRUE if the current JWT email is an admin.
-- (Not strictly required — the RLS policies inline the same check — but
-- handy for debugging in the SQL Editor.)
create or replace view public.is_current_user_admin as
  select exists (
    select 1
    from public.admin_emails
    where lower(email) = lower(auth.jwt() ->> 'email')
  ) as is_admin;

-- ===========================================================================
-- 4. Row-Level Security on submission / message tables
-- ===========================================================================
alter table public.early_access_submissions enable row level security;
alter table public.contact_messages          enable row level security;

-- ─── early_access_submissions policies ───────────────────────────────────

-- Anyone (anon) can INSERT a new submission — the public form needs this.
drop policy if exists "anon can insert submissions" on public.early_access_submissions;
create policy "anon can insert submissions"
  on public.early_access_submissions
  for insert
  to anon, authenticated
  with check (true);

-- Only admin emails can SELECT / UPDATE / DELETE.
-- Admin membership is checked against the admin_emails table.
drop policy if exists "admins can read submissions" on public.early_access_submissions;
create policy "admins can read submissions"
  on public.early_access_submissions
  for select
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') in (
      select lower(email) from public.admin_emails
    )
  );

drop policy if exists "admins can update submissions" on public.early_access_submissions;
create policy "admins can update submissions"
  on public.early_access_submissions
  for update
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') in (
      select lower(email) from public.admin_emails
    )
  );

drop policy if exists "admins can delete submissions" on public.early_access_submissions;
create policy "admins can delete submissions"
  on public.early_access_submissions
  for delete
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') in (
      select lower(email) from public.admin_emails
    )
  );

-- ─── contact_messages policies ───────────────────────────────────────────

drop policy if exists "anon can insert messages" on public.contact_messages;
create policy "anon can insert messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins can read messages" on public.contact_messages;
create policy "admins can read messages"
  on public.contact_messages
  for select
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') in (
      select lower(email) from public.admin_emails
    )
  );

drop policy if exists "admins can update messages" on public.contact_messages;
create policy "admins can update messages"
  on public.contact_messages
  for update
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') in (
      select lower(email) from public.admin_emails
    )
  );

-- ===========================================================================
-- 5. Seed your admin email(s)
-- ===========================================================================
-- Replace the example below with YOUR real admin email(s), then run this
-- section again to add more admins. To remove an admin:
--   delete from public.admin_emails where email = 'old@example.com';
--
-- insert into public.admin_emails (email) values
--   ('you@example.com'),
--   ('cofounder@example.com')
-- on conflict (email) do nothing;
