import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class MetalsSpike implements SensorySpike {
    name = 'MetalsSpike';
    type = 'financial' as const;
    private apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

    async fetch(): Promise<SpikeResult> {
        try {
            console.log('[MetalsSpike] 🪙 Vacuuming precious metals...');

            // Alpha Vantage Commodities: GOLD, SILVER
            const commodities = ['GOLD', 'SILVER'];
            const requests = commodities.map(c =>
                axios.get(`https://www.alphavantage.co/query?function=${c}&apikey=${this.apiKey}`)
                    .catch(() => ({ data: { data: [] } }))
            );

            const results = await Promise.all(requests);

            const rates: any = {};
            results.forEach((res, i) => {
                const data = res.data.data || [];
                if (data.length > 0) {
                    rates[commodities[i]] = parseFloat(data[0].value);
                }
            });

            return {
                source: 'Alpha-Vantage-Metals',
                data: {
                    rates,
                    unit: 'USD per Ounce'
                },
                timestamp: Date.now(),
                confidence: Object.keys(rates).length > 0 ? 0.95 : 0.5
            };
        } catch (error: any) {
            console.error('MetalsSpike Error:', error.message);
            return {
                source: 'Alpha-Vantage-Metals',
                data: { error: 'Failed to fetch metals data' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
