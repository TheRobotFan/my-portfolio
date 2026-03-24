import { NextRequest, NextResponse } from 'next/server'
import { extendedDb } from '@/lib/database-extended'
import { GamificationSystem } from '@/lib/gamification-system'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/gamification/badges - Get user badges
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

    // Get available badges
    const availableBadges = GamificationSystem.getAvailableBadges(progress)
    
    // Filter by category if specified
    if (category) {
      const filtered = availableBadges.filter(badge => badge.category === category)
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          badges: filtered,
          unlockedCount: progress.badges.length,
          totalCount: 15 // Would calculate from total badges
        }
      })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        badges: availableBadges,
        unlockedBadges: progress.badges,
        equippedBadges: progress.equippedBadges,
        unlockedCount: progress.badges.length,
        totalCount: 15
      }
    })

  } catch (error) {
    console.error('Get badges error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT /api/gamification/badges - Equip badge
export async function PUT(request: NextRequest) {
  try {
    const { userId, badgeId, slot } = await request.json()

    if (!userId || !badgeId || !slot) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID, badge ID, and slot are required'
      }, { status: 400 })
    }

    const progress = await extendedDb.getUserProgress(userId)
    if (!progress) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User progress not found'
      }, { status: 404 })
    }

    // Check if user owns the badge
    if (!progress.badges.includes(badgeId)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Badge not owned'
      }, { status: 400 })
    }

    // Equip the badge
    (progress.equippedBadges as any)[slot] = badgeId
    progress.updatedAt = new Date().toISOString()

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        equippedBadges: progress.equippedBadges
      },
      message: 'Badge equipped successfully'
    })

  } catch (error) {
    console.error('Equip badge error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
