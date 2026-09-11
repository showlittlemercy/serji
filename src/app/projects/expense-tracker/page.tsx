import type { Metadata } from "next";
import { Wallet } from "lucide-react";
import { ProjectStub } from "@/components/projects/ProjectStub";

export const metadata: Metadata = {
  title: "AI Expense Tracker",
};

export default function ExpenseTrackerPage() {
  return (
    <ProjectStub
      title="AI Expense Tracker"
      description="Log spending in plain language and let AI categorize and summarize your budget. Full tool UI coming next."
      icon={Wallet}
    />
  );
}
