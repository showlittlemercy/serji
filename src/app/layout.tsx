import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AnimationProvider } from "@/context/AnimationContext";
import { Navbar } from "@/components/layout/Navbar";
import { MonthlyBackground } from "@/components/background/MonthlyBackground";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SERJI — AI & Developer Tools Hub",
    template: "%s | SERJI",
  },
  description:
    "SERJI is the centralized hub for AI and developer tools — resume analysis, code solving, expense tracking, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${manrope.variable} ${syne.variable} serji-grain relative min-h-full flex flex-col font-sans antialiased`}
      >
        <ThemeProvider>
          <AnimationProvider>
            <MonthlyBackground />
            <Navbar />
            <main className="relative z-10 flex flex-1 flex-col">{children}</main>
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
