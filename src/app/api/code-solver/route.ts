import { NextResponse } from "next/server";
import { runCodeSolverWithGemini } from "@/lib/code-solver";
import {
  CODE_SOLVER_LANGUAGES,
  type CodeSolverApiResponse,
  type CodeSolverLanguage,
  type CodeSolverMode,
} from "@/lib/code-solver-types";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  mode?: string;
  language?: string;
  input?: string;
};

/**
 * POST /api/code-solver
 * JSON body: { mode: "solve" | "generate", language: string, input: string }
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const mode = body.mode as CodeSolverMode | undefined;
    const language = body.language as CodeSolverLanguage | undefined;
    const input = typeof body.input === "string" ? body.input.trim() : "";

    if (mode !== "solve" && mode !== "generate") {
      return NextResponse.json<CodeSolverApiResponse>(
        { ok: false, error: 'mode must be "solve" or "generate".' },
        { status: 400 }
      );
    }

    if (!language || !CODE_SOLVER_LANGUAGES.includes(language)) {
      return NextResponse.json<CodeSolverApiResponse>(
        { ok: false, error: "Please select a valid programming language." },
        { status: 400 }
      );
    }

    if (!input || input.length < 3) {
      return NextResponse.json<CodeSolverApiResponse>(
        {
          ok: false,
          error:
            mode === "solve"
              ? "Paste buggy code or an error message first."
              : "Describe the snippet you want generated.",
        },
        { status: 400 }
      );
    }

    if (input.length > 24000) {
      return NextResponse.json<CodeSolverApiResponse>(
        { ok: false, error: "Input is too long. Please shorten it." },
        { status: 400 }
      );
    }

    const result = await runCodeSolverWithGemini({ mode, language, input });
    return NextResponse.json<CodeSolverApiResponse>({ ok: true, result });
  } catch (err) {
    console.error("[/api/code-solver]", err);
    const message =
      err instanceof Error ? err.message : "Code solver failed. Please try again.";
    return NextResponse.json<CodeSolverApiResponse>(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
