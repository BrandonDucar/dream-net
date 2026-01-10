import type { FieldName, FieldPointId, FieldSample, FieldConfig, FieldStatus } from '../types.js';
export declare const FieldStore: {
    configure(partial: Partial<FieldConfig>): void;
    getConfig(): FieldConfig;
    upsertSample(field: FieldName, point: FieldPointId, value: number, updatedAt: number): void;
    getSample(field: FieldName, point: FieldPointId): FieldSample | undefined;
    getAllSamples(): FieldSample[];
    setLastRunAt(ts: number | null): void;
    status(): FieldStatus;
};
//# sourceMappingURL=fieldStore.d.ts.map