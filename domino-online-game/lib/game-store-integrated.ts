import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useGamificationStore } from './game-store-extended'

// Import existing game store types
export interface DominoTile {
  id: string
  left: number
  right: number
  isDouble: boolean
}

export interface Player {
  id: string
  name: string
  avatar: string
  hand: DominoTile[]
  isAI: boolean
  aiLevel?: 'easy' | 'medium' | 'hard'
  aiStyle?: 'aggressive' | 'defensive'
  elo?: number
  tileSkin?: string
}

export interface GameState {
  status: 'idle' | 'playing' | 'paused' | 'finished' | 'matchmaking'
  mode: 'single' | 'multiplayer' | 'ranked' | 'private'
  players: Player[]
  currentPlayerIndex: number
  board: any[]
  deck: DominoTile[]
  winner: string | null
  turnTimer: number | null
  gameId: string | null
  roundNumber: number
  scores: Record<string, number>
}

export interface User {
  id: string
  username: string
  email?: string
  avatar: string
  level: number
  xp: number
  totalXP: number
  coins: number
  gems: number
  elo: number
  rank: string
  tier: number
  winRate: number
  totalGames: number
  totalWins: number
  totalLosses: number
  streak: number
  bestStreak: number
  createdAt: string
  lastLoginAt: string
}

// Integrated Game Store with Gamification
interface GameStore {
  // User data
  user: User | null
  isAuthenticated: boolean
  
  // Game state
  gameState: GameState
  currentGameId: string | null
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Gamification integration
  awardXP: (amount: number, source: string, reason?: string) => Promise<void>
  checkAchievements: () => Promise<void>
  updateStats: (gameResult: any) => Promise<void>
  
  // Game actions
  startGame: (mode: string, opponent?: string) => Promise<void>
  endGame: (result: any) => Promise<void>
  playTile: (tileId: string, position: number) => Promise<void>
  
