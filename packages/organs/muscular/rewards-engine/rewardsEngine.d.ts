import type { UserBalances, RewardType } from './types.js';
export declare function calculateDailyReward(streakDays?: number): {
    dream: number;
    sheep: number;
};
export declare function calculateWeeklyReward(): {
    dream: number;
    sheep: number;
};
export declare function grantReward(userId: string, type: RewardType, options?: {
    deltaDream?: number;
    deltaSheep?: number;
    reason?: string;
    meta?: Record<string, unknown>;
}): Promise<UserBalances>;
export { listRewardEvents, getUserBalance } from './store.js';
//# sourceMappingURL=rewardsEngine.d.ts.map