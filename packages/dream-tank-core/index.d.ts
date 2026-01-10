import type { DreamIncubation, DreamMilestone, DreamEvaluation, EvaluationKind, DreamTankContext, DreamTankStatus } from './types.js';
export declare const DreamTankCore: {
    upsertDream(dream: Omit<DreamIncubation, "createdAt" | "updatedAt">): DreamIncubation;
    getDream(id: string): DreamIncubation | undefined;
    listDreams(): DreamIncubation[];
    upsertMilestone(milestone: Omit<DreamMilestone, "createdAt" | "updatedAt">): DreamMilestone;
    listMilestonesForDream(dreamId: string): DreamMilestone[];
    evaluateDream(context: DreamTankContext, dream: DreamIncubation, kind?: EvaluationKind): DreamEvaluation;
    run(context: DreamTankContext): DreamTankStatus;
    status(): DreamTankStatus;
};
export * from './types.js';
export default DreamTankCore;
//# sourceMappingURL=index.d.ts.map