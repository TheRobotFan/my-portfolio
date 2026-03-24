import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/leaderboard - Get leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('mode') || 'elo' // 'elo' | 'wins' | 'win_rate'
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!['elo', 'wins', 'win_rate'].includes(mode)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid mode'
      }, { status: 400 })
    }

    // Get leaderboard data
    const leaderboard = await db.getLeaderboard(mode as 'elo' | 'wins' | 'win_rate', limit)
    
    // Apply offset for pagination
    const paginatedLeaderboard = leaderboard.slice(offset)

    // Get user's rank if requested
    const userId = searchParams.get('userId')
    let userRank = null
    
    if (userId) {
      const userEntry = leaderboard.find(entry => entry.userId === userId)
      if (userEntry) {
        userRank = userEntry.rank
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        leaderboard: paginatedLeaderboard,
        userRank,
        pagination: {
          offset,
          limit,
          total: leaderboard.length,
          hasMore: offset + limit < leaderboard.length,
        },
        filters: {
          mode,
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
