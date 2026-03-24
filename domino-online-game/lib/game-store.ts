import { create } from "zustand"
import { persist } from "zustand/middleware"
import { wsClient } from "./websocket-client"

// ==================== INTERFACES ====================

export interface TileSkin {
  id: string
  name: string
  description: string
  price: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  colors: {
    background: string
    dots: string
    border: string
  }
  theme?: {
    primary: string
    secondary: string
    background: string
    surface: string
  }
  preview: [number, number]
}

export interface DominoTile {
  id: string
  left: number
  right: number
  owner: string
  isDouble: boolean
  isPlayed: boolean
}

export interface PlayedTile {
  tile: DominoTile
  position: number
  side: 'left' | 'right'
  owner: string
  orientation?: 'horizontal' | 'vertical'
}

export interface RoomPlayer {
  id: string
  name: string
  avatar: string
  ready: boolean
}

export interface Room {
  id: string
  name: string
  host: string
  players: RoomPlayer[]
  maxPlayers: number
  isPrivate: boolean
  password?: string
  status: 'waiting' | 'playing' | 'finished'
  mode: 'casual' | 'ranked' | 'private'
  settings: {
    turnTimer: number
    rounds: number
    allowPowerUps: boolean
  }
  createdAt: string
}

export interface PowerUp {
  id: string
  name: string
  description: string
  price: number
  effect: string
  duration?: number
  quantity?: number
}

export interface AvatarSkin {
  id: string
  name: string
  description: string
  price: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  image: string
}

export interface TableSkin {
  id: string
  name: string
  description: string
  price: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  background: string
  pattern?: string
}

export interface Inventory {
  coins: number
  gems: number
  unlockedAvatars: string[]
  unlockedTileSkins: string[]
  unlockedTableSkins: string[]
  equippedAvatar: string
  equippedTileSkin: string
  equippedTable: string
  powerUps: PowerUp[]
  premiumItems: string[]
}

export interface RankedData {
  elo: number
  rank: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster'
  tier: 1 | 2 | 3
  wins: number
  losses: number
  winStreak: number
  highestElo: number
}

export interface UserProfile {
  id: string
  username: string
  avatar: string
  stats: {
    wins: number
    losses: number
    streak: number
    highestStreak: number
    gamesPlayed: number
    totalPoints: number
  }
  ranked: RankedData
  inventory: Inventory
  level: number
  xp: number
  xpToNextLevel: number
  achievements: string[]
  lastDailyReward: string | null
  createdAt: string
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
  settingsOverride?: Partial<Room['settings']>
  isActive: boolean
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

// ==================== DATA ====================

export const TILE_SKINS: TileSkin[] = [
  {
    id: 'classic',
    name: 'Classico',
    description: 'Stile tradizionale domino',
    price: 0,
    rarity: 'common',
    colors: { background: '#f5f5dc', dots: '#1a1a1a', border: '#8b7355' },
    preview: [6, 6],
  },
  {
    id: 'midnight',
    name: 'Mezzanotte',
    description: 'Design elegante notte stellata',
    price: 500,
    rarity: 'rare',
    colors: { background: '#1e293b', dots: '#e2e8f0', border: '#475569' },
    theme: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      background: '#0f172a',
      surface: '#1e293b'
    },
    preview: [5, 5],
  },
  {
    id: 'ocean',
    name: 'Oceano',
    description: 'Blu profondo come il mare',
    price: 500,
    rarity: 'rare',
    colors: { background: '#0c4a6e', dots: '#e0f2fe', border: '#0284c7' },
    theme: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      background: '#0c4a6e',
      surface: '#075985'
    },
    preview: [4, 3],
  },
  {
    id: 'forest',
    name: 'Foresta',
    description: 'Verde natura rigogliosa',
    price: 500,
    rarity: 'rare',
    colors: { background: '#14532d', dots: '#d1fae5', border: '#16a34a' },
    theme: {
      primary: '#10b981',
      secondary: '#059669',
      background: '#14532d',
      surface: '#064e3b'
    },
    preview: [3, 4],
  },
  {
    id: 'sunset',
    name: 'Tramonto',
    description: 'Caldi colori del tramonto',
    price: 800,
    rarity: 'epic',
    colors: { background: '#7c2d12', dots: '#fef3c7', border: '#dc2626' },
    theme: {
      primary: '#ea580c',
      secondary: '#dc2626',
      background: '#451a03',
      surface: '#78350f'
    },
    preview: [6, 4],
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Brillante stile cyberpunk',
    price: 1000,
    rarity: 'epic',
    colors: { background: '#1e1b4b', dots: '#f0abfc', border: '#c084fc' },
    theme: {
      primary: '#a855f7',
      secondary: '#7c3aed',
      background: '#1e1b4b',
      surface: '#312e81'
    },
    preview: [5, 3],
  },
  {
    id: 'royal',
    name: 'Reale',
    description: 'Degno di un re',
    price: 1500,
    rarity: 'legendary',
    colors: { background: '#581c87', dots: '#fef3c7', border: '#fbbf24' },
    theme: {
      primary: '#fbbf24',
      secondary: '#f59e0b',
      background: '#581c87',
      surface: '#6b21a8'
    },
    preview: [6, 6],
  },
  {
    id: 'ice',
    name: 'Ghiaccio',
    description: 'Freddo come il ghiaccio',
    price: 1200,
    rarity: 'legendary',
    colors: { background: '#e0f2fe', dots: '#0c4a6e', border: '#0284c7' },
    theme: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      background: '#0f172a',
      surface: '#1e293b'
    },
    preview: [4, 4],
  },
]

