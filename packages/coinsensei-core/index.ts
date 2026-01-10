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

export * from './types.js';
export * from './priceProvider.js';
export * from './portfolioEngine.js';
export * from './dataHygiene.js';
export * from './smartMode.js';

import { PortfolioEngine } from './portfolioEngine.js';
import { DataHygieneEngine } from './dataHygiene.js';
import { SmartModeEngine } from './smartMode.js';
import { PriceProvider } from './priceProvider.js';
import type {
  CoinSenseiInput,
  CoinSenseiOutput,
  CoinSenseiConfig,
  SEOSummary,
} from './types.js';

export class CoinSensei {
  private portfolioEngine: PortfolioEngine;
  private hygieneEngine: DataHygieneEngine;
  private smartModeEngine: SmartModeEngine;
  private priceProvider: PriceProvider;
  private config: Required<CoinSenseiConfig>;

  constructor(config?: Partial<CoinSenseiConfig>) {
    this.config = {
      quote_currency: config?.quote_currency || 'USD',
      cost_basis_method: config?.cost_basis_method || 'WAC',
      concentration_warn_threshold: config?.concentration_warn_threshold || 25,
      geo_default: config?.geo_default || 'Maryland',
      read_only: config?.read_only !== false,
      price_sources: config?.price_sources || ['coingecko'],
    };

    this.portfolioEngine = new PortfolioEngine(this.config);
    this.hygieneEngine = new DataHygieneEngine();
    this.smartModeEngine = new SmartModeEngine(this.config.concentration_warn_threshold);
    this.priceProvider = new PriceProvider();
  }

  async analyze(input: CoinSenseiInput): Promise<CoinSenseiOutput> {
    // Compute portfolio
    const { positions, summary } = await this.portfolioEngine.computePortfolio(
      input.manual_entries || [],
      input.cex_transactions || []
    );

    // Run data hygiene checks
    const hygieneIssues = this.hygieneEngine.detectIssues(
      input.manual_entries || [],
      input.cex_transactions || [],
      positions
    );

    // Generate smart mode suggestions
    const dcaSuggestions = this.smartModeEngine.generateDCASuggestions(positions);
    const rebalanceSuggestions = this.smartModeEngine.generateRebalanceSuggestions(positions);
    const anomalies = this.smartModeEngine.detectAnomalies(positions, summary);

    // Generate SEO summary if requested
    const seoSummary = this.generateSEOSummary(summary, positions, input.config?.geo_default);

    return {
      summary,
      positions,
      hygiene_issues: hygieneIssues,
      dca_suggestions: dcaSuggestions.length > 0 ? dcaSuggestions : undefined,
      rebalance_suggestions: rebalanceSuggestions.length > 0 ? rebalanceSuggestions : undefined,
      anomalies: anomalies.length > 0 ? anomalies : undefined,
      seo_summary: seoSummary,
    };
  }

  private generateSEOSummary(
    summary: any,
    positions: any[],
    geo?: string
  ): SEOSummary {
    const geoContext = geo || this.config.geo_default;
    const topPerformers = positions
      .sort((a, b) => {
        const roiA = a.cost_basis > 0 ? (a.pnl_unrealized / a.cost_basis) * 100 : 0;
        const roiB = b.cost_basis > 0 ? (b.pnl_unrealized / b.cost_basis) * 100 : 0;
        return roiB - roiA;
      })
      .slice(0, 5);

    const roiTable = topPerformers.map(p => ({
      token: p.symbol,
      roi: p.cost_basis > 0 ? (p.pnl_unrealized / p.cost_basis) * 100 : 0,
      value: p.total_value,
    }));

    const keyStats = [
      `Total Portfolio Value: $${summary.total_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      `Total P&L: $${summary.total_pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${summary.roi_pct >= 0 ? '+' : ''}${summary.roi_pct.toFixed(2)}%)`,
      `Token Count: ${summary.token_count}`,
      `Top Holding: ${summary.top_holdings[0]?.symbol || 'N/A'} (${summary.top_holdings[0]?.allocation_pct.toFixed(1)}%)`,
    ];

    return {
      title: `Crypto Portfolio Analysis - ${geoContext}`,
      intro: `Portfolio analysis showing ${summary.token_count} tokens with total value of $${summary.total_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} and ${summary.total_pnl >= 0 ? 'positive' : 'negative'} P&L of ${summary.total_pnl >= 0 ? '+' : ''}$${summary.total_pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
      key_stats_bullets: keyStats,
      roi_table: roiTable,
      meta_description: `Crypto portfolio analysis: ${summary.token_count} tokens, $${summary.total_value.toLocaleString()} total value, ${summary.roi_pct >= 0 ? '+' : ''}${summary.roi_pct.toFixed(2)}% ROI.`,
      geo_context: `Analysis based in ${geoContext}. Local regulatory context may apply.`,
    };
  }
}

