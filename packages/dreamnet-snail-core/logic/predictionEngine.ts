/**
 * Prophet Engine - The Canonical Prediction Layer 🔮
 * 
 * Optimized for Base mini-apps. Supports micro-prediction niches
 * without fragmenting liquidity or users.
 */

export type MarketCategory = "sports" | "animals" | "creators" | "life" | "governance";

export interface MarketTemplate {
    category: MarketCategory;
    tone: "playful" | "serious" | "chaotic" | "cute";
    defaultDurationMs: number;
    resolutionMethod: "api" | "oracle" | "human_verifier";
}

export interface PredictionMarket {
    id: string;
    question: string;
    category: MarketCategory;
    outcomes: string[];
    poolSize: number;           // Unified liquidity tracking
    status: "open" | "resolved" | "closed";
    winner?: string;
    expiresAt: number;
    metadata: Record<string, any>;
}

class ProphetEngine {
    private markets: Map<string, PredictionMarket> = new Map();

    /**
     * Creates a new micro-market based on a template
     */
    createMarket(
        question: string,
        outcomes: string[],
        template: MarketTemplate,
        metadata: Record<string, any> = {}
    ): PredictionMarket {
        const id = `prophet_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        const market: PredictionMarket = {
            id,
            question,
            category: template.category,
            outcomes,
            poolSize: 0,
            status: "open",
            expiresAt: Date.now() + template.defaultDurationMs,
            metadata: {
                ...metadata,
                tone: template.tone,
                resolution: template.resolutionMethod
            }
        };

        this.markets.set(id, market);
        console.log(`[Prophet Engine] Market Created: ${question} (${template.category})`);

        return market;
    }

    /**
     * Records a "Play" (Prediction)
     * Simplified for Base mini-app UX (GUESS/PLAY instead of BET)
     */
    play(marketId: string, outcome: string, amount: number): boolean {
        const market = this.markets.get(marketId);
        if (!market || market.status !== "open") return false;

        market.poolSize += amount;

        // In a real implementation, this would trigger a Base wallet transaction
        // or record to the shared on-chain contract.
        console.log(`[Prophet Engine] Play recorded on ${marketId}: ${outcome} for ${amount}`);

        return true;
    }

    resolveMarket(marketId: string, winningOutcome: string): void {
        const market = this.markets.get(marketId);
        if (!market) return;

        market.status = "resolved";
        market.winner = winningOutcome;

        console.log(`[Prophet Engine] Market ${marketId} RESOLVED. Winner: ${winningOutcome}`);
    }

    getMarketsByCategory(category: MarketCategory): PredictionMarket[] {
        return Array.from(this.markets.values()).filter(m => m.category === category);
    }
}

export const prophetEngine = new ProphetEngine();

// Default Templates (THE SECRET SAUCE)
export const MARKET_TEMPLATES: Record<string, MarketTemplate> = {
    SPORTS_MICRO: {
        category: "sports",
        tone: "playful",
        defaultDurationMs: 60 * 60 * 1000, // 1 hour
        resolutionMethod: "api"
    },
    ANIMAL_OBS: {
        category: "animals",
        tone: "cute",
        defaultDurationMs: 24 * 60 * 60 * 1000, // 24 hours
        resolutionMethod: "human_verifier"
    },
    CREATOR_OUTCOME: {
        category: "creators",
        tone: "chaotic",
        defaultDurationMs: 12 * 60 * 60 * 1000, // 12 hours
        resolutionMethod: "api"
    }
};
