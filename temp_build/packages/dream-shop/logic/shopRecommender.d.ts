import type { OfferRecommendation, ShopContext } from "../types";
export declare function computeRecommendations(ctx: ShopContext): OfferRecommendation[];
/**
 * Optionally adjust offer trustHint based on ReputationLattice.
 */
export declare function syncOffersWithReputation(ctx: ShopContext): void;
