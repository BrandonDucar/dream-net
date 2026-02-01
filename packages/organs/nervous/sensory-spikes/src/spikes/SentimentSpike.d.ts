import { SensorySpike, SpikeResult } from '../index.js';
export declare class SentimentSpike implements SensorySpike {
    name: string;
    type: "news";
    private apiKey;
    fetch(): Promise<SpikeResult>;
}
//# sourceMappingURL=SentimentSpike.d.ts.map