import type { Config } from "tailwindcss";

/**
 * SERJI color palette reference.
 *
 * Tailwind CSS v4 reads design tokens from `src/app/globals.css` via `@theme`.
 * This file documents the official brand colors for the project.
 *
 * Primary Accent:      #6D0808  (Dark Red)      → primary
 * Deep Background:     #2D0000  (Very Dark Red) → deep / dark-mode bg
 * Neutral Muted:       #757D6F  (Olive Gray)    → muted
 * Light Background:    #EEEAD7  (Beige)         → light / light-mode bg
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6D0808",
        deep: "#2D0000",
        muted: "#757D6F",
        light: "#EEEAD7",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
