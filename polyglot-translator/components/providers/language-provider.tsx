"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { dictionary, type Language, type Dictionary } from "@/lib/i18n/dictionary"

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: keyof Dictionary) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("IT")

    // Load preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("aetherdev_lang") as Language
        if (saved && (saved === "EN" || saved === "IT")) {
            setLanguage(saved)
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem("aetherdev_lang", lang)
    }

    const t = (key: keyof Dictionary): string => {
        return dictionary[language][key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
