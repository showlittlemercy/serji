/**
 * Server-side PDF text extraction using pdf-parse (Node-friendly).
 * Used by the /api/analyze route — do not import from Client Components.
 */

import pdfParse from "pdf-parse";

/**
 * Extract plain text from a PDF file buffer.
 * @param buffer - Raw PDF bytes as a Node.js Buffer (from File.arrayBuffer())
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("Invalid PDF buffer.");
  }

  // pdf-parse expects a Buffer (or Uint8Array); returns { text, numpages, ... }
  const data = await pdfParse(buffer);

  return (data.text || "").replace(/\s+/g, " ").trim();
}
