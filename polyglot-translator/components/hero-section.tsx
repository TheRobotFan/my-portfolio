"use client"

import { ArrowRight, BookOpen, Languages, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./providers/language-provider"
import { motion } from "framer-motion"

interface HeroSectionProps {
  onStartTranslating: () => void
}

export function HeroSection({ onStartTranslating }: HeroSectionProps) {
  const { t, language } = useLanguage()

  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles className="w-4 h-4" />
            {t("hero_badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-foreground mb-8 tracking-tighter leading-[0.9]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t("hero_title")}{" "}
            <span className="text-primary italic relative">
              {t("hero_title_highlight")}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium"
          >
            {t("hero_subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button size="lg" onClick={onStartTranslating} className="rounded-full h-16 px-10 text-lg font-black shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_50px_rgba(var(--primary),0.5)] transition-all scale-105 hover:scale-110 active:scale-95">
              <Sparkles className="w-6 h-6 mr-2" />
              {t("hero_cta_start")}
            </Button>
            <Button variant="outline" size="lg" onClick={onStartTranslating} className="rounded-full h-16 px-10 text-lg font-black border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-95 text-foreground dark:text-white">
              {t("hero_cta_learn")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-24 grid grid-cols-2 gap-8 sm:grid-cols-4 border-t border-black/5 dark:border-white/5 pt-12"
          >
            {[
              { value: "6+", label: language === "EN" ? "Modern Languages" : "Lingue Moderne" },
              { value: "Latino", label: language === "EN" ? "Ancient Script" : "Lingua Antica" },
              { value: "100%", label: language === "EN" ? "Free Access" : "Gratuito" },
              { value: "∞", label: language === "EN" ? "Possibilities" : "Possibilità" },
            ].map((stat) => (
              <div key={stat.label} className="relative group">
                <div className="text-3xl font-black text-foreground group-hover:text-primary transition-colors duration-500">{stat.value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
