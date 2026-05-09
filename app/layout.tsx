import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PTA Fundraising Hub",
  description:
    "A PTA fundraising visibility and coordination hub for campaigns, events, and parent giving links."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
