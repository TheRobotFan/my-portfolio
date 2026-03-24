import { Server as NetServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO, Socket } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { Redis } from 'ioredis'
import { db } from './database'
import { tournamentManager } from './tournament-manager'
import { clanWarManager } from './clan-war-manager'
import { battlePassManager } from './battle-pass-manager'
import { referralManager } from './referral-manager'
import { verifyToken } from './auth'
import {
  WebSocketMessage,
  GameActionMessage,
  RoomUpdateMessage,
  MatchmakingUpdateMessage,
  GameSession,
  Room,
  MatchmakingQueue,
  ChatMessage,
  GamePlayer
} from './database-schema'

export const config = {
  api: {
    bodyParser: false,
  },
}

// Socket.IO server instance
let io: ServerIO | null = null

// Session tracking for reconnection
// Redis clients for common state
let sessionStore: Redis | null = null

async function getSessionStore(): Promise<Redis> {
  if (!sessionStore) {
    sessionStore = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
  }
  return sessionStore
}

interface UserSession {
  socketId: string
  currentRoom?: string
  activeGameId?: string
  disconnectTimer?: NodeJS.Timeout
}
const activeSessions = new Map<string, UserSession>()

// Helper function to get Socket.IO server
function getSocketIO(server?: NetServer): ServerIO {
  if (!io) {
    if (!server) {
      throw new Error('Server instance is required for first initialization')
    }

    io = new ServerIO(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    })

    // Redis Adapter Configuration for Scaling
    if (process.env.REDIS_URL) {
      console.log('Initializing Redis Adapter for Socket.IO')
      try {
        const pubClient = new Redis(process.env.REDIS_URL)
        const subClient = pubClient.duplicate()

        io.adapter(createAdapter(pubClient, subClient))
        console.log('Redis Adapter initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Redis Adapter:', error)
      }
    }

    setupSocketHandlers(io)

    setInterval(async () => {
      console.log('Running Weekly Clan War Reset...')
      await clanWarManager.processWeeklyReset()
    }, 7 * 24 * 60 * 60 * 1000)

    // Initialize Battle Pass
    battlePassManager.initializeDefaultBP().then(() => {
      console.log('Battle Pass initialized');
    });
  }

  return io
}

