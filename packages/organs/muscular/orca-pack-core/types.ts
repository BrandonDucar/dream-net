export type OrcaChannel =
  | "x"
  | "farcaster"
  | "instagram"
  | "threads"
  | "youtube-shorts"
  | "other";

export type OrcaContentKind =
  | "short-text"
  | "thread"
  | "frame"
  | "image"
  | "video"
  | "reply";

export type OrcaPlanStatus =
  | "idea"
  | "draft"
  | "scheduled"
  | "posted"
  | "failed";

export interface OrcaNarrativeTheme {
  id: string;
  name: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface OrcaPostIdea {
  id: string;
  kind: OrcaContentKind;
  themeId: string;
  title?: string;
  body: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  score?: number;
}

export interface OrcaPostPlan {
  id: string;
  ideaId: string;
  channel: OrcaChannel;
  status: OrcaPlanStatus;
  scheduledAt?: number;
  postedAt?: number;
  failureReason?: string;
  renderedTitle?: string;
  renderedBody?: string;
  renderedMeta?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface OrcaEngagement {
  planId: string;
  channel: OrcaChannel;
  impressions?: number;
  likes?: number;
  replies?: number;
  reposts?: number;
  clicks?: number;
  collectedAt: number;
}

export interface OrcaInsight {
  id: string;
  type: "pattern" | "recommendation" | "warning";
  title: string;
  description: string;
  createdAt: number;
  meta?: Record<string, any>;
}

export interface OrcaPackContext {
  fieldLayer?: any;
  narrativeField?: any;
  economicEngineCore?: any;
  neuralMesh?: any;
}

export interface OrcaPackStatus {
  lastRunAt: number | null;
  themeCount: number;
  ideaCount: number;
  planCount: number;
  postedCount: number;
  insightCount: number;
  sampleThemes: OrcaNarrativeTheme[];
  sampleIdeas: OrcaPostIdea[];
  samplePlans: OrcaPostPlan[];
  sampleInsights: OrcaInsight[];
}


