import type { FieldPointId, FieldName, FieldSample, FieldConfig, FieldContext, FieldStatus } from "./types";
export declare const FieldLayer: {
    configure(config: Partial<FieldConfig>): void;
    run(context: FieldContext): FieldStatus;
    status(): FieldStatus;
    sample(field: FieldName, point: FieldPointId): FieldSample | undefined;
    allSamples(): FieldSample[];
};
export * from "./types";
export default FieldLayer;
