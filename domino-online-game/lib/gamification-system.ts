// Complete Gamification System with XP, Levels, Badges, Achievements, and Rewards

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
  seasonal?: boolean
  expiresAt?: string
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
}

export interface UserLevel {
  level: number
  title: string
  minXP: number
  maxXP: number
  rewards: {
    coins: number
    gems: number
    unlockBadges: string[]
    unlockFeatures: string[]
  }
  color: string
  icon: string
}

export interface UserStreak {
  current: number
  best: number
  lastPlayedAt: string
  dailyStreak: number
  lastDailyDate: string
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
  streak: UserStreak
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

export interface Challenge {
  id: string
  name: string
  description: string
  type: 'daily' | 'weekly' | 'seasonal' | 'special'
  category: 'wins' | 'games' | 'xp' | 'social'
  requirements: {
    type: string
    value: number
    timeframe?: number // in hours
  }
  rewards: {
    xp: number
    coins: number
    gems: number
  }
  isActive: boolean
  startsAt: string
  endsAt: string
  participants: string[]
  completions: Record<string, number>
}

// Level System Configuration
export const LEVEL_CONFIG: UserLevel[] = [
  { level: 1, title: "Principiante", minXP: 0, maxXP: 100, rewards: { coins: 100, gems: 5, unlockBadges: [], unlockFeatures: [] }, color: "#808080", icon: "🌱" },
  { level: 2, title: "Apprendista", minXP: 100, maxXP: 250, rewards: { coins: 150, gems: 10, unlockBadges: [], unlockFeatures: [] }, color: "#8B4513", icon: "🌿" },
  { level: 3, title: "Giocatore", minXP: 250, maxXP: 500, rewards: { coins: 200, gems: 15, unlockBadges: [], unlockFeatures: [] }, color: "#4682B4", icon: "🍃" },
  { level: 4, title: "Esperto", minXP: 500, maxXP: 1000, rewards: { coins: 300, gems: 25, unlockBadges: [], unlockFeatures: [] }, color: "#9370DB", icon: "🌾" },
  { level: 5, title: "Maestro", minXP: 1000, maxXP: 2000, rewards: { coins: 500, gems: 50, unlockBadges: [], unlockFeatures: [] }, color: "#FF6347", icon: "🌺" },
  { level: 6, title: "Campione", minXP: 2000, maxXP: 4000, rewards: { coins: 750, gems: 100, unlockBadges: [], unlockFeatures: [] }, color: "#FFD700", icon: "🏆" },
  { level: 7, title: "Leggenda", minXP: 4000, maxXP: 8000, rewards: { coins: 1000, gems: 200, unlockBadges: [], unlockFeatures: [] }, color: "#FF4500", icon: "👑" },
  { level: 8, title: "Divinità", minXP: 8000, maxXP: 15000, rewards: { coins: 1500, gems: 300, unlockBadges: [], unlockFeatures: [] }, color: "#FF1493", icon: "⭐" },
  { level: 9, title: "Immortale", minXP: 15000, maxXP: 30000, rewards: { coins: 2000, gems: 500, unlockBadges: [], unlockFeatures: [] }, color: "#8A2BE2", icon: "🌟" },
  { level: 10, title: "Maestro Assoluto", minXP: 30000, maxXP: 50000, rewards: { coins: 3000, gems: 1000, unlockBadges: [], unlockFeatures: [] }, color: "#DC143C", icon: "💎" },
]

// Achievement Definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Victory Achievements
  {
    id: 'first_win',
    name: 'Prima Vittoria',
    description: 'Vinci la tua prima partita',
    icon: '🏅',
    category: 'victories',
    rarity: 'common',
    xpReward: 50,
    coinsReward: 100,
    gemsReward: 5,
    requirements: { type: 'wins', value: 1 },
    isHidden: false,
    isActive: true
  },
  {
    id: 'ten_wins',
    name: 'Vincente',
    description: 'Vinci 10 partite',
    icon: '🥇',
    category: 'victories',
    rarity: 'common',
    xpReward: 100,
    coinsReward: 250,
    gemsReward: 10,
    requirements: { type: 'wins', value: 10 },
    isHidden: false,
    isActive: true
  },
  {
    id: 'hundred_wins',
    name: 'Centenario',
    description: 'Vinci 100 partite',
    icon: '💯',
    category: 'victories',
    rarity: 'rare',
    xpReward: 500,
    coinsReward: 1000,
    gemsReward: 50,
    requirements: { type: 'wins', value: 100 },
    isHidden: false,
    isActive: true
  },
  {
    id: 'thousand_wins',
    name: 'Mille Vittorie',
    description: 'Vinci 1000 partite',
    icon: '🏆',
    category: 'victories',
    rarity: 'epic',
    xpReward: 2000,
    coinsReward: 5000,
    gemsReward: 200,
    requirements: { type: 'wins', value: 1000 },
    isHidden: false,
    isActive: true
  },

