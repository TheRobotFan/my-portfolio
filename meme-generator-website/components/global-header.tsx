"use client"

import { motion } from "framer-motion"
import { Layout, Menu, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useLanguage } from "./providers/language-provider"

export function GlobalHeader({ isSubProject = false }: { isSubProject?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobMenuOpen, setMobMenuOpen] = useState(false)
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const { t, language } = useLanguage()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4" : "py-6"}`}>
            <nav className="container mx-auto px-4">
                <div className={`relative flex items-center justify-between p-2 rounded-full border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl transition-all duration-500 ${isScrolled ? "shadow-xl" : ""}`}>
                    <Link href="http://localhost:3000" className="flex items-center gap-3 px-6 group outline-none">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-background group-hover:rotate-[10deg] transition-transform shadow-xl shadow-primary/20">
                            A
                        </div>
                        <span className="font-bold tracking-tight text-xl hidden lg:block text-slate-900 dark:text-white transition-colors group-hover:text-primary uppercase">
                            AETHER<span className="text-primary italic font-serif ml-0.5">DEV</span>
                            <span className="text-[10px] text-slate-500 dark:text-muted-foreground uppercase tracking-[0.3em] ml-3 opacity-50 font-sans group-hover:opacity-100 transition-opacity">{t("brand_subtext")}</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 pr-2">
                        {isSubProject && (
                            <Link
                                href="http://localhost:3000"
                                className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-primary transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t("nav_back")}
                            </Link>
                        )}
                        <div className="flex items-center gap-1" onMouseLeave={() => setHoveredLink(null)}>
                            <Link
                                href="#projects"
                                onMouseEnter={() => setHoveredLink("Work")}
                                className="relative px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors outline-none"
                            >
                                {hoveredLink === "Work" && (
                                    <motion.div
                                        layoutId="nav-hover"
                                        className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                    />
                                )}
                                {t("nav_work") || "Work"}
                            </Link>
                            <Link
                                href="#about"
                                onMouseEnter={() => setHoveredLink("Philosophy")}
                                className="relative px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors outline-none"
                            >
                                {hoveredLink === "Philosophy" && (
                                    <motion.div
                                        layoutId="nav-hover"
                                        className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full -z-10"
                                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                    />
                                )}
                                {t("nav_philosophy") || "Philosophy"}
                            </Link>
                        </div>
                        <Link href="#contact" className="px-6 py-2 rounded-full text-sm font-medium bg-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all ml-2">Contact Me</Link>
                    </div>

                    <button
                        className="md:hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full mr-2 text-slate-900 dark:text-white"
                        onClick={() => setMobMenuOpen(!mobMenuOpen)}
                    >
                        {mobMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-24 left-4 right-4 p-8 rounded-3xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-3xl md:hidden"
                >
                    <div className="flex flex-col gap-6 text-xl font-bold text-slate-900 dark:text-white">
                        <Link href="#projects" onClick={() => setMobMenuOpen(false)}>Projects</Link>
                        <Link href="#about" onClick={() => setMobMenuOpen(false)}>About</Link>
                        <Link href="#contact" onClick={() => setMobMenuOpen(false)} className="text-primary italic font-serif underline underline-offset-8">Contact Me</Link>
                    </div>
                </motion.div>
            )}
        </header>
    )
}
