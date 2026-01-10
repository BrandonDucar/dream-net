import axios from 'axios';

/**
 * 💊 Real Market Service (The Lab)
 * Synthesizes "Kinetic Memory" from Live Market Data.
 */
export class RealMarketService {
    private readonly CG_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,solana&vs_currencies=usd&include_24hr_change=true';

    public async getAlphaVector(): Promise<any> {
        try {
            console.log(`[RealMarketService] 🧪 Synthesizing Alpha Vector...`);
            const response = await axios.get(this.CG_URL);
            const data = response.data;

            // Simple Logic to create "Alpha" (Trend Analysis)
            const ethChange = data.ethereum.usd_24h_change;
            const btcChange = data.bitcoin.usd_24h_change;
            const solChange = data.solana.usd_24h_change;

            let sentiment = 'NEUTRAL';
            if (ethChange > 5 && btcChange > 0) sentiment = 'BULLISH_EUPHORIA';
            if (ethChange < -5 && btcChange < 0) sentiment = 'BEARISH_PANIC';

            return {
                type: 'ALPHA_VECTOR',
                timestamp: new Date().toISOString(),
                source: 'REAL_TIME_MARKET_FEED',
                sentiment: sentiment,
                vectors: {
                    ETH: { price: data.ethereum.usd, change_24h: ethChange },
                    BTC: { price: data.bitcoin.usd, change_24h: btcChange },
                    SOL: { price: data.solana.usd, change_24h: solChange }
                },
                potency: 'HIGH',
                insight: `Market is ${sentiment}. ETH is moving ${ethChange}%.`
            };

        } catch (error) {
            console.error(`[RealMarketService] 💥 Synthesis Failed:`, error);
            // Fallback (Low Quality Product)
            return {
                type: 'ALPHA_VECTOR',
                timestamp: new Date().toISOString(),
                status: 'DILUTED',
                msg: 'Market Feed Offline. Using cached heuristics.',
                sentiment: 'UNKNOWN'
            };
        }
    }
}

export const realMarket = new RealMarketService();
