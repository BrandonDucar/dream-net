import { SocialHubCore } from '../packages/social-hub-core/index.js';

async function testIngestion() {
    // process.env.NEYNAR_API_KEY = "MOCK_KEY_FOR_TEST"; // Use real key from .env now

    console.log("🧪 [Test] Starting SocialHubCore cycle...");

    const context: any = {
        identityId: "test-admin",
        neuralMesh: {
            remember: (data: any) => console.log("🧠 [NeuralMesh] Remembered:", data)
        }
    };

    // Run the cycle
    await SocialHubCore.run(context);

    // List posts to see if anything was ingested
    const posts = SocialHubCore.listPosts();
    console.log(`📝 [Test] Total posts in store: ${posts.length}`);

    const farcasterPosts = posts.filter(p => p.id.startsWith('farcaster-'));
    console.log(`🚀 [Test] Farcaster discovery posts: ${farcasterPosts.length}`);

    if (farcasterPosts.length > 0) {
        console.log("✅ [Test] Success: Real or Fallback discoveries ingested.");
    } else {
        console.log("⚠️ [Test] No discoveries found (expected if API/Mock is empty).");
    }
}

testIngestion().catch(console.error);
