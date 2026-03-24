"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import {
  ArrowLeft,
  Trophy,
  Medal,
  Crown,
  User,
  TrendingUp,
} from "lucide-react"

// Mock leaderboard data
const leaderboardData = [
  { id: 1, name: "MasterDomino", wins: 342, losses: 45, streak: 15, avatar: "bg-yellow-500" },
  { id: 2, name: "TileKing", wins: 298, losses: 67, streak: 8, avatar: "bg-blue-500" },
  { id: 3, name: "DominoQueen", wins: 275, losses: 82, streak: 12, avatar: "bg-pink-500" },
  { id: 4, name: "BoneBreaker", wins: 251, losses: 94, streak: 5, avatar: "bg-green-500" },
  { id: 5, name: "TilesMaster", wins: 234, losses: 101, streak: 7, avatar: "bg-red-500" },
  { id: 6, name: "DominoNinja", wins: 218, losses: 112, streak: 3, avatar: "bg-indigo-500" },
  { id: 7, name: "BlockBuster", wins: 205, losses: 98, streak: 9, avatar: "bg-orange-500" },
  { id: 8, name: "TileWarrior", wins: 192, losses: 108, streak: 4, avatar: "bg-teal-500" },
  { id: 9, name: "DominoAce", wins: 178, losses: 115, streak: 6, avatar: "bg-cyan-500" },
  { id: 10, name: "BoneMaster", wins: 165, losses: 120, streak: 2, avatar: "bg-lime-500" },
]

function getRankIcon(rank: number) {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />
  return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{rank}</span>
}

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-game-table">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
          >
            <Link href="/">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Menu
            </Link>
          </Button>
          <h1 className="font-bold text-xl text-foreground">Classifica</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Top 3 Podium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-end justify-center gap-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${leaderboardData[1].avatar} flex items-center justify-center mx-auto mb-2`}>
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">{leaderboardData[1].name}</p>
                <div className="bg-gray-400 text-white px-4 py-6 rounded-t-xl">
                  <Medal className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className={`w-20 h-20 rounded-2xl ${leaderboardData[0].avatar} flex items-center justify-center mx-auto mb-2 ring-4 ring-yellow-500/50`}>
                  <User className="w-10 h-10 text-white" />
                </div>
                <p className="font-semibold text-foreground mb-1">{leaderboardData[0].name}</p>
                <div className="bg-yellow-500 text-white px-4 py-8 rounded-t-xl">
                  <Crown className="w-8 h-8 mx-auto mb-1" />
                  <p className="text-3xl font-bold">1</p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${leaderboardData[2].avatar} flex items-center justify-center mx-auto mb-2`}>
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">{leaderboardData[2].name}</p>
                <div className="bg-amber-600 text-white px-4 py-4 rounded-t-xl">
                  <Medal className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Top 10 Giocatori
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {leaderboardData.map((player, index) => {
                  const winRate = Math.round((player.wins / (player.wins + player.losses)) * 100)
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                        index < 3 ? "bg-muted/50" : "hover:bg-muted/30"
                      }`}
                    >
                      {/* Rank */}
                      <div className="w-8 flex justify-center">
                        {getRankIcon(index + 1)}
                      </div>

                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-xl ${player.avatar} flex items-center justify-center`}>
                        <User className="w-5 h-5 text-white" />
                      </div>

                      {/* Name & Stats */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{player.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{player.wins}W / {player.losses}L</span>
                          <span>-</span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {winRate}%
                          </span>
                        </div>
                      </div>

                      {/* Streak */}
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary">{player.streak}</p>
                        <p className="text-xs text-muted-foreground">serie</p>
                      </div>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>

          {/* Your Rank */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">La tua posizione</p>
                    <p className="text-sm text-muted-foreground">Gioca per entrare in classifica!</p>
                  </div>
                  <Button asChild>
                    <Link href="/">
                      Gioca Ora
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
