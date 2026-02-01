import fetch from 'node-fetch';

/**
 * CoinGecko Connector (The Crypto Spike)
 * Fetches real-time price data for DreamNet's treasury assets.
 * Reports to: /api/ops/metrics
 */

const METRICS_ENDPOINT = 'http://localhost:3000/api/ops/metrics';
const ASSETS = ['bitcoin', 'ethereum', 'solana', 'polymarket'];

export async function fetchCryptoPulse() {
    try {
        console.log("🪙 CoinGecko: Sensing Market Pulse...");
        const ids = ASSETS.join(',');
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();

        // Report each asset
        for (const [id, metrics] of Object.entries(data)) {
            const price = (metrics as any).usd;
            const change = (metrics as any).usd_24h_change;

            await reportMetric(`crypto_price_${id}`, price, { asset: id, type: 'price' });
            await reportMetric(`crypto_change_${id}`, change, { asset: id, type: 'volatility' });

            console.log(`   > ${id.toUpperCase()}: $${price} (${change.toFixed(2)}%)`);
        }

    } catch (e: any) {
        console.error("⚠️ CoinGecko Pulse Skipped:", e.message);
    }
}

async function reportMetric(name: string, value: number, tags: any) {
    try {
        await fetch(METRICS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, value, tags })
        });
    } catch (e) {
        // Silent fail
    }
}

// Self-executing if run directly
if (process.argv[1].endsWith('coingecko.ts')) {
    fetchCryptoPulse();
}
