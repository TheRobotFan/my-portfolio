import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse } from '@/lib/database-schema'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    // Validation
    if (!username || username.trim().length < 2) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Username must be at least 2 characters long'
      }, { status: 400 })
    }

    const trimmedUsername = username.trim()

    // Check if username already exists
    const existingUser = await db.getUserByUsername(trimmedUsername)
    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Username already taken'
      }, { status: 409 })
    }

    // Create guest user
    const user = await db.createUser({
      username: trimmedUsername,
      passwordHash: 'guest', // No password for guest users
      avatar: 'default',
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      isOnline: true,
      isGuest: true,
    })

    // Sign JWT and set cookie
    const authPayload = {
      userId: user.id,
      username: user.username,
      isGuest: user.isGuest,
    }

    const { signToken } = await import('@/lib/auth-jwt')
    const token = await signToken(authPayload)

    // Get user's related data
    const [stats, ranked, inventory] = await Promise.all([
      db.getUserStats(user.id),
      db.getRankedData(user.id),
      db.getInventory(user.id),
    ])

    const response = NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          level: user.level,
          xp: user.xp,
          isGuest: user.isGuest,
        },
        stats,
        ranked,
        inventory,
        token,
      },
      message: 'Guest account created successfully'
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Guest creation error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
