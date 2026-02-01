/**
 * ThermodynamicAnalyzer.ts
 *
 * "The Maxwell's Demon of the Event Wormholes"
 *
 * Calculates entropy and thermodynamic metrics for events flowing through the system.
 * Uses Shannon Entropy heuristics to distinguish 'Signal' from 'Noise'.
 */
export interface Thermodynamics {
    entropy: number;
    temperature: number;
    state: 'Equilibrium' | 'Excited' | 'Flare' | 'HeatDeath';
    lastPulse: number;
}
export declare class ThermodynamicAnalyzer {
    private history;
    private readonly windowSize;
    /**
     * Analyze an incoming event to update system thermodynamics
     */
    analyze(event: any): Thermodynamics;
    /**
     * Calculate Shannon Entropy based on event type distribution
     * H(X) = -sum(p(x) * log2(p(x)))
     */
    private calculateEntropy;
    /**
     * Calculate Temperature based on event frequency
     */
    private calculateTemperature;
    /**
     * Determine the thermodynamic state of the system
     */
    private determineState;
}
//# sourceMappingURL=analysis.d.ts.map