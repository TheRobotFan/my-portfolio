import { db } from './database'
import { Tournament, TournamentMatch, TournamentParticipant } from './database-schema'

export class TournamentManager {

    // 1. Create a new tournament
    async createTournament(config: {
        name: string
        description: string
        type: 'single_elimination' | 'swiss'
        minPlayers: number
        maxPlayers: number
        entryFee: number
        prizePool: number
        startTime: string
    }): Promise<Tournament> {
        return await db.createTournament({
            ...config,
            status: 'registration',
            rounds: Math.ceil(Math.log2(config.maxPlayers)), // e.g., 8 players -> 3 rounds
        })
    }

    // 2. Register a player logic
    async registerPlayer(tournamentId: string, userId: string): Promise<{ success: boolean; message: string }> {
        const tournament = await db.getTournament(tournamentId)
        if (!tournament) return { success: false, message: 'Tournament not found' }

        if (tournament.status !== 'registration') {
            return { success: false, message: 'Registration is closed' }
        }

        if (tournament.participants.length >= tournament.maxPlayers) {
            return { success: false, message: 'Tournament is full' }
        }

        if (tournament.participants.some(p => p.userId === userId)) {
            return { success: false, message: 'Already registered' }
        }

        // Verify user has enough coins (if entry fee > 0)
        const user = await db.getUserById(userId)
        const inventory = await db.getInventory(userId)

        if (!user || !inventory) return { success: false, message: 'User data not found' }

        if (inventory.coins < tournament.entryFee) {
            return { success: false, message: 'Insufficient funds' }
        }

        // Deduct fee and register
        if (tournament.entryFee > 0) {
            await db.updateInventory(userId, { coins: inventory.coins - tournament.entryFee })
            await db.createTransaction({
                userId,
                type: 'purchase',
                amount: -tournament.entryFee,
                currency: 'coins',
                description: `Entry fee for tournament: ${tournament.name}`
            })
        }

        const participant: TournamentParticipant = {
            userId: user.id,
            username: user.username,
            avatar: user.avatar,
            level: user.level,
            seed: 0, // Assigned later
            status: 'active',
            joinedAt: new Date().toISOString()
        }

        tournament.participants.push(participant)
        await db.updateTournament(tournament.id, { participants: tournament.participants })

        return { success: true, message: 'Registered successfully' }
    }

    // 3. Start Tournament & Generate Bracket (Single Elimination)
    async startTournament(tournamentId: string): Promise<boolean> {
        const tournament = await db.getTournament(tournamentId)
        if (!tournament || tournament.status !== 'registration') return false

        if (tournament.participants.length < tournament.minPlayers) return false

        // Seeding logic (Random for now, could be ELO based)
        const shuffled = [...tournament.participants].sort(() => 0.5 - Math.random())
        shuffled.forEach((p, i) => p.seed = i + 1)

        // Calculate rounds needed based on actual participant count
        const totalRounds = Math.ceil(Math.log2(tournament.participants.length))
        const totalSlots = Math.pow(2, totalRounds)
        const byes = totalSlots - tournament.participants.length

        const matches: TournamentMatch[] = []

        // Round 1 Generation
        // In a perfect power of 2 (e.g., 8), 1 plays 8, 2 plays 7, etc.
        // With byes, top seeds get byes.

        // Simple pairing strategy: 
        // Take top (totalSlots/2) match-ups. 
        // If a slot is empty (bye), the player automatically advances.

        let matchCount = 1
        // We simulate the full bracket slots
        const round1MatchesNeeded = totalSlots / 2

        for (let i = 0; i < round1MatchesNeeded; i++) {
            // Correct seeding pairing for power of 2 bracket:
            // Match 1: Seed 1 vs Seed N
            // Match 2: Seed 2 vs Seed N-1 ... etc (simplified here for MVP)

            // Simplified: Just take p[i] and p[N-1-i] from the shuffled array? 
            // No, standard bracket is Top vs Bottom.

            // Let's us a simplified approach: Array is already shuffled/seeded.
            // We fill the slots. If index >= participants.length, it's a "Bye" (phantom player)

            const player1Index = i
            const player2Index = totalSlots - 1 - i // Mirror index

            const player1 = player1Index < tournament.participants.length ? shuffled[player1Index] : null
            const player2 = player2Index < tournament.participants.length ? shuffled[player2Index] : null

            const matchId = `match_${tournament.id}_R1_${matchCount}`

            const match: TournamentMatch = {
                id: matchId,
                tournamentId: tournament.id,
                round: 1,
                matchNumber: matchCount,
                player1Id: player1?.userId,
                player2Id: player2?.userId,
                status: 'scheduled'
            }

            // Handle Byes immediately
            if (player1 && !player2) {
                match.status = 'completed'
                match.winnerId = player1.userId
                // Logic to propagate winner to next round would happen here or in a separate step
                // For MVP, we just mark it complete. 
                // In a real system, we pre-generate empty matches for future rounds.
            } else if (!player1 && player2) {
                // Should not happen with our top-down filling but handling edge case
                match.status = 'completed'
                match.winnerId = player2.userId
            } else if (!player1 && !player2) {
                match.status = 'cancelled' // Empty slot vs Empty slot
            }

            matches.push(match)
            matchCount++
        }

        // Pre-generate future round slots (empty matches) so we can link them?
        // A standard array-based heap is easier. Parent of match K is K/2.
        // But let's stick to generating Round 1 and creating next round matches dynamically 
        // or generating the whole tree now. Generating whole tree is safer.

        // Let's generate subsequent rounds placeholder matches
        let currentRoundMatches = round1MatchesNeeded
        let round = 2
        while (round <= totalRounds) {
            const matchesInRound = currentRoundMatches / 2
            for (let j = 1; j <= matchesInRound; j++) {
                matches.push({
                    id: `match_${tournament.id}_R${round}_${j}`,
                    tournamentId: tournament.id,
                    round: round,
                    matchNumber: j,
                    status: 'scheduled'
                })
            }
            currentRoundMatches = matchesInRound
            round++
        }

        // Propagate Round 1 winners (Byes) to Round 2
        // We need a helper to find the "Next Match" for a given match.
        // Formula: Match M in Round R feeds into Match ceil(M/2) in Round R+1.
        // If M is odd, it's player 1 position. If M is even, it's player 2 position.

        for (const match of matches) {
            if (match.round === 1 && match.status === 'completed' && match.winnerId) {
                await this._advanceToNextRound(match, matches)
            }
        }

        await db.updateTournament(tournamentId, {
            status: 'active',
            rounds: totalRounds,
            currentRound: 1,
            matches: matches,
            participants: tournament.participants // seed updated
        })

        return true
    }

