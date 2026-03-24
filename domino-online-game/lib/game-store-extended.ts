import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiClient } from './api-client'

// ==================== GAMIFICATION TYPES ====================

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'victories' | 'games_played' | 'streaks' | 'special' | 'seasonal' | 'social'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  coinsReward: number
  gemsReward: number
  requirements: {
    type: 'wins' | 'games_played' | 'streak' | 'level' | 'elo' | 'daily_streak' | 'perfect_game' | 'comeback' | 'first_place'
    value: number
    comparison?: 'equals' | 'greater_than' | 'greater_than_or_equal' | 'less_than'
  }
  isHidden: boolean
  isActive: boolean
  isUnlocked: boolean
  unlockedAt?: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'skill' | 'achievement' | 'seasonal' | 'special' | 'rank'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockCondition: {
    type: 'achievement' | 'level' | 'rank' | 'special'
    value: string | number
  }
  isEquippable: boolean
  slot: 'profile' | 'title' | 'border' | 'background'
  isActive: boolean
  isOwned: boolean
  isEquipped: boolean
}

export interface UserProgress {
  userId: string
  xp: number
  level: number
  totalXP: number
  achievements: string[]
  badges: string[]
  equippedBadges: {
    profile?: string
    title?: string
    border?: string
    background?: string
  }
  streak: {
    current: number
    best: number
    lastPlayedAt: string
    dailyStreak: number
    lastDailyDate: string
  }
  stats: {
    totalGames: number
    totalWins: number
    totalLosses: number
    perfectGames: number
    comebacks: number
    firstPlaces: number
    dailyBonusClaimed: boolean
    lastDailyClaim: string
    consecutiveDays: number
  }
  seasonProgress: {
    seasonId: string
    seasonXP: number
    seasonLevel: number
    seasonRank: string
    seasonWins: number
    seasonLosses: number
    seasonAchievements: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface Challenge {
  id: string
  name: string
  description: string
  type: 'daily' | 'weekly' | 'seasonal' | 'special'
  category: 'wins' | 'games' | 'xp' | 'social'
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

export interface Reward {
  id: string
  type: 'xp' | 'coins' | 'gems' | 'badge' | 'achievement' | 'title' | 'skin'
  name: string
  description: string
  icon: string
  value: number | string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isClaimed: boolean
  expiresAt?: string
  createdAt: string
  source: string
}

export interface LeaderboardEntry {
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

// ==================== EXTENDED STORE ====================

interface GamificationStore {
  // User Progress
  userProgress: UserProgress | null
  achievements: Achievement[]
  badges: Badge[]
  challenges: Challenge[]
  rewards: Reward[]
  leaderboard: LeaderboardEntry[]
  
  // Loading states
  isLoading: boolean
  isUpdating: boolean
  
  // UI State
  selectedAchievementCategory: string
  selectedBadgeCategory: string
  showAchievementModal: boolean
  showBadgeModal: boolean
  showRewardModal: boolean
  
  // Actions
  fetchUserProgress: (userId: string) => Promise<void>
  fetchAchievements: (userId: string, category?: string) => Promise<void>
  fetchBadges: (userId: string, category?: string) => Promise<void>
  fetchChallenges: (userId: string, type?: string) => Promise<void>
  fetchRewards: (userId: string, type?: string) => Promise<void>
  fetchLeaderboard: (type?: string, limit?: number) => Promise<void>
  
  // Gamification actions
  awardXP: (amount: number, source: string, reason?: string) => Promise<void>
  checkAchievements: () => Promise<void>
  equipBadge: (badgeId: string, slot: string) => Promise<void>
  claimReward: (rewardId: string) => Promise<void>
  updateChallengeProgress: (challengeId: string, progress: number) => Promise<void>
  
  // UI actions
  setSelectedAchievementCategory: (category: string) => void
  setSelectedBadgeCategory: (category: string) => void
  setShowAchievementModal: (show: boolean) => void
  setShowBadgeModal: (show: boolean) => void
  setShowRewardModal: (show: boolean) => void
  
  // Utility
  getLevelProgress: () => { current: number; next: number; percentage: number }
  getRankInfo: () => { rank: string; tier: number; color: string }
  getUnlockedAchievements: () => Achievement[]
  getOwnedBadges: () => Badge[]
  getActiveChallenges: () => Challenge[]
  getUnclaimedRewards: () => Reward[]
}

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      userProgress: null,
      achievements: [],
      badges: [],
      challenges: [],
      rewards: [],
      leaderboard: [],
      
      isLoading: false,
      isUpdating: false,
      
      selectedAchievementCategory: 'all',
      selectedBadgeCategory: 'all',
      showAchievementModal: false,
      showBadgeModal: false,
      showRewardModal: false,
      
      // Fetch user progress
      fetchUserProgress: async (userId: string) => {
        set({ isLoading: true })
        try {
          const response = await fetch(`/api/gamification/profile?userId=${userId}`)
          const data = await response.json()
          if (data.success && data.data) {
            set({ 
              userProgress: data.data.gamification,
              isLoading: false 
            })
          }
        } catch (error) {
          console.error('Failed to fetch user progress:', error)
          set({ isLoading: false })
        }
      },
      
      // Fetch achievements
      fetchAchievements: async (userId: string, category?: string) => {
        try {
          const response = await apiClient.getAchievements(userId, category)
          if (response.success && response.data) {
            set({ achievements: response.data.achievements })
          }
        } catch (error) {
          console.error('Failed to fetch achievements:', error)
        }
      },
      
      // Fetch badges
      fetchBadges: async (userId: string, category?: string) => {
        try {
          const response = await apiClient.getBadges(userId, category)
          if (response.success && response.data) {
            set({ badges: response.data.badges })
          }
        } catch (error) {
          console.error('Failed to fetch badges:', error)
        }
      },
      
      // Fetch challenges
      fetchChallenges: async (userId: string, type?: string) => {
        try {
          const response = await apiClient.getChallenges(userId, type)
          if (response.success && response.data) {
            set({ challenges: response.data.challenges })
          }
        } catch (error) {
          console.error('Failed to fetch challenges:', error)
        }
      },
      
      // Fetch rewards
      fetchRewards: async (userId: string, type?: string) => {
        try {
          const response = await apiClient.getRewards(userId, type)
          if (response.success && response.data) {
            set({ rewards: response.data.rewards })
          }
        } catch (error) {
          console.error('Failed to fetch rewards:', error)
        }
      },
      
      // Fetch leaderboard
      fetchLeaderboard: async (type?: string, limit?: number) => {
        try {
          const response = await apiClient.getGamificationLeaderboard(type, limit)
          if (response.success && response.data) {
            set({ leaderboard: response.data.leaderboard })
          }
        } catch (error) {
          console.error('Failed to fetch leaderboard:', error)
        }
      },
      
      // Award XP
      awardXP: async (amount: number, source: string, reason?: string) => {
        const { userProgress } = get()
        if (!userProgress) return
        
        set({ isUpdating: true })
        try {
          // This would call the actual API
          const newTotalXP = userProgress.totalXP + amount
          const newLevel = Math.floor(newTotalXP / 100) + 1 // Simplified level calculation
          
          set({
            userProgress: {
              ...userProgress,
              xp: userProgress.xp + amount,
              totalXP: newTotalXP,
              level: newLevel,
              updatedAt: new Date().toISOString()
            },
            isUpdating: false
          })
          
          // Check for new achievements after XP gain
          get().checkAchievements()
          
        } catch (error) {
          console.error('Failed to award XP:', error)
          set({ isUpdating: false })
        }
      },
      
      // Check achievements
      checkAchievements: async () => {
        const { userProgress } = get()
        if (!userProgress) return
        
        try {
          // This would call the actual API
          const response = await apiClient.checkAchievements(userProgress.userId, {
            wins: userProgress.stats.totalWins,
            gamesPlayed: userProgress.stats.totalGames,
            elo: 1000 // Would get from user stats
          })
          
          if (response.success && response.data?.unlockedAchievements?.length > 0) {
            // Show achievement unlock notification
            set({ showAchievementModal: true })
          }
        } catch (error) {
          console.error('Failed to check achievements:', error)
        }
      },
      
      // Equip badge
      equipBadge: async (badgeId: string, slot: string) => {
        const { userProgress } = get()
        if (!userProgress) return
        
        set({ isUpdating: true })
        try {
          // This would call the actual API
          set({
            userProgress: {
              ...userProgress,
              equippedBadges: {
                ...userProgress.equippedBadges,
                [slot]: badgeId
              },
              updatedAt: new Date().toISOString()
            },
            isUpdating: false
          })
        } catch (error) {
          console.error('Failed to equip badge:', error)
          set({ isUpdating: false })
        }
      },
      
      // Claim reward
      claimReward: async (rewardId: string) => {
        set({ isUpdating: true })
        try {
          // This would call the actual API
          set(state => ({
            rewards: state.rewards.map(reward => 
              reward.id === rewardId 
                ? { ...reward, isClaimed: true }
                : reward
            ),
            isUpdating: false
          }))
        } catch (error) {
          console.error('Failed to claim reward:', error)
          set({ isUpdating: false })
        }
      },
      
      // Update challenge progress
      updateChallengeProgress: async (challengeId: string, progress: number) => {
        try {
          // This would call the actual API
          set(state => ({
            challenges: state.challenges.map(challenge =>
              challenge.id === challengeId
                ? { 
                    ...challenge, 
                    userProgress: progress,
                    isCompleted: progress >= challenge.requirements.value,
                    progress: Math.min(100, (progress / challenge.requirements.value) * 100)
                  }
                : challenge
            )
          }))
        } catch (error) {
          console.error('Failed to update challenge progress:', error)
        }
      },
      
      // UI actions
      setSelectedAchievementCategory: (category: string) => set({ selectedAchievementCategory: category }),
      setSelectedBadgeCategory: (category: string) => set({ selectedBadgeCategory: category }),
      setShowAchievementModal: (show: boolean) => set({ showAchievementModal: show }),
      setShowBadgeModal: (show: boolean) => set({ showBadgeModal: show }),
      setShowRewardModal: (show: boolean) => set({ showRewardModal: show }),
      
      // Utility methods
      getLevelProgress: () => {
        const { userProgress } = get()
        if (!userProgress) return { current: 0, next: 100, percentage: 0 }
        
        const currentLevelXP = userProgress.totalXP % 100
        const nextLevelXP = 100
        const percentage = (currentLevelXP / nextLevelXP) * 100
        
        return { current: currentLevelXP, next: nextLevelXP, percentage }
      },
      
      getRankInfo: () => {
        const elo = 1000 // Would get from user stats
        if (elo >= 2400) return { rank: 'grandmaster', tier: 1, color: '#FF0000' }
        if (elo >= 2200) return { rank: 'master', tier: elo >= 2300 ? 1 : elo >= 2250 ? 2 : 3, color: '#FF6600' }
        if (elo >= 1900) return { rank: 'diamond', tier: elo >= 2100 ? 1 : elo >= 2000 ? 2 : 3, color: '#00CED1' }
        if (elo >= 1600) return { rank: 'platinum', tier: elo >= 1800 ? 1 : elo >= 1700 ? 2 : 3, color: '#E5E4E2' }
        if (elo >= 1300) return { rank: 'gold', tier: elo >= 1500 ? 1 : elo >= 1400 ? 2 : 3, color: '#FFD700' }
        if (elo >= 1000) return { rank: 'silver', tier: elo >= 1200 ? 1 : elo >= 1100 ? 2 : 3, color: '#C0C0C0' }
        return { rank: 'bronze', tier: elo >= 900 ? 1 : elo >= 800 ? 2 : 3, color: '#CD7F32' }
      },
      
      getUnlockedAchievements: () => {
        const { achievements, userProgress } = get()
        if (!userProgress) return []
        return achievements.filter(achievement => userProgress.achievements.includes(achievement.id))
      },
      
      getOwnedBadges: () => {
        const { badges, userProgress } = get()
        if (!userProgress) return []
        return badges.filter(badge => userProgress.badges.includes(badge.id))
      },
      
      getActiveChallenges: () => {
        const { challenges } = get()
        return challenges.filter(challenge => challenge.isActive && !challenge.isCompleted)
      },
      
      getUnclaimedRewards: () => {
        const { rewards } = get()
        return rewards.filter(reward => !reward.isClaimed)
      }
    }),
    {
      name: 'gamification-store',
      partialize: (state) => ({
        userProgress: state.userProgress,
        achievements: state.achievements,
        badges: state.badges,
        challenges: state.challenges,
        rewards: state.rewards,
        leaderboard: state.leaderboard
      })
    }
  )
)

