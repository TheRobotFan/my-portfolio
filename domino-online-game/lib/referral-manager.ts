import { db } from './database'
import { Referral, ReferralReward } from './database-schema'

export class ReferralManager {
    private readonly REFERRAL_BONUS = 1500 // Coins

    async generateInviteLink(userId: string): Promise<string> {
        const user = await db.getUserById(userId)
        if (!user) return ""
        // In a real app, this would be a deep link URL
        return `https://domino-elite.game/invite?code=${user.referralCode}`
    }

    async processReferral(inviteeId: string, referralCode: string): Promise<{ success: boolean; message: string }> {
        const codesMap = await db.getReferralCodes()
        const referrerId = codesMap.get(referralCode)

        if (!referrerId) return { success: false, message: "Invalid referral code" }
        if (referrerId === inviteeId) return { success: false, message: "Cannot refer yourself" }

        const existingRef = await db.getReferralByInvitee(inviteeId)
        if (existingRef) return { success: false, message: "Already referred" }

        // Create referral record
        await db.createReferral({
            referrerId,
            inviteeId,
            status: 'completed',
            rewardClaimed: true
        })

        // Update invitee
        await db.updateUser(inviteeId, { referredBy: referrerId })

        // Reward both players
        await this.grantReward(referrerId, 'referral_bonus', this.REFERRAL_BONUS)
        await this.grantReward(inviteeId, 'referral_bonus', this.REFERRAL_BONUS)

        return { success: true, message: "Referral processed successfully" }
    }

    async sendLuckyTile(senderId: string, receiverId: string): Promise<{ success: boolean; message: string }> {
        const sender = await db.getUserById(senderId)
        if (!sender) return { success: false, message: "Sender not found" }

        // Logic: Sender gives a small reward without losing anything (viral loop)
        // Limited to once per day per friend in a real app
        await this.grantReward(receiverId, 'lucky_tile', 100, senderId)

        return { success: true, message: "Lucky Tile sent!" }
    }

    private async grantReward(userId: string, type: 'referral_bonus' | 'lucky_tile', amount: number, senderId?: string): Promise<void> {
        await db.createReferralReward({
            userId,
            type,
            amount,
            claimed: false,
            senderId
        })

        // Auto-claim reward for MVP
        const inventory = await db.getInventory(userId)
        if (inventory) {
            await db.updateInventory(userId, { coins: inventory.coins + amount })
            // Mark as claimed would be updated here if we have a way to update rewards
        }
    }

    async getReferralStats(userId: string): Promise<{ inviteCount: number; rewardsEarned: number }> {
        const rewards = await db.getUserReferralRewards(userId)
        const referralBonus = rewards.filter(r => r.type === 'referral_bonus')

        return {
            inviteCount: referralBonus.length,
            rewardsEarned: rewards.reduce((sum, r) => sum + r.amount, 0)
        }
    }
}

export const referralManager = new ReferralManager()
