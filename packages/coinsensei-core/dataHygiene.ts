/**
 * Data Hygiene Engine
 * Detects duplicates, ticker mismatches, impossible quantities, etc.
 */

import type { DataHygieneIssue, ManualEntry, CEXTransaction, TokenPosition } from './types';

export class DataHygieneEngine {
  detectIssues(
    manualEntries: ManualEntry[],
    cexTransactions: CEXTransaction[],
    positions: TokenPosition[]
  ): DataHygieneIssue[] {
    const issues: DataHygieneIssue[] = [];

    // Check for duplicates
    issues.push(...this.detectDuplicates(manualEntries, cexTransactions));

    // Check for ticker mismatches
    issues.push(...this.detectTickerMismatches(manualEntries, cexTransactions));

    // Check for impossible quantities
    issues.push(...this.detectImpossibleQuantities(manualEntries, cexTransactions, positions));

    // Check for missing prices
    issues.push(...this.detectMissingPrices(manualEntries, cexTransactions));

    // Check for future dates
    issues.push(...this.detectFutureDates(manualEntries, cexTransactions));

    return issues;
  }

  private detectDuplicates(
    manualEntries: ManualEntry[],
    cexTransactions: CEXTransaction[]
  ): DataHygieneIssue[] {
    const issues: DataHygieneIssue[] = [];
    const seen = new Map<string, Set<string>>();

    // Check manual entries
    for (const entry of manualEntries) {
      const key = `${entry.token}-${entry.buy_date}-${entry.amount}`;
      if (!seen.has(entry.token)) {
        seen.set(entry.token, new Set());
      }
      if (seen.get(entry.token)!.has(key)) {
        issues.push({
          type: 'duplicate',
          severity: 'warning',
          description: `Duplicate entry detected for ${entry.token} on ${entry.buy_date}`,
          affected_tokens: [entry.token],
          suggested_fix: `Review and remove duplicate entry for ${entry.token}`,
        });
      } else {
        seen.get(entry.token)!.add(key);
      }
    }

    // Check CEX transactions
    for (const tx of cexTransactions) {
      const key = `${tx.token}-${tx.date}-${tx.amount}`;
      if (!seen.has(tx.token)) {
        seen.set(tx.token, new Set());
      }
      if (seen.get(tx.token)!.has(key)) {
        issues.push({
          type: 'duplicate',
          severity: 'warning',
          description: `Duplicate transaction detected for ${tx.token} on ${tx.date}`,
          affected_tokens: [tx.token],
          suggested_fix: `Review and remove duplicate transaction for ${tx.token}`,
        });
      } else {
        seen.get(tx.token)!.add(key);
      }
    }

    return issues;
  }

  private detectTickerMismatches(
    manualEntries: ManualEntry[],
    cexTransactions: CEXTransaction[]
  ): DataHygieneIssue[] {
    const issues: DataHygieneIssue[] = [];
    const tokenVariations = new Map<string, Set<string>>();

    // Collect all token variations
    for (const entry of manualEntries) {
      const normalized = entry.token.toUpperCase().trim();
      if (!tokenVariations.has(normalized)) {
        tokenVariations.set(normalized, new Set());
      }
      tokenVariations.get(normalized)!.add(entry.token);
    }

    for (const tx of cexTransactions) {
      const normalized = tx.token.toUpperCase().trim();
      if (!tokenVariations.has(normalized)) {
        tokenVariations.set(normalized, new Set());
      }
      tokenVariations.get(normalized)!.add(tx.token);
    }

    // Detect mismatches (same token with different casing/spacing)
    for (const [normalized, variations] of tokenVariations.entries()) {
      if (variations.size > 1) {
        issues.push({
          type: 'ticker_mismatch',
          severity: 'warning',
          description: `Token ticker variations detected: ${Array.from(variations).join(', ')}`,
          affected_tokens: Array.from(variations),
          suggested_fix: `Standardize ticker to one format: ${normalized}`,
        });
      }
    }

    return issues;
  }

  private detectImpossibleQuantities(
    manualEntries: ManualEntry[],
    cexTransactions: CEXTransaction[],
    positions: TokenPosition[]
  ): DataHygieneIssue[] {
    const issues: DataHygieneIssue[] = [];

    // Check for negative quantities
    for (const entry of manualEntries) {
      if (entry.amount <= 0) {
        issues.push({
          type: 'impossible_qty',
          severity: 'error',
          description: `Invalid quantity for ${entry.token}: ${entry.amount}`,
          affected_tokens: [entry.token],
          suggested_fix: `Quantity must be positive. Check entry for ${entry.token}`,
        });
      }
    }

    for (const tx of cexTransactions) {
      if (tx.amount <= 0) {
        issues.push({
          type: 'impossible_qty',
          severity: 'error',
          description: `Invalid transaction amount for ${tx.token}: ${tx.amount}`,
          affected_tokens: [tx.token],
          suggested_fix: `Transaction amount must be positive. Check transaction for ${tx.token}`,
        });
      }
    }

    // Check for positions with negative amounts (after sells)
    for (const pos of positions) {
      if (pos.amount < 0) {
        issues.push({
          type: 'impossible_qty',
          severity: 'error',
          description: `Position has negative amount for ${pos.token}: ${pos.amount}`,
          affected_tokens: [pos.token],
          suggested_fix: `More sells than buys detected. Review transactions for ${pos.token}`,
        });
      }
    }

    return issues;
  }

  private detectMissingPrices(
    manualEntries: ManualEntry[],
    cexTransactions: CEXTransaction[]
  ): DataHygieneIssue[] {
    const issues: DataHygieneIssue[] = [];

    for (const entry of manualEntries) {
      if (!entry.current_price && !entry.buy_price) {
        issues.push({
          type: 'missing_price',
          severity: 'warning',
          description: `Missing price data for ${entry.token}`,
          affected_tokens: [entry.token],
          suggested_fix: `Provide buy_price or current_price for ${entry.token}`,
        });
      }
    }

    for (const tx of cexTransactions) {
      if (tx.type === 'buy' || tx.type === 'sell') {
        if (!tx.price || tx.price === 0) {
          issues.push({
            type: 'missing_price',
            severity: 'warning',
            description: `Missing price for ${tx.type} transaction of ${tx.token}`,
            affected_tokens: [tx.token],
            suggested_fix: `Provide price for transaction on ${tx.date}`,
          });
        }
      }
    }

    return issues;
  }

  private detectFutureDates(
    manualEntries: ManualEntry[],
    cexTransactions: CEXTransaction[]
  ): DataHygieneIssue[] {
    const issues: DataHygieneIssue[] = [];
    const now = new Date();

    for (const entry of manualEntries) {
      const date = typeof entry.buy_date === 'string' ? new Date(entry.buy_date) : entry.buy_date;
      if (date > now) {
        issues.push({
          type: 'future_date',
          severity: 'warning',
          description: `Future date detected for ${entry.token}: ${entry.buy_date}`,
          affected_tokens: [entry.token],
          suggested_fix: `Check date for ${entry.token} entry`,
        });
      }
    }

    for (const tx of cexTransactions) {
      const date = typeof tx.date === 'string' ? new Date(tx.date) : tx.date;
      if (date > now) {
        issues.push({
          type: 'future_date',
          severity: 'warning',
          description: `Future date detected for transaction: ${tx.date}`,
          affected_tokens: [tx.token],
          suggested_fix: `Check transaction date`,
        });
      }
    }

    return issues;
  }
}

