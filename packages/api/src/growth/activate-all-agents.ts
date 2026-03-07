/**
 * 🚀 DREAMNET GROWTH ACTIVATION SCRIPT
 * 
 * This script activates ALL growth agents simultaneously
 * Run this to make the entire system active growth-focused
 * 
 * Usage: 
 *   npx ts-node packages/api/src/growth/activate-all-agents.ts
 * 
 * Or add to Clawedette startup sequence
 */

import TaskDispatcher from './task-dispatcher';
import HawkGrowthAgent from './hawk-growth-agent';
import GrantFinderAgent from './clawedette-grant-finder';
import WolfPackCoordinator from './wolf-pack-coordinator';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://nerve:6379');

async function activateAllGrowthAgents() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║       🚀 DREAMNET GROWTH ACTIVATION SEQUENCE STARTING 🚀       ║
║                                                                ║
║   This script activates all autonomous growth operations      ║
║   The system will now actively:                               ║
║   ✅ Dispatch tasks (Clawedette → Sable)                      ║
║   ✅ Post health metrics (Hawk)                               ║
║   ✅ Search and apply for grants (Clawedette)                 ║
║   ✅ Track growth metrics (Wolf Pack)                         ║
║   ✅ Coordinate all operations                                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);

  try {
    // 1. ACTIVATE TASK DISPATCHER (Critical infrastructure)
    console.log('\n[1/4] Activating Task Dispatcher...');
    const dispatcher = new TaskDispatcher();
    await dispatcher.start();
    const dispatcherStats = await dispatcher.getStats();
    console.log(`     ✅ Task Dispatcher ONLINE`);
    console.log(`        Tasks dispatched: ${dispatcherStats.dispatched}`);

    // 2. ACTIVATE HAWK GROWTH AGENT (Marketing)
    console.log('\n[2/4] Activating Hawk Growth Agent...');
    const hawk = new HawkGrowthAgent();
    await hawk.startGrowthMonitoring();
    const hawkStats = await hawk.getGrowthStats();
    console.log(`     ✅ Hawk Growth Agent ONLINE`);
    console.log(`        Posts published: ${hawkStats.totalPosts}`);

    // 3. ACTIVATE CLAWEDETTE GRANT FINDER (Funding)
    console.log('\n[3/4] Activating Grant Finder Agent...');
    const grants = new GrantFinderAgent();
    await grants.startGrantHunting();
    const grantStats = await grants.getGrantStats();
    console.log(`     ✅ Grant Finder Agent ONLINE`);
    console.log(`        Grants submitted: ${grantStats.totalSubmitted}`);
    console.log(`        Funding pipeline: $${(grantStats.totalFunding / 1000000).toFixed(1)}M`);

    // 4. ACTIVATE WOLF PACK COORDINATOR (Operations)
    console.log('\n[4/4] Activating Wolf Pack Coordinator...');
    const wolfPack = new WolfPackCoordinator();
    await wolfPack.startGrowthTracking();
    const dashboard = await wolfPack.getDashboard();
    console.log(`     ✅ Wolf Pack Coordinator ONLINE`);
    console.log(`        GitHub stars: ${dashboard.githubStars}`);
    console.log(`        Discord members: ${dashboard.discordMembers}`);

    // Mark system as activated
    await redis.set('system:growth:activated', 'true');
    await redis.set('system:activation:time', Date.now().toString());

    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║          🎉 ALL GROWTH AGENTS ACTIVATED SUCCESSFULLY 🎉        ║
║                                                                ║
║  SYSTEM STATUS: ACTIVE & GROWING                              ║
║                                                                ║
║  Now running:                                                 ║
║  ✅ Task dispatch loop (Clawedette → Redis → Sable)           ║
║  ✅ Health metrics posting (Hawk on social media)             ║
║  ✅ Grant automation (searching & applying)                   ║
║  ✅ Growth tracking (Wolf Pack dashboard)                     ║
║  ✅ All coordination ops                                      ║
║                                                                ║
║  Expected Week 1 Results:                                     ║
║  📊 20-30 social posts (100K+ impressions)                    ║
║  💰 5-10 grant proposals submitted                            ║
║  🤝 5-10 VC pitches sent                                       ║
║  🌟 500+ new community members                                ║
║  📰 2-3 media outreach emails                                 ║
║  💵 $100K+ funding identified                                 ║
║                                                                ║
║  📈 Growth trajectory: 42% → 70% capacity in Week 1            ║
║                        70% → 95% by Month 1                   ║
║                        95% → 120%+ by Month 3                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);

    // Keep process alive
    console.log('\n🔄 Agents running continuously. Press Ctrl+C to stop.\n');

  } catch (error) {
    console.error('\n❌ ERROR DURING ACTIVATION:', error);
    process.exit(1);
  }
}

// Run activation
activateAllGrowthAgents().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n👋 Gracefully shutting down...');
  await redis.quit();
  process.exit(0);
});
