import { NextRequest, NextResponse } from 'next/server'
import { extendedDb } from '@/lib/database-extended'
import { ApiResponse } from '@/lib/database-schema'

// GET /api/gamification/rewards - Get user rewards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // 'xp' | 'coins' | 'gems' | 'badge' | 'achievement'
    const claimed = searchParams.get('claimed') // 'true' | 'false'

    if (!userId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Get user rewards (would need to implement this method in ExtendedDatabase)
    const rewards: any[] = [] // await extendedDb.getUserRewards(userId)
    
    // Filter by type if specified
    let filteredRewards = rewards
    if (type) {
      filteredRewards = rewards.filter(reward => reward.type === type)
    }
    
    // Filter by claimed status if specified
    if (claimed !== undefined) {
      const isClaimed = claimed === 'true'
      filteredRewards = filteredRewards.filter(reward => reward.isClaimed === isClaimed)
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        rewards: filteredRewards,
        totalCount: rewards.length,
        unclaimedCount: rewards.filter(r => !r.isClaimed).length
      }
    })

  } catch (error) {
    console.error('Get rewards error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/gamification/rewards - Claim reward
export async function POST(request: NextRequest) {
  try {
    const { userId, rewardId } = await request.json()

    if (!userId || !rewardId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'User ID and reward ID are required'
      }, { status: 400 })
    }

    // Claim reward (would need to implement this method)
    // const claimedReward = await extendedDb.claimReward(userId, rewardId)
    
    // For now, return success
    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        rewardId,
        claimed: true
      },
      message: 'Reward claimed successfully'
    })

  } catch (error) {
    console.error('Claim reward error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
