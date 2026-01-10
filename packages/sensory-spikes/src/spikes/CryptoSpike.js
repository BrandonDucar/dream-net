import axios from 'axios';
export class CryptoSpike {
    name = 'CryptoSpike';
    type = 'financial';
    // Core Target Tokens
    targets = [
        { id: 'solana', symbol: 'SOL' },
        { id: 'bitcoin', symbol: 'BTC' },
        { id: 'ethereum', symbol: 'ETH' },
        { id: 'usd-coin', symbol: 'USDC' },
        { id: 'matic-network', symbol: 'POL' }
    ];
    // Specialized "Alpha" Tokens (DreamNet Specific)
    alphaTargets = [
        { address: 'WENWENvrsS19ovPLas7zFispD4X3TogS4V2WvM89t.A', symbol: 'WEN', chain: 'solana' },
        { address: 'BESTW... (Placeholder)', symbol: 'BEST', chain: 'solana' }
    ];
    async fetch() {
        try {
            console.log('[CryptoSpike] 📡 Vacuuming global crypto sentiment and prices...');
            // 1. CoinGecko (Macro Sentiment)
            const coingeckoP = axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,matic-network&vs_currencies=usd&include_24hr_change=true').catch(() => ({ data: {} }));
            // 2. Jupiter Price API (Solana Precision)
            const jupiterP = axios.get('https://api.jupiter.ag/price/v2?ids=SOL,USDC,WEN,JLP').catch(() => ({ data: { data: {} } }));
            // 3. DexScreener (Base/Polygon Alpha)
            // We scan the latest high-volume pairs on Base to avoid blindness
            const dexscreenerP = axios.get('https://api.dexscreener.com/latest/dex/tokens/eth,usdc').catch(() => ({ data: { pairs: [] } }));
            const [cg, jup, dex] = await Promise.all([coingeckoP, jupiterP, dexscreenerP]);
            const mergedData = {
                macro: cg.data,
                precision: jup.data.data,
                alpha_liquidity: dex.data.pairs?.slice(0, 5), // Top 5 pairs for sentiment
                timestamp: Date.now()
            };
            return {
                source: 'multi-chain-vacuum',
                data: mergedData,
                timestamp: Date.now(),
                confidence: cg.data ? 0.95 : 0.7
            };
        }
        catch (error) {
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
//# sourceMappingURL=CryptoSpike.js.map