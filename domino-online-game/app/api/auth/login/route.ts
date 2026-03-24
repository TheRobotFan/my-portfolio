import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse } from '@/lib/database-schema'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validation
    if (!username || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Username and password are required'
      }, { status: 400 })
    }

    // Find user
    const user = await db.getUserByUsername(username.trim())
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 })
    }

    // Update last login
    await db.updateUser(user.id, {
      lastLoginAt: new Date().toISOString(),
      isOnline: true,
    })

    // Sign JWT and set cookie
    const authPayload = {
      userId: user.id,
      username: user.username,
      isGuest: user.isGuest,
    }

    const { signToken } = await import('@/lib/auth-jwt')
    const token = await signToken(authPayload)

    // Set cookie manually in the return response since we are in a route handler
    // and using cookies() from next/headers might not work as expected in all Next versions for response setting
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
      message: 'Login successful'
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
    console.error('Login error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
