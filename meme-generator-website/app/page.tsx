"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Zap, Download, Share2, ArrowRight, MousePointer2 } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/providers/language-provider"
import { motion } from "framer-motion"

export default function HomePage() {
  const { t, language } = useLanguage()

  const features = [
    {
      icon: Zap,
      title: t("feature_fast_title"),
      description: t("feature_fast_desc"),
    },
    {
      icon: Download,
      title: t("feature_download_title"),
      description: t("feature_download_desc"),
    },
    {
      icon: Share2,
      title: t("feature_share_title"),
      description: t("feature_share_desc"),
    },
  ]

  const exampleMemes = [
    {
      id: 1,
      topText: "When the code works",
      bottomText: "On the first try",
      bgColor: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    },
    {
      id: 2,
      topText: "Monday morning",
      bottomText: "vs Friday evening",
      bgColor: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    },
    {
      id: 3,
      topText: "Me: going to sleep early",
      bottomText: "Also me at 3 AM",
      bgColor: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
    },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full animate-pulse delay-700" />
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
              <Button asChild size="lg" className="rounded-full h-16 px-10 text-lg font-black shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_50px_rgba(var(--primary),0.5)] transition-all scale-105 hover:scale-110 active:scale-95">
                <Link href="/crea">
                  <Sparkles className="w-6 h-6 mr-2" />
                  {t("hero_cta_start")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full h-16 px-10 text-lg font-black border-white/10 glass hover:bg-white/5 transition-all active:scale-95">
                <Link href="#esempi">
                  {t("hero_cta_examples")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-10 glass-card transition-all hover:scale-105 hover:border-primary/50 group border-white/5">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <feature.icon className="w-8 h-8 transition-transform group-hover:rotate-12" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="esempi" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2
              className="text-4xl md:text-5xl font-black mb-6 tracking-tighter"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {language === "EN" ? "Inspiration Gallery" : "Galleria Ispirazione"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              {language === "EN" ? "Browse our community favorites and start your creative journey." : "Sfoglia i preferiti della community e inizia il tuo viaggio creativo."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exampleMemes.map((meme, i) => (
              <motion.div
                key={meme.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden glass-card border-white/10 group cursor-pointer aspect-square p-2">
                  <div
                    className="w-full h-full rounded-xl p-8 relative flex flex-col items-center justify-between transition-transform duration-700 group-hover:scale-[1.02]"
                    style={{ background: meme.bgColor }}
                  >
                    <p className="text-white text-3xl font-black text-center uppercase tracking-tighter drop-shadow-2xl" style={{ fontFamily: 'Impact, sans-serif' }}>
                      {meme.topText}
                    </p>

                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button asChild size="lg" className="rounded-full font-black shadow-2xl">
                        <Link href="/crea">
                          <MousePointer2 className="w-5 h-5 mr-2" />
                          {t("nav_create")}
                        </Link>
                      </Button>
                    </div>

                    <p className="text-white text-3xl font-black text-center uppercase tracking-tighter drop-shadow-2xl" style={{ fontFamily: 'Impact, sans-serif' }}>
                      {meme.bottomText}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden bg-primary shadow-[0_0_100px_rgba(var(--primary),0.2)]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2
            className="text-4xl md:text-7xl font-black mb-8 tracking-tighter text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {language === "EN" ? "Ready to unleash your creativity?" : "Pronto a scatenare la tua creatività?"}
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
            {t("hero_subtitle")}
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full h-16 px-12 text-xl font-black shadow-2xl hover:bg-white hover:text-primary transition-all active:scale-95">
            <Link href="/crea">
              {t("hero_cta_start")}
              <ArrowRight className="w-6 h-6 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-12">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter leading-none" style={{ fontFamily: 'var(--font-display)' }}>
                  MEME<span className="text-primary italic">FORGE</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
                  {t("brand_subtext")}
                </span>
              </div>
            </div>
            <p className="text-sm font-bold text-muted-foreground tracking-tight">
              © 2026 MEMEFORGE. {t("footer_text")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
