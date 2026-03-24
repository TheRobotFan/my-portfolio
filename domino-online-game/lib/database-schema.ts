// Database Schema for Dominion: Elite Domino
// Using TypeScript interfaces for type safety

export interface User {
  id: string
  username: string
  email?: string
  passwordHash: string
  avatar: string
  level: number
  xp: number
  xpToNextLevel: number
  createdAt: string
  lastLoginAt: string
  isOnline: boolean
  isGuest: boolean
  referralCode: string
  referredBy?: string
}

export interface UserStats {
  userId: string
  wins: number
  losses: number
  streak: number
  highestStreak: number
  gamesPlayed: number
  totalPoints: number
  avgGameDuration: number
}

export interface RankedData {
  userId: string
  elo: number
  rank: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster'
  tier: 1 | 2 | 3
  wins: number
  losses: number
  winStreak: number
  highestElo: number
  season: number
  seasonWins: number
  seasonLosses: number
  lastMatchAt: string
}

export interface Inventory {
  userId: string
  coins: number
  gems: number
  tileSkins: string[]
  avatarSkins: string[]
  tableSkins: string[]
  powerUps: Record<string, number>
  equippedTileSkin: string
  equippedAvatar: string
  equippedTable: string
}

export interface GameSession {
  id: string
  mode: 'single' | 'multiplayer' | 'ranked' | 'private'
  status: 'waiting' | 'playing' | 'paused' | 'finished' | 'abandoned' | 'starting'
  players: GamePlayer[]
  currentPlayerIndex: number
  board: PlayedTile[]
  boardEnds: { left: number; right: number }
  deck: DominoTile[]
  winner: string | null
  turnTimer: number | null
  roundNumber: number
  scores: Record<string, number>
  settings: GameSettings
  startedAt?: string
  finishedAt?: string
  createdAt: string
}

export interface GamePlayer {
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
}

export interface DominoTile {
  id: string
  left: number
  right: number
  isDouble: boolean
}

export interface PlayedTile {
  tileId: string
  tile: DominoTile
  position: number
  rotation: number
  playedBy: string
  playedAt: string
}

export interface GameSettings {
  turnTimer: number
  rounds: number
  allowPowerUps: boolean
  isPrivate: boolean
  password?: string
  maxPlayers: number
}

export interface Room {
  id: string
  name: string
  hostId: string
  players: RoomPlayer[]
  maxPlayers: number
  isPrivate: boolean
  password?: string
  status: 'waiting' | 'starting' | 'in_game' | 'finished'
  mode: 'casual' | 'ranked' | 'private'
  settings: GameSettings
  createdAt: string
  expiresAt: string
}

export interface RoomPlayer {
  userId: string
  username: string
  avatar: string
  ready: boolean
  joinedAt: string
}

export interface MatchmakingQueue {
  id: string
  userId: string
  mode: 'ranked' | 'casual'
  elo: number
  preferences: {
    turnTimer: number
    allowPowerUps: boolean
  }
  joinedAt: string
  estimatedWaitTime: number
}

export interface PowerUpUsage {
  id: string
  userId: string
  gameId: string
  powerUpId: string
  usedAt: string
  targetUserId?: string
  effectData?: Record<string, any>
}

export interface Transaction {
  id: string
  userId: string
  type: 'purchase' | 'reward' | 'daily_bonus' | 'achievement'
  amount: number
  currency: 'coins' | 'gems'
  itemId?: string
  itemType?: 'tile_skin' | 'avatar_skin' | 'table_skin' | 'power_up'
  description: string
  createdAt: string
}

export interface Achievement {
  id: string
  userId: string
  achievementId: string
  unlockedAt: string
  progress: number
}

export interface LeaderboardEntry {
  userId: string
  username: string
  avatar: string
  elo: number
  rank: number
  wins: number
  losses: number
  winRate: number
  lastActiveAt: string
}

export interface GameHistory {
  id: string
  userId: string
  gameId: string
  mode: 'single' | 'multiplayer' | 'ranked' | 'private'
  result: 'win' | 'loss' | 'draw'
  opponentId?: string
  opponentName?: string
  eloChange?: number
  coinsEarned: number
  xpEarned: number
  duration: number
  playedAt: string
}

export interface LiveOpsEvent {
  id: string
  type: 'flash_event' | 'ltm'
  name: string
  description: string
  xpMultiplier: number
  coinMultiplier: number
  startTime: string
  endTime: string
  settingsOverride?: Partial<GameSettings>
  isActive: boolean
}

// Shop items
export interface ShopItem {
  id: string
  type: 'tile_skin' | 'avatar_skin' | 'table_skin' | 'power_up'
  name: string
  description: string
  price: number
  currency: 'coins' | 'gems'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  isActive: boolean
  createdAt: string
}

