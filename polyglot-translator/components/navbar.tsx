"use client"

import { Languages, BookOpen } from "lucide-react"
import { useLanguage } from "./providers/language-provider"

interface NavbarProps {
  mode: "modern" | "ancient"
  onModeChange: (mode: "modern" | "ancient") => void
}

export function Navbar({ mode, onModeChange }: NavbarProps) {
  const { t } = useLanguage()

  return (
    <div className="fixed top-24 left-0 right-0 z-40 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="flex items-center rounded-full border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/40 backdrop-blur-xl p-1 shadow-2xl">
          <button
            onClick={() => onModeChange("modern")}
            className={`flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === "modern"
              ? "bg-primary text-white shadow-lg"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
          >
            <Languages className="h-4 w-4" />
            <span>{t("nav_modern")}</span>
          </button>
          <button
            onClick={() => onModeChange("ancient")}
            className={`flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${mode === "ancient"
              ? "bg-primary text-white shadow-lg"
              : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>{t("nav_ancient")}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
