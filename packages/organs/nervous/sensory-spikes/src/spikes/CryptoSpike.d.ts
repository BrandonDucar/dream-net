import { SensorySpike, SpikeResult } from '../index.js';
export declare class CryptoSpike implements SensorySpike {
    name: string;
    type: "financial";
    private targets;
    private alphaTargets;
    fetch(): Promise<SpikeResult>;
}
//# sourceMappingURL=CryptoSpike.d.ts.map