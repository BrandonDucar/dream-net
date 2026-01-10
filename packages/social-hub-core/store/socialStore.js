const posts = new Map();
const comments = new Map();
const reactions = new Map();
let lastRunAt = null;
export const SocialStore = {
    upsertPost(partial) {
        const now = Date.now();
        const existing = posts.get(partial.id);
        const merged = {
            id: partial.id,
            authorIdentityId: partial.authorIdentityId ?? existing?.authorIdentityId ?? "",
            kind: partial.kind ?? existing?.kind ?? "text",
            visibility: partial.visibility ?? existing?.visibility ?? "public",
            text: partial.text ?? existing?.text,
            mediaUrls: partial.mediaUrls ?? existing?.mediaUrls ?? [],
            tags: partial.tags ?? existing?.tags ?? [],
            refs: partial.refs ?? existing?.refs ?? [],
            createdAt: existing?.createdAt ?? now,
            updatedAt: now,
        };
        posts.set(merged.id, merged);
        return merged;
    },
    getPost(id) {
        return posts.get(id);
    },
    listPosts() {
        return Array.from(posts.values());
    },
    addComment(comment) {
        comments.set(comment.id, comment);
        return comment;
    },
    listCommentsForPost(postId) {
        return Array.from(comments.values()).filter((c) => c.postId === postId);
    },
    addReaction(react) {
        reactions.set(react.id, react);
        return react;
    },
    listReactionsForPost(postId) {
        return Array.from(reactions.values()).filter((r) => r.postId === postId);
    },
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    basicStatus(sampleFeed) {
        return {
            lastRunAt,
            postCount: posts.size,
            commentCount: comments.size,
            reactionCount: reactions.size,
            sampleFeed,
        };
    },
};
//# sourceMappingURL=socialStore.js.map