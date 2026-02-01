export type SocialEntityType =
  | "identity"   // IdentityGrid node (user/wallet/agent)
  | "dream"      // DreamCortex / DreamTank dream
  | "token"      // ecosystem token
  | "service"    // subsystem/service
  | "other";

export interface SocialRef {
  type: SocialEntityType;
  id: string;            // e.g. "user:founder", "dream:dreamnet-core"
  label?: string;
}

export type PostVisibility =
  | "public"
  | "private"
  | "followers"  // placeholder for future social logic
  | "unlisted";

export type PostKind =
  | "text"
  | "media"
  | "link"
  | "system"
  | "announcement";

export type ReactionType =
  | "like"
  | "heart"
  | "fire"
  | "star"
  | "laugh";

export interface SocialPost {
  id: string;
  authorIdentityId: string;     // IdentityGrid node id
  kind: PostKind;
  visibility: PostVisibility;
  text?: string;
  mediaUrls?: string[];
  tags?: string[];

  // Links into the DreamNet graph
  refs?: SocialRef[];

  createdAt: number;
  updatedAt: number;
}

export interface SocialComment {
  id: string;
  postId: string;
  authorIdentityId: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface SocialReaction {
  id: string;
  postId: string;
  reactorIdentityId: string;
  type: ReactionType;
  createdAt: number;
}

export interface FeedItem {
  post: SocialPost;
  comments: SocialComment[];
  reactions: SocialReaction[];
  score: number;                 // feed ranking score
}

export interface FeedQuery {
  // optional: filter by identity or dream
  forIdentityId?: string;
  forDreamId?: string;
  limit?: number;
}

export interface SocialHubContext {
  identityGrid?: any;
  reputationLattice?: any;
  fieldLayer?: any;
  dreamCortex?: any;
  dreamTankCore?: any;
  narrativeField?: any;
  neuralMesh?: any;
}

export interface SocialHubStatus {
  lastRunAt: number | null;
  postCount: number;
  commentCount: number;
  reactionCount: number;
  sampleFeed: FeedItem[];
}

