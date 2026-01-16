import { memorySystem } from '@dreamnet/memory-dna';
import { swarmLog } from '../server.js';

/**
 * DEX SCREENER SUIT (The Radar)
 * 
 * Capability: Real-time price and volume signals.
 */
export class DexScreenerSuit {
    private baseUrl: string = process.env.DEXSCREENER_API_URL || 'https://api.dexscreener.com/latest/dex';

    constructor() { }

    /**
     * SEARCH: Find pairs by token name/symbol
     */
    public async searchPairs(query: string) {
        try {
            const response = await (globalThis as any).fetch(`${this.baseUrl}/search?q=${query}`);
            const data = await response.json();
            return data.pairs || [];
        } catch (e: any) {
            swarmLog('DEX_SCREENER_ERROR', `Search failed: ${e.message}`);
            return [];
        }
    }

    /**
     * FETCH PAIR: Get specifics for a contract
     */
    public async getPair(chainId: string, pairAddress: string) {
        try {
            const response = await (globalThis as any).fetch(`${this.baseUrl}/pairs/${chainId}/${pairAddress}`);
            const data = await response.json();
            return data.pairs?.[0] || null;
        } catch (e: any) {
            swarmLog('DEX_SCREENER_ERROR', `Pair fetch failed: ${e.message}`);
            return null;
        }
    }

    /**
     * WATCH WHALES: Scan for large buy orders in specific pools
     */
    public async watchWhales(chainId: string, pairAddress: string, thresholdUsd: number = 50000) {
        const pair = await this.getPair(chainId, pairAddress);
        if (pair && pair.volume && pair.volume.h24 > thresholdUsd) {
            swarmLog('DEX_SCREENER', `🐳 WHALE ACTIVITY: ${pair.baseToken.symbol} pool has high 24h volume: $${pair.volume.h24.toLocaleString()}`);

            // 🧠 REMEMBER: Store whale signal for the 'Worker' engines
            await memorySystem.remember(`WHALE_${pair.baseToken.symbol}`, {
                symbol: pair.baseToken.symbol,
                address: pair.baseToken.address,
                volume24h: pair.volume.h24,
                priceUsd: pair.priceUsd,
                source: 'DEX_SCREENER'
            }, 'SURVIVAL');
        }
    }

    /**
     * WAKE: Report status
     */
    public async wake() {
        swarmLog('DEX_SCREENER', 'Radar Online. Ready to scan liquidity pools.');

        // Initial Whale Scan (Example targets)
        this.watchWhales('solana', 'EPjFWdd5AufqztUmsq1wQV999as96LY6LJWBnPars2SR', 1000000); // USDC
    }
}
