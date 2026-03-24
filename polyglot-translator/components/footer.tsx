"use client"

import { BookOpen, Github, Heart, Mail, Sparkles } from "lucide-react"
import { useLanguage } from "./providers/language-provider"
import Link from "next/link"
import { Button } from "./ui/button"

export function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="relative border-t border-black/5 dark:border-white/5 bg-background py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                  POLYGLOT<span className="text-primary italic">AI</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                  {t("brand_subtext")}
                </span>
              </div>
            </Link>
            <p className="max-w-md text-lg text-muted-foreground font-medium leading-relaxed">
              {t("hero_subtitle")}
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-foreground dark:text-white transition-all hover:bg-primary hover:border-primary hover:text-white hover:shadow-lg hover:shadow-primary/20"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-foreground dark:text-white transition-all hover:bg-primary hover:border-primary hover:text-white hover:shadow-lg hover:shadow-primary/20"
              >
                <Mail className="h-6 w-6" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">
              {t("nav_features").toUpperCase()}
            </h3>
            <ul className="space-y-4">
              {[t("nav_modern"), t("nav_ancient"), t("feature_fast_title"), t("feature_academic_title")].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary dark:hover:text-white flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-black/10 dark:bg-white/10 group-hover:bg-primary transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company/Legal */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-8">
              AETHERDEV
            </h3>
            <div className="glass-card p-6 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 space-y-6 shadow-lg">
              <p className="text-sm font-bold text-foreground dark:text-white leading-tight">
                {t("cta_ready")}
              </p>
              <Button asChild variant="secondary" className="w-full rounded-full font-black text-xs h-10 shadow-xl">
                <Link href="http://localhost:3000">
                  {t("nav_back").toUpperCase()}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 mb-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row text-center sm:text-left">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-black text-foreground dark:text-white tracking-tight">
              © 2026 POLYGLOT AI. {t("footer_text")}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Part of the <span className="text-primary">AetherDev di Abdel</span> Ecosystem
            </p>
          </div>
          <p className="flex items-center gap-2 text-sm font-bold text-muted-foreground px-4 py-2 rounded-full border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
            Fatto con <Heart className="h-4 w-4 text-primary fill-primary animate-pulse" /> {language === "EN" ? "for speakers of all kinds" : "per chi ama le lingue"}
          </p>
        </div>
      </div>
    </footer>
  )
}
