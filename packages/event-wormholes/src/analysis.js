/**
 * ThermodynamicAnalyzer.ts
 *
 * "The Maxwell's Demon of the Event Wormholes"
 *
 * Calculates entropy and thermodynamic metrics for events flowing through the system.
 * Uses Shannon Entropy heuristics to distinguish 'Signal' from 'Noise'.
 */
export class ThermodynamicAnalyzer {
    history = [];
    windowSize = 100;
    /**
     * Analyze an incoming event to update system thermodynamics
     */
    analyze(event) {
        this.history.unshift(event);
        if (this.history.length > this.windowSize) {
            this.history.pop();
        }
        const entropy = this.calculateEntropy();
        const temperature = this.calculateTemperature();
        const state = this.determineState(entropy, temperature);
        return {
            entropy,
            temperature,
            state,
            lastPulse: Date.now(),
        };
    }
    /**
     * Calculate Shannon Entropy based on event type distribution
     * H(X) = -sum(p(x) * log2(p(x)))
     */
    calculateEntropy() {
        if (this.history.length === 0)
            return 0;
        const distributions = {};
        this.history.forEach(e => {
            const type = e.eventType || 'unknown';
            distributions[type] = (distributions[type] || 0) + 1;
        });
        let entropy = 0;
        const total = this.history.length;
        for (const type in distributions) {
            const p = distributions[type] / total;
            entropy -= p * Math.log2(p);
        }
        return entropy;
    }
    /**
     * Calculate Temperature based on event frequency
     */
    calculateTemperature() {
        if (this.history.length < 2)
            return 0;
        const oldest = this.history[this.history.length - 1].timestamp?.getTime() || 0;
        const newest = this.history[0].timestamp?.getTime() || Date.now();
        const durationSec = (newest - oldest) / 1000;
        if (durationSec <= 0)
            return 100; // Instant burst
        return this.history.length / durationSec; // Events per second
    }
    /**
     * Determine the thermodynamic state of the system
     */
    determineState(entropy, temperature) {
        if (temperature > 50)
            return 'Flare';
        if (temperature > 10)
            return 'Excited';
        if (temperature < 0.1 && entropy < 0.5)
            return 'HeatDeath';
        return 'Equilibrium';
    }
}
//# sourceMappingURL=analysis.js.map