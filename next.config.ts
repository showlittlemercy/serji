import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep pdf-parse external so Next does not bundle its Node internals
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