// Setup Socket.IO event handlers
function setupSocketHandlers(socketIO: ServerIO) {
  console.log('Setting up Socket.IO handlers')

  socketIO.on('connection', (socket: any) => {
    console.log(`User connected: ${socket.id}`)

    // User authentication
    socket.on('authenticate', async (data: { userId: string; token: string }) => {
      try {
        if (!data.token) {
          socket.emit('error', { message: 'Authentication token required' })
          return
        }

        const decoded = await verifyToken(data.token)
        if (!decoded || decoded.userId !== data.userId) {
          socket.emit('error', { message: 'Invalid authentication token' })
          return
        }

        const user = await db.getUserById(data.userId)
        if (!user) {
          socket.emit('error', { message: 'User not found' })
          return
        }

        // Update user online status
        await db.updateUser(user.id, { isOnline: true })

        // Redis-backed session tracking
        const store = await getSessionStore()
        const sessionKey = `session:${user.id}`
        const existingSessionStr = await store.get(sessionKey)

        if (existingSessionStr) {
          const existingSession = JSON.parse(existingSessionStr)
          // Reconnection window logic would be handled by checking timestamp or similar in a distributed system
          // For now, we clear any previous state associated with the user
          console.log(`User ${user.username} reconnected/initialized session.`)
        }

        // Update session in Redis
        const sessionData = {
          socketId: socket.id,
          userId: user.id,
          username: user.username,
          lastSeen: Date.now()
        }
        await store.set(sessionKey, JSON.stringify(sessionData), 'EX', 3600) // 1 hour expiry

        // Update local tracking for this specific server instance
        activeSessions.set(user.id, {
          socketId: socket.id,
        })

        // Join user to their personal room
        socket.join(`user:${user.id}`)
        socket.userId = user.id

        socket.emit('authenticated', { user: { ...user, passwordHash: undefined } })
        console.log(`User authenticated: ${user.username} (${socket.id})`)

        // Send user's active games
        const activeGames = await db.getUserActiveGames(user.id)
        socket.emit('active_games', { games: activeGames })

        if (activeGames.length > 0) {
          const latestGame = activeGames[activeGames.length - 1]
          socket.gameId = latestGame.id
          socket.join(`game:${latestGame.id}`)
          socket.emit('game_sync', { game: latestGame })
        }

      } catch (error) {
        console.error('Authentication error:', error)
        socket.emit('error', { message: 'Authentication failed' })
      }
    })

    // Room management
    socket.on('join_room', async (data: { roomId: string; password?: string }) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' })
          return
        }

        const room = await db.getRoom(data.roomId)
        if (!room) {
          socket.emit('error', { message: 'Room not found' })
          return
        }

        // Check password for private rooms
        if (room.isPrivate && room.password !== data.password) {
          socket.emit('error', { message: 'Invalid password' })
          return
        }

        // Check if room is full
        if (room.players.length >= room.maxPlayers) {
          socket.emit('error', { message: 'Room is full' })
          return
        }

        // Add user to room
        const user = await db.getUserById(socket.userId)
        if (!user) return

        const userInventory = await db.getInventory(user.id)
        const avatar = userInventory?.equippedAvatar || 'default'

        const updatedRoom = await db.updateRoom(room.id, {
          players: [
            ...room.players,
            {
              userId: user.id,
              username: user.username,
              avatar,
              ready: false,
              joinedAt: new Date().toISOString(),
            }
          ]
        })

        if (updatedRoom) {
          // Join socket room
          socket.join(`room:${room.id}`)
          socket.currentRoom = room.id

          // Send room update to all players in room
          const message: RoomUpdateMessage = {
            type: 'room_update',
            data: {
              room: updatedRoom,
              action: 'player_joined'
            },
            userId: socket.userId,
            roomId: room.id,
            timestamp: Date.now()
          }

          socketIO.to(`room:${room.id}`).emit('room_update', message)
          socket.emit('joined_room', { room: updatedRoom })
        }

      } catch (error) {
        console.error('Join room error:', error)
        socket.emit('error', { message: 'Failed to join room' })
      }
    })

    socket.on('leave_room', async () => {
      try {
        if (!socket.userId || !socket.currentRoom) {
          return
        }

        const room = await db.getRoom(socket.currentRoom)
        if (!room) return

        // Remove user from room
        const updatedRoom = await db.updateRoom(room.id, {
          players: room.players.filter(p => p.userId !== socket.userId)
        })

        if (updatedRoom) {
          // Leave socket room
          socket.leave(`room:${room.id}`)
          socket.currentRoom = undefined

          // Send room update to remaining players
          const message: RoomUpdateMessage = {
            type: 'room_update',
            data: {
              room: updatedRoom,
              action: 'player_left'
            },
            userId: socket.userId,
            roomId: room.id,
            timestamp: Date.now()
          }

          socketIO.to(`room:${room.id}`).emit('room_update', message)
        }

      } catch (error) {
        console.error('Leave room error:', error)
      }
    })

    socket.on('toggle_ready', async () => {
      try {
        if (!socket.userId || !socket.currentRoom) {
          socket.emit('error', { message: 'Not in a room' })
          return
        }

        const room = await db.getRoom(socket.currentRoom)
        if (!room) return

        // Toggle user ready status
        const updatedRoom = await db.updateRoom(room.id, {
          players: room.players.map(p =>
            p.userId === socket.userId ? { ...p, ready: !p.ready } : p
          )
        })

        if (updatedRoom) {
          // Send room update to all players
          const message: RoomUpdateMessage = {
            type: 'room_update',
            data: {
              room: updatedRoom,
              action: 'player_ready'
            },
            userId: socket.userId,
            roomId: room.id,
            timestamp: Date.now()
          }

          socketIO.to(`room:${room.id}`).emit('room_update', message)

          // Check if all players are ready and start game
          if (updatedRoom.players.length === updatedRoom.maxPlayers &&
            updatedRoom.players.every(p => p.ready)) {

            // Call unified game start function
            await startGameSession(socketIO, updatedRoom)
          }
        }

      } catch (error) {
        console.error('Toggle ready error:', error)
        socket.emit('error', { message: 'Failed to toggle ready status' })
      }
    })

    // Chat management
    socket.on('send_chat_message', async (data: { content: string, type: 'global' | 'clan', clanId?: string }) => {
      try {
        if (!socket.userId) return

        const user = await db.getUserById(socket.userId)
        if (!user) return

        const message: ChatMessage = {
          id: `msg_${Date.now()}`,
          senderId: user.id,
          senderName: user.username,
          senderAvatar: user.avatar,
          content: data.content,
          type: data.type,
          clanId: data.clanId,
          timestamp: new Date().toISOString()
        }

        await db.addChatMessage(message)

        if (data.type === 'global') {
          socketIO.emit('chat_message', message)
        } else if (data.type === 'clan' && data.clanId) {
          socketIO.to(`clan:${data.clanId}`).emit('chat_message', message)
        }
      } catch (error) {
        console.error('Send chat message error:', error)
      }
    })

    socket.on('join_clan_chat', async (data: { clanId: string }) => {
      try {
        if (!socket.userId) return

        const clan = await db.getClan(data.clanId)
        if (!clan) return

        const isMember = clan.members.some(m => m.userId === socket.userId)
        if (isMember) {
          socket.join(`clan:${data.clanId}`)
          console.log(`User ${socket.userId} joined clan chat: ${data.clanId}`)
        }
      } catch (error) {
        console.error('Join clan chat error:', error)
      }
    })

    // Game actions
    socket.on('game_action', async (data: GameActionMessage) => {
      try {
        if (!socket.userId || !data.gameId) {
          socket.emit('error', { message: 'Missing required data' })
          return
        }

        const gameSession = await db.getGameSession(data.gameId)
        if (!gameSession) {
          socket.emit('error', { message: 'Game not found' })
          return
        }

        // Verify user is in the game
        const player = gameSession.players.find(p => p.userId === socket.userId)
        if (!player) {
          socket.emit('error', { message: 'Not in this game' })
          return
        }

        // Process game action
        let updatedSession: GameSession | null = null

        switch (data.action) {
          case 'play_tile':
            updatedSession = await handlePlayTile(gameSession, data, socket.userId)
            break
          case 'draw_tile':
            updatedSession = await handleDrawTile(gameSession, socket.userId)
            break
          case 'pass_turn':
            updatedSession = await handlePassTurn(gameSession, socket.userId)
            break
          case 'use_power_up':
            updatedSession = await handleUsePowerUp(gameSession, data, socket.userId)
            break
        }

        if (updatedSession) {
          // Broadcast game update to all players with HIDDEN HANDS security
          gameSession.players.forEach(p => {
            const sanitizedSession = {
              ...updatedSession,
              deck: [], // Hide the deck from all clients
              players: updatedSession.players.map(player => ({
                ...player,
                // Only show hand to its owner
                hand: player.userId === p.userId ? player.hand : player.hand.map(t => ({ id: 'hidden', left: -1, right: -1, isDouble: t.isDouble }))
              }))
            }
            socketIO.to(`user:${p.userId}`).emit('game_update', {
              game: sanitizedSession,
              action: data.action,
              userId: socket.userId,
              timestamp: Date.now()
            })
          })

          // Check for game end
          if (updatedSession.winner) {
            await handleGameEnd(updatedSession, socketIO)
          }
        }

      } catch (error) {
        console.error('Game action error:', error)
        socket.emit('error', { message: 'Failed to process game action' })
      }
    })

    // Tournament actions
    socket.on('tournament:join', async (data: { tournamentId: string }) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' })
          return
        }
        const result = await tournamentManager.registerPlayer(data.tournamentId, socket.userId)
        if (result.success) {
          socket.emit('tournament:joined', { tournamentId: data.tournamentId })
        } else {
          socket.emit('error', { message: result.message })
        }
      } catch (error) {
        console.error('Tournament join error:', error)
      }
    })

    socket.on('tournament:status', async () => {
      try {
        const tournaments = await db.getActiveTournaments()
        socket.emit('tournament:list', { tournaments })
      } catch (error) {
        console.error('Tournament status error:', error)
      }
    })

    // Battle Pass
    socket.on('battlepass:status', async () => {
      if (!socket.userId) return
      const activeBP = await db.getActiveBattlePass()
      const userBP = activeBP ? await battlePassManager.ensureUserBP(socket.userId) : null
      socket.emit('battlepass:data', { activeBP, userBP })
    })

    socket.on('battlepass:claim', async (data: { level: number, isPremium: boolean }) => {
      if (!socket.userId) return
      const result = await battlePassManager.claimReward(socket.userId, data.level, data.isPremium)
      if (result.success) {
        socket.emit('battlepass:claimed', { level: data.level, isPremium: data.isPremium })
      } else {
        socket.emit('error', { message: result.message })
      }
    })

    // Referrals
    socket.on('referral:get_code', async () => {
      if (!socket.userId) return
      const user = await db.getUserById(socket.userId)
      if (user) {
        const inviteLink = await referralManager.generateInviteLink(socket.userId)
        socket.emit('referral:code', { code: user.referralCode, inviteLink })
      }
    })

    socket.on('referral:redeem', async (data: { code: string }) => {
      if (!socket.userId) return
      const result = await referralManager.processReferral(socket.userId, data.code)
      if (result.success) {
        socket.emit('referral:redeemed', { message: result.message })
      } else {
        socket.emit('error', { message: result.message })
      }
    })

    socket.on('referral:send_lucky', async (data: { receiverId: string }) => {
      if (!socket.userId) return
      const result = await referralManager.sendLuckyTile(socket.userId, data.receiverId)
      if (result.success) {
        socket.emit('referral:lucky_sent', { message: result.message })
        socketIO.to(`user:${data.receiverId}`).emit('referral:lucky_received', { senderId: socket.userId })
      }
    })

    // Matchmaking
    socket.on('start_matchmaking', async (data: { mode: 'ranked' | 'casual', preferences?: any }) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' })
          return
        }

        const user = await db.getUserById(socket.userId)
        if (!user) return

        const ranked = await db.getRankedData(socket.userId)
        if (!ranked) return

        // Check if already in matchmaking
        const existingQueue = await db.getMatchmakingQueue(socket.userId)
        if (existingQueue) {
          socket.emit('error', { message: 'Already in matchmaking' })
          return
        }

        // Add to matchmaking queue
        const queueEntry = await db.addToMatchmaking({
          userId: socket.userId,
          mode: data.mode,
          elo: ranked.elo,
          preferences: {
            turnTimer: data.preferences?.turnTimer || 30,
            allowPowerUps: data.preferences?.allowPowerUps || false,
          },
          estimatedWaitTime: data.mode === 'ranked' ? 45 : 20,
        })

        // Join matchmaking room
        socket.join('matchmaking')
        socket.isMatchmaking = true

        socket.emit('matchmaking_started', {
          queue: queueEntry,
          estimatedWaitTime: queueEntry.estimatedWaitTime
        })

        // Start matchmaking process
        startMatchmakingProcess(socketIO, socket.userId, data.mode)

      } catch (error) {
        console.error('Start matchmaking error:', error)
        socket.emit('error', { message: 'Failed to start matchmaking' })
      }
    })

    socket.on('cancel_matchmaking', async () => {
      try {
        if (!socket.userId) return

        await db.removeFromMatchmaking(socket.userId)
        socket.leave('matchmaking')
        socket.isMatchmaking = false

        socket.emit('matchmaking_cancelled')

      } catch (error) {
        console.error('Cancel matchmaking error:', error)
      }
    })

    // Disconnection
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.id}, waiting for reconnection...`)

      if (socket.userId) {
        // Start a 30-second window for reconnection
        const timer = setTimeout(async () => {
          console.log(`Reconnection window expired for user: ${socket.userId}`)

          // Notify the user specifically (if they reconnect too late)
          socketIO.to(`user:${socket.userId}`).emit('session_lost', { reason: 'timeout' })

          // Final cleanup after window expires
          if (socket.userId) {
            await db.updateUser(socket.userId, { isOnline: false })
            activeSessions.delete(socket.userId)

            // Handle ranked forfeit if applicable
            if (socket.gameId) {
              const game = await db.getGameSession(socket.gameId)
              if (game && game.mode === 'ranked' && game.status === 'playing') {
                console.log(`Ranked game forfeit for user: ${socket.userId}`)
                // In a real app, this would trigger elo loss and end the game
                socketIO.to(`game:${socket.gameId}`).emit('match_forfeited', {
                  userId: socket.userId,
                  reason: 'Network Timeout'
                })
              }
            }

            // Leave current room if not already reconnected
            if (socket.currentRoom) {
              const room = await db.getRoom(socket.currentRoom)
              if (room) {
                const updatedRoom = await db.updateRoom(room.id, {
                  players: room.players.filter(p => p.userId !== socket.userId)
                })

                if (updatedRoom) {
                  const message: RoomUpdateMessage = {
                    type: 'room_update',
                    data: {
                      room: updatedRoom,
                      action: 'player_left'
                    },
                    userId: socket.userId,
                    roomId: room.id,
                    timestamp: Date.now()
                  }
                  socketIO.to(`room:${room.id}`).emit('room_update', message)
                }
              }
            }

            // Remove from matchmaking if active
            if (socket.isMatchmaking) {
              await db.removeFromMatchmaking(socket.userId)
            }
          }
        }, 30000) // 30 seconds

        // Update the session with the timer
        const currentSession = activeSessions.get(socket.userId)
        if (currentSession) {
          activeSessions.set(socket.userId, {
            ...currentSession,
            disconnectTimer: timer
          })
        }
      }
    })

    // Disconnection
  })
}

// Game action handlers
async function handlePlayTile(game: GameSession, data: GameActionMessage, userId: string): Promise<GameSession | null> {
  const { tileId, end } = data.data

  if (!tileId || !end) return null

  // Find current player and tile
  const currentPlayerIndex = game.players.findIndex(p => p.userId === userId)

  // ANTI-CHEAT: Verify it's actually the player's turn
  if (currentPlayerIndex !== game.currentPlayerIndex) {
    console.warn(`Anti-Cheat: Player ${userId} attempted to play out of turn.`)
    return null
  }

  const currentPlayer = game.players[currentPlayerIndex]
  const tileIndex = currentPlayer.hand.findIndex(t => t.id === tileId)

  // ANTI-CHEAT: Verify player actually has this tile in their server-side hand
  if (tileIndex === -1) {
    console.warn(`Anti-Cheat: Player ${userId} attempted to play tile ${tileId} they don't own.`)
    return null
  }

  const tile = currentPlayer.hand[tileIndex]
  const newBoard = [...game.board]
  let newBoardEnds = { ...game.boardEnds }

  // Add tile to board and validate placement
  if (game.board.length === 0) {
    newBoard.push({
      tileId,
      tile,
      position: 0,
      rotation: 0,
      playedBy: userId,
      playedAt: new Date().toISOString(),
    })
    newBoardEnds = { left: tile.left, right: tile.right }
  } else {
    const targetEnd = end === 'left' ? newBoardEnds.left : newBoardEnds.right
    const playedTile = { ...tile }

    // ANTI-CHEAT: Server-side validation: check if tile fits the selected end
    const canPlay = tile.left === targetEnd || tile.right === targetEnd
    if (!canPlay) {
      console.warn(`Anti-Cheat: Player ${userId} attempted invalid placement: ${tile.left}-${tile.right} on ${end} (${targetEnd})`)
      return null
    }

    if (end === 'left') {
      if (tile.right === targetEnd) {
        newBoardEnds.left = tile.left
      } else {
        newBoardEnds.left = tile.right
      }
      newBoard.unshift({
        tileId,
        tile: playedTile,
        position: -newBoard.length,
        rotation: 0,
        playedBy: userId,
        playedAt: new Date().toISOString(),
      })
    } else {
      if (tile.left === targetEnd) {
        newBoardEnds.right = tile.right
      } else {
        newBoardEnds.right = tile.left
      }
      newBoard.push({
        tileId,
        tile: playedTile,
        position: newBoard.length,
        rotation: 0,
        playedBy: userId,
        playedAt: new Date().toISOString(),
      })
    }
  }

  // VALIDATED - Apply hand change
  const newPlayers = [...game.players]
  newPlayers[currentPlayerIndex] = {
    ...currentPlayer,
    hand: currentPlayer.hand.filter((_, index) => index !== tileIndex),
    lastActionAt: new Date().toISOString(),
  }

  // Check for winner
  const winner = newPlayers[currentPlayerIndex].hand.length === 0 ? userId : null
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length

  return await db.updateGameSession(game.id, {
    board: newBoard,
    boardEnds: newBoardEnds,
    players: newPlayers,
    currentPlayerIndex: nextPlayerIndex,
    winner,
    status: winner ? 'finished' : 'playing',
    finishedAt: winner ? new Date().toISOString() : undefined,
  })
}

