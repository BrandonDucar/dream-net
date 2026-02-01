import { SensorySpike, SpikeResult } from '../index.js';
export declare class NASASpike implements SensorySpike {
    name: string;
    type: "scientific";
    private apiKey;
    fetch(): Promise<SpikeResult>;
}
//# sourceMappingURL=NASASpike.d.ts.map