"use strict";
/**
 * Price Provider for CoinSensei
 * Fetches live/recent prices from CoinGecko or CoinMarketCap
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceProvider = void 0;
const axios_1 = __importDefault(require("axios"));
class PriceProvider {
    cache = new Map();
    cacheTTL = 60000; // 1 minute
    async getPrice(tokenId, source = 'auto') {
        const cacheKey = `${tokenId}-${source}`;
        const cached = this.cache.get(cacheKey);
        if (cached && cached.expires > Date.now()) {
            return cached.data;
        }
        let priceData;
        if (source === 'coingecko' || source === 'auto') {
            try {
                priceData = await this.fetchCoinGecko(tokenId);
            }
            catch (error) {
                if (source === 'auto') {
                    priceData = await this.fetchCMC(tokenId);
                }
                else {
                    throw error;
                }
            }
        }
        else {
            priceData = await this.fetchCMC(tokenId);
        }
        this.cache.set(cacheKey, {
            data: priceData,
            expires: Date.now() + this.cacheTTL,
        });
        return priceData;
    }
    async getPrices(tokenIds, source = 'auto') {
        const prices = new Map();
        // Batch fetch from CoinGecko
        if (source === 'coingecko' || source === 'auto') {
            try {
                const batch = await this.fetchCoinGeckoBatch(tokenIds);
                batch.forEach((price, id) => prices.set(id, price));
                // Fill missing from CMC if needed
                if (source === 'auto') {
                    const missing = tokenIds.filter(id => !prices.has(id));
                    for (const id of missing) {
                        try {
                            prices.set(id, await this.fetchCMC(id));
                        }
                        catch (e) {
                            // Skip if both fail
                        }
                    }
                }
            }
            catch (error) {
                // Fallback to individual CMC calls
                for (const id of tokenIds) {
                    try {
                        prices.set(id, await this.fetchCMC(id));
                    }
                    catch (e) {
                        // Skip failed tokens
                    }
                }
            }
        }
        else {
            for (const id of tokenIds) {
                try {
                    prices.set(id, await this.fetchCMC(id));
                }
                catch (e) {
                    // Skip failed tokens
                }
            }
        }
        return prices;
    }
    async fetchCoinGecko(tokenId) {
        const response = await axios_1.default.get(`https://api.coingecko.com/api/v3/simple/price`, {
            params: {
                ids: tokenId,
                vs_currencies: 'usd',
                include_24hr_change: true,
                include_7d_change: true,
            },
            timeout: 5000,
        });
        const data = response.data[tokenId];
        if (!data || !data.usd) {
            throw new Error(`Price not found for ${tokenId}`);
        }
        return {
            price: data.usd,
            source: 'coingecko',
            timestamp: new Date(),
            change_24h: data.usd_24h_change,
            change_7d: data.usd_7d_change,
        };
    }
    async fetchCoinGeckoBatch(tokenIds) {
        const response = await axios_1.default.get(`https://api.coingecko.com/api/v3/simple/price`, {
            params: {
                ids: tokenIds.join(','),
                vs_currencies: 'usd',
                include_24hr_change: true,
                include_7d_change: true,
            },
            timeout: 10000,
        });
        const prices = new Map();
        const now = new Date();
        for (const [id, data] of Object.entries(response.data)) {
            const priceData = data;
            if (priceData.usd) {
                prices.set(id, {
                    price: priceData.usd,
                    source: 'coingecko',
                    timestamp: now,
                    change_24h: priceData.usd_24h_change,
                    change_7d: priceData.usd_7d_change,
                });
            }
        }
        return prices;
    }
    async fetchCMC(tokenId) {
        // Note: CMC API requires API key, so this is a placeholder
        // In production, you'd use: https://coinmarketcap.com/api/
        throw new Error('CMC API requires API key - use CoinGecko or provide API key');
    }
    // Helper to map common symbols to CoinGecko IDs
    static getCoinGeckoId(symbol, chain) {
        const mapping = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'USDC': 'usd-coin',
            'USDT': 'tether',
            'SOL': 'solana',
            'MATIC': 'matic-network',
            'AVAX': 'avalanche-2',
            'DOT': 'polkadot',
            'ADA': 'cardano',
            'LINK': 'chainlink',
            'UNI': 'uniswap',
            'AAVE': 'aave',
            'CRV': 'curve-dao-token',
        };
        return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
    }
}
exports.PriceProvider = PriceProvider;