function canPlayAnyTile(hand: any[], boardEnds: { left: number; right: number } | null): boolean {
  if (!boardEnds) return true // First move always possible
  return hand.some(t =>
    t.left === boardEnds.left || t.right === boardEnds.left ||
    t.left === boardEnds.right || t.right === boardEnds.right
  )
}

async function handleDrawTile(game: GameSession, userId: string): Promise<GameSession | null> {
  // ANTI-CHEAT: Verify it's the player's turn
  const currentPlayerIndex = game.players.findIndex(p => p.userId === userId)
  if (currentPlayerIndex !== game.currentPlayerIndex) return null

  // ANTI-CHEAT: Prevent drawing if player already has a playable tile
  if (canPlayAnyTile(game.players[currentPlayerIndex].hand, game.board.length > 0 ? game.boardEnds : null)) {
    console.warn(`Anti-Cheat: Player ${userId} attempted to draw while having playable tiles.`)
    // return null // Rigid enforcement - optional based on game rules
  }

  if (game.deck.length === 0) return null

  const newDeck = [...game.deck]
  const drawnTile = newDeck.pop()!

  const newPlayers = [...game.players]
  newPlayers[currentPlayerIndex] = {
    ...newPlayers[currentPlayerIndex],
    hand: [...newPlayers[currentPlayerIndex].hand, drawnTile],
    lastActionAt: new Date().toISOString(),
  }

  return await db.updateGameSession(game.id, {
    deck: newDeck,
    players: newPlayers,
  })
}

