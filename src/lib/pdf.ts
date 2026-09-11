/**
 * Server-side PDF text extraction using pdfjs-dist (free / open-source).
 * Used by the /api/analyze route — do not import from Client Components.
 */

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Legacy build works more reliably in Node / Next.js API routes
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const data = new Uint8Array(buffer);
  const loadingTask = pdfjs.getDocument({
    data,
    useSystemFonts: true,
    isEvalSupported: false,
    // Keep extraction lightweight for serverless
    disableFontFace: true,
  });

  const doc = await loadingTask.promise;
  const pages: string[] = [];

  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? String(item.str) : ""))
      .filter(Boolean)
      .join(" ");
    pages.push(line);
  }

  const text = pages.join("\n\n").replace(/\s+/g, " ").trim();
  return text;
}
