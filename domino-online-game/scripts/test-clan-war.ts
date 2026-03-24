
import { db } from '../lib/database';
import { clanWarManager } from '../lib/clan-war-manager';

async function runTest() {
    console.log('--- Starting Clan War Test ---');

    // 1. Create Users
    console.log('Creating users...');
    const user1 = await db.createUser({
        username: 'ClanLeader1',
        passwordHash: 'hash',
        avatar: 'default',
        level: 10,
        xp: 0,
        xpToNextLevel: 100,
        isOnline: true,
        isGuest: false
    });

    const user2 = await db.createUser({
        username: 'ClanMember1',
        passwordHash: 'hash',
        avatar: 'default',
        level: 5,
        xp: 0,
        xpToNextLevel: 100,
        isOnline: true,
        isGuest: false
    });

    // 2. Create Clan
    console.log('Creating Clan...');
    const clan = await db.createClan(user1.id, {
        name: 'Test Clan',
        tag: 'TEST',
        description: 'Testing War Points',
        logo: 'default',
        isPublic: true
    });

    await db.joinClan(clan.id, user2.id);

    console.log('Clan Created:', clan.name, 'Members:', clan.members.length);

    // 3. Simulate Ranked Wins (Add WP)
    console.log('Simulating Ranked Matches...');
    await clanWarManager.addWarPoints(user1.id, 10); // Leader wins
    await clanWarManager.addWarPoints(user2.id, 10); // Member wins
    await clanWarManager.addWarPoints(user2.id, 2);  // Member loses

    // Verify Points
    const updatedClan = await db.getClan(clan.id);
    console.log(`Clan WP: ${updatedClan?.warPoints} (Expected 22)`);

    if (updatedClan?.warPoints !== 22) {
        console.error('❌ WP Aggregation Failed');
        return;
    }

    const member2 = updatedClan.members.find(m => m.userId === user2.id);
    console.log(`Member 2 Weekly WP: ${member2?.weeklyWarPoints} (Expected 12)`);

    if (member2?.weeklyWarPoints !== 12) {
        console.error('❌ Member WP Tracking Failed');
        return;
    }

    // 4. Trigger Weekly Reset
    console.log('--- Triggering Weekly Reset ---');
    await clanWarManager.processWeeklyReset();

    const resetClan = await db.getClan(clan.id);
    console.log(`Reset Clan WP: ${resetClan?.warPoints} (Expected 0)`);
    console.log(`Reset Clan Season Wins: ${resetClan?.seasonWins} (Expected 1)`); // Since it was top 1
    console.log(`Reset Clan Points: ${resetClan?.points} (Expected 10000)`); // Prize

    const resetMember = resetClan?.members.find(m => m.userId === user2.id);
    console.log(`Reset Member WP: ${resetMember?.weeklyWarPoints} (Expected 0)`);

    if (resetClan?.warPoints === 0 && resetClan?.seasonWins === 1 && resetMember?.weeklyWarPoints === 0) {
        console.log('✅ TEST PASSED');
    } else {
        console.log('❌ TEST FAILED: Seasonal Reset incomplete');
    }
}

runTest().catch(console.error);
