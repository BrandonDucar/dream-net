export type ActivityKind = "meditation" | "breathwork" | "yoga" | "walk" | "strength" | "stretching" | "music" | "class" | "journal" | "other";
export type SessionState = "planned" | "in-progress" | "completed" | "abandoned";
export interface ActivityRecord {
    id: string;
    sessionId: string;
    identityId: string;
    kind: ActivityKind;
    label?: string;
    durationMinutes?: number;
    intensity?: number;
    timestamp: number;
    meta?: Record<string, any>;
}
export interface ZenSession {
    id: string;
    identityId: string;
    state: SessionState;
    title?: string;
    ritualVaultItemId?: string;
    startedAt: number;
    endedAt?: number;
    activityIds: string[];
    tags?: string[];
    meta?: Record<string, any>;
}
export type RewardKind = "points" | "token" | "badge" | "unlock";
export interface RewardRecommendation {
    id: string;
    sessionId: string;
    identityId: string;
    kind: RewardKind;
    amount?: number;
    currency?: string;
    reason: string;
    createdAt: number;
}
export interface ZenGardenContext {
    identityGrid?: any;
    fieldLayer?: any;
    dreamVault?: any;
    dreamCortex?: any;
    neuralMesh?: any;
}
export interface ZenGardenStatus {
    lastRunAt: number | null;
    sessionCount: number;
    activityCount: number;
    rewardCount: number;
    sampleSessions: ZenSession[];
}
