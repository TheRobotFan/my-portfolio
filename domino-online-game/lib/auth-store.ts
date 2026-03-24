import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface User {
  id: string
  username: string
  email: string
  avatar: string
  isPremium: boolean
  premiumExpiresAt: string | null
  createdAt: string
  lastLoginAt: string
  loginStreak: number
  inventory: {
    coins: number
    gems: number
    unlockedAvatars: string[]
    unlockedTileSkins: string[]
    equippedAvatar: string
    equippedTileSkin: string
    powerUps: any[]
    premiumItems: string[]
  }
}

export interface Season {
  id: number
  name: string
  theme: string
  startDate: string
  endDate: string
  isActive: boolean
  rewards: SeasonReward[]
}

export interface SeasonReward {
  rank: string
  tier: number
  coins: number
  gems: number
  items: string[]
}

export interface SpecialEvent {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  type: 'tournament' | 'bonus' | 'special'
  rewards: EventReward[]
  isActive: boolean
}

export interface EventReward {
  type: 'coins' | 'gems' | 'item' | 'avatar' | 'skin'
  value: number | string
  condition: string
}

export interface PremiumPlan {
  id: string
  name: string
  price: number
  duration: number // days
  benefits: string[]
  gems: number
  coins: number
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string
  elo: number
  wins: number
  losses: number
  winRate: number
  streak: number
  isPremium: boolean
}

interface AuthState {
  // Authentication
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  loginError: string | null
  token: string | null

  // Registration
  isRegistering: boolean
  registerError: string | null

  // General error
  error: string | null

  // Premium
  premiumPlans: PremiumPlan[]

  // Seasons
  currentSeason: Season | null
  seasonHistory: Season[]

  // Events
  activeEvents: SpecialEvent[]

  // Leaderboard
  globalLeaderboard: LeaderboardEntry[]
  seasonLeaderboard: LeaderboardEntry[]
  friendsLeaderboard: LeaderboardEntry[]

