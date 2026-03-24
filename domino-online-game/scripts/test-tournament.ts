
import { db } from '../lib/database';
import { tournamentManager } from '../lib/tournament-manager';

async function runTest() {
    console.log('--- Starting Tournament Test ---');

    // 1. Create Users
    console.log('Creating 4 users...');
    const users = [];
    for (let i = 1; i <= 4; i++) {
        const user = await db.createUser({
            username: `Player${i}`,
            email: `p${i}@test.com`,
            passwordHash: 'hash',
            avatar: 'default',
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            isOnline: true,
            isGuest: false
        });
        users.push(user);
        // Give coins
        await db.updateInventory(user.id, { coins: 1000 });
    }

    // 2. Create Tournament
    console.log('Creating Tournament...');
    const tournament = await tournamentManager.createTournament({
        name: 'Test Cup',
        description: 'A test tournament',
        type: 'single_elimination',
        minPlayers: 4,
        maxPlayers: 4,
        entryFee: 100,
        prizePool: 300,
        startTime: new Date().toISOString()
    });
    console.log('Tournament Created:', tournament.id);

    // 3. Register Players
    console.log('Registering players...');
    for (const user of users) {
        const res = await tournamentManager.registerPlayer(tournament.id, user.id);
        console.log(`Registered ${user.username}: ${res.success}`);
    }

    // 4. Start Tournament
    console.log('Starting Tournament...');
    const started = await tournamentManager.startTournament(tournament.id);
    console.log('Tournament Started:', started);

    const activeTournament = await db.getTournament(tournament.id);
    if (!activeTournament) return;

    console.log(`Rounds: ${activeTournament.rounds}`);
    console.log(`Matches Generated: ${activeTournament.matches.length}`);
    console.log('Round 1 Matches:', activeTournament.matches.filter(m => m.round === 1).map(m => `${m.player1Id} vs ${m.player2Id}`));

    // 5. Simulate Round 1 Matches
    console.log('--- Simulating Round 1 ---');
    const r1Matches = activeTournament.matches.filter(m => m.round === 1);

    for (const match of r1Matches) {
        if (match.player1Id && match.player2Id) {
            console.log(`Completing match ${match.id}: Winner ${match.player1Id}`);
            await tournamentManager.advanceMatchWinner(tournament.id, match.id, match.player1Id);
        }
    }

    // 6. Verify Round 2 Generation
    const updatedTournament = await db.getTournament(tournament.id);
    const r2Matches = updatedTournament?.matches.filter(m => m.round === 2);
    console.log('Round 2 Matches:', r2Matches?.map(m => `${m.player1Id} vs ${m.player2Id}`));

    if (r2Matches && r2Matches[0].player1Id && r2Matches[0].player2Id) {
        console.log(' Round 2 populated successfully!');

        // 7. Finish Tournament
        console.log('--- Simulating Final ---');
        const finalMatch = r2Matches[0];
        console.log(`Completing Final ${finalMatch.id}: Winner ${finalMatch.player1Id}`);

        await tournamentManager.advanceMatchWinner(tournament.id, finalMatch.id, finalMatch.player1Id!);

        const finalTournament = await db.getTournament(tournament.id);
        console.log('Tournament Status:', finalTournament?.status);
        console.log('Winner:', finalTournament?.winnerId);

        if (finalTournament?.status === 'completed') {
            console.log('✅ TEST PASSED');
        } else {
            console.log('❌ TEST FAILED: Tournament not completed');
        }
    } else {
        console.log('❌ TEST FAILED: Round 2 not populated');
    }
}

runTest().catch(console.error);
