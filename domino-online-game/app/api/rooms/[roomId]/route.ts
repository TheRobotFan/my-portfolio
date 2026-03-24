import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/rooms/[roomId] - Get specific room
export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const { roomId } = params

    const room = await db.getRoom(roomId)
    if (!room) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Room not found'
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { room }
    })

  } catch (error) {
    console.error('Get room error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT /api/rooms/[roomId] - Update room
export async function PUT(request: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const { roomId } = params
    const { userId, action, data } = await request.json()

    if (!userId || !action) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID and action are required'
      }, { status: 400 })
    }

    const room = await db.getRoom(roomId)
    if (!room) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Room not found'
      }, { status: 404 })
    }

    let updatedRoom = room

    switch (action) {
      case 'join':
        // Check password for private rooms
        if (room.isPrivate && room.password !== data?.password) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Invalid password'
          }, { status: 401 })
        }

        // Check if room is full
        if (room.players.length >= room.maxPlayers) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Room is full'
          }, { status: 400 })
        }

        // Check if user already in room
        if (room.players.some(p => p.userId === userId)) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Already in room'
          }, { status: 400 })
        }

        // Add user to room
        const user = await db.getUserById(userId)
        if (!user) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'User not found'
          }, { status: 404 })
        }

        updatedRoom = await db.updateRoom(roomId, {
          players: [
            ...room.players,
            {
              userId: user.id,
              username: user.username,
              avatar: 'default', // Would get from inventory
              ready: false,
              joinedAt: new Date().toISOString(),
            }
          ]
        })
        break

      case 'leave':
        // Remove user from room
        updatedRoom = await db.updateRoom(roomId, {
          players: room.players.filter(p => p.userId !== userId)
        })

        // If room is empty, delete it
        if (updatedRoom && updatedRoom.players.length === 0) {
          await db.deleteRoom(roomId)
          return NextResponse.json<ApiResponse>({
            success: true,
            message: 'Left room and room deleted'
          })
        }
        break

      case 'toggle_ready':
        // Toggle user ready status
        updatedRoom = await db.updateRoom(roomId, {
          players: room.players.map(p =>
            p.userId === userId ? { ...p, ready: !p.ready } : p
          )
        })
        break

      case 'start_game':
        // Check if all players are ready
        if (!room.players.every(p => p.ready)) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Not all players are ready'
          }, { status: 400 })
        }

        // Check if user is host
        if (room.hostId !== userId) {
          return NextResponse.json<ApiResponse>({
            success: false,
            error: 'Only host can start game'
          }, { status: 403 })
        }

        // Update room status
        updatedRoom = await db.updateRoom(roomId, {
          status: 'in_game'
        })
        break

      default:
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

    if (!updatedRoom) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to update room'
      }, { status: 500 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { room: updatedRoom },
      message: `Room ${action} successful`
    })

  } catch (error) {
    console.error('Update room error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE /api/rooms/[roomId] - Delete room
export async function DELETE(request: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const { roomId } = params
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const room = await db.getRoom(roomId)
    if (!room) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Room not found'
      }, { status: 404 })
    }

    // Check if user is host
    if (room.hostId !== userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Only host can delete room'
      }, { status: 403 })
    }

    const deleted = await db.deleteRoom(roomId)
    if (!deleted) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to delete room'
      }, { status: 500 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Room deleted successfully'
    })

  } catch (error) {
    console.error('Delete room error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
