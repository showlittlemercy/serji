# SERJI Supabase migrations

Paste files into the **Supabase SQL Editor** in numeric order.

| File | Purpose |
|------|---------|
| `001_initial_schema.sql` | `profiles`, `tools`, helpers, RLS |
| `002_expense_tracker.sql` | `expenses` table + RLS |

## Rules

1. **Never edit** a migration that was already applied or committed.
2. For any new table, column, policy, index, or relation → add `003_…sql`, `004_…sql`, …
3. Before writing DB logic, scan this folder + app code that queries Supabase.
4. Legacy copies under `/sql` are historical only — **this folder is the source of truth**.
