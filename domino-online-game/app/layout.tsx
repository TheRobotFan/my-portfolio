import type { Metadata } from 'next'
import { Outfit, Inter, Playfair_Display } from 'next/font/google'
import { GlobalHeader } from '@/components/global-header'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/hooks/use-auth'
import { ReconnectingOverlay } from '@/components/network/reconnecting-overlay'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: 'Dominion: Elite Domino | Competitive Logic',
  description: 'The definitive domino experience, part of the Abdel portfolio ecosystem.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${playfair.variable} dark`} suppressHydrationWarning>
      <body className="antialiased font-sans bg-background text-foreground relative">
        <div className="noise" />
        <GlobalHeader isSubProject={true} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
        >
          <AuthProvider>
            <main className="min-h-screen pt-24">
              {children}
              <ReconnectingOverlay />
            </main>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