  // Games Played Achievements
  {
    id: 'first_game',
    name: 'Prima Partita',
    description: 'Gioca la tua prima partita',
    icon: '🎮',
    category: 'games_played',
    rarity: 'common',
    xpReward: 25,
    coinsReward: 50,
    gemsReward: 2,
    requirements: { type: 'games_played', value: 1 },
    isHidden: false,
    isActive: true
  },
  {
    id: 'fifty_games',
    name: 'Veterano',
    description: 'Gioca 50 partite',
    icon: '🎯',
    category: 'games_played',
    rarity: 'common',
    xpReward: 150,
    coinsReward: 300,
    gemsReward: 15,
    requirements: { type: 'games_played', value: 50 },
    isHidden: false,
    isActive: true
  },

  // Streak Achievements
  {
    id: 'three_streak',
    name: 'Tripletta',
    description: 'Vinci 3 partite consecutive',
    icon: '🔥',
    category: 'streaks',
    rarity: 'common',
    xpReward: 75,
    coinsReward: 150,
    gemsReward: 8,
    requirements: { type: 'streak', value: 3 },
    isHidden: false,
    isActive: true
  },
  {
    id: 'ten_streak',
    name: 'Invincibile',
    description: 'Vinci 10 partite consecutive',
    icon: '⚡',
    category: 'streaks',
    rarity: 'rare',
    xpReward: 300,
    coinsReward: 750,
    gemsReward: 40,
    requirements: { type: 'streak', value: 10 },
    isHidden: false,
    isActive: true
  },

  // Special Achievements
  {
    id: 'perfect_game',
    name: 'Partita Perfetta',
    description: 'Vinci una partita senza perdere un turno',
    icon: '💎',
    category: 'special',
    rarity: 'epic',
    xpReward: 400,
    coinsReward: 1000,
    gemsReward: 60,
    requirements: { type: 'perfect_game', value: 1 },
    isHidden: false,
    isActive: true
  },
  {
    id: 'comeback_king',
    name: 'Re del Rimonta',
    description: 'Vinci dopo essere in svantaggio di 5+ punti',
    icon: '👑',
    category: 'special',
    rarity: 'rare',
    xpReward: 250,
    coinsReward: 500,
    gemsReward: 30,
    requirements: { type: 'comeback', value: 1 },
    isHidden: false,
    isActive: true
  },

  // Level Achievements
  {
    id: 'level_5',
    name: 'Maestro del Gioco',
    description: 'Raggiungi il livello 5',
    icon: '🌟',
    category: 'special',
    rarity: 'rare',
    xpReward: 100,
    coinsReward: 200,
    gemsReward: 10,
    requirements: { type: 'level', value: 5 },
    isHidden: false,
    isActive: true
  },
  {
    id: 'level_10',
    name: 'Maestro Assoluto',
    description: 'Raggiungi il livello 10',
    icon: '💎',
    category: 'special',
    rarity: 'legendary',
    xpReward: 500,
    coinsReward: 2000,
    gemsReward: 100,
    requirements: { type: 'level', value: 10 },
    isHidden: false,
    isActive: true
  },

  // ELO Achievements
  {
    id: 'elo_1500',
    name: 'Competitore',
    description: 'Raggiungi 1500 ELO',
    icon: '🏅',
    category: 'special',
    rarity: 'rare',
    xpReward: 200,
    coinsReward: 400,
    gemsReward: 20,
    requirements: { type: 'elo', value: 1500, comparison: 'greater_than_or_equal' },
    isHidden: false,
    isActive: true
  },
  {
    id: 'elo_2000',
    name: 'Elite',
    description: 'Raggiungi 2000 ELO',
    icon: '🏆',
    category: 'special',
    rarity: 'epic',
    xpReward: 400,
    coinsReward: 1000,
    gemsReward: 50,
    requirements: { type: 'elo', value: 2000, comparison: 'greater_than_or_equal' },
    isHidden: false,
    isActive: true
  },

