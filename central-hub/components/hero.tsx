"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Rocket, Sparkles, ChevronRight, ArrowRight } from "lucide-react"
import { useRef, useState } from "react"
import { TextScramble } from "./ui/text-scramble"
import { useLanguage } from "./providers/language-provider"

export function Hero() {
    const { t } = useLanguage()
    const targetRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"],
    })

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -50])

    return (
        <motion.section
            ref={targetRef}
            style={{ opacity, scale, y }}
            className="relative min-h-screen flex items-center justify-center pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden"
        >
            <div className="container relative z-10 mx-auto px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 md:mb-12 shadow-2xl"
                    >
                        <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary animate-pulse" />
                        <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground tracking-[0.2em] md:tracking-[0.3em] uppercase">
                            {t("hero_badge")}
                        </span>
                    </motion.div>

                    <h1 className="text-[2.75rem] leading-[1] md:text-8xl lg:text-[10rem] font-black tracking-[calc(-0.05em)] md:leading-[0.85] mb-8 md:mb-12">
                        <motion.span
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20"
                        >
                            <TextScramble key={t("hero_title")} text={t("hero_title")} delay={800} loop={false} />
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="block font-playfair italic text-primary mt-2"
                        >
                            <TextScramble key={t("hero_title_highlight")} text={t("hero_title_highlight")} delay={1500} loop={false} />
                        </motion.span>
                    </h1>


                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12 md:mb-16 font-light px-4 md:px-0"
                    >
                        {t("hero_subtitle")}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <MagneticButton primary>
                            {t("hero_cta")}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </MagneticButton>

                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">Scroll</span>
            </motion.div>
        </motion.section>
    )
}

function MagneticButton({ children, primary = false }: { children: React.ReactNode, primary?: boolean }) {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const ref = useRef<HTMLButtonElement>(null)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return
        const { clientX, clientY } = e
        const { left, top, width, height } = ref.current.getBoundingClientRect()
        const x = clientX - (left + width / 2)
        const y = clientY - (top + height / 2)
        setPosition({ x: x * 0.3, y: y * 0.3 })
    }

    const reset = () => setPosition({ x: 0, y: 0 })

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={`
                group relative px-6 py-4 md:px-10 md:py-5 rounded-soft font-bold transition-all flex items-center gap-3 overflow-hidden text-sm md:text-base w-full sm:w-auto justify-center
                ${primary
                    ? "bg-primary text-primary-foreground shadow-[0_0_40px_rgba(var(--primary),0.3)] hover:shadow-primary/50"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }
            `}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {children}
        </motion.button>
    )
}
