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
  Crown,
  Gem,
  Users,
  Clock,
  Target,
  Award,
  Star,
  Zap,
  Shield,
  Flame,
  Timer,
  CheckCircle,
  Swords,
  Medal,
  Diamond
} from "lucide-react"

export default function EliteTournamentsPage() {
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [userTournaments, setUserTournaments] = useState<any[]>([])
  
  const { user } = useAuthStore()
  const router = useRouter()

  const eliteTournaments = [
    {
      id: 'elite_1',
      name: 'Torneo Corona d\'Oro',
      description: 'Torneo esclusivo con premi leggendari',
      entryFee: 60,
      maxParticipants: 64,
      currentParticipants: 48,
      prizePool: 3840,
      rewards: [
        { position: 1, reward: 'Skin Corona Dorata + 500 gemme', type: 'cosmetic' },
        { position: 2, reward: 'Badge Elite + 300 gemme', type: 'cosmetic' },
        { position: 3, reward: 'Cornice Platino + 200 gemme', type: 'cosmetic' },
        { position: '4-8', reward: '100 gemme', type: 'gems' },
        { position: '9-16', reward: '50 gemme', type: 'gems' }
      ],
      status: 'active',
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date(Date.now() + 7200000).toISOString(),
      format: 'elimination',
      skillLevel: 'master'
    },
    {
      id: 'elite_2',
      name: 'Sfida dei Campioni',
      description: 'Torneo per i migliori giocatori',
      entryFee: 45,
      maxParticipants: 128,
      currentParticipants: 96,
      prizePool: 5760,
      rewards: [
        { position: 1, reward: 'Skin Campione + 800 gemme', type: 'cosmetic' },
        { position: 2, reward: 'Badge Campione + 500 gemme', type: 'cosmetic' },
        { position: 3, reward: 'Cornice Campione + 300 gemme', type: 'cosmetic' },
        { position: '4-8', reward: '150 gemme', type: 'gems' },
        { position: '9-16', reward: '75 gemme', type: 'gems' }
      ],
      status: 'upcoming',
      startTime: new Date(Date.now() + 1800000).toISOString(),
      endTime: new Date(Date.now() + 5400000).toISOString(),
      format: 'round_robin',
      skillLevel: 'grandmaster'
    },
    {
      id: 'elite_3',
      name: 'Torneo Velocità',
      description: 'Partite veloci con timer ridotto',
      entryFee: 30,
      maxParticipants: 32,
      currentParticipants: 24,
      prizePool: 960,
      rewards: [
        { position: 1, reward: 'Skin Fulmine + 200 gemme', type: 'cosmetic' },
        { position: 2, reward: 'Badge Velocità + 150 gemme', type: 'cosmetic' },
        { position: 3, reward: 'Cornice Velocità + 100 gemme', type: 'cosmetic' },
        { position: '4-8', reward: '50 gemme', type: 'gems' }
      ],
      status: 'active',
      startTime: new Date(Date.now() - 1800000).toISOString(),
      endTime: new Date(Date.now() + 1800000).toISOString(),
      format: 'swiss',
      skillLevel: 'diamond'
    }
  ]

  const handleRegister = async (tournamentId: string, entryFee: number) => {
    if (!user) {
      router.push("/auth")
      return
    }

    if (user.inventory.gems < entryFee) {
      return
    }

    setSelectedTournament(tournamentId)
    setIsRegistering(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Add to user tournaments
      setUserTournaments(prev => [...prev, {
        tournamentId,
        registeredAt: new Date().toISOString(),
        status: 'registered'
      }])
      
      // Deduct gems
      // This would be handled by the auth store
      
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsRegistering(false)
      setSelectedTournament(null)
    }
  }

  const getTimeRemaining = (endTime: string) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return { hours: 0, minutes: 0 }
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { hours, minutes }
  }

  const isRegistered = (tournamentId: string) => {
    return userTournaments.some(t => t.tournamentId === tournamentId)
  }

  const getTournamentStatus = (tournament: any) => {
    const now = new Date()
    const start = new Date(tournament.startTime)
    const end = new Date(tournament.endTime)
    
    if (now < start) return 'upcoming'
    if (now >= start && now <= end) return 'active'
    return 'finished'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'from-blue-500 to-blue-600'
      case 'active': return 'from-green-500 to-green-600'
      case 'finished': return 'from-gray-500 to-gray-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'In Arrivo'
      case 'active': return 'In Corso'
      case 'finished': return 'Terminato'
      default: return 'Sconosciuto'
    }
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
          <Crown className="w-48 h-48 text-amber-400" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 opacity-20"
        >
          <Swords className="w-48 h-48 text-purple-400" />
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
            <Link href="/tournaments">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tornei
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-amber-500 text-white">
              Elite
            </Badge>
            {user && (
              <div className="flex items-center gap-1 bg-black/30 rounded-full px-3 py-1 backdrop-blur-sm">
                <Gem className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-bold">{user.inventory?.gems || 0}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Diamond className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
              TORNEI ELITE
            </h1>
            <Diamond className="w-12 h-12 text-purple-400" />
          </motion.div>
          <p className="text-xl text-foreground/80 mb-4">
            Competi con i migliori per premi esclusivi
          </p>
          <p className="text-sm text-foreground/60 italic">
            "Stessa skill, nessun vantaggio in match"
          </p>
        </motion.div>

        {/* Tournaments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {eliteTournaments.map((tournament, index) => {
            const status = getTournamentStatus(tournament)
            const timeRemaining = getTimeRemaining(tournament.endTime)
            const registered = isRegistered(tournament.id)
            
            return (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${getStatusColor(status)} bg-opacity-10 border-opacity-30 overflow-hidden h-full relative ${
                  registered ? 'ring-2 ring-purple-500/50' : ''
                }`}>
                  {registered && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-purple-500 text-white text-xs">
                        REGISTRATO
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${getStatusColor(status)} bg-opacity-20`}>
                          <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {tournament.name}
                          </h3>
                          <p className="text-foreground/80 text-sm">
                            {tournament.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                          {getStatusText(status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Tournament Details */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-foreground/60 text-sm">Partecipanti</span>
                          <Users className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {tournament.currentParticipants} / {tournament.maxParticipants}
                        </div>
                        <Progress 
                          value={(tournament.currentParticipants / tournament.maxParticipants) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="bg-black/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-foreground/60 text-sm">Premi Totali</span>
                          <Gem className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div className="text-2xl font-bold text-cyan-400 mb-1">
                          {tournament.prizePool.toLocaleString()}
                        </div>
                        <div className="text-xs text-foreground/60">
                          {tournament.maxParticipants} × {tournament.entryFee} gemme
                        </div>
                      </div>
                    </div>

                    {/* Time Info */}
                    <div className="bg-black/30 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground/60 text-sm">Tempo rimanente</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-lg font-bold text-amber-400">
                        {timeRemaining.hours}h {timeRemaining.minutes}m
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">Premi</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {tournament.rewards.map((reward, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-black/20 rounded">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                                {reward.position}
                              </div>
                              <div>
                                <div className="text-sm text-foreground">
                                  {reward.reward}
                                </div>
                                <div className="text-xs text-foreground/60">
                                  {reward.type === 'cosmetic' ? 'Cosmetico' : reward.type === 'gems' ? 'Gemme' : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleRegister(tournament.id, tournament.entryFee)}
                      disabled={registered || isRegistering || (!user) || (user.inventory?.gems < tournament.entryFee)}
                      className={`w-full ${
                        registered 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-gradient-to-r from-purple-500 to-amber-500 hover:from-purple-600 hover:to-amber-600'
                      }`}
                    >
                      {isRegistering && selectedTournament === tournament.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                        />
                      ) : registered ? (
                        "Già Registrato"
                      ) : !user ? (
                        "Accedi per Partecipare"
                      ) : user.inventory?.gems < tournament.entryFee ? (
                        `Gemme Insufficient (${tournament.entryFee})`
                      ) : (
                        <>
                          <Gem className="w-4 h-4 mr-2" />
                          Partecipa ({tournament.entryFee} gemme)
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Card className="bg-card/60 backdrop-blur-sm border-border/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Informazioni Tornei Elite</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">Format</h4>
                  <p className="text-foreground/60">Eliminazione, Round Robin, Swiss</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Skill Level</h4>
                  <p className="text-foreground/60">Master, Grandmaster, Diamond</p>
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Premi</h4>
                  <p className="text-foreground/60">Solo cosmetici e gemme</p>
                </div>
              </div>
              <p className="text-xs text-foreground/60 mt-4">
                I tornei Elite offrono competizione ad alto livello senza vantaggi nel gameplay
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
