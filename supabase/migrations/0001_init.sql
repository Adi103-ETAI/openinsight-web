-- OpenInsight validation schema
-- Run this in Supabase SQL Editor, OR via: supabase db push
-- This migration creates the tables, indexes, and RLS policies for the
-- early-access validation backend.

-- ===========================================================================
-- 1. early_access_submissions
-- ===========================================================================
create table if not exists public.early_access_submissions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  full_name       text not null,
  email           text not null,
  phone           text,
  persona         text not null check (persona in ('doctor','student','professional')),
  specialty       text,
  other_specialty text,
  institution     text,
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
-- 3. Row-Level Security
-- ===========================================================================
-- Enable RLS on both tables
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
-- The admin email allowlist is stored as a comma-separated setting; we check
-- membership via auth.jwt() ->> 'email'.
drop policy if exists "admins can read submissions" on public.early_access_submissions;
create policy "admins can read submissions"
  on public.early_access_submissions
  for select
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') = any (
      select trim(lower(x))
      from unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as x
    )
  );

drop policy if exists "admins can update submissions" on public.early_access_submissions;
create policy "admins can update submissions"
  on public.early_access_submissions
  for update
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') = any (
      select trim(lower(x))
      from unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as x
    )
  );

drop policy if exists "admins can delete submissions" on public.early_access_submissions;
create policy "admins can delete submissions"
  on public.early_access_submissions
  for delete
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') = any (
      select trim(lower(x))
      from unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as x
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
    lower(auth.jwt() ->> 'email') = any (
      select trim(lower(x))
      from unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as x
    )
  );

drop policy if exists "admins can update messages" on public.contact_messages;
create policy "admins can update messages"
  on public.contact_messages
  for update
  to authenticated
  using (
    lower(auth.jwt() ->> 'email') = any (
      select trim(lower(x))
      from unnest(string_to_array(current_setting('app.admin_emails', true), ',')) as x
    )
  );

-- ===========================================================================
-- 4. Admin emails setting
-- ===========================================================================
-- Set this AFTER running the migration, replacing with your real admin emails:
--   alter database postgres set app.admin_emails = 'you@example.com,cofounder@example.com';
-- (This can also be set via Supabase Dashboard → Database → Settings)
