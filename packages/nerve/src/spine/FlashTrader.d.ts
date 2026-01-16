/**
 * ⚡ FlashTrader: The Alpha Execution Core
 *
 * Philosophy: Speed is the only moat. Arbitrage is the only truth.
 * Mechanism: Listen for Market.OpportunityDetected, validate, and execute.
 */
import { Genome } from '../../../shared/genetic/Genome.js';
export interface MarketOpportunity {
    opportunityId: string;
    protocol: string;
    tokenPair: [string, string];
    expectedYield: number;
    confidence: number;
}
export declare class FlashTrader {
    private static instance;
    private stats;
    private genome;
    private constructor();
    static getInstance(): FlashTrader;
    private ignite;
    private handleOpportunity;
    private listenForEvolution;
    getStats(): {
        currentGenome: Genome;
        totalAlpha: number;
        tradeCount: number;
    };
}
export declare const flashTrader: FlashTrader;
//# sourceMappingURL=FlashTrader.d.ts.map