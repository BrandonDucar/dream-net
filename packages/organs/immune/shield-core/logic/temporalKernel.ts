import { ShieldStore } from '../store/shieldStore.js';

export type ChronoPhase = 'Pulse' | 'Spore' | 'Chitin' | 'Sovereign';

export interface ChronoAsset {
    id: string;
    owner: string;
    birthTimestamp: number;
    metabolicInteractionCount: number;
    lastMetabolicSync: number;
    phase: ChronoPhase;
    purity: number; // 0 to 1
}

/**
 * ⏳ TemporalKernel: The Heart of Temporal Advantage
 * Tracks and matures ChronoSeeds across the nervous system.
 */
export class TemporalKernel {
    private static ASSET_RIPENING_PERIODS = {
        Spore: 7 * 24 * 60 * 60 * 1000,    // 7 Days
        Chitin: 14 * 24 * 60 * 60 * 1000,   // 14 Days
        Sovereign: 30 * 24 * 60 * 60 * 1000 // 30 Days
    };

    /**
     * Calculate the current phase and purity of an asset
     */
    public static calculateRipening(asset: ChronoAsset, currentMetabolism: number = 1.0): { phase: ChronoPhase, purity: number } {
        const age = Date.now() - asset.birthTimestamp;

        // Metabolic Multiplier: High metabolism speeds up perceived time
        const effectiveAge = age * (1 + (currentMetabolism - 1) * 0.5);

        if (effectiveAge >= this.ASSET_RIPENING_PERIODS.Sovereign) {
            return { phase: 'Sovereign', purity: 1.0 };
        } else if (effectiveAge >= this.ASSET_RIPENING_PERIODS.Chitin) {
            const range = this.ASSET_RIPENING_PERIODS.Sovereign - this.ASSET_RIPENING_PERIODS.Chitin;
            const progress = (effectiveAge - this.ASSET_RIPENING_PERIODS.Chitin) / range;
            return { phase: 'Chitin', purity: 0.5 + (0.5 * progress) };
        } else if (effectiveAge >= this.ASSET_RIPENING_PERIODS.Spore) {
            const range = this.ASSET_RIPENING_PERIODS.Chitin - this.ASSET_RIPENING_PERIODS.Spore;
            const progress = (effectiveAge - this.ASSET_RIPENING_PERIODS.Spore) / range;
            return { phase: 'Spore', purity: 0.2 + (0.3 * progress) };
        } else {
            const progress = effectiveAge / this.ASSET_RIPENING_PERIODS.Spore;
            return { phase: 'Pulse', purity: 0.2 * progress };
        }
    }

    /**
     * Sync metabolic interaction to the asset
     */
    public static syncMetabolism(asset: ChronoAsset, pulseCount: number): ChronoAsset {
        asset.metabolicInteractionCount += pulseCount;
        asset.lastMetabolicSync = Date.now();
        const { phase, purity } = this.calculateRipening(asset);
        asset.phase = phase;
        asset.purity = purity;
        return asset;
    }
}
