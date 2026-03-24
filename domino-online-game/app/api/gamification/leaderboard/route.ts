import { NextRequest, NextResponse } from 'next/server'
import { extendedDb } from '@/lib/database-extended'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/gamification/leaderboard - Get gamification leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'xp' // 'xp' | 'level' | 'wins' | 'achievements'
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!['xp', 'level', 'wins', 'achievements'].includes(type)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid type. Must be xp, level, wins, or achievements'
      }, { status: 400 })
    }

    // Get leaderboard data
    const leaderboard = await extendedDb.getLeaderboard(type as 'xp' | 'level' | 'wins' | 'achievements', limit)
    
    // Apply offset for pagination
    const paginatedLeaderboard = leaderboard.slice(offset)

    // Get user's rank if requested
    const userId = searchParams.get('userId')
    let userRank = null
    
    if (userId) {
      const userEntry = leaderboard.find(entry => entry.userId === userId)
      if (userEntry) {
        userRank = userEntry.rank || (leaderboard.indexOf(userEntry) + 1)
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        leaderboard: paginatedLeaderboard.map((entry, index) => ({
          ...entry,
          rank: offset + index + 1
        })),
        userRank,
        pagination: {
          offset,
          limit,
          total: leaderboard.length,
          hasMore: offset + limit < leaderboard.length,
        },
        filters: {
          type,
        },
      }
    })

  } catch (error) {
    console.error('Get leaderboard error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
