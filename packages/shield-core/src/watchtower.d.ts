interface WatchtowerConfig {
    fraudProofWindowMs: number;
    sampleRate: number;
}
/**
 * Shield Watchtower (Fraud Proof System)
 *
 * Listens for "Optimistic Rollups" (actions taken without pre-verification).
 * Asynchronously verifies them against The Laws.
 * If a violation is found, it slashes the agent's reputation and triggers a rollback.
 */
export declare class ShieldWatchtower {
    private isRunning;
    private config;
    constructor(config?: WatchtowerConfig);
    start(): void;
    private handleOptimisticRollup;
    private verifyProof;
    private slashAgent;
}
export declare const shieldWatchtower: ShieldWatchtower;
export {};
//# sourceMappingURL=watchtower.d.ts.map