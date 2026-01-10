import type {
  SocialEntityType,
  SocialRef,
  PostVisibility,
  PostKind,
  ReactionType,
  SocialPost,
  SocialComment,
  SocialReaction,
  FeedItem,
  FeedQuery,
  SocialHubContext,
  SocialHubStatus,
} from "./types";
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
  createPost(params: {
    authorIdentityId: string;
    kind?: PostKind;
    visibility?: PostVisibility;
    text?: string;
    mediaUrls?: string[];
    tags?: string[];
    refs?: SocialRef[];
  }): SocialPost {
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

  upsertPost(post: Omit<SocialPost, "createdAt" | "updatedAt">): SocialPost {
    return SocialStore.upsertPost(post);
  },

  getPost(id: string): SocialPost | undefined {
    return SocialStore.getPost(id);
  },

  listPosts(): SocialPost[] {
    return SocialStore.listPosts();
  },

  // Comments
  addComment(params: {
    postId: string;
    authorIdentityId: string;
    text: string;
  }): SocialComment {
    const now = Date.now();
    const id = nextCommentId();
    const comment: SocialComment = {
      id,
      postId: params.postId,
      authorIdentityId: params.authorIdentityId,
      text: params.text,
      createdAt: now,
      updatedAt: now,
    };
    return SocialStore.addComment(comment);
  },

  listCommentsForPost(postId: string): SocialComment[] {
    return SocialStore.listCommentsForPost(postId);
  },

  // Reactions
  addReaction(params: {
    postId: string;
    reactorIdentityId: string;
    type: ReactionType;
  }): SocialReaction {
    const now = Date.now();
    const id = nextReactionId();
    const react: SocialReaction = {
      id,
      postId: params.postId,
      reactorIdentityId: params.reactorIdentityId,
      type: params.type,
      createdAt: now,
    };
    return SocialStore.addReaction(react);
  },

  listReactionsForPost(postId: string): SocialReaction[] {
    return SocialStore.listReactionsForPost(postId);
  },

  // Feeds
  buildFeed(context: SocialHubContext, query: FeedQuery): FeedItem[] {
    return buildFeed(context, query);
  },

  // Orchestration
  run(context: SocialHubContext): SocialHubStatus {
    return runSocialHubCycle(context);
  },

  status(): SocialHubStatus {
    // when called outside orchestration, build a basic feed in isolation
    const sampleFeed: FeedItem[] = [];
    return SocialStore.basicStatus(sampleFeed);
  },
};

export * from "./types";
export default SocialHubCore;