// ==================== API CLIENT EXTENSIONS ====================

// Gamification API client
const gamificationApiClient = {
  // Gamification API methods
  getGamificationProfile: async (userId: string) => {
    const response = await fetch(`/api/gamification/profile?userId=${userId}`)
    return await response.json()
  },
  
  getAchievements: async (userId: string, category?: string) => {
    const params = new URLSearchParams({ userId })
    if (category) params.append('category', category)
    const response = await fetch(`/api/gamification/achievements?${params}`)
    return await response.json()
  },
  
  checkAchievements: async (userId: string, userStats: any) => {
    const response = await fetch('/api/gamification/achievements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userStats })
    })
    return await response.json()
  },
  
  getBadges: async (userId: string, category?: string) => {
    const params = new URLSearchParams({ userId })
    if (category) params.append('category', category)
    const response = await fetch(`/api/gamification/badges?${params}`)
    return await response.json()
  },
  
  equipBadge: async (userId: string, badgeId: string, slot: string) => {
    const response = await fetch('/api/gamification/badges', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, badgeId, slot })
    })
    return await response.json()
  },
  
  getGamificationLeaderboard: async (type?: string, limit?: number) => {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (limit) params.append('limit', limit.toString())
    const response = await fetch(`/api/gamification/leaderboard?${params}`)
    return await response.json()
  },
  
  getRewards: async (userId: string, type?: string, claimed?: string) => {
    const params = new URLSearchParams({ userId })
    if (type) params.append('type', type)
    if (claimed) params.append('claimed', claimed)
    const response = await fetch(`/api/gamification/rewards?${params}`)
    return await response.json()
  },
  
  claimReward: async (userId: string, rewardId: string) => {
    const response = await fetch('/api/gamification/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, rewardId })
    })
    return await response.json()
  },
  
  getChallenges: async (userId: string, type?: string) => {
    const params = new URLSearchParams({ userId })
    if (type) params.append('type', type)
    const response = await fetch(`/api/gamification/challenges?${params}`)
    return await response.json()
  },
  
  updateChallengeProgress: async (userId: string, challengeId: string, progress: number) => {
    const response = await fetch('/api/gamification/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, challengeId, progress })
    })
    return await response.json()
  }
}

export { gamificationApiClient }
