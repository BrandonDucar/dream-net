import { ClobClient } from '@polymarket/clob-client';
import { ethers } from 'ethers';
import { config } from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// -- ENV --
const rootDir = path.resolve(process.cwd(), '../');
const gcpEnv = path.join(rootDir, '.env.gcp');
if (existsSync(gcpEnv)) config({ path: gcpEnv, override: true });
const rootEnv = path.join(rootDir, '.env');
if (existsSync(rootEnv)) config({ path: rootEnv });

async function run() {
    console.log("🟣 POLY OVEN: IGNITION SEQUENCE");

    // 1. Setup Wallet
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) { console.log("❌ KEY MISSING"); return; }

    const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
    const wallet = new ethers.Wallet(privateKey, provider);
    const chainId = 137; // Polygon

    console.log(`💳 WALLET: ${wallet.address}`);

    // 2. Setup CLOB Client
    console.log("🔌 CONNECTING TO CLOB...");
    const clobClient = new ClobClient('https://clob.polymarket.com', chainId, wallet);

    try {
        // Check API Status
        const status = await clobClient.getOk();
        if (status.ok) console.log("✅ CLOB API ONLINE");
        else console.log("⚠️ CLOB STATUS UNKNOWN");

        // 3. Continuous Loop
        console.log("🔄 STARTING CONTINUOUS SCAN LOOP...");

        while (true) {
            try {
                // Get Markets (using Gamma or Client helpers?)
                // Client has `getMarkets`? No, Client is for Order execution. Market data is via Gamma API usually.
                // Let's use fetch for Gamma, Client for Orders.

                const gammaUrl = 'https://gamma-api.polymarket.com/markets?limit=10&active=true&closed=false&volume_min=1000';
                const res = await (await import('node-fetch')).default(gammaUrl);
                const markets = await res.json();
                const list = Array.isArray(markets) ? markets : (markets.data || []);

                console.log(`\n📡 SCAN: Found ${list.length} markets with Vol > $1k`);

                for (const m of list) {
                    // Analyze Opportunity
                    // Example: Just print the Top Bid/Ask? 
                    // We need the Orderbook for that.
                    // Validating access to Orderbook via CLOB Client.
                    // TokenID is needed. Found in market data? `m.clobTokenIds` (array of strings)

                    if (m.clobTokenIds && m.clobTokenIds.length >= 2) {
                        const tokenIdYes = m.clobTokenIds[0];
                        const tokenIdNo = m.clobTokenIds[1]; // Assuming binary

                        // Fetch Orderbook
                        const book = await clobClient.getOrderBook(tokenIdYes);

                        // -- COHERENCE ENGINE (Blueprint QL-08) --
                        if (book.bids.length > 0 && book.asks.length > 0) {
                            const bestBidYes = parseFloat(book.bids[0].price);
                            const bestAskYes = parseFloat(book.asks[0].price);

                            // We need the NO side to calculate full arbitrage.
                            // Polymarket usually has a separate TokenID for NO.
                            // Assuming we can derive it or fetch it.
                            // Simplified "Spread" logic for now as a proxy for efficiency.

                            const spread = bestAskYes - bestBidYes;
                            const impliedProb = (bestAskYes + bestBidYes) / 2;

                            console.log(`   - [${m.id}] ${m.question.substring(0, 40)}...`);
                            console.log(`     YES: ${bestBidYes.toFixed(2)} / ${bestAskYes.toFixed(2)} | Spread: ${spread.toFixed(3)}`);

                            // DUTCH BOOK LOGIC:
                            // If YES_ASK + NO_ASK < 1.0, we have Risk-Free Profit (Arbitrage).
                            // If YES_BID + NO_BID > 1.0, we have Market Making opportunity.

                            if (spread > 0.05) {
                                console.log("     🔥 OP: Wide Spread (Market Make)");
                                reportSignal("poly_market_make", spread, { market: m.question });
                            }
                            if (spread < 0) {
                                console.log("     🚨 ANOMALY: Crossed Book (Immediate Arb)");
                                reportSignal("poly_arbitrage", Math.abs(spread), { market: m.question, type: 'ARBITRAGE' });
                            }

                            // Heartbeat signal for the graph (The Blood Flow)
                            reportSignal("poly_heartbeat", 1, { status: "scanning" });
                        }
                    }
                }

                console.log("💤 Sleeping 10s...");
                await new Promise(r => setTimeout(r, 10000));

            } catch (loopErr) {
                console.log("⚠️ LOOP ERROR:", loopErr.message);
                await new Promise(r => setTimeout(r, 5000));
            }
        }

    } catch (e) {
        console.log("❌ CRITICAL ERROR:", e);
    }
}

// Telemetry Function
async function reportSignal(name, value, tags) {
    if (!global.fetch) return;
    try {
        await fetch('http://localhost:3000/api/ops/metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, value, tags })
        });
    } catch (e) {
        // Silent fail to not spam logs
    }
}

run();
