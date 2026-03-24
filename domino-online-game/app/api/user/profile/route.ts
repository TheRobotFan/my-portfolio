import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/user/profile - Get user profile
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

    // Get user data
    const [user, stats, ranked, inventory, achievements, gameHistory] = await Promise.all([
      db.getUserById(userId),
      db.getUserStats(userId),
      db.getRankedData(userId),
      db.getInventory(userId),
      db.getUserAchievements(userId),
      db.getUserGameHistory(userId, 10),
    ])

    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: userWithoutPassword,
        stats,
        ranked,
        inventory,
        achievements,
        recentGames: gameHistory,
      }
    })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const { userId, username, avatar } = await request.json()

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await db.getUserById(userId)
    if (!existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // If username is being changed, check if it's available
    if (username && username !== existingUser.username) {
      if (username.trim().length < 3) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Username must be at least 3 characters long'
        }, { status: 400 })
      }

      const usernameTaken = await db.getUserByUsername(username.trim())
      if (usernameTaken) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Username already taken'
        }, { status: 409 })
      }
    }

    // Update user
    const updates: any = {}
    if (username) updates.username = username.trim()
    if (avatar) updates.avatar = avatar

    const updatedUser = await db.updateUser(userId, updates)
    if (!updatedUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to update user'
      }, { status: 500 })
    }

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json<ApiResponse>({
      success: true,
      data: userWithoutPassword,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
