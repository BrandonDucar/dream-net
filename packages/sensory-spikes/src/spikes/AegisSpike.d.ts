import { SensorySpike, SpikeResult } from '../index.js';
export declare class AegisSpike implements SensorySpike {
    name: string;
    type: "news";
    private lamin;
    private lomin;
    private lamax;
    private lomax;
    fetch(): Promise<SpikeResult>;
}
//# sourceMappingURL=AegisSpike.d.ts.map