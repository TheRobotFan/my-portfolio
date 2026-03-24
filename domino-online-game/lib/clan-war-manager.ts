import { db } from './database'
import { Clan, ClanSeason, ClanWar } from './database-schema'

export class ClanWarManager {

    // 1. Add War Points (WP)
    async addWarPoints(userId: string, points: number): Promise<void> {
        const user = await db.getUserById(userId)
        if (!user) return

        // Find user's clan
        const clans = await db.getAllClans()
        const userClan = clans.find(c => c.members.some(m => m.userId === userId))

        if (!userClan) return

        // Update Clan Total WP
        await db.updateClan(userClan.id, {
            warPoints: (userClan.warPoints || 0) + points
        })

        // Update Member Weekly WP
        const memberIndex = userClan.members.findIndex(m => m.userId === userId)
        if (memberIndex !== -1) {
            userClan.members[memberIndex].weeklyWarPoints = (userClan.members[memberIndex].weeklyWarPoints || 0) + points
            // We need to update the member array in DB
            await db.updateClan(userClan.id, { members: userClan.members })
        }
    }

    // 2. Find Clan Match (Simulation)
    // In a real system, this would look for another clan queueing for war.
    // For MVP, if a clan member searches 'Ranked', we could try to match against another clan member.
    // But here we might want a specific "Clan War" matchmaking logic.
    // Let's implement a direct "Start War" logic if we need it, but for now, 
    // we focus on aggregated points from standard ranked play as per plan.

    // 3. Process Weekly Reset
    async processWeeklyReset(): Promise<void> {
        console.log('--- Processing Weekly Clan War Reset ---')

        const currentSeason = await db.getCurrentClanSeason()
        if (currentSeason) {
            // 1. End current season
            // In a real DB, we would update status. In-memory, we just mark it.
            // currentSeason.status = 'completed' // access via db update
            // await db.updateClanSeason... (if we added update method)
        }

        // 2. Distribute Rewards
        const clans = await db.getAllClans()
        const sortedClans = [...clans].sort((a, b) => (b.warPoints || 0) - (a.warPoints || 0))

        const top3 = sortedClans.slice(0, 3)
        for (let i = 0; i < top3.length; i++) {
            const clan = top3[i]
            const prize = i === 0 ? 10000 : i === 1 ? 5000 : 2500 // Clan Gems/Points

            await db.updateClan(clan.id, {
                seasonWins: (clan.seasonWins || 0) + 1,
                points: (clan.points || 0) + prize
            })

            console.log(`Clan ${clan.name} finished #${i + 1}. Reward: ${prize} points.`)
        }

        // PHASE 7 Additions (Must happen before point reset)
        await this.updateClanTerritories()
        await this.processEloDecay()

        // 3. Reset Points
        for (const clan of clans) {
            const resetMembers = clan.members.map(m => ({ ...m, weeklyWarPoints: 0 }))
            await db.updateClan(clan.id, {
                warPoints: 0,
                members: resetMembers
            })
        }

        // 4. Start New Season
        const newSeasonNumber = currentSeason ? currentSeason.number + 1 : 1
        const now = new Date()
        const nextWeek = new Date(now)
        nextWeek.setDate(nextWeek.getDate() + 7)

        await db.createClanSeason({
            number: newSeasonNumber,
            startDate: now.toISOString(),
            endDate: nextWeek.toISOString(),
            status: 'active'
        })

        console.log(`Started Season ${newSeasonNumber}`)
    }

    // 4. Update Clan Territories (Phase 7)
    async updateClanTerritories(): Promise<void> {
        console.log('--- Updating Clan Territories ---')
        const territories = await db.getTerritories()
        const clans = await db.getAllClans()

        for (const territory of territories) {
            // Find clan with most WP in this region (or overall top clans for simplicity in MVP)
            // Let's say top clan overall gets first choice or specific region
            // For now, let's assign territories to top 5 clans
            const sortedClans = [...clans].sort((a, b) => (b.warPoints || 0) - (a.warPoints || 0))

            // Simplified assignment: Region X goes to Clan Rank X
            const regions = ['Abruzzo', 'Lazio', 'Lombardia', 'Sicilia', 'Toscana']
            const regionIndex = regions.indexOf(territory.region)
            const winnerClan = sortedClans[regionIndex]

            if (winnerClan && winnerClan.warPoints >= territory.warPointsRequired) {
                await db.updateTerritory(territory.id, { ownerClanId: winnerClan.id })
                console.log(`Territory ${territory.name} captured by ${winnerClan.name}`)
            }
        }
    }

    // 5. Seasonal ELO Decay (Phase 7)
    async processEloDecay(): Promise<void> {
        console.log('--- Processing Seasonal ELO Decay ---')
        const users = await db.getAllUsers()

        for (const user of users) {
            const ranked = await db.getRankedData(user.id)
            if (!ranked) continue

            // Only decay high ranks (Master/Grandmaster represented by ELO > 2500)
            if (ranked.elo > 2000) {
                const decayAmount = Math.floor((ranked.elo - 2000) * 0.1) // 10% decay above 2000
                const newElo = Math.max(2000, ranked.elo - decayAmount)

                await db.updateRankedData(user.id, {
                    elo: newElo,
                    highestElo: Math.max(ranked.highestElo, ranked.elo) // Store legacy
                })

                console.log(`User ${user.username} ELO decayed from ${ranked.elo} to ${newElo}`)
            }
        }
    }
}

export const clanWarManager = new ClanWarManager()
