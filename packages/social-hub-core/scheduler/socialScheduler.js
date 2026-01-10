import { SocialStore } from '../store/socialStore.js';
import { buildFeed } from '../logic/feedAssembler.js';
import { grantReward } from '@dreamnet/rewards-engine';
import { OharaScanner } from '@dreamnet/platform-connector';
const scanner = new OharaScanner();
export async function runSocialHubCycle(ctx) {
    const now = Date.now();
    try {
        // 1. Ingest Farcaster Discoveries
        const discoveries = await scanner.scan();
        for (const app of discoveries) {
            SocialStore.upsertPost({
                id: `farcaster-${app.uuid}`,
                authorIdentityId: "system-farcaster-bridge",
                kind: "text",
                visibility: "public",
                text: `🚀 [Farcaster Discovery] ${app.name} found! (Protocol Hash: ${app.foundInCast})`,
                tags: ["farcaster", "ohara", "discovery"],
                refs: [{ type: "web", id: app.url, label: app.name || "App URL" }]
            });
            // Monetize the discovery
            grantReward("system-farcaster-bridge", "discovery-app", {
                reason: `Discovered Farcaster App: ${app.name || app.uuid}`,
                meta: { appUrl: app.url, castHash: app.foundInCast }
            }).catch(err => console.error("Discovery reward failed:", err));
        }
        console.log(`📡 [SocialHubCore] Ingested ${discoveries.length} Farcaster discoveries.`);
    }
    catch (err) {
        console.warn("⚠️ [SocialHubCore] Farcaster ingestion failed:", err);
    }
    // 2. Build a small global feed sample
    const sampleFeed = buildFeed(ctx, { limit: 20 });
    SocialStore.setLastRunAt(now);
    // 3. Optional: write a lightweight summary into NeuralMesh
    if (ctx.neuralMesh?.remember && sampleFeed.length) {
        ctx.neuralMesh.remember({
            source: "SocialHubCore",
            postCount: sampleFeed.length,
            topTitles: sampleFeed
                .slice(0, 5)
                .map((i) => i.post.text?.slice(0, 80)),
            timestamp: now,
        });
    }
    return SocialStore.basicStatus(sampleFeed);
}
//# sourceMappingURL=socialScheduler.js.map