async function handlePassTurn(game: GameSession, userId: string): Promise<GameSession | null> {
  const currentPlayerIndex = game.players.findIndex(p => p.userId === userId)
  if (currentPlayerIndex !== game.currentPlayerIndex) return null

  // ANTI-CHEAT: Only allow passing if deck is empty AND player has no playable tiles
  const canPlay = canPlayAnyTile(game.players[currentPlayerIndex].hand, game.board.length > 0 ? game.boardEnds : null)
  if (game.deck.length > 0 || canPlay) {
    console.warn(`Anti-Cheat: Player ${userId} attempted to pass turn illegally. Deck length: ${game.deck.length}, Can play: ${canPlay}`)
    return null
  }

  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length

  return await db.updateGameSession(game.id, {
    currentPlayerIndex: nextPlayerIndex,
    turnTimer: game.settings.turnTimer || null,
  })
}

async function handleUsePowerUp(game: GameSession, data: GameActionMessage, userId: string): Promise<GameSession | null> {
  const { powerUpId } = data.data
  if (!powerUpId) return null

  // ANTI-CHEAT: Verify user actually owns this power-up
  const inventory = await db.getInventory(userId)
  if (!inventory) {
    console.warn(`Anti-Cheat: Player ${userId} has no inventory record.`)
    return null
  }

  const quantity = inventory.powerUps[powerUpId] || 0

  if (quantity <= 0) {
    console.warn(`Anti-Cheat: Player ${userId} attempted to use power-up ${powerUpId} they don't own or have quantity for.`)
    return null
  }

  // Implementation of specific power-up effects would happen here
  // For now, we'll just consume 1 quantity and log it
  // In a real scenario, this would modify the GameSession (e.g., skip next player, etc.)

  const updatedPowerUps = { ...inventory.powerUps }
  updatedPowerUps[powerUpId] = quantity - 1

  await db.updateInventory(userId, { powerUps: updatedPowerUps })
  console.log(`Player ${userId} used power-up ${powerUpId}. Remaining: ${updatedPowerUps[powerUpId]}`)

  // For this implementation, we just return the current game session or trigger a specific effect
  return game
}

