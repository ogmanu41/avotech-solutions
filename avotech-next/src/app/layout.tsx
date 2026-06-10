import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avotech Solutions — Food Processing & Industry Setup",
  description:
    "Expert food processing and value-addition industry setup in Kenya. Project planning, machinery sourcing, factory setup, and market linkage services.",
  keywords: ["food processing", "industry setup", "machinery sourcing", "project management", "Kenya"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body style={{ minHeight: "100vh" }}>{children}</body>
    </html>
  );
}
