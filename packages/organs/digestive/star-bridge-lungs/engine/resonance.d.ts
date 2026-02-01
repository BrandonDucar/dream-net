/**
 * 🗣️ STAR BRIDGE RESONANCE
 *
 * "Optimize our Voice to the World"
 * Modulates liquidity flow based on Social Resonance (Vector Memory).
 */
export interface ResonanceMetrics {
    chainId: string;
    socialVolume: number;
    sentiment: number;
    resonanceScore: number;
}
export declare class ResonanceOptimizer {
    /**
     * Calculates the "Voice Resonance" of a target chain.
     * If a chain is "loud" (trending), we boost liquidity flow to it.
     */
    static getResonance(chainId: string): Promise<ResonanceMetrics>;
}
//# sourceMappingURL=resonance.d.ts.map