import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { GlobalHeader } from "@/components/global-header";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ContactProvider } from "@/components/providers/contact-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "AetherDev di Abdel | Creative Engineer",
  description: "AetherDev di Abdel - Ultra-Premium Digital Engineering & High-End Design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable} dark`}>
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden cursor-none">
        <CustomCursor />
        <SmoothScroll>
          <LanguageProvider>
            <ContactProvider>
              <div className="noise" />
              <GlobalHeader />
              <main className="relative z-10">{children}</main>
            </ContactProvider>
          </LanguageProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
