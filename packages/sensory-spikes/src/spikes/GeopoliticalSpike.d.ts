import { SensorySpike, SpikeResult } from '../index.js';
export declare class GeopoliticalSpike implements SensorySpike {
    name: string;
    type: "news";
    private newsApiKey;
    fetch(): Promise<SpikeResult>;
}
//# sourceMappingURL=GeopoliticalSpike.d.ts.map