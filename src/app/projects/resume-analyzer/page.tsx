import type { Metadata } from "next";
import { ResumeAnalyzer } from "@/components/resume-analyzer/ResumeAnalyzer";

export const metadata: Metadata = {
  title: "AI Resume Analyzer",
  description:
    "Upload your PDF resume for an ATS score, strengths, and actionable improvements powered by Google Gemini.",
};

export default function ResumeAnalyzerPage() {
  return <ResumeAnalyzer />;
}
