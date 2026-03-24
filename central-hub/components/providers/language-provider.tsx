"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { dictionary, Language } from "@/lib/i18n/dictionary"

type DictionaryKey = keyof typeof dictionary.EN;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: DictionaryKey) => string | any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("EN");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Check local storage for saved language preferences
        const savedLang = localStorage.getItem("aetherdev_lang") as Language;
        if (savedLang && (savedLang === "EN" || savedLang === "IT")) {
            setLanguageState(savedLang);
        }
        setMounted(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("aetherdev_lang", lang);
    };

    const t = (key: DictionaryKey): string | any => {
        return dictionary[language][key] || dictionary["EN"][key] || key;
    };

    // Prevent hydration mismatch by rendering default EN on server
    if (!mounted) {
        return (
            <LanguageContext.Provider value={{ language: "EN", setLanguage, t }}>
                {children}
            </LanguageContext.Provider>
        )
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
