/**
 * Price Provider for CoinSensei
 * Fetches live/recent prices from CoinGecko or CoinMarketCap
 */
export interface PriceData {
    price: number;
    source: string;
    timestamp: Date;
    change_24h?: number;
    change_7d?: number;
}
export declare class PriceProvider {
    private cache;
    private cacheTTL;
    getPrice(tokenId: string, source?: 'coingecko' | 'cmc' | 'auto'): Promise<PriceData>;
    getPrices(tokenIds: string[], source?: 'coingecko' | 'cmc' | 'auto'): Promise<Map<string, PriceData>>;
    private fetchCoinGecko;
    private fetchCoinGeckoBatch;
    private fetchCMC;
    static getCoinGeckoId(symbol: string, chain?: string): string;
}
