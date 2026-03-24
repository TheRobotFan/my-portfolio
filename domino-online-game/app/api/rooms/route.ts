import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/rooms - Get available rooms
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const includePrivate = searchParams.get('includePrivate') === 'true'

    let rooms = await db.getAvailableRooms(limit)
    
    // Filter out private rooms unless explicitly requested
    if (!includePrivate) {
      rooms = rooms.filter(room => !room.isPrivate)
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        rooms,
        total: rooms.length,
      }
    })

  } catch (error) {
    console.error('Get rooms error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/rooms - Create new room
export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      name, 
      isPrivate = false, 
      password,
      settings = {
        turnTimer: 30,
        rounds: 1,
        allowPowerUps: true,
        isPrivate: false,
        maxPlayers: 2,
      }
    } = await request.json()

    if (!userId || !name) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID and room name are required'
      }, { status: 400 })
    }

    // Get user
    const user = await db.getUserById(userId)
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Create room
    const room = await db.createRoom({
      name: name.trim(),
      hostId: userId,
      players: [{
        userId: user.id,
        username: user.username,
        avatar: 'default', // Would get from inventory
        ready: false,
        joinedAt: new Date().toISOString(),
      }],
      maxPlayers: settings.maxPlayers || 2,
      isPrivate,
      password: isPrivate ? password : undefined,
      status: 'waiting',
      settings: {
        ...settings,
        isPrivate,
        maxPlayers: settings.maxPlayers || 2,
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { room },
      message: 'Room created successfully'
    })

  } catch (error) {
    console.error('Create room error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
