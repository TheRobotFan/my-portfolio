"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Home, Share2, Trophy, TrendingUp } from "lucide-react"

interface QuizResult {
  quizTitle: string
  score: number
  totalQuestions: number
  percentage: number
  timeSpent: number
  difficulty: string
}

export default function QuizResultsPage() {
  const router = useRouter()

  const [result] = useState<QuizResult>({
    quizTitle: "Quiz Matematica Settimanale",
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    timeSpent: 12,
    difficulty: "Intermedio",
  })

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return "Eccellente! Hai dominato questo quiz!"
    if (percentage >= 80) return "Ottimo risultato! Continua così!"
    if (percentage >= 70) return "Buon lavoro! Prova di nuovo per migliorare."
    if (percentage >= 60) return "Non male! Rivedi gli argomenti e riprova."
    return "Hai bisogno di più pratica. Torna e riprova!"
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-green-500"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-2">Quiz Completato!</h1>
          <p className="text-foreground/60">Ottimo lavoro, continua così!</p>
        </div>

        {/* Main Result Card */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 to-secondary/10">
          <h2 className="text-2xl font-bold mb-6 text-center">{result.quizTitle}</h2>

          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20"></div>
              <div className="text-center">
                <div className={`text-5xl font-bold ${getPerformanceColor(result.percentage)}`}>
                  {result.percentage}%
                </div>
                <div className="text-sm text-foreground/60 mt-2">Punteggio</div>
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <p className="text-center text-lg font-semibold mb-8">{getPerformanceMessage(result.percentage)}</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-card rounded-lg border border-border text-center">
              <div className="text-2xl font-bold text-primary">{result.score}</div>
              <div className="text-xs text-foreground/60 mt-1">Risposte Corrette</div>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border text-center">
              <div className="text-2xl font-bold text-primary">{result.totalQuestions}</div>
              <div className="text-xs text-foreground/60 mt-1">Domande Totali</div>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border text-center">
              <div className="text-2xl font-bold text-secondary">{result.timeSpent}</div>
              <div className="text-xs text-foreground/60 mt-1">Minuti Impiegati</div>
            </div>
            <div className="p-4 bg-card rounded-lg border border-border text-center">
              <div className="text-2xl font-bold text-secondary">{result.difficulty}</div>
              <div className="text-xs text-foreground/60 mt-1">Difficoltà</div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Button onClick={() => router.back()} className="gap-2 bg-primary hover:bg-primary/90 text-white">
            <RotateCcw className="w-4 h-4" />
            Riprova Quiz
          </Button>
          <Link href="/quiz" className="w-full">
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <TrendingUp className="w-4 h-4" />
              Altri Quiz
            </Button>
          </Link>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Condividi
          </Button>
        </div>

        {/* Back Home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <Home className="w-4 h-4" />
              Torna alla Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