// Matchmaking process
async function startMatchmakingProcess(socketIO: ServerIO, userId: string, mode: 'ranked' | 'casual') {
  const checkInterval = setInterval(async () => {
    try {
      const queue = await db.getMatchmakingQueue(userId)
      if (!queue) {
        clearInterval(checkInterval)
        return
      }

      const allQueues = await db.getMatchmakingQueueByMode(mode)

      // Find suitable match (simplified - just match first available player)
      if (allQueues.length >= 2) {
        const player1 = allQueues[0]
        const player2 = allQueues[1]

        if (player1.userId === userId || player2.userId === userId) {
          // Create match room
          const user1 = await db.getUserById(player1.userId)
          const user2 = await db.getUserById(player2.userId)

          if (user1 && user2) {
            const room = await db.createRoom({
              name: mode === 'ranked' ? 'Partita Classificata' : 'Partita Casuale',
              hostId: 'system',
              players: [
                {
                  userId: user1.id,
                  username: user1.username,
                  avatar: user1.avatar,
                  ready: true,
                  joinedAt: new Date().toISOString(),
                },
                {
                  userId: user2.id,
                  username: user2.username,
                  avatar: user2.avatar,
                  ready: true,
                  joinedAt: new Date().toISOString(),
                }
              ],
              maxPlayers: 2,
              isPrivate: false,
              status: 'starting',
              mode: mode === 'ranked' ? 'ranked' : 'casual',
              settings: {
                turnTimer: player1.preferences.turnTimer,
                rounds: 1,
                allowPowerUps: player1.preferences.allowPowerUps,
                isPrivate: false,
                maxPlayers: 2,
              }
            })

            // Remove both players from queue
            await db.removeFromMatchmaking(player1.userId)
            await db.removeFromMatchmaking(player2.userId)

            // Notify players
            const message: MatchmakingUpdateMessage = {
              type: 'matchmaking_update',
              data: {
                status: 'found',
                match: room
              },
              userId,
              timestamp: Date.now()
            }

            socketIO.to(`user:${player1.userId}`).emit('match_found', message)
            socketIO.to(`user:${player2.userId}`).emit('match_found', message)

            // Auto-start game session for matchmaking
            await startGameSession(socketIO, room)

            clearInterval(checkInterval)
          }
        }
      }

    } catch (error) {
      console.error('Matchmaking process error:', error)
    }
  }, 5000) // Check every 5 seconds

  // Stop checking after 2 minutes
  setTimeout(() => {
    clearInterval(checkInterval)
  }, 120000)
}

