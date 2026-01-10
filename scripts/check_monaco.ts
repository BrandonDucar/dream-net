const axios = require('axios');
const { solanaTreasury } = require('../packages/server/dist/services/SolanaTreasuryService.js');

async function probe() {
    console.log("🔥 IGNITING DUTCH OVEN...");

    // 1. Check Bankroll
    console.log("\n[1/3] Checking Wallet Balance...");
    try {
        const balances = await solanaTreasury.scanBalances();
        console.log("   🏦 Wallet Contents:", JSON.stringify(balances, null, 2));
    } catch (e) {
        console.log("   ❌ Wallet Error:", e.message);
    }

    // 2. Probe BetDEX API
    console.log("\n[2/3] Probing Monaco Protocol (via BetDEX)...");
    const endpoints = [
        'https://api.betdex.com/v1/markets',
        'https://monaco-protocol-api.dev.betdex.com/v1/markets' // Try dev/alt url?
    ];

    for (const url of endpoints) {
        try {
            console.log(`   📡 Pinging ${url}...`);
            const res = await axios.get(url, { timeout: 3000 });
            console.log(`   ✅ SUCCESS: Found ${res.data?.length || 0} markets.`);
            if (res.data && res.data.length > 0) {
                console.log("   🎲 Sample Market:", res.data[0].title || res.data[0].question);
            }
        } catch (e) {
            console.log(`   ❌ FAILED (${e.message})`);
        }
    }

    // 3. Probe Polymarket (Backup)
    console.log("\n[3/3] Probing Polymarket (Polygon)...");
    try {
        const query = `
            {
                fixedProductMarketMakers(first: 3, orderBy: creationTimestamp, orderDirection: desc) {
                    title
                    id
                }
            }
        `;
        const res = await axios.post('https://api.thegraph.com/subgraphs/name/tokenunion/polymarket-matic', { query });
        const markets = res.data?.data?.fixedProductMarketMakers || [];
        console.log(`   ✅ SUCCESS: Found ${markets.length} markets.`);
        if (markets.length > 0) console.log(`   🎲 Sample: "${markets[0].title}"`);
    } catch (e) {
        console.log(`   ❌ FAILED (${e.message})`);
    }
}

probe();
