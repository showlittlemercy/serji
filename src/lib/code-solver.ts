import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  isGenerateResult,
  isSolveResult,
  type CodeSolverLanguage,
  type CodeSolverMode,
  type CodeSolverResult,
} from "@/lib/code-solver-types";

const SOLVE_SYSTEM = `You are a senior software engineer and expert debugger.

The user will paste buggy or broken code (and/or an error message) in a specific language.
Identify the root cause, fix the code, and explain the bug briefly.

Return ONLY valid JSON (no markdown, no code fences) with this exact shape:
{
  "fixed_code": "<complete corrected code>",
  "explanation": "<brief, clear explanation of what was wrong and how you fixed it>"
}

Rules:
- Prefer minimal, correct fixes over full rewrites unless necessary.
- Keep the same language and overall intent.
- Do not wrap code in markdown fences inside JSON string values.
- Explanation should be 2–5 sentences, practical, and beginner-friendly.`;

const GENERATE_SYSTEM = `You are a senior software engineer who writes clean, production-minded code snippets.

The user will describe what they want (or paste a rough sketch). Generate an optimized, readable snippet in the requested language.

Return ONLY valid JSON (no markdown, no code fences) with this exact shape:
{
  "code": "<clean optimized code snippet>",
  "usage_example": "<short example showing how to use / call the snippet>"
}

Rules:
- Prefer clarity, correctness, and modern best practices.
- Include brief inline comments only where they add real value.
- Do not wrap code in markdown fences inside JSON string values.
- usage_example should be short and runnable when possible.`;

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to your .env or .env.local file."
    );
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.35,
      responseMimeType: "application/json",
    },
  });
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json\s*|```/g, "").trim();
    return JSON.parse(cleaned);
  }
}

/**
 * Solve buggy code or generate a snippet via Gemini (free tier).
 */
export async function runCodeSolverWithGemini(params: {
  mode: CodeSolverMode;
  language: CodeSolverLanguage;
  input: string;
}): Promise<CodeSolverResult> {
  const { mode, language, input } = params;
  const model = getModel();
  const system = mode === "solve" ? SOLVE_SYSTEM : GENERATE_SYSTEM;

  const userPrompt =
    mode === "solve"
      ? `Language: ${language}\n\nBuggy code / error:\n---\n${input.slice(0, 24000)}\n---`
      : `Language: ${language}\n\nRequest / prompt:\n---\n${input.slice(0, 24000)}\n---`;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `${system}\n\n${userPrompt}` }],
      },
    ],
  });

  const parsed = parseJson(result.response.text());

  if (mode === "solve") {
    if (!isSolveResult(parsed)) {
      throw new Error("Gemini returned an unexpected solve JSON shape.");
    }
    return {
      mode: "solve",
      fixed_code: parsed.fixed_code.trim(),
      explanation: parsed.explanation.trim(),
    };
  }

  if (!isGenerateResult(parsed)) {
    throw new Error("Gemini returned an unexpected generate JSON shape.");
  }

  return {
    mode: "generate",
    code: parsed.code.trim(),
    usage_example: parsed.usage_example.trim(),
  };
}
