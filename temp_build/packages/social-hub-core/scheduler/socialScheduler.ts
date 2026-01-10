import type { SocialHubContext, SocialHubStatus } from "../types";
import { SocialStore } from "../store/socialStore";
import { buildFeed } from "../logic/feedAssembler";

export function runSocialHubCycle(ctx: SocialHubContext): SocialHubStatus {
  const now = Date.now();

  // Build a small global feed sample
  const sampleFeed = buildFeed(ctx, { limit: 20 });

  SocialStore.setLastRunAt(now);

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

  return SocialStore.basicStatus(sampleFeed);
}

