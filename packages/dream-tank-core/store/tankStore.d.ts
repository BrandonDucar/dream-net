import type { DreamIncubation, DreamMilestone, DreamEvaluation, DreamTankStatus } from '../types.js';
export declare const TankStore: {
    upsertDream(partial: Omit<DreamIncubation, "createdAt" | "updatedAt">): DreamIncubation;
    getDream(id: string): DreamIncubation | undefined;
    listDreams(): DreamIncubation[];
    upsertMilestone(partial: Omit<DreamMilestone, "createdAt" | "updatedAt">): DreamMilestone;
    listMilestonesForDream(dreamId: string): DreamMilestone[];
    addEvaluation(ev: DreamEvaluation): void;
    listEvaluations(): DreamEvaluation[];
    setLastRunAt(ts: number | null): void;
    status(): DreamTankStatus;
};
//# sourceMappingURL=tankStore.d.ts.map