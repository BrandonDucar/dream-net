/**
 * IntentTracker: Captures 'Shadow Intent' signals (hovers, dwells, abandoned flows).
 * Part of the 'Intent Capture' layer for DreamNet.
 */

export interface IntentPulse {
    assetId: string;
    dwellDuration: number;
    exitType: 'fulfilled' | 'abandoned' | 'bookmark' | 'hover';
    timestamp: number;
    observerVibe: number; // 0-1 resonance
}

export interface MagnetismState {
    assetId: string;
    totalDwellTime: number;
    pulseCount: number;
    magnetismScore: number; // IMS: Intent Matrix Score
}

export class IntentTracker {
    private static instance: IntentTracker;
    private matrix: Map<string, MagnetismState> = new Map();

    private constructor() { }

    public static getInstance(): IntentTracker {
        if (!IntentTracker.instance) {
            IntentTracker.instance = new IntentTracker();
        }
        return IntentTracker.instance;
    }

    /**
     * Records a 'Shadow Pulse' from a user interaction.
     */
    public recordPulse(pulse: IntentPulse): MagnetismState {
        const state = this.matrix.get(pulse.assetId) || {
            assetId: pulse.assetId,
            totalDwellTime: 0,
            pulseCount: 0,
            magnetismScore: 0,
        };

        state.totalDwellTime += pulse.dwellDuration;
        state.pulseCount += 1;

        // IMS Calculation: Weight dwell time heavily, tempered by counts
        // Higher dwell with fewer counts = targeted high-fidelity intent
        const baseIMS = (state.totalDwellTime / 1000) * (1 + pulse.observerVibe);
        state.magnetismScore = Math.min(100, (baseIMS / Math.log1p(state.pulseCount)) * 10);

        this.matrix.set(pulse.assetId, state);
        return state;
    }

    /**
     * Returns the 'Magnetism' (IMS) of a specific asset.
     */
    public getMagnetism(assetId: string): number {
        return this.matrix.get(assetId)?.magnetismScore || 0;
    }

    /**
     * Returns the top assets by Magnetism score.
     */
    public getTrendingMagnetism(limit: number = 10): MagnetismState[] {
        return Array.from(this.matrix.values())
            .sort((a, b) => b.magnetismScore - a.magnetismScore)
            .slice(0, limit);
    }
}
