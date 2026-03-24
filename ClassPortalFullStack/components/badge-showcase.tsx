"use client"

import { Card } from "@/components/ui/card"
import { Award } from "lucide-react"

interface Badge {
  id: string
  name: string
  description: string
  icon_url: string | null
  earned_at?: string
}

interface BadgeShowcaseProps {
  badges: Badge[]
  title?: string
}

export function BadgeShowcase({ badges, title = "Badge Recenti" }: BadgeShowcaseProps) {
  if (badges.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          {title}
        </h3>
        <p className="text-sm text-foreground/60 text-center py-4">Nessun badge ancora. Continua a contribuire!</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Award className="w-5 h-5" />
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {badges.slice(0, 4).map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center p-3 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-border hover:border-primary/50 transition"
          >
            <div className="text-3xl mb-2">{badge.icon_url || "🏆"}</div>
            <p className="text-xs font-semibold text-center">{badge.name}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
