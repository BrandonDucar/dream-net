"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runShopCycle = runShopCycle;
const shopStore_1 = require("../store/shopStore");
const shopRecommender_1 = require("../logic/shopRecommender");
function runShopCycle(ctx) {
    const now = Date.now();
    // Sync offers with reputation lattice if available
    (0, shopRecommender_1.syncOffersWithReputation)(ctx);
    const recs = (0, shopRecommender_1.computeRecommendations)(ctx);
    shopStore_1.ShopStore.setLastRunAt(now);
    // Optional: send a compact summary into NeuralMesh
    if (ctx.neuralMesh?.remember && recs.length) {
        ctx.neuralMesh.remember({
            source: "DreamShop",
            topOffers: recs.slice(0, 5),
            timestamp: now,
        });
    }
    return shopStore_1.ShopStore.status();
}
