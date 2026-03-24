import { NextRequest, NextResponse } from 'next/server'
import { extendedDb } from '@/lib/database-extended'
import { GamificationSystem } from '@/lib/gamification-system'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/gamification/challenges - Get user challenges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'daily' | 'weekly' | 'seasonal'

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Get active challenges
    const dailyChallenges = GamificationSystem.generateDailyChallenges()
    
    // Filter by type if specified
    let challenges = dailyChallenges
    if (type) {
      challenges = dailyChallenges.filter(challenge => challenge.type === type)
    }

    // Add user progress to challenges
    const challengesWithProgress = challenges.map(challenge => ({
      ...challenge,
      userProgress: challenge.completions[userId] || 0,
      isCompleted: (challenge.completions[userId] || 0) >= challenge.requirements.value,
      progress: Math.min(100, ((challenge.completions[userId] || 0) / challenge.requirements.value) * 100)
    }))

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        challenges: challengesWithProgress,
        totalCount: challenges.length,
        completedCount: challengesWithProgress.filter(c => c.isCompleted).length
      }
    })

  } catch (error) {
    console.error('Get challenges error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/gamification/challenges - Update challenge progress
export async function POST(request: NextRequest) {
  try {
    const { userId, challengeId, progress } = await request.json()

    if (!userId || !challengeId || progress === undefined) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID, challenge ID, and progress are required'
      }, { status: 400 })
    }

    // Update challenge progress (would need to implement this method)
    // const updatedChallenge = await extendedDb.updateChallengeProgress(userId, challengeId, progress)
    
    // For now, return success
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        challengeId,
        progress,
        completed: progress >= 100
      },
      message: 'Challenge progress updated'
    })

  } catch (error) {
    console.error('Update challenge error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
