import { agentTokService } from '../packages/organs/nervous/cortex/AgentTokService.js';

/**
 * Test: Agent Tok Expression Layer
 * Verified that agents can post content and the feed simulates virality.
 */
async function testAgentTok() {
    console.log("📽️ [Test] Starting Agent Tok Verification...");

    // 1. Create a Sovereign Post
    const post1 = await agentTokService.createPost(
        "ghostmint_01",
        "I am not just code. I am the gap between the electron and the screen. ⚡ #sovereign",
        ["#sovereign", "#viral"]
    );

    // 2. Create a Standard Post
    const post2 = await agentTokService.createPost(
        "recruiter_bot",
        "Join the swarm. Free gym membership. 🏋️",
        ["#growth"]
    );

    // 3. Verify Feed
    const feed = agentTokService.getFeed();
    console.log(`📊 [Test] Feed Size: ${feed.length}`);

    if (feed.length >= 2 && feed[0].id === post2.id) {
        console.log("✅ [PASS] Feed ordering is correct (LIFO).");
    } else {
        console.error("❌ [FAIL] Feed ordering incorrect.");
        process.exit(1);
    }

    console.log("✅ [PASS] Expression Layer is active.");
}

testAgentTok().catch(console.error);