  // User actions
  login: (username: string, password?: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
  
  // Utility
  resetGame: () => void
  clearError: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      gameState: {
        status: 'idle',
        mode: 'single',
        players: [],
        currentPlayerIndex: 0,
        board: [],
        deck: [],
        winner: null,
        turnTimer: null,
        gameId: null,
        roundNumber: 1,
        scores: {}
      },
      currentGameId: null,
      isLoading: false,
      error: null,
      
      // Gamification integration
      awardXP: async (amount: number, source: string, reason?: string) => {
        const { user } = get()
        if (!user) return
        
        try {
          // Call gamification store to award XP
          const gamificationStore = useGamificationStore.getState()
          await gamificationStore.awardXP(amount, source, reason)
          
          // Update local user XP
          set(state => ({
            user: state.user ? {
              ...state.user,
              xp: state.user.xp + amount,
              totalXP: state.user.totalXP + amount
            } : null
          }))
          
          // Check for new achievements
          await gamificationStore.checkAchievements()
          
        } catch (error) {
          console.error('Failed to award XP:', error)
          set({ error: 'Failed to award XP' })
        }
      },
      
      checkAchievements: async () => {
        const { user } = get()
        if (!user) return
        
        try {
          const gamificationStore = useGamificationStore.getState()
          await gamificationStore.checkAchievements()
        } catch (error) {
          console.error('Failed to check achievements:', error)
        }
      },
      
      updateStats: async (gameResult: any) => {
        const { user } = get()
        if (!user) return
        
        try {
          const isWin = gameResult.winner === user.id
          const gameDuration = gameResult.duration || 0
          const isPerfectGame = gameResult.perfectGame || false
          const isComeback = gameResult.comeback || false
          
          // Award XP based on game result
          let xpAward = 50 // Base XP
          if (isWin) xpAward += 100
          if (isPerfectGame) xpAward += 50
          if (isComeback) xpAward += 30
          if (gameResult.mode === 'ranked') xpAward += 50
          
          await get().awardXP(xpAward, 'game_completion', `Partita ${isWin ? 'vinta' : 'persa'}`)
          
          // Update user stats
          set(state => ({
            user: state.user ? {
              ...state.user,
              totalGames: state.user.totalGames + 1,
              totalWins: state.user.totalWins + (isWin ? 1 : 0),
              totalLosses: state.user.totalLosses + (isWin ? 0 : 1),
              winRate: ((state.user.totalWins + (isWin ? 1 : 0)) / (state.user.totalGames + 1)) * 100,
              streak: isWin ? state.user.streak + 1 : 0,
              bestStreak: isWin && state.user.streak + 1 > state.user.bestStreak 
                ? state.user.streak + 1 
                : state.user.bestStreak,
              elo: state.user.elo + (isWin ? 25 : -15) // Simple ELO adjustment
            } : null
          }))
          
          // Check for achievements after stats update
          await get().checkAchievements()
          
        } catch (error) {
          console.error('Failed to update stats:', error)
          set({ error: 'Failed to update game stats' })
        }
      },
      
      // Game actions
      startGame: async (mode: string, opponent?: string) => {
        const { user } = get()
        if (!user) {
          set({ error: 'User not authenticated' })
          return
        }
        
        set({ isLoading: true, error: null })
        
        try {
          // Create new game session
          const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          set({
            currentGameId: gameId,
            gameState: {
              ...get().gameState,
              status: 'playing',
              mode: mode as any,
              gameId,
              players: [
                {
                  id: user.id,
                  name: user.username,
                  avatar: user.avatar,
                  hand: [],
                  isAI: false
                },
                ...(opponent ? [{
                  id: opponent,
                  name: 'Opponent',
                  avatar: '🤖',
                  hand: [],
                  isAI: true,
                  aiLevel: 'medium' as const
                }] : [])
              ]
            },
            isLoading: false
          })
          
          // Award XP for starting a game
          await get().awardXP(10, 'game_start', 'Partita iniziata')
          
        } catch (error) {
          console.error('Failed to start game:', error)
          set({ error: 'Failed to start game', isLoading: false })
        }
      },
      
      endGame: async (result: any) => {
        const { user, currentGameId } = get()
        if (!user || !currentGameId) return
        
        set({ isLoading: true })
        
        try {
          // Update game state
          set({
            gameState: {
              ...get().gameState,
              status: 'finished',
              winner: result.winner,
              scores: result.scores || {}
            },
            isLoading: false
          })
          
          // Update user stats and award XP
          await get().updateStats(result)
          
          // Reset game after a delay
          setTimeout(() => {
            get().resetGame()
          }, 3000)
          
        } catch (error) {
          console.error('Failed to end game:', error)
          set({ error: 'Failed to end game', isLoading: false })
        }
      },
      
      playTile: async (tileId: string, position: number) => {
        const { gameState } = get()
        if (gameState.status !== 'playing') return
        
        try {
          // This would integrate with the actual game logic
          // For now, just update the state
          console.log(`Playing tile ${tileId} at position ${position}`)
          
          // Award small XP for playing a tile
          await get().awardXP(5, 'tile_played', 'Tessera giocata')
          
        } catch (error) {
          console.error('Failed to play tile:', error)
          set({ error: 'Failed to play tile' })
        }
      },
      
      // User actions
      login: async (username: string, password?: string) => {
        set({ isLoading: true, error: null })
        
        try {
          // Create guest user for now
          const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          
          const newUser: User = {
            id: userId,
            username,
            avatar: username[0].toUpperCase(),
            level: 1,
            xp: 0,
            totalXP: 0,
            coins: 1000,
            gems: 50,
            elo: 1000,
            rank: 'bronze',
            tier: 3,
            winRate: 0,
            totalGames: 0,
            totalWins: 0,
            totalLosses: 0,
            streak: 0,
            bestStreak: 0,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          }
          
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false
          })
          
          // Initialize gamification data
          const gamificationStore = useGamificationStore.getState()
          await gamificationStore.fetchUserProgress(userId)
          
          // Award welcome XP
          await get().awardXP(100, 'welcome_bonus', 'Benvenuto nel gioco!')
          
        } catch (error) {
          console.error('Failed to login:', error)
          set({ error: 'Failed to login', isLoading: false })
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          currentGameId: null,
          gameState: {
            ...get().gameState,
            status: 'idle',
            players: [],
            board: [],
            deck: []
          }
        })
      },
      
      register: async (userData: any) => {
        set({ isLoading: true, error: null })
        
        try {
          // For now, just login as guest
          await get().login(userData.username)
        } catch (error) {
          console.error('Failed to register:', error)
          set({ error: 'Failed to register', isLoading: false })
        }
      },
      
      // Utility
      resetGame: () => {
        set({
          currentGameId: null,
          gameState: {
            ...get().gameState,
            status: 'idle',
            players: [],
            board: [],
            deck: [],
            winner: null,
            scores: {}
          }
        })
      },
      
      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'game-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
