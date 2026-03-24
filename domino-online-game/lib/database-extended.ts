// Extended Database with Gamification System Integration
import { 
  UserProgress, 
  Achievement, 
  Badge, 
  Challenge, 
  Reward,
  GamificationSystem,
  ACHIEVEMENTS,
  BADGES
} from './gamification-system'
import { DominoTile, PlayedTile, GameSettings } from './database-schema'

// Extended User Profile with Gamification
export interface ExtendedUserProfile {
  id: string
  username: string
  email?: string
  passwordHash: string
  avatar: string
  level: number
  xp: number
  totalXP: number
  createdAt: string
  lastLoginAt: string
  isOnline: boolean
  isGuest: boolean
  
  // Gamification fields
  gamification: UserProgress
  
  // Extended stats
  extendedStats: {
    totalPlayTime: number // in minutes
    favoriteGameMode: string
    averageGameDuration: number
    bestGameScore: number
    totalPerfectGames: number
    totalComebacks: number
    totalFirstPlaces: number
    socialStats: {
      friendsCount: number
      gamesWithFriends: number
      giftsSent: number
      giftsReceived: number
    }
    seasonalStats: {
      currentSeason: string
      seasonWins: number
      seasonLosses: number
      seasonXP: number
      seasonRank: string
      seasonAchievements: string[]
    }
  }
}

// Extended Game Session with Gamification tracking
export interface ExtendedGameSession {
  id: string
  mode: 'single' | 'multiplayer' | 'ranked' | 'private' | 'tournament'
  status: 'waiting' | 'playing' | 'paused' | 'finished' | 'abandoned' | 'starting'
  players: ExtendedGamePlayer[]
  currentPlayerIndex: number
  board: PlayedTile[]
  boardEnds: { left: number; right: number }
  deck: DominoTile[]
  winner: string | null
  turnTimer: number | null
  roundNumber: number
  scores: Record<string, number>
  settings: GameSettings
  
  // Gamification tracking
  gamification: {
    xpGained: Record<string, number>
    achievementsUnlocked: string[]
    challengesProgress: Record<string, number>
    perfectGame: boolean
    comeback: boolean
    duration: number // in seconds
    startTime: string
    endTime?: string
  }
  
  startedAt?: string
  finishedAt?: string
  createdAt: string
}

export interface ExtendedGamePlayer {
  userId: string
  username: string
  avatar: string
  hand: DominoTile[]
  isAI: boolean
  aiLevel?: 'easy' | 'medium' | 'hard'
  aiStyle?: 'aggressive' | 'defensive'
  elo?: number
  tileSkin?: string
  isReady: boolean
  connectedAt: string
  lastActionAt: string
  
  // Extended player stats
  extendedStats: {
    movesCount: number
    tilesDrawn: number
    powerUpsUsed: string[]
    score: number
    perfectMoves: number
    mistakes: number
    avgThinkTime: number // in seconds
  }
}

// Tournament System
export interface Tournament {
  id: string
  name: string
  description: string
  type: 'daily' | 'weekly' | 'seasonal' | 'special'
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss'
  maxParticipants: number
  entryFee: {
    coins: number
    gems: number
  }
  prizes: {
    position: number
    coins: number
    gems: number
    xp: number
    specialItems?: string[]
  }[]
  rules: {
    gameMode: string
    turnTimer: number
    allowPowerUps: boolean
    scoreLimit: number
  }
  status: 'registration' | 'in_progress' | 'completed' | 'cancelled'
  participants: TournamentParticipant[]
  bracket: TournamentBracket[]
  currentRound: number
  totalRounds: number
  startsAt: string
  endsAt: string
  createdAt: string
}

export interface TournamentParticipant {
  userId: string
  username: string
  avatar: string
  elo: number
  registeredAt: string
  status: 'registered' | 'active' | 'eliminated' | 'withdrawn'
  currentRound: number
  position?: number
  totalScore: number
  gamesPlayed: number
  gamesWon: number
}

export interface TournamentBracket {
  round: number
  match: number
  player1: TournamentParticipant | null
  player2: TournamentParticipant | null
  winner: string | null
  score: {
    player1: number
    player2: number
  }
  status: 'pending' | 'in_progress' | 'completed'
  scheduledAt: string
  completedAt?: string
}

// Social System
export interface SocialProfile {
  userId: string
  friends: string[]
  friendRequests: {
    sent: string[]
    received: string[]
  }
  blockedUsers: string[]
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'
    showStats: boolean
    showAchievements: boolean
    allowFriendRequests: boolean
  }
  socialStats: {
    friendsCount: number
    gamesWithFriends: number
    giftsSent: number
    giftsReceived: number
    profileViews: number
    lastActive: string
  }
  activity: SocialActivity[]
}

