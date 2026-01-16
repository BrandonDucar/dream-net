interface Epigenome {
    [configHash: string]: {
        crashes: number;
        successes: number;
        methylated: boolean;
        lastTrauma: number;
    };
}
export declare class EpigeneticMemory {
    private genome;
    private quarantineThreshold;
    private onTraumaListeners;
    constructor();
    subscribeToTrauma(listener: (hash: string, count: number) => void): void;
    /**
     * Log a successful run (demethylation)
     */
    logSuccess(configHash: string): void;
    /**
     * Log a crash (Trauma)
     */
    logTrauma(configHash: string): void;
    /**
     * Get all currently quarantined (methylated) trauma hashes
     */
    getQuarantinedHashes(): string[];
    /**
     * Check if a config is viable (expressed)
     */
    isExpressible(configHash: string): boolean;
    private initGene;
    private save;
    private load;
    report(): Epigenome;
}
export declare const epigenetics: EpigeneticMemory;
export {};
//# sourceMappingURL=EpigeneticMemory.d.ts.map