"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useGameStore, RANK_COLORS, RANK_NAMES } from "@/lib/game-store"
import { useTheme } from "@/hooks/use-theme"
import Link from "next/link"
import {
  ArrowLeft,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Award,
  User,
  Edit2,
  Save,
  Crown,
  Coins,
  Gem,
  Star,
  Shield,
  Medal,
  Zap,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const avatars = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-teal-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-pink-500",
]

export default function ProfilePage() {
  // Applica il tema generale dell'applicazione
  useTheme()

  const { user, setUser } = useGameStore()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(0)

  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setSelectedAvatar(avatars.indexOf(user.avatar) || 0)
    }
  }, [user])

  const handleSave = () => {
    if (user && username.trim()) {
      setUser({
        ...user,
        username: username.trim(),
        avatar: avatars[selectedAvatar],
      })
      setIsEditing(false)
    }
  }

  const winRate = user && user.stats.gamesPlayed > 0
    ? Math.round((user.stats.wins / user.stats.gamesPlayed) * 100)
    : 0

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
          <h1 className="font-bold text-xl text-foreground">Profilo</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`w-24 h-24 rounded-2xl ${user?.avatar || avatars[0]} flex items-center justify-center border-4 border-white/10 shadow-xl`}>
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="text-xl font-bold mb-1"
                            placeholder="Il tuo nome"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-3xl font-black italic tracking-tighter uppercase">{user?.username || "Ospite"}</CardTitle>
                          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                            Lv. {user?.level || 1}
                          </Badge>
                        </div>
                      )}
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 font-bold text-yellow-500">
                          <Coins className="w-4 h-4" />
                          {user?.inventory.coins || 0}
                        </span>
                        <span className="flex items-center gap-1.5 font-bold text-cyan-400">
                          <Gem className="w-4 h-4" />
                          {user?.inventory.gems || 0}
                        </span>
                      </CardDescription>

                      {user && (
                        <div className="mt-4 w-full max-w-[200px]">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground mb-1">
                            <span>Progresso XP</span>
                            <span>{user.xp} / {user.xpToNextLevel}</span>
                          </div>
                          <Progress value={(user.xp / user.xpToNextLevel) * 100} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salva
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Modifica
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>

              {isEditing && (
                <CardContent>
                  <Label className="text-sm text-muted-foreground mb-3 block">
                    Scegli avatar
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {avatars.map((avatar, index) => (
                      <button
                        key={avatar}
                        onClick={() => setSelectedAvatar(index)}
                        className={`w-12 h-12 rounded-xl ${avatar} flex items-center justify-center transition-all ${selectedAvatar === index
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                            : "opacity-70 hover:opacity-100"
                          }`}
                      >
                        <User className="w-6 h-6 text-white" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>

          {/* Rank Section */}
          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Card className="overflow-hidden border-2" style={{ borderColor: RANK_COLORS[user.ranked.rank] + '44' }}>
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: RANK_COLORS[user.ranked.rank] }}
                />
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center border-4"
                      style={{
                        backgroundColor: RANK_COLORS[user.ranked.rank] + '22',
                        borderColor: RANK_COLORS[user.ranked.rank]
                      }}
                    >
                      <Trophy className="w-8 h-8" style={{ color: RANK_COLORS[user.ranked.rank] }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Rango Attuale</p>
                      <h3
                        className="text-2xl font-black italic uppercase"
                        style={{ color: RANK_COLORS[user.ranked.rank] }}
                      >
                        {RANK_NAMES[user.ranked.rank]} {user.ranked.tier}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black italic">{user.ranked.elo}</p>
                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Punti Elo</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{user?.stats.wins || 0}</p>
                <p className="text-sm text-muted-foreground">Vittorie</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{user?.stats.losses || 0}</p>
                <p className="text-sm text-muted-foreground">Sconfitte</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">{user?.stats.streak || 0}</p>
                <p className="text-sm text-muted-foreground">Serie attuale</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground">{winRate}%</p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Badges & Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Badge & Achievements
                </CardTitle>
                <CardDescription>
                  {user?.achievements.length || 0} Achievement sbloccati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-xl flex items-center justify-center border-2 transition-all ${i <= (user?.achievements.length || 0)
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-muted/50 border-muted text-muted-foreground opacity-40 grayscale"
                        }`}
                      title={i <= (user?.achievements.length || 0) ? "Badge Sbloccato" : "Ancora bloccato"}
                    >
                      {i === 1 ? <Crown className="w-6 h-6" /> :
                        i === 2 ? <Flame className="w-6 h-6" /> :
                          i === 3 ? <Zap className="w-6 h-6" /> :
                            i === 4 ? <Shield className="w-6 h-6" /> :
                              i === 5 ? <Medal className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-xs font-bold uppercase tracking-widest" asChild>
                  <Link href="/achievements">Visualizza tutti gli achievement</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Statistiche Dettagliate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Partite giocate</span>
                  <span className="font-semibold text-foreground">{user?.stats.gamesPlayed || 0}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Serie migliore</span>
                  <span className="font-semibold text-foreground">{user?.stats.highestStreak || 0}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">Punti totali</span>
                  <span className="font-semibold text-foreground">{user?.stats.totalPoints || 0}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
