import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

const instrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Basktre",
  description: "AI API calls, smarter and cheaper."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} font-[var(--font-geist)]`}
      >
        <Navbar />
        <main className="pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
