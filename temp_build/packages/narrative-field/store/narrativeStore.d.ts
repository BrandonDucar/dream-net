import type { NarrativeEntry, NarrativeFilter } from "../types";
export declare const NarrativeStore: {
    add(entry: NarrativeEntry): void;
    list(filter?: NarrativeFilter): NarrativeEntry[];
    status(): {
        entryCount: number;
        recentEntries: NarrativeEntry[];
    };
};
