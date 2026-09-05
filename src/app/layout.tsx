import type { Metadata } from "next";
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { ServicesMarquee } from "@/components/ServicesMarquee";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Byond — Strategy, Cinema & Digital Craft",
  description:
    "Cairo-born studio crafting narratives that outlive the moment. Digital solutions, performance marketing, personal branding, business consultation, and video production.",
  openGraph: {
    title: "Byond — Strategy, Cinema & Digital Craft",
    description:
      "Born in Cairo. Built for the world. Premium media and digital studio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${greatVibes.variable}`}
    >
      <body>
        <SmoothScroll>
          <CustomCursor />
          <div className="grain-overlay" aria-hidden="true" />
          <ServicesMarquee />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