// Help function to start a game session and handle administrative tasks
async function startGameSession(socketIO: ServerIO, room: Room) {
  try {
    // 1. Deduct entry fees (Skilled-based Lobby Fee)
    const lobbyFee = room.mode === 'ranked' ? 200 : 100
    for (const p of room.players) {
      const inventory = await db.getInventory(p.userId)
      if (inventory) {
        const newBalance = Math.max(0, inventory.coins - lobbyFee)
        await db.updateInventory(p.userId, { coins: newBalance })
        await db.createTransaction({
          userId: p.userId,
          type: 'purchase',
          amount: lobbyFee,
          currency: 'coins',
          description: `Contributo lobby: ${room.mode === 'ranked' ? 'Classificata' : 'Veloce'}`,
        })
      }
    }

    // 2. Create game session with LTM Overrides
    const activeEvents = await db.getActiveEvents()
    const ltmEvent = activeEvents.find(e => e.type === 'ltm')

    const finalSettings = {
      ...room.settings,
      ...(ltmEvent?.settingsOverride || {})
    }

    const gameSession = await db.createGameSession({
      mode: room.mode === 'ranked' ? 'ranked' :
        room.mode === 'private' ? 'private' : 'multiplayer',
      status: 'starting',
      players: room.players.map(p => ({
        userId: p.userId,
        username: p.username,
        avatar: p.avatar,
        hand: [],
        isAI: false,
        isReady: true,
        connectedAt: p.joinedAt,
        lastActionAt: new Date().toISOString(),
      })),
      currentPlayerIndex: 0,
      board: [],
      boardEnds: { left: -1, right: -1 },
      deck: [],
      winner: null,
      turnTimer: finalSettings.turnTimer || null,
      roundNumber: 1,
      scores: {},
      settings: finalSettings,
    })

    // 3. Update room status
    await db.updateRoom(room.id, { status: 'in_game' })

    // 4. Notify all players with sanitized data (Hidden Hands)
    room.players.forEach(p => {
      const sanitizedStartingGame = {
        ...gameSession,
        deck: [],
        players: gameSession.players.map(player => ({
          ...player,
          hand: player.userId === p.userId ? player.hand : player.hand.map(t => ({ id: 'hidden', left: -1, right: -1, isDouble: t.isDouble }))
        }))
      }
      socketIO.to(`user:${p.userId}`).emit('game_starting', {
        gameSession: sanitizedStartingGame,
        countdown: 3
      })
    })

    // 5. Start game after countdown
    setTimeout(async () => {
      const finalGameSession = await db.updateGameSession(gameSession.id, {
        status: 'playing',
        startedAt: new Date().toISOString(),
      })

      if (finalGameSession) {
        finalGameSession.players.forEach(p => {
          const sanitizedGame = {
            ...finalGameSession,
            deck: [],
            players: finalGameSession.players.map(player => ({
              ...player,
              hand: player.userId === p.userId ? player.hand : player.hand.map(t => ({ id: 'hidden', left: -1, right: -1, isDouble: t.isDouble }))
            }))
          }
          socketIO.to(`user:${p.userId}`).emit('game_started', {
            game: sanitizedGame
          })
        })
      }
    }, 3000)

  } catch (error) {
    console.error('Failed to start game session:', error)
  }
}