export const AVATAR_SKINS: AvatarSkin[] = [
  { id: 'default', name: 'Giocatore', description: 'Avatar base', price: 0, rarity: 'common', image: '👤' },
  { id: 'ninja', name: 'Ninja', description: 'Silenzioso e letale', price: 300, rarity: 'rare', image: '🥷' },
  { id: 'wizard', name: 'Mago', description: 'Maestro della strategia', price: 300, rarity: 'rare', image: '🧙' },
  { id: 'robot', name: 'Robot', description: 'Calcolo perfetto', price: 500, rarity: 'epic', image: '🤖' },
  { id: 'alien', name: 'Alieno', description: 'Da un altro mondo', price: 500, rarity: 'epic', image: '👽' },
  { id: 'king', name: 'Re', description: 'Nobile sovrano', price: 1000, rarity: 'legendary', image: '👑' },
  { id: 'dragon', name: 'Drago', description: 'Potenza infuocata', price: 1500, rarity: 'legendary', image: '🐉' },
]

export const TABLE_SKINS: TableSkin[] = [
  { id: 'classic_green', name: 'Tavolo Verde', description: 'Il classico tavolo da gioco', price: 0, rarity: 'common', background: '#1a5f3c' },
  { id: 'wood', name: 'Legno', description: 'Elegante legno scuro', price: 400, rarity: 'rare', background: '#5c4033' },
  { id: 'marble', name: 'Marmo', description: 'Lussuoso marmo bianco', price: 600, rarity: 'epic', background: '#f5f5f5', pattern: 'marble' },
  { id: 'lava', name: 'Lava', description: 'Caldo come il magma', price: 1200, rarity: 'legendary', background: '#8b0000', pattern: 'lava' },
]

export const POWER_UPS: PowerUp[] = [
  { id: 'peek', name: 'Sbircia', description: 'Guarda la mano avversaria per 5 secondi', price: 100, effect: 'peek', duration: 5 },
  { id: 'swap', name: 'Scambio', description: 'Scambia una tessera casuale con il mazzo', price: 150, effect: 'swap' },
  { id: 'block', name: 'Blocco', description: 'L\'avversario salta un turno', price: 200, effect: 'block' },
  { id: 'double_points', name: 'Punti Doppi', description: 'Raddoppia i punti per 3 turni', price: 300, effect: 'double_points', duration: 3 },
]

// Costanti per i ranghi
export const RANK_COLORS = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
  master: '#FF6B6B',
  grandmaster: '#FF1744',
}

export const RANK_NAMES = {
  bronze: 'Bronzo',
  silver: 'Argento',
  gold: 'Oro',
  platinum: 'Platino',
  diamond: 'Diamante',
  master: 'Maestro',
  grandmaster: 'Gran Maestro',
}

// ==================== STORE ====================

export interface Player {
  id: string
  name: string
  hand: DominoTile[]
  score: number
  isAI: boolean
  difficulty?: 'easy' | 'medium' | 'hard'
  aiStyle?: 'aggressive' | 'defensive'
}

export interface GameState {
  status: 'idle' | 'playing' | 'paused' | 'finished'
  mode: 'single' | 'multiplayer' | 'ranked' | 'private'
  players: Player[]
  currentPlayerIndex: number
  board: PlayedTile[]
  boardEnds: { left: number; right: number }
  deck: DominoTile[]
  winner: string | null
  turnTimer: any
  gameId: string | null
  roundNumber: number
  scores: Record<string, number>
  activePowerUps: any[]
  lastPlayedTileId: string | null
  pendingTile: {
    tileId: string
    end: 'left' | 'right'
    orientationOptions: ('horizontal' | 'vertical')[]
  } | null
  difficulty: 'easy' | 'medium' | 'hard'
  aiStyle: 'aggressive' | 'defensive'
}

export interface GameStoreState {
  user: UserProfile | null
  activeEvents: LiveOpsEvent[]
  game: GameState
  settings: {
    soundEnabled: boolean
    musicEnabled: boolean
    performanceMode: boolean
  }
  isReconnecting: boolean
  isSessionLost: boolean
  setIsReconnecting: (value: boolean) => void
  setIsSessionLost: (value: boolean) => void
  setPerformanceMode: (value: boolean) => void
  retryConnection: () => void
  setUser: (user: UserProfile | null) => void
  createUser: (username: string) => void

  // Game actions
  startGame: (mode: 'single' | 'multiplayer' | 'ranked' | 'private', difficulty?: 'easy' | 'medium' | 'hard', aiStyle?: 'aggressive' | 'defensive') => void
  playTile: (tileId: string, end: 'left' | 'right', orientation?: 'horizontal' | 'vertical') => void
  drawTile: () => DominoTile | null
  nextTurn: () => void
  adjustDifficulty: () => void
  pauseGame: () => void
  resumeGame: () => void
  resetGame: () => void
  fetchEvents: () => Promise<void>
  setPendingTileOrientation: (orientation: 'horizontal' | 'vertical') => void
  clearPendingTile: () => void

  // Inventory actions
  purchaseItem: (type: 'tile' | 'avatar' | 'table' | 'powerup', itemId: string) => boolean
  equipItem: (type: 'tile' | 'avatar' | 'table', itemId: string) => void
  usePowerUp: (powerUpId: string) => boolean
  addCoins: (amount: number) => void
  grantBonusCoins: () => void

  // Settings actions
  toggleSound: () => void
  claimDailyReward: () => { coins: number; gems: number } | null

  // Room actions
  rooms: Room[]
  createRoom: (name: string, isPrivate: boolean, password?: string) => Room
  joinRoom: (roomId: string, password?: string) => void
  leaveRoom: (roomId: string) => void
  toggleReady: (roomId: string) => void

  // Matchmaking actions
  matchmaking: {
    isSearching: boolean
    foundMatch: boolean
    playersInQueue: number
    waitTime: number
  }
  startMatchmaking: (mode: 'ranked' | 'casual') => void
  cancelMatchmaking: () => void
  simulateMatchFound: () => void

  // Game actions
  getValidMoves: () => any[]
  getAIMove: () => any

