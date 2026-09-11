import type { Metadata } from "next";
import { ExpenseTracker } from "@/components/expense-tracker/ExpenseTracker";

export const metadata: Metadata = {
  title: "AI Expense Tracker",
  description:
    "Track expenses in Supabase, visualize spending with Recharts, and get Gemini financial insights.",
};

export default function ExpenseTrackerPage() {
  return <ExpenseTracker />;
}
