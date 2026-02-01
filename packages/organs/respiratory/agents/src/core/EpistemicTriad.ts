/**
 * 🧠 EPISTEMIC TRIAD
 * Hijacked Wisdom: Łukasiewicz / Post / Fuzzy Logic
 * 
 * Philosophy: Reality is not binary. 
 * Mechanism: Reasoning with states of [CERTAIN, UNKNOWN, PROBABLE].
 */

export type EpistemicState = 'CERTAIN' | 'UNKNOWN' | 'PROBABLE';

export interface EpistemicValue<T = any> {
    state: EpistemicState;
    value: T;
    confidence: number; // 0-1
}

export class EpistemicTriad {
    /**
     * Collapses a triad into a binary truth value if confidence is high enough.
     */
    public static collapse(val: EpistemicValue, threshold: number = 0.8): boolean {
        if (val.state === 'CERTAIN') return !!val.value;
        if (val.state === 'PROBABLE' && val.confidence >= threshold) return !!val.value;
        return false;
    }

    /**
     * Creates a CERTAIN value.
     */
    public static certain<T>(value: T): EpistemicValue<T> {
        return { state: 'CERTAIN', value, confidence: 1.0 };
    }

    /**
     * Creates a PROBABLE value.
     */
    public static probable<T>(value: T, confidence: number): EpistemicValue<T> {
        return { state: 'PROBABLE', value, confidence };
    }

    /**
     * Creates an UNKNOWN value.
     */
    public static unknown<T>(fallbackValue?: T): EpistemicValue<T | undefined> {
        return { state: 'UNKNOWN', value: fallbackValue, confidence: 0.0 };
    }
}
