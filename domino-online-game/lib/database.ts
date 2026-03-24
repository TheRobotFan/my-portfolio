// In-memory database implementation for development
// In production, replace with PostgreSQL/MySQL/MongoDB

import {
  User, UserStats, RankedData, Inventory, GameSession, GamePlayer,
  Room, MatchmakingQueue, Transaction, Achievement,
  LeaderboardEntry, GameHistory, ShopItem, LiveOpsEvent,
  TileSkinData, AvatarSkinData, TableSkinData, PowerUpData,
  Clan, ClanMember, ChatMessage, Tournament, ClanSeason, ClanWar,
  BattlePass, UserBattlePass, Referral, ReferralReward, ClanTerritory
} from './database-schema'

import { getPrisma } from './prisma'

// Persistent database storage via Prisma
class InMemoryDatabase {
  private gameSessions: Map<string, GameSession> = new Map()
  private rooms: Map<string, Room> = new Map()
  private matchmakingQueue: Map<string, MatchmakingQueue> = new Map()
  private chatMessages: ChatMessage[] = []

  constructor() {
    // Initial data setup now happens via SQL migrations/pushes
  }

  // Helper to ensure related models exist for a user
  private async ensureUserRelations(userId: string) {
    const stats = await getPrisma().userStats.findUnique({ where: { userId } })
    if (!stats) {
      await getPrisma().userStats.create({ data: { userId } })
    }
    const ranked = await getPrisma().rankedData.findUnique({ where: { userId } })
    if (!ranked) {
      await getPrisma().rankedData.create({ data: { userId } })
    }
    const inventory = await getPrisma().inventory.findUnique({ where: { userId } })
    if (!inventory) {
      await getPrisma().inventory.create({ data: { userId } })
    }
  }

