"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSocialHubCycle = runSocialHubCycle;
const socialStore_1 = require("../store/socialStore");
const feedAssembler_1 = require("../logic/feedAssembler");
function runSocialHubCycle(ctx) {
    const now = Date.now();
    // Build a small global feed sample
    const sampleFeed = (0, feedAssembler_1.buildFeed)(ctx, { limit: 20 });
    socialStore_1.SocialStore.setLastRunAt(now);
    // Optional: write a lightweight summary into NeuralMesh
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
    return socialStore_1.SocialStore.basicStatus(sampleFeed);
}
