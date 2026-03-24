import React from "react"
import type { Metadata } from 'next'
import { Inter, Outfit, Playfair_Display, Crimson_Pro, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GlobalHeader } from "@/components/global-header"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/providers/language-provider"
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const crimsonPro = Crimson_Pro({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-crimson" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Polyglot Translator | AetherDev',
  description: 'Advanced translation engine for modern and ancient languages. Specialized linguistic analysis by AetherDev.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable} ${crimsonPro.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground relative overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="noise" />
            <GlobalHeader isSubProject={true} />
            <main className="min-h-screen relative z-10 pt-16">
              {children}
            </main>
            <Analytics />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
