import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse } from '@/lib/database-schema'

// POST /api/matchmaking - Start matchmaking
export async function POST(request: NextRequest) {
  try {
    const { userId, mode, preferences } = await request.json()

    if (!userId || !mode) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID and mode are required'
      }, { status: 400 })
    }

    if (!['ranked', 'casual'].includes(mode)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid mode'
      }, { status: 400 })
    }

    // Get user and ranked data
    const [user, ranked] = await Promise.all([
      db.getUserById(userId),
      db.getRankedData(userId)
    ])

    if (!user || !ranked) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Check if already in matchmaking
    const existingQueue = await db.getMatchmakingQueue(userId)
    if (existingQueue) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Already in matchmaking'
      }, { status: 400 })
    }

    // Add to matchmaking queue
    const queueEntry = await db.addToMatchmaking({
      userId,
      mode,
      elo: ranked.elo,
      preferences: {
        turnTimer: preferences?.turnTimer || 30,
        allowPowerUps: preferences?.allowPowerUps || false,
      },
      estimatedWaitTime: mode === 'ranked' ? 45 : 20,
    })

    // Try to find match immediately
    const allQueues = await db.getMatchmakingQueueByMode(mode)
    
    if (allQueues.length >= 2) {
      // Find suitable opponent (simplified ELO matching)
      const opponent = allQueues.find(q => 
        q.userId !== userId && 
        Math.abs(q.elo - ranked.elo) <= 200 // Within 200 ELO points
      )

      if (opponent) {
        // Create match room
        const opponentUser = await db.getUserById(opponent.userId)
        if (opponentUser) {
          const room = await db.createRoom({
            name: mode === 'ranked' ? 'Partita Classificata' : 'Partita Casuale',
            hostId: 'system',
            players: [
              {
                userId: user.id,
                username: user.username,
                avatar: 'default', // Would get from inventory
                ready: true,
                joinedAt: new Date().toISOString(),
              },
              {
                userId: opponentUser.id,
                username: opponentUser.username,
                avatar: 'default',
                ready: true,
                joinedAt: new Date().toISOString(),
              }
            ],
            maxPlayers: 2,
            isPrivate: false,
            status: 'starting',
            settings: {
              turnTimer: queueEntry.preferences.turnTimer,
              rounds: 1,
              allowPowerUps: queueEntry.preferences.allowPowerUps,
              isPrivate: false,
              maxPlayers: 2,
            }
          })

          // Remove both players from queue
          await db.removeFromMatchmaking(userId)
          await db.removeFromMatchmaking(opponent.userId)

          return NextResponse.json<ApiResponse>({
            success: true,
            data: {
              status: 'found',
              match: room,
              waitTime: 0,
            },
            message: 'Match found immediately!'
          })
        }
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        status: 'searching',
        queue: queueEntry,
        estimatedWaitTime: queueEntry.estimatedWaitTime,
        playersInQueue: allQueues.length,
      },
      message: 'Added to matchmaking queue'
    })

  } catch (error) {
    console.error('Matchmaking error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE /api/matchmaking - Cancel matchmaking
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const removed = await db.removeFromMatchmaking(userId)
    
    if (!removed) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Not in matchmaking queue'
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Removed from matchmaking queue'
    })

  } catch (error) {
    console.error('Cancel matchmaking error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// GET /api/matchmaking - Get matchmaking status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const queue = await db.getMatchmakingQueue(userId)
    
    if (!queue) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Not in matchmaking queue'
      }, { status: 404 })
    }

    // Get current queue size
    const allQueues = await db.getMatchmakingQueueByMode(queue.mode)
    
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        queue,
        playersInQueue: allQueues.length,
        estimatedWaitTime: queue.estimatedWaitTime,
      }
    })

  } catch (error) {
    console.error('Get matchmaking status error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
