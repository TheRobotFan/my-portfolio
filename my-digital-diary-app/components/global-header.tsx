"use client"

import { motion } from "framer-motion"
import { Layout, Menu, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function GlobalHeader({ isSubProject = false }: { isSubProject?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobMenuOpen, setMobMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "py-4" : "py-6"}`}>
            <nav className="container mx-auto px-4">
                <div className={`relative flex items-center justify-between p-2 rounded-full border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl transition-all duration-500 ${isScrolled ? "shadow-xl" : ""}`}>
                    <Link href="http://localhost:3000" className="flex items-center gap-3 px-4 group">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                            A
                        </div>
                        <span className="font-bold tracking-tighter text-lg hidden sm:block text-slate-900 dark:text-white">
                            ABDEL<span className="text-primary italic font-serif ml-1">PORTFOLIO</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {isSubProject && (
                            <Link
                                href="http://localhost:3000"
                                className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Hub
                            </Link>
                        )}
                        <Link href="#projects" className="px-6 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all">Projects</Link>
                        <Link href="#about" className="px-6 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 transition-all">About</Link>
                        <Link href="#contact" className="px-6 py-2 rounded-full text-sm font-medium bg-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all ml-2">Contact</Link>
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
