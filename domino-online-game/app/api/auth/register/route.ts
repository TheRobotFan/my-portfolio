import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse } from '@/lib/database-schema'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // Validation
    if (!username || username.trim().length < 3) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Username must be at least 3 characters long'
      }, { status: 400 })
    }

    if (!password || password.length < 6) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Password must be at least 6 characters long'
      }, { status: 400 })
    }

    // Check if username already exists
    const existingUser = await db.getUserByUsername(username.trim())
    if (existingUser) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Username already taken'
      }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.createUser({
      username: username.trim(),
      email: email?.trim(),
      passwordHash,
      avatar: 'default',
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      isOnline: true,
      isGuest: false,
    })

    // Sign JWT and set cookie
    const authPayload = {
      userId: user.id,
      username: user.username,
      isGuest: user.isGuest,
    }

    const { signToken } = await import('@/lib/auth-jwt')
    const token = await signToken(authPayload)

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
        token,
      },
      message: 'User registered successfully'
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
    console.error('Registration error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
