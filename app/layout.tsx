import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cinzel, Cormorant_Garamond, Orbitron } from "next/font/google";
import "@livekit/components-styles";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-tech",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Atheena Oracle Voice Agent",
  description:
    "Atheena, Eternal Oracle of Wisdom, Strategic Brilliance, and Divine Insight — cinematic LiveKit voice companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cinzel.variable} ${cormorant.variable} ${orbitron.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