  // Social & Clan actions
  globalChat: ChatMessage[]
  clanChat: ChatMessage[]
  leaderboard: LeaderboardEntry[]
  clans: Clan[]
  userClan: Clan | null
  sendChatMessage: (content: string, type: 'global' | 'clan') => void
  fetchLeaderboard: (type: 'elo' | 'wins' | 'level') => Promise<void>
  fetchClans: () => Promise<void>
  createClan: (name: string, tag: string, description: string) => Promise<void>
  joinClan: (clanId: string) => Promise<void>
}

const initialRanked: RankedData = {
  elo: 800,
  rank: 'bronze',
  tier: 1,
  wins: 0,
  losses: 0,
  winStreak: 0,
  highestElo: 800,
}

const initialGame: GameState = {
  status: 'idle',
  mode: 'single',
  players: [],
  currentPlayerIndex: 0,
  board: [],
  boardEnds: { left: -1, right: -1 },
  deck: [],
  winner: null,
  turnTimer: null,
  gameId: null,
  roundNumber: 1,
  scores: {},
  activePowerUps: [],
  lastPlayedTileId: null,
  pendingTile: null,
  difficulty: 'medium',
  aiStyle: 'defensive',
}

const initialInventory: Inventory = {
  coins: 500,
  gems: 10,
  unlockedAvatars: ['default'],
  unlockedTileSkins: ['classic'],
  unlockedTableSkins: ['classic_green'],
  equippedAvatar: 'default',
  equippedTileSkin: 'classic',
  equippedTable: 'classic_green',
  powerUps: [],
  premiumItems: []
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      activeEvents: [],
      game: initialGame,
      rooms: [],
      matchmaking: {
        isSearching: false,
        foundMatch: false,
        playersInQueue: 0,
        waitTime: 0,
      },
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        performanceMode: false,
      },
      isReconnecting: false,
      isSessionLost: false,
      setIsReconnecting: (value) => set({ isReconnecting: value }),
      setIsSessionLost: (value) => set({ isSessionLost: value }),
      setPerformanceMode: (value) => set((state) => ({
        settings: { ...state.settings, performanceMode: value }
      })),
      retryConnection: () => {
        const { user } = get()
        if (user) {
          wsClient.disconnect()
          wsClient.connect()
          wsClient.authenticate(user.id)
          set({ isSessionLost: false, isReconnecting: true })
        }
      },

      setUser: (user) => {
        set({ user })
        if (user) {
          // Auto-authenticate when user is set
          wsClient.connect()
          wsClient.authenticate(user.id)

          // Setup global listeners
          const socket = wsClient.getSocket()
          if (socket) {
            socket.on('chat_message', (msg: ChatMessage) => {
              if (msg.type === 'global') {
                set((state) => ({ globalChat: [...state.globalChat, msg].slice(-50) }))
              } else if (msg.type === 'clan') {
                set((state) => ({ clanChat: [...state.clanChat, msg].slice(-50) }))
              }
            })

            socket.on('disconnect', () => {
              set({ isReconnecting: true })
            })

            socket.on('connect', () => {
              const { user } = get()
              if (user) {
                wsClient.authenticate(user.id)
                set({ isReconnecting: false })
              }
            })

            socket.on('game_sync', (data: { game: any }) => {
              console.log('Reconciling game state from server sync')
              set({ game: data.game })
            })

            socket.on('room_update', (data: any) => {
              set((state) => {
                const updatedRooms = [...state.rooms]
                const index = updatedRooms.findIndex(r => r.id === data.roomId)
                if (index !== -1) {
                  updatedRooms[index] = data.room
                } else {
                  updatedRooms.push(data.room)
                }
                return { rooms: updatedRooms }
              })
            })

            socket.on('matchmaking_started', (data: any) => {
              set((state) => ({
                matchmaking: {
                  ...state.matchmaking,
                  playersInQueue: data.playersInQueue || state.matchmaking.playersInQueue
                }
              }))
            })

            socket.on('session_lost', (data: any) => {
              set({ isSessionLost: true, isReconnecting: false })
            })

            socket.on('match_forfeited', (data: any) => {
              console.log('Match forfeited by:', data.userId)
              // Update state to reflect forfeit if needed
            })
          }
        }
      },

      createUser: (username) => {
        const newUser: UserProfile = {
          id: `user-${Date.now()}`,
          username,
          avatar: 'default',
          stats: { wins: 0, losses: 0, streak: 0, highestStreak: 0, gamesPlayed: 0, totalPoints: 0 },
          ranked: initialRanked,
          inventory: { ...initialInventory },
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          achievements: [],
          lastDailyReward: null,
          createdAt: new Date().toISOString(),
        }
        set({ user: newUser })
      },

      // Game actions
      startGame: (mode, difficulty = 'medium', aiStyle = 'defensive') => {
        set((state) => {
          // Crea un mazzo di domino completo
          const deck: DominoTile[] = []
          for (let left = 0; left <= 6; left++) {
            for (let right = left; right <= 6; right++) {
              deck.push({
                id: `tile-${left}-${right}`,
                left,
                right,
                owner: '',
                isDouble: left === right,
                isPlayed: false
              })
            }
          }

          // Mescola il mazzo
          for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]]
          }

          // Crea i giocatori
          const players = state.user ? [
            { id: state.user.id, name: state.user.username, hand: [] as DominoTile[], score: 0, isAI: false },
            { id: 'ai', name: 'AI', hand: [] as DominoTile[], score: 0, isAI: true, difficulty, aiStyle }
          ] : []

          // Distribuisci 7 tessere a ogni giocatore
          players.forEach(player => {
            for (let i = 0; i < 7 && deck.length > 0; i++) {
              const tile = deck.pop()!
              tile.owner = player.id
              player.hand.push(tile)
            }
          })

          return {
            ...state,
            game: {
              ...initialGame,
              status: 'playing',
              mode,
              players,
              deck,
              boardEnds: { left: -1, right: -1 },
              gameId: `game-${Date.now()}`,
              difficulty,
              aiStyle,
            }
          }
        })
      },

      playTile: (tileId, end, orientation) => {
        const state = get()
        if (!state.game || state.game.status !== 'playing') return

        const currentPlayer = state.game.players[state.game.currentPlayerIndex]
        if (!currentPlayer) return

        // Trova la tessera nella mano del giocatore
        const tileIndex = currentPlayer.hand.findIndex(t => t.id === tileId)
        if (tileIndex === -1) return

        const tile = currentPlayer.hand[tileIndex]

        // Se è già presente una tessera pending, non permettere altre giocate
        if (state.game.pendingTile) {
          console.log("Pending tile already exists, ignoring playTile call")
          return
        }

        // Calcola le opzioni di orientamento
        const { orientationOptions } = getOrientationOptions(tile, end, state.game.boardEnds)
        console.log("Tile:", tileId, "Options:", orientationOptions, "isDouble:", tile.isDouble)

        // Se non ci sono opzioni valide, esci
        if (orientationOptions.length === 0) return

        // Se viene fornito un orientamento esplicito, usalo
        if (orientation && orientationOptions.includes(orientation)) {
          console.log("Using explicit orientation:", orientation)
          // Procedi con il gioco automatico usando l'orientamento fornito
          tile.isPlayed = true

          // Rimuovi la tessera dalla mano
          const newHand = [...currentPlayer.hand]
          newHand.splice(tileIndex, 1)

          // Aggiungi la tessera al board
          let newBoard: PlayedTile[]
          if (end === 'left') {
            newBoard = [{ tile, position: 0, side: end, owner: currentPlayer.id, orientation }, ...state.game.board]
            newBoard = newBoard.map((playedTile, index) => ({
              ...playedTile,
              position: index
            }))
          } else {
            newBoard = [...state.game.board, { tile, position: state.game.board.length, side: end, owner: currentPlayer.id, orientation }]
          }

          // Aggiorna i board ends
          let newBoardEnds = { ...state.game.boardEnds }
          if (state.game.board.length === 0) {
            newBoardEnds = { left: tile.left, right: tile.right }
          } else {
            if (end === 'left') {
              newBoardEnds.left = tile.left === state.game.boardEnds.left ? tile.right : tile.left
            } else {
              newBoardEnds.right = tile.right === state.game.boardEnds.right ? tile.left : tile.right
            }
          }

          set((state) => ({
            ...state,
            game: {
              ...state.game,
              players: state.game.players.map((p, index) =>
                index === state.game.currentPlayerIndex
                  ? { ...p, hand: newHand }
                  : p
              ),
              board: newBoard,
              boardEnds: newBoardEnds,
              lastPlayedTileId: tileId,
              pendingTile: null, // Pulisci eventuali pending
            }
          }))

          // Passa il turno
          setTimeout(() => {
            const storeState = get()
            if (storeState.game?.currentPlayerIndex === state.game.currentPlayerIndex) {
              const nextTurnFn = (storeState as any).nextTurn
              if (nextTurnFn) nextTurnFn()
            }
          }, 100)
          return
        }

        // Se c'è solo una opzione, procedi automaticamente
        if (orientationOptions.length === 1) {
          const autoOrientation = orientationOptions[0]
          console.log("Auto-playing tile with orientation:", autoOrientation)
          // ... resto del codice identico a sopra ma con autoOrientation ...
          // Rifatto per brevità e correttezza:
          tile.isPlayed = true
          const newHand = [...currentPlayer.hand]
          newHand.splice(tileIndex, 1)

          let newBoard: PlayedTile[]
          if (end === 'left') {
            newBoard = [{ tile, position: 0, side: end, owner: currentPlayer.id, orientation: autoOrientation }, ...state.game.board]
            newBoard = newBoard.map((pt, i) => ({ ...pt, position: i }))
          } else {
            newBoard = [...state.game.board, { tile, position: state.game.board.length, side: end, owner: currentPlayer.id, orientation: autoOrientation }]
          }

          let newBoardEnds = { ...state.game.boardEnds }
          if (state.game.board.length === 0) {
            newBoardEnds = { left: tile.left, right: tile.right }
          } else {
            if (end === 'left') {
              newBoardEnds.left = tile.left === state.game.boardEnds.left ? tile.right : tile.left
            } else {
              newBoardEnds.right = tile.right === state.game.boardEnds.right ? tile.left : tile.right
            }
          }

          set((state) => ({
            ...state,
            game: {
              ...state.game,
              players: state.game.players.map((p, index) =>
                index === state.game.currentPlayerIndex ? { ...p, hand: newHand } : p
              ),
              board: newBoard,
              boardEnds: newBoardEnds,
              lastPlayedTileId: tileId,
            }
          }))

          setTimeout(() => {
            const storeState = get()
            if (storeState.game?.currentPlayerIndex === state.game.currentPlayerIndex) {
              const nextTurnFn = (storeState as any).nextTurn
              if (nextTurnFn) nextTurnFn()
            }
          }, 100)
        } else {
          // Ci sono multiple opzioni

          // Se il giocatore è un AI, scegli automaticamente la prima opzione
          if (currentPlayer.isAI) {
            console.log("AI player picking default orientation:", orientationOptions[0])
            // Chiamata ricorsiva con orientamento esplicito per evitare codice duplicato
            state.playTile(tileId, end, orientationOptions[0])
            return
          }

          // Se è un giocatore umano, metti in attesa (NON passare il turno)
          console.log("Setting pending tile for human orientation choice")
          set((state) => ({
            ...state,
            game: {
              ...state.game,
              pendingTile: {
                tileId,
                end,
                orientationOptions
              }
            }
          }))
        }
      },

      drawTile: () => {
        const state = get()
        if (!state.game || state.game.status !== 'playing' || state.game.deck.length === 0) return null

        // Create a copy of the deck and pop from it
        const newDeck = [...state.game.deck]
        const tile = newDeck.pop()
        if (!tile) return null

        // Assegna la tessera al giocatore corrente
        const currentPlayer = state.game.players[state.game.currentPlayerIndex]
        if (!currentPlayer) return null

        tile.owner = currentPlayer.id

        // Aggiungi la tessera alla mano del giocatore
        const newHand = [...currentPlayer.hand, tile]

        set((state) => ({
          ...state,
          game: {
            ...state.game,
            players: state.game.players.map((p, index) =>
              index === state.game.currentPlayerIndex
                ? { ...p, hand: newHand }
                : p
            ),
            deck: newDeck, // Use the updated deck
          }
        }))

        return tile
      },

      nextTurn: () => {
        const { adjustDifficulty } = get()
        adjustDifficulty() // Auto-adjust based on performance before passing turn

        set((state) => ({
          game: {
            ...state.game,
            currentPlayerIndex: (state.game.currentPlayerIndex + 1) % state.game.players.length,
          }
        }))
      },

      adjustDifficulty: () => {
        const state = get()
        if (!state.game || state.game.mode !== 'single' || state.game.status !== 'playing') return

        const player = state.game.players.find(p => !p.isAI)
        const ai = state.game.players.find(p => p.isAI)

        if (!player || !ai) return

        const playerHandSize = player.hand.length
        const aiHandSize = ai.hand.length
        let newDifficulty = state.game.difficulty

        // DDA LOGIC:
        // If player is winning too easily (small hand vs large AI hand), increase difficulty
        if (playerHandSize <= 2 && aiHandSize >= 6) {
          if (newDifficulty === 'easy') newDifficulty = 'medium'
          else if (newDifficulty === 'medium') newDifficulty = 'hard'
        }

        // If player is struggling (large hand vs small AI hand), decrease difficulty
        if (playerHandSize >= 6 && aiHandSize <= 2) {
          if (newDifficulty === 'hard') newDifficulty = 'medium'
          else if (newDifficulty === 'medium') newDifficulty = 'easy'
        }

        if (newDifficulty !== state.game.difficulty) {
          console.log(`DDA: Adjusted difficulty from ${state.game.difficulty} to ${newDifficulty}`)
          set((state) => ({
            game: {
              ...state.game,
              difficulty: newDifficulty as 'easy' | 'medium' | 'hard'
            }
          }))
        }
      },

      pauseGame: () => {
        set((state) => ({
          game: {
            ...state.game,
            status: 'paused',
          }
        }))
      },

      resumeGame: () => {
        set((state) => ({
          game: {
            ...state.game,
            status: 'playing',
          }
        }))
      },

      resetGame: () => {
        set({ game: initialGame })
      },

      fetchEvents: async () => {
        try {
          const response = await fetch('/api/liveops')
          const result = await response.json()
          if (result.success) {
            set({ activeEvents: result.data })
          }
        } catch (error) {
          console.error('Failed to fetch events:', error)
        }
      },

      purchaseItem: (type, itemId) => {
        const state = get()
        if (!state.user) return false

        let price = 0
        let alreadyOwned = false

        if (type === 'tile') {
          const skin = TILE_SKINS.find(s => s.id === itemId)
          if (!skin) return false
          price = skin.price
          alreadyOwned = state.user.inventory.unlockedTileSkins.includes(itemId)
        } else if (type === 'avatar') {
          const skin = AVATAR_SKINS.find(s => s.id === itemId)
          if (!skin) return false
          price = skin.price
          alreadyOwned = state.user.inventory.unlockedAvatars.includes(itemId)
        } else if (type === 'table') {
          const skin = TABLE_SKINS.find(s => s.id === itemId)
          if (!skin) return false
          price = skin.price
          alreadyOwned = state.user.inventory.unlockedTableSkins.includes(itemId)
        } else if (type === 'powerup') {
          const powerUp = POWER_UPS.find(p => p.id === itemId)
          if (!powerUp) return false
          price = powerUp.price
        }

        if (alreadyOwned || state.user.inventory.coins < price) return false

        set((state) => {
          if (!state.user) return state
          const newInventory = { ...state.user.inventory }
          newInventory.coins -= price

          if (type === 'tile') {
            newInventory.unlockedTileSkins = [...newInventory.unlockedTileSkins, itemId]
          } else if (type === 'avatar') {
            newInventory.unlockedAvatars = [...newInventory.unlockedAvatars, itemId]
          } else if (type === 'table') {
            newInventory.unlockedTableSkins = [...newInventory.unlockedTableSkins, itemId]
          } else if (type === 'powerup') {
            const existingPowerUp = newInventory.powerUps.find(p => p.id === itemId)
            if (existingPowerUp) {
              existingPowerUp.quantity = (existingPowerUp.quantity || 0) + 1
            } else {
              newInventory.powerUps.push({ ...POWER_UPS.find(p => p.id === itemId)!, quantity: 1 })
            }
          }

          return {
            ...state,
            user: {
              ...state.user,
              inventory: newInventory,
            },
          }
        })
        return true
      },

      equipItem: (type, itemId) => {
        const state = get()
        if (!state.user) return

        const newInventory = { ...state.user.inventory }

        if (type === 'tile' && newInventory.unlockedTileSkins.includes(itemId)) {
          newInventory.equippedTileSkin = itemId
        } else if (type === 'avatar' && newInventory.unlockedAvatars.includes(itemId)) {
          newInventory.equippedAvatar = itemId
        } else if (type === 'table' && newInventory.unlockedTableSkins.includes(itemId)) {
          newInventory.equippedTable = itemId
        }

        set({
          user: {
            ...state.user,
            inventory: newInventory,
          },
        })
      },

      usePowerUp: (powerUpId) => {
        const state = get()
        if (!state.user) return false

        const powerUp = state.user.inventory.powerUps.find(p => p.id === powerUpId)
        if (!powerUp || (powerUp.quantity || 0) <= 0) return false

        set((state) => {
          if (!state.user) return state
          const newInventory = { ...state.user.inventory }
          const powerUpIndex = newInventory.powerUps.findIndex(p => p.id === powerUpId)

          if (powerUpIndex !== -1) {
            const powerUp = { ...newInventory.powerUps[powerUpIndex] }
            powerUp.quantity = (powerUp.quantity || 0) - 1

            if (powerUp.quantity <= 0) {
              newInventory.powerUps.splice(powerUpIndex, 1)
            } else {
              newInventory.powerUps[powerUpIndex] = powerUp
            }
          }

          return {
            ...state,
            user: {
              ...state.user,
              inventory: newInventory,
            },
          }
        })
        return true
      },

      addCoins: (amount) => set((state) => {
        if (!state.user) return state
        return {
          user: {
            ...state.user,
            inventory: {
              ...state.user.inventory,
              coins: state.user.inventory.coins + amount,
            },
          },
        }
      }),

      grantBonusCoins: () => set((state) => {
        if (!state.user) return state
        return {
          user: {
            ...state.user,
            inventory: {
              ...state.user.inventory,
              coins: state.user.inventory.coins + 2000,
            },
          },
        }
      }),

      setPendingTileOrientation: (orientation) => {
        const state = get()
        if (!state.game?.pendingTile) return

        const { tileId, end } = state.game.pendingTile
        const currentPlayer = state.game.players[state.game.currentPlayerIndex]
        if (!currentPlayer) return

        // Trova la tessera nella mano del giocatore
        const tileIndex = currentPlayer.hand.findIndex(t => t.id === tileId)
        if (tileIndex === -1) return

        const tile = currentPlayer.hand[tileIndex]
        tile.isPlayed = true

        // Rimuovi la tessera dalla mano
        const newHand = [...currentPlayer.hand]
        newHand.splice(tileIndex, 1)

        // Aggiungi la tessera al board mantenendo l'ordine corretto
        let newBoard: PlayedTile[]
        if (end === 'left') {
          // Inserisci all'inizio se giocata a sinistra
          newBoard = [{ tile, position: 0, side: end, owner: currentPlayer.id, orientation }, ...state.game.board]
          // Aggiorna le posizioni delle tessere esistenti
          newBoard = newBoard.map((playedTile, index) => ({
            ...playedTile,
            position: index
          }))
        } else {
          // Aggiungi alla fine se giocata a destra
          newBoard = [...state.game.board, { tile, position: state.game.board.length, side: end, owner: currentPlayer.id, orientation }]
        }

        // Aggiorna i board ends
        let newBoardEnds = { ...state.game.boardEnds }
        if (state.game.board.length === 0) {
          // Prima tessera giocata
          newBoardEnds = { left: tile.left, right: tile.right }
        } else {
          // Aggiorna gli estremi del board
          if (end === 'left') {
            newBoardEnds.left = tile.left === state.game.boardEnds.left ? tile.right : tile.left
          } else {
            newBoardEnds.right = tile.right === state.game.boardEnds.right ? tile.left : tile.right
          }
        }

        set((state) => ({
          ...state,
          game: {
            ...state.game,
            players: state.game.players.map((p, index) =>
              index === state.game.currentPlayerIndex
                ? { ...p, hand: newHand }
                : p
            ),
            board: newBoard,
            boardEnds: newBoardEnds,
            lastPlayedTileId: tileId,
            pendingTile: null,
          }
        }))

        // Passa il turno dopo aver completato il gioco con orientamento scelto
        setTimeout(() => {
          const storeState = get()
          if (storeState.game?.currentPlayerIndex === state.game.currentPlayerIndex) {
            // Verifica che sia ancora il turno dello stesso giocatore prima di passare
            const nextTurnFn = (storeState as any).nextTurn
            if (nextTurnFn) nextTurnFn()
          }
        }, 100)
      },

      clearPendingTile: () => set((state) => ({
        ...state,
        game: {
          ...state.game,
          pendingTile: null,
        }
      })),

      toggleSound: () => set((state) => ({
        settings: {
          ...state.settings,
          soundEnabled: !state.settings.soundEnabled,
        },
      })),

      claimDailyReward: () => {
        const state = get()
        if (!state.user) return null

        const today = new Date().toDateString()
        if (state.user.lastDailyReward === today) return null

        set((state) => {
          if (!state.user) return state
          return {
            user: {
              ...state.user,
              inventory: {
                ...state.user.inventory,
                coins: state.user.inventory.coins + 100,
                gems: state.user.inventory.gems + 5,
              },
              lastDailyReward: today,
            },
          }
        })

        return { coins: 100, gems: 5 }
      },

      getValidMoves: () => {
        const state = get()
        if (!state.game || state.game.players.length === 0) return []

        const currentPlayer = state.game.players[state.game.currentPlayerIndex]
        if (!currentPlayer) return []

        const validMovesArr: { tile: DominoTile, ends: ('left' | 'right')[] }[] = []

        if (state.game.board.length === 0) {
          currentPlayer.hand.forEach(tile => {
            validMovesArr.push({ tile, ends: ['left'] })
          })
        } else {
          currentPlayer.hand.forEach(tile => {
            const canPlayLeft = tile.left === state.game.boardEnds.left || tile.right === state.game.boardEnds.left
            const canPlayRight = tile.left === state.game.boardEnds.right || tile.right === state.game.boardEnds.right

            if (canPlayLeft && canPlayRight) {
              validMovesArr.push({ tile, ends: ['left', 'right'] })
            } else if (canPlayLeft) {
              validMovesArr.push({ tile, ends: ['left'] })
            } else if (canPlayRight) {
              validMovesArr.push({ tile, ends: ['right'] })
            }
          })
        }

        return validMovesArr
      },

      getAIMove: () => {
        const state = get()
        if (!state.game || state.game.players.length === 0) return null

        const aiPlayer = state.game.players.find(p => p.isAI)
        if (!aiPlayer || !aiPlayer.hand || aiPlayer.hand.length === 0) return null

        const difficulty = state.game.difficulty || 'medium'
        const validMovesArr = getValidMoves(aiPlayer.hand, state.game.boardEnds)

        if (validMovesArr.length === 0) return null

        // --- DIFFICULTY PROFILES ---

        // EASY: Completely random move
        if (difficulty === 'easy') {
          const randomIdx = Math.floor(Math.random() * validMovesArr.length)
          const move = validMovesArr[randomIdx]
          return { tile: move.tile, end: move.end }
        }

        const getTileValue = (tile: DominoTile) => tile.left + tile.right

        // MEDIUM & HARD: Scored move
        const scoredMoves = validMovesArr.map(move => {
          let score = 0
          const { tile, end } = move

          // Basic logic: value of tile
          score += getTileValue(tile)

          // Bonus for doubles? (usually good to get rid of them)
          if (tile.isDouble) score += 15

          // Visibility/Flexibility: How many numbers do I have left in hand?
          const remainingHand = aiPlayer.hand.filter(t => t.id !== tile.id)
          const distinctNumbers = new Set<number>()
          remainingHand.forEach(t => {
            distinctNumbers.add(t.left)
            distinctNumbers.add(t.right)
          })
          score += distinctNumbers.size * 3

          // HARD MODE ADVANCED LOGIC: Board Control & Blocking
          if (difficulty === 'hard') {
            const nextEndValue = end === 'left'
              ? (tile.left === state.game.boardEnds.left ? tile.right : tile.left)
              : (tile.right === state.game.boardEnds.right ? tile.left : tile.right)

            // Check if I have more tiles of this number (Dominance)
            const countOfNextNumber = remainingHand.filter(t => t.left === nextEndValue || t.right === nextEndValue).length
            score += countOfNextNumber * 10

            // Opponent blocking: If I play this, what does it leave them?
            // (Simplified: favor playing numbers that are less common in the deck, theoretically)
            if (tile.isDouble) score += 10 // Hard bots prioritize dumping doubles even more
          }

          return { move, score }
        })

        // Sort by score descending
        scoredMoves.sort((a, b) => b.score - a.score)

        // Add a bit of noise even to hard bots to prevent perfect predictability
        const bestMove = scoredMoves[0].move

        return {
          tile: bestMove.tile,
          end: bestMove.end
        }
      },

      // Room actions implementation
      createRoom: (name, isPrivate, password) => {
        const { user } = get()
        const newRoom: Room = {
          id: `room-${Date.now()}`,
          name,
          host: user?.id || 'guest',
          players: [
            {
              id: user?.id || 'guest',
              name: user?.username || 'Ospite',
              avatar: user?.inventory.equippedAvatar || 'default',
              ready: false
            }
          ],
          maxPlayers: 2,
          isPrivate,
          password,
          mode: isPrivate ? 'private' : 'casual',
          status: 'waiting',
          settings: {
            turnTimer: 30,
            rounds: 1,
            allowPowerUps: false
          },
          createdAt: new Date().toISOString(),
        }

        const socket = wsClient.getSocket()
        if (socket?.connected) {
          socket.emit('join_room', { roomId: newRoom.id, password })
        }

        set((state) => ({
          rooms: [...state.rooms, newRoom]
        }))

        return newRoom
      },

      joinRoom: (roomId, password) => {
        const { user, rooms } = get()
        if (!user) return

        const socket = wsClient.getSocket()
        if (socket?.connected) {
          socket.emit('join_room', { roomId, password })
        }

        const roomIndex = rooms.findIndex(r => r.id === roomId)
        if (roomIndex === -1) return

        const room = rooms[roomIndex]
        if (room.isPrivate && room.password !== password) {
          console.error("Wrong password")
          return
        }

        if (room.players.length >= room.maxPlayers) {
          console.error("Room full")
          return
        }

        const newRooms = [...rooms]
        newRooms[roomIndex] = {
          ...room,
          players: [
            ...room.players,
            {
              id: user.id,
              name: user.username,
              avatar: user.inventory.equippedAvatar,
              ready: false
            }
          ]
        }

        set({ rooms: newRooms })
      },

      leaveRoom: (roomId) => {
        const { user, rooms } = get()
        if (!user) return

        const roomIndex = rooms.findIndex(r => r.id === roomId)
        if (roomIndex === -1) return

        const room = rooms[roomIndex]
        const newPlayers = room.players.filter(p => p.id !== user.id)

        const newRooms = [...rooms]
        if (newPlayers.length === 0) {
          newRooms.splice(roomIndex, 1)
        } else {
          newRooms[roomIndex] = {
            ...room,
            players: newPlayers,
            host: room.host === user.id ? newPlayers[0].id : room.host
          }
        }

        set({ rooms: newRooms })
      },

      toggleReady: (roomId) => {
        const { user, rooms } = get()
        if (!user) return

        const roomIndex = rooms.findIndex(r => r.id === roomId)
        if (roomIndex === -1) return

        const room = rooms[roomIndex]
        const newRooms = [...rooms]
        newRooms[roomIndex] = {
          ...room,
          players: room.players.map(p =>
            p.id === user.id ? { ...p, ready: !p.ready } : p
          )
        }

        set({ rooms: newRooms })
      },

      // Matchmaking implementation
      startMatchmaking: (mode) => {
        const socket = wsClient.getSocket()
        if (socket?.connected) {
          socket.emit('start_matchmaking', { mode })
        }

        set((state) => ({
          matchmaking: {
            ...state.matchmaking,
            isSearching: true,
            foundMatch: false,
            playersInQueue: 1,
          }
        }))
      },

      cancelMatchmaking: () => {
        const socket = wsClient.getSocket()
        if (socket?.connected) {
          socket.emit('cancel_matchmaking')
        }

        set((state) => ({
          matchmaking: {
            ...state.matchmaking,
            isSearching: false,
            foundMatch: false,
          }
        }))
      },

      simulateMatchFound: () => {
        set((state) => ({
          matchmaking: {
            ...state.matchmaking,
            isSearching: false,
            foundMatch: true,
          }
        }))
      },

      // Social & Clan actions
      globalChat: [],
      clanChat: [],
      leaderboard: [],
      clans: [],
      userClan: null,

      sendChatMessage: (content, type) => {
        const { user } = get()
        if (!user) return

        const socket = wsClient.getSocket()
        if (socket?.connected) {
          socket.emit('send_chat_message', { content, type })
        } else {
          // Fallback/Optimistic update for local UI if needed, 
          // but better to rely on server ACK via 'chat_message'
          console.warn('Socket not connected, cannot send message')
        }
      },

      fetchLeaderboard: async (type) => {
        // Mock API call or fetch from /api/leaderboard if implemented
        const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 10 }).map((_, i) => ({
          userId: `user-${i}`,
          username: `Player ${i + 1}`,
          avatar: 'default',
          elo: 1500 - (i * 50),
          rank: i + 1,
          wins: 50 - i,
          losses: 10 + i,
          winRate: 80 - i,
          lastActiveAt: new Date().toISOString()
        }))
        set({ leaderboard: mockLeaderboard })
      },

      fetchClans: async () => {
        // Mock API call or fetch from /api/clans if implemented
        const mockClans: Clan[] = [
          {
            id: 'clan-1',
            name: 'Elite Dominos',
            tag: 'ELD',
            description: 'The best of the best',
            ownerId: 'user-1',
            members: [],
            level: 10,
            points: 5000,
            logo: '🏆',
            createdAt: new Date().toISOString(),
            isPublic: true
          }
        ]
        set({ clans: mockClans })
      },

      createClan: async (name, tag, description) => {
        const { user } = get()
        if (!user) return
        const newClan: Clan = {
          id: `clan-${Date.now()}`,
          name,
          tag,
          description,
          ownerId: user.id,
          members: [{
            userId: user.id,
            username: user.username,
            role: 'leader',
            joinedAt: new Date().toISOString(),
            contributionPoints: 0
          }],
          level: 1,
          points: 0,
          logo: '🛡️',
          createdAt: new Date().toISOString(),
          isPublic: true
        }
        set((state) => ({ clans: [...state.clans, newClan], userClan: newClan }))
      },

      joinClan: async (clanId) => {
        const { clans } = get()
        const clan = clans.find(c => c.id === clanId)
        if (clan) {
          set({ userClan: clan })
        }
      },
    }),
    {
      name: 'domino-game-store',
      partialize: (state) => ({ user: state.user, settings: state.settings }),
    }
  )
)

