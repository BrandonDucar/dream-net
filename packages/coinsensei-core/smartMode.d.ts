/**
 * Smart Mode Engine
 * DCA suggestions, rebalancing, anomaly detection
 */
import type { DCASuggestion, RebalanceSuggestion, Anomaly, TokenPosition, PortfolioSummary } from './types';
export declare class SmartModeEngine {
    private concentrationThreshold;
    constructor(concentrationThreshold?: number);
    generateDCASuggestions(positions: TokenPosition[], trendData?: Map<string, {
        trend_ok: boolean;
    }>): DCASuggestion[];
    generateRebalanceSuggestions(positions: TokenPosition[], targetCap?: number): RebalanceSuggestion[];
    detectAnomalies(positions: TokenPosition[], summary: PortfolioSummary, previousSummary?: PortfolioSummary): Anomaly[];
}
