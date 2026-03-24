"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ModernTranslator } from "@/components/modern-translator"
import { AncientTranslator } from "@/components/ancient-translator"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import { AnimatePresence, motion } from "framer-motion"

export default function Home() {
  const [mode, setMode] = useState<"modern" | "ancient">("modern")
  const [showTranslator, setShowTranslator] = useState(false)

  const handleStartTranslating = () => {
    setShowTranslator(true)
    setTimeout(() => {
      document.getElementById("translator")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar mode={mode} onModeChange={setMode} />

      <AnimatePresence mode="wait">
        {!showTranslator ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <HeroSection onStartTranslating={handleStartTranslating} />
            <FeaturesSection />
          </motion.div>
        ) : (
          <motion.main
            key="translator-view"
            id="translator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-32 pb-32"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <AnimatePresence mode="wait">
                {mode === "modern" ? (
                  <motion.div
                    key="modern"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <ModernTranslator />
                  </motion.div>
                ) : (
                  <motion.div
                    key="ancient"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <AncientTranslator />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
