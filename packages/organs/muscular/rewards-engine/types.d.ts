export interface UserBalances {
    userId: string;
    dream: number;
    sheep: number;
    lastLoginAt?: string;
    lastDailyClaimAt?: string;
    lastWeeklyClaimAt?: string;
    weeklyGasClaims?: number;
    streakDays?: number;
}
export type RewardType = "login" | "daily-claim" | "weekly-claim" | "task-complete" | "media-upload" | "procurement" | "halo-contrib" | "referral" | "privacy-trail" | "data-integrity" | "discovery-app" | "deployment-success" | "admin-adjust";
export interface RewardEvent {
    id: string;
    userId: string;
    type: RewardType;
    deltaDream: number;
    deltaSheep: number;
    createdAt: string;
    meta?: Record<string, unknown>;
}
export interface RewardConfig {
    dailyBaseDream: number;
    dailyBaseSheep: number;
    streakBonusMultiplier: number;
    weeklyBaseDream: number;
    weeklyBaseSheep: number;
    maxDailySheep: number;
    loginCooldownHours: number;
}
//# sourceMappingURL=types.d.ts.map