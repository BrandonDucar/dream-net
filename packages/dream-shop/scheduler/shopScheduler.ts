import type { ShopContext, ShopStatus } from '../types.js';
import { ShopStore } from '../store/shopStore.js';
import { computeRecommendations, syncOffersWithReputation } from '../logic/shopRecommender.js';

export function runShopCycle(ctx: ShopContext): ShopStatus {
  const now = Date.now();

  // Sync offers with reputation lattice if available
  syncOffersWithReputation(ctx);

  const recs = computeRecommendations(ctx);

  ShopStore.setLastRunAt(now);

  // Optional: send a compact summary into NeuralMesh
  if (ctx.neuralMesh?.remember && recs.length) {
    ctx.neuralMesh.remember({
      source: "DreamShop",
      topOffers: recs.slice(0, 5),
      timestamp: now,
    });
  }

  return ShopStore.status();
}

