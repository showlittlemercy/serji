import { NextResponse } from "next/server";
import { extractTextFromPdf } from "@/lib/pdf";
import { analyzeResumeWithGemini } from "@/lib/gemini";
import type { AnalyzeApiResponse } from "@/lib/analyze-types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * POST /api/analyze
 * multipart/form-data:
 *   - file: PDF resume (required)
 *   - portfolioUrl: optional string
 */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const portfolioRaw = form.get("portfolioUrl");

    if (!(file instanceof File)) {
      return NextResponse.json<AnalyzeApiResponse>(
        { ok: false, error: "Please upload a PDF resume." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json<AnalyzeApiResponse>(
        { ok: false, error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json<AnalyzeApiResponse>(
        { ok: false, error: "File is too large. Max size is 5 MB." },
        { status: 400 }
      );
    }

    const portfolioUrl =
      typeof portfolioRaw === "string" && portfolioRaw.trim()
        ? portfolioRaw.trim()
        : undefined;

    if (portfolioUrl) {
      try {
        // Basic URL validation
        // eslint-disable-next-line no-new
        new URL(portfolioUrl);
      } catch {
        return NextResponse.json<AnalyzeApiResponse>(
          { ok: false, error: "Portfolio URL looks invalid." },
          { status: 400 }
        );
      }
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await extractTextFromPdf(buffer);

    if (!resumeText || resumeText.length < 40) {
      return NextResponse.json<AnalyzeApiResponse>(
        {
          ok: false,
          error:
            "Could not extract enough text from this PDF. Try a text-based (non-scanned) resume.",
        },
        { status: 422 }
      );
    }

    const result = await analyzeResumeWithGemini(resumeText, portfolioUrl);

    return NextResponse.json<AnalyzeApiResponse>({ ok: true, result });
  } catch (err) {
    console.error("[/api/analyze]", err);
    const message =
      err instanceof Error ? err.message : "Analysis failed. Please try again.";
    return NextResponse.json<AnalyzeApiResponse>(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
