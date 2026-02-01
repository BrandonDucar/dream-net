import { SocialStore } from '../store/socialStore.js';
/**
 * Compute a simple ranking score for a post.
 * For now:
 *  - base on recency
 *  - plus reaction count
 *  - plus a small boost for high-trust authors (via ReputationLattice)
 *  - can also use FieldLayer in the future
 */
function computeScore(ctx, post, comments, reactions) {
    const now = Date.now();
    const ageMs = now - post.createdAt;
    const ageHours = ageMs / (1000 * 60 * 60);
    const recencyScore = Math.max(0, 1 - ageHours / 24); // full score if <24h, fades after
    const reactionScore = Math.min(reactions.length / 10, 1); // capped at 1
    let trustBoost = 0;
    if (ctx.reputationLattice?.status) {
        const repStatus = ctx.reputationLattice.status();
        const scores = repStatus.scoresSample ?? [];
        const rep = scores.find((s) => `${s.entityType}:${s.entityId}` === post.authorIdentityId);
        if (rep && typeof rep.score === "number") {
            trustBoost = rep.score * 0.2; // up to +0.2
        }
    }
    return recencyScore * 0.6 + reactionScore * 0.3 + trustBoost;
}
/**
 * Build a feed according to a simple query.
 */
export function buildFeed(ctx, query) {
    const allPosts = SocialStore.listPosts();
    // Filter by visibility (only public for now)
    let filtered = allPosts.filter((p) => p.visibility === "public");
    if (query.forIdentityId) {
        // Posts authored by or referencing this identity
        filtered = filtered.filter((p) => p.authorIdentityId === query.forIdentityId ||
            (p.refs ?? []).some((r) => r.type === "identity" && r.id === query.forIdentityId));
    }
    if (query.forDreamId) {
        filtered = filtered.filter((p) => (p.refs ?? []).some((r) => r.type === "dream" && r.id === query.forDreamId));
    }
    const items = filtered.map((post) => {
        const comments = SocialStore.listCommentsForPost(post.id);
        const reactions = SocialStore.listReactionsForPost(post.id);
        const score = computeScore(ctx, post, comments, reactions);
        return {
            post,
            comments,
            reactions,
            score,
        };
    });
    items.sort((a, b) => b.score - a.score);
    const limit = query.limit ?? 50;
    return items.slice(0, limit);
}
//# sourceMappingURL=feedAssembler.js.map