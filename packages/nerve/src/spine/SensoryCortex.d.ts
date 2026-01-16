export interface SensorySnapshot {
    crypto: any;
    metals: any;
    stocks: any;
    aegis: any;
    sentiment: any;
    geopolitical: any;
    vacuum: {
        offensive: any;
        defensive: any;
        creative?: any;
    };
    planetary: {
        nasa: any;
        agri: any;
        satellite: any;
    };
    timestamp: number;
}
export declare class SensoryCortex {
    private static instance;
    private latestSnapshot;
    private cryptoSpike;
    private metalsSpike;
    private stockSpike;
    private aegisSpike;
    private nasaSpike;
    private agriSpike;
    private satelliteSpike;
    private sentimentSpike;
    private geopoliticalSpike;
    private offensiveSpike;
    private defensiveSpike;
    private constructor();
    static getInstance(): SensoryCortex;
    pulse(): Promise<SensorySnapshot>;
    getLatestSnapshot(): SensorySnapshot | null;
}
export declare const cortex: SensoryCortex;
//# sourceMappingURL=SensoryCortex.d.ts.map