// Funzione per determinare le opzioni di orientamento possibili
export const getOrientationOptions = (
  tile: DominoTile,
  end: 'left' | 'right',
  boardEnds: { left: number; right: number }
): { orientationAuto: 'horizontal' | 'vertical'; orientationOptions: ('horizontal' | 'vertical')[] } => {
  // Se il board è vuoto:
  // - Tessere normali -> solo orizzontale
  // - Tessere double -> orizzontale o verticale
  if (boardEnds.left === -1 && boardEnds.right === -1) {
    if (tile.isDouble) {
      return {
        orientationAuto: 'vertical', // Preferenza verticale per i double
        orientationOptions: ['horizontal', 'vertical']
      }
    } else {
      return {
        orientationAuto: 'horizontal',
        orientationOptions: ['horizontal']
      }
    }
  }

  const targetValue = end === 'left' ? boardEnds.left : boardEnds.right

  // Verifica se la tessera può essere giocata (validazione base)
  const canPlay = tile.left === targetValue || tile.right === targetValue

  if (!canPlay) {
    return {
      orientationAuto: 'vertical',
      orientationOptions: []
    }
  }

  // Per tessere non-double: sempre orizzontale
  if (!tile.isDouble) {
    return {
      orientationAuto: 'horizontal',
      orientationOptions: ['horizontal']
    }
  }

  // Per tessere double: entrambi gli orientamenti sono validi
  return {
    orientationAuto: 'vertical', // Preferenza verticale per i double
    orientationOptions: ['horizontal', 'vertical']
  }
}
export const getValidMoves = (hand: DominoTile[], boardEnds: { left: number; right: number }) => {
  const validMoves: { tile: DominoTile; end: 'left' | 'right' }[] = []

  if (!hand || hand.length === 0) return validMoves

  if (boardEnds.left === -1 && boardEnds.right === -1) {
    // Se il board è vuoto, qualsiasi tessera può essere giocata
    hand.forEach(tile => {
      validMoves.push({ tile, end: 'left' })
    })
  } else {
    // Verifica quali tessere possono essere giocate
    hand.forEach(tile => {
      const canPlayLeft = tile.left === boardEnds.left || tile.right === boardEnds.left
      const canPlayRight = tile.left === boardEnds.right || tile.right === boardEnds.right

      if (canPlayLeft && canPlayRight) {
        validMoves.push({ tile, end: 'left' })
        validMoves.push({ tile, end: 'right' })
      } else if (canPlayLeft) {
        validMoves.push({ tile, end: 'left' })
      } else if (canPlayRight) {
        validMoves.push({ tile, end: 'right' })
      }
    })
  }

  return validMoves
}

export const getAIMove = () => {
  return useGameStore.getState().getAIMove()
}

export const getAIDelay = (difficulty: 'easy' | 'medium' | 'hard' = 'medium'): number => {
  switch (difficulty) {
    case 'easy':
      return Math.floor(Math.random() * 2000) + 2000 // 2000-4000ms
    case 'medium':
      return Math.floor(Math.random() * 1500) + 1000 // 1000-2500ms
    case 'hard':
      return Math.floor(Math.random() * 1000) + 500  // 500-1500ms
    default:
      return 1500
  }
}
