"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { dictionary, type Language } from "../../lib/i18n/dictionary"

type LanguageContextType = {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("IT")

    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language
        if (savedLang && (savedLang === "EN" || savedLang === "IT")) {
            setLanguageState(savedLang)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem("language", lang)
    }

    const t = (key: string) => {
        const keys = key.split(".")
        let value: any = dictionary[language]

        for (const k of keys) {
            if (value[k]) {
                value = value[k]
            } else {
                return key
            }
        }

        return value
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
