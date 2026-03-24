"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface XPProgressProps {
  currentXP: number
  level: number
}

export function XPProgress({ currentXP, level }: XPProgressProps) {
  const xpForNextLevel = level * 100
  const xpInCurrentLevel = currentXP % 100
  const progress = (xpInCurrentLevel / 100) * 100

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="font-semibold">Livello {level}</span>
        </div>
        <span className="text-sm text-foreground/60">{xpInCurrentLevel} / 100 XP</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-foreground/50 mt-2">{100 - xpInCurrentLevel} XP al prossimo livello</p>
    </Card>
  )
}
