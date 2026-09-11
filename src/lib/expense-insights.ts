import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  isExpenseInsights,
  type Expense,
  type ExpenseInsights,
} from "@/lib/expense-types";

const SYSTEM_PROMPT = `You are a senior Data Scientist and personal Financial Advisor.

You will receive a JSON summary of a user's expense transactions.
Analyze spending patterns, flag category anomalies / outliers, and produce a 3-point predictive analysis.

Return ONLY valid JSON (no markdown, no code fences) with this exact shape:
{
  "summary": "<2-4 sentence executive overview of overall spending>",
  "anomalies": ["<anomaly or risk finding>", "..."],
  "predictions": [
    "<prediction 1 — e.g. spending velocity / projected overspend>",
    "<prediction 2>",
    "<prediction 3>"
  ]
}

Rules:
- predictions MUST contain exactly 3 strings.
- Be specific with categories and approximate percentages when the data supports it.
- If data is sparse, still give cautious, practical guidance (do not invent fake amounts).
- Tone: clear, actionable, non-judgmental.`;

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to your .env or .env.local file."
    );
  }
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.45,
      responseMimeType: "application/json",
    },
  });
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return JSON.parse(raw.replace(/```json\s*|```/g, "").trim());
  }
}

/** Build a compact analytics-friendly payload for Gemini */
export function buildExpenseSummaryPayload(expenses: Expense[]) {
  const byCategory: Record<string, { total: number; count: number }> = {};
  let grandTotal = 0;

  for (const e of expenses) {
    const amount = Number(e.amount);
    grandTotal += amount;
    const bucket = byCategory[e.category] ?? { total: 0, count: 0 };
    bucket.total += amount;
    bucket.count += 1;
    byCategory[e.category] = bucket;
  }

  const categoryBreakdown = Object.entries(byCategory)
    .map(([category, v]) => ({
      category,
      total: Math.round(v.total * 100) / 100,
      count: v.count,
      share_pct:
        grandTotal > 0
          ? Math.round((v.total / grandTotal) * 1000) / 10
          : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const recent = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 40)
    .map((e) => ({
      amount: Number(e.amount),
      category: e.category,
      date: e.date,
      description: e.description,
    }));

  return {
    transaction_count: expenses.length,
    grand_total: Math.round(grandTotal * 100) / 100,
    category_breakdown: categoryBreakdown,
    recent_transactions: recent,
    currency_note: "Amounts are in the user's local currency units.",
  };
}

export async function generateExpenseInsightsWithGemini(
  expenses: Expense[]
): Promise<ExpenseInsights> {
  if (expenses.length === 0) {
    throw new Error("Add at least one expense before generating insights.");
  }

  const model = getModel();
  const payload = buildExpenseSummaryPayload(expenses);

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nExpense data JSON:\n${JSON.stringify(payload)}`,
          },
        ],
      },
    ],
  });

  const parsed = parseJson(result.response.text());
  if (!isExpenseInsights(parsed)) {
    throw new Error("Gemini returned an unexpected insights JSON shape.");
  }

  return {
    summary: parsed.summary.trim(),
    anomalies: parsed.anomalies.map((a) => a.trim()).filter(Boolean).slice(0, 5),
    predictions: parsed.predictions.map((p) => p.trim()).filter(Boolean).slice(0, 3),
  };
}
