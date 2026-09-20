import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fortnite Player Lookup",
  description: "Open Fortnite Tracker profiles by Epic, Xbox, PlayStation, or Epic Account ID.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
