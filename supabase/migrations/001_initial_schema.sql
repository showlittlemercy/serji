-- =============================================================================
-- SERJI — 001_initial_schema.sql
-- Paste into the Supabase SQL Editor (run migrations in numeric order).
-- Bootstrap: profiles + tools registry + RLS
-- Source of truth: supabase/migrations/
-- =============================================================================

-- Extensions (safe if already enabled)
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: optional user profile linked to auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'SERJI user profiles linked to Supabase Auth';

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- tools: registry of mini-projects hosted on SERJI
-- ---------------------------------------------------------------------------
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  href text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.tools is 'Catalog of SERJI mini-projects / tools';

drop trigger if exists tools_set_updated_at on public.tools;
create trigger tools_set_updated_at
  before update on public.tools
  for each row
  execute function public.set_updated_at();

-- Seed the three upcoming tools
insert into public.tools (slug, name, description, href, sort_order)
values
  (
    'resume-analyzer',
    'AI Resume Analyzer',
    'Upload a resume and get AI-powered feedback on structure, keywords, and impact.',
    '/projects/resume-analyzer',
    1
  ),
  (
    'code-solver',
    'Code Snippet & Error Solver',
    'Paste broken code or errors and receive clear fixes with explanations.',
    '/projects/code-solver',
    2
  ),
  (
    'expense-tracker',
    'AI Expense Tracker',
    'Log spending in plain language and let AI categorize and summarize your budget.',
    '/projects/expense-tracker',
    3
  )
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.tools enable row level security;

-- Profiles: users can read/update their own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Tools: public read of active tools (anon + authenticated)
drop policy if exists "tools_select_active" on public.tools;
create policy "tools_select_active"
  on public.tools for select
  using (is_active = true);
