import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class SentimentSpike implements SensorySpike {
    name = 'SentimentSpike';
    type = 'news' as const;
    private apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

    async fetch(): Promise<SpikeResult> {
        try {
            console.log('[SentimentSpike] 🌍 Gauging World Sentiment...');

            // Alpha Vantage News & Sentiment
            const response = await axios.get(
                `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL,GOOG,TSLA&apikey=${this.apiKey}`
            );

            const sentimentData = response.data;
            const articles = sentimentData.feed || [];

            // Average sentiment score across recent articles
            const avgSentiment = articles.length > 0
                ? articles.reduce((acc: number, curr: any) => acc + parseFloat(curr.overall_sentiment_score), 0) / articles.length
                : 0;

            let mood = 'Neutral';
            if (avgSentiment > 0.15) mood = 'Bullish';
            else if (avgSentiment < -0.15) mood = 'Bearish';

            return {
                source: 'Alpha-Vantage-Sentiment',
                data: {
                    average_sentiment_score: avgSentiment,
                    global_mood: mood,
                    top_stories: articles.slice(0, 3).map((a: any) => ({
                        title: a.title,
                        sentiment: a.overall_sentiment_label
                    })),
                    timestamp: Date.now()
                },
                timestamp: Date.now(),
                confidence: 0.9
            };
        } catch (error: any) {
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
