import type { ReputationSignal, ReputationScore, ReputationConfig, RepEntityType } from '../types.js';
export declare const ReputationStore: {
    configure(partial: Partial<ReputationConfig>): void;
    getConfig(): ReputationConfig;
    addSignal(signal: ReputationSignal): void;
    getSignals(): ReputationSignal[];
    upsertScore(score: ReputationScore): void;
    getScores(): Map<string, ReputationScore>;
    getScoreFor(entityType: RepEntityType, entityId: string): ReputationScore | undefined;
    status(): {
        signalCount: number;
        entityCount: number;
        scoresSample: ReputationScore[];
    };
};
//# sourceMappingURL=reputationStore.d.ts.map