  // Daily Streak Achievements
  {
    id: 'daily_7',
    name: 'Settimanale',
    description: 'Gioca per 7 giorni consecutivi',
    icon: '📅',
    category: 'special',
    rarity: 'common',
    xpReward: 100,
    coinsReward: 200,
    gemsReward: 10,
    requirements: { type: 'daily_streak', value: 7 },
    isHidden: false,
    isActive: true
  },
  {
    id: 'daily_30',
    name: 'Mensile',
    description: 'Gioca per 30 giorni consecutivi',
    icon: '🗓️',
    category: 'special',
    rarity: 'rare',
    xpReward: 500,
    coinsReward: 1000,
    gemsReward: 50,
    requirements: { type: 'daily_streak', value: 30 },
    isHidden: false,
    isActive: true
  },

  // Seasonal Achievements
  {
    id: 'season_1_winner',
    name: 'Campione Stagionale',
    description: 'Finisci la stagione tra i primi 10',
    icon: '👑',
    category: 'seasonal',
    rarity: 'legendary',
    xpReward: 1000,
    coinsReward: 5000,
    gemsReward: 250,
    requirements: { type: 'first_place', value: 10 },
    isHidden: false,
    isActive: true,
    seasonal: true
  }
]

// Badge Definitions
export const BADGES: Badge[] = [
  // Profile Badges
  {
    id: 'novice',
    name: 'Novizio',
    description: 'Nuovo giocatore del gioco',
    icon: '🌱',
    category: 'achievement',
    rarity: 'common',
    unlockCondition: { type: 'level', value: 1 },
    isEquippable: true,
    slot: 'profile',
    isActive: true
  },
  {
    id: 'veteran',
    name: 'Veterano',
    description: 'Giocatore esperto',
    icon: '🎖️',
    category: 'achievement',
    rarity: 'rare',
    unlockCondition: { type: 'level', value: 5 },
    isEquippable: true,
    slot: 'profile',
    isActive: true
  },
  {
    id: 'legend',
    name: 'Leggenda',
    description: 'Giocatore leggendario',
    icon: '⭐',
    category: 'achievement',
    rarity: 'legendary',
    unlockCondition: { type: 'level', value: 10 },
    isEquippable: true,
    slot: 'profile',
    isActive: true
  },

  // Title Badges
  {
    id: 'champion',
    name: 'Campione',
    description: 'Titolo di campione',
    icon: '🏆',
    category: 'rank',
    rarity: 'epic',
    unlockCondition: { type: 'rank', value: 'gold' },
    isEquippable: true,
    slot: 'title',
    isActive: true
  },
  {
    id: 'master',
    name: 'Maestro',
    description: 'Titolo di maestro',
    icon: '👑',
    category: 'rank',
    rarity: 'legendary',
    unlockCondition: { type: 'rank', value: 'master' },
    isEquippable: true,
    slot: 'title',
    isActive: true
  },

  // Special Badges
  {
    id: 'beta_tester',
    name: 'Beta Tester',
    description: 'Partecipante alla beta',
    icon: '🧪',
    category: 'special',
    rarity: 'epic',
    unlockCondition: { type: 'special', value: 'beta' },
    isEquippable: true,
    slot: 'profile',
    isActive: true
  },
  {
    id: 'founder',
    name: 'Fondatore',
    description: 'Uno dei primi giocatori',
    icon: '🏛️',
    category: 'special',
    rarity: 'legendary',
    unlockCondition: { type: 'special', value: 'founder' },
    isEquippable: true,
    slot: 'profile',
    isActive: true
  }
]

// Challenge Templates
export const CHALLENGE_TEMPLATES = {
  daily: [
    {
      name: 'Vittorie Quotidiane',
      description: 'Vinci 3 partite oggi',
      type: 'wins' as const,
      value: 3,
      rewards: { xp: 50, coins: 100, gems: 5 }
    },
    {
      name: 'Sessione di Gioco',
      description: 'Gioca 5 partite oggi',
      type: 'games' as const,
      value: 5,
      rewards: { xp: 75, coins: 150, gems: 8 }
    },
    {
      name: 'XP Quotidiano',
      description: 'Guadagna 200 XP oggi',
      type: 'xp' as const,
      value: 200,
      rewards: { xp: 100, coins: 200, gems: 10 }
    }
  ],
  weekly: [
    {
      name: 'Settimana Vincente',
      description: 'Vinci 15 partite questa settimana',
      type: 'wins' as const,
      value: 15,
      rewards: { xp: 300, coins: 750, gems: 40 }
    },
    {
      name: 'Maratona di Gioco',
      description: 'Gioca 30 partite questa settimana',
      type: 'games' as const,
      value: 30,
      rewards: { xp: 400, coins: 1000, gems: 60 }
    }
  ],
  seasonal: [
    {
      name: 'Campione Stagionale',
      description: 'Raggiungi 2000 ELO questa stagione',
      type: 'xp' as const,
      value: 2000,
      rewards: { xp: 1000, coins: 5000, gems: 250 }
    }
  ]
}

