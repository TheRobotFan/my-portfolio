"use client"

import { motion } from "framer-motion"
import { Layout, Menu, X, ArrowLeft, Github, Linkedin, Twitter, Globe } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useContact } from "./providers/contact-provider"
import { useLanguage } from "./providers/language-provider"

export function GlobalHeader({ isSubProject = false }: { isSubProject?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobMenuOpen, setMobMenuOpen] = useState(false)
    const [hoveredLink, setHoveredLink] = useState<string | null>(null)
    const { openContact } = useContact()
    const { language, setLanguage, t } = useLanguage()

    const navLinks = [
        { name: t("nav_work"), href: "#projects" },
        { name: t("nav_philosophy"), href: "#about" },
    ]

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled ? "py-4" : "py-8"}`}>
            <nav className="container mx-auto px-4">
                <div className={`
                    relative flex items-center justify-between p-2 rounded-full border transition-all duration-700
                    ${isScrolled
                        ? "bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                        : "bg-transparent border-transparent"
                    }
                `}>
                    <Link href="http://localhost:3000" className="flex items-center gap-3 px-6 group outline-none">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-background group-hover:rotate-[10deg] transition-transform shadow-xl shadow-primary/20">
                            A
                        </div>
                        <span className="font-bold tracking-tight text-xl hidden lg:block text-white transition-colors group-hover:text-primary">
                            AETHER<span className="text-primary italic font-playfair ml-0.5">DEV</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] ml-3 opacity-50 font-sans group-hover:opacity-100 transition-opacity">{t("brand_subtext")}</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 pr-2">
                        {isSubProject && (
                            <Link
                                href="http://localhost:3000"
                                className="flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Link>
                        )}

                        <div className="flex items-center gap-1" onMouseLeave={() => setHoveredLink(null)}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onMouseEnter={() => setHoveredLink(link.name)}
                                    className="relative px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors outline-none"
                                >
                                    {hoveredLink === link.name && (
                                        <motion.div
                                            layoutId="nav-hover"
                                            className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                        />
                                    )}
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Social & Lang toggle */}
                        <div className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                            <Link href="https://github.com" target="_blank" className="text-white/50 hover:text-white transition-colors">
                                <Github className="w-4 h-4" />
                            </Link>
                            <Link href="https://linkedin.com" target="_blank" className="text-white/50 hover:text-white transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                            <Link href="https://x.com" target="_blank" className="text-white/50 hover:text-white transition-colors">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <button
                                onClick={() => setLanguage(language === "EN" ? "IT" : "EN")}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-white/50 hover:text-white transition-colors ml-2 uppercase tracking-wider outline-none"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                <span>{language}</span>
                            </button>
                        </div>

                        <button
                            onClick={openContact}
                            className="px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest bg-primary text-background hover:scale-105 active:scale-95 transition-all ml-4 shadow-[0_10px_30px_rgba(var(--primary),0.3)]"
                        >
                            {t("nav_contact")}
                        </button>
                    </div>

                    <button
                        className="md:hidden p-3 hover:bg-white/5 rounded-full mr-2 text-white outline-none"
                        onClick={() => setMobMenuOpen(!mobMenuOpen)}
                    >
                        {mobMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute top-24 left-4 right-4 p-10 rounded-[2.5rem] bg-black/95 backdrop-blur-3xl border border-white/10 shadow-3xl md:hidden z-50"
                >
                    <div className="flex flex-col gap-10 text-4xl font-bold text-white">
                        <Link href="#projects" onClick={() => setMobMenuOpen(false)}>{t("nav_work")}</Link>
                        <Link href="#about" onClick={() => setMobMenuOpen(false)}>{t("nav_philosophy")}</Link>
                        <button
                            onClick={() => { setMobMenuOpen(false); openContact(); }}
                            className="text-primary italic font-playfair text-left"
                        >
                            {t("nav_contact")}
                        </button>
                    </div>
                </motion.div>
            )}
        </header>
    )
}
