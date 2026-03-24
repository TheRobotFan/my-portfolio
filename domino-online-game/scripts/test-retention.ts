
import { db } from '../lib/database';
import { clanWarManager } from '../lib/clan-war-manager';

async function runTest() {
    console.log('--- Starting Retention & Global Ops Test ---');

    // 1. Setup high ELO user
    const user = await db.createUser({
        username: 'ProPlayer',
        passwordHash: 'hash',
        avatar: 'default',
        level: 50, xp: 0, xpToNextLevel: 1000,
        isOnline: true, isGuest: false
    });

    await db.updateRankedData(user.id, { elo: 2500 }); // High rank
    console.log('User created with ELO: 2500');

    // 2. Setup Clan and WP for Territory
    const clan = await db.createClan(user.id, {
        name: 'Alpha Clan',
        tag: 'ALPHA',
        description: 'Elite players',
        logo: 'default',
        isPublic: true
    });

    // Give enough WP to capture territory (Abruzzo requires 5000)
    await db.updateClan(clan.id, { warPoints: 6000 });
    console.log('Clan created with 6000 WP');

    // 3. Trigger Reset
    console.log('\n--- Triggering Seasonal Reset Logic ---');
    await clanWarManager.processWeeklyReset();

    // 4. Verify ELO Decay
    const updatedRanked = await db.getRankedData(user.id);
    console.log(`New ELO: ${updatedRanked?.elo} (Expected ~2450)`);
    if (updatedRanked && updatedRanked.elo < 2500 && updatedRanked.elo >= 2440) {
        console.log('✅ ELO Decay working');
    } else {
        console.log('❌ ELO Decay failed or calculation wrong');
    }

    // 5. Verify Territory Capture
    const territories = await db.getTerritories();
    const abruzzo = territories.find(t => t.region === 'Abruzzo');
    console.log(`Abruzzo Owner: ${abruzzo?.ownerClanId} (Expected ${clan.id})`);

    if (abruzzo?.ownerClanId === clan.id) {
        console.log('✅ Territory Capture working');
    } else {
        console.log('❌ Territory Capture failed');
    }

    console.log('\n--- Retention Test Finished ---');
}

runTest();
