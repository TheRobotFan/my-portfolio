import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/user/stats - Get user statistics
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

    // Get user stats and related data
    const [stats, ranked, gameHistory] = await Promise.all([
      db.getUserStats(userId),
      db.getRankedData(userId),
      db.getUserGameHistory(userId, 50),
    ])

    if (!stats) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User stats not found'
      }, { status: 404 })
    }

    // Calculate additional statistics
    const totalGames = stats.wins + stats.losses
    const winRate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0
    const avgPointsPerGame = totalGames > 0 ? stats.totalPoints / totalGames : 0

    // Recent performance (last 10 games)
    const recentGames = gameHistory.slice(0, 10)
    const recentWins = recentGames.filter(g => g.result === 'win').length
    const recentWinRate = recentGames.length > 0 ? (recentWins / recentGames.length) * 100 : 0

    // Best streak (already in stats)
    const currentStreak = stats.streak

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        ...stats,
        totalGames,
        winRate: Math.round(winRate * 100) / 100,
        avgPointsPerGame: Math.round(avgPointsPerGame * 100) / 100,
        recentWinRate: Math.round(recentWinRate * 100) / 100,
        currentStreak,
        ranked,
        recentGames: recentGames.slice(0, 5), // Last 5 games
      }
    })

  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/user/stats - Update user statistics (after game)
export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      gameResult, // 'win' | 'loss' | 'draw'
      mode, // 'single' | 'multiplayer' | 'ranked' | 'private'
      opponentElo,
      pointsEarned,
      duration,
      gameId 
    } = await request.json()

    if (!userId || !gameResult || !mode || !gameId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Get current stats
    const stats = await db.getUserStats(userId)
    const ranked = await db.getRankedData(userId)
    
    if (!stats || !ranked) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User stats not found'
      }, { status: 404 })
    }

    // Update basic stats
    const won = gameResult === 'win'
    const newStreak = won ? stats.streak + 1 : 0
    const newHighestStreak = Math.max(newStreak, stats.highestStreak)
    
    const updatedStats = {
      wins: stats.wins + (won ? 1 : 0),
      losses: stats.losses + (won ? 0 : 1),
      streak: newStreak,
      highestStreak: newHighestStreak,
      gamesPlayed: stats.gamesPlayed + 1,
      totalPoints: stats.totalPoints + (pointsEarned || 0),
      avgGameDuration: ((stats.avgGameDuration * stats.gamesPlayed) + (duration || 0)) / (stats.gamesPlayed + 1),
    }

    // Update ranked data if it's a ranked match
    let updatedRanked = ranked
    if (mode === 'ranked' && opponentElo) {
      // Calculate ELO change
      const K = 32
      const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - ranked.elo) / 400))
      const actualScore = won ? 1 : 0
      const eloChange = Math.round(K * (actualScore - expectedScore))
      
      const newElo = Math.max(0, ranked.elo + eloChange)
      const newHighestElo = Math.max(ranked.highestElo, newElo)
      
      // Calculate new rank and tier
      const getRankFromElo = (elo: number) => {
        if (elo >= 2400) return { rank: 'grandmaster' as const, tier: 1 as const }
        if (elo >= 2200) return { rank: 'master' as const, tier: elo >= 2300 ? 1 as const : elo >= 2250 ? 2 as const : 3 as const }
        if (elo >= 1900) return { rank: 'diamond' as const, tier: elo >= 2100 ? 1 as const : elo >= 2000 ? 2 as const : 3 as const }
        if (elo >= 1600) return { rank: 'platinum' as const, tier: elo >= 1800 ? 1 as const : elo >= 1700 ? 2 as const : 3 as const }
        if (elo >= 1300) return { rank: 'gold' as const, tier: elo >= 1500 ? 1 as const : elo >= 1400 ? 2 as const : 3 as const }
        if (elo >= 1000) return { rank: 'silver' as const, tier: elo >= 1200 ? 1 as const : elo >= 1100 ? 2 as const : 3 as const }
        return { rank: 'bronze' as const, tier: elo >= 900 ? 1 as const : elo >= 800 ? 2 as const : 3 as const }
      }
      
      const { rank, tier } = getRankFromElo(newElo)
      
      updatedRanked = {
        ...ranked,
        elo: newElo,
        highestElo: newHighestElo,
        rank,
        tier,
        wins: ranked.wins + (won ? 1 : 0),
        losses: ranked.losses + (won ? 0 : 1),
        winStreak: won ? ranked.winStreak + 1 : 0,
        seasonWins: ranked.seasonWins + (won ? 1 : 0),
        seasonLosses: ranked.seasonLosses + (won ? 0 : 1),
        lastMatchAt: new Date().toISOString(),
      }
    }

    // Add to game history
    await db.addGameHistory({
      userId,
      gameId,
      mode,
      result: gameResult,
      eloChange: mode === 'ranked' && opponentElo ? updatedRanked.elo - ranked.elo : undefined,
      coinsEarned: won ? (mode === 'ranked' ? 50 : 25) : (mode === 'ranked' ? 10 : 5),
      xpEarned: won ? (mode === 'ranked' ? 100 : 50) : (mode === 'ranked' ? 25 : 15),
      duration: duration || 0,
    })

    // Update database
    await Promise.all([
      db.updateUserStats(userId, updatedStats),
      db.updateRankedData(userId, updatedRanked),
    ])

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        stats: updatedStats,
        ranked: updatedRanked,
        eloChange: mode === 'ranked' && opponentElo ? updatedRanked.elo - ranked.elo : undefined,
      },
      message: 'Statistics updated successfully'
    })

  } catch (error) {
    console.error('Update stats error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
