// HTTP API client for backend communication
class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error) {
      console.error('API request error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // Authentication
  async register(username: string, email?: string, password?: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    })
  }

  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  }

  async createGuestUser(username: string) {
    return this.request('/auth/guest', {
      method: 'POST',
      body: JSON.stringify({ username }),
    })
  }

  // User profile
  async getUserProfile(userId: string) {
    return this.request(`/user/profile?userId=${userId}`)
  }

  async updateUserProfile(userId: string, updates: { username?: string; avatar?: string }) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ userId, ...updates }),
    })
  }

  // User stats
  async getUserStats(userId: string) {
    return this.request(`/user/stats?userId=${userId}`)
  }

  async updateUserStats(data: {
    userId: string
    gameResult: 'win' | 'loss' | 'draw'
    mode: 'single' | 'multiplayer' | 'ranked' | 'private'
    opponentElo?: number
    pointsEarned?: number
    duration?: number
    gameId: string
  }) {
    return this.request('/user/stats', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Game sessions
  async createGameSession(data: {
    mode: 'single' | 'multiplayer' | 'ranked' | 'private'
    players: Array<{
      userId: string
      username: string
      avatar: string
      isAI?: boolean
      aiLevel?: 'easy' | 'medium' | 'hard'
      aiStyle?: 'aggressive' | 'defensive'
    }>
    settings?: {
      turnTimer?: number
      rounds?: number
      allowPowerUps?: boolean
      isPrivate?: boolean
      maxPlayers?: number
    }
  }) {
    return this.request('/game/session', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getGameSession(gameId: string) {
    return this.request(`/game/session?gameId=${gameId}`)
  }

  async updateGameSession(gameId: string, action: string, data?: any) {
    return this.request('/game/session', {
      method: 'PUT',
      body: JSON.stringify({ gameId, action, data }),
    })
  }

  async deleteGameSession(gameId: string) {
    return this.request(`/game/session?gameId=${gameId}`, {
      method: 'DELETE',
    })
  }

  // Shop
  async getShopItems(type?: string, rarity?: string) {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (rarity) params.append('rarity', rarity)
    
    return this.request(`/shop/items?${params.toString()}`)
  }

  async purchaseItem(userId: string, itemId: string, itemType: string) {
    return this.request('/shop/purchase', {
      method: 'POST',
      body: JSON.stringify({ userId, itemId, itemType }),
    })
  }

  // Matchmaking
  async startMatchmaking(userId: string, mode: 'ranked' | 'casual', preferences?: any) {
    return this.request('/matchmaking', {
      method: 'POST',
      body: JSON.stringify({ userId, mode, preferences }),
    })
  }

  async cancelMatchmaking(userId: string) {
    return this.request(`/matchmaking?userId=${userId}`, {
      method: 'DELETE',
    })
  }

  async getMatchmakingStatus(userId: string) {
    return this.request(`/matchmaking?userId=${userId}`)
  }

  // Rooms
  async getRooms(limit?: number, includePrivate?: boolean) {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (includePrivate) params.append('includePrivate', 'true')
    
    return this.request(`/rooms?${params.toString()}`)
  }

  async createRoom(data: {
    userId: string
    name: string
    isPrivate?: boolean
    password?: string
    settings?: {
      turnTimer?: number
      rounds?: number
      allowPowerUps?: boolean
      maxPlayers?: number
    }
  }) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRoom(roomId: string) {
    return this.request(`/rooms/${roomId}`)
  }

  async updateRoom(roomId: string, data: {
    userId: string
    action: 'join' | 'leave' | 'toggle_ready' | 'start_game'
    data?: any
  }) {
    return this.request(`/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteRoom(roomId: string, userId: string) {
    return this.request(`/rooms/${roomId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    })
  }

  // Leaderboard
  async getLeaderboard(mode: 'elo' | 'wins' | 'win_rate' = 'elo', limit?: number, offset?: number, userId?: string) {
    const params = new URLSearchParams()
    params.append('mode', mode)
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())
    if (userId) params.append('userId', userId)
    
    return this.request(`/leaderboard?${params.toString()}`)
  }
}

// Singleton instance
export const apiClient = new ApiClient()

// Export for use in components and stores
export default apiClient
