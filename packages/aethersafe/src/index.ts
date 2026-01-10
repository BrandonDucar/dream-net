
/**
 * 🕵️‍♀️ AETHERSAFE: Deep Pattern Recognition Engine
 * 
 * "The Cortex Filter"
 * Responsible for analyzing text, URLs, and metadata for specific signatures.
 */

export interface PatternSignature {
    id: string;
    category: "safety" | "financial" | "cultural" | "identity";
    severity: "low" | "medium" | "high" | "critical";
    patterns: RegExp[];
    keywords: string[];
    weight: number;
}

export interface AnalysisResult {
    isSafe: boolean;
    flaggedSignatures: string[];
    confidence: number; // 0.0 to 1.0
    categoryScores: Record<string, number>;
}

export class PatternRecognizer {
    private signatures: PatternSignature[] = [];

    constructor() {
        // In a real system, these might load from a DB or vector store
    }

    registerSignature(sig: PatternSignature) {
        this.signatures.push(sig);
    }

    /**
     * Analyzes input content against registered signatures.
     * "Scanning the Matrix Code"
     */
    analyze(content: string): AnalysisResult {
        let flagCount = 0;
        const scores: Record<string, number> = {};
        const flaggedIds: string[] = [];

        const lowerContent = content.toLowerCase();

        for (const sig of this.signatures) {
            let matches = 0;

            // 1. Regex Check
            for (const regex of sig.patterns) {
                if (regex.test(content)) matches++;
            }

            // 2. Keyword check (simple includes for speed)
            for (const word of sig.keywords) {
                if (lowerContent.includes(word.toLowerCase())) matches++;
            }

            if (matches > 0) {
                const score = matches * sig.weight;
                scores[sig.category] = (scores[sig.category] || 0) + score;

                if (score > 0.5) { // Threshold
                    flaggedIds.push(sig.id);
                    if (sig.severity === "critical" || sig.severity === "high") {
                        flagCount += 5;
                    } else {
                        flagCount += 1;
                    }
                }
            }
        }

        // Heuristic: If critical flags exist, it's unsafe.
        const isSafe = flagCount < 5;

        return {
            isSafe,
            flaggedSignatures: flaggedIds,
            confidence: Math.min(1, flagCount / 10), // Rough confidence metric
            categoryScores: scores
        };
    }
}
