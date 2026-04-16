/**
 * @dreamnet/coinsensei-core — Crypto Intelligence & Advisory
 * 
 * AI-powered crypto market analysis, portfolio tracking, and trading signals.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'coinsensei',
  name: 'CoinSensei',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['market-analysis', 'portfolio-tracking', 'trading-signals', 'price-alerts'],
  metadata: { organ: 'endocrine', role: 'crypto-advisor' },
});

export interface MarketSignal {
  asset: string;
  action: 'buy' | 'sell' | 'hold' | 'watch';
  confidence: number;
  reasoning: string;
  price: number;
  timestamp: number;
}

export interface PortfolioEntry {
  asset: string;
  amount: number;
  avgCost: number;
  currentPrice: number;
}

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function emitSignal(signal: MarketSignal): Promise<void> {
  await bridge.broadcast(`[COINSENSEI] ${signal.action.toUpperCase()} ${signal.asset} @ $${signal.price} (${(signal.confidence * 100).toFixed(0)}% confidence)`, signal, signal.confidence > 0.8 ? 'high' : 'normal');
}

export async function alertPrice(asset: string, price: number, direction: 'above' | 'below'): Promise<void> {
  await bridge.broadcast(`[COINSENSEI] ALERT: ${asset} ${direction} $${price}`, { asset, price, direction }, 'high');
}

export { bridge };
export default { connect, emitSignal, alertPrice, bridge };
