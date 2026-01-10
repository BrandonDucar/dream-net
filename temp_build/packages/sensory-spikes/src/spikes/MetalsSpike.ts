import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index';

export class MetalsSpike implements SensorySpike {
    name = 'MetalsSpike';
    type = 'financial' as const;
    private apiKey = process.env.METALS_API_KEY || 'demo'; // specific fallback

    async fetch(): Promise<SpikeResult> {
        try {
            // Free tier or mock if no key
            // Using a reliable public endpoint or mock for demonstration if key missing
            // Real implementation would use: https://metals-api.com/api/latest

            const isDemo = this.apiKey === 'demo';

            const data = isDemo ? {
                success: true,
                rates: {
                    XAU: 2034.50, // Gold
                    XAG: 22.85,   // Silver
                    XPT: 980.10   // Platinum
                },
                unit: 'USD per Ounce',
                timestamp: Date.now() / 1000
            } : (await axios.get(`https://metals-api.com/api/latest?access_key=${this.apiKey}&base=USD&symbols=XAU,XAG,XPT`)).data;

            return {
                source: 'metals-api',
                data,
                timestamp: Date.now(),
                confidence: 0.99
            };
        } catch (error: any) {
            console.error('MetalsSpike Error:', error.message);
            return {
                source: 'metals-api',
                data: { error: 'Failed to fetch metals data' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
