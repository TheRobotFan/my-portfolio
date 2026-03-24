
import { useGameStore, DominoTile, GameState } from '../lib/game-store';

// Mock localStorage for Zustand persist
const localStorageMock = {
    getItem: () => null,
    setItem: () => { },
    removeItem: () => { },
};
global.localStorage = localStorageMock as any;

async function testAI() {
    console.log("Starting AI Test...");

    const store = useGameStore.getState();

    // Setup Helper
    const setupGame = (hand: DominoTile[], boardEnds: { left: number, right: number }) => {
        useGameStore.setState({
            game: {
                ...store.game,
                players: [
                    { id: 'human', name: 'Human', hand: [], score: 0, isAI: false },
                    { id: 'ai', name: 'AI', hand: hand, score: 0, isAI: true }
                ],
                boardEnds,
                board: boardEnds.left === -1 ? [] : [{ tile: { id: 'start', left: 1, right: 1, owner: 'x', isDouble: true, isPlayed: true }, position: 0, side: 'left', owner: 'x' }] // Dummy board
            } as GameState
        });
    };

    // TEST 1: Priority to Doubles
    console.log("\nTEST 1: Priority to Doubles");
    const hand1: DominoTile[] = [
        { id: 't1', left: 6, right: 6, owner: 'ai', isDouble: true, isPlayed: false }, // Double 6 (Expect this)
        { id: 't2', left: 6, right: 1, owner: 'ai', isDouble: false, isPlayed: false } // 6-1
    ];
    setupGame(hand1, { left: 6, right: 2 });

    const move1 = store.getAIMove();
    if (move1?.tileId === 't1') {
        console.log("✅ PASS: AI chose Double 6-6");
    } else {
        console.log("❌ FAIL: AI chose " + move1?.tileId);
        console.log("Expected t1 (6-6).");
    }


    // TEST 2: Play Heavy Tiles (High Pips)
    console.log("\nTEST 2: Play Heavy Tiles");
    const hand2: DominoTile[] = [
        { id: 't1', left: 5, right: 4, owner: 'ai', isDouble: false, isPlayed: false }, // 9 points (Expect this)
        { id: 't2', left: 5, right: 0, owner: 'ai', isDouble: false, isPlayed: false }  // 5 points
    ];
    setupGame(hand2, { left: 5, right: 2 });

    const move2 = store.getAIMove();
    if (move2?.tileId === 't1') {
        console.log("✅ PASS: AI chose Heavy Tile 5-4");
    } else {
        console.log("❌ FAIL: AI chose " + move2?.tileId);
    }

    // TEST 3: Smart Move (Diversity)
    // AI has [4-4], [4-1], [4-2]
    // Board requests 4.
    // If AI plays 4-4 (Double), it leaves [4-1, 4-2] -> still has 4s.
    // Actually Double is priority 1, so it should play 4-4.

    // Let's try [4-1] vs [4-0] where 1 is rare in hand?
    // Diversity check:
    // Hand: [6-5], [6-1]
    // Board: 6 or 2
    // Playing 6-5 leaves [6-1] (ends: 6 and 1)
    // Playing 6-1 leaves [6-5] (ends: 6 and 5)
    // If we have another 5 in hand, maybe keeping 5 is better?
    // Let's stick to the basic tests for now as Diversity is a tie-breaker after Doubles and Score.
}

testAI();
