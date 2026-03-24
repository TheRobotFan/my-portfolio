import { NextRequest, NextResponse } from 'next/server'
import { extendedDb } from '@/lib/database-extended'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/gamification/profile - Get user gamification profile
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

    const [user, progress, socialProfile] = await Promise.all([
      extendedDb.users.get(userId),
      extendedDb.getUserProgress(userId),
      extendedDb.socialProfiles.get(userId)
    ])

    if (!user || !progress) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Get user statistics summary
    const statsSummary = {
      totalAchievements: 50, // Would calculate from achievements
      unlockedAchievements: progress.achievements.length,
      completionRate: Math.round((progress.achievements.length / 50) * 100),
      totalBadges: 15, // Would calculate from badges
      unlockedBadges: progress.badges.length,
      currentLevel: progress.level,
      nextLevel: progress.level + 1,
      levelProgress: Math.round((progress.xp / 100) * 100), // Simplified
      rank: 'bronze',
      rankColor: '#CD7F32'
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          level: user.level,
          xp: user.xp,
          totalXP: user.totalXP
        },
        gamification: progress,
        social: socialProfile,
        stats: statsSummary
      }
    })

  } catch (error) {
    console.error('Get gamification profile error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT /api/gamification/profile - Update user gamification profile
export async function PUT(request: NextRequest) {
  try {
    const { userId, updates } = await request.json()

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const progress = await extendedDb.getUserProgress(userId)
    if (!progress) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User progress not found'
      }, { status: 404 })
    }

    // Update equipped badges
    if (updates.equippedBadges) {
      progress.equippedBadges = { ...progress.equippedBadges, ...updates.equippedBadges }
    }

    progress.updatedAt = new Date().toISOString()

    return NextResponse.json<ApiResponse>({
      success: true,
      data: progress,
      message: 'Gamification profile updated successfully'
    })

  } catch (error) {
    console.error('Update gamification profile error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
