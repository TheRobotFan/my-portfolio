import { NextRequest, NextResponse } from 'next/server'
import { extendedDb } from '@/lib/database-extended'
import { GamificationSystem } from '@/lib/gamification-system'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/gamification/achievements - Get user achievements
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')

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

    // Get available achievements
    const availableAchievements = GamificationSystem.getAvailableAchievements(progress)
    
    // Filter by category if specified
    if (category) {
      const filtered = availableAchievements.filter(achievement => achievement.category === category)
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          achievements: filtered,
          unlockedCount: progress.achievements.length,
          totalCount: 50 // Would calculate from total achievements
        }
      })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        achievements: availableAchievements,
        unlockedCount: progress.achievements.length,
        totalCount: 50,
        completionRate: Math.round((progress.achievements.length / 50) * 100)
      }
    })

  } catch (error) {
    console.error('Get achievements error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/gamification/achievements - Check and unlock achievements
export async function POST(request: NextRequest) {
  try {
    const { userId, userStats } = await request.json()

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const unlockedAchievements = await extendedDb.checkAndUnlockAchievements(userId, userStats)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        unlockedAchievements,
        count: unlockedAchievements.length
      },
      message: unlockedAchievements.length > 0 
        ? `Unlocked ${unlockedAchievements.length} achievements!` 
        : 'No new achievements unlocked'
    })

  } catch (error) {
    console.error('Check achievements error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
