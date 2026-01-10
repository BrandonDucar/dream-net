import axios from 'axios';

const BEST_MINT = '8f1zccZPpbjz17Ay9wZKT5Mx2oPtUyxAVz5p5yzEbonk';
const DEXSCREENER_API = `https://api.dexscreener.com/latest/dex/tokens/${BEST_MINT}`;

async function calculateSwap() {
    try {
        console.log(`Fetching price for BEST (${BEST_MINT}) via DexScreener...`);
        const res = await axios.get(DEXSCREENER_API);
        const pair = res.data.pairs?.[0];

        if (!pair) throw new Error('Price not found on DexScreener');

        const price = parseFloat(pair.priceUsd);
        console.log(`Price: $${price}`);

        const targetUsd = 10;
        const tokensNeeded = targetUsd / price;
        console.log(`Tokens needed for $${targetUsd}: ${tokensNeeded}`);

        // Assuming 6 decimals based on "22000000 raw = 22 BEST" observation
        // CONFIRMED via screenshot: User had "-22 BEST".
        const decimals = 6;
        const rawAmount = Math.floor(tokensNeeded * Math.pow(10, decimals));

        console.log(`Raw Amount for Swap: ${rawAmount}`);
    } catch (e) {
        console.error(e);
    }
}

calculateSwap();
