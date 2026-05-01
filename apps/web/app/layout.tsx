import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PocketBase Portfolio",
  description: "A web, SSH TUI, and PocketBase portfolio monorepo.",
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
