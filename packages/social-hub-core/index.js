import { SocialStore } from "./store/socialStore";
import { buildFeed } from "./logic/feedAssembler";
import { runSocialHubCycle } from "./scheduler/socialScheduler";
let postCounter = 0;
let commentCounter = 0;
let reactionCounter = 0;
function nextPostId() {
    postCounter += 1;
    return `post-${Date.now()}-${postCounter}`;
}
function nextCommentId() {
    commentCounter += 1;
    return `comment-${Date.now()}-${commentCounter}`;
}
function nextReactionId() {
    reactionCounter += 1;
    return `react-${Date.now()}-${reactionCounter}`;
}
export const SocialHubCore = {
    // Posts
    // ✅ Identity Layer v1: Already accepts authorIdentityId (IdentityGrid node ID)
    // Usage: SocialHubCore.createPost({ authorIdentityId: ctx.identityId, text: "...", ... })
    createPost(params) {
        const id = nextPostId();
        return SocialStore.upsertPost({
            id,
            authorIdentityId: params.authorIdentityId,
            kind: params.kind ?? "text",
            visibility: params.visibility ?? "public",
            text: params.text,
            mediaUrls: params.mediaUrls,
            tags: params.tags,
            refs: params.refs,
        });
    },
    upsertPost(post) {
        return SocialStore.upsertPost(post);
    },
    getPost(id) {
        return SocialStore.getPost(id);
    },
    listPosts() {
        return SocialStore.listPosts();
    },
    // Comments
    addComment(params) {
        const now = Date.now();
        const id = nextCommentId();
        const comment = {
            id,
            postId: params.postId,
            authorIdentityId: params.authorIdentityId,
            text: params.text,
            createdAt: now,
            updatedAt: now,
        };
        return SocialStore.addComment(comment);
    },
    listCommentsForPost(postId) {
        return SocialStore.listCommentsForPost(postId);
    },
    // Reactions
    addReaction(params) {
        const now = Date.now();
        const id = nextReactionId();
        const react = {
            id,
            postId: params.postId,
            reactorIdentityId: params.reactorIdentityId,
            type: params.type,
            createdAt: now,
        };
        return SocialStore.addReaction(react);
    },
    listReactionsForPost(postId) {
        return SocialStore.listReactionsForPost(postId);
    },
    // Feeds
    buildFeed(context, query) {
        return buildFeed(context, query);
    },
    // Orchestration
    run(context) {
        return runSocialHubCycle(context);
    },
    status() {
        // when called outside orchestration, build a basic feed in isolation
        const sampleFeed = [];
        return SocialStore.basicStatus(sampleFeed);
    },
};
export * from "./types";
export default SocialHubCore;
