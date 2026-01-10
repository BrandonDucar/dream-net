
/**
 * 🐺 FINANCIAL PATTERN ENGINE (WolfPack Analyst)
 * 
 * "The Financial Mind"
 * Responsible for detecting macro-patterns, sentiment, and "Fringe->Mainstream" velocity.
 */

export interface MarketPattern {
    id: string;
    name: string;
    type: "macro" | "micro" | "fringe";
    sentiment: "bullish" | "bearish" | "neutral";
    confidence: number;
    indicators: string[]; // e.g., ["adult_tech_adoption", "political_unrest"]
}

export class FinancialPatternEngine {

    /**
     * Analyzes signals to detect "Fringe->Mainstream" adoption curves.
     * Based on the user's directive to look at "Adult/Vice" industries as leading indicators.
     */
    analyzeAdoptionVelocity(signals: Record<string, any>): MarketPattern[] {
        const patterns: MarketPattern[] = [];

        // Pattern 1: The "Red Light" Indicator
        // If Vice industries (Adult, Gambling) adopt a tech, it's a strong buy signal for infrastructure.
        if (signals["adult_industry_crypto_volume"] > 0.5) {
            patterns.push({
                id: "vice_adoption_surge",
                name: "Vice Industry Adoption Surge",
                type: "fringe",
                sentiment: "bullish",
                confidence: 0.85,
                indicators: ["adult_tech_adoption"]
            });
        }

        // Pattern 2: Global Unrest (Macro)
        if (signals["global_instability_index"] > 0.7) {
            patterns.push({
                id: "flight_to_safety",
                name: "Flight to Hard Assets",
                type: "macro",
                sentiment: "bullish", // Pro-Crypto/Gold
                confidence: 0.9,
                indicators: ["political_unrest", "currency_debasement"]
            });
        }

        return patterns;
    }
}
