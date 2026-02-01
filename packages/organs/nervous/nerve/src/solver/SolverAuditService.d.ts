import { SovereignIntent } from './IntentGenerator.js';
/**
 * 🇳🇱 The Dutch Oven (Solver Audit Service)
 * We don't just execute; we cook.
 *
 * This service simulates the transaction against multiple "Solver" endpoints (CowSwap, Flashbots).
 * If the returned "Surplus" (MEV Rebate) is insufficient, we reject the block.
 */
export declare class SolverAuditService {
    /**
     * "Tasting" the Batch.
     * @param intent The ingredient to cook.
     * @returns The Surplus Value (Alpha).
     */
    audit(intent: SovereignIntent): Promise<number>;
}
//# sourceMappingURL=SolverAuditService.d.ts.map