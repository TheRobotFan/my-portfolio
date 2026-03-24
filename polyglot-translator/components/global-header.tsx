"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ArrowLeft, Globe, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ModeToggle } from "./mode-toggle"
import { useLanguage } from "./providers/language-provider"
import { Button } from "./ui/button"

export function GlobalHeader({ isSubProject = false }: { isSubProject?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobMenuOpen, setMobMenuOpen] = useState(false)
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const { t, language, setLanguage } = useLanguage()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleLanguage = () => {
        setLanguage(language === "EN" ? "IT" : "EN")
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}>
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`relative flex items-center justify-between p-1.5 rounded-full border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-2xl transition-all duration-500 ${isScrolled ? "shadow-xl" : ""}`}>
                    <Link href="http://localhost:3000" className="flex items-center gap-3 px-4 group">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-black text-white group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black tracking-tighter text-lg leading-none">
                                AETHER<span className="text-primary italic">DEV</span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {t("nav_by")}
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 pr-1">
                        <div className="hidden md:flex items-center gap-1">
                            {isSubProject && (
                                <Link
                                    href="http://localhost:3000"
                                    className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-white/5 transition-all"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    {t("nav_back")}
                                </Link>
                            )}
                            <div className="flex items-center gap-1" onMouseLeave={() => setHoveredLink(null)}>
                                <Link
                                    href="#features"
                                    onMouseEnter={() => setHoveredLink("features")}
                                    className="relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors outline-none"
                                >
                                    {hoveredLink === "features" && (
                                        <motion.div
                                            layoutId="nav-hover"
                                            className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full -z-10"
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                        />
                                    )}
                                    {t("nav_features")}
                                </Link>
                                <Link
                                    href="#"
                                    onMouseEnter={() => setHoveredLink("about")}
                                    className="relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground dark:hover:text-white transition-colors outline-none"
                                >
                                    {hoveredLink === "about" && (
                                        <motion.div
                                            layoutId="nav-hover"
                                            className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full -z-10"
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                        />
                                    )}
                                    {t("nav_about")}
                                </Link>
                            </div>
                        </div>

                        <div className="h-6 w-[1px] bg-white/10 mx-2 hidden md:block" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 rounded-full border border-white/10 glass hover:bg-white/5 transition-all text-[10px] font-black h-9 px-4"
                        >
                            <Globe className="w-3.5 h-3.5 text-primary" />
                            <span>{language}</span>
                        </Button>

                        <div className="hidden sm:block">
                            <ModeToggle />
                        </div>

                        <button
                            className="md:hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-foreground"
                            onClick={() => setMobMenuOpen(!mobMenuOpen)}
                        >
                            {mobMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-24 left-4 right-4 p-8 rounded-3xl bg-white/90 dark:bg-black/90 backdrop-blur-3xl border border-black/5 dark:border-white/10 shadow-3xl md:hidden z-50 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <div className="flex flex-col gap-6 text-xl font-black tracking-tighter relative z-10">
                            <Link href="#features" onClick={() => setMobMenuOpen(false)}>{t("nav_features")}</Link>
                            <Link href="#" onClick={() => setMobMenuOpen(false)}>{t("nav_about")}</Link>
                            <Link href="http://localhost:3000" onClick={() => setMobMenuOpen(false)} className="text-primary italic flex items-center gap-2">
                                <ArrowLeft className="w-5 h-5" />
                                {t("nav_back")}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
