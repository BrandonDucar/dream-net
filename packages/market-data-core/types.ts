/**
 * Market Data Core Types
 * Types for metals, crypto, and stock market data collection
 */

export interface MetalPrice {
  symbol: string; // XAU, XAG, XPT, XPD
  price: number;
  currency: string;
  timestamp: number;
  change24h?: number;
  changePercent24h?: number;
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  marketCapRank: number;
  totalVolume: number;
  high24h: number;
  low24h: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  timestamp: number;
}

export interface StockPrice {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
  change?: number;
  changePercent?: number;
}

export interface MarketDataSpikeConfig {
  enabled: boolean;
  frequency: number; // milliseconds between fetches
  apiKey?: string;
  symbols?: string[]; // For stocks/crypto filtering
}

export interface MarketDataSpikeStatus {
  type: "metals" | "crypto" | "stocks";
  lastFetch: number | null;
  lastSuccess: number | null;
  errorCount: number;
  successCount: number;
  isRunning: boolean;
  nextFetch: number | null;
}

