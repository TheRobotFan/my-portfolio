import { db } from './database'
import { UserBattlePass, BattlePass, BattlePassTier, BattlePassReward } from './database-schema'

export class BattlePassManager {
    private readonly BP_XP_PER_LEVEL = 1000

    async ensureUserBP(userId: string): Promise<UserBattlePass | null> {
        const activeBP = await db.getActiveBattlePass()
        if (!activeBP) return null

        let userBP = await db.getUserBattlePass(userId, activeBP.id)
        if (!userBP) {
            userBP = await db.createUserBattlePass({
                userId,
                bpId: activeBP.id,
                xp: 0,
                level: 1,
                isPremium: false,
                isElite: false,
                claimedFreeTiers: [],
                claimedPremiumTiers: []
            })
        }
        return userBP
    }

    async addXP(userId: string, amount: number): Promise<{ levelUp: boolean; newLevel: number }> {
        const userBP = await this.ensureUserBP(userId)
        if (!userBP) return { levelUp: false, newLevel: 0 }

        const activeBP = await db.getActiveBattlePass()
        if (!activeBP) return { levelUp: false, newLevel: userBP.level }

        const newXP = userBP.xp + amount
        let newLevel = userBP.level
        let levelUp = false

        // Calculate level based on XP
        // For simplicity, each level is 1000 XP
        const calculatedLevel = Math.floor(newXP / this.BP_XP_PER_LEVEL) + 1
        const finalLevel = Math.min(calculatedLevel, activeBP.tiers.length)

        if (finalLevel > userBP.level) {
            levelUp = true
            newLevel = finalLevel
        }

        await db.updateUserBattlePass(userId, activeBP.id, {
            xp: newXP,
            level: newLevel
        })

        return { levelUp, newLevel }
    }

    async claimReward(userId: string, level: number, isPremium: boolean): Promise<{ success: boolean; message: string }> {
        const activeBP = await db.getActiveBattlePass()
        if (!activeBP) return { success: false, message: "No active Battle Pass" }

        const userBP = await db.getUserBattlePass(userId, activeBP.id)
        if (!userBP) return { success: false, message: "User Battle Pass not found" }

        if (userBP.level < level) return { success: false, message: "Level not reached" }

        if (isPremium && !userBP.isPremium) return { success: false, message: "Premium track not active" }

        const tier = activeBP.tiers.find(t => t.level === level)
        if (!tier) return { success: false, message: "Tier not found" }

        const alreadyClaimed = isPremium
            ? userBP.claimedPremiumTiers.includes(level)
            : userBP.claimedFreeTiers.includes(level)

        if (alreadyClaimed) return { success: false, message: "Reward already claimed" }

        const reward = isPremium ? tier.premiumReward : tier.freeReward
        if (!reward) return { success: false, message: "No reward for this tier" }

        // Process reward
        await this.processReward(userId, reward)

        // Update claimed tiers
        if (isPremium) {
            userBP.claimedPremiumTiers.push(level)
            await db.updateUserBattlePass(userId, activeBP.id, { claimedPremiumTiers: userBP.claimedPremiumTiers })
        } else {
            userBP.claimedFreeTiers.push(level)
            await db.updateUserBattlePass(userId, activeBP.id, { claimedFreeTiers: userBP.claimedFreeTiers })
        }

        return { success: true, message: "Reward claimed successfully" }
    }

    private async processReward(userId: string, reward: BattlePassReward): Promise<void> {
        const inventory = await db.getInventory(userId)
        if (!inventory) return

        switch (reward.type) {
            case 'coins':
                await db.updateInventory(userId, { coins: inventory.coins + (reward.amount || 0) })
                break
            case 'gems':
                await db.updateInventory(userId, { gems: inventory.gems + (reward.amount || 0) })
                break
            case 'tile_skin':
                if (reward.itemId && !inventory.tileSkins.includes(reward.itemId)) {
                    inventory.tileSkins.push(reward.itemId)
                    await db.updateInventory(userId, { tileSkins: inventory.tileSkins })
                }
                break
            case 'avatar_skin':
                if (reward.itemId && !inventory.avatarSkins.includes(reward.itemId)) {
                    inventory.avatarSkins.push(reward.itemId)
                    await db.updateInventory(userId, { avatarSkins: inventory.avatarSkins })
                }
                break
            // ... handle other rewards
        }
    }

    async upgradePremium(userId: string, isElite: boolean = false): Promise<void> {
        const activeBP = await db.getActiveBattlePass()
        if (!activeBP) return

        await db.updateUserBattlePass(userId, activeBP.id, {
            isPremium: true,
            isElite: isElite
        })

        if (isElite) {
            // Instantly grant 10 levels for elite
            await this.addXP(userId, 10000)
        }
    }

    /**
     * Initialize a default Battle Pass for testing
     */
    async initializeDefaultBP(): Promise<void> {
        const active = await db.getActiveBattlePass()
        if (active) return

        const tiers: BattlePassTier[] = []
        for (let i = 1; i <= 100; i++) {
            tiers.push({
                level: i,
                requiredXP: 1000,
                freeReward: i % 5 === 0 ? { type: 'coins', amount: 500 } : undefined,
                premiumReward: { type: 'coins', amount: 1000 }
            })
        }

        await db.createBattlePass({
            season: 1,
            name: "Genesis Season",
            isActive: true,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            tiers
        })
    }
}

export const battlePassManager = new BattlePassManager()
