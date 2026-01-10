import axios from 'axios';
export class SentimentSpike {
    name = 'SentimentSpike';
    type = 'news';
    apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
    async fetch() {
        try {
            console.log('[SentimentSpike] 🌍 Gauging World Sentiment...');
            // Alpha Vantage News & Sentiment
            const response = await axios.get(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL,GOOG,TSLA&apikey=${this.apiKey}`);
            const sentimentData = response.data;
            const articles = sentimentData.feed || [];
            // Average sentiment score across recent articles
            const avgSentiment = articles.length > 0
                ? articles.reduce((acc, curr) => acc + parseFloat(curr.overall_sentiment_score), 0) / articles.length
                : 0;
            let mood = 'Neutral';
            if (avgSentiment > 0.15)
                mood = 'Bullish';
            else if (avgSentiment < -0.15)
                mood = 'Bearish';
            return {
                source: 'Alpha-Vantage-Sentiment',
                data: {
                    average_sentiment_score: avgSentiment,
                    global_mood: mood,
                    top_stories: articles.slice(0, 3).map((a) => ({
                        title: a.title,
                        sentiment: a.overall_sentiment_label
                    })),
                    timestamp: Date.now()
                },
                timestamp: Date.now(),
                confidence: 0.9
            };
        }
        catch (error) {
            console.error('SentimentSpike Error:', error.message);
            return {
                source: 'Alpha-Vantage-Sentiment',
                data: { error: 'Failed to vacuum world sentiment' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
//# sourceMappingURL=SentimentSpike.js.map