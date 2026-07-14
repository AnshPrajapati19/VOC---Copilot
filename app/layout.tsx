import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voice of Customer Copilot — AI-Powered Product Decisions",
  description:
    "Transform thousands of customer reviews into prioritized product decisions using AI. Cluster pain points, surface quotes, detect churn signals, and generate product roadmaps.",
  keywords: [
    "voice of customer",
    "product management",
    "AI copilot",
    "customer reviews",
    "product roadmap",
    "churn detection",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
