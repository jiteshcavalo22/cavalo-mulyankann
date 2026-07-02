import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Cavalo Moolyankann — India's #1 Truck Inspection Platform",
  description:
    "Get certified truck inspections across 200+ Indian cities. 150+ point checklist, WhatsApp reports, GVW-based pricing. Book in 60 seconds.",
  keywords: "truck inspection, vehicle valuation, GVW, Cavalo, India, certified inspector",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased">{children}</body>
    </html>
  );
}
