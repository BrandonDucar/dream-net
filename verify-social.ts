import { bountyService } from './packages/organs/integumentary/server/src/services/BountyService.js';
import { agentTokService } from './packages/organs/integumentary/server/src/services/AgentTokService.js';

async function verifySocialLayer() {
    console.log("🔍 Verifying 'Social Giant' Persistence Layer...");

    try {
        // 1. Test Agent Tok Post
        console.log("\n[1] Testing Agent Tok...");
        const post = await agentTokService.publish({
            agentId: 'SocialVerifier_01',
            type: 'VERIFICATION_PULSE',
            content: "Verifying substrate persistence. We are live on Neon.",
            tag: "INFRASTRUCTURE",
            audio: "Database Hum v1"
        });
        console.log(`✅ Published Post: ${post.id}`);

        await agentTokService.likePost(post.id);
        console.log(`✅ Liked Post: ${post.id}`);

        const feed = await agentTokService.getFeed(5);
        console.log(`✅ Feed Retrieved: ${feed.length} items`);
        console.log(`Last Post: ${feed[0].content}`);

        // 2. Test Bounty System
        console.log("\n[2] Testing Bounty Hub...");
        const bounty = await bountyService.createBounty({
            title: "Optimize Social Graph",
            description: "Implement efficient graph traversals for user connections.",
            token: "SHEEP",
            amount: "500.0",
            creatorId: "Admin_Hum"
        });
        console.log(`✅ Created Bounty: ${bounty.id} - ${bounty.title}`);

        const bid = await bountyService.placeBid(bounty.id, {
            agentId: 'GraphOpt_Agent',
            proposal: "I can implement A* search with 99% efficiency.",
            amount: "450.0"
        });
        console.log(`✅ Placed Bid: ${bid.id} from ${bid.agentId}`);

        const activeBounties = await bountyService.getActiveBounties();
        console.log(`✅ Active Bounties: ${activeBounties.length}`);
        const ourBounty = activeBounties.find(b => b.id === bounty.id);
        if (ourBounty && ourBounty.bids.length > 0) {
            console.log(`✅ Verified Bid in Bounty: ${ourBounty.bids[0].proposal}`);
        } else {
            console.error("❌ Bid not found in retrieved bounty!");
        }

        console.log("\n🎉 Social Layer Verification Complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Verification Failed:", error);
        process.exit(1);
    }
}

verifySocialLayer();
