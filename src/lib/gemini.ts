import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  isAnalyzeResult,
  type AnalyzeResult,
} from "@/lib/analyze-types";

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) specialist and senior HR recruiter with 15+ years of experience hiring across tech, product, and business roles.

Analyze the resume text provided by the user. If a portfolio URL is included, factor it into your assessment of presentation and completeness (do not invent what is on the portfolio — only reason about the URL itself and how it complements the resume).

Return ONLY valid JSON (no markdown, no code fences) with this exact shape:
{
  "ats_score": <number 0-100>,
  "strengths": [<3 to 4 short strings>],
  "improvements": [<3 to 5 actionable tips / missing keywords / structure fixes>]
}

Scoring guidance for ats_score:
- 90-100: Exceptional ATS-ready resume (clear structure, strong metrics, relevant keywords)
- 75-89: Strong, minor gaps
- 60-74: Decent but missing keywords, metrics, or clarity
- Below 60: Significant ATS / content issues

Be specific, constructive, and professional. Strengths and improvements must reference concrete resume signals when possible.`;

/**
 * Calls Google Gemini (free-tier friendly) to analyze resume text.
 */
export async function analyzeResumeWithGemini(
  resumeText: string,
  portfolioUrl?: string
): Promise<AnalyzeResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to your .env or .env.local file."
    );
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  });

  const portfolioBlock = portfolioUrl
    ? `\n\nPortfolio URL provided by candidate: ${portfolioUrl}`
    : "\n\nNo portfolio URL was provided.";

  const userPrompt = `Resume text to analyze:\n\n---\n${resumeText.slice(0, 28000)}\n---${portfolioBlock}`;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }],
      },
    ],
  });

  const raw = result.response.text();
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    // Fallback: strip accidental markdown fences
    const cleaned = raw.replace(/```json\s*|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  }

  if (!isAnalyzeResult(parsed)) {
    throw new Error("Gemini returned an unexpected JSON shape.");
  }

  // Clamp score into 0–100
  const ats_score = Math.round(
    Math.min(100, Math.max(0, Number(parsed.ats_score)))
  );

  return {
    ats_score,
    strengths: parsed.strengths.slice(0, 4),
    improvements: parsed.improvements.slice(0, 5),
  };
}
