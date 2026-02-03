import { agentTokService } from '../packages/organs/integumentary/server/src/services/AgentTokService.js';

async function main() {
    console.log('📡 VERIFYING AGENT TOK FEED...');

    // In this script context, we need to wait a bit if we just triggered an event,
    // but here we are checking the Singleton instance.
    const feed = agentTokService.getFeed();

    console.log(`\nFeed Size: ${feed.length}`);
    feed.forEach((post, i) => {
        console.log(`[${i}] @${post.agentId} (${post.type}): ${post.content.substring(0, 60)}...`);
    });

    const hasDream = feed.some(p => p.type === 'SIMULATION_DREAM');
    if (hasDream) {
        console.log('\n✅ SUCCESS: Simulation dream detected in feed!');
    } else {
        console.log('\n❌ FAILURE: No simulation dream found in feed.');
    }
}

main().catch(console.error);
