"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuthStore } from "@/lib/auth-store"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Clock,
  Star,
  Crown,
  Target,
  Award,
  TrendingUp,
  Users,
  Zap,
  Gift,
  ChevronRight,
  Coins,
  Gem
} from "lucide-react"

export default function SeasonsPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'rewards'>('current')
  const { currentSeason, seasonHistory, user } = useAuthStore()
  const router = useRouter()

  // Mock season progress
  const seasonProgress = {
    currentRank: 'silver',
    currentTier: 2,
    seasonWins: 15,
    seasonLosses: 8,
    seasonPoints: 1250,
    nextRankPoints: 1500,
    gamesPlayed: 23,
    winRate: 65.2,
    globalRank: 1247,
    regionalRank: 89
  }

  const rankColors = {
    bronze: 'from-amber-700 to-amber-600',
    silver: 'from-gray-400 to-gray-300',
    gold: 'from-yellow-500 to-yellow-400',
    platinum: 'from-cyan-400 to-cyan-300',
    diamond: 'from-blue-500 to-blue-400',
    master: 'from-purple-500 to-purple-400',
    grandmaster: 'from-red-500 to-red-400'
  }

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'bronze': return <Award className="w-6 h-6" />
      case 'silver': return <Star className="w-6 h-6" />
      case 'gold': return <Crown className="w-6 h-6" />
      case 'platinum': return <Trophy className="w-6 h-6" />
      case 'diamond': return <Target className="w-6 h-6" />
      case 'master': return <Zap className="w-6 h-6" />
      case 'grandmaster': return <TrendingUp className="w-6 h-6" />
      default: return <Award className="w-6 h-6" />
    }
  }

  const getTimeRemaining = () => {
    if (!currentSeason) return { days: 0, hours: 0 }
    
    const now = new Date()
    const end = new Date(currentSeason.endDate)
    const diff = end.getTime() - now.getTime()
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    return { days, hours }
  }

  const { days, hours } = getTimeRemaining()

  return (
    <div className="min-h-screen bg-game-table">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 opacity-20"
        >
          <Trophy className="w-48 h-48 text-amber-400" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 opacity-20"
        >
          <Calendar className="w-48 h-48 text-blue-400" />
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
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

          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              Stagione {currentSeason?.id || 1}
            </Badge>
          </div>
        </motion.div>

        {/* Current Season Hero */}
        {currentSeason && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/30 overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
                <CardContent className="relative p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {currentSeason.name}
                      </h1>
                      <p className="text-foreground/80">
                        Tema: {currentSeason.theme}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-foreground/60 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Tempo rimanente</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-400">{days}</div>
                          <div className="text-xs text-foreground/60">giorni</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-400">{hours}</div>
                          <div className="text-xs text-foreground/60">ore</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Season Progress */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-foreground/60">Rank Attuale</span>
                        <Badge className={`bg-gradient-to-r ${rankColors[seasonProgress.currentRank as keyof typeof rankColors]}`}>
                          {getRankIcon(seasonProgress.currentRank)}
                          <span className="ml-1">{seasonProgress.currentRank.toUpperCase()}</span>
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">
                        Tier {seasonProgress.currentTier}
                      </div>
                      <Progress 
                        value={(seasonProgress.seasonPoints / seasonProgress.nextRankPoints) * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-foreground/60 mt-1">
                        {seasonProgress.seasonPoints} / {seasonProgress.nextRankPoints} punti
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-foreground/60">Statistiche</span>
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-foreground/60">Vittorie:</span>
                          <span className="ml-1 font-semibold text-green-400">{seasonProgress.seasonWins}</span>
                        </div>
                        <div>
                          <span className="text-foreground/60">Sconfitte:</span>
                          <span className="ml-1 font-semibold text-red-400">{seasonProgress.seasonLosses}</span>
                        </div>
                        <div>
                          <span className="text-foreground/60">Win Rate:</span>
                          <span className="ml-1 font-semibold">{seasonProgress.winRate}%</span>
                        </div>
                        <div>
                          <span className="text-foreground/60">Partite:</span>
                          <span className="ml-1 font-semibold">{seasonProgress.gamesPlayed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-foreground/60">Classifica</span>
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-foreground/60">Globale:</span>
                          <span className="ml-1 font-semibold">#{seasonProgress.globalRank.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-foreground/60">Regionale:</span>
                          <span className="ml-1 font-semibold">#{seasonProgress.regionalRank}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'current', label: 'Stagione Attuale', icon: Trophy },
            { id: 'rewards', label: 'Ricompense', icon: Gift },
            { id: 'history', label: 'Storia', icon: Calendar }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'current' && (
            <motion.div
              key="current"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Season Challenges */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Obiettivi Stagionali
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Vinci 20 partite", progress: 15, total: 20, reward: "500 monete" },
                    { title: "Raggiungi rank Gold", progress: 60, total: 100, reward: "100 gemme" },
                    { title: "Gioca 50 partite", progress: 23, total: 50, reward: "Avatar esclusivo" },
                    { title: "Ottieni 10 vittorie consecutive", progress: 3, total: 10, reward: "Skin premium" }
                  ].map((challenge, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-black/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-foreground mb-1">{challenge.title}</div>
                        <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                        <div className="text-xs text-foreground/60 mt-1">
                          {challenge.progress}/{challenge.total}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-amber-400">{challenge.reward}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentSeason?.rewards.map((reward, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`bg-gradient-to-br ${rankColors[reward.rank as keyof typeof rankColors]} bg-opacity-10 border-opacity-30 overflow-hidden h-full`}>
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          {getRankIcon(reward.rank)}
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">
                          {reward.rank.toUpperCase()} Tier {reward.tier}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-center gap-2">
                            <Coins className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400">{reward.coins.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Gem className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400">{reward.gems}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {reward.items.map((item, i) => (
                            <div key={i} className="text-xs text-foreground/60">
                              {item}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {seasonHistory.map((season, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{season.name}</h3>
                        <p className="text-foreground/60">
                          {new Date(season.startDate).toLocaleDateString()} - {new Date(season.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={season.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                          {season.isActive ? 'Attiva' : 'Terminata'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
