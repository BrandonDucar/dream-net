"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialHubCore = void 0;
const socialStore_1 = require("./store/socialStore");
const feedAssembler_1 = require("./logic/feedAssembler");
const socialScheduler_1 = require("./scheduler/socialScheduler");
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
exports.SocialHubCore = {
    // Posts
    // ✅ Identity Layer v1: Already accepts authorIdentityId (IdentityGrid node ID)
    // Usage: SocialHubCore.createPost({ authorIdentityId: ctx.identityId, text: "...", ... })
    createPost(params) {
        const id = nextPostId();
        return socialStore_1.SocialStore.upsertPost({
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
        return socialStore_1.SocialStore.upsertPost(post);
    },
    getPost(id) {
        return socialStore_1.SocialStore.getPost(id);
    },
    listPosts() {
        return socialStore_1.SocialStore.listPosts();
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
        return socialStore_1.SocialStore.addComment(comment);
    },
    listCommentsForPost(postId) {
        return socialStore_1.SocialStore.listCommentsForPost(postId);
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
        return socialStore_1.SocialStore.addReaction(react);
    },
    listReactionsForPost(postId) {
        return socialStore_1.SocialStore.listReactionsForPost(postId);
    },
    // Feeds
    buildFeed(context, query) {
        return (0, feedAssembler_1.buildFeed)(context, query);
    },
    // Orchestration
    run(context) {
        return (0, socialScheduler_1.runSocialHubCycle)(context);
    },
    status() {
        // when called outside orchestration, build a basic feed in isolation
        const sampleFeed = [];
        return socialStore_1.SocialStore.basicStatus(sampleFeed);
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.SocialHubCore;
