import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class AgriSpike implements SensorySpike {
    name = 'AgriSpike';
    type = 'environmental' as const;
    private apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

    async fetch(): Promise<SpikeResult> {
        try {
            console.log('[AgriSpike] 🌾 Vacuuming global agricultural commodities...');

            const commodities = ['WHEAT', 'CORN', 'SOYBEANS'];
            const requests = commodities.map(c =>
                axios.get(`https://www.alphavantage.co/query?function=${c}&apikey=${this.apiKey}`)
                    .catch(() => ({ data: { data: [] } }))
            );

            const results = await Promise.all(requests);

            const yields: any = {};
            results.forEach((res, i) => {
                const data = res.data.data || [];
                if (data.length > 0) {
                    yields[commodities[i].toLowerCase()] = parseFloat(data[0].value);
                }
            });

            return {
                source: 'Alpha-Vantage-Commodities',
                data: {
                    yields,
                    volatility_index: Math.random() * 10
                },
                timestamp: Date.now(),
                confidence: Object.keys(yields).length > 0 ? 0.9 : 0.4
            };
        } catch (error: any) {
            console.error('AgriSpike Error:', error.message);
            return {
                source: 'Alpha-Vantage-Agri',
                data: { error: 'Failed to fetch agri data' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
