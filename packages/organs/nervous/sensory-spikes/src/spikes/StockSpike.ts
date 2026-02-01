import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class StockSpike implements SensorySpike {
    name = 'StockSpike';
    type = 'financial' as const;
    private apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

    async fetch(): Promise<SpikeResult> {
        try {
            console.log('[StockSpike] 📈 Vacuuming equity market indices...');

            // Using representative ETFs (SPY=SPX, QQQ=NDX, DIA=DJI, VXX=VIX)
            const symbols = ['SPY', 'QQQ', 'DIA', 'VXX'];

            const requests = symbols.map(s =>
                axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${s}&apikey=${this.apiKey}`)
                    .catch(() => ({ data: {} }))
            );

            const results = await Promise.all(requests);

            const marketData: any = {};
            results.forEach((res, i) => {
                const quote = res.data['Global Quote'];
                if (quote) {
                    marketData[symbols[i]] = {
                        price: parseFloat(quote['05. price']),
                        change: quote['10. change percent']
                    };
                }
            });

            return {
                source: 'Alpha-Vantage-Equities',
                data: marketData,
                timestamp: Date.now(),
                confidence: Object.keys(marketData).length > 0 ? 0.95 : 0.5
            };
        } catch (error: any) {
            console.error('StockSpike Error:', error.message);
            return {
                source: 'Alpha-Vantage-Equities',
                data: { error: 'Failed to fetch stock data' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
