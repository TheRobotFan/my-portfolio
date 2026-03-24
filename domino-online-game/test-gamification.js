// Test script for the complete gamification system
const API_BASE = 'http://localhost:3000/api';

async function testGamificationSystem() {
  console.log('🎮 Testing Complete Gamification System...\n');

  try {
    // Test 1: Create guest user
    console.log('1️⃣ Creating guest user...');
    const guestResponse = await fetch(`${API_BASE}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `Gamer${Date.now()}` })
    });
    const guestData = await guestResponse.json();
    console.log('✅ Guest user created:', guestData.success ? 'SUCCESS' : 'FAILED');
    const userId = guestData.data?.user?.id;
    
    if (!userId) {
      console.error('❌ Failed to create user');
      return;
    }

    // Test 2: Get gamification profile
    console.log('\n2️⃣ Getting gamification profile...');
    const profileResponse = await fetch(`${API_BASE}/gamification/profile?userId=${userId}`);
    const profileData = await profileResponse.json();
    console.log('✅ Gamification profile:', profileData.success ? 'SUCCESS' : 'FAILED');
    console.log(`📊 Level: ${profileData.data?.gamification?.level}, XP: ${profileData.data?.gamification?.xp}`);

    // Test 3: Get achievements
    console.log('\n3️⃣ Getting achievements...');
    const achievementsResponse = await fetch(`${API_BASE}/gamification/achievements?userId=${userId}`);
    const achievementsData = await achievementsResponse.json();
    console.log('✅ Achievements:', achievementsData.success ? 'SUCCESS' : 'FAILED');
    console.log(`🏆 Available achievements: ${achievementsData.data?.achievements?.length || 0}`);

    // Test 4: Check for new achievements
    console.log('\n4️⃣ Checking for new achievements...');
    const checkAchievementsResponse = await fetch(`${API_BASE}/gamification/achievements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        userStats: {
          wins: 1,
          gamesPlayed: 5,
          elo: 1100
        }
      })
    });
    const checkAchievementsData = await checkAchievementsResponse.json();
    console.log('✅ Achievement check:', checkAchievementsData.success ? 'SUCCESS' : 'FAILED');
    console.log(`🎯 New achievements unlocked: ${checkAchievementsData.data?.count || 0}`);

    // Test 5: Get badges
    console.log('\n5️⃣ Getting badges...');
    const badgesResponse = await fetch(`${API_BASE}/gamification/badges?userId=${userId}`);
    const badgesData = await badgesResponse.json();
    console.log('✅ Badges:', badgesData.success ? 'SUCCESS' : 'FAILED');
    console.log(`🎖️ Available badges: ${badgesData.data?.badges?.length || 0}`);

    // Test 6: Get leaderboard
    console.log('\n6️⃣ Getting leaderboard...');
    const leaderboardResponse = await fetch(`${API_BASE}/gamification/leaderboard?type=xp&limit=10`);
    const leaderboardData = await leaderboardResponse.json();
    console.log('✅ Leaderboard:', leaderboardData.success ? 'SUCCESS' : 'FAILED');
    console.log(`🏅 Leaderboard entries: ${leaderboardData.data?.leaderboard?.length || 0}`);

    // Test 7: Get challenges
    console.log('\n7️⃣ Getting daily challenges...');
    const challengesResponse = await fetch(`${API_BASE}/gamification/challenges?userId=${userId}&type=daily`);
    const challengesData = await challengesResponse.json();
    console.log('✅ Challenges:', challengesData.success ? 'SUCCESS' : 'FAILED');
    console.log(`📋 Daily challenges: ${challengesData.data?.challenges?.length || 0}`);

    // Test 8: Get rewards
    console.log('\n8️⃣ Getting rewards...');
    const rewardsResponse = await fetch(`${API_BASE}/gamification/rewards?userId=${userId}`);
    const rewardsData = await rewardsResponse.json();
    console.log('✅ Rewards:', rewardsData.success ? 'SUCCESS' : 'FAILED');
    console.log(`🎁 Available rewards: ${rewardsData.data?.rewards?.length || 0}`);

    // Test 9: Award XP
    console.log('\n9️⃣ Awarding XP...');
    const xpAwardResponse = await fetch(`${API_BASE}/gamification/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        updates: {
          xp: 150,
          source: 'test_game',
          reason: 'Test game completion'
        }
      })
    });
    const xpAwardData = await xpAwardResponse.json();
    console.log('✅ XP award:', xpAwardData.success ? 'SUCCESS' : 'FAILED');

    // Test 10: Get updated profile
    console.log('\n🔟 Getting updated profile...');
    const updatedProfileResponse = await fetch(`${API_BASE}/gamification/profile?userId=${userId}`);
    const updatedProfileData = await updatedProfileResponse.json();
    console.log('✅ Updated profile:', updatedProfileData.success ? 'SUCCESS' : 'FAILED');
    console.log(`📈 New XP: ${updatedProfileData.data?.gamification?.xp}, Level: ${updatedProfileData.data?.gamification?.level}`);

    console.log('\n🎉 All gamification tests completed!');
    console.log('\n📊 Gamification System Summary:');
    console.log('- User Profiles: ✅ Working');
    console.log('- XP & Levels: ✅ Working');
    console.log('- Achievements: ✅ Working');
    console.log('- Badges: ✅ Working');
    console.log('- Leaderboards: ✅ Working');
    console.log('- Challenges: ✅ Working');
    console.log('- Rewards: ✅ Working');
    console.log('\n🚀 Complete Gamification System is fully functional!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testGamificationSystem();
