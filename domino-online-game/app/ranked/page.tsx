"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Swords,
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Zap,
  Shield,
  Crown,
  Flame,
  Target,
  Medal,
  ChevronRight,
} from "lucide-react"
import {
  useGameStore,
  RANK_COLORS,
  RANK_NAMES,
  type RankedData,
} from "@/lib/game-store"

const RANK_ICONS: Record<RankedData["rank"], React.ElementType> = {
  bronze: Shield,
  silver: Shield,
  gold: Medal,
  platinum: Medal,
  diamond: Crown,
  master: Crown,
  grandmaster: Crown,
}

const RANK_THRESHOLDS = {
  bronze: { min: 0, max: 999 },
  silver: { min: 1000, max: 1299 },
  gold: { min: 1300, max: 1599 },
  platinum: { min: 1600, max: 1899 },
  diamond: { min: 1900, max: 2199 },
  master: { min: 2200, max: 2399 },
  grandmaster: { min: 2400, max: 9999 },
}

export default function RankedPage() {
  const router = useRouter()
  const { user, createUser, matchmaking, startMatchmaking, cancelMatchmaking, simulateMatchFound } = useGameStore()
  const [searchTime, setSearchTime] = useState(0)

  useEffect(() => {
    // Non creare automaticamente utente
  }, [])

  // Matchmaking timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (matchmaking.isSearching) {
      interval = setInterval(() => {
        setSearchTime((prev) => prev + 1)
      }, 1000)

      // Simulate finding a match after random time (5-15 seconds)
      const matchTimeout = setTimeout(() => {
        simulateMatchFound()
      }, Math.random() * 10000 + 5000)

      return () => {
        if (interval) clearInterval(interval)
        clearTimeout(matchTimeout)
      }
    } else {
      setSearchTime(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [matchmaking.isSearching, simulateMatchFound])

  // Handle match found
  useEffect(() => {
    if (matchmaking.foundMatch) {
      // Redirect to game after short delay
      const timeout = setTimeout(() => {
        router.push("/game?mode=ranked")
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [matchmaking.foundMatch, router])

  const handleStartSearch = () => {
    startMatchmaking("ranked")
  }

  const handleCancelSearch = () => {
    cancelMatchmaking()
  }

  const ranked = user?.ranked
  const rankProgress = ranked
    ? ((ranked.elo - RANK_THRESHOLDS[ranked.rank].min) /
        (RANK_THRESHOLDS[ranked.rank].max - RANK_THRESHOLDS[ranked.rank].min)) *
      100
    : 0

  const RankIcon = ranked ? RANK_ICONS[ranked.rank] : Shield

  return (
    <div className="min-h-screen bg-game-table">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="rounded-full bg-black/30 hover:bg-black/50 text-foreground backdrop-blur-sm"
          >
            <Link href="/">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Menu
            </Link>
          </Button>
          <h1 className="font-bold text-xl text-foreground">Classificate</h1>
                  </div>
      </header>

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Rank Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="overflow-hidden bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  {/* Rank Icon */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: ranked
                          ? `${RANK_COLORS[ranked.rank]}20`
                          : "#cd7f3220",
                        boxShadow: `0 0 30px ${ranked ? RANK_COLORS[ranked.rank] : "#cd7f32"}40`,
                      }}
                    >
                      <RankIcon
                        className="w-12 h-12"
                        style={{ color: ranked ? RANK_COLORS[ranked.rank] : "#cd7f32" }}
                      />
                    </div>
                    <div
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                      style={{
                        backgroundColor: ranked ? RANK_COLORS[ranked.rank] : "#cd7f32",
                        color: "#000",
                      }}
                    >
                      {ranked?.tier || 3}
                    </div>
                  </motion.div>

                  {/* Rank Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2
                        className="text-2xl font-bold"
                        style={{ color: ranked ? RANK_COLORS[ranked.rank] : "#cd7f32" }}
                      >
                        {ranked ? RANK_NAMES[ranked.rank] : "Bronzo"} {ranked?.tier || 3}
                      </h2>
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-2">
                      {ranked?.elo || 1000} <span className="text-sm text-muted-foreground">ELO</span>
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{ranked ? RANK_THRESHOLDS[ranked.rank].min : 0}</span>
                        <span>{ranked ? RANK_THRESHOLDS[ranked.rank].max : 999}</span>
                      </div>
                      <Progress value={rankProgress} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4 mb-6"
          >
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                <p className="text-2xl font-bold text-foreground">{ranked?.wins || 0}</p>
                <p className="text-xs text-muted-foreground">Vittorie</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-red-400" />
                <p className="text-2xl font-bold text-foreground">{ranked?.losses || 0}</p>
                <p className="text-xs text-muted-foreground">Sconfitte</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <p className="text-2xl font-bold text-foreground">{ranked?.winStreak || 0}</p>
                <p className="text-xs text-muted-foreground">Serie Attuale</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-2xl font-bold text-foreground">{ranked?.highestElo || 1000}</p>
                <p className="text-xs text-muted-foreground">ELO Massimo</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Season Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Stagione {ranked?.season || 1}</p>
                      <p className="text-xs text-muted-foreground">
                        {ranked?.seasonWins || 0}V / {ranked?.seasonLosses || 0}S
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">In Corso</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Matchmaking Section */}
          <AnimatePresence mode="wait">
            {matchmaking.isSearching ? (
              <motion.div
                key="searching"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-primary/30 border-t-primary"
                    />
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Ricerca Avversario...
                    </h3>
                    <div className="flex items-center justify-center gap-4 text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{Math.floor(searchTime / 60)}:{(searchTime % 60).toString().padStart(2, "0")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{matchmaking.playersInQueue} in coda</span>
                      </div>
                    </div>
                    <Button variant="destructive" onClick={handleCancelSearch}>
                      Annulla Ricerca
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : matchmaking.foundMatch ? (
              <motion.div
                key="found"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="overflow-hidden bg-gradient-to-br from-green-500/20 to-green-500/5 border-green-500/30">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                    >
                      <Swords className="w-10 h-10 text-green-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-green-400 mb-2">
                      Avversario Trovato!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Preparazione partita in corso...
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="start"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Button
                  onClick={handleStartSearch}
                  size="lg"
                  className="w-full h-20 text-xl gap-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Swords className="w-8 h-8" />
                  Trova Partita Classificata
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rank Ladder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h3 className="font-bold text-foreground mb-4">Scala dei Ranghi</h3>
            <div className="space-y-2">
              {(Object.keys(RANK_THRESHOLDS) as RankedData["rank"][]).reverse().map((rank) => {
                const isCurrentRank = ranked?.rank === rank
                const Icon = RANK_ICONS[rank]
                return (
                  <Card
                    key={rank}
                    className={`transition-all ${isCurrentRank ? "ring-2" : ""}`}
                    style={isCurrentRank ? { borderColor: RANK_COLORS[rank], boxShadow: `0 0 10px ${RANK_COLORS[rank]}40` } : {}}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${RANK_COLORS[rank]}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: RANK_COLORS[rank] }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground" style={isCurrentRank ? { color: RANK_COLORS[rank] } : {}}>
                          {RANK_NAMES[rank]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {RANK_THRESHOLDS[rank].min} - {RANK_THRESHOLDS[rank].max === 9999 ? "∞" : RANK_THRESHOLDS[rank].max} ELO
                        </p>
                      </div>
                      {isCurrentRank && (
                        <Badge style={{ backgroundColor: RANK_COLORS[rank], color: "#000" }}>
                          Attuale
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
