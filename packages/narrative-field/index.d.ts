import type { NarrativeEntry, NarrativeFilter, NarrativeContext, NarrativeStatus } from "./types";
export declare const NarrativeField: {
    add(entry: NarrativeEntry): void;
    list(filter?: NarrativeFilter): NarrativeEntry[];
    run(context: NarrativeContext): NarrativeStatus;
    status(): NarrativeStatus;
};
export * from "./types";
export default NarrativeField;
