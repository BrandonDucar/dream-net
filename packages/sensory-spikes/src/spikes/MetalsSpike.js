import axios from 'axios';
export class MetalsSpike {
    name = 'MetalsSpike';
    type = 'financial';
    apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    async fetch() {
        try {
            console.log('[MetalsSpike] 🪙 Vacuuming precious metals...');
            // Alpha Vantage Commodities: GOLD, SILVER
            const commodities = ['GOLD', 'SILVER'];
            const requests = commodities.map(c => axios.get(`https://www.alphavantage.co/query?function=${c}&apikey=${this.apiKey}`)
                .catch(() => ({ data: { data: [] } })));
            const results = await Promise.all(requests);
            const rates = {};
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
        }
        catch (error) {
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
//# sourceMappingURL=MetalsSpike.js.map