  // User operations
  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'lastLoginAt' | 'referralCode'>): Promise<User> {
    const user = await getPrisma().user.create({
      data: {
        ...userData,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      }
    })

    // Initialize related data
    await this.ensureUserRelations(user.id)

    return this.mapPrismaUser(user)
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await getPrisma().user.findUnique({ where: { id } })
    return user ? this.mapPrismaUser(user) : null
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = await getPrisma().user.findUnique({ where: { username } })
    return user ? this.mapPrismaUser(user) : null
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = await getPrisma().user.update({
      where: { id },
      data: updates as any
    })
    return this.mapPrismaUser(user)
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await getPrisma().user.delete({ where: { id } })
      return true
    } catch {
      return false
    }
  }

  // User Stats operations
  async getUserStats(userId: string): Promise<UserStats | null> {
    return getPrisma().userStats.findUnique({ where: { userId } }) as any
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats | null> {
    return getPrisma().userStats.update({
      where: { userId },
      data: updates as any
    }) as any
  }

  // Helper to map Prisma user to UI User interface if needed
  private mapPrismaUser(user: any): User {
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt.toISOString(),
    }
  }

  // Ranked Data operations
  async getRankedData(userId: string): Promise<RankedData | null> {
    return getPrisma().rankedData.findUnique({ where: { userId } }) as any
  }

  async updateRankedData(userId: string, updates: Partial<RankedData>): Promise<RankedData | null> {
    return getPrisma().rankedData.update({
      where: { userId },
      data: updates as any
    }) as any
  }

  // Inventory operations
  async getInventory(userId: string): Promise<Inventory | null> {
    return getPrisma().inventory.findUnique({ where: { userId } }) as any
  }

  async updateInventory(userId: string, updates: Partial<Inventory>): Promise<Inventory | null> {
    return getPrisma().inventory.update({
      where: { userId },
      data: updates as any
    }) as any
  }

  // Game Session operations
  async createGameSession(sessionData: Omit<GameSession, 'id' | 'createdAt'>): Promise<GameSession> {
    const session: GameSession = {
      ...sessionData,
      id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    this.gameSessions.set(session.id, session)
    return session
  }

  async getGameSession(id: string): Promise<GameSession | null> {
    return this.gameSessions.get(id) || null
  }

  async updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | null> {
    const session = this.gameSessions.get(id)
    if (!session) return null

    const updatedSession = { ...session, ...updates }
    this.gameSessions.set(id, updatedSession)
    return updatedSession
  }

  async deleteGameSession(id: string): Promise<boolean> {
    return this.gameSessions.delete(id)
  }

  async getUserActiveGames(userId: string): Promise<GameSession[]> {
    const games: GameSession[] = []
    for (const session of this.gameSessions.values()) {
      if (session.players.some((p: GamePlayer) => p.userId === userId) &&
        (session.status === 'waiting' || session.status === 'playing' || session.status === 'paused')) {
        games.push(session)
      }
    }
    return games
  }

  // Room operations
  async createRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'expiresAt'>): Promise<Room> {
    const room: Room = {
      ...roomData,
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
    }
    this.rooms.set(room.id, room)
    return room
  }

  async getRoom(id: string): Promise<Room | null> {
    return this.rooms.get(id) || null
  }

  async updateRoom(id: string, updates: Partial<Room>): Promise<Room | null> {
    const room = this.rooms.get(id)
    if (!room) return null

    const updatedRoom = { ...room, ...updates }
    this.rooms.set(id, updatedRoom)
    return updatedRoom
  }

  async deleteRoom(id: string): Promise<boolean> {
    return this.rooms.delete(id)
  }

  async getAvailableRooms(limit: number = 50): Promise<Room[]> {
    const rooms: Room[] = []
    for (const room of this.rooms.values()) {
      if (room.status === 'waiting' && room.players.length < room.maxPlayers) {
        rooms.push(room)
      }
    }
    return rooms.slice(0, limit)
  }

  // Matchmaking operations
  async addToMatchmaking(queueData: Omit<MatchmakingQueue, 'id' | 'joinedAt'>): Promise<MatchmakingQueue> {
    const queue: MatchmakingQueue = {
      ...queueData,
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      joinedAt: new Date().toISOString(),
    }
    this.matchmakingQueue.set(queue.id, queue)
    return queue
  }

  async getMatchmakingQueue(userId: string): Promise<MatchmakingQueue | null> {
    for (const queue of this.matchmakingQueue.values()) {
      if (queue.userId === userId) return queue
    }
    return null
  }

  async removeFromMatchmaking(userId: string): Promise<boolean> {
    for (const [id, queue] of this.matchmakingQueue.entries()) {
      if (queue.userId === userId) {
        return this.matchmakingQueue.delete(id)
      }
    }
    return false
  }

  async getMatchmakingQueueByMode(mode: 'ranked' | 'casual'): Promise<MatchmakingQueue[]> {
    const queues: MatchmakingQueue[] = []
    for (const queue of this.matchmakingQueue.values()) {
      if (queue.mode === mode) {
        queues.push(queue)
      }
    }
    return queues
  }

  // Transaction operations
  async createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const transaction = await getPrisma().transaction.create({
      data: transactionData as any
    })
    return this.mapPrismaTransaction(transaction)
  }

  async getUserTransactions(userId: string, limit: number = 50): Promise<Transaction[]> {
    const transactions = await getPrisma().transaction.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
    return transactions.map((t: any) => this.mapPrismaTransaction(t))
  }

  // Achievement operations
  async unlockAchievement(achievementData: Omit<Achievement, 'id' | 'unlockedAt'>): Promise<Achievement> {
    const achievement = await getPrisma().achievement.upsert({
      where: {
        userId_achievementId: {
          userId: achievementData.userId,
          achievementId: achievementData.achievementId
        }
      },
      update: { progress: achievementData.progress || 0 },
      create: achievementData as any
    })
    return this.mapPrismaAchievement(achievement)
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const achievements = await getPrisma().achievement.findMany({
      where: { userId }
    })
    return achievements.map((a: any) => this.mapPrismaAchievement(a))
  }

  // Game History operations
  async addGameHistory(historyData: Omit<GameHistory, 'id' | 'playedAt'>): Promise<GameHistory> {
    const history = await getPrisma().gameHistory.create({
      data: historyData as any
    })
    return this.mapPrismaHistory(history)
  }

  async getUserGameHistory(userId: string, limit: number = 50): Promise<GameHistory[]> {
    const history = await getPrisma().gameHistory.findMany({
      where: { userId },
      take: limit,
      orderBy: { playedAt: 'desc' }
    })
    return history.map((h: any) => this.mapPrismaHistory(h))
  }

  // Leaderboard operations
  async getLeaderboard(mode: 'elo' | 'wins' | 'win_rate', limit: number = 100): Promise<LeaderboardEntry[]> {
    let usersWithStats: any[] = []

    if (mode === 'elo') {
      usersWithStats = await getPrisma().user.findMany({
        include: { stats: true, ranked: true },
        orderBy: { ranked: { elo: 'desc' } },
        take: limit
      })
    } else if (mode === 'wins') {
      usersWithStats = await getPrisma().user.findMany({
        include: { stats: true, ranked: true },
        orderBy: { stats: { wins: 'desc' } },
        take: limit
      })
    } else {
      // win_rate is complex in SQL, we'll do it in memory for now or simple query
      usersWithStats = await getPrisma().user.findMany({
        include: { stats: true, ranked: true },
        take: limit
      })
    }

    const entries = usersWithStats.map((u, index) => {
      const stats = u.stats || { wins: 0, losses: 0 }
      const winRate = stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0
      return {
        userId: u.id,
        username: u.username,
        avatar: u.avatar,
        elo: u.ranked?.elo || 800,
        rank: index + 1,
        wins: stats.wins,
        losses: stats.losses,
        winRate,
        lastActiveAt: u.lastLoginAt.toISOString(),
      }
    })

    if (mode === 'win_rate') {
      entries.sort((a, b) => b.winRate - a.winRate)
      entries.forEach((e, i) => e.rank = i + 1)
    }

    return entries
  }

  // Shop operations
  async getShopItems(type?: string): Promise<ShopItem[]> {
    return getPrisma().shopItem.findMany({
      where: {
        type: type,
        isActive: true
      }
    }) as any
  }

  async getShopItem(id: string): Promise<ShopItem | null> {
    return getPrisma().shopItem.findUnique({ where: { id } }) as any
  }

  // Live Ops Events operations
  async getActiveEvents(): Promise<LiveOpsEvent[]> {
    const now = new Date()
    const events = await getPrisma().liveOpsEvent.findMany({
      where: {
        isActive: true,
        startTime: { lte: now },
        endTime: { gte: now }
      }
    })
    return events.map((e: any) => this.mapPrismaEvent(e))
  }

  async createEvent(eventData: Omit<LiveOpsEvent, 'id'>): Promise<LiveOpsEvent> {
    const event = await getPrisma().liveOpsEvent.create({
      data: eventData as any
    })
    return this.mapPrismaEvent(event)
  }

  // Clan operations
  async getClan(id: string): Promise<Clan | null> {
    const clan = await getPrisma().clan.findUnique({
      where: { id },
      include: { members: true }
    })
    return clan ? this.mapPrismaClan(clan) : null
  }

  async getAllClans(): Promise<Clan[]> {
    const clans = await getPrisma().clan.findMany({
      include: { members: true }
    })
    return clans.map((c: any) => this.mapPrismaClan(c))
  }

  async createClan(userId: string, clanData: Omit<Clan, 'id' | 'createdAt' | 'ownerId' | 'members' | 'level' | 'points' | 'warPoints' | 'seasonWins' | 'seasonLosses'>): Promise<Clan> {
    const user = await this.getUserById(userId)
    if (!user) throw new Error('User not found')

    const clan = await getPrisma().clan.create({
      data: {
        ...clanData,
        ownerId: userId,
        members: {
          create: {
            userId: user.id,
            username: user.username,
            role: 'leader',
            joinedAt: new Date(),
          }
        }
      },
      include: { members: true }
    })

    return this.mapPrismaClan(clan)
  }

  async joinClan(clanId: string, userId: string): Promise<boolean> {
    const user = await this.getUserById(userId)
    if (!user) return false

    try {
      await getPrisma().clanMember.create({
        data: {
          clanId,
          userId: user.id,
          username: user.username,
          role: 'member',
          joinedAt: new Date(),
        }
      })
      return true
    } catch (e) {
      return false
    }
  }

  async updateClan(id: string, updates: Partial<Clan>): Promise<Clan | null> {
    const clan = await getPrisma().clan.update({
      where: { id },
      data: updates as any,
      include: { members: true }
    })
    return this.mapPrismaClan(clan)
  }

  // Chat operations
  async addChatMessage(msg: ChatMessage): Promise<void> {
    await getPrisma().chatMessage.create({
      data: {
        ...msg,
        timestamp: new Date(msg.timestamp)
      } as any
    })
  }

  async getChatHistory(type: 'global' | 'clan' = 'global', clanId?: string): Promise<ChatMessage[]> {
    const messages = await getPrisma().chatMessage.findMany({
      where: {
        type,
        clanId: clanId || undefined
      },
      take: 50,
      orderBy: { timestamp: 'desc' }
    })
    return messages.map((m: any) => ({ ...m, timestamp: m.timestamp.toISOString() })) as any
  }

  // Tournament operations
  async createTournament(data: Omit<Tournament, 'id' | 'createdAt' | 'currentRound' | 'participants' | 'matches'>): Promise<Tournament> {
    const tournament = await getPrisma().tournament.create({
      data: {
        ...data,
        participants: [],
        matches: []
      } as any
    })
    return this.mapPrismaTournament(tournament)
  }

  async getTournament(id: string): Promise<Tournament | null> {
    const tournament = await getPrisma().tournament.findUnique({ where: { id } })
    return tournament ? this.mapPrismaTournament(tournament) : null
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament | null> {
    const tournament = await getPrisma().tournament.update({
      where: { id },
      data: updates as any
    })
    return this.mapPrismaTournament(tournament)
  }

  async getActiveTournaments(): Promise<Tournament[]> {
    const tournaments = await getPrisma().tournament.findMany({
      where: {
        status: { in: ['registration', 'active'] }
      },
      orderBy: { startTime: 'asc' }
    })
    return tournaments.map((t: any) => this.mapPrismaTournament(t))
  }

  // Battle Pass operations
  async createBattlePass(data: Omit<BattlePass, 'id'>): Promise<BattlePass> {
    const bp = await getPrisma().battlePass.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        tiers: data.tiers as any
      }
    })
    return this.mapPrismaBattlePass(bp)
  }

  async getBattlePass(id: string): Promise<BattlePass | null> {
    const bp = await getPrisma().battlePass.findUnique({ where: { id } })
    return bp ? this.mapPrismaBattlePass(bp) : null
  }

  async getActiveBattlePass(): Promise<BattlePass | null> {
    const bp = await getPrisma().battlePass.findFirst({
      where: { isActive: true }
    })
    return bp ? this.mapPrismaBattlePass(bp) : null
  }

  async getUserBattlePass(userId: string, bpId: string): Promise<UserBattlePass | null> {
    const ubp = await getPrisma().userBattlePass.findUnique({
      where: { userId_bpId: { userId, bpId } }
    })
    return ubp as any
  }

  async createUserBattlePass(data: UserBattlePass): Promise<UserBattlePass> {
    const ubp = await getPrisma().userBattlePass.create({
      data: data as any
    })
    return ubp as any
  }

  async updateUserBattlePass(userId: string, bpId: string, updates: Partial<UserBattlePass>): Promise<UserBattlePass | null> {
    const ubp = await getPrisma().userBattlePass.update({
      where: { userId_bpId: { userId, bpId } },
      data: updates as any
    })
    return ubp as any
  }

  // Referral operations
  async createReferral(data: Omit<Referral, 'id' | 'createdAt'>): Promise<Referral> {
    const referral = await getPrisma().referral.create({
      data: data as any
    })
    return { ...referral, createdAt: referral.createdAt.toISOString() } as any
  }

  async getReferralByInvitee(inviteeId: string): Promise<Referral | null> {
    const referral = await getPrisma().referral.findUnique({
      where: { inviteeId }
    })
    return referral ? { ...referral, createdAt: referral.createdAt.toISOString() } as any : null
  }

  async getReferralCodes(): Promise<Map<string, string>> {
    const users = await getPrisma().user.findMany({
      select: { id: true, referralCode: true }
    })
    const codes = new Map<string, string>();
    users.forEach((u: any) => codes.set(u.referralCode, u.id));
    return codes;
  }

  async createReferralReward(data: Omit<ReferralReward, 'id' | 'createdAt'>): Promise<ReferralReward> {
    const reward = await getPrisma().referralReward.create({
      data: data as any
    })
    return { ...reward, createdAt: reward.createdAt.toISOString() } as any
  }

  async getUserReferralRewards(userId: string): Promise<ReferralReward[]> {
    const rewards = await getPrisma().referralReward.findMany({
      where: { userId }
    })
    return rewards.map((r: any) => ({ ...r, createdAt: r.createdAt.toISOString() })) as any
  }

  // Territory operations
  async getTerritories(): Promise<ClanTerritory[]> {
    const territories = await getPrisma().clanTerritory.findMany()
    return territories as any
  }

  async updateTerritory(id: string, updates: Partial<ClanTerritory>): Promise<ClanTerritory | null> {
    const territory = await getPrisma().clanTerritory.update({
      where: { id },
      data: updates as any
    })
    return territory as any
  }

  async getAllUsers(): Promise<User[]> {
    const users = await getPrisma().user.findMany()
    return users.map((u: any) => this.mapPrismaUser(u))
  }

  // Mappers
  private mapPrismaTransaction(t: any): Transaction {
    return { ...t, createdAt: t.createdAt.toISOString() }
  }
  private mapPrismaAchievement(a: any): Achievement {
    return { ...a, unlockedAt: a.unlockedAt.toISOString() }
  }
  private mapPrismaHistory(h: any): GameHistory {
    return { ...h, playedAt: h.playedAt.toISOString() }
  }
  private mapPrismaEvent(e: any): LiveOpsEvent {
    return {
      ...e,
      startTime: e.startTime.toISOString(),
      endTime: e.endTime.toISOString(),
      settingsOverride: e.settingsOverride as any
    }
  }

  private mapPrismaClan(c: any): Clan {
    return {
      ...c,
      createdAt: c.createdAt.toISOString(),
      members: c.members?.map((m: any) => ({
        ...m,
        joinedAt: m.joinedAt.toISOString()
      })) || []
    }
  }

  private mapPrismaTournament(t: any): Tournament {
    return {
      ...t,
      createdAt: t.createdAt.toISOString(),
      startTime: t.startTime.toISOString(),
      endTime: t.endTime ? t.endTime.toISOString() : undefined,
      participants: t.participants as any,
      matches: t.matches as any
    }
  }

  private mapPrismaBattlePass(bp: any): BattlePass {
    return {
      ...bp,
      startDate: bp.startDate.toISOString(),
      endDate: bp.endDate.toISOString(),
      tiers: bp.tiers as any
    }
  }

  // Cleanup expired rooms and sessions
  async cleanupExpiredData(): Promise<void> {
    const now = new Date()

    // Clean expired rooms
    for (const [id, room] of this.rooms.entries()) {
      if (new Date(room.expiresAt) < now) {
        this.rooms.delete(id)
      }
    }

    // Clean old finished game sessions
    for (const [id, session] of this.gameSessions.entries()) {
      if (session.status === 'finished' && session.finishedAt) {
        const finishedTime = new Date(session.finishedAt)
        const hoursSinceFinished = (now.getTime() - finishedTime.getTime()) / (1000 * 60 * 60)
        if (hoursSinceFinished > 24) { // Remove after 24 hours
          this.gameSessions.delete(id)
        }
      }
    }
  }
}

// Singleton instance
export const db = new InMemoryDatabase()

// Auto-cleanup every hour
setInterval(() => {
  db.cleanupExpiredData()
}, 60 * 60 * 1000)