// Gamification System Class
export class GamificationSystem {
  // Calculate XP needed for next level
  static calculateXPForLevel(level: number): number {
    if (level <= 0) return 0
    if (level > LEVEL_CONFIG.length) {
      // Exponential growth for levels beyond defined
      return Math.floor(100 * Math.pow(1.5, level - 1))
    }
    return LEVEL_CONFIG[level - 1].maxXP
  }

  // Calculate level from total XP
  static calculateLevel(totalXP: number): { level: number; currentXP: number; nextLevelXP: number } {
    let level = 1
    let accumulatedXP = 0

    for (const levelConfig of LEVEL_CONFIG) {
      if (totalXP >= levelConfig.maxXP) {
        level = levelConfig.level
        accumulatedXP = levelConfig.maxXP
      } else {
        break
      }
    }

    const currentXP = totalXP - accumulatedXP
    const nextLevelXP = this.calculateXPForLevel(level + 1)

    return { level, currentXP, nextLevelXP }
  }

  // Check if user meets achievement requirements
  static checkAchievement(
    achievement: Achievement,
    userProgress: UserProgress,
    userStats?: any
  ): boolean {
    const { requirements } = achievement
    let currentValue = 0

    switch (requirements.type) {
      case 'wins':
        currentValue = userStats?.wins || 0
        break
      case 'games_played':
        currentValue = userStats?.gamesPlayed || 0
        break
      case 'streak':
        currentValue = userProgress.streak.current
        break
      case 'level':
        currentValue = userProgress.level
        break
      case 'elo':
        currentValue = userStats?.elo || 0
        break
      case 'daily_streak':
        currentValue = userProgress.streak.dailyStreak
        break
      case 'perfect_game':
        currentValue = userStats?.perfectGames || 0
        break
      case 'comeback':
        currentValue = userStats?.comebacks || 0
        break
      case 'first_place':
        currentValue = userStats?.firstPlaces || 0
        break
    }

    switch (requirements.comparison || 'greater_than_or_equal') {
      case 'equals':
        return currentValue === requirements.value
      case 'greater_than':
        return currentValue > requirements.value
      case 'greater_than_or_equal':
        return currentValue >= requirements.value
      case 'less_than':
        return currentValue < requirements.value
      default:
        return currentValue >= requirements.value
    }
  }

  // Get available achievements for user
  static getAvailableAchievements(userProgress: UserProgress, userStats?: any): Achievement[] {
    return ACHIEVEMENTS.filter(achievement => {
      // Skip if already unlocked
      if (userProgress.achievements.includes(achievement.id)) return false
      
      // Skip if not active
      if (!achievement.isActive) return false
      
      // Skip if expired
      if (achievement.expiresAt && new Date() > new Date(achievement.expiresAt)) return false
      
      // Check if requirements are met
      return this.checkAchievement(achievement, userProgress, userStats)
    })
  }

  // Get user level info
  static getUserLevelInfo(level: number): UserLevel | null {
    return LEVEL_CONFIG.find(config => config.level === level) || null
  }

  // Calculate level progress percentage
  static calculateLevelProgress(currentXP: number, nextLevelXP: number): number {
    if (nextLevelXP === 0) return 100
    return Math.min(100, (currentXP / nextLevelXP) * 100)
  }

  // Generate daily challenges
  static generateDailyChallenges(): Challenge[] {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return CHALLENGE_TEMPLATES.daily.map((template, index) => ({
      id: `daily_${today.toISOString().split('T')[0]}_${index}`,
      name: template.name,
      description: template.description,
      type: 'daily' as const,
      category: template.type as any,
      requirements: {
        type: template.type,
        value: template.value,
        timeframe: 24 // 24 hours
      },
      rewards: template.rewards,
      isActive: true,
      startsAt: today.toISOString(),
      endsAt: tomorrow.toISOString(),
      participants: [],
      completions: {}
    }))
  }

  // Calculate season rewards
  static calculateSeasonRewards(seasonProgress: UserProgress['seasonProgress']): {
    xp: number
    coins: number
    gems: number
    badges: string[]
  } {
    const rewards = { xp: 0, coins: 0, gems: 0, badges: [] }
    
    // Base rewards for participation
    rewards.xp += seasonProgress.seasonXP
    rewards.coins += seasonProgress.seasonWins * 100
    rewards.gems += seasonProgress.seasonWins * 5
    
    // Bonus rewards for achievements
    rewards.xp += seasonProgress.seasonAchievements.length * 100
    rewards.coins += seasonProgress.seasonAchievements.length * 200
    
    return rewards
  }

