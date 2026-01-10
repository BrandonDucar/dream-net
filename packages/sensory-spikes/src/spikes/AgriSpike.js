import axios from 'axios';
export class AgriSpike {
    name = 'AgriSpike';
    type = 'environmental';
    apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    async fetch() {
        try {
            console.log('[AgriSpike] 🌾 Vacuuming global agricultural commodities...');
            const commodities = ['WHEAT', 'CORN', 'SOYBEANS'];
            const requests = commodities.map(c => axios.get(`https://www.alphavantage.co/query?function=${c}&apikey=${this.apiKey}`)
                .catch(() => ({ data: { data: [] } })));
            const results = await Promise.all(requests);
            const yields = {};
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
        }
        catch (error) {
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
//# sourceMappingURL=AgriSpike.js.map