"use client"

import { useState, useEffect } from "react"
import { ArrowRightLeft, Copy, Check, Languages, Volume2, Sparkles, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "./providers/language-provider"
import { motion, AnimatePresence } from "framer-motion"

const MODERN_LANGUAGES = [
  { code: "it", name: "Italiano", flag: "IT" },
  { code: "en", name: "Inglese", flag: "GB" },
  { code: "fr", name: "Francese", flag: "FR" },
  { code: "es", name: "Spagnolo", flag: "ES" },
  { code: "de", name: "Tedesco", flag: "DE" },
  { code: "ar", name: "Arabo", flag: "SA" },
]

// Simulated translations for demo purposes
const TRANSLATIONS: Record<string, Record<string, string>> = {
  "it-en": {
    "ciao": "hello",
    "buongiorno": "good morning",
    "come stai": "how are you",
    "grazie": "thank you",
    "prego": "you're welcome",
    "arrivederci": "goodbye",
    "buona notte": "good night",
    "per favore": "please",
    "scusa": "sorry",
    "si": "yes",
    "no": "no",
    "amore": "love",
    "casa": "house",
    "famiglia": "family",
    "amico": "friend",
    "la vita e bella": "life is beautiful",
    "buon appetito": "enjoy your meal",
    "come ti chiami": "what is your name",
    "mi chiamo": "my name is",
    "dove sei": "where are you",
  },
  "en-it": {
    "hello": "ciao",
    "good morning": "buongiorno",
    "how are you": "come stai",
    "thank you": "grazie",
    "you're welcome": "prego",
    "goodbye": "arrivederci",
    "good night": "buona notte",
    "please": "per favore",
    "sorry": "scusa",
    "yes": "si",
    "no": "no",
    "love": "amore",
    "house": "casa",
    "family": "famiglia",
    "friend": "amico",
    "life is beautiful": "la vita e bella",
    "enjoy your meal": "buon appetito",
    "what is your name": "come ti chiami",
    "my name is": "mi chiamo",
    "where are you": "dove sei",
  },
}

function translateText(text: string, from: string, to: string): string {
  if (from === to) return text

  const key = `${from}-${to}`
  const reverseKey = `${to}-${from}`
  const dictionary = TRANSLATIONS[key] || {}
  const reverseDictionary = TRANSLATIONS[reverseKey] || {}

  const lowerText = text.toLowerCase().trim()

  if (dictionary[lowerText]) {
    return dictionary[lowerText]
  }

  const words = text.split(" ")
  const translatedWords = words.map(word => {
    const lowerWord = word.toLowerCase()
    if (dictionary[lowerWord]) {
      return dictionary[lowerWord]
    }
    for (const [original, translated] of Object.entries(reverseDictionary)) {
      if (translated.toLowerCase() === lowerWord) {
        return original
      }
    }
    return `[${word}]`
  })

  return translatedWords.join(" ")
}

export function ModernTranslator() {
  const [sourceText, setSourceText] = useState("")
  const [sourceLang, setSourceLang] = useState("it")
  const [targetLang, setTargetLang] = useState("en")
  const [translatedText, setTranslatedText] = useState("")
  const [displayResult, setDisplayResult] = useState("")
  const [copied, setCopied] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const { t, language } = useLanguage()

  // Streaming Text Effect
  useEffect(() => {
    if (translatedText && !isTranslating) {
      let i = 0
      setDisplayResult("")
      const interval = setInterval(() => {
        setDisplayResult(translatedText.slice(0, i))
        i++
        if (i > translatedText.length) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    } else {
      setDisplayResult("")
    }
  }, [translatedText, isTranslating])

  const handleTranslate = () => {
    if (!sourceText.trim()) return
    setIsTranslating(true)
    setTimeout(() => {
      const result = translateText(sourceText, sourceLang, targetLang)
      setTranslatedText(result)
      setIsTranslating(false)
    }, 800)
  }

  const handleSwapLanguages = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const handleCopy = async () => {
    if (!translatedText) return
    await navigator.clipboard.writeText(translatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sourceLanguage = MODERN_LANGUAGES.find(l => l.code === sourceLang)
  const targetLanguage = MODERN_LANGUAGES.find(l => l.code === targetLang)

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary"
        >
          <Globe className="h-4 w-4" />
          {t("translator_mode_modern")}
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          {t("modern_title")}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-medium">
          {t("modern_subtitle")}
        </p>
      </div>

      {/* Main Translation Card */}
      <div className="relative group">
        {/* Glowing Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

        <div className="relative glass-card overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/40 shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:border-primary/30">
          {/* Language Selectors */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center border-b border-white/5 bg-white/[0.02]">
            <div className="flex flex-1 items-center gap-4 p-6">
              <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-xs font-black border border-black/5 dark:border-white/10">
                {sourceLanguage?.flag}
              </div>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="w-full border-0 bg-transparent text-lg font-black shadow-none focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/90">
                  {MODERN_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="focus:bg-primary/20 transition-colors">
                      <span className="flex items-center gap-2 font-bold">
                        <span className="text-[10px] text-muted-foreground">{lang.flag}</span>
                        {lang.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center p-2 sm:p-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwapLanguages}
                className="h-12 w-12 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-xl transition-all hover:scale-110 hover:bg-primary hover:text-white"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4 p-6">
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="w-full border-0 bg-transparent text-right text-lg font-black shadow-none focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/90">
                  {MODERN_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="focus:bg-primary/20 transition-colors">
                      <span className="flex items-center gap-2 font-bold">
                        <span className="text-[10px] text-muted-foreground">{lang.flag}</span>
                        {lang.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-xs font-black border border-black/5 dark:border-white/10">
                {targetLanguage?.flag}
              </div>
            </div>
          </div>

          {/* Text Areas */}
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/5 dark:divide-white/5">
            {/* Source */}
            <div className="relative p-8 group/input">
              <Textarea
                placeholder={t("translator_placeholder")}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-[250px] resize-none border-0 bg-transparent p-0 text-2xl font-black tracking-tight shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/30 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              />
              <div className="absolute bottom-6 left-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-white transition-all">
                  <Volume2 className="h-5 w-5" />
                </Button>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {sourceText.length} {t("modern_characters")}
                </span>
              </div>
            </div>

            {/* Target */}
            <div className="relative bg-black/[0.01] dark:bg-white/[0.01] p-8 group/result">
              <AnimatePresence mode="wait">
                {isTranslating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[250px] items-center justify-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">{t("translator_translating")}</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-h-[250px] text-2xl font-black tracking-tight text-foreground"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {displayResult || (
                      <span className="text-muted-foreground/20 italic font-medium">{t("translator_no_results")}</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {translatedText && !isTranslating && (
                <div className="absolute bottom-6 right-8 flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-white transition-all">
                    <Volume2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-10 w-10 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-emerald-500 hover:text-white transition-all shadow-xl"
                  >
                    {copied ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Translate Button */}
          <div className="border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.02] p-6 flex justify-center">
            <Button
              onClick={handleTranslate}
              disabled={!sourceText.trim() || isTranslating}
              className="w-full sm:w-auto min-w-[300px] gap-3 rounded-full py-8 text-lg font-black shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_50px_rgba(var(--primary),0.5)] scale-100 hover:scale-105 active:scale-95 transition-all"
            >
              <Languages className="h-6 w-6" />
              {t("translator_translating").split('...')[0].toUpperCase()}
            </Button>
          </div>
        </div>
      </div>

      {/* Recommended Phrases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {["Ciao", "Buongiorno", "Grazie", "Come stai"].map((phrase, i) => (
          <motion.button
            key={phrase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            onClick={() => setSourceText(phrase)}
            className="glass-card group p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-white/70 dark:bg-white/[0.02] text-left transition-all hover:border-primary/50 hover:bg-white/5"
          >
            <span className="block text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{phrase}</span>
            <span className="mt-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
              {t("modern_click_to_translate")}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
