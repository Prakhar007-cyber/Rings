import type { Metadata, Viewport } from "next";
import { Cormorant, Montserrat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maison Aurelle — Forever, Made Tangible",
  description:
    "The Signature Collection by Maison Aurelle. Gold shaped by precision. Diamonds chosen for brilliance. Haute joaillerie rings crafted for a lifetime.",
};

export const viewport: Viewport = {
  themeColor: "#0b0908",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
