/**
 * Portfolio Analytics Engine
 * Computes WAC/FIFO, PnL, allocation, rankings
 *
 * SECURITY: READ_ONLY = true
 * - Only processes public wallet addresses and transaction data
 * - NEVER touches private keys, seeds, or mnemonics
 * - Returns analytics only - no transaction capabilities
 */
import type { TokenPosition, PortfolioSummary, CoinSenseiConfig, ManualEntry, CEXTransaction } from './types';
export declare class PortfolioEngine {
    private config;
    private priceProvider;
    constructor(config?: Partial<CoinSenseiConfig>);
    computePortfolio(manualEntries: ManualEntry[], cexTransactions?: CEXTransaction[], userPrices?: Map<string, number>): Promise<{
        positions: TokenPosition[];
        summary: PortfolioSummary;
    }>;
    private combineTrades;
    private groupByToken;
    private computePosition;
    private computeFIFO;
    private computeWinLossRatio;
    private generateSummary;
    private generateSummaryText;
}
