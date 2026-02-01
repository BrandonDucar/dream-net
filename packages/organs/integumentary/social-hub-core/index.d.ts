import type { SocialRef, PostVisibility, PostKind, ReactionType, SocialPost, SocialComment, SocialReaction, FeedItem, FeedQuery, SocialHubContext, SocialHubStatus } from './types.js';
export declare const SocialHubCore: {
    createPost(params: {
        authorIdentityId: string;
        kind?: PostKind;
        visibility?: PostVisibility;
        text?: string;
        mediaUrls?: string[];
        tags?: string[];
        refs?: SocialRef[];
    }): SocialPost;
    upsertPost(post: Omit<SocialPost, "createdAt" | "updatedAt">): SocialPost;
    getPost(id: string): SocialPost | undefined;
    listPosts(): SocialPost[];
    addComment(params: {
        postId: string;
        authorIdentityId: string;
        text: string;
    }): SocialComment;
    listCommentsForPost(postId: string): SocialComment[];
    addReaction(params: {
        postId: string;
        reactorIdentityId: string;
        type: ReactionType;
    }): SocialReaction;
    listReactionsForPost(postId: string): SocialReaction[];
    buildFeed(context: SocialHubContext, query: FeedQuery): FeedItem[];
    run(context: SocialHubContext): Promise<SocialHubStatus>;
    status(): SocialHubStatus;
};
export * from './types.js';
export default SocialHubCore;
//# sourceMappingURL=index.d.ts.map