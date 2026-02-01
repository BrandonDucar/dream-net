/**
 * Smart Mode Engine
 * DCA suggestions, rebalancing, anomaly detection
 */

import type {
  DCASuggestion,
  RebalanceSuggestion,
  Anomaly,
  TokenPosition,
  PortfolioSummary,
} from './types.js';

export class SmartModeEngine {
  private concentrationThreshold: number;

  constructor(concentrationThreshold: number = 25) {
    this.concentrationThreshold = concentrationThreshold;
  }

  generateDCASuggestions(
    positions: TokenPosition[],
    trendData?: Map<string, { trend_ok: boolean }>
  ): DCASuggestion[] {
    const suggestions: DCASuggestion[] = [];

    for (const pos of positions) {
      if (pos.amount === 0) continue;

      const avgCost = pos.avg_cost_wac;
      const currentPrice = pos.current_price;
      const discountPct = ((avgCost - currentPrice) / avgCost) * 100;

      // Suggest DCA if price is below cost basis and trend is OK
      if (currentPrice < avgCost && discountPct > 5) {
        const trendOk = trendData?.get(pos.token)?.trend_ok ?? true; // Default to true if no trend data

        if (trendOk) {
          suggestions.push({
            token: pos.token,
            current_price: currentPrice,
            avg_cost: avgCost,
            discount_pct: discountPct,
            trend_ok: trendOk,
            reason: `${pos.symbol} is ${discountPct.toFixed(1)}% below your average cost. Consider dollar-cost averaging to lower your basis.`,
          });
        }
      }
    }

    return suggestions.sort((a, b) => b.discount_pct - a.discount_pct);
  }

  generateRebalanceSuggestions(
    positions: TokenPosition[],
    targetCap?: number
  ): RebalanceSuggestion[] {
    const suggestions: RebalanceSuggestion[] = [];
    const cap = targetCap || this.concentrationThreshold;
    const totalValue = positions.reduce((sum, p) => sum + p.total_value, 0);

    if (totalValue === 0) return suggestions;

    // Find over-concentrated positions
    for (const pos of positions) {
      const currentAllocation = pos.allocation_pct;

      if (currentAllocation > cap) {
        const targetAllocation = cap;
        const targetValue = (targetAllocation / 100) * totalValue;
        const currentValue = pos.total_value;
        const amountToReduce = currentValue - targetValue;
        const tokensToSell = (amountToReduce / pos.current_price);

        suggestions.push({
          token: pos.token,
          current_allocation: currentAllocation,
          target_allocation: targetAllocation,
          suggested_action: 'reduce',
          amount_to_adjust: tokensToSell,
          reason: `${pos.symbol} represents ${currentAllocation.toFixed(1)}% of portfolio, exceeding ${cap}% threshold. Consider reducing by ${tokensToSell.toFixed(4)} tokens ($${amountToReduce.toFixed(2)}).`,
        });
      }
    }

    // Suggest increasing under-allocated positions (optional)
    const avgAllocation = 100 / positions.length;
    for (const pos of positions) {
      if (pos.allocation_pct < avgAllocation * 0.5 && pos.allocation_pct > 0) {
        const targetAllocation = avgAllocation;
        const targetValue = (targetAllocation / 100) * totalValue;
        const currentValue = pos.total_value;
        const amountToAdd = targetValue - currentValue;
        const tokensToBuy = amountToAdd / pos.current_price;

        if (amountToAdd > 0) {
          suggestions.push({
            token: pos.token,
            current_allocation: pos.allocation_pct,
            target_allocation: targetAllocation,
            suggested_action: 'increase',
            amount_to_adjust: tokensToBuy,
            reason: `${pos.symbol} is under-allocated at ${pos.allocation_pct.toFixed(1)}%. Consider increasing position by ${tokensToBuy.toFixed(4)} tokens ($${amountToAdd.toFixed(2)}) for better diversification.`,
          });
        }
      }
    }

    return suggestions;
  }

  detectAnomalies(
    positions: TokenPosition[],
    summary: PortfolioSummary,
    previousSummary?: PortfolioSummary
  ): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Detect PnL spikes
    if (previousSummary) {
      const pnlChange = summary.total_pnl - previousSummary.total_pnl;
      const pnlChangePct = previousSummary.total_pnl !== 0
        ? (pnlChange / Math.abs(previousSummary.total_pnl)) * 100
        : 0;

      if (Math.abs(pnlChangePct) > 50) {
        anomalies.push({
          type: 'pnl_spike',
          description: `Significant P&L change detected: ${pnlChangePct > 0 ? '+' : ''}${pnlChangePct.toFixed(1)}%`,
          severity: 'medium',
          suggested_action: 'Review recent price movements and transactions',
        });
      }
    }

    // Detect import errors (positions with zero value but non-zero amount)
    for (const pos of positions) {
      if (pos.amount > 0 && pos.total_value === 0) {
        anomalies.push({
          type: 'import_error',
          description: `Position ${pos.token} has amount but zero value - price data may be missing`,
          affected_token: pos.token,
          severity: 'high',
          suggested_action: `Check price source for ${pos.token} or provide manual price`,
        });
      }
    }

    // Detect potential airdrops (sudden appearance of new token with value)
    if (previousSummary) {
      const newTokens = positions.filter(
        p => !previousSummary.top_holdings.some(h => h.token === p.token) && p.total_value > 100
      );

      for (const token of newTokens) {
        anomalies.push({
          type: 'airdrop_hint',
          description: `New token ${token.token} appeared with significant value - possible airdrop or missing transaction`,
          affected_token: token.token,
          severity: 'low',
          suggested_action: `Verify source of ${token.token} holdings`,
        });
      }
    }

    // Detect price discrepancies (same token with different prices)
    const tokenPrices = new Map<string, number[]>();
    for (const pos of positions) {
      if (!tokenPrices.has(pos.token)) {
        tokenPrices.set(pos.token, []);
      }
      tokenPrices.get(pos.token)!.push(pos.current_price);
    }

    for (const [token, prices] of tokenPrices.entries()) {
      if (prices.length > 1) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const discrepancy = ((maxPrice - minPrice) / minPrice) * 100;

        if (discrepancy > 5) {
          anomalies.push({
            type: 'price_discrepancy',
            description: `Price discrepancy detected for ${token}: ${discrepancy.toFixed(1)}% difference`,
            affected_token: token,
            severity: 'medium',
            suggested_action: `Review price sources for ${token} - may indicate data quality issue`,
          });
        }
      }
    }

    return anomalies;
  }
}

