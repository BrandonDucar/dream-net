import { SensorySpike, SpikeResult } from '../index.js';
export declare class NewsSpike implements SensorySpike {
    name: string;
    type: "news";
    private apiKey;
    fetch(): Promise<SpikeResult>;
}
//# sourceMappingURL=NewsSpike.d.ts.map