"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGameStore, LeaderboardEntry } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import {
  Trophy,
  TrendingUp,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Medal,
  Star
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function LeaderboardPage() {
  const { leaderboard, fetchLeaderboard } = useGameStore()
  const [activeTab, setActiveTab] = useState<'elo' | 'wins' | 'level'>('elo')
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchLeaderboard(activeTab)
  }, [activeTab, fetchLeaderboard])

  const filteredEntries = leaderboard.filter(entry =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-x-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-accent/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-10 relative z-10">
        <header className="flex items-center justify-between mb-10">
          <Button variant="ghost" asChild className="rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 h-12 w-12 p-0">
            <Link href="/">
              <ChevronLeft className="w-6 h-6" />
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic drop-shadow-lg">
              Classifica <span className="text-primary italic">Elite</span>
            </h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mt-1">Domina la competizione globale</p>
          </div>
          <div className="w-12" /> {/* Spacer */}
        </header>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-12 items-end">
          {/* 2nd Place */}
          {filteredEntries[1] && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-silver p-1 shadow-[0_0_20px_rgba(192,192,192,0.3)]">
                  <Avatar className="w-full h-full border-2 border-background">
                    <AvatarImage src={filteredEntries[1].avatar} />
                    <AvatarFallback className="bg-muted text-xl">{filteredEntries[1].username[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center font-bold text-background shadow-lg">2</div>
              </div>
              <p className="font-bold text-sm text-center truncate w-full">{filteredEntries[1].username}</p>
              <p className="text-primary text-xs font-black">{filteredEntries[1].elo} ELO</p>
            </motion.div>
          )}

          {/* 1st Place */}
          {filteredEntries[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center z-10"
            >
              <div className="relative mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 bg-gradient-to-t from-yellow-500/50 to-transparent rounded-full blur-xl opacity-50"
                />
                <div className="w-28 h-28 rounded-full border-4 border-yellow-400 p-1 shadow-[0_0_40px_rgba(250,204,21,0.5)] relative z-10">
                  <Avatar className="w-full h-full border-2 border-background">
                    <AvatarImage src={filteredEntries[0].avatar} />
                    <AvatarFallback className="bg-muted text-3xl">{filteredEntries[0].username[0]}</AvatarFallback>
                  </Avatar>
                  <Trophy className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 text-yellow-400 drop-shadow-glow" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-background shadow-lg text-lg">1</div>
              </div>
              <p className="font-black text-lg text-center truncate w-full">{filteredEntries[0].username}</p>
              <p className="text-primary text-sm font-black">{filteredEntries[0].elo} ELO</p>
            </motion.div>
          )}

          {/* 3rd Place */}
          {filteredEntries[2] && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-[#CD7F32] p-1 shadow-[0_0_20px_rgba(205,127,50,0.3)]">
                  <Avatar className="w-full h-full border-2 border-background">
                    <AvatarImage src={filteredEntries[2].avatar} />
                    <AvatarFallback className="bg-muted text-xl">{filteredEntries[2].username[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#CD7F32] rounded-full flex items-center justify-center font-bold text-background shadow-lg">3</div>
              </div>
              <p className="font-bold text-sm text-center truncate w-full">{filteredEntries[2].username}</p>
              <p className="text-primary text-xs font-black">{filteredEntries[2].elo} ELO</p>
            </motion.div>
          )}
        </div>

        {/* Filters & Search */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10 flex-1">
            <button
              onClick={() => setActiveTab('elo')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all uppercase tracking-tighter",
                activeTab === 'elo' ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-white/5"
              )}
            >
              Punti ELO
            </button>
            <button
              onClick={() => setActiveTab('wins')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all uppercase tracking-tighter",
                activeTab === 'wins' ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-white/5"
              )}
            >
              Vittorie
            </button>
            <button
              onClick={() => setActiveTab('level')}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all uppercase tracking-tighter",
                activeTab === 'level' ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-white/5"
              )}
            >
              Livello
            </button>
          </div>
          <div className="relative group sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Cerca giocatore..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all backdrop-blur-md"
            />
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden mb-10">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-black uppercase tracking-widest text-sm">Top Giocatori</span>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>

          <div className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredEntries.slice(3).map((entry, index) => (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group"
                >
                  <div className="w-8 font-black text-sm text-muted-foreground group-hover:text-primary transition-colors italic">
                    #{entry.rank}
                  </div>
                  <Avatar className="w-10 h-10 border border-white/10 ring-2 ring-primary/0 group-hover:ring-primary/50 transition-all">
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback>{entry.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate uppercase tracking-tight">{entry.username}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Rank {entry.rank < 10 ? 'Elite' : 'Master'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-primary tracking-tighter">
                      {activeTab === 'elo' ? `${entry.elo} ELO` :
                        activeTab === 'wins' ? `${entry.wins} WIN` :
                          `LVL ${Math.floor(entry.elo / 100)}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-bold">
                      {entry.winRate.toFixed(1)}% WINRATE
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Social Shortcut Nav */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-2xl px-6 py-4 rounded-full border border-white/10 flex items-center gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-muted-foreground">
          <Users className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full bg-primary/20 text-primary hover:bg-primary/30">
          <Trophy className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-muted-foreground">
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
