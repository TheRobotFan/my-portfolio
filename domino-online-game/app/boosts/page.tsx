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
  Zap,
  Clock,
  Star,
  Trophy,
  Gem,
  Target,
  Flame,
  Timer,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Award,
  Shield,
  Heart,
  Gift,
  Rocket,
  Infinity
} from "lucide-react"

export default function BoostsPage() {
  const [selectedBoost, setSelectedBoost] = useState<string | null>(null)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [activeBoosts, setActiveBoosts] = useState<any[]>([])
  
  const { user } = useAuthStore()
  const router = useRouter()

  const availableBoosts = [
    {
      id: 'xp_boost_24h',
      name: 'Boost XP 24h',
      description: '+50% esperienza per 24 ore',
      price: 25,
      duration: 24 * 60 * 60 * 1000, // 24 hours in ms
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      category: 'xp',
      type: 'time_based',
      effect: '+50% XP',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'double_reward_once',
      name: 'Raddoppio Ricompense',
      description: 'Raddoppio ricompense fine partita (una volta)',
      price: 8,
      duration: 0, // One-time
      icon: <Gift className="w-8 h-8 text-purple-400" />,
      category: 'rewards',
      type: 'one_time',
      effect: '2x ricompense',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'streak_bonus_1h',
      name: 'Bonus Streak 1h',
      description: '+25% bonus streak per 1 ora',
      price: 15,
      duration: 60 * 60 * 1000, // 1 hour in ms
      icon: <Flame className="w-8 h-8 text-orange-400" />,
      category: 'streak',
      type: 'time_based',
      effect: '+25% streak',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'daily_bonus_12h',
      name: 'Bonus Giornaliero 12h',
      description: '+20% bonus giornaliero per 12 ore',
      price: 20,
      duration: 12 * 60 * 60 * 1000, // 12 hours in ms
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      category: 'daily',
      type: 'time_based',
      effect: '+20% bonus',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'achievement_master',
      name: 'Maestro degli Achievement',
      description: '+100% bonus achievement per 48h',
      price: 30,
      duration: 48 * 60 * 60 * 1000, // 48 hours in ms
      icon: <Award className="w-8 h-8 text-cyan-400" />,
      category: 'achievement',
      type: 'time_based',
      effect: '+100% achievement',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'login_streak_3d',
      name: 'Streak Login 3 giorni',
      description: 'Protegge streak login per 3 giorni',
      price: 12,
      duration: 3 * 24 * 60 * 60 * 1000, // 3 days in ms
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      category: 'login',
      type: 'time_based',
      effect: 'Protezione streak',
      color: 'from-blue-500 to-blue-600'
    }
  ]

  const handlePurchase = async (boostId: string, price: number) => {
    if (!user) {
      router.push("/auth")
      return
    }

    if (user.inventory.gems < price) {
      return
    }

    setSelectedBoost(boostId)
    setIsPurchasing(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add to active boosts
      const boost = availableBoosts.find(b => b.id === boostId)
      if (boost) {
        const endTime = boost.duration > 0 
          ? new Date(Date.now() + boost.duration).toISOString()
          : null
        
        setActiveBoosts(prev => [
          ...prev.filter(b => b.id !== boostId), // Remove expired boosts of same type
          {
            ...boost,
            purchasedAt: new Date().toISOString(),
            endTime,
            isActive: true
          }
        ])
      }
      
      // Deduct gems (this would be handled by the auth store)
      
    } catch (error) {
      console.error("Purchase failed:", error)
    } finally {
      setIsPurchasing(false)
      setSelectedBoost(null)
    }
  }

  const getBoostTimeRemaining = (endTime: string | null) => {
    if (!endTime) return null
    
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return null
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { hours, minutes }
  }

  const isBoostActive = (boostId: string) => {
    return activeBoosts.some(b => b.id === boostId && b.isActive)
  }

  const isBoostExpired = (boostId: string) => {
    const boost = activeBoosts.find(b => b.id === boostId)
    if (!boost || !boost.endTime) return false
    
    return new Date() > new Date(boost.endTime)
  }

  useEffect(() => {
    // Clean up expired boosts
    const interval = setInterval(() => {
      setActiveBoosts(prev => prev.filter(b => {
        if (!b.endTime) return true // Keep one-time boosts
        return new Date() <= new Date(b.endTime)
      }))
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-game-table">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 opacity-20"
        >
          <Zap className="w-48 h-48 text-amber-400" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 opacity-20"
        >
          <Rocket className="w-48 h-48 text-cyan-400" />
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
            <Badge className="bg-gradient-to-r from-cyan-500 to-green-500 text-white">
              Boost
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
            <Zap className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              BOOST TIME-BASED
            </h1>
            <Zap className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <p className="text-xl text-foreground/80 mb-4">
            Potenziamenti temporanei per accelerare la progressione
          </p>
          <p className="text-sm text-foreground/60 italic">
            "Nessun vantaggio in match, solo progressione"
          </p>
        </motion.div>

        {/* Active Boosts */}
        {activeBoosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border-green-700/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-400" />
                  Boost Attivi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {activeBoosts.map((boost, index) => {
                    const timeRemaining = getBoostTimeRemaining(boost.endTime)
                    return (
                      <div key={boost.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-gradient-to-r ${boost.color} bg-opacity-20`}>
                            {boost.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{boost.name}</div>
                            <div className="text-sm text-foreground/60">{boost.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          {timeRemaining ? (
                            <div className="text-sm font-bold text-amber-400">
                              {timeRemaining.hours}h {timeRemaining.minutes}m
                            </div>
                          ) : (
                            <div className="text-sm text-green-400">Attivo</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Boosts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {availableBoosts.map((boost, index) => {
            const isActive = isBoostActive(boost.id)
            const isExpired = isBoostExpired(boost.id)
            const isRegistered = isActive || isExpired
            
            return (
              <motion.div
                key={boost.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${boost.color} bg-opacity-10 border-opacity-30 overflow-hidden h-full relative ${
                  isActive ? 'ring-2 ring-green-500/50' : ''
                } ${isExpired ? 'opacity-50' : ''}`}>
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white text-xs">
                        ATTIVO
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`p-4 rounded-full bg-gradient-to-r ${boost.color} bg-opacity-20`}>
                        {boost.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2 text-center">
                      {boost.name}
                    </h3>
                    <p className="text-foreground/80 text-sm text-center mb-4">
                      {boost.description}
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Gem className="w-5 h-5 text-cyan-400" />
                      <span className="text-2xl font-bold text-cyan-400">{boost.price}</span>
                    </div>
                    
                    {boost.duration > 0 && (
                      <div className="text-center text-sm text-foreground/60 mb-4">
                        Durata: {boost.duration / (60 * 60 * 1000)} ore
                      </div>
                    )}
                    
                    <Button
                      onClick={() => handlePurchase(boost.id, boost.price)}
                      disabled={isRegistered || isPurchasing || (!user) || (user.inventory?.gems < boost.price)}
                      className={`w-full ${
                        isRegistered 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600'
                      }`}
                    >
                      {isPurchasing && selectedBoost === boost.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                        />
                      ) : isExpired ? (
                        "Scaduto"
                      ) : isRegistered ? (
                        "Già Attivo"
                      ) : !user ? (
                        "Accedi per Acquistare"
                      ) : user.inventory?.gems < boost.price ? (
                        `Gemme Insufficient (${boost.price})`
                      ) : (
                        <>
                          <Gem className="w-4 h-4 mr-2" />
                          Acquista
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
              <h3 className="text-lg font-semibold text-foreground mb-4">Informazioni Boost</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Time-based</h4>
                  <p className="text-foreground/60">Durata limitata, nessun vantaggio permanente</p>
                  <p className="text-foreground/60">5-30 gemme per boost</p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">One-time</h4>
                  <p className="text-foreground/60">Uso singolo, effetto immediato</p>
                  <p className="text-foreground/60">5-10 gemme</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm mt-4">
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">XP Boost</h4>
                  <p className="text-foreground/60">+50% esperienza</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-400 mb-2">Reward Boost</h4>
                  <p className="text-foreground/60">2x ricompense</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-400 mb-2">Streak Boost</h4>
                  <p className="text-foreground/60">+25% bonus</p>
                </div>
              </div>
              <p className="text-xs text-foreground/60 mt-4">
                I boost sono perfetti per accelerare la progressione senza influenzare sull'equilibrio del gioco
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
