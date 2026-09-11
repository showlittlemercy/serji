import {
  FileSearch,
  Code2,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** Shared project metadata used by Navbar + landing cards */
export type SerjiProject = {
  slug: string;
  name: string;
  shortName: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export const PROJECTS: SerjiProject[] = [
  {
    slug: "resume-analyzer",
    name: "AI Resume Analyzer",
    shortName: "Resume Analyzer",
    href: "/projects/resume-analyzer",
    description:
      "Upload a resume and get AI-powered feedback on structure, keywords, and impact.",
    icon: FileSearch,
  },
  {
    slug: "code-solver",
    name: "Code Snippet & Error Solver",
    shortName: "Code Solver",
    href: "/projects/code-solver",
    description:
      "Paste broken code or errors and receive clear fixes with explanations.",
    icon: Code2,
  },
  {
    slug: "expense-tracker",
    name: "AI Expense Tracker",
    shortName: "Expense Tracker",
    href: "/projects/expense-tracker",
    description:
      "Log spending in plain language and let AI categorize and summarize your budget.",
    icon: Wallet,
  },
];
