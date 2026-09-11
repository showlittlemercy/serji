import type { Metadata } from "next";
import { FileSearch } from "lucide-react";
import { ProjectStub } from "@/components/projects/ProjectStub";

export const metadata: Metadata = {
  title: "AI Resume Analyzer",
};

export default function ResumeAnalyzerPage() {
  return (
    <ProjectStub
      title="AI Resume Analyzer"
      description="Upload a resume and get AI-powered feedback on structure, keywords, and impact. Full tool UI coming next."
      icon={FileSearch}
    />
  );
}
