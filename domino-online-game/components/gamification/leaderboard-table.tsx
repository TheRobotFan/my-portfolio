'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useGamificationStore } from '@/lib/game-store-extended'
import { Trophy, Medal, Crown, TrendingUp, Users } from 'lucide-react'

interface LeaderboardEntry {
  userId: string
  username: string
  avatar: string
  level: number
  xp: number
  elo: number
  rank: number
  wins: number
  losses: number
  winRate: number
  achievements: number
}

interface LeaderboardTableProps {
  userId?: string
}

const LEADERBOARD_TYPES = [
  { id: 'xp', name: 'XP', icon: '⭐', description: 'Classifica per punti esperienza' },
  { id: 'level', name: 'Livello', icon: '📊', description: 'Classifica per livello raggiunto' },
  { id: 'wins', name: 'Vittorie', icon: '🏆', description: 'Classifica per numero di vittorie' },
  { id: 'achievements', name: 'Achievement', icon: '🎯', description: 'Classifica per achievement sbloccati' }
]

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
  if (rank === 3) return <Medal className="h-4 w-4 text-orange-600" />
  return null
}

const getRankBadgeColor = (rank: number) => {
  if (rank === 1) return 'bg-yellow-500'
  if (rank === 2) return 'bg-gray-400'
  if (rank === 3) return 'bg-orange-600'
  return 'bg-muted'
}

export default function LeaderboardTable({ userId }: LeaderboardTableProps) {
  const {
    leaderboard,
    fetchLeaderboard,
    getRankInfo
  } = useGamificationStore()

  const [selectedType, setSelectedType] = useState('xp')
  const [userRank, setUserRank] = useState<number | null>(null)

  useEffect(() => {
    fetchLeaderboard(selectedType)
  }, [selectedType, fetchLeaderboard])

  useEffect(() => {
    if (userId && leaderboard.length > 0) {
      const userEntry = leaderboard.find(entry => entry.userId === userId)
      setUserRank(userEntry?.rank || null)
    }
  }, [userId, leaderboard])

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return 'text-green-600'
    if (winRate >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTypeIcon = (typeId: string) => {
    const type = LEADERBOARD_TYPES.find(t => t.id === typeId)
    return type?.icon || '⭐'
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Classifiche
          </CardTitle>
          <div className="flex items-center gap-2">
            {userRank && (
              <Badge variant="outline" className={getRankBadgeColor(userRank)}>
                Pos. {userRank}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Type Selector */}
        <div className="flex flex-wrap gap-2">
          {LEADERBOARD_TYPES.map((type) => (
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
      </CardHeader>
      
      <CardContent>
        <div className="space-y-1">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-2 py-2 text-sm font-medium text-muted-foreground border-b">
            <div className="col-span-1 text-center">Pos</div>
            <div className="col-span-4">Giocatore</div>
            <div className="col-span-2 text-center">
              {selectedType === 'xp' ? 'XP' : selectedType === 'level' ? 'Livello' : selectedType === 'wins' ? 'Vittorie' : 'Achievement'}
            </div>
            <div className="col-span-2 text-center">ELO</div>
            <div className="col-span-2 text-center">Win Rate</div>
            <div className="col-span-1 text-center">🏆</div>
          </div>
          
          {/* Leaderboard Rows */}
          {leaderboard.map((entry, index) => (
            <div 
              key={entry.userId}
              className={`grid grid-cols-12 gap-4 px-2 py-3 items-center hover:bg-muted/50 transition-colors ${
                entry.userId === userId ? 'bg-muted' : ''
              }`}
            >
              {/* Rank */}
              <div className="col-span-1 text-center">
                <div className="flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                  {!getRankIcon(entry.rank) && (
                    <span className="font-bold text-lg">#{entry.rank}</span>
                  )}
                </div>
              </div>
              
              {/* Player Info */}
              <div className="col-span-4 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{entry.username}</div>
                  <div className="text-xs text-muted-foreground">
                    Livello {entry.level}
                  </div>
                </div>
              </div>
              
              {/* Main Stat */}
              <div className="col-span-2 text-center">
                <div className="font-bold">
                  {selectedType === 'xp' && entry.xp.toLocaleString()}
                  {selectedType === 'level' && entry.level}
                  {selectedType === 'wins' && entry.wins}
                  {selectedType === 'achievements' && entry.achievements}
                </div>
                {selectedType === 'xp' && (
                  <div className="text-xs text-muted-foreground">
                    XP
                  </div>
                )}
                {selectedType === 'level' && (
                  <div className="text-xs text-muted-foreground">
                    Livello
                  </div>
                )}
              </div>
              
              {/* ELO */}
              <div className="col-span-2 text-center">
                <div className="font-bold">{entry.elo}</div>
                <div className="text-xs text-muted-foreground">
                  {getRankInfo().rank}
                </div>
              </div>
              
              {/* Win Rate */}
              <div className="col-span-2 text-center">
                <div className={`font-bold ${getWinRateColor(entry.winRate)}`}>
                  {entry.winRate.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {entry.wins}W / {entry.losses}L
                </div>
              </div>
              
              {/* Achievements */}
              <div className="col-span-1 text-center">
                <div className="flex items-center justify-center">
                  <span className="text-lg">🎯</span>
                  <span className="ml-1 text-sm font-medium">
                    {entry.achievements}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {leaderboard.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <div className="text-lg font-medium">Nessun giocatore trovato</div>
              <div className="text-muted-foreground">
                Sii il primo a salire in classifica!
              </div>
            </div>
          )}
        </div>
        
        {/* Stats Summary */}
        {leaderboard.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {leaderboard.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Giocatori Totali
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(leaderboard.reduce((sum, entry) => sum + entry.xp, 0) / leaderboard.length).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Media XP
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(leaderboard.reduce((sum, entry) => sum + entry.wins, 0) / leaderboard.length).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Media Vittorie
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(leaderboard.reduce((sum, entry) => sum + entry.achievements, 0) / leaderboard.length).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Media Achievement
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
