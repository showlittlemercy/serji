/** Shared types for the AI Resume Analyzer */

export type AnalyzeResult = {
  ats_score: number;
  strengths: string[];
  improvements: string[];
};

export type AnalyzeSuccessResponse = {
  ok: true;
  result: AnalyzeResult;
};

export type AnalyzeErrorResponse = {
  ok: false;
  error: string;
};

export type AnalyzeApiResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;

export function isAnalyzeResult(value: unknown): value is AnalyzeResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.ats_score === "number" &&
    Array.isArray(v.strengths) &&
    Array.isArray(v.improvements) &&
    v.strengths.every((s) => typeof s === "string") &&
    v.improvements.every((s) => typeof s === "string")
  );
}
