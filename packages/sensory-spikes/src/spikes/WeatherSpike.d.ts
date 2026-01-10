import { SensorySpike, SpikeResult } from '../index.js';
export declare class WeatherSpike implements SensorySpike {
    name: string;
    type: "environmental";
    private lat;
    private lon;
    constructor(lat?: number, lon?: number);
    fetch(): Promise<SpikeResult>;
}
//# sourceMappingURL=WeatherSpike.d.ts.map