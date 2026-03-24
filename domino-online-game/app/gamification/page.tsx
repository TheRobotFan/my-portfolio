'use client'

import React, { useEffect } from 'react'
import { useGameStore } from '@/lib/game-store'
import { useGamificationStore } from '@/lib/game-store-extended'
import ProfileCard from '@/components/gamification/profile-card'
import AchievementsGrid from '@/components/gamification/achievements-grid'
import LeaderboardTable from '@/components/gamification/leaderboard-table'
import ChallengesPanel from '@/components/gamification/challenges-panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Star, Target, Gift, Users } from 'lucide-react'

export default function GamificationPage() {
  const { user } = useGameStore()
  const { fetchUserProgress, userProgress } = useGamificationStore()

  useEffect(() => {
    if (user?.id) {
      fetchUserProgress(user.id)
    }
  }, [user?.id, fetchUserProgress])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-96 bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-semibold mb-2">Accesso Richiesto</h2>
          <p className="text-gray-600">
            Effettua il login per accedere al sistema di gamification.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Trophy className="h-10 w-10 text-yellow-500" />
            Centro Gamification
          </h1>
          <p className="text-lg text-gray-600">
            Sblocca achievement, guadagna badge e scala le classifiche!
          </p>
        </div>

        {/* User Profile */}
        <ProfileCard 
          userId={user.id}
          username={user.username}
          avatar={user.avatar}
        />

        {/* Main Content */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Profilo
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Achievement
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Classifiche
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Sfide
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Premi
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Statistiche Personali
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userProgress && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {userProgress.level}
                          </div>
                          <div className="text-sm text-muted-foreground">Livello</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {userProgress.totalXP.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">XP Totale</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {userProgress.stats.totalWins}
                          </div>
                          <div className="text-sm text-muted-foreground">Vittorie</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {userProgress.streak.current}
                          </div>
                          <div className="text-sm text-muted-foreground">Streak Attuale</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Progresso Rapido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Prossima settimana</span>
                        <span className="text-muted-foreground">3 giorni</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Prossimo mese</span>
                        <span className="text-muted-foreground">18 giorni</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Prossimo livello</span>
                        <span className="text-muted-foreground">
                          {userProgress ? `${100 - Math.round((userProgress.xp / 100) * 100)}%` : '0%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: userProgress ? `${userProgress.xp}%` : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
            
          <TabsContent value="achievements">
            <AchievementsGrid userId={user.id} />
          </TabsContent>
            
          <TabsContent value="leaderboard">
            <LeaderboardTable userId={user.id} />
          </TabsContent>
            
          <TabsContent value="challenges">
            <ChallengesPanel userId={user.id} />
          </TabsContent>
            
          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  I Tuoi Premi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎁</div>
                  <h3 className="text-lg font-semibold mb-2">Nessun premio disponibile</h3>
                  <p className="text-muted-foreground">
                    Completa le sfide e sblocca achievement per guadagnare premi esclusivi!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
