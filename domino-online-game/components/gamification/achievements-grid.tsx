'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGamificationStore } from '@/lib/game-store-extended'
import { Trophy, Star, Lock, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  coinsReward: number
  gemsReward: number
  isUnlocked: boolean
  unlockedAt?: string
}

interface AchievementsGridProps {
  userId: string
}

const CATEGORIES = [
  { id: 'all', name: 'Tutti', icon: '🎯' },
  { id: 'victories', name: 'Vittorie', icon: '🏆' },
  { id: 'games_played', name: 'Partite', icon: '🎮' },
  { id: 'streaks', name: 'Serie', icon: '🔥' },
  { id: 'special', name: 'Speciali', icon: '⭐' },
  { id: 'seasonal', name: 'Stagionali', icon: '🗓️' },
  { id: 'social', name: 'Social', icon: '👥' }
]

const RARITY_COLORS = {
  common: 'border-gray-400 bg-gray-50',
  rare: 'border-blue-400 bg-blue-50',
  epic: 'border-purple-400 bg-purple-50',
  legendary: 'border-yellow-400 bg-yellow-50'
}

const RARITY_BADGE_COLORS = {
  common: 'bg-gray-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
}

export default function AchievementsGrid({ userId }: AchievementsGridProps) {
  const {
    achievements,
    fetchAchievements,
    selectedAchievementCategory,
    setSelectedAchievementCategory,
    showAchievementModal,
    setShowAchievementModal
  } = useGamificationStore()

  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    if (userId) {
      fetchAchievements(userId, selectedAchievementCategory === 'all' ? undefined : selectedAchievementCategory)
    }
  }, [userId, selectedAchievementCategory, fetchAchievements])

  const filteredAchievements = selectedAchievementCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedAchievementCategory)

  const getCategoryIcon = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId)
    return category?.icon || '🎯'
  }

  const getRarityColor = (rarity: string) => {
    return RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.common
  }

  const getRarityBadgeColor = (rarity: string) => {
    return RARITY_BADGE_COLORS[rarity as keyof typeof RARITY_BADGE_COLORS] || RARITY_BADGE_COLORS.common
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Button
            key={category.id}
            variant={selectedAchievementCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedAchievementCategory(category.id)}
            className="flex items-center gap-2"
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement) => (
          <Dialog key={achievement.id}>
            <DialogTrigger asChild>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${getRarityColor(achievement.rarity)} ${
                  achievement.isUnlocked ? 'opacity-100' : 'opacity-60'
                }`}
                onClick={() => setSelectedAchievement(achievement)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm truncate">
                          {achievement.name}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge 
                        className={getRarityBadgeColor(achievement.rarity)}
                        variant="secondary"
                      >
                        {achievement.rarity}
                      </Badge>
                      {achievement.isUnlocked ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {achievement.description}
                  </p>
                  <div className="mt-2 flex justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{achievement.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-yellow-600" />
                      <span>{achievement.coinsReward}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <DialogTitle className="text-lg">{achievement.name}</DialogTitle>
                    <Badge 
                      className={getRarityBadgeColor(achievement.rarity)}
                      variant="secondary"
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {achievement.description}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Recompense:</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{achievement.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span>{achievement.coinsReward} Coins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-purple-500">💎</span>
                      <span>{achievement.gemsReward} Gems</span>
                    </div>
                  </div>
                </div>
                
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <div className="text-sm text-muted-foreground">
                    <p>Sbloccato il: {new Date(achievement.unlockedAt).toLocaleDateString('it-IT')}</p>
                  </div>
                )}
                
                {!achievement.isUnlocked && (
                  <div className="text-sm text-muted-foreground">
                    <p>Questo achievement non è ancora stato sbloccato.</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {achievements.filter(a => a.isUnlocked).length}
            </div>
            <div className="text-sm text-muted-foreground">Sbloccati</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {achievements.filter(a => !a.isUnlocked).length}
            </div>
            <div className="text-sm text-muted-foreground">Da sbloccare</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {achievements.filter(a => a.rarity === 'legendary').length}
            </div>
            <div className="text-sm text-muted-foreground">Legendary</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((achievements.filter(a => a.isUnlocked).length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Completamento</div>
          </div>
        </div>
      </div>
    </div>
  )
}
