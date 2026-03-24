'use client'

import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useGamificationStore } from '@/lib/game-store-extended'
import { Trophy, Star, Zap, Target, Calendar, TrendingUp } from 'lucide-react'

interface ProfileCardProps {
  userId: string
  username: string
  avatar: string
}

export default function ProfileCard({ userId, username, avatar }: ProfileCardProps) {
  const {
    userProgress,
    fetchUserProgress,
    getLevelProgress,
    getRankInfo
  } = useGamificationStore()

  useEffect(() => {
    if (userId) {
      fetchUserProgress(userId)
    }
  }, [userId, fetchUserProgress])

  if (!userProgress) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Caricamento profilo...</div>
        </CardContent>
      </Card>
    )
  }

  const levelProgress = getLevelProgress()
  const rankInfo = getRankInfo()

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{username}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                Livello {userProgress.level}
              </Badge>
              <Badge 
                variant="outline" 
                style={{ 
                  backgroundColor: rankInfo.color + '20', 
                  borderColor: rankInfo.color,
                  color: rankInfo.color 
                }}
                className="text-xs"
              >
                {rankInfo.rank.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              XP Progress
            </span>
            <span className="text-muted-foreground">
              {userProgress.totalXP.toLocaleString()} XP
            </span>
          </div>
          <Progress 
            value={levelProgress.percentage} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{levelProgress.current} / {levelProgress.next}</span>
            <span>{Math.round(levelProgress.percentage)}%</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Vittorie</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {userProgress.stats.totalWins}
            </div>
            <div className="text-xs text-muted-foreground">
              {userProgress.stats.totalGames} partite
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-orange-500" />
              <span>Streak</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {userProgress.streak.current}
            </div>
            <div className="text-xs text-muted-foreground">
              Record: {userProgress.streak.best}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Target className="h-3 w-3 text-green-500" />
              <span className="text-xs">Perfect</span>
            </div>
            <div className="font-semibold text-green-600">
              {userProgress.stats.perfectGames}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-500" />
              <span className="text-xs">Rimonte</span>
            </div>
            <div className="font-semibold text-blue-600">
              {userProgress.stats.comebacks}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Calendar className="h-3 w-3 text-purple-500" />
              <span className="text-xs">Giorni</span>
            </div>
            <div className="font-semibold text-purple-600">
              {userProgress.stats.consecutiveDays}
            </div>
          </div>
        </div>

        {/* Achievements & Badges Summary */}
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-sm">
            <span className="text-muted-foreground">Achievement: </span>
            <span className="font-semibold ml-1">
              {userProgress.achievements.length}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Badge: </span>
            <span className="font-semibold ml-1">
              {userProgress.badges.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
