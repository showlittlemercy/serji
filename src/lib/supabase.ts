import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client bootstrap for SERJI.
 *
 * Env vars (add to `.env.local`):
 *   NEXT_PUBLIC_SUPABASE_URL=your-project-url
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 *
 * No business logic yet — connection instance only.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Browser-safe Supabase client.
 * Safe to import from Client Components once env vars are set.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

/** Helper to check whether real credentials are configured */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
