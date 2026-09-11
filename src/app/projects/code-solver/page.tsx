import type { Metadata } from "next";
import { CodeSolver } from "@/components/code-solver/CodeSolver";

export const metadata: Metadata = {
  title: "Code Snippet & Error Solver",
  description:
    "Paste buggy code or describe a snippet — get AI fixes, explanations, and clean examples powered by Gemini.",
};

export default function CodeSolverPage() {
  return <CodeSolver />;
}