  // Actions
  login: (usernameOrEmail: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  guestLogin: (username: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>

  // Premium actions
  purchasePremium: (planId: string) => Promise<void>
  checkPremiumStatus: () => void

  // Leaderboard actions
  fetchLeaderboards: () => Promise<void>
}

const premiumPlans: PremiumPlan[] = [
  {
    id: 'monthly',
    name: 'Premium Mensile',
    price: 9.99,
    duration: 30,
    benefits: [
      'Avatar esclusivi premium',
      'Skin tessere personalizzate',
      'Tavoli da gioco premium',
      'Eventi speciali prioritari',
      '2x ricompense giornaliere',
      'Badge premium esclusivi'
    ],
    gems: 500,
    coins: 10000
  },
  {
    id: 'yearly',
    name: 'Premium Annuale',
    price: 89.99,
    duration: 365,
    benefits: [
      'Tutti i benefit mensili',
      '30% di sconto extra',
      'Avatar leggendari esclusivi',
      'Tavoli da gioco animati',
      'Supporto prioritario',
      'Eventi VIP esclusivi'
    ],
    gems: 7000,
    coins: 150000
  }
]

const seasons: Season[] = [
  {
    id: 1,
    name: 'Stagione 1: Principianti',
    theme: 'classic',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    isActive: true,
    rewards: [
      { rank: 'bronze', tier: 1, coins: 1000, gems: 50, items: ['avatar_basic'] },
      { rank: 'silver', tier: 1, coins: 2000, gems: 100, items: ['avatar_silver', 'skin_silver'] },
      { rank: 'gold', tier: 1, coins: 5000, gems: 250, items: ['avatar_gold', 'skin_gold', 'table_premium'] },
      { rank: 'diamond', tier: 1, coins: 10000, gems: 500, items: ['avatar_diamond', 'skin_diamond', 'table_legendary'] }
    ]
  }
]

const specialEvents: SpecialEvent[] = [
  {
    id: 'tournament_2024',
    name: 'Torneo di Primavera',
    description: 'Partecipa al torneo più grande dell\'anno!',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    type: 'tournament',
    rewards: [
      { type: 'coins', value: 50000, condition: 'Vincere 10 partite' },
      { type: 'gems', value: 1000, condition: 'Raggiungere top 100' },
      { type: 'avatar', value: 'tournament_champion', condition: 'Vincere il torneo' }
    ],
    isActive: true
  },
  {
    id: 'bonus_weekend',
    name: 'Bonus Weekend',
    description: 'Doppie ricompense per tutto il weekend!',
    startDate: '2024-02-24',
    endDate: '2024-02-26',
    type: 'bonus',
    rewards: [
      { type: 'coins', value: 2000, condition: 'Login giornaliero' },
      { type: 'gems', value: 100, condition: 'Giocare 5 partite' }
    ],
    isActive: true
  }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      loginError: null,
      token: null,
      isRegistering: false,
      registerError: null,
      error: null,
      premiumPlans,
      currentSeason: seasons.find(s => s.isActive) || null,
      seasonHistory: seasons,
      activeEvents: specialEvents.filter(e => e.isActive),
      globalLeaderboard: [],
      seasonLeaderboard: [],
      friendsLeaderboard: [],

      // Login
      login: async (username: string, password: string) => {
        set({ isLoading: true, loginError: null })

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          })

          const result = await response.json()

          if (!result.success) {
            throw new Error(result.error || 'Login failed')
          }

          set({
            user: result.data.user,
            token: result.data.token,
            isAuthenticated: true,
            isLoading: false
          })

          // Authenticate websocket
          const { wsClient } = await import('./websocket-client')
          wsClient.authenticate(result.data.user.id, result.data.token)

        } catch (error: any) {
          set({
            loginError: error.message || 'Credenziali non valide',
            isLoading: false
          })
        }
      },

      // Register
      register: async (username: string, email: string, password: string) => {
        set({ isRegistering: true, registerError: null })

        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
          })

          const result = await response.json()

          if (!result.success) {
            throw new Error(result.error || 'Registration failed')
          }

          set({
            user: result.data.user,
            token: result.data.token,
            isAuthenticated: true,
            isRegistering: false
          })

          // Authenticate websocket
          const { wsClient } = await import('./websocket-client')
          wsClient.authenticate(result.data.user.id, result.data.token)

        } catch (error: any) {
          set({
            registerError: error.message || 'Registrazione fallita',
            isRegistering: false
          })
        }
      },

      // Guest Login
      guestLogin: async (username: string) => {
        set({ isLoading: true, loginError: null })

        try {
          const response = await fetch('/api/auth/guest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
          })

          const result = await response.json()

          if (!result.success) {
            throw new Error(result.error || 'Guest login failed')
          }

          set({
            user: result.data.user,
            token: result.data.token,
            isAuthenticated: true,
            isLoading: false
          })

          // Authenticate websocket
          const { wsClient } = await import('./websocket-client')
          wsClient.authenticate(result.data.user.id, result.data.token)

        } catch (error: any) {
          set({
            loginError: error.message || 'Accesso ospite fallito',
            isLoading: false
          })
        }
      },

      // Logout
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loginError: null,
          registerError: null
        })

        // Disconnect websocket
        import('./websocket-client').then(({ wsClient }) => wsClient.disconnect())
      },

      // Update profile
      updateProfile: async (data: Partial<User>) => {
        const { user } = get()
        if (!user) return

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))

          set({
            user: { ...user, ...data }
          })
        } catch (error) {
          console.error('Profile update failed:', error)
        }
      },

      // Purchase premium
      purchasePremium: async (planId: string) => {
        set({ isLoading: true })

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500))

          const plan = premiumPlans.find(p => p.id === planId)
          if (!plan) throw new Error('Plan not found')

          const user = get().user
          if (!user) throw new Error('User not found')

          // Update user with premium status
          const expiryDate = new Date()
          expiryDate.setMonth(expiryDate.getMonth() + (plan.duration === 365 ? 12 : 1))

          set(state => ({
            user: state.user ? {
              ...state.user,
              isPremium: true,
              premiumExpiresAt: expiryDate.toISOString(),
            } : null,
            isLoading: false
          }))

          // Add coins and gems
          set(state => ({
            user: state.user ? {
              ...state.user,
              inventory: {
                ...state.user.inventory,
                coins: state.user.inventory.coins + plan.coins,
                gems: state.user.inventory.gems + plan.gems,
              }
            } : null
          }))

        } catch (error) {
          set({ isLoading: false, error: 'Purchase failed' })
        }
      },

      purchaseCosmetic: async (cosmeticId: string, price: number) => {
        set({ isLoading: true })

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))

          const user = get().user
          if (!user) throw new Error('User not found')

          if (user.inventory.gems < price) {
            throw new Error('Not enough gems')
          }

          // Deduct gems
          set(state => ({
            user: state.user ? {
              ...state.user,
              inventory: {
                ...state.user.inventory,
                gems: state.user.inventory.gems - price,
                premiumItems: [...state.user.inventory.premiumItems, cosmeticId]
              }
            } : null,
            isLoading: false
          }))

        } catch (error) {
          set({ isLoading: false, error: 'Purchase failed' })
        }
      },

      // Check premium status
      checkPremiumStatus: () => {
        const { user } = get()
        if (!user || !user.premiumExpiresAt) return

        const now = new Date()
        const expiresAt = new Date(user.premiumExpiresAt)

        if (now > expiresAt) {
          set({
            user: {
              ...user,
              isPremium: false,
              premiumExpiresAt: null
            }
          })
        }
      },

      // Fetch leaderboards
      fetchLeaderboards: async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Mock leaderboard data
          const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 100 }, (_, i) => ({
            rank: i + 1,
            userId: `user_${i + 1}`,
            username: `Player${i + 1}`,
            avatar: 'default',
            elo: 2000 - (i * 20),
            wins: 50 - (i % 10),
            losses: 20 - (i % 5),
            winRate: 70 - (i * 0.5),
            streak: Math.floor(Math.random() * 10),
            isPremium: i < 10 // Top 10 are premium
          }))

          set({
            globalLeaderboard: mockLeaderboard,
            seasonLeaderboard: mockLeaderboard.slice(0, 50),
            friendsLeaderboard: mockLeaderboard.slice(0, 20)
          })
        } catch (error) {
          console.error('Failed to fetch leaderboards:', error)
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
