"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Trophy, TrendingUp, Medal, Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LeaderboardUser {
  id: string
  full_name: string
  avatar_url: string | null
  xp_points: number
  level: number
}

interface LeaderboardClientProps {
  users: LeaderboardUser[]
  currentUserId: string
}

export function LeaderboardClient({ users, currentUserId }: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState("all")

  const currentUserRank = users.findIndex((u) => u.id === currentUserId) + 1

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Classifica e Ranking
          </h1>
          <p className="text-foreground/60">Scopri i migliori studenti e i loro progressi</p>

          {currentUserRank > 0 && (
            <Card className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
              <p className="text-sm">
                La tua posizione: <span className="font-bold text-primary">#{currentUserRank}</span>
              </p>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto md:grid-cols-2 mb-6">
            <TabsTrigger value="all" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Classifica Generale
            </TabsTrigger>
            <TabsTrigger value="top10" className="gap-2">
              <Star className="w-4 h-4" />
              Top 10
            </TabsTrigger>
          </TabsList>

          {/* All Users Tab */}
          <TabsContent value="all" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Classifica Completa</h2>
              <div className="space-y-2">
                {users.map((user, idx) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-lg transition ${
                      user.id === currentUserId
                        ? "bg-primary/10 border-2 border-primary"
                        : idx < 3
                          ? "bg-muted/50 hover:bg-muted"
                          : "hover:bg-muted"
                    }`}
                  >
                    {/* Rank */}
                    <div className="w-12 h-12 flex items-center justify-center font-bold text-lg">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                      {user.avatar_url || user.full_name.charAt(0).toUpperCase()}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <p className="font-bold">{user.full_name}</p>
                      <p className="text-xs text-foreground/60">Livello {user.level}</p>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary flex items-center gap-1">
                        {user.xp_points}
                        <span className="text-xs text-foreground/60">XP</span>
                      </div>
                    </div>

                    {/* Medal for top 3 */}
                    {idx < 3 && <Medal className="w-5 h-5 text-amber-500" />}
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Top 10 Tab */}
          <TabsContent value="top10" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {users.slice(0, 10).map((user, idx) => (
                <Card key={user.id} className="p-6 bg-gradient-to-br from-card to-card/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.avatar_url || user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{user.full_name}</p>
                      <p className="text-sm text-foreground/60">Livello {user.level}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">{user.xp_points}</p>
                      <p className="text-xs text-foreground/60">Punti Esperienza</p>
                    </div>
                    {idx < 3 && <Trophy className="w-6 h-6 text-amber-500" />}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
