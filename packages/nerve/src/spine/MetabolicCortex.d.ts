/**
 * 🌀 MetabolicCortex: The Recursive Intelligence Loop
 *
 * Role: Analyzes the Analyzation.
 * Mechanism: Collects 'ReportBack' signals from pilots and synthesizes them
 * into high-level 'Synaptic Insights' for the shared Mental DNA.
 */
export interface NeuralReport {
    agentId: string;
    suit: string;
    data: any;
    timestamp: number;
}
export declare class MetabolicCortex {
    private static instance;
    private reportHistory;
    private constructor();
    static getInstance(): MetabolicCortex;
    /**
     * Accept a report from a pilot in a suit.
     */
    reportBack(report: NeuralReport): Promise<void>;
    /**
     * The 'Analyzation of the Analyzations'
     */
    metaAnalyze(): Promise<string>;
    getRecentInsights(): NeuralReport[];
    /**
     * Rapid Vibe Check (Valence Assessment)
     * Returns -1 to 1.
     */
    assessValence(content: string): Promise<number>;
    /**
     * 🩸 Synaptic Supplement: Analyze a Radar Sweep (Context Batch)
     * "Heavy bloodstream full of supplements" - User
     */
    analyzeSweep(sweepData: any[], source: string): Promise<string>;
}
export declare const metabolicCortex: MetabolicCortex;
//# sourceMappingURL=MetabolicCortex.d.ts.map