  // Get next level rewards
  static getNextLevelRewards(currentLevel: number): UserLevel['rewards'] | null {
    const nextLevel = currentLevel + 1
    return LEVEL_CONFIG.find(config => config.level === nextLevel)?.rewards || null
  }

  // Get current level rewards
  static getUserLevelRewards(currentLevel: number): UserLevel['rewards'] | null {
    return LEVEL_CONFIG.find(config => config.level === currentLevel)?.rewards || null
  }

  // Calculate rank from ELO
  static calculateRank(elo: number): { rank: string; tier: number; color: string } {
    if (elo >= 2400) return { rank: 'grandmaster', tier: 1, color: '#FF0000' }
    if (elo >= 2200) return { rank: 'master', tier: elo >= 2300 ? 1 : elo >= 2250 ? 2 : 3, color: '#FF6600' }
    if (elo >= 1900) return { rank: 'diamond', tier: elo >= 2100 ? 1 : elo >= 2000 ? 2 : 3, color: '#00CED1' }
    if (elo >= 1600) return { rank: 'platinum', tier: elo >= 1800 ? 1 : elo >= 1700 ? 2 : 3, color: '#E5E4E2' }
    if (elo >= 1300) return { rank: 'gold', tier: elo >= 1500 ? 1 : elo >= 1400 ? 2 : 3, color: '#FFD700' }
    if (elo >= 1000) return { rank: 'silver', tier: elo >= 1200 ? 1 : elo >= 1100 ? 2 : 3, color: '#C0C0C0' }
    return { rank: 'bronze', tier: elo >= 900 ? 1 : elo >= 800 ? 2 : 3, color: '#CD7F32' }
  }

  // Get available badges for user
  static getAvailableBadges(userProgress: UserProgress): Badge[] {
    return BADGES.filter(badge => {
      // Skip if already owned
      if (userProgress.badges.includes(badge.id)) return false
      
      // Skip if not active
      if (!badge.isActive) return false
      
      // Check unlock condition
      switch (badge.unlockCondition.type) {
        case 'level':
          return userProgress.level >= (badge.unlockCondition.value as number)
        case 'rank':
          const userRank = this.calculateRank(0) // Would need user's ELO
          return userRank.rank === badge.unlockCondition.value
        case 'special':
          return false // Special badges are granted manually
        default:
          return false
      }
    })
  }

  // Format XP with commas
  static formatXP(xp: number): string {
    return xp.toLocaleString('it-IT')
  }

  // Get achievement rarity color
  static getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'common': return '#808080'
      case 'rare': return '#4169E1'
      case 'epic': return '#9932CC'
      case 'legendary': return '#FFD700'
      case 'mythic': return '#FF1493'
      default: return '#808080'
    }
  }

  // Calculate streak bonus
  static calculateStreakBonus(streak: number): { xpMultiplier: number; coinMultiplier: number } {
    if (streak >= 10) return { xpMultiplier: 2.0, coinMultiplier: 2.5 }
    if (streak >= 5) return { xpMultiplier: 1.5, coinMultiplier: 1.75 }
    if (streak >= 3) return { xpMultiplier: 1.25, coinMultiplier: 1.5 }
    return { xpMultiplier: 1.0, coinMultiplier: 1.0 }
  }

  // Generate user statistics summary
  static generateStatsSummary(userProgress: UserProgress, userStats?: any): {
    totalAchievements: number
    unlockedAchievements: number
    completionRate: number
    totalBadges: number
    unlockedBadges: number
    currentLevel: number
    nextLevel: number
    levelProgress: number
    rank: string
    rankColor: string
  } {
    const totalAchievements = ACHIEVEMENTS.length
    const unlockedAchievements = userProgress.achievements.length
    const completionRate = Math.round((unlockedAchievements / totalAchievements) * 100)
    
    const totalBadges = BADGES.length
    const unlockedBadges = userProgress.badges.length
    
    const currentLevelInfo = this.getUserLevelInfo(userProgress.level)
    const nextLevelInfo = this.getUserLevelInfo(userProgress.level + 1)
    
    const rank = this.calculateRank(userStats?.elo || 0)
    
    return {
      totalAchievements,
      unlockedAchievements,
      completionRate,
      totalBadges,
      unlockedBadges,
      currentLevel: userProgress.level,
      nextLevel: nextLevelInfo?.level || userProgress.level,
      levelProgress: this.calculateLevelProgress(userProgress.xp, currentLevelInfo?.maxXP || 0),
      rank: rank.rank,
      rankColor: rank.color
    }
  }
}
