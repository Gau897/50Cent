import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RiskRoute — Find the Safest Route, Not Just the Fastest",
  description: "Safety-first navigation engine powered by real-time risk scoring, environmental telemetry, and historical crash data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B1114] text-slate-100 antialiased min-h-screen selection:bg-[#10B981] selection:text-white">
        {children}
      </body>
    </html>
  );
}
