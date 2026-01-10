import { SensorySpike, SpikeResult } from '../index.js';
export declare class AgriSpike implements SensorySpike {
    name: string;
    type: "environmental";
    private apiKey;
    fetch(): Promise<SpikeResult>;
}
//# sourceMappingURL=AgriSpike.d.ts.map