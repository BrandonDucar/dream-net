import type { SlugMetricSample, SlugMetricSnapshot, SlugTimeConfig } from '../types.js';
export declare const SlugMemoryStore: {
    configure(partial: Partial<SlugTimeConfig>): void;
    getConfig(): SlugTimeConfig;
    addSample(sample: SlugMetricSample): void;
    getSamples(): Map<string, SlugMetricSample[]>;
    updateSnapshot(key: string, snapshot: SlugMetricSnapshot): void;
    getSnapshots(): Map<string, SlugMetricSnapshot>;
    status(): {
        totalSamples: number;
        snapshotCount: number;
    };
};
//# sourceMappingURL=slugMemoryStore.d.ts.map