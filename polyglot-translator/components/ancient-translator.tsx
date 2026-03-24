"use client"

import React from "react"
import { useState } from "react"
import { BookOpen, Info, Lightbulb, Scroll, Sparkles, GraduationCap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  type SentenceAnalysis,
  type WordAnalysis,
  analyzeSentence,
  GRAMMAR_TOOLTIPS,
  SAMPLE_SENTENCES,
} from "@/lib/latin-grammar"
import { useLanguage } from "./providers/language-provider"
import { motion, AnimatePresence } from "framer-motion"

const ANCIENT_LANGUAGES = [
  { code: "la", name: "Latino", icon: Scroll },
  { code: "grc", name: "Greco Antico", icon: BookOpen, disabled: true },
]

function GrammarTooltip({ term, children }: { term: string; children: React.ReactNode }) {
  const tooltip = GRAMMAR_TOOLTIPS[term.toLowerCase()]

  if (!tooltip) {
    return <>{children}</>
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span className="cursor-help border-b-2 border-dashed border-primary/30 transition-colors hover:border-primary">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs glass-card border-black/5 dark:border-white/10 bg-white/95 dark:bg-black/90 p-4 shadow-2xl rounded-2xl">
          <p className="text-sm leading-relaxed text-foreground dark:text-white font-medium">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function WordAnalysisCard({ analysis, index }: { analysis: WordAnalysis; index: number }) {
  const { t } = useLanguage()
  const getSyntacticStyles = (func?: string) => {
    if (!func) return { bg: "bg-black/5 dark:bg-white/5", border: "border-black/5 dark:border-white/10", text: "text-foreground dark:text-white", accent: "bg-slate-400 dark:bg-white/20" }
    if (func.includes("soggetto")) return { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", accent: "bg-blue-500" }
    if (func.includes("oggetto")) return { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", accent: "bg-amber-500" }
    if (func.includes("predicato") || func.includes("copula")) return { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", accent: "bg-emerald-500" }
    if (func.includes("complemento")) return { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", accent: "bg-purple-500" }
    return { bg: "bg-black/5 dark:bg-white/5", border: "border-black/5 dark:border-white/10", text: "text-foreground dark:text-white", accent: "bg-slate-400 dark:bg-white/20" }
  }

  const styles = getSyntacticStyles(analysis.syntacticFunction)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className={`glass-card group relative overflow-hidden rounded-2xl border ${styles.border} bg-white/70 dark:bg-black/40 shadow-lg`}
    >
      <div className={`absolute left-0 top-0 h-full w-1 ${styles.accent}`} />

      <div className={`${styles.bg} px-6 py-4 border-b ${styles.border}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-3xl font-serif italic text-foreground dark:text-white tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              {analysis.word}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {t("ancient_lemma")}: <span className="text-foreground dark:text-white">{analysis.lemma}</span>
            </p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-xs font-black text-primary shadow-lg">
            {index + 1}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-6 pb-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">
            {t("ancient_pos")}
          </p>
          <p className="font-bold text-foreground dark:text-white capitalize text-sm">{analysis.partOfSpeechFull}</p>
        </div>

        {analysis.morphology.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
              {t("ancient_morphology")}
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.morphology.map((morph, i) => (
                <GrammarTooltip key={i} term={morph}>
                  <span className="inline-flex rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-3 py-1 text-xs font-bold text-foreground dark:text-white transition-all hover:bg-primary hover:border-primary hover:text-white">
                    {morph}
                  </span>
                </GrammarTooltip>
              ))}
            </div>
          </div>
        )}

        {analysis.paradigm && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">
              {t("ancient_paradigm")}
            </p>
            <p className="rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] px-3 py-2 font-mono text-xs text-primary font-bold">
              {analysis.paradigm}
            </p>
          </div>
        )}

        {analysis.syntacticFunction && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
              {t("ancient_function")}
            </p>
            <GrammarTooltip term={analysis.syntacticFunction}>
              <span className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-black uppercase tracking-wider ${styles.bg} ${styles.border} ${styles.text}`}>
                <span className={`h-2 w-2 rounded-full ${styles.accent} animate-pulse`} />
                {analysis.syntacticFunction}
              </span>
            </GrammarTooltip>
          </div>
        )}

        <div className="border-t border-white/5 pt-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">
            {t("nav_modern")} Translation
          </p>
          <p className="text-lg font-black text-foreground dark:text-white leading-tight">{analysis.translation}</p>
        </div>
      </div>
    </motion.div>
  )
}

function SentenceStructureCard({ analysis }: { analysis: SentenceAnalysis }) {
  const { t } = useLanguage()
  return (
    <div className="glass-card overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/40 shadow-xl">
      <div className="border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
            <Lightbulb className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tighter text-foreground dark:text-white">{t("ancient_sentence_structure")}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("ancient_logic")}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5 p-2">
        <div className="p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-3">
            {t("ancient_logic")}
          </p>
          <p className="text-lg font-bold text-foreground dark:text-white italic leading-tight">{analysis.structure}</p>
        </div>

        <div className="p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">
            {t("ancient_constructions")}
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.constructions.map((construction, i) => (
              <GrammarTooltip key={i} term={construction}>
                <span className="inline-flex rounded-xl bg-accent/10 border border-accent/20 px-4 py-2 text-xs font-black uppercase tracking-wider text-accent transition-all hover:bg-accent hover:text-white">
                  {construction}
                </span>
              </GrammarTooltip>
            ))}
          </div>
        </div>

        <div className="p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-3">
            {t("ancient_word_order")}
          </p>
          <p className="text-sm font-medium leading-relaxed text-muted-foreground">{analysis.wordOrderNote}</p>
        </div>
      </div>
    </div>
  )
}

function TranslationCard({ analysis }: { analysis: SentenceAnalysis }) {
  const { t } = useLanguage()
  return (
    <div className="glass-card overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/40 shadow-3xl">
      <div className="border-b border-white/10 bg-primary/5 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
            <Scroll className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tighter text-foreground dark:text-white">{t("ancient_translation_fluent")}</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original vs Translatis</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="mb-10 relative group">
          <div className="absolute -inset-4 bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-center ring-1 ring-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">
              {t("ancient_original")}
            </p>
            <p className="font-serif text-4xl md:text-5xl italic text-foreground dark:text-white tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              &ldquo;{analysis.original}&rdquo;
            </p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 group">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground opacity-50" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                {t("ancient_translation_literal")}
              </p>
            </div>
            <p className="text-xl font-bold text-foreground/70 dark:text-white/70 group-hover:text-foreground dark:group-hover:text-white transition-colors leading-tight">{analysis.literalTranslation}</p>
          </div>

          <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 group shadow-lg shadow-primary/5">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                {t("ancient_translation_fluent")}
              </p>
            </div>
            <p className="text-2xl font-black text-foreground dark:text-white leading-tight">{analysis.fluentTranslation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendCard() {
  const { t } = useLanguage()
  const legends = [
    { label: "Soggetto", bg: "bg-blue-500", border: "border-blue-200" },
    { label: "Complemento oggetto", bg: "bg-amber-500", border: "border-amber-200" },
    { label: "Predicato verbale", bg: "bg-emerald-500", border: "border-emerald-200" },
    { label: "Altri complementi", bg: "bg-purple-500", border: "border-purple-200" },
  ]

  return (
    <div className="glass-card rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/40 p-6 shadow-lg">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
        <Info className="h-4 w-4" />
        {t("ancient_legend")}
      </h3>
      <div className="flex flex-wrap gap-6">
        {legends.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${item.bg} shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
            <span className="text-xs font-bold text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AncientTranslator() {
  const [inputText, setInputText] = useState("")
  const [language, setLanguage] = useState("la")
  const [analysis, setAnalysis] = useState<SentenceAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { t } = useLanguage()

  const handleAnalyze = () => {
    if (!inputText.trim()) return
    setIsAnalyzing(true)
    setTimeout(() => {
      const result = analyzeSentence(inputText)
      setAnalysis(result)
      setIsAnalyzing(false)
    }, 100)
  }

  const sampleSentences = Object.keys(SAMPLE_SENTENCES)

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-accent"
        >
          <GraduationCap className="h-4 w-4" />
          {t("ancient_badge")}
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          {t("ancient_title")}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-medium">
          {t("ancient_subtitle")}
        </p>
      </div>

      {/* Input Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-primary/20 rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-60 transition duration-1000" />

        <div className="relative glass-card overflow-hidden rounded-[2.5rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/40 shadow-2xl">
          {/* Language Selector */}
          <div className="flex items-center gap-4 border-b border-white/5 bg-white/[0.02] px-8 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 shadow-inner">
              <Scroll className="h-6 w-6 text-accent" />
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[200px] border-0 bg-transparent text-xl font-black shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/10 bg-black/90">
                {ANCIENT_LANGUAGES.map((lang) => (
                  <SelectItem
                    key={lang.code}
                    value={lang.code}
                    disabled={lang.disabled}
                    className="focus:bg-accent/20 transition-colors"
                  >
                    <span className="flex items-center gap-3 font-bold">
                      <lang.icon className="h-4 w-4" />
                      {lang.name}
                      {lang.disabled && <span className="text-[10px] uppercase tracking-widest text-muted-foreground">({t("ancient_soon")})</span>}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Area */}
          <div className="p-8">
            <Textarea
              placeholder={language === "la" ? "Inserisci una frase in latino..." : "Enter text here..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[160px] resize-none border-0 bg-transparent p-0 font-serif text-3xl italic tracking-tight shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/20 transition-colors"
              style={{ fontFamily: 'var(--font-serif)' }}
            />
          </div>

          {/* Sample Sentences */}
          <div className="border-t border-white/5 bg-white/[0.01] px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex items-center gap-2 mt-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
                  {t("ancient_examples")}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {sampleSentences.map((sentence) => (
                  <button
                    key={sentence}
                    onClick={() => setInputText(sentence.charAt(0).toUpperCase() + sentence.slice(1))}
                    className="rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 px-5 py-2.5 text-xs font-bold text-foreground dark:text-white transition-all hover:bg-accent hover:border-accent hover:text-white hover:shadow-xl hover:-translate-y-1"
                  >
                    {sentence.charAt(0).toUpperCase() + sentence.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="border-t border-white/5 bg-white/[0.02] p-6 flex justify-center">
            <Button
              onClick={handleAnalyze}
              disabled={!inputText.trim() || isAnalyzing}
              className="w-full sm:w-auto min-w-[350px] gap-3 rounded-full py-8 text-lg font-black shadow-[0_0_30px_rgba(var(--accent),0.3)] hover:shadow-[0_0_50px_rgba(var(--accent),0.5)] scale-100 hover:scale-105 active:scale-95 transition-all bg-accent hover:bg-accent"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-6 w-6 animate-pulse" />
                  {t("ancient_analyzing").toUpperCase()}
                </>
              ) : (
                <>
                  <BookOpen className="h-6 w-6" />
                  {t("ancient_analyze").toUpperCase()}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Translation Card */}
            <TranslationCard analysis={analysis} />

            {/* Word-by-word Analysis */}
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                <h3 className="text-xl font-black uppercase tracking-[0.3em] text-primary">
                  {t("ancient_word_analysis")}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {analysis.words.map((word, index) => (
                  <WordAnalysisCard key={index} analysis={word} index={index} />
                ))}
              </div>
            </div>

            {/* Sentence Structure */}
            <SentenceStructureCard analysis={analysis} />

            {/* Legend */}
            <LegendCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