// Handle game end
async function handleGameEnd(game: GameSession, socketIO: ServerIO) {
  if (!game.winner) return

  // Check if this game is part of a tournament
  const activeTournaments = await db.getActiveTournaments()
  for (const tournament of activeTournaments) {
    const match = tournament.matches.find(m => m.gameId === game.id)
    if (match) {
      await tournamentManager.advanceMatchWinner(tournament.id, match.id, game.winner)
      // Notify everyone about tournament update
      socketIO.emit('tournament:updated', { tournamentId: tournament.id })
      break
    }
  }

  // Update player statistics and award prizes
  const isRanked = game.mode === 'ranked'

  // Flash Events Multipliers
  const activeEvents = await db.getActiveEvents()
  let xpMultiplier = 1.0
  let coinMultiplier = 1.0
  activeEvents.forEach(e => {
    xpMultiplier *= e.xpMultiplier
    coinMultiplier *= e.coinMultiplier
  })

  const baseWinnerPrize = isRanked ? 360 : 180
  const winnerPrize = Math.floor(baseWinnerPrize * coinMultiplier)

  for (const player of game.players) {
    const won = player.userId === game.winner
    const opponent = game.players.find(p => p.userId !== player.userId)

    // Authoritative Prize & XP Distribution
    const baseXP = won ? 100 : 20
    const xpReward = Math.floor(baseXP * xpMultiplier)

    // Clan War Points
    if (isRanked) {
      await clanWarManager.addWarPoints(player.userId, won ? 10 : 2)
    }

    const inventory = await db.getInventory(player.userId)
    const user = await db.getUserById(player.userId)

    if (inventory && user) {
      // Award Coins
      if (won) {
        const newBalance = inventory.coins + winnerPrize
        await db.updateInventory(player.userId, { coins: newBalance })
        await db.createTransaction({
          userId: player.userId,
          type: 'reward',
          amount: winnerPrize,
          currency: 'coins',
          description: `Premio vittoria: ${isRanked ? 'Classificata' : 'Veloce'}`,
        })
      }

      // Award XP & Level Up
      let newXp = user.xp + xpReward
      let newLevel = user.level
      let xpToNext = user.xpToNextLevel

      while (newXp >= xpToNext) {
        newXp -= xpToNext
        newLevel += 1
        xpToNext = Math.floor(xpToNext * 1.2) // Exponential level scaling
      }

      await db.updateUser(player.userId, {
        xp: newXp,
        level: newLevel,
        xpToNextLevel: xpToNext
      })

      await db.createTransaction({
        userId: player.userId,
        type: 'achievement',
        amount: xpReward,
        currency: 'gems', // Using Gems field for XP in transactions or just tracking
        description: `XP guadagnata: ${won ? 'Vittoria' : 'Partecipazione'}`
      })

      // Battle Pass XP
      const bpReward = won ? 500 : 150
      const { levelUp: bpLevelUp, newLevel: bpNewLevel } = await battlePassManager.addXP(player.userId, bpReward)

      if (bpLevelUp) {
        socketIO.to(player.userId).emit('battlepass:levelup', { level: bpNewLevel })
      }

      // Monetization Hook: Offer Wall on loss
      if (!won && Math.random() < 0.3) { // 30% chance on loss
        socketIO.to(player.userId).emit('offer:special', {
          id: 'bp_discount',
          title: "Non mollare!",
          description: "Ottieni il 50% di XP in più per le prossime 3 partite con il Battle Pass Premium!",
          price: "4.99€"
        })
      }
    }

    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/user/stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: player.userId,
        gameResult: won ? 'win' : 'loss',
        mode: game.mode,
        opponentElo: opponent?.elo,
        pointsEarned: won ? winnerPrize : 0,
        duration: 0,
        gameId: game.id,
      })
    })
  }

  // Notify all players
  socketIO.to(`game:${game.id}`).emit('game_ended', {
    game,
    winner: game.winner,
    timestamp: Date.now()
  })
}

// Socket.IO handler for Next.js API route
export default async function SocketHandler(req: NextApiRequest, res: NextApiResponse & { socket: any }) {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server...')
    const httpServer: NetServer = res.socket.server as any
    const socketIO = getSocketIO(httpServer)
    res.socket.server.io = socketIO
  }

  res.end()
}

// Export for use in other parts of the application
export { getSocketIO }
