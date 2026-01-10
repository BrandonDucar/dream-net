import axios from 'axios';
export class GeopoliticalSpike {
    name = 'GeopoliticalSpike';
    type = 'news';
    newsApiKey = process.env.NEWS_API_KEY || '';
    async fetch() {
        try {
            console.log('[GeopoliticalSpike] 🕊️ Analyzing world risk and geopolitical tension...');
            // 1. GDELT (Global Database of Events, Language, and Tone) - Lightweight Feed
            // We use their summary search for "conflict" or "unrest"
            const gdeltP = axios.get('https://api.gdeltproject.org/api/v2/doc/doc?query=(conflict%20OR%20unrest%20OR%20election)&mode=artlist&format=json&maxresults=5').catch(() => ({ data: { articles: [] } }));
            // 2. NewsAPI Risk Sweep
            const newsP = this.newsApiKey ? axios.get(`https://newsapi.org/v2/everything?q=(war%20OR%20crisis%20OR%20embargo)&sortBy=publishedAt&pageSize=5&apiKey=${this.newsApiKey}`).catch(() => ({ data: { articles: [] } })) : Promise.resolve({ data: { articles: [] } });
            const [gdelt, news] = await Promise.all([gdeltP, newsP]);
            const riskSignals = [
                ...(gdelt.data.articles || []).map((a) => a.title),
                ...(news.data.articles || []).map((a) => a.title)
            ];
            return {
                source: 'GDELT-NewsAPI-Risk-Merge',
                data: {
                    detected_risks: riskSignals,
                    risk_level: riskSignals.length > 5 ? 'ELEVATED' : 'NORMAL',
                    timestamp: Date.now()
                },
                timestamp: Date.now(),
                confidence: 0.85
            };
        }
        catch (error) {
            console.error('GeopoliticalSpike Error:', error.message);
            return {
                source: 'GDELT-Risk-Sweep',
                data: { error: 'Failed to vacuum geopolitical risk' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
//# sourceMappingURL=GeopoliticalSpike.js.map