"use client"

import { motion } from "framer-motion"
import { Briefcase, GraduationCap, Code2, Rocket } from "lucide-react"
import { useLanguage } from "./providers/language-provider"

export function ExperienceTimeline() {
    const { t } = useLanguage()

    const timeline = [
        {
            year: "2026 - Present",
            title: t("exp_1_title"),
            company: "Abdel Digital Engineering",
            description: t("exp_1_desc"),
            icon: Rocket,
        },
        {
            year: "2024 - 2026",
            title: t("exp_2_title"),
            company: "TechNova Solutions",
            description: t("exp_2_desc"),
            icon: Code2,
        },
        {
            year: "2022 - 2024",
            title: t("exp_3_title"),
            company: "Innovate Labs",
            description: t("exp_3_desc"),
            icon: Briefcase,
        },
        {
            year: "2020 - 2022",
            title: t("exp_4_title"),
            company: t("exp_4_company"),
            description: t("exp_4_desc"),
            icon: GraduationCap,
        },
    ]

    return (
        <section className="relative py-40 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-24 space-y-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-4"
                        >
                            <div className="h-[1px] w-12 bg-primary/50" />
                            <span className="text-primary font-mono text-sm uppercase tracking-[0.3em]">{t("exp_section_label")}</span>
                            <div className="h-[1px] w-12 bg-primary/50" />
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight"
                        >
                            {t("exp_section_title")}
                        </motion.h2>
                    </div>

                    <div className="space-y-16 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                        {timeline.map((item, index) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                            >
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:border-primary/50 group-hover:bg-primary/20 transition-colors duration-500 z-10">
                                    <item.icon className="w-4 h-4 text-primary" />
                                </div>

                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] group-hover:border-white/10 transition-all duration-500 group-hover:-translate-y-1">
                                    <div className="flex flex-col gap-2">
                                        <time className="font-mono text-xs uppercase tracking-[0.2em] text-primary/80">
                                            {item.year}
                                        </time>
                                        <h3 className="text-2xl font-bold tracking-tight text-white mb-1">
                                            {item.title}
                                        </h3>
                                        <h4 className="text-sm font-medium text-white/50 mb-4">
                                            {item.company}
                                        </h4>
                                        <p className="text-muted-foreground font-light leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
