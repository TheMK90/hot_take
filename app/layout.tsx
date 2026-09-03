import type { Metadata } from "next";
import { Bodoni_Moda, Barlow_Condensed, Barlow } from "next/font/google";
import { ThemeUserProvider } from "@/components/ThemeUserProvider";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hot Take — Reviews by film fans",
  description: "No critics on staff. Every score here comes from someone who bought a ticket.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoniModa.variable} ${barlowCondensed.variable} ${barlow.variable}`}>
      <body>
        <ThemeUserProvider>{children}</ThemeUserProvider>
      </body>
    </html>
  );
}
