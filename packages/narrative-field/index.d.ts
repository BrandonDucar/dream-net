import type { NarrativeEntry, NarrativeFilter, NarrativeContext, NarrativeStatus } from './types.js';
export declare const NarrativeField: {
    add(entry: NarrativeEntry): void;
    list(filter?: NarrativeFilter): NarrativeEntry[];
    run(context: NarrativeContext): NarrativeStatus;
    status(): NarrativeStatus;
};
export * from './types.js';
export default NarrativeField;
//# sourceMappingURL=index.d.ts.map