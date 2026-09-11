"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  EXPENSE_CATEGORIES,
  aggregateByCategory,
  type Expense,
  type ExpenseCategory,
  type ExpenseInsights,
  type ExpenseInsightsApiResponse,
} from "@/lib/expense-types";
import {
  addExpense,
  deleteExpense,
  fetchExpenses,
} from "@/lib/expenses";
import { isSupabaseConfigured } from "@/lib/supabase";
import { CategoryDonut } from "@/components/expense-tracker/CategoryDonut";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function formatMoney(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * AI Expense Tracker dashboard — CRUD + donut + Gemini insights.
 */
export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<ExpenseInsights | null>(null);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");

  const configured = isSupabaseConfigured();

  const load = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      setError(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then run supabase/migrations/002_expense_tracker.sql."
      );
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchExpenses();
      setExpenses(rows);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load expenses. Did you run supabase/migrations/002_expense_tracker.sql?"
      );
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    void load();
  }, [load]);

  const categoryData = useMemo(
    () => aggregateByCategory(expenses),
    [expenses]
  );

  const totalSpend = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [expenses]
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await addExpense({
        amount: value,
        category,
        description: note,
        date,
      });
      setExpenses((prev) => [created, ...prev]);
      setAmount("");
      setNote("");
      setDate(todayISO());
      setInsights(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add expense.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((row) => row.id !== id));
      setInsights(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete expense.");
    }
  }

  async function handleInsights() {
    if (expenses.length === 0) {
      setError("Add at least one expense before generating insights.");
      return;
    }

    setInsightsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/expense-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses }),
      });
      const data = (await res.json()) as ExpenseInsightsApiResponse;
      if (!data.ok) {
        setError(data.error);
        return;
      }
      setInsights(data.insights);
    } catch {
      setError("Network error while generating insights.");
    } finally {
      setInsightsLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            AI Expense Tracker
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-fg sm:text-base">
            Log spending, visualize categories, and get Gemini-powered financial
            insights.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface-elevated/70 px-5 py-3 dark:bg-surface/70">
          <p className="text-xs uppercase tracking-wide text-muted-fg">
            Total tracked
          </p>
          <p className="font-display text-2xl font-semibold text-primary">
            {formatMoney(totalSpend)}
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-5 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          {error}
        </p>
      )}

      {/* Form + transactions */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Add form */}
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-border bg-surface-elevated/70 p-5 dark:bg-surface/70 sm:p-6"
        >
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Add expense
          </h2>

          <div className="space-y-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-foreground">Amount</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-border bg-background/70 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-foreground">
                Category
              </span>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ExpenseCategory)
                }
                className="w-full rounded-xl border border-border bg-background/70 px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-foreground">Date</span>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-background/70 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-foreground">
                Note{" "}
                <span className="font-normal text-muted-fg">(optional)</span>
              </span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Lunch with team, Uber ride…"
                maxLength={280}
                className="w-full rounded-xl border border-border bg-background/70 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>

            <button
              type="submit"
              disabled={saving || !configured}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-deep disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-primary/90"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add expense
            </button>
          </div>
        </form>

        {/* Recent list */}
        <section className="rounded-2xl border border-border bg-surface-elevated/70 p-5 dark:bg-surface/70 sm:p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Recent transactions
          </h2>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-fg">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Loading…
            </div>
          ) : expenses.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-fg">
              No expenses yet. Add your first transaction.
            </p>
          ) : (
            <ul className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {expenses.map((row) => (
                  <motion.li
                    key={row.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {row.category}
                        {row.description ? (
                          <span className="font-normal text-muted-fg">
                            {" "}
                            · {row.description}
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-fg">{row.date}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-semibold text-primary">
                        {formatMoney(Number(row.amount))}
                      </span>
                      <button
                        type="button"
                        aria-label="Delete expense"
                        onClick={() => void handleDelete(row.id)}
                        className="rounded-lg p-1.5 text-muted-fg transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>
      </div>

      {/* Chart + insights CTA */}
      <div className="mt-8 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Spending by category
          </h2>
          <button
            type="button"
            disabled={insightsLoading || expenses.length === 0}
            onClick={() => void handleInsights()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-elevated/80 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:bg-surface/80"
          >
            {insightsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-primary" />
            )}
            Generate AI Financial Insights
          </button>
        </div>

        <CategoryDonut data={categoryData} />

        <AnimatePresence>
          {insights && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <h3 className="font-display text-base font-semibold">
                    Executive summary
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {insights.summary}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface-elevated/70 p-5 dark:bg-surface/70">
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    <AlertTriangle className="h-4 w-4" />
                    <h3 className="font-display text-base font-semibold text-foreground">
                      Anomalies &amp; risks
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {insights.anomalies.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl border border-border/80 bg-background/50 px-3 py-2.5 text-sm leading-relaxed text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-border bg-surface-elevated/70 p-5 dark:bg-surface/70">
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    <TrendingUp className="h-4 w-4" />
                    <h3 className="font-display text-base font-semibold text-foreground">
                      3-point predictions
                    </h3>
                  </div>
                  <ol className="space-y-2">
                    {insights.predictions.slice(0, 3).map((item, i) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-xl border border-border/80 bg-background/50 px-3 py-2.5 text-sm leading-relaxed text-foreground"
                      >
                        <span className="font-display font-bold text-primary">
                          {i + 1}.
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
