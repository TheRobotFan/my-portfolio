import { GameSession, PlayedTile } from './database-schema'

interface SuspicionReport {
    players: [string, string]
    score: number
    reasons: string[]
}

export class AntiCheatService {

    /**
     * Analyzes a finished game session for potential teaming/collusion.
     * Focuses on player pairs and their interaction patterns.
     */
    async analyzeTeaming(game: GameSession): Promise<SuspicionReport[]> {
        const reports: SuspicionReport[] = []
        const players = game.players.map(p => p.userId)

        if (players.length < 3) return [] // Teaming usually requires 3+ players (FFA)

        // Analyze every unique pair
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                const p1 = players[i]
                const p2 = players[j]

                const report = await this.analyzePair(game, p1, p2)
                if (report.score > 50) {
                    reports.push(report)
                }
            }
        }

        return reports
    }

    private async analyzePair(game: GameSession, p1: string, p2: string): Promise<SuspicionReport> {
        let score = 0
        const reasons: string[] = []

        // Heuristic 1: Win/Loss Sharing
        const p1Score = game.scores[p1] || 0
        const p2Score = game.scores[p2] || 0
        const winner = game.winner

        if (winner === p1 && p2Score < 20 && game.status === 'finished') {
            score += 60 // High suspicion if one player won and the other barely played
            reasons.push(`Player 2 finished with suspiciously low score (${p2Score}) while Player 1 won`)
        }

        return {
            players: [p1, p2],
            score,
            reasons
        }
    }

    /**
     * Checks if player passed while having a valid move (Intentional Pass)
     */
    checkPassSuspicion(userId: string, hand: any[], boardEnds: { left: number, right: number }): { isSuspicious: boolean, reason?: string } {
        const hasMove = hand.some(t =>
            t.left === boardEnds.left || t.right === boardEnds.left ||
            t.left === boardEnds.right || t.right === boardEnds.right
        )

        if (hasMove) {
            return { isSuspicious: true, reason: `Player ${userId} passed turn while holding playable tiles.` }
        }

        return { isSuspicious: false }
    }
}

export const antiCheatService = new AntiCheatService()
