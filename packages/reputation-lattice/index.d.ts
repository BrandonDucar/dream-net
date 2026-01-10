import type { RepEntityType, ReputationSignal, ReputationScore, ReputationConfig, ReputationContext, ReputationStatus } from './types.js';
export declare const ReputationLattice: {
    configure(config: Partial<ReputationConfig>): void;
    addSignal(signal: ReputationSignal): void;
    getScore(entityType: RepEntityType, entityId: string): ReputationScore | undefined;
    run(context: ReputationContext): ReputationStatus;
    status(): ReputationStatus;
};
export * from './types.js';
export default ReputationLattice;
//# sourceMappingURL=index.d.ts.map