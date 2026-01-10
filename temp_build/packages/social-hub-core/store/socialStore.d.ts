import type { SocialPost, SocialComment, SocialReaction, FeedItem, SocialHubStatus } from "../types";
export declare const SocialStore: {
    upsertPost(partial: Omit<SocialPost, "createdAt" | "updatedAt">): SocialPost;
    getPost(id: string): SocialPost | undefined;
    listPosts(): SocialPost[];
    addComment(comment: SocialComment): SocialComment;
    listCommentsForPost(postId: string): SocialComment[];
    addReaction(react: SocialReaction): SocialReaction;
    listReactionsForPost(postId: string): SocialReaction[];
    setLastRunAt(ts: number | null): void;
    basicStatus(sampleFeed: FeedItem[]): SocialHubStatus;
};
