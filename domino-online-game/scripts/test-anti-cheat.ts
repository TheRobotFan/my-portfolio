
import { antiCheatService } from '../lib/anti-cheat';

function runTest() {
    console.log('--- Starting Anti-Cheat Test ---');

    // Test 1: Intentional Pass Detection
    console.log('Test 1: Intentional Pass');
    const hand = [
        { id: '1-1', left: 1, right: 1, isDouble: true },
        { id: '2-2', left: 2, right: 2, isDouble: true }
    ];
    const boardEnds = { left: 1, right: 6 };

    const passSuspicion = antiCheatService.checkPassSuspicion('user_teamer', hand, boardEnds);
    console.log('Pass Suspicion result:', passSuspicion);

    if (passSuspicion.isSuspicious) {
        console.log('✅ Intentional Pass Detected correctly');
    } else {
        console.log('❌ Failed to detect intentional pass');
    }

    // Test 2: Teaming Pattern (Win/Loss Correlation)
    console.log('\nTest 2: Teaming Analysis');
    const mockGame: any = {
        players: [
            { userId: 'player_A' },
            { userId: 'player_B' },
            { userId: 'player_C' }
        ],
        board: [],
        scores: {
            'player_A': 150, // Winner
            'player_B': 5,   // Suspiciously low
            'player_C': 40
        },
        winner: 'player_A',
        status: 'finished'
    };

    antiCheatService.analyzeTeaming(mockGame).then(reports => {
        console.log('Teaming Reports:', reports);
        if (reports.length > 0 && reports[0].score > 50) {
            console.log('✅ Teaming pattern based on score correlation detected');
        } else {
            console.log('❌ Failed to detect teaming pattern');
        }

        console.log('\n--- Anti-Cheat Test Finished ---');
    });
}

runTest();
