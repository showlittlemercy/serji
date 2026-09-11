/** Shared types for the Smart Code Snippet & Error Solver */

export type CodeSolverMode = "solve" | "generate";

export type CodeSolverLanguage =
  | "Python"
  | "JavaScript"
  | "TypeScript"
  | "SQL"
  | "C++"
  | "Java"
  | "Go"
  | "Rust"
  | "PHP"
  | "HTML/CSS";

export const CODE_SOLVER_LANGUAGES: CodeSolverLanguage[] = [
  "Python",
  "JavaScript",
  "TypeScript",
  "SQL",
  "C++",
  "Java",
  "Go",
  "Rust",
  "PHP",
  "HTML/CSS",
];

export type SolveResult = {
  mode: "solve";
  fixed_code: string;
  explanation: string;
};

export type GenerateResult = {
  mode: "generate";
  code: string;
  usage_example: string;
};

export type CodeSolverResult = SolveResult | GenerateResult;

export type CodeSolverSuccessResponse = {
  ok: true;
  result: CodeSolverResult;
};

export type CodeSolverErrorResponse = {
  ok: false;
  error: string;
};

export type CodeSolverApiResponse =
  | CodeSolverSuccessResponse
  | CodeSolverErrorResponse;

export function isSolveResult(value: unknown): value is Omit<SolveResult, "mode"> {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.fixed_code === "string" && typeof v.explanation === "string";
}

export function isGenerateResult(
  value: unknown
): value is Omit<GenerateResult, "mode"> {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.code === "string" && typeof v.usage_example === "string";
}

/** Map UI language label → prism language id */
export function languageToPrismId(language: CodeSolverLanguage): string {
  const map: Record<CodeSolverLanguage, string> = {
    Python: "python",
    JavaScript: "javascript",
    TypeScript: "typescript",
    SQL: "sql",
    "C++": "cpp",
    Java: "java",
    Go: "go",
    Rust: "rust",
    PHP: "php",
    "HTML/CSS": "markup",
  };
  return map[language] ?? "javascript";
}
