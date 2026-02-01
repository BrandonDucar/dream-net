import axios from 'axios';
import { SensorySpike, SpikeResult } from '../index.js';

export class CryptoSpike implements SensorySpike {
    name = 'CryptoSpike';
    type = 'financial' as const;

    // Core Target Tokens
    private targets = [
        { id: 'solana', symbol: 'SOL' },
        { id: 'bitcoin', symbol: 'BTC' },
        { id: 'ethereum', symbol: 'ETH' },
        { id: 'usd-coin', symbol: 'USDC' },
        { id: 'matic-network', symbol: 'POL' }
    ];

    // Specialized "Alpha" Tokens (DreamNet Specific)
    private alphaTargets = [
        { address: 'WENWENvrsS19ovPLas7zFispD4X3TogS4V2WvM89t.A', symbol: 'WEN', chain: 'solana' },
        { address: 'BESTW... (Placeholder)', symbol: 'BEST', chain: 'solana' }
    ];

    async fetch(): Promise<SpikeResult> {
        try {
            console.log('[CryptoSpike] 📡 Vacuuming global crypto sentiment and prices...');

            // 1. CoinGecko (Wide Mode - Top 100)
            const coingeckoP = axios.get(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
            ).catch(() => ({ data: [] }));

            // 2. Jupiter Price API (Solana Precision)
            const jupiterP = axios.get(
                'https://api.jupiter.ag/price/v2?ids=SOL,USDC,WEN,JLP'
            ).catch(() => ({ data: { data: {} } }));

            // 3. DexScreener (Base/Polygon/Solana Alpha)
            const dexscreenerP = axios.get(
                'https://api.dexscreener.com/latest/dex/search?q=solana'
            ).catch(() => ({ data: { pairs: [] } }));

            const [cg, jup, dex] = await Promise.all([coingeckoP, jupiterP, dexscreenerP]);

            const mergedData = {
                macro: cg.data || [],
                precision: jup.data?.data || {},
                alpha_liquidity: dex.data?.pairs?.slice(0, 10) || [],
                timestamp: Date.now()
            };

            return {
                source: 'multi-chain-vacuum',
                data: mergedData,
                timestamp: Date.now(),
                confidence: cg.data ? 0.95 : 0.7
            };
        } catch (error: any) {
            console.error('CryptoSpike Error:', error.message);
            return {
                source: 'multi-chain-vacuum',
                data: { error: 'Failed to vacuum crypto streams' },
                timestamp: Date.now(),
                confidence: 0
            };
        }
    }
}
