/**
 * Data Hygiene Engine
 * Detects duplicates, ticker mismatches, impossible quantities, etc.
 */
import type { DataHygieneIssue, ManualEntry, CEXTransaction, TokenPosition } from './types';
export declare class DataHygieneEngine {
    detectIssues(manualEntries: ManualEntry[], cexTransactions: CEXTransaction[], positions: TokenPosition[]): DataHygieneIssue[];
    private detectDuplicates;
    private detectTickerMismatches;
    private detectImpossibleQuantities;
    private detectMissingPrices;
    private detectFutureDates;
}
