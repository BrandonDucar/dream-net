import type { UserBalances, RewardEvent } from './types.js';
export declare function getUserBalance(userId: string): Promise<UserBalances>;
export declare function setUserBalance(balance: UserBalances): Promise<void>;
export declare function recordRewardEvent(event: RewardEvent): Promise<void>;
export declare function listRewardEvents(userId: string, limit?: number): Promise<RewardEvent[]>;
export declare function getAllBalances(): Promise<UserBalances[]>;
//# sourceMappingURL=store.d.ts.map