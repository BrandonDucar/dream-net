/**
 * CoinSensei 2.0 Types
 * Unified compact spec for crypto portfolio analytics
 */

export interface WalletAddress {
  address: string;
  chain: string; // 'ethereum', 'base', 'solana', etc.
  label?: string;
}

export interface CEXTransaction {
  exchange: string; // 'coinbase', 'binance', 'tangem', etc.
  type: 'buy' | 'sell' | 'deposit' | 'withdraw' | 'transfer';
  token: string;
  amount: number;
  price?: number;
  date: Date | string;
  fee?: number;
  notes?: string;
}

export interface ManualEntry {
  token: string;
  amount: number;
  buy_price: number;
  current_price?: number;
  buy_date: Date | string;
  chain?: string;
}

export interface TokenPosition {
  token: string;
  symbol: string;
  chain?: string;
  amount: number;
  avg_cost_wac: number;
  avg_cost_fifo: number;
  current_price: number;
  price_source: string; // 'coingecko', 'cmc', 'user'
  total_value: number;
  cost_basis: number;
  pnl_unrealized: number;
  pnl_realized: number;
  allocation_pct: number;
  win_loss_ratio: number;
  first_buy_date?: Date;
  last_trade_date?: Date;
  trades: Trade[];
}

export interface Trade {
  date: Date | string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  pnl?: number;
}

export interface PortfolioSummary {
  total_value: number;
  total_cost_basis: number;
  total_pnl_unrealized: number;
  total_pnl_realized: number;
  total_pnl: number;
  roi_pct: number;
  token_count: number;
  top_holdings: TokenPosition[];
  worst_performers: TokenPosition[];
  best_performers: TokenPosition[];
  concentration_warnings: TokenPosition[];
  summary_text: string;
}

export interface DataHygieneIssue {
  type: 'duplicate' | 'ticker_mismatch' | 'impossible_qty' | 'missing_price' | 'future_date';
  severity: 'error' | 'warning' | 'info';
  description: string;
  affected_tokens: string[];
  suggested_fix?: string;
}

export interface DCASuggestion {
  token: string;
  current_price: number;
  avg_cost: number;
  discount_pct: number;
  trend_ok: boolean;
  reason: string;
}

export interface RebalanceSuggestion {
  token: string;
  current_allocation: number;
  target_allocation: number;
  suggested_action: 'reduce' | 'increase' | 'maintain';
  amount_to_adjust: number;
  reason: string;
}

export interface Anomaly {
  type: 'pnl_spike' | 'import_error' | 'airdrop_hint' | 'price_discrepancy';
  description: string;
  affected_token?: string;
  severity: 'high' | 'medium' | 'low';
  suggested_action?: string;
}

export interface SEOSummary {
  title: string;
  intro: string;
  key_stats_bullets: string[];
  roi_table: Array<{ token: string; roi: number; value: number }>;
  meta_description?: string;
  geo_context?: string;
}

export interface CoinSenseiConfig {
  quote_currency: string; // Default: 'USD'
  cost_basis_method: 'WAC' | 'FIFO'; // Default: 'WAC'
  concentration_warn_threshold: number; // Default: 25
  geo_default: string; // Default: 'Maryland'
  read_only: boolean; // Default: true
  price_sources: string[]; // ['coingecko', 'cmc']
}

export interface CoinSenseiInput {
  wallets?: WalletAddress[];
  cex_transactions?: CEXTransaction[];
  manual_entries?: ManualEntry[];
  config?: Partial<CoinSenseiConfig>;
}

export interface CoinSenseiOutput {
  summary: PortfolioSummary;
  positions: TokenPosition[];
  hygiene_issues: DataHygieneIssue[];
  dca_suggestions?: DCASuggestion[];
  rebalance_suggestions?: RebalanceSuggestion[];
  anomalies?: Anomaly[];
  seo_summary?: SEOSummary;
  visualizations?: {
    allocation_chart: any;
    performance_chart: any;
  };
}

