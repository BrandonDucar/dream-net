import { ShopStore } from "../store/shopStore";
import { computeRecommendations, syncOffersWithReputation } from "../logic/shopRecommender";
export function runShopCycle(ctx) {
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
