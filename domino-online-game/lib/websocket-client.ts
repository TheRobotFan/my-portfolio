import { io, Socket } from 'socket.io-client'

// WebSocket client for real-time multiplayer
class WebSocketClient {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  connect() {
    if (this.socket?.connected) {
      return this.socket
    }

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000'
    
    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
    })

    this.setupEventHandlers()
    return this.socket
  }

  private setupEventHandlers() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket server:', reason)
      
      if (reason === 'io server disconnect') {
        // Server disconnected, don't reconnect automatically
        this.socket?.disconnect()
      } else {
        // Try to reconnect
        this.handleReconnect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.handleReconnect()
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`)
      
      setTimeout(() => {
        this.socket?.connect()
      }, delay)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Authentication
  authenticate(userId: string, token?: string) {
    this.socket?.emit('authenticate', { userId, token })
  }

  // Room management
  joinRoom(roomId: string, password?: string) {
    this.socket?.emit('join_room', { roomId, password })
  }

  leaveRoom() {
    this.socket?.emit('leave_room')
  }

  toggleReady() {
    this.socket?.emit('toggle_ready')
  }

  // Game actions
  sendGameAction(gameId: string, action: string, data: any) {
    this.socket?.emit('game_action', {
      type: 'game_action',
      gameId,
      action,
      data,
      timestamp: Date.now()
    })
  }

  playTile(gameId: string, tileId: string, end: 'left' | 'right') {
    this.sendGameAction(gameId, 'play_tile', { tileId, end })
  }

  drawTile(gameId: string) {
    this.sendGameAction(gameId, 'draw_tile', {})
  }

  passTurn(gameId: string) {
    this.sendGameAction(gameId, 'pass_turn', {})
  }

  usePowerUp(gameId: string, powerUpId: string, targetUserId?: string) {
    this.sendGameAction(gameId, 'use_power_up', { powerUpId, targetUserId })
  }

  // Matchmaking
  startMatchmaking(mode: 'ranked' | 'casual', preferences?: any) {
    this.socket?.emit('start_matchmaking', { mode, preferences })
  }

  cancelMatchmaking() {
    this.socket?.emit('cancel_matchmaking')
  }

  // Event listeners
  onAuthenticated(callback: (data: any) => void) {
    this.socket?.on('authenticated', callback)
  }

  onError(callback: (error: any) => void) {
    this.socket?.on('error', callback)
  }

  onRoomUpdate(callback: (data: any) => void) {
    this.socket?.on('room_update', callback)
  }

  onJoinedRoom(callback: (data: any) => void) {
    this.socket?.on('joined_room', callback)
  }

  onGameStarting(callback: (data: any) => void) {
    this.socket?.on('game_starting', callback)
  }

  onGameStarted(callback: (data: any) => void) {
    this.socket?.on('game_started', callback)
  }

  onGameUpdate(callback: (data: any) => void) {
    this.socket?.on('game_update', callback)
  }

  onGameEnded(callback: (data: any) => void) {
    this.socket?.on('game_ended', callback)
  }

  onMatchmakingStarted(callback: (data: any) => void) {
    this.socket?.on('matchmaking_started', callback)
  }

  onMatchFound(callback: (data: any) => void) {
    this.socket?.on('match_found', callback)
  }

  onMatchmakingCancelled(callback: () => void) {
    this.socket?.on('matchmaking_cancelled', callback)
  }

  onActiveGames(callback: (data: any) => void) {
    this.socket?.on('active_games', callback)
  }

  // Remove event listeners
  off(event: string, callback?: (data: any) => void) {
    if (callback) {
      this.socket?.off(event, callback)
    } else {
      this.socket?.off(event)
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getSocket(): Socket | null {
    return this.socket
  }
}

// Singleton instance
export const wsClient = new WebSocketClient()

// Export for use in components
export default wsClient
