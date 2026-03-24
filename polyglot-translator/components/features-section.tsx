"use client"

import { BookOpen, GraduationCap, Languages, Scroll, Sparkles, Table, Zap } from "lucide-react"
import { useLanguage } from "./providers/language-provider"
import { motion } from "framer-motion"
import { Card } from "./ui/card"

export function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Zap,
      title: t("feature_fast_title"),
      description: t("feature_fast_desc"),
      color: "text-blue-500",
    },
    {
      icon: GraduationCap,
      title: t("feature_academic_title"),
      description: t("feature_academic_desc"),
      color: "text-amber-500",
    },
    {
      icon: Sparkles,
      title: t("feature_responsive_title"),
      description: t("feature_responsive_desc"),
      color: "text-emerald-500",
    },
  ]

  return (
    <section id="features" className="py-32 relative border-y border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4"
          >
            AetherDev Ecosystem
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tighter"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t("features_title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            {t("features_subtitle")}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-10 glass-card transition-all hover:scale-105 hover:border-primary/50 group border-black/5 dark:border-white/5 bg-white/70 dark:bg-white/5 relative overflow-hidden shadow-lg">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className={`w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl border border-black/5 dark:border-white/5`}>
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
  )
}
