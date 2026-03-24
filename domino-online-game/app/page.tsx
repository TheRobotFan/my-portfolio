"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DominoTile } from "@/components/game/domino-tile"
import { useRouter } from "next/navigation"
import {
  Play,
  Users,
  Bot,
  Trophy,
  Settings,
  Volume2,
  VolumeX,
  ChevronLeft,
  User,
  Sword,
  Shield,
  Zap,
  ShoppingBag,
  Swords,
  Coins,
  Gem,
  Gift,
  Crown,
  Medal,
  LogIn,
  HelpCircle,
} from "lucide-react"
import { useGameStore, RANK_COLORS, RANK_NAMES } from "@/lib/game-store"
import { useTheme } from "@/hooks/use-theme"
import { useAuth } from "@/hooks/use-auth"
import { GlobalChat } from "@/components/social/chat"

type Screen = "main" | "single" | "settings"

export default function GameMenu() {
  // Applica il tema generale dell'applicazione
  useTheme()

  const { user: authUser } = useAuth()
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>("main")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [aiStyle, setAiStyle] = useState<"aggressive" | "defensive">("defensive")
  const { user, createUser, settings, toggleSound, claimDailyReward, grantBonusCoins, activeEvents, fetchEvents } = useGameStore()
  const [dailyAvailable, setDailyAvailable] = useState(false)

  useEffect(() => {
    if (user) {
      const today = new Date().toDateString()
      setDailyAvailable(user.lastDailyReward !== today)
    }
    fetchEvents()
  }, [user, fetchEvents])

  const startGame = () => {
    if (!user) {
      createUser(`Player${Date.now().toString(36)}`)
      return
    }
    router.push(`/game?mode=single&difficulty=${difficulty}&style=${aiStyle}`)
  }

  const handleClaimDaily = () => {
    const result = claimDailyReward()
    if (result) {
      setDailyAvailable(false)
    }
  }

  const RankIcon = user?.ranked.rank === "grandmaster" || user?.ranked.rank === "master" || user?.ranked.rank === "diamond"
    ? Crown
    : user?.ranked.rank === "gold" || user?.ranked.rank === "platinum"
      ? Medal
      : Shield

  return (
    <div className="min-h-screen bg-game-table relative overflow-hidden">
      {/* Minimal background for maximum mobile performance */}
      <div className="absolute inset-0 opacity-3 pointer-events-none hidden md:block">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20"
        >
          <DominoTile left={6} right={6} size="lg" theme="classic" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -right-10"
        >
          <DominoTile left={3} right={5} size="lg" theme="classic" />
        </motion.div>
      </div>

      {/* Main content - Mobile optimized */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 md:p-6">
        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {/* Currency Display */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-black/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-sm text-foreground">{user.inventory.coins}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 rounded-full px-3 py-1.5 backdrop-blur-sm">
                <Gem className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-foreground">{user.inventory.gems}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Accedi (Prossimamente) Button */}
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="text-foreground/60 cursor-not-allowed"
              title="Accedi (Prossimamente)"
            >
              <LogIn className="w-5 h-5" />
            </Button>
            {/* Daily Reward Button */}
            {user && dailyAvailable && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Button
                  onClick={handleClaimDaily}
                  size="icon"
                  className="bg-amber-500 hover:bg-amber-600 rounded-full relative"
                >
                  <Gift className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                </Button>
              </motion.div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className="text-foreground/80 hover:text-foreground hover:bg-foreground/10"
            >
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
          </div>

          {/* Live Ops Events Banner */}
          <AnimatePresence>
            {activeEvents.length > 0 && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="absolute top-16 left-0 right-0 flex justify-center pointer-events-none z-50"
              >
                <div className="flex flex-wrap justify-center gap-2 px-4 pointer-events-auto">
                  {activeEvents.map((event) => (
                    <Badge
                      key={event.id}
                      variant="outline"
                      className={`px-3 py-1 cursor-help backdrop-blur-md border-0 bg-gradient-to-r shadow-lg shadow-black/20 ${event.type === 'flash_event'
                        ? 'from-purple-600/90 to-pink-600/90'
                        : 'from-blue-600/90 to-cyan-600/90'
                        }`}
                      title={event.description}
                    >
                      <Zap className="w-3 h-3 mr-1.5 fill-white animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-sm">
                        {event.name} {event.xpMultiplier > 1 ? `x${event.xpMultiplier} XP` : ''}
                      </span>
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {screen === "main" && (
            <motion.div
              key="main"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center w-full max-w-md"
            >
              {/* Logo - Mobile optimized */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6 sm:mb-8 text-center"
              >
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="relative w-12 h-24 sm:w-14 sm:h-28 rounded-lg shadow-lg flex flex-col cursor-pointer transition-all" style={{ backgroundColor: '#f5f5dc', borderColor: '#8b7355', borderWidth: '4px', borderStyle: 'solid' }}>
                    <div className="flex-1 p-1 relative" style={{ borderBottomColor: '#1a1a1a', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
                      <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 left-1.5 transform -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 right-1.5 transform -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    </div>
                    <div className="h-0.5 mx-1" style={{ backgroundColor: '#1a1a1a' }}></div>
                    <div className="flex-1 p-1 relative">
                      <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 left-1.5 transform -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 right-1.5 transform -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    </div>
                  </div>
                  <div className="relative w-12 h-24 sm:w-14 sm:h-28 rounded-lg shadow-lg flex flex-col cursor-pointer transition-all" style={{ backgroundColor: '#f5f5dc', borderColor: '#8b7355', borderWidth: '4px', borderStyle: 'solid' }}>
                    <div className="flex-1 p-1 relative" style={{ borderBottomColor: '#1a1a1a', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
                      <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    </div>
                    <div className="h-0.5 mx-1" style={{ backgroundColor: '#1a1a1a' }}></div>
                    <div className="flex-1 p-1 relative">
                      <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-black rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2 tracking-tight">
                  DOMINION
                </h1>
                <p className="text-foreground/60 text-sm sm:text-base md:text-lg">Elite Domino</p>
              </motion.div>

              {/* Login/Player Info Card */}
              {!user ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="w-full mb-6"
                >
                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-4xl mb-4">👤</div>
                    <h3 className="text-lg font-semibold text-white mb-2">Benvenuto in Dominion: Elite Domino!</h3>
                    <p className="text-sm text-white/60 mb-4">
                      Accedi o crea un account per salvare i tuoi progressi e sbloccare achievement
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={() => createUser(`Player${Date.now().toString(36)}`)}
                        className="w-full"
                        size="sm"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Gioca come Ospite
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        size="sm"
                        disabled
                      >
                        Accedi (Prossimamente)
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="w-full mb-6"
                >
                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
                    <div className="text-4xl">
                      {user.inventory.equippedAvatar === "default" ? "👤" :
                        user.inventory.equippedAvatar === "ninja" ? "🥷" :
                          user.inventory.equippedAvatar === "wizard" ? "🧙" :
                            user.inventory.equippedAvatar === "robot" ? "🤖" :
                              user.inventory.equippedAvatar === "alien" ? "👽" :
                                user.inventory.equippedAvatar === "king" ? "👑" :
                                  user.inventory.equippedAvatar === "dragon" ? "🐉" : "👤"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground truncate">{user.username}</p>
                        <Badge variant="secondary" className="text-xs">
                          Lv. {user.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <RankIcon
                          className="w-4 h-4"
                          style={{ color: RANK_COLORS[user.ranked.rank] }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: RANK_COLORS[user.ranked.rank] }}
                        >
                          {RANK_NAMES[user.ranked.rank]} {user.ranked.tier}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.ranked.elo} ELO
                        </span>
                      </div>
                      <Progress
                        value={(user.xp / user.xpToNextLevel) * 100}
                        className="h-1.5 mt-2"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Main Menu buttons - Mobile optimized */}
              <div className="flex flex-col gap-2 sm:gap-3 w-full">
                <Button
                  onClick={() => setScreen("single")}
                  size="lg"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg gap-2 sm:gap-3 bg-primary hover:bg-primary/90 touch-manipulation"
                  disabled={!user}
                >
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="truncate">{user ? "Gioca vs AI" : "Accedi per Giocare"}</span>
                </Button>

                <Button
                  onClick={() => router.push("/ranked")}
                  size="lg"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg gap-2 sm:gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 touch-manipulation"
                  disabled={!user}
                >
                  <Swords className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="truncate">{user ? "Classificate" : "Accedi per Classificate"}</span>
                </Button>

                <Button
                  onClick={() => router.push("/multiplayer")}
                  size="lg"
                  variant="secondary"
                  className="w-full h-12 sm:h-14 text-base sm:text-lg gap-2 sm:gap-3 touch-manipulation"
                  disabled={!user}
                >
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="truncate">{user ? "Multiplayer" : "Accedi per Multiplayer"}</span>
                </Button>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Button
                      onClick={() => router.push("/shop")}
                      size="lg"
                      variant="outline"
                      className="w-full h-10 sm:h-12 gap-1 sm:gap-2 bg-transparent border-foreground/20 text-foreground hover:bg-foreground/10 touch-manipulation text-xs sm:text-sm"
                      disabled={!user}
                    >
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">{user ? "Negozio" : "Accedi"}</span>
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={() => router.push("/ranking")}
                      size="lg"
                      variant="outline"
                      className="w-full h-10 sm:h-12 gap-1 sm:gap-2 bg-transparent border-foreground/20 text-foreground hover:bg-foreground/10 touch-manipulation text-xs sm:text-sm"
                    >
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">Classifica</span>
                    </Button>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <Button
                    onClick={() => router.push("/social/clans")}
                    size="lg"
                    className="w-full h-12 sm:h-14 text-base sm:text-lg gap-2 sm:gap-3 bg-purple-600/20 border-purple-500/50 text-purple-400 hover:bg-purple-600/30 touch-manipulation"
                    disabled={!user}
                  >
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="truncate">{user ? "Il Tuo Club" : "Accedi per i Club"}</span>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => router.push("/profile")}
                    size="lg"
                    variant="ghost"
                    className="w-full h-10 sm:h-12 gap-2 sm:gap-3 text-foreground/70 hover:text-foreground hover:bg-foreground/10 touch-manipulation text-xs sm:text-sm"
                    disabled={!user}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate">{user ? "Profilo" : "Accedi"}</span>
                  </Button>
                </motion.div>

                {/* Bonus Coins Button - Solo per sviluppo */}
                {process.env.NODE_ENV === 'development' && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.55 }}
                  >
                    <Button
                      onClick={() => grantBonusCoins()}
                      size="lg"
                      variant="outline"
                      className="w-full h-10 sm:h-12 gap-2 sm:gap-3 bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30 touch-manipulation text-xs sm:text-sm"
                      disabled={!user}
                    >
                      <Coins className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">+2000 Monete (Dev)</span>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {screen === "single" && (
            <motion.div
              key="single"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md"
            >
              {/* Back button */}
              <Button
                variant="ghost"
                onClick={() => setScreen("main")}
                className="mb-8 text-foreground/70 hover:text-foreground hover:bg-foreground/10"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Indietro
              </Button>

              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Gioca vs AI
              </h2>

              {/* Difficulty selection */}
              <div className="mb-8">
                <p className="text-foreground/70 mb-4 text-center">Difficolta</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "easy", label: "Facile", icon: Shield, color: "bg-green-500/20 border-green-500/50 text-green-400" },
                    { value: "medium", label: "Medio", icon: Zap, color: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400" },
                    { value: "hard", label: "Difficile", icon: Sword, color: "bg-red-500/20 border-red-500/50 text-red-400" },
                  ].map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value as "easy" | "medium" | "hard")}
                      className={`p-4 rounded-xl border-2 transition-all ${difficulty === d.value
                        ? d.color
                        : "bg-foreground/5 border-foreground/10 text-foreground/60 hover:border-foreground/30"
                        }`}
                    >
                      <d.icon className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Style selection */}
              <div className="mb-10">
                <p className="text-foreground/70 mb-4 text-center">Stile AI</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "aggressive", label: "Aggressivo", desc: "Gioca veloce", icon: Sword },
                    { value: "defensive", label: "Difensivo", desc: "Gioca strategico", icon: Shield },
                  ].map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setAiStyle(s.value as "aggressive" | "defensive")}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${aiStyle === s.value
                        ? "bg-primary/20 border-primary/50 text-primary"
                        : "bg-foreground/5 border-foreground/10 text-foreground/60 hover:border-foreground/30"
                        }`}
                    >
                      <s.icon className="w-6 h-6 mb-2" />
                      <p className="font-medium">{s.label}</p>
                      <p className="text-xs opacity-70">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start button */}
              <Button
                onClick={startGame}
                size="lg"
                className="w-full h-16 text-xl gap-3"
              >
                <Play className="w-6 h-6" />
                Inizia Partita
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Chat Overlay */}
        {user && <GlobalChat />}

        {/* Version */}
        <div className="absolute bottom-4 left-4 text-foreground/30 text-sm">
          v2.0.0
        </div>
      </div>
    </div>
  )
}
