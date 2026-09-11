-- =============================================================================
-- SERJI — 002_expense_tracker.sql
-- Paste into the Supabase SQL Editor AFTER 001_initial_schema.sql
-- Adds the expenses table for the AI Expense Tracker tool.
-- Source of truth: supabase/migrations/
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- expenses: per-user spending ledger
-- user_id stores auth.users.id when signed in, or a stable guest UUID
-- ---------------------------------------------------------------------------
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  amount numeric(12, 2) not null check (amount > 0),
  category text not null,
  description text,
  date date not null default (current_date),
  user_id uuid not null,
  created_at timestamptz not null default now()
);

comment on table public.expenses is 'SERJI expense tracker ledger (amount, category, note, date)';

create index if not exists expenses_user_id_date_idx
  on public.expenses (user_id, date desc);

create index if not exists expenses_user_id_category_idx
  on public.expenses (user_id, category);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.expenses enable row level security;

-- Authenticated users: only their own rows
drop policy if exists "expenses_auth_select_own" on public.expenses;
create policy "expenses_auth_select_own"
  on public.expenses for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "expenses_auth_insert_own" on public.expenses;
create policy "expenses_auth_insert_own"
  on public.expenses for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "expenses_auth_update_own" on public.expenses;
create policy "expenses_auth_update_own"
  on public.expenses for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "expenses_auth_delete_own" on public.expenses;
create policy "expenses_auth_delete_own"
  on public.expenses for delete
  to authenticated
  using (auth.uid() = user_id);

-- Guest / demo mode (anon key + client-side guest UUID filter):
-- Allows the SERJI free-tier demo to CRUD without forcing email auth.
-- Tighten or remove these policies before a production launch.
drop policy if exists "expenses_anon_select" on public.expenses;
create policy "expenses_anon_select"
  on public.expenses for select
  to anon
  using (true);

drop policy if exists "expenses_anon_insert" on public.expenses;
create policy "expenses_anon_insert"
  on public.expenses for insert
  to anon
  with check (true);

drop policy if exists "expenses_anon_delete" on public.expenses;
create policy "expenses_anon_delete"
  on public.expenses for delete
  to anon
  using (true);
