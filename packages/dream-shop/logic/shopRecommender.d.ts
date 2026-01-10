import type { OfferRecommendation, ShopContext } from '../types.js';
export declare function computeRecommendations(ctx: ShopContext): OfferRecommendation[];
/**
 * Optionally adjust offer trustHint based on ReputationLattice.
 */
export declare function syncOffersWithReputation(ctx: ShopContext): void;
//# sourceMappingURL=shopRecommender.d.ts.map