import type { SlugMetricSample, SlugTimeConfig, SlugTimeContext, SlugTimeStatus } from "./types";
export declare const SlugTimeMemory: {
    configure(config: Partial<SlugTimeConfig>): void;
    addSample(sample: SlugMetricSample): void;
    run(context: SlugTimeContext): SlugTimeStatus;
    status(): SlugTimeStatus;
};
export * from "./types";
export default SlugTimeMemory;
