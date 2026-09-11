/** Expense Tracker shared types & constants */

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Travel",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string; // YYYY-MM-DD
  user_id: string;
  created_at?: string;
};

export type NewExpense = {
  amount: number;
  category: string;
  description?: string;
  date: string;
};

export type ExpenseInsights = {
  summary: string;
  anomalies: string[];
  predictions: [string, string, string] | string[];
};

export type ExpenseInsightsSuccess = {
  ok: true;
  insights: ExpenseInsights;
};

export type ExpenseInsightsError = {
  ok: false;
  error: string;
};

export type ExpenseInsightsApiResponse =
  | ExpenseInsightsSuccess
  | ExpenseInsightsError;

export function isExpenseInsights(value: unknown): value is ExpenseInsights {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.summary === "string" &&
    Array.isArray(v.anomalies) &&
    Array.isArray(v.predictions) &&
    v.anomalies.every((a) => typeof a === "string") &&
    v.predictions.every((p) => typeof p === "string") &&
    v.predictions.length >= 3
  );
}

/** Chart-ready aggregation */
export type CategoryTotal = {
  category: string;
  total: number;
};

export function aggregateByCategory(expenses: Expense[]): CategoryTotal[] {
  const map = new Map<string, number>();
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + Number(e.amount));
  }
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total: Math.round(total * 100) / 100 }))
    .sort((a, b) => b.total - a.total);
}
