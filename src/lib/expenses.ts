"use client";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Expense, NewExpense } from "@/lib/expense-types";

const GUEST_KEY = "serji_expense_user_id";

function createGuestId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Resolve a stable user id for expense rows.
 * Prefers Supabase auth session; falls back to a local guest UUID.
 */
export async function ensureExpenseUserId(): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const { data } = await supabase.auth.getSession();
  if (data.session?.user?.id) {
    return data.session.user.id;
  }

  // Optional: anonymous auth if enabled in Supabase dashboard
  try {
    const { data: anon, error } = await supabase.auth.signInAnonymously();
    if (!error && anon.user?.id) {
      return anon.user.id;
    }
  } catch {
    // Anonymous sign-in may be disabled — fall through to guest UUID
  }

  let guest = localStorage.getItem(GUEST_KEY);
  if (!guest) {
    guest = createGuestId();
    localStorage.setItem(GUEST_KEY, guest);
  }
  return guest;
}

export async function fetchExpenses(): Promise<Expense[]> {
  const userId = await ensureExpenseUserId();
  const { data, error } = await supabase
    .from("expenses")
    .select("id, amount, category, description, date, user_id, created_at")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    ...row,
    amount: Number(row.amount),
  })) as Expense[];
}

export async function addExpense(input: NewExpense): Promise<Expense> {
  const userId = await ensureExpenseUserId();
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      amount: input.amount,
      category: input.category,
      description: input.description?.trim() || null,
      date: input.date,
      user_id: userId,
    })
    .select("id, amount, category, description, date, user_id, created_at")
    .single();

  if (error) throw new Error(error.message);

  return { ...data, amount: Number(data.amount) } as Expense;
}

export async function deleteExpense(id: string): Promise<void> {
  const userId = await ensureExpenseUserId();
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}
