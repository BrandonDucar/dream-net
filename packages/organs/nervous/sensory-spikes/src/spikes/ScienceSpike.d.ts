import { SensorySpike, SpikeResult } from '../index.js';
export declare class ScienceSpike implements SensorySpike {
    name: string;
    type: "scientific";
    private apiKey;
    fetch(): Promise<SpikeResult>;
}
//# sourceMappingURL=ScienceSpike.d.ts.map