export interface SocialActivity {
  id: string
  userId: string
  type: 'achievement_unlocked' | 'level_up' | 'tournament_won' | 'friend_added' | 'gift_sent' | 'gift_received'
  data: Record<string, any>
  timestamp: string
  isPublic: boolean
}

// Gift System
export interface Gift {
  id: string
  fromUserId: string
  toUserId: string
  type: 'coins' | 'gems' | 'item' | 'badge' | 'message'
  itemData?: {
    itemId: string
    itemType: string
    itemName: string
  }
  message?: string
  isAnonymous: boolean
  isWrapped: boolean
  wrapping?: {
    color: string
    ribbon: string
    tag: string
  }
  status: 'sent' | 'delivered' | 'opened' | 'expired'
  sentAt: string
  deliveredAt?: string
  openedAt?: string
  expiresAt?: string
}

// Notification System
export interface Notification {
  id: string
  userId: string
  type: 'achievement' | 'level_up' | 'friend_request' | 'gift' | 'tournament' | 'challenge' | 'reward' | 'system' | 'friend_added'
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  icon?: string
  actionUrl?: string
  expiresAt?: string
  createdAt: string
  readAt?: string
}

// Analytics System
export interface UserAnalytics {
  userId: string
  date: string
  sessionCount: number
  totalPlayTime: number // in minutes
  gamesPlayed: number
  gamesWon: number
  xpEarned: number
  coinsEarned: number
  gemsEarned: number
  achievementsUnlocked: string[]
  challengesCompleted: string[]
  socialInteractions: number
  purchases: number
  deviceType: string
  browser: string
  country?: string
}

// Extended Database Class
class ExtendedDatabase {
  private users: Map<string, ExtendedUserProfile> = new Map()
  private userProgress: Map<string, UserProgress> = new Map()
  private achievements: Map<string, Achievement> = new Map()
  private badges: Map<string, Badge> = new Map()
  private challenges: Map<string, Challenge> = new Map()
  private rewards: Map<string, Reward> = new Map()
  private tournaments: Map<string, Tournament> = new Map()
  private socialProfiles: Map<string, SocialProfile> = new Map()
  private gifts: Map<string, Gift> = new Map()
  private notifications: Map<string, Notification> = new Map()
  private analytics: Map<string, UserAnalytics[]> = new Map()

  constructor() {
    this.initializeAchievements()
    this.initializeBadges()
    this.initializeChallenges()
  }

  // User Management with Gamification
  async createUser(userData: Omit<ExtendedUserProfile, 'id' | 'createdAt' | 'lastLoginAt' | 'gamification' | 'extendedStats'> & { id: string }): Promise<ExtendedUserProfile> {
    const user: ExtendedUserProfile = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      gamification: this.initializeUserProgress(userData.id),
      extendedStats: {
        totalPlayTime: 0,
        favoriteGameMode: 'single',
        averageGameDuration: 0,
        bestGameScore: 0,
        totalPerfectGames: 0,
        totalComebacks: 0,
        totalFirstPlaces: 0,
        socialStats: {
          friendsCount: 0,
          gamesWithFriends: 0,
          giftsSent: 0,
          giftsReceived: 0
        },
        seasonalStats: {
          currentSeason: this.getCurrentSeason(),
          seasonWins: 0,
          seasonLosses: 0,
          seasonXP: 0,
          seasonRank: 'bronze',
          seasonAchievements: []
        }
      }
    }

    this.users.set(user.id, user)
    this.userProgress.set(user.id, user.gamification)
    this.socialProfiles.set(user.id, this.initializeSocialProfile(user.id))

    return user
  }

  private initializeUserProgress(userId: string): UserProgress {
    return {
      userId,
      xp: 0,
      level: 1,
      totalXP: 0,
      achievements: [],
      badges: [],
      equippedBadges: {},
      streak: {
        current: 0,
        best: 0,
        lastPlayedAt: '',
        dailyStreak: 0,
        lastDailyDate: ''
      },
      stats: {
        totalGames: 0,
        totalWins: 0,
        totalLosses: 0,
        perfectGames: 0,
        comebacks: 0,
        firstPlaces: 0,
        dailyBonusClaimed: false,
        lastDailyClaim: '',
        consecutiveDays: 0
      },
      seasonProgress: {
        seasonId: this.getCurrentSeason(),
        seasonXP: 0,
        seasonLevel: 1,
        seasonRank: 'bronze',
        seasonWins: 0,
        seasonLosses: 0,
        seasonAchievements: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  private initializeSocialProfile(userId: string): SocialProfile {
    return {
      userId,
      friends: [],
      friendRequests: { sent: [], received: [] },
      blockedUsers: [],
      privacy: {
        profileVisibility: 'public',
        showStats: true,
        showAchievements: true,
        allowFriendRequests: true
      },
      socialStats: {
        friendsCount: 0,
        gamesWithFriends: 0,
        giftsSent: 0,
        giftsReceived: 0,
        profileViews: 0,
        lastActive: new Date().toISOString()
      },
      activity: []
    }
  }

  // Gamification Methods
  async awardXP(userId: string, amount: number, source: string, reason?: string): Promise<UserProgress> {
    const progress = this.userProgress.get(userId)
    if (!progress) throw new Error('User not found')

    const oldLevel = progress.level
    progress.totalXP += amount
    progress.xp += amount

    // Check for level up
    const newLevelInfo = GamificationSystem.calculateLevel(progress.totalXP)
    if (newLevelInfo.level > oldLevel) {
      progress.level = newLevelInfo.level
      progress.xp = newLevelInfo.currentXP
      
      // Award level up rewards
      const levelRewards = GamificationSystem.getUserLevelRewards(oldLevel)
      if (levelRewards) {
        await this.createReward({
          type: 'coins',
          name: `Premio Livello ${oldLevel + 1}`,
          description: `Raggiunto il livello ${oldLevel + 1}`,
          icon: '🎉',
          value: levelRewards.coins,
          rarity: 'common',
          source: `level_up_${oldLevel + 1}`,
          createdAt: new Date().toISOString()
        })
      }
    }

    progress.updatedAt = new Date().toISOString()
    this.userProgress.set(userId, progress)

    // Create notification
    await this.createNotification({
      userId,
      type: 'reward',
      title: `+${amount} XP`,
      message: reason || `Hai guadagnato ${amount} XP da ${source}`,
      priority: 'medium',
      icon: '⭐'
    })

    return progress
  }

  async checkAndUnlockAchievements(userId: string, userStats?: any): Promise<string[]> {
    const progress = this.userProgress.get(userId)
    if (!progress) return []

    const availableAchievements = GamificationSystem.getAvailableAchievements(progress, userStats)
    const unlockedAchievements: string[] = []

    for (const achievement of availableAchievements) {
      if (GamificationSystem.checkAchievement(achievement, progress, userStats)) {
        progress.achievements.push(achievement.id)
        unlockedAchievements.push(achievement.id)

        // Award achievement rewards
        await this.awardXP(userId, achievement.xpReward, 'achievement', achievement.name)
        
        await this.createReward({
          userId,
          type: 'coins',
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          value: achievement.coinsReward,
          rarity: achievement.rarity,
          source: `achievement_${achievement.id}`
        })

        if (achievement.gemsReward > 0) {
          await this.createReward({
            userId,
            type: 'gems',
            name: `${achievement.name} - Gemme`,
            description: `Gemme bonus dall'achievement ${achievement.name}`,
            icon: '💎',
            value: achievement.gemsReward,
            rarity: achievement.rarity,
            source: `achievement_${achievement.id}_gems`
          })
        }

        // Create notification
        await this.createNotification({
          userId,
          type: 'achievement',
          title: 'Achievement Sbloccato!',
          message: achievement.description,
          priority: 'high',
          icon: achievement.icon,
          data: { achievementId: achievement.id }
        })
      }
    }

    progress.updatedAt = new Date().toISOString()
    this.userProgress.set(userId, progress)

    return unlockedAchievements
  }

  async updateStreak(userId: string, won: boolean): Promise<UserProgress> {
    const progress = this.userProgress.get(userId)
    if (!progress) throw new Error('User not found')

    const today = new Date().toDateString()
    
    if (won) {
      progress.streak.current++
      progress.streak.best = Math.max(progress.streak.best, progress.streak.current)
      
      // Update daily streak
      if (progress.streak.lastDailyDate !== today) {
        if (progress.streak.lastDailyDate) {
          const lastDate = new Date(progress.streak.lastDailyDate)
          const todayDate = new Date(today)
          const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays === 1) {
            progress.streak.dailyStreak++
          } else {
            progress.streak.dailyStreak = 1
          }
        } else {
          progress.streak.dailyStreak = 1
        }
        progress.streak.lastDailyDate = today
      }
    } else {
      progress.streak.current = 0
    }

    progress.streak.lastPlayedAt = new Date().toISOString()
    progress.updatedAt = new Date().toISOString()
    this.userProgress.set(userId, progress)

    return progress
  }

  // Tournament Management
  async createTournament(tournamentData: Omit<Tournament, 'id' | 'createdAt' | 'participants' | 'bracket' | 'currentRound'>): Promise<Tournament> {
    const tournament: Tournament = {
      ...tournamentData,
      id: `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participants: [],
      bracket: [],
      currentRound: 1,
      totalRounds: Math.ceil(Math.log2(tournamentData.maxParticipants)),
      createdAt: new Date().toISOString()
    }

    this.tournaments.set(tournament.id, tournament)
    return tournament
  }

  async joinTournament(tournamentId: string, userId: string): Promise<boolean> {
    const tournament = this.tournaments.get(tournamentId)
    if (!tournament || tournament.status !== 'registration') return false

    const user = this.users.get(userId)
    if (!user) return false

    if (tournament.participants.length >= tournament.maxParticipants) return false

    const participant: TournamentParticipant = {
      userId,
      username: user.username,
      avatar: user.avatar,
      elo: 1000, // Would get from user stats
      registeredAt: new Date().toISOString(),
      status: 'registered',
      currentRound: 1,
      totalScore: 0,
      gamesPlayed: 0,
      gamesWon: 0
    }

    tournament.participants.push(participant)
    this.tournaments.set(tournamentId, tournament)

    return true
  }

  // Social Methods
  async sendFriendRequest(fromUserId: string, toUserId: string): Promise<boolean> {
    const fromProfile = this.socialProfiles.get(fromUserId)
    const toProfile = this.socialProfiles.get(toUserId)

    if (!fromProfile || !toProfile) return false
    if (fromProfile.friends.includes(toUserId)) return false
    if (fromProfile.friendRequests.sent.includes(toUserId)) return false

    fromProfile.friendRequests.sent.push(toUserId)
    toProfile.friendRequests.received.push(fromUserId)

    this.socialProfiles.set(fromUserId, fromProfile)
    this.socialProfiles.set(toUserId, toProfile)

    // Create notification
    await this.createNotification({
      userId: toUserId,
      type: 'friend_request',
      title: 'Richiesta di Amicizia',
      message: `${fromProfile.userId} vuole essere tuo amico`,
      priority: 'medium',
      icon: '👥',
      actionUrl: `/friends/requests`
    })

    return true
  }

  async acceptFriendRequest(userId: string, friendId: string): Promise<boolean> {
    const profile = this.socialProfiles.get(userId)
    const friendProfile = this.socialProfiles.get(friendId)

    if (!profile || !friendProfile) return false

    // Add to friends list
    profile.friends.push(friendId)
    friendProfile.friends.push(userId)

    // Remove from requests
    profile.friendRequests.received = profile.friendRequests.received.filter(id => id !== friendId)
    friendProfile.friendRequests.sent = friendProfile.friendRequests.sent.filter(id => id !== userId)

    // Update stats
    profile.socialStats.friendsCount++
    friendProfile.socialStats.friendsCount++

    this.socialProfiles.set(userId, profile)
    this.socialProfiles.set(friendId, friendProfile)

    // Create notifications
    await this.createNotification({
      userId: friendId,
      type: 'friend_added',
      title: 'Nuovo Amico',
      message: `${profile.userId} ha accettato la tua richiesta di amicizia`,
      priority: 'medium',
      icon: '🎉'
    })

    return true
  }

  async sendGift(fromUserId: string, toUserId: string, giftData: Omit<Gift, 'id' | 'fromUserId' | 'toUserId' | 'status' | 'sentAt'>): Promise<Gift> {
    const gift: Gift = {
      ...giftData,
      id: `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromUserId,
      toUserId,
      status: 'sent',
      sentAt: new Date().toISOString()
    }

    this.gifts.set(gift.id, gift)

    // Update social stats
    const fromProfile = this.socialProfiles.get(fromUserId)
    if (fromProfile) {
      fromProfile.socialStats.giftsSent++
      this.socialProfiles.set(fromUserId, fromProfile)
    }

    // Create notification
    await this.createNotification({
      userId: toUserId,
      type: 'gift',
      title: 'Hai Ricevuto un Regalo!',
      message: gift.message || 'Qualcuno ti ha inviato un regalo',
      priority: 'high',
      icon: '🎁',
      actionUrl: `/gifts/${gift.id}`
    })

    return gift
  }

  // Notification System
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification> {
    const notification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isRead: false
    }

    this.notifications.set(notification.id, notification)
    return notification
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const notifications = Array.from(this.notifications.values())
      .filter(notif => notif.userId === userId && !notif.isRead)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return notifications
  }

  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const notification = this.notifications.get(notificationId)
    if (!notification) return false

    notification.isRead = true
    notification.readAt = new Date().toISOString()
    this.notifications.set(notificationId, notification)

    return true
  }

  // Analytics
  async recordAnalytics(analyticsData: Omit<UserAnalytics, 'date'>): Promise<void> {
    const userId = analyticsData.userId
    const date = new Date().toISOString().split('T')[0]

    if (!this.analytics.has(userId)) {
      this.analytics.set(userId, [])
    }

    const userAnalytics = this.analytics.get(userId)!
    const existingEntry = userAnalytics.find(entry => entry.date === date)

    if (existingEntry) {
      // Update existing entry
      Object.assign(existingEntry, analyticsData)
    } else {
      // Create new entry
      userAnalytics.push({
        ...analyticsData,
        date
      })
    }

    // Keep only last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    this.analytics.set(userId, userAnalytics.filter(entry => 
      new Date(entry.date) >= thirtyDaysAgo
    ))
  }

  // Helper Methods
  private getCurrentSeason(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    
    // Season changes every 3 months
    const season = Math.floor(month / 3) + 1
    return `${year}_S${season}`
  }

  private initializeAchievements(): void {
    ACHIEVEMENTS.forEach(achievement => {
      this.achievements.set(achievement.id, achievement)
    })
  }

  private initializeBadges(): void {
    BADGES.forEach(badge => {
      this.badges.set(badge.id, badge)
    })
  }

  private initializeChallenges(): void {
    // Initialize daily challenges
    const dailyChallenges = GamificationSystem.generateDailyChallenges()
    dailyChallenges.forEach(challenge => {
      this.challenges.set(challenge.id, challenge)
    })
  }

  // Reward System
  async createReward(rewardData: Omit<Reward, 'id' | 'isClaimed'>): Promise<Reward> {
    const reward: Reward = {
      ...rewardData,
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      isClaimed: false
    }

    this.rewards.set(reward.id, reward)
    return reward
  }

  // Getters
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    return this.userProgress.get(userId) || null
  }

  async getUser(userId: string): Promise<ExtendedUserProfile | null> {
    return this.users.get(userId) || null
  }

  async getSocialProfile(userId: string): Promise<SocialProfile | null> {
    return this.socialProfiles.get(userId) || null
  }

  async getUserAnalytics(userId: string, days: number = 30): Promise<UserAnalytics[]> {
    const analytics = this.analytics.get(userId) || []
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return analytics.filter(entry => new Date(entry.date) >= cutoffDate)
  }

  async getActiveTournaments(): Promise<Tournament[]> {
    const now = new Date()
    return Array.from(this.tournaments.values())
      .filter(tournament => 
        tournament.status !== 'completed' && 
        tournament.status !== 'cancelled' &&
        new Date(tournament.endsAt) > now
      )
  }

  async getUserTournaments(userId: string): Promise<Tournament[]> {
    return Array.from(this.tournaments.values())
      .filter(tournament => 
        tournament.participants.some(p => p.userId === userId)
      )
  }

  async getLeaderboard(type: 'xp' | 'level' | 'wins' | 'achievements', limit: number = 100): Promise<any[]> {
    const users = Array.from(this.users.values())
    const progress = Array.from(this.userProgress.values())

    const leaderboard = progress.map(p => {
      const user = users.find(u => u.id === p.userId)
      return {
        userId: p.userId,
        username: user?.username || 'Unknown',
        avatar: user?.avatar || 'default',
        level: p.level,
        xp: p.totalXP,
        achievements: p.achievements.length,
        stats: p.stats
      }
    })

    switch (type) {
      case 'xp':
        return leaderboard.sort((a, b) => b.xp - a.xp).slice(0, limit)
      case 'level':
        return leaderboard.sort((a, b) => b.level - a.level).slice(0, limit)
      case 'wins':
        return leaderboard.sort((a, b) => b.stats.totalWins - a.stats.totalWins).slice(0, limit)
      case 'achievements':
        return leaderboard.sort((a, b) => b.achievements - a.achievements).slice(0, limit)
      default:
        return leaderboard.slice(0, limit)
    }
  }
}

// Export singleton instance
export const extendedDb = new ExtendedDatabase()
