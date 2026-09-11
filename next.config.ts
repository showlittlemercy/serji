import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep pdfjs-dist out of the Turbopack/webpack bundle for API routes
  serverExternalPackages: ["pdfjs-dist"],
};

export default nextConfig;
