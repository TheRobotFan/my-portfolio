"use client"

import Link from "next/link"
import { Sparkles, Menu, X, ArrowLeft, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"
import { useLanguage } from "./providers/language-provider"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "EN" ? "IT" : "EN")
  }

  return (
    <nav className="sticky top-0 z-40 w-full bg-background/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-transform group-hover:rotate-12">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                  {t("brand_name")}<span className="text-primary italic">{t("brand_highlight")}</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium opacity-70">
                  {t("brand_subtext")}
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 rounded-full text-sm font-semibold text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all">
                Home
              </Link>
              <Link href="/crea" className="px-4 py-2 rounded-full text-sm font-semibold text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all">
                {t("nav_create")}
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20"
            >
              <Globe className="w-4 h-4" />
              {language}
            </button>
            <ThemeToggle />
            <Button asChild size="lg" className="rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
              <Link href="/crea">
                <Sparkles className="w-4 h-4 mr-2" />
                {t("hero_cta_start")}
              </Link>
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full text-muted-foreground hover:text-primary"
            >
              <span className="text-xs font-bold tracking-tighter">{language}</span>
            </button>
            <ThemeToggle />
            <button
              className="p-2 text-foreground/70"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="flex flex-col gap-4 py-6">
                <Link
                  href="/"
                  className="text-lg font-bold text-foreground/70 hover:text-primary px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/crea"
                  className="text-lg font-bold text-foreground/70 hover:text-primary px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav_create")}
                </Link>
                <Button asChild size="lg" className="rounded-full font-bold w-full mt-2">
                  <Link href="/crea" onClick={() => setIsMenuOpen(false)}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("hero_cta_start")}
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
