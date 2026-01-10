import { SensorySpike, SpikeResult } from '../index.js';
export declare class StockSpike implements SensorySpike {
    name: string;
    type: "financial";
    private apiKey;
    fetch(): Promise<SpikeResult>;
}
//# sourceMappingURL=StockSpike.d.ts.map