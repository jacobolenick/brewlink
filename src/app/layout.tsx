import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrewLink – Smart Link Analytics",
  description:
    "Create short links, track every click, and grow with powerful analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
