"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Edit,
  LogOut,
  Settings,
  Trophy,
  TrendingUp,
  Star,
  BookOpen,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface UserProfileClientProps {
  user: {
    id: string
    full_name: string
    first_name?: string
    last_name?: string
    email: string
    role: string
    bio: string | null
    city?: string | null
    phone?: string | null
    birth_date?: string | null
    avatar_url: string | null
    xp_points: number
    level: number
    created_at: string
  }
  badges: Array<{
    id: string
    earned_at: string
    badge: {
      id: string
      name: string
      description: string
      icon_url: string | null
    }
  }>
  isOwnProfile: boolean
}

export function UserProfileClient({ user, badges, isOwnProfile }: UserProfileClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userStats, setUserStats] = useState({
    contributions: 0,
    discussions: 0,
    exercises: 0,
    comments: 0,
    quizzes: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    loadUserStats()
  }, [user.id])

  async function loadUserStats() {
    const { count: materialsCount } = await supabase
      .from("materials")
      .select("*", { count: "exact", head: true })
      .eq("uploaded_by", user.id)

    const { count: exercisesCount } = await supabase
      .from("exercises")
      .select("*", { count: "exact", head: true })
      .eq("created_by", user.id)

    const { count: discussionsCount } = await supabase
      .from("forum_discussions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    const { count: commentsCount } = await supabase
      .from("forum_comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    const { count: quizzesCount } = await supabase
      .from("quiz_attempts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    setUserStats({
      contributions: (materialsCount || 0) + (exercisesCount || 0),
      discussions: discussionsCount || 0,
      exercises: exercisesCount || 0,
      comments: commentsCount || 0,
      quizzes: quizzesCount || 0,
    })
  }

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const joinDate = new Date(user.created_at).toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  })

  const xpForCurrentLevel = (user.level - 1) * 500
  const xpForNextLevel = user.level * 500
  const xpProgress = user.xp_points - xpForCurrentLevel
  const xpNeeded = xpForNextLevel - xpForCurrentLevel
  const progressPercentage = Math.min((xpProgress / xpNeeded) * 100, 100)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-3xl text-white font-bold">
                  {user.avatar_url || (user.first_name || user.full_name).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{user.full_name}</h1>
                  <p className="text-foreground/70 mb-4">{user.bio || "Nessuna biografia"}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-foreground/60">Ruolo: </span>
                      <span className="font-semibold capitalize">
                        {user.role === "student" ? "Studente" : user.role}
                      </span>
                    </div>
                    {user.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-foreground/60" />
                        <span className="font-semibold">{user.city}</span>
                      </div>
                    )}
                    {user.birth_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-foreground/60" />
                        <span className="font-semibold">{new Date(user.birth_date).toLocaleDateString("it-IT")}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-foreground/60">Membro da: </span>
                      <span className="font-semibold">{joinDate}</span>
                    </div>
                    {isOwnProfile && user.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-foreground/60" />
                        <span className="font-semibold">{user.phone}</span>
                      </div>
                    )}
                    {isOwnProfile && (
                      <div>
                        <span className="text-foreground/60">Email: </span>
                        <span className="font-semibold">{user.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {isOwnProfile && (
                <div className="flex flex-col gap-2">
                  <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => router.push("/utente/edit")}>
                    <Edit className="w-4 h-4" />
                    Modifica Profilo
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Settings className="w-4 h-4" />
                    Impostazioni
                  </Button>
                  <Button variant="destructive" className="gap-2" onClick={handleLogout} disabled={isLoading}>
                    <LogOut className="w-4 h-4" />
                    {isLoading ? "Uscita..." : "Logout"}
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Livello {user.level}</span>
                <span className="text-sm text-foreground/60">
                  {user.xp_points} / {xpForNextLevel} XP
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-foreground/50 mt-1">{xpNeeded - xpProgress} XP al prossimo livello</p>
            </div>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">XP Totali</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{user.xp_points || 0}</p>
            <p className="text-sm text-foreground/60 mt-2">Livello {user.level || 1}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold">Discussioni</h3>
            </div>
            <p className="text-3xl font-bold text-secondary">{userStats.discussions}</p>
            <p className="text-sm text-foreground/60 mt-2">create</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold">Contributi</h3>
            </div>
            <p className="text-3xl font-bold text-orange-500">{userStats.contributions}</p>
            <p className="text-sm text-foreground/60 mt-2">totali</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold">Badge</h3>
            </div>
            <p className="text-3xl font-bold text-amber-500">{badges.length}</p>
            <p className="text-sm text-foreground/60 mt-2">sbloccati</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Quiz</h3>
            </div>
            <p className="text-3xl font-bold text-blue-500">{userStats.quizzes}</p>
            <p className="text-sm text-foreground/60 mt-2">completati</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full md:w-auto md:grid-cols-3 mb-6">
            <TabsTrigger value="badges">Badge</TabsTrigger>
            <TabsTrigger value="activity">Attività</TabsTrigger>
            {isOwnProfile && <TabsTrigger value="settings">Impostazioni</TabsTrigger>}
          </TabsList>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">{isOwnProfile ? "I tuoi Badge" : "Badge"}</h2>
              {badges.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {badges.map((userBadge) => (
                    <div
                      key={userBadge.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="text-5xl">{userBadge.badge.icon_url || "🏆"}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{userBadge.badge.name}</h3>
                        <p className="text-sm text-foreground/60">{userBadge.badge.description}</p>
                        <p className="text-xs text-foreground/50 mt-1">
                          Sbloccato: {new Date(userBadge.earned_at).toLocaleDateString("it-IT")}
                        </p>
                      </div>
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-foreground/60">
                    {isOwnProfile
                      ? "Nessun badge sbloccato ancora. Continua a contribuire per guadagnare badge!"
                      : "Questo utente non ha ancora sbloccato badge."}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Statistiche Dettagliate</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Contributi</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Appunti caricati</span>
                      <span className="font-bold">{userStats.contributions - userStats.exercises}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Esercizi creati</span>
                      <span className="font-bold">{userStats.exercises}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Discussioni avviate</span>
                      <span className="font-bold">{userStats.discussions}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Commenti scritti</span>
                      <span className="font-bold">{userStats.comments}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Progressi</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Quiz completati</span>
                      <span className="font-bold">{userStats.quizzes}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Badge sbloccati</span>
                      <span className="font-bold">{badges.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Livello attuale</span>
                      <span className="font-bold">{user.level}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">XP totali</span>
                      <span className="font-bold">{user.xp_points}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab - Only for own profile */}
          {isOwnProfile && (
            <TabsContent value="settings">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Impostazioni Profilo</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Notifiche Email</label>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <span className="text-sm text-foreground/70">Ricevi notifiche di nuovi contenuti</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Visibilità Profilo</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground">
                      <option>Pubblico</option>
                      <option>Solo Compagni di Classe</option>
                      <option>Privato</option>
                    </select>
                  </div>
                  <Button className="gap-2 bg-primary hover:bg-primary/90">Salva Impostazioni</Button>
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
