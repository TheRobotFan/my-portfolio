
import { db } from '../lib/database';
import { battlePassManager } from '../lib/battle-pass-manager';

async function runTest() {
    console.log('--- Starting Battle Pass Test ---');

    // 1. Initialize BP
    await battlePassManager.initializeDefaultBP();
    const activeBP = await db.getActiveBattlePass();
    console.log('Active Battle Pass:', activeBP?.name);

    // 2. Create User
    const user = await db.createUser({
        username: 'test_player',
        email: 'test@example.com',
        passwordHash: 'hash',
        avatar: 'A',
        level: 1,
        xp: 0,
        xpToNextLevel: 1000,
        isOnline: true,
        isGuest: false
    });
    console.log('User created:', user.id);

    // 3. Add XP and Level Up
    console.log('Adding 2500 XP...');
    const result = await battlePassManager.addXP(user.id, 2500);
    console.log('XP added. New Level:', result.newLevel, 'Level Up:', result.levelUp);

    const userBP = await db.getUserBattlePass(user.id, activeBP!.id);
    console.log('User BP State:', { xp: userBP?.xp, level: userBP?.level });

    // 4. Claim Reward
    console.log('Claiming level 1 free reward (nothing assigned)...');
    const claim1 = await battlePassManager.claimReward(user.id, 1, false);
    console.log('Claim 1 result:', claim1);

    console.log('Claiming level 5 free reward (should be 500 coins)...');
    // Need to reach level 5 first
    await battlePassManager.addXP(user.id, 2500); // Now level 5 (5000 XP total)
    const claim5 = await battlePassManager.claimReward(user.id, 5, false);
    console.log('Claim 5 result:', claim5);

    const inventory = await db.getInventory(user.id);
    console.log('Inventory coins:', inventory?.coins);

    if (inventory?.coins === 1000) { // 500 initial + 500 reward
        console.log('✅ Battle Pass reward distribution working');
    } else {
        console.log('❌ Battle Pass reward distribution failed');
    }

    console.log('--- Battle Pass Test Finished ---');
}

runTest();
