import { NextResponse } from "next/server";
import { generateExpenseInsightsWithGemini } from "@/lib/expense-insights";
import type {
  Expense,
  ExpenseInsightsApiResponse,
} from "@/lib/expense-types";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  expenses?: Expense[];
};

/**
 * POST /api/expense-insights
 * Body: { expenses: Expense[] } — client sends the user's fetched ledger
 * so Gemini can analyze patterns without a service-role key.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const expenses = Array.isArray(body.expenses) ? body.expenses : [];

    if (expenses.length === 0) {
      return NextResponse.json<ExpenseInsightsApiResponse>(
        { ok: false, error: "No expenses to analyze. Add some transactions first." },
        { status: 400 }
      );
    }

    // Light validation / sanitization
    const cleaned: Expense[] = expenses
      .filter(
        (e) =>
          e &&
          typeof e.amount === "number" &&
          typeof e.category === "string" &&
          typeof e.date === "string"
      )
      .slice(0, 500)
      .map((e) => ({
        id: String(e.id ?? ""),
        amount: Number(e.amount),
        category: String(e.category).slice(0, 64),
        description:
          e.description == null ? null : String(e.description).slice(0, 280),
        date: String(e.date).slice(0, 32),
        user_id: String(e.user_id ?? ""),
      }));

    const insights = await generateExpenseInsightsWithGemini(cleaned);
    return NextResponse.json<ExpenseInsightsApiResponse>({
      ok: true,
      insights,
    });
  } catch (err) {
    console.error("[/api/expense-insights]", err);
    const message =
      err instanceof Error
        ? err.message
        : "Failed to generate insights. Please try again.";
    return NextResponse.json<ExpenseInsightsApiResponse>(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
