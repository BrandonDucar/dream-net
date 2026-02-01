export type WhaleChannel = "tiktok";

export type HookStyle =
  | "pattern-interrupt"
  | "storytime"
  | "tutorial"
  | "flex"
  | "pain-point";

export type WhalePlanStatus =
  | "idea"
  | "planned"
  | "ready"
  | "posted"
  | "failed";

export interface WhaleProduct {
  id: string;
  name: string;
  tikTokSku?: string;
  marginEstimate?: number; // 0–1
  tags?: string[];
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface WhaleAudience {
  id: string;
  name: string; // "AI Dads in Florida"
  geo?: string; // "US-FL", "US-CA", "UK", etc.
  tags?: string[]; // ["dads", "crypto", "pickeball", ...]
  createdAt: number;
  updatedAt: number;
}

export interface WhaleContentPlan {
  id: string;
  channel: WhaleChannel; // "tiktok" for now
  status: WhalePlanStatus;
  productId: string;
  audienceId: string;

  hookStyle: HookStyle;
  hookLine: string;
  script: string;
  caption: string;
  hashtags: string[];
  soundHint?: string;

  scheduledAt?: number;
  postedAt?: number;
  failureReason?: string;

  createdAt: number;
  updatedAt: number;
}

export interface WhaleEngagementStats {
  planId: string;
  views?: number;
  likes?: number;
  shares?: number;
  saves?: number;
  clicks?: number;
  collectedAt: number;
}

export interface WhaleInsight {
  id: string;
  type: "pattern" | "recommendation" | "warning";
  title: string;
  description: string;
  createdAt: number;
  meta?: Record<string, any>;
}

export interface WhalePackContext {
  fieldLayer?: any;
  narrativeField?: any;
  economicEngineCore?: any;
  neuralMesh?: any;
}

export interface WhalePackStatus {
  lastRunAt: number | null;
  productCount: number;
  audienceCount: number;
  planCount: number;
  postedCount: number;
  insightCount: number;
  sampleProducts: WhaleProduct[];
  sampleAudiences: WhaleAudience[];
  samplePlans: WhaleContentPlan[];
  sampleInsights: WhaleInsight[];
}
