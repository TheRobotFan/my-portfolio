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
  Calendar,
  Clock,
  Star,
  Trophy,
  Target,
  Award,
  TrendingUp,
  Users,
  Zap,
  Gift,
  Flame,
  Crown,
  Sparkles,
  Timer,
  CheckCircle
} from "lucide-react"

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const { activeEvents, user } = useAuthStore()
  const router = useRouter()

  // Mock event progress
  const eventProgress = {
    'tournament_2024': {
      wins: 3,
      totalWins: 10,
      rank: 156,
      totalParticipants: 2847,
      timeRemaining: 5 * 24 * 60 * 60 * 1000, // 5 days in ms
      completed: false
    },
    'bonus_weekend': {
      dailyLogins: 2,
      totalDays: 3,
      gamesPlayed: 8,
      totalGames: 5,
      timeRemaining: 2 * 24 * 60 * 60 * 1000, // 2 days in ms
      completed: false
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'tournament': return <Trophy className="w-6 h-6" />
      case 'bonus': return <Gift className="w-6 h-6" />
      case 'special': return <Sparkles className="w-6 h-6" />
      default: return <Calendar className="w-6 h-6" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'tournament': return 'from-amber-500 to-amber-600'
      case 'bonus': return 'from-green-500 to-green-600'
      case 'special': return 'from-purple-500 to-purple-600'
      default: return 'from-blue-500 to-blue-600'
    }
  }

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}g ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const isEventActive = (event: any) => {
    const now = new Date()
    const start = new Date(event.startDate)
    const end = new Date(event.endDate)
    return now >= start && now <= end
  }

  return (
    <div className="min-h-screen bg-game-table">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 opacity-20"
        >
          <Calendar className="w-48 h-48 text-purple-400" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 opacity-20"
        >
          <Flame className="w-48 h-48 text-orange-400" />
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
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Eventi Attivi
            </Badge>
          </div>
        </motion.div>

        {/* Active Events */}
        <div className="space-y-6">
          {activeEvents.map((event, index) => {
            const progress = eventProgress[event.id as keyof typeof eventProgress]
            const isActive = isEventActive(event)
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${getEventColor(event.type)} bg-opacity-10 border-opacity-30 overflow-hidden`}>
                  <div className="relative">
                    {/* Event Header */}
                    <div className="p-6 border-b border-white/10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${getEventColor(event.type)} bg-opacity-20`}>
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">
                              {event.name}
                            </h2>
                            <p className="text-foreground/80">
                              {event.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={isActive ? 'bg-green-500' : 'bg-gray-500'}>
                            {isActive ? 'Attivo' : 'Terminato'}
                          </Badge>
                        </div>
                      </div>

                      {/* Event Timer */}
                      {isActive && progress && (
                        <div className="flex items-center gap-4 p-3 bg-black/30 rounded-lg">
                          <Timer className="w-5 h-5 text-amber-400" />
                          <div className="flex-1">
                            <div className="text-sm text-foreground/60 mb-1">Tempo rimanente</div>
                            <div className="text-lg font-bold text-amber-400">
                              {formatTimeRemaining(progress.timeRemaining)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Event Content */}
                    <CardContent className="p-6">
                      {event.type === 'tournament' && progress && 'wins' in progress && (
                        <div className="space-y-6">
                          {/* Tournament Progress */}
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-black/30 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-foreground/60">Vittorie</span>
                                <Trophy className="w-4 h-4 text-amber-400" />
                              </div>
                              <div className="text-2xl font-bold text-foreground mb-1">
                                {progress.wins} / {progress.totalWins}
                              </div>
                              <Progress value={(progress.wins / progress.totalWins) * 100} className="h-2" />
                              <div className="text-xs text-foreground/60 mt-1">
                                {Math.round((progress.wins / progress.totalWins) * 100)}% completato
                              </div>
                            </div>

                            <div className="bg-black/30 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-foreground/60">Classifica</span>
                                <Users className="w-4 h-4 text-blue-400" />
                              </div>
                              <div className="text-2xl font-bold text-foreground mb-1">
                                #{progress.rank}
                              </div>
                              <div className="text-xs text-foreground/60">
                                di {progress.totalParticipants.toLocaleString()} partecipanti
                              </div>
                            </div>

                            <div className="bg-black/30 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-foreground/60">Top</span>
                                <Crown className="w-4 h-4 text-yellow-400" />
                              </div>
                              <div className="text-2xl font-bold text-yellow-400 mb-1">
                                {Math.round((1 - progress.rank / progress.totalParticipants) * 100)}%
                              </div>
                              <div className="text-xs text-foreground/60">
                                dei partecipanti
                              </div>
                            </div>
                          </div>

                          {/* Rewards */}
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-3">Ricompense</h3>
                            <div className="grid md:grid-cols-3 gap-3">
                              {event.rewards.map((reward, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                                  <div className="flex-1">
                                    <div className="text-sm text-foreground/60 mb-1">{reward.condition}</div>
                                    <div className="font-semibold text-foreground">
                                      {reward.type === 'coins' && `${reward.value} monete`}
                                      {reward.type === 'gems' && `${reward.value} gemme`}
                                      {reward.type === 'avatar' && `Avatar ${reward.value}`}
                                      {reward.type === 'skin' && `Skin ${reward.value}`}
                                    </div>
                                  </div>
                                  {progress.wins >= 10 && i === 2 && (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {event.type === 'bonus' && progress && 'dailyLogins' in progress && (
                        <div className="space-y-6">
                          {/* Bonus Progress */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-black/30 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-foreground/60">Login Giornalieri</span>
                                <Calendar className="w-4 h-4 text-green-400" />
                              </div>
                              <div className="text-2xl font-bold text-foreground mb-1">
                                {progress.dailyLogins} / {progress.totalDays}
                              </div>
                              <Progress value={(progress.dailyLogins / progress.totalDays) * 100} className="h-2" />
                            </div>

                            <div className="bg-black/30 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-foreground/60">Partite Giocate</span>
                                <Target className="w-4 h-4 text-blue-400" />
                              </div>
                              <div className="text-2xl font-bold text-foreground mb-1">
                                {progress.gamesPlayed} / {progress.totalGames}
                              </div>
                              <Progress value={Math.min((progress.gamesPlayed / progress.totalGames) * 100, 100)} className="h-2" />
                            </div>
                          </div>

                          {/* Rewards */}
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-3">Ricompense Istantanee</h3>
                            <div className="grid md:grid-cols-2 gap-3">
                              {event.rewards.map((reward, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg">
                                  <div className="flex-1">
                                    <div className="text-sm text-foreground/60 mb-1">{reward.condition}</div>
                                    <div className="font-semibold text-foreground">
                                      {reward.type === 'coins' && `${reward.value} monete`}
                                      {reward.type === 'gems' && `${reward.value} gemme`}
                                    </div>
                                  </div>
                                  {(progress.dailyLogins >= 1 && i === 0) || 
                                   (progress.gamesPlayed >= 5 && i === 1) ? (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                  ) : (
                                    <div className="w-5 h-5 border-2 border-gray-500 rounded-full" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      {isActive && (
                        <div className="mt-6">
                          <Button
                            className="w-full"
                            onClick={() => router.push('/game')}
                          >
                            Partecipa Ora
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            )
          })}

          {/* No Active Events */}
          {activeEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <Calendar className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nessun evento attivo
              </h3>
              <p className="text-foreground/60 mb-6">
                Torna presto per nuovi eventi speciali!
              </p>
              <Button onClick={() => router.push('/game')}>
                Gioca Ora
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
