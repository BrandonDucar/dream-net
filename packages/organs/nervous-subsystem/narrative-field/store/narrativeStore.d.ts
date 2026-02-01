import type { NarrativeEntry, NarrativeFilter } from '../types.js';
export declare const NarrativeStore: {
    add(entry: NarrativeEntry): void;
    list(filter?: NarrativeFilter): NarrativeEntry[];
    status(): {
        entryCount: number;
        recentEntries: NarrativeEntry[];
    };
};
//# sourceMappingURL=narrativeStore.d.ts.map