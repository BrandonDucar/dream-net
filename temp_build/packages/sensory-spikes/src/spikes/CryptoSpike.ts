import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index';

export class CryptoSpike implements SensorySpike {
    name = 'CryptoSpike';
    type = 'financial' as const;

    async fetch(): Promise<SpikeResult> {
        try {
            // CoinGecko API (Free tier has rate limits, handle gracefully)
            const response = await axios.get(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,chainlink&vs_currencies=usd&include_24hr_change=true'
            );

            return {
                source: 'coingecko',
                data: response.data,
                timestamp: Date.now(),
                confidence: 0.95
            };
        } catch (error: any) {
            console.error('CryptoSpike Error:', error.message);
            return {
                source: 'coingecko',
                data: { error: 'Failed to fetch crypto prices' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
