/**
 * 📚 MASTERY LIBRARY
 *
 * Stores the "Deep Dive" knowledge structures for the selected avenues.
 * Used by the Evolution Engine to synthesize new strategies.
 */
export declare const MASTERY_AVENUES: {
    ONCHAINKIT: {
        id: string;
        domain: string;
        insights: string[];
        masteryLevel: number;
    };
    VECHAIN_TOOLCHAIN: {
        id: string;
        domain: string;
        insights: string[];
        masteryLevel: number;
    };
    ELIZA_FRAMEWORK: {
        id: string;
        domain: string;
        insights: string[];
        masteryLevel: number;
    };
};
export declare class MasteryLibrary {
    static study(avenue: keyof typeof MASTERY_AVENUES): Promise<{
        topic: string;
        newLevel: number;
        insight: string;
    }>;
}
