import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import { ProjectStub } from "@/components/projects/ProjectStub";

export const metadata: Metadata = {
  title: "Code Snippet & Error Solver",
};

export default function CodeSolverPage() {
  return (
    <ProjectStub
      title="Code Snippet & Error Solver"
      description="Paste broken code or errors and receive clear fixes with explanations. Full tool UI coming next."
      icon={Code2}
    />
  );
}
