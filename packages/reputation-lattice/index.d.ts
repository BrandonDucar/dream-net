import type { RepEntityType, ReputationSignal, ReputationScore, ReputationConfig, ReputationContext, ReputationStatus } from "./types";
export declare const ReputationLattice: {
    configure(config: Partial<ReputationConfig>): void;
    addSignal(signal: ReputationSignal): void;
    getScore(entityType: RepEntityType, entityId: string): ReputationScore | undefined;
    run(context: ReputationContext): ReputationStatus;
    status(): ReputationStatus;
};
export * from "./types";
export default ReputationLattice;
