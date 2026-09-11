# SERJI

Centralized hub for AI & developer tools — built with **Next.js (App Router)**, **Tailwind CSS**, **Framer Motion**, **Lucide React**, and **Supabase** (free tier).

## Quick start

```bash
cd serji
cp .env.example .env.local   # add your Supabase URL + anon key
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Color palette

| Token    | Hex       | Role                          |
|----------|-----------|-------------------------------|
| Primary  | `#6D0808` | Accent / CTAs                 |
| Deep     | `#2D0000` | Dark-mode background          |
| Muted    | `#757D6F` | Secondary text / olive gray   |
| Light    | `#EEEAD7` | Light-mode background         |

Tokens live in `src/app/globals.css` (`@theme`) and are documented in `tailwind.config.ts`.

## Features (current)

- Light / dark mode via `next-themes`
- Sticky navbar with project links + theme toggle
- Monthly background animations (12 Framer Motion scenes)
- Landing hero + interactive project cards
- Stub routes for the three upcoming tools
- Supabase client scaffold in `src/lib/supabase.ts`

## Project routes

| Tool                         | Path                         |
|------------------------------|------------------------------|
| AI Resume Analyzer           | `/projects/resume-analyzer`  |
| Code Snippet & Error Solver  | `/projects/code-solver`      |
| AI Expense Tracker           | `/projects/expense-tracker`  |

## Supabase SQL

Copy/paste files from `supabase/migrations/` into the Supabase SQL Editor **in order**:

1. `supabase/migrations/001_initial_schema.sql` — profiles, tools registry, RLS
2. `supabase/migrations/002_expense_tracker.sql` — expenses table + RLS

> **Rule:** never edit prior migration files. After every database change, add a new numbered file (`003_…sql`, `004_…sql`, …). Legacy copies under `/sql` are historical only.

## Folder map

```
serji/
├── supabase/migrations/          # Canonical paste-into-Supabase migrations
├── sql/                          # Legacy copies only (do not edit / do not extend)
├── src/
│   ├── app/                      # App Router pages
│   ├── components/
│   │   ├── background/           # MonthlyBackground (12 months)
│   │   ├── home/                 # Hero + project cards
│   │   ├── layout/               # Navbar
│   │   ├── projects/             # Project stub UI
│   │   └── providers/            # ThemeProvider + ThemeToggle
│   └── lib/                      # supabase.ts, projects.ts
├── .env.example
└── tailwind.config.ts            # Palette reference
```
