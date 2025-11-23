import { ShopStore } from "../store/shopStore";
export function computeRecommendations(ctx) {
    const offers = ShopStore.listOffers();
    if (!offers.length)
        return [];
    // Simple heuristic ranking:
    //  - listed offers first
    //  - higher trustHint first
    //  - newer offers get slight boost
    const now = Date.now();
    const scored = offers
        .filter((o) => o.state === "listed")
        .map((o) => {
        const ageMs = now - o.createdAt;
        const agePenalty = Math.min(ageMs / (1000 * 60 * 60 * 24 * 30), 1); // up to 30 days
        const trust = o.trustHint ?? 0.5;
        const freshness = 1 - agePenalty;
        const score = 0.6 * trust + 0.4 * freshness;
        return {
            offerId: o.id,
            score,
            reason: `trust=${trust.toFixed(2)}, freshness=${freshness.toFixed(2)}`,
        };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored;
}
/**
 * Optionally adjust offer trustHint based on ReputationLattice.
 */
export function syncOffersWithReputation(ctx) {
    if (!ctx.reputationLattice?.status)
        return;
    const repStatus = ctx.reputationLattice.status();
    const scores = repStatus.scoresSample ?? [];
    const offers = ShopStore.listOffers();
    offers.forEach((offer) => {
        if (!offer.ownerIdentityId)
            return;
        const rep = scores.find((s) => `${s.entityType}:${s.entityId}` === offer.ownerIdentityId);
        if (!rep)
            return;
        const trust = typeof rep.score === "number" ? rep.score : 0.5;
        ShopStore.upsertOffer({
            ...offer,
            trustHint: trust,
        });
    });
}
