import { swarmLog } from '../server.js';

/**
 * COINGECKO SUIT (The Archivist)
 * 
 * Capability: Global market context and trend discovery.
 */
export class CoinGeckoSuit {
    private baseUrl: string = process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';

    constructor() { }

    /**
     * WAKE: Report status
     */
    public async wake() {
        swarmLog('COINGECKO', 'Archivist Online. Indexing global market context...');
        await this.checkGlobalMarket();
    }

    /**
     * CHECK GLOBAL MARKET: Get total market cap and volume
     */
    public async checkGlobalMarket() {
        try {
            const response = await fetch(`${this.baseUrl}/global`);
            const data = await response.json();
            const global = data.data;

            swarmLog('COINGECKO', `Global Market: $${(global.total_market_cap.usd / 1e12).toFixed(2)}T Cap | ${(global.market_cap_percentage.btc).toFixed(1)}% BTC Dominance`);
        } catch (e: any) {
            swarmLog('COINGECKO_ERROR', `Global check failed: ${e.message}`);
        }
    }

    /**
     * GET TRENDING: Get trending coins
     */
    public async getTrending() {
        try {
            const response = await fetch(`${this.baseUrl}/search/trending`);
            const data = await response.json();
            const coins = data.coins.map((c: any) => c.item.name).join(', ');
            swarmLog('COINGECKO', `Trending Search: ${coins}`);
            return data.coins;
        } catch (e: any) {
            swarmLog('COINGECKO_ERROR', `Trending fetch failed: ${e.message}`);
            return [];
        }
    }

    /**
     * GET PRICE: Get price of a specific coin
     */
    public async getPrice(ids: string) {
        try {
            const response = await fetch(`${this.baseUrl}/simple/price?ids=${ids}&vs_currencies=usd`);
            const data = await response.json();
            return data;
        } catch (e: any) {
            swarmLog('COINGECKO_ERROR', `Price fetch failed: ${e.message}`);
            return null;
        }
    }
}
