import type { SlugMetricSample, SlugTimeConfig, SlugTimeContext, SlugTimeStatus } from './types.js';
export declare const SlugTimeMemory: {
    configure(config: Partial<SlugTimeConfig>): void;
    addSample(sample: SlugMetricSample): void;
    run(context: SlugTimeContext): SlugTimeStatus;
    status(): SlugTimeStatus;
};
export * from './types.js';
export default SlugTimeMemory;
//# sourceMappingURL=index.d.ts.map