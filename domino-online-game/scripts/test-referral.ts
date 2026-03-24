
import { db } from '../lib/database';
import { referralManager } from '../lib/referral-manager';

async function runTest() {
    console.log('--- Starting Referral Test ---');

    // 1. Create two users
    const userA = await db.createUser({
        username: 'referrer_A',
        avatar: 'A',
        level: 1, xp: 0, xpToNextLevel: 1000,
        isOnline: true, isGuest: false, passwordHash: ''
    });

    const userB = await db.createUser({
        username: 'invitee_B',
        avatar: 'B',
        level: 1, xp: 0, xpToNextLevel: 1000,
        isOnline: true, isGuest: false, passwordHash: ''
    });

    console.log('Referrer Code:', userA.referralCode);

    // 2. Process Referral
    console.log('Redeeming code for User B...');
    const result = await referralManager.processReferral(userB.id, userA.referralCode);
    console.log('Referral Result:', result);

    const invA = await db.getInventory(userA.id);
    const invB = await db.getInventory(userB.id);

    console.log('User A Coins:', invA?.coins, '(Expected: 2000)');
    console.log('User B Coins:', invB?.coins, '(Expected: 2000)');

    if (invA?.coins === 2000 && invB?.coins === 2000) {
        console.log('✅ Referral bonus distribution working');
    } else {
        console.log('❌ Referral bonus distribution failed');
    }

    // 3. Lucky Tile Gift
    console.log('User A sending Lucky Tile to User B...');
    await referralManager.sendLuckyTile(userA.id, userB.id);

    const invB_final = await db.getInventory(userB.id);
    console.log('User B Final Coins:', invB_final?.coins, '(Expected: 2100)');

    if (invB_final?.coins === 2100) {
        console.log('✅ Lucky Tile gift loop working');
    } else {
        console.log('❌ Lucky Tile gift loop failed');
    }

    console.log('--- Referral Test Finished ---');
}

runTest();
