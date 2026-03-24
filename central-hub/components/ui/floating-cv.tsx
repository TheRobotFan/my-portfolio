"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FileDown, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "../providers/language-provider"

export function FloatingCV() {
    const [scrolled, setScrolled] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const { t, language } = useLanguage()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 300)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleDownloadClick = () => {
        setDownloading(true)
        setTimeout(() => setDownloading(false), 3000)
    }

    const cvFilename = language === "IT" ? "Abdel_CV_IT.pdf" : "Abdel_CV.pdf"

    return (
        <AnimatePresence>
            {scrolled && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 50 }}
                    className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[1001]"
                >
                    <motion.a
                        href={`/${cvFilename}`}
                        download={cvFilename}
                        onClick={handleDownloadClick}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="group relative flex items-center gap-3 bg-white text-black p-3 md:p-4 md:px-6 md:py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />

                        {downloading ? (
                            <Check className="w-5 h-5 text-emerald-600 animate-bounce" />
                        ) : (
                            <FileDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                        )}

                        <span className="hidden md:block font-bold text-sm tracking-tight">
                            {downloading ? t("cv_preparing") : t("cv_download")}
                        </span>

                        {/* Particle effect on hover */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full blur-[2px] opacity-0 group-hover:opacity-100 animate-pulse" />
                    </motion.a>

                    {/* Notification bubble */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: scrolled ? 1 : 0, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -top-12 right-0 bg-primary/10 border border-primary/20 backdrop-blur-md px-4 py-2 rounded-2xl whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-primary hidden md:block"
                    >
                        {t("cv_hire")}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
