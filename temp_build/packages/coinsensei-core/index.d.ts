/**
 * CoinSensei 2.0 - Main Entry Point
 * Unified crypto portfolio analytics
 *
 * SECURITY: READ_ONLY = true
 * - NEVER accepts private keys, seeds, mnemonics, or 2FA codes
 * - ONLY accepts public wallet addresses (read-only portfolio analysis)
 * - Returns analytics only (P&L, allocation, suggestions)
 * - NEVER offers send, trade, swap, or bridge actions
 * - Educational analytics only (no financial/tax/legal advice)
 */
export * from './types';
export * from './priceProvider';
export * from './portfolioEngine';
export * from './dataHygiene';
export * from './smartMode';
import type { CoinSenseiInput, CoinSenseiOutput, CoinSenseiConfig } from './types';
export declare class CoinSensei {
    private portfolioEngine;
    private hygieneEngine;
    private smartModeEngine;
    private priceProvider;
    private config;
    constructor(config?: Partial<CoinSenseiConfig>);
    analyze(input: CoinSenseiInput): Promise<CoinSenseiOutput>;
    private generateSEOSummary;
}