    // 4. Advance Logic
    async advanceMatchWinner(tournamentId: string, matchId: string, winnerId: string): Promise<void> {
        const tournament = await db.getTournament(tournamentId)
        if (!tournament) return

        const matchIndex = tournament.matches.findIndex(m => m.id === matchId)
        if (matchIndex === -1) return

        const match = tournament.matches[matchIndex]

        // Update current match
        match.status = 'completed'
        match.winnerId = winnerId
        match.endTime = new Date().toISOString()

        // Eliminate loser
        const loserId = match.player1Id === winnerId ? match.player2Id : match.player1Id
        if (loserId) {
            const pIndex = tournament.participants.findIndex(p => p.userId === loserId)
            if (pIndex !== -1) tournament.participants[pIndex].status = 'eliminated'
        }

        // Check if tournament is over (Final Round)
        if (match.round === tournament.rounds) {
            tournament.status = 'completed'
            tournament.winnerId = winnerId

            const pIndex = tournament.participants.findIndex(p => p.userId === winnerId)
            if (pIndex !== -1) tournament.participants[pIndex].status = 'winner'

            // Distribute Prize
            await this._distributePrize(winnerId, tournament.prizePool, tournament.name)
        } else {
            // Advance to next round
            await this._advanceToNextRound(match, tournament.matches)
        }

        await db.updateTournament(tournamentId, {
            matches: tournament.matches,
            participants: tournament.participants,
            status: tournament.status,
            winnerId: tournament.winnerId
        })
    }

    private async _advanceToNextRound(finishedMatch: TournamentMatch, allMatches: TournamentMatch[]) {
        const nextRound = finishedMatch.round + 1
        const nextMatchNum = Math.ceil(finishedMatch.matchNumber / 2)

        const nextMatch = allMatches.find(m => m.round === nextRound && m.matchNumber === nextMatchNum)
        if (!nextMatch) return

        // If matchNumber is odd, go to player1 slot. If even, player2 slot.
        const isPlayer1Slot = finishedMatch.matchNumber % 2 !== 0

        if (isPlayer1Slot) {
            nextMatch.player1Id = finishedMatch.winnerId
        } else {
            nextMatch.player2Id = finishedMatch.winnerId
        }

        // If Next Match is now full (has both players), we can mark it as 'ready' (scheduled)
        // (It's already 'scheduled' by default, but we could trigger notifications here)
    }

    private async _distributePrize(userId: string, amount: number, tournamentName: string) {
        if (amount <= 0) return

        const inventory = await db.getInventory(userId)
        if (inventory) {
            await db.updateInventory(userId, { coins: inventory.coins + amount })
            await db.createTransaction({
                userId,
                type: 'reward',
                amount: amount,
                currency: 'coins',
                description: `Winner of ${tournamentName}!`
            })
        }
    }
}

export const tournamentManager = new TournamentManager()