export interface TileSkinData {
  id: string
  name: string
  description: string
  colors: {
    background: string
    dots: string
    border: string
  }
  preview: number[] // [left, right] for preview tile
}

export interface AvatarSkinData {
  id: string
  name: string
  description: string
  image: string
}

export interface TableSkinData {
  id: string
  name: string
  description: string
  background: string
  pattern?: string
}

export interface PowerUpData {
  id: string
  name: string
  description: string
  effect: 'peek' | 'swap' | 'block' | 'double_points'
  duration?: number
  quantity?: number
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// WebSocket message types
export interface WebSocketMessage {
  type: string
  data: any
  userId?: string
  gameId?: string
  roomId?: string
  timestamp: number
}

export interface GameActionMessage extends WebSocketMessage {
  type: 'game_action'
  action: 'play_tile' | 'draw_tile' | 'pass_turn' | 'use_power_up'
  data: {
    tileId?: string
    end?: 'left' | 'right'
    powerUpId?: string
    targetUserId?: string
  }
}

export interface RoomUpdateMessage extends WebSocketMessage {
  type: 'room_update'
  data: {
    room: Room
    action: 'player_joined' | 'player_left' | 'player_ready' | 'game_starting'
  }
}

export interface MatchmakingUpdateMessage extends WebSocketMessage {
  type: 'matchmaking_update'
  data: {
    status: 'searching' | 'found' | 'cancelled'
    estimatedWaitTime?: number
    playersInQueue?: number
    match?: Room
  }
}

export interface Clan {
  id: string
  name: string
  tag: string
  description: string
  ownerId: string
  members: ClanMember[]
  level: number
  points: number
  warPoints: number
  seasonWins: number
  seasonLosses: number
  logo: string
  createdAt: string
  isPublic: boolean
}

export interface ClanMember {
  userId: string
  username: string
  role: 'leader' | 'officer' | 'member'
  joinedAt: string
  contributionPoints: number
  weeklyWarPoints: number
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  type: 'global' | 'clan' | 'system'
  clanId?: string
  timestamp: string
}

export interface ChatWebSocketMessage extends WebSocketMessage {
  type: 'chat_message'
  data: ChatMessage
}

export interface Tournament {
  id: string
  name: string
  description: string
  status: 'registration' | 'active' | 'completed' | 'cancelled'
  type: 'single_elimination' | 'swiss'
  minPlayers: number
  maxPlayers: number
  entryFee: number
  prizePool: number
  rounds: number
  currentRound: number
  startTime: string
  endTime?: string
  participants: TournamentParticipant[]
  matches: TournamentMatch[]
  winnerId?: string
  createdAt: string
}

export interface TournamentParticipant {
  userId: string
  username: string
  avatar: string
  level: number
  seed: number
  status: 'active' | 'eliminated' | 'winner'
  joinedAt: string
}

export interface TournamentMatch {
  id: string
  tournamentId: string
  round: number
  matchNumber: number // 1-based index within the round
  player1Id?: string // undefined if bye or waiting for previous match
  player2Id?: string
  winnerId?: string
  gameId?: string // Link to the actual game session
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  startTime?: string
  endTime?: string
}

export interface ClanSeason {
  id: string
  number: number
  startDate: string
  endDate: string
  status: 'active' | 'completed'
}

export interface ClanWar {
  id: string
  clan1Id: string
  clan2Id: string
  score1: number
  score2: number
  status: 'active' | 'completed'
  startTime: string
  endTime: string
}

export interface BattlePass {
  id: string
  season: number
  name: string
  isActive: boolean
  startDate: string
  endDate: string
  tiers: BattlePassTier[]
}

export interface BattlePassTier {
  level: number
  requiredXP: number
  freeReward?: BattlePassReward
  premiumReward?: BattlePassReward
}

export interface BattlePassReward {
  type: 'coins' | 'gems' | 'tile_skin' | 'avatar_skin' | 'power_up'
  amount?: number
  itemId?: string
}

export interface UserBattlePass {
  userId: string
  bpId: string
  xp: number
  level: number
  isPremium: boolean
  isElite: boolean // Silver vs Gold track
  claimedFreeTiers: number[]
  claimedPremiumTiers: number[]
}

export interface Referral {
  id: string
  referrerId: string
  inviteeId: string // The one who joined
  status: 'pending' | 'completed'
  rewardClaimed: boolean
  createdAt: string
}

export interface ReferralReward {
  id: string
  userId: string
  type: 'referral_bonus' | 'lucky_tile'
  amount: number
  claimed: boolean
  senderId?: string
  createdAt: string
}

export interface ClanTerritory {
  id: string
  name: string
  region: string
  ownerClanId: string | null
  bonusMultiplier: number // Passive coin bonus for members
  warPointsRequired: number
}
