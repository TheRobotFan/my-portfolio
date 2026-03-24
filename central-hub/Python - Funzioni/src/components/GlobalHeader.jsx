"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Code } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export function GlobalHeader({ isSubProject = true }) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobMenuOpen, setMobMenuOpen] = useState(false)
    const [activeLink, setActiveLink] = useState(null)
    const [hoverRect, setHoverRect] = useState(null)
    const navRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { href: "#intro", label: "Inizio" },
        { href: "#syntax", label: "Sintassi" },
        { href: "#builtins", label: "Strumenti" },
    ]

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const navRect = navRef.current?.getBoundingClientRect()
        if (navRect) {
            setHoverRect({
                left: rect.left - navRect.left,
                width: rect.width,
            })
        }
    }

    const handleMouseLeave = () => {
        setHoverRect(null)
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}>
            <nav className="container mx-auto px-4">
                <div
                    className={`relative flex items-center justify-between p-2 rounded-full border transition-all duration-500 ${isScrolled
                            ? "border-white/6 backdrop-blur-2xl shadow-[0_8px_40px_-10px_rgba(0,0,0,0.6)]"
                            : "border-white/3 backdrop-blur-xl"
                        }`}
                    style={{
                        background: isScrolled
                            ? 'hsl(240 22% 4% / 0.85)'
                            : 'hsl(240 22% 4% / 0.3)',
                        boxShadow: isScrolled ? `0 8px 40px -10px hsl(247 60% 20% / 0.2)` : 'none'
                    }}
                >
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-3 px-4 group no-underline text-white">
                        <motion.div
                            whileHover={{ rotate: 12, scale: 1.08 }}
                            transition={{ type: "spring", stiffness: 350, damping: 18 }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, hsl(247 72% 55%), hsl(230 65% 48%))',
                                boxShadow: '0 4px 18px hsl(247 72% 50% / 0.25)'
                            }}
                        >
                            <Code size={15} />
                        </motion.div>
                        <span className="font-black tracking-tighter text-lg text-white">
                            PYTHON<span className="italic font-serif ml-1" style={{ color: 'hsl(247 65% 68%)' }}>EDU</span>
                        </span>
                    </a>

                    {/* Desktop nav — sliding pill hover */}
                    <div
                        ref={navRef}
                        className="hidden md:flex items-center gap-0.5 relative"
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Sliding background pill */}
                        <AnimatePresence>
                            {hoverRect && (
                                <motion.div
                                    className="absolute top-0 bottom-0 rounded-full pointer-events-none"
                                    initial={{ opacity: 0, x: hoverRect.left, width: hoverRect.width }}
                                    animate={{ opacity: 1, x: hoverRect.left, width: hoverRect.width }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                    style={{ background: 'hsl(247 50% 30% / 0.15)', border: '1px solid hsl(247 40% 40% / 0.12)' }}
                                />
                            )}
                        </AnimatePresence>

                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onMouseEnter={handleMouseEnter}
                                className="relative z-10 px-6 py-2 rounded-full text-sm font-medium no-underline transition-colors duration-200"
                                style={{ color: activeLink === link.href ? 'hsl(247 65% 72%)' : 'rgb(148 163 184)' }}
                                onMouseEnter={(e) => {
                                    handleMouseEnter(e)
                                    e.currentTarget.style.color = 'hsl(247 60% 78%)'
                                }}
                                onMouseLeave={(e) => {
                                    handleMouseLeave()
                                    e.currentTarget.style.color = 'rgb(148 163 184)'
                                }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <motion.button
                        whileTap={{ scale: 0.88 }}
                        className="md:hidden p-2.5 rounded-full mr-2 text-slate-400 transition-colors"
                        style={{ background: 'transparent' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(247 40% 20% / 0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        onClick={() => setMobMenuOpen(!mobMenuOpen)}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mobMenuOpen ? "x" : "menu"}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.14 }}
                            >
                                {mobMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-20 left-4 right-4 p-6 rounded-3xl backdrop-blur-2xl md:hidden overflow-hidden"
                        style={{
                            background: 'hsl(240 22% 5% / 0.96)',
                            border: '1px solid hsl(247 20% 14%)',
                            boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8)'
                        }}
                    >
                        {/* Top gradient line */}
                        <div className="absolute inset-x-0 top-0 h-px" style={{
                            background: 'linear-gradient(90deg, transparent, hsl(247 72% 58% / 0.4), transparent)'
                        }} />
                        <div className="flex flex-col gap-1.5">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                    href={link.href}
                                    onClick={() => setMobMenuOpen(false)}
                                    className="no-underline text-lg font-semibold py-3 px-5 rounded-2xl transition-all duration-200"
                                    style={{ color: 'rgb(148 163 184)' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'hsl(247 50% 20% / 0.3)'
                                        e.currentTarget.style.color = 'hsl(247 60% 78%)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent'
                                        e.currentTarget.style.color = 'rgb(148 163 184)'
                                    }}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
