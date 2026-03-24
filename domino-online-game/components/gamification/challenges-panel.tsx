'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useGamificationStore } from '@/lib/game-store-extended'
import { Target, Clock, Gift, CheckCircle, Zap } from 'lucide-react'

interface Challenge {
  id: string
  name: string
  description: string
  type: 'daily' | 'weekly' | 'seasonal' | 'special'
  category: string
  requirements: {
    type: string
    value: number
    timeframe?: number
  }
  rewards: {
    xp: number
    coins: number
    gems: number
  }
  isActive: boolean
  startsAt: string
  endsAt: string
  userProgress: number
  isCompleted: boolean
  progress: number
}

interface ChallengesPanelProps {
  userId: string
}

const CHALLENGE_TYPES = [
  { id: 'all', name: 'Tutti', icon: '🎯' },
  { id: 'daily', name: 'Quotidiani', icon: '📅' },
  { id: 'weekly', name: 'Settimanali', icon: '📆' },
  { id: 'seasonal', name: 'Stagionali', icon: '🏆' }
]

const CHALLENGE_TYPE_COLORS = {
  daily: 'border-blue-400 bg-blue-50',
  weekly: 'border-green-400 bg-green-50',
  seasonal: 'border-purple-400 bg-purple-50',
  special: 'border-orange-400 bg-orange-50'
}

const CHALLENGE_TYPE_BADGE_COLORS = {
  daily: 'bg-blue-500',
  weekly: 'bg-green-500',
  seasonal: 'bg-purple-500',
  special: 'bg-orange-500'
}

export default function ChallengesPanel({ userId }: ChallengesPanelProps) {
  const {
    challenges,
    fetchChallenges,
    selectedBadgeCategory,
    setSelectedBadgeCategory,
    updateChallengeProgress
  } = useGamificationStore()

  const [selectedType, setSelectedType] = useState('daily')

  useEffect(() => {
    if (userId) {
      fetchChallenges(userId, selectedType === 'all' ? undefined : selectedType)
    }
  }, [userId, selectedType, fetchChallenges])

  const filteredChallenges = selectedType === 'all' 
    ? challenges 
    : challenges.filter(c => c.type === selectedType)

  const getTypeIcon = (typeId: string) => {
      const type = CHALLENGE_TYPES.find(t => t.id === typeId)
      return type?.icon || '🎯'
    }

  const getTypeColor = (type: string) => {
    return CHALLENGE_TYPE_COLORS[type as keyof typeof CHALLENGE_TYPE_COLORS] || CHALLENGE_TYPE_COLORS.daily
  }

  const getTypeBadgeColor = (type: string) => {
    return CHALLENGE_TYPE_BADGE_COLORS[type as keyof typeof CHALLENGE_TYPE_BADGE_COLORS] || CHALLENGE_TYPE_BADGE_COLORS.daily
  }

  const getTimeRemaining = (endsAt: string) => {
    const now = new Date()
    const end = new Date(endsAt)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Scaduto'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleClaimReward = async (challenge: Challenge) => {
    if (!challenge.isCompleted) return
    
    // Simulate claiming reward
    console.log(`Claiming reward for ${challenge.name}`)
    
    // This would call the actual API to claim rewards
    // await apiClient.claimReward(userId, challenge.id)
    
    // Update local state to mark as claimed
    updateChallengeProgress(challenge.id, challenge.requirements.value)
  }

  return (
    <div className="space-y-6">
      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        {CHALLENGE_TYPES.map((type) => (
          <Button
            key={type.id}
            variant={selectedType === type.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(type.id)}
            className="flex items-center gap-2"
          >
            <span>{type.icon}</span>
            <span>{type.name}</span>
          </Button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChallenges.map((challenge) => (
          <Card 
            key={challenge.id}
            className={`${getTypeColor(challenge.type)} ${
              challenge.isCompleted ? 'opacity-75' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-xl">{challenge.type === 'daily' ? '📅' : challenge.type === 'weekly' ? '📆' : '🏆'}</div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm truncate">
                      {challenge.name}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge 
                    className={getTypeBadgeColor(challenge.type)}
                    variant="secondary"
                  >
                    {challenge.type}
                  </Badge>
                  {challenge.isCompleted && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {challenge.description}
              </p>
              
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span>Progresso</span>
                  </span>
                  <span className="text-muted-foreground">
                    {challenge.userProgress} / {challenge.requirements.value}
                  </span>
                </div>
                <Progress 
                  value={challenge.progress} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{challenge.userProgress} completati</span>
                  <span>{Math.round(challenge.progress)}%</span>
                </div>
              </div>
              
              {/* Rewards */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Ricompense:</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-500">⭐</span>
                    <span>{challenge.rewards.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-600">💰</span>
                    <span>{challenge.rewards.coins} Coins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-purple-500">💎</span>
                    <span>{challenge.rewards.gems} Gems</span>
                  </div>
                </div>
              </div>
              
              {/* Time Remaining */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>Tempo rimanente:</span>
                </div>
                <span className="text-muted-foreground">
                  {getTimeRemaining(challenge.endsAt)}
                </span>
              </div>
              
              {/* Action Button */}
              <Button 
                className="w-full"
                disabled={!challenge.isCompleted}
                onClick={() => handleClaimReward(challenge)}
              >
                {challenge.isCompleted ? (
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    <span>Riscatta Ricompensa</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>In Progresso</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {challenges.filter(c => c.isCompleted).length}
            </div>
            <div className="text-sm text-muted-foreground">Completati</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {challenges.filter(c => !c.isCompleted).length}
            </div>
            <div className="text-sm text-muted-foreground">In corso</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {challenges.reduce((sum, c) => sum + c.rewards.xp, 0)}
            </div>
            <div className="text-sm text-muted-foreground">XP Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {challenges.reduce((sum, c) => sum + c.rewards.coins, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Coins Total</div>
          </div>
        </div>
      </div>
    </div>
  )
}
