export interface MessageUnlockStatus {
    unlocked: boolean;
    reason: string;
    requiredTrust: number;
    currentTrust: number;
    agentRequired?: string;
}
export declare function checkMessageUnlock(userTrustScore: number, messageAgentSource?: string): MessageUnlockStatus;
export declare function getUnlockProgress(userTrustScore: number): {
    percentage: number;
    nextMilestone: number;
    description: string;
};
export declare function analyzeMessagePattern(message: string): {
    supportive: boolean;
    emoji: boolean;
    trustImpact: number;
};
