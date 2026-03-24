import React from "react"
import type { Metadata, Viewport } from 'next'
import { Nunito, Fredoka, Outfit, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/providers/language-provider'
import { GlobalHeader } from '@/components/global-header'
import './globals.css'

const nunito = Nunito({ subsets: ["latin"], variable: '--font-nunito' });
const fredoka = Fredoka({ subsets: ["latin"], variable: '--font-fredoka' });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: 'MemeForge - Crea meme in pochi secondi',
  description: 'Crea, personalizza e scarica meme divertenti in modo semplice e veloce con MemeForge',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e3a5f' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" suppressHydrationWarning className={`${nunito.variable} ${fredoka.variable} ${outfit.variable} ${playfair.variable} dark`}>
      <body className="font-sans antialiased bg-background text-foreground relative">
        <div className="noise" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <GlobalHeader isSubProject={true} />
            <main className="pt-24 min-h-screen">
              {children}
            </main>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
