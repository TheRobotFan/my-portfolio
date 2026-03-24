'use client'

import React, { useEffect, useState } from 'react'
import { useGameStore } from '@/lib/game-store-integrated'
import { useGamificationStore } from '@/lib/game-store-extended'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Trophy, Star, Zap, Target, Gift, TrendingUp, Award } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface GamificationOverlayProps {
  show?: boolean
  compact?: boolean
}

export default function GamificationOverlay({ show = true, compact = false }: GamificationOverlayProps) {
  const { user } = useGameStore()
  const { 
    userProgress, 
    fetchUserProgress, 
    getLevelProgress, 
    getRankInfo,
    getUnlockedAchievements,
    getActiveChallenges,
    getUnclaimedRewards
  } = useGamificationStore()

  const [showAchievementNotification, setShowAchievementNotification] = useState(false)
  const [lastAchievement, setLastAchievement] = useState<any>(null)

  useEffect(() => {
    if (user?.id) {
      fetchUserProgress(user.id)
    }
  }, [user?.id, fetchUserProgress])

  // Monitor for new achievements
  useEffect(() => {
    const unlockedAchievements = getUnlockedAchievements()
    if (unlockedAchievements.length > 0 && !showAchievementNotification) {
      const latestAchievement = unlockedAchievements[unlockedAchievements.length - 1]
      setLastAchievement(latestAchievement)
      setShowAchievementNotification(true)
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowAchievementNotification(false)
      }, 5000)
    }
  }, [userProgress?.achievements, getUnlockedAchievements])

  if (!user || !show) return null

  const levelProgress = getLevelProgress()
  const rankInfo = getRankInfo()
  const activeChallenges = getActiveChallenges()
  const unclaimedRewards = getUnclaimedRewards()

  if (compact) {
    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {/* Compact XP Bar */}
        <Card className="w-64 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Livello {userProgress?.level || 1}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {userProgress?.totalXP?.toLocaleString() || 0} XP
              </Badge>
            </div>
            <Progress value={levelProgress.percentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Achievement Notification */}
        {showAchievementNotification && lastAchievement && (
          <Card className="w-64 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{lastAchievement.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">Achievement Sbloccato!</div>
                  <div className="text-xs text-muted-foreground">{lastAchievement.name}</div>
                  <div className="text-xs text-yellow-600">+{lastAchievement.xpReward} XP</div>
                </div>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <Card className="w-64 bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Sfide Attive</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activeChallenges.length}
                </Badge>
              </div>
              <div className="space-y-1">
                {activeChallenges.slice(0, 2).map((challenge) => (
                  <div key={challenge.id} className="text-xs">
                    <div className="flex justify-between">
                      <span className="truncate">{challenge.name}</span>
                      <span>{Math.round(challenge.progress)}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Unclaimed Rewards */}
        {unclaimedRewards.length > 0 && (
          <Card className="w-64 bg-purple-50 border-purple-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Premi da Riscattare</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {unclaimedRewards.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* User Stats Card */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{user.username}</div>
                    <div className="text-xs text-muted-foreground">Livello {userProgress?.level || 1}</div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  style={{ 
                    backgroundColor: rankInfo.color + '20', 
                    borderColor: rankInfo.color,
                    color: rankInfo.color 
                  }}
                  className="text-xs"
                >
                  {rankInfo.rank}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    XP Progress
                  </span>
                  <span className="text-muted-foreground">
                    {userProgress?.totalXP?.toLocaleString() || 0}
                  </span>
                </div>
                <Progress value={levelProgress.percentage} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {userProgress?.stats?.totalWins || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Vittorie</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {userProgress?.streak?.current || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {userProgress?.achievements?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Achievement</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold text-sm">Sfide Attive</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activeChallenges.length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {activeChallenges.slice(0, 3).map((challenge) => (
                    <div key={challenge.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="truncate">{challenge.name}</span>
                        <span className="text-muted-foreground">
                          {challenge.userProgress}/{challenge.requirements.value}
                        </span>
                      </div>
                      <Progress value={challenge.progress} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-sm">Attività Recente</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Ultima Partita</span>
                  <span className="text-muted-foreground">2 min fa</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>XP Guadagnato</span>
                  <span className="text-green-600">+150</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Win Rate</span>
                  <span className="text-blue-600">{user.winRate.toFixed(1)}%</span>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mt-3" size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    Centro Gamification
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Centro Gamification Completo</DialogTitle>
                  </DialogHeader>
                  <div className="text-center py-8">
                    <p>Apri la pagina completa per vedere tutti i dettagli:</p>
                    <Button 
                      className="mt-4"
                      onClick={() => window.open('/gamification', '_blank')}
                    >
                      Apri Centro Gamification
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Notification */}
        {showAchievementNotification && lastAchievement && (
          <Card className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{lastAchievement.icon}</div>
                <div className="flex-1">
                  <div className="font-bold text-lg">🎉 Achievement Sbloccato!</div>
                  <div className="text-muted-foreground">{lastAchievement.description}</div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-yellow-600">+{lastAchievement.xpReward} XP</span>
                    <span className="text-green-600">+{lastAchievement.coinsReward} Coins</span>
                    <span className="text-purple-600">+{lastAchievement.gemsReward} Gems</span>
                  </div>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
