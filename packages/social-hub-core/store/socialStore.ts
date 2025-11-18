import type {
  SocialPost,
  SocialComment,
  SocialReaction,
  FeedItem,
  SocialHubStatus,
} from "../types";

const posts: Map<string, SocialPost> = new Map();
const comments: Map<string, SocialComment> = new Map();
const reactions: Map<string, SocialReaction> = new Map();

let lastRunAt: number | null = null;

export const SocialStore = {
  upsertPost(
    partial: Omit<SocialPost, "createdAt" | "updatedAt">
  ): SocialPost {
    const now = Date.now();
    const existing = posts.get(partial.id);

    const merged: SocialPost = {
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

  getPost(id: string): SocialPost | undefined {
    return posts.get(id);
  },

  listPosts(): SocialPost[] {
    return Array.from(posts.values());
  },

  addComment(comment: SocialComment): SocialComment {
    comments.set(comment.id, comment);
    return comment;
  },

  listCommentsForPost(postId: string): SocialComment[] {
    return Array.from(comments.values()).filter(
      (c) => c.postId === postId
    );
  },

  addReaction(react: SocialReaction): SocialReaction {
    reactions.set(react.id, react);
    return react;
  },

  listReactionsForPost(postId: string): SocialReaction[] {
    return Array.from(reactions.values()).filter(
      (r) => r.postId === postId
    );
  },

  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  basicStatus(sampleFeed: FeedItem[]): SocialHubStatus {
    return {
      lastRunAt,
      postCount: posts.size,
      commentCount: comments.size,
      reactionCount: reactions.size,
      sampleFeed,
    };
  },
};

