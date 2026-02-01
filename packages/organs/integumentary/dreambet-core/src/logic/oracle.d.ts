/**
 * 🔮 DREAMBET ORACLE: PREDICTION ENGINE
 *
 * "The Smartest Mid"
 * Uses Vector Memory + Probabilistic Models to predict outcomes.
 */
export interface PredictionRequest {
    gameType: string;
    participants: string[];
    context?: Record<string, any>;
}
export interface PredictionResult {
    outcome: string;
    confidence: number;
    rationale: string;
    historicalMatches: number;
}
export declare class OracleEngine {
    /**
     * Predicts the outcome of a game or event.
     */
    static predict(req: PredictionRequest): Promise<PredictionResult>;
}
