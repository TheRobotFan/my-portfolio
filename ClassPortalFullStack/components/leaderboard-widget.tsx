"use client"

import { Card } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import Link from "next/link"

interface LeaderboardUser {
  id: string
  full_name: string
  avatar_url: string | null
  xp_points: number
  level: number
}

interface LeaderboardWidgetProps {
  users: LeaderboardUser[]
}

export function LeaderboardWidget({ users }: LeaderboardWidgetProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Top Studenti
        </h3>
        <Link href="/leaderboard" className="text-sm text-primary hover:underline">
          Vedi tutti
        </Link>
      </div>
      <div className="space-y-3">
        {users.slice(0, 5).map((user, idx) => (
          <div key={user.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm">
              #{idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.full_name}</p>
              <p className="text-xs text-foreground/60">Livello {user.level}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary text-sm">{user.xp_points}</p>
              <p className="text-xs text-foreground/60">XP</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
