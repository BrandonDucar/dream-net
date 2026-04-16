/**
 * WHALE SCRUBBER — The Leviathan Intelligence Unit
 *
 * "Know what the giants are doing before the giants know what they're doing."
 *
 * This agent continuously scrubs on-chain data, public APIs, and social feeds
 * to track the biggest traders across every market:
 *   - Crypto (on-chain wallets via Polygon, Arkham-style heuristics)
 *   - Equities (SEC Form 4 filings, 13F data)
 *   - Options (unusual options activity feeds)
 *   - Forex (COT reports — Commitment of Traders)
 *   - NFT markets (large floor sweeps)
 *
 * All scraped data → whale_db → Mirofish + Tartarian sims → signals
 *
 * The KNOWN TRADERS roster is seeded on boot. Add more as they're identified.
 */
import { ethers } from "ethers";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import {
  POLYGON_RPC, TOKENS, log, tgAlert
} from "../shared/config.mjs";
import { subscribeSpikes } from "../shared/spikes.mjs";
import { initDB, dbInsertSignal } from "../shared/db.mjs";
import {
  initWhaleDB, upsertTrader, logWhaleTrade,
  logWhaleSignal, getTraderHistory, getAllTraders
} from "../shared/whale-db.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../../.env") });

const AGENT = "WHALE_SCRUBBER";

// ─── The Roster: Known Biggest Traders ──────────────────────────────────────
// Each trader profile seeds the DB. The scrubber tracks and logs their moves.
const KNOWN_TRADERS = [
  // ── Crypto Legends ──
  {
    alias: "BELFORT",
    realName: "AI Archetype — The Strattonite",
    style: "pump_momentum",
    markets: ["crypto", "defi"],
    knownWallets: [],
    bio: "Momentum maniac. Story over fundamentals. Goes size on social heat.",
    riskLevel: "extreme",
  },
  {
    alias: "SBF",
    realName: "Archetype: The Altruistic Fraudster",
    style: "leverage_everything",
    markets: ["crypto", "defi", "options"],
    knownWallets: [
      "0xC098B2a3Aa256D2140208C3de6543aAEf5cd3A94", // FTX hot wallet (public)
    ],
    bio: "Effective altruism meets infinite leverage. Studies his history to learn what NOT to do.",
    riskLevel: "unhinged",
  },
  {
    alias: "SAYLOR",
    realName: "Archetype: The Bitcoin Maximalist",
    style: "infinite_buy_btc",
    markets: ["crypto", "equities"],
    knownWallets: [],
    bio: "Buys BTC on leverage. Sells equity to buy BTC. Repeats. Never sells.",
    riskLevel: "aggressive",
  },
  {
    alias: "DRUNKENMILLER",
    realName: "Archetype: The Macro Sorcerer",
    style: "macro_conviction",
    markets: ["equities", "forex", "commodities"],
    knownWallets: [],
    bio: "Concentrates massively into high-conviction macro bets. Rides trends until they die.",
    riskLevel: "aggressive",
  },
  {
    alias: "SIMONS",
    realName: "Archetype: The Quant God",
    style: "pure_quant",
    markets: ["equities", "futures", "forex", "crypto"],
    knownWallets: [],
    bio: "Mathematical pattern extraction. No opinions. Only statistics. Medallion fund mentality.",
    riskLevel: "tame",
  },
  {
    alias: "WOOD",
    realName: "Archetype: The Innovation Evangelist",
    style: "disruptive_long_only",
    markets: ["equities", "crypto"],
    knownWallets: [],
    bio: "Bets on 5-year disruptive tech. Ignores short-term noise. Conviction through drawdowns.",
    riskLevel: "aggressive",
  },
  {
    alias: "GRIFFIN",
    realName: "Archetype: The Citadel Titan",
    style: "multi_strat_hft",
    markets: ["equities", "options", "forex", "futures"],
    knownWallets: [],
    bio: "HFT + multi-strategy. Market-making while running directional books simultaneously.",
    riskLevel: "extreme",
  },
  {
    alias: "CHANOS",
    realName: "Archetype: The Professional Bear",
    style: "short_seller",
    markets: ["equities"],
    knownWallets: [],
    bio: "Short frauds. Short bubbles. Wait for the rats to leave the ship. Then bet against it.",
    riskLevel: "aggressive",
  },
  // ── On-Chain DeFi Whales ──
  {
    alias: "CURVE_WARS_WHALE",
    realName: "Anonymous DeFi Governance Whale",
    style: "liquidity_governance",
    markets: ["crypto", "defi"],
    knownWallets: [
      "0xd061D61a4d941c39E5453435B6345Dc261C2fcE0", // known Curve voter
    ],
    bio: "Controls millions in veCRV. Directs liquidity to own pools. Governance as weapon.",
    riskLevel: "extreme",
  },
  {
    alias: "JUMP_TRADING",
    realName: "Archetype: Jump Trading DeFi Desk",
    style: "hft_arb",
    markets: ["crypto", "defi", "futures"],
    knownWallets: [
      "0xF584F8728B874a6a5c7A8d4d387C9aae9172D621", // Jump Crypto hot wallet
    ],
    bio: "Market-maker, arb machine, and occasional protocol destabilizer. Speed is their god.",
    riskLevel: "extreme",
  },
];

// ─── Data sources the scrubber hits ─────────────────────────────────────────
const SOURCES = {
  // On-chain: Polygon large tx scanner (transactions > threshold)
  POLYGON_LARGE_TX_THRESHOLD_MATIC: 50_000, // flag anything > 50k MATIC

  // Public APIs (free tier, no key required)
  WHALE_ALERT_URL:    "https://api.whale-alert.io/v1/transactions", // needs key, graceful fallback
  ARKHAM_SEARCH_URL:  "https://api.arkhamintelligence.com/",        // needs key, graceful fallback

  // On-chain RPC scanning interval
  BLOCK_SCAN_INTERVAL_MS: 120_000, // every 2 min

  // Spike subscription
  SPIKE_CATEGORIES: ["financial", "social"],
};

// ─── Polygon on-chain whale scanner ─────────────────────────────────────────
async function scanPolygonWhales(provider) {
  const detections = [];
  try {
    const block = await provider.getBlock("latest", true);
    if (!block?.transactions) return detections;

    const threshold = BigInt(SOURCES.POLYGON_LARGE_TX_THRESHOLD_MATIC) * BigInt(1e18);

    for (const tx of block.transactions) {
      if (!tx || !tx.value) continue;
      if (BigInt(tx.value.toString()) >= threshold) {
        const maticVal = parseFloat(ethers.formatEther(tx.value));
        detections.push({
          txHash: tx.hash,
          from: tx.from,
          to: tx.to,
          maticVal,
          block: block.number,
        });
        log(AGENT, `🐋 LARGE TX: ${maticVal.toFixed(0)} MATIC | ${tx.from?.slice(0,10)}… → ${tx.to?.slice(0,10)}…`);
      }
    }
  } catch (err) {
    log(AGENT, `Block scan error: ${err.message}`, "WARN");
  }
  return detections;
}

// ─── Match a detected whale tx to a known trader ─────────────────────────────
async function matchToKnownTrader(detection, traders) {
  const fromLower = detection.from?.toLowerCase();
  const toLower   = detection.to?.toLowerCase();
  for (const trader of traders) {
    for (const wallet of (trader.known_wallets || [])) {
      if (wallet.toLowerCase() === fromLower || wallet.toLowerCase() === toLower) {
        return trader.alias;
      }
    }
  }
  return "UNKNOWN_WHALE";
}

// ─── Fetch on-chain token movement for known wallet ─────────────────────────
async function checkKnownWalletBalances(provider, traders) {
  for (const trader of traders) {
    for (const wallet of (trader.known_wallets || [])) {
      try {
        const bal = await provider.getBalance(wallet);
        const matic = parseFloat(ethers.formatEther(bal));
        if (matic > 1000) {
          log(AGENT, `📋 ${trader.alias} | ${wallet.slice(0,10)}… | ${matic.toFixed(0)} MATIC`);
          await logWhaleTrade({
            traderAlias: trader.alias,
            market: "onchain",
            instrument: "MATIC",
            side: "HOLD",
            sizeUsd: null,
            price: null,
            venue: "Polygon",
            txHash: null,
            source: "balance_scan",
            confidence: 0.5,
            rawData: { wallet, maticBalance: matic },
            tradedAt: new Date(),
          });
        }
      } catch { /* skip */ }
    }
  }
}

// ─── Social spike → infer whale sentiment ────────────────────────────────────
function inferWhaleSentimentFromSpike(spikeData, traderAlias) {
  if (!spikeData?.news?.articles) return null;
  const nameMap = {
    SAYLOR:  ["saylor", "microstrategy", "microbt", "strategy"],
    SBF:     ["sbf", "bankman-fried", "ftx", "alameda"],
    SIMONS:  ["simons", "renaissance", "medallion"],
    WOOD:    ["ark invest", "cathie wood", "cathie", "arkk"],
    GRIFFIN: ["citadel", "griffin", "ken griffin"],
    CHANOS:  ["chanos", "kynikos"],
    SAYLOR:  ["saylor", "microstrategy"],
    JUMP_TRADING: ["jump trading", "jump crypto"],
    BELFORT: ["penny stock", "pump", "momentum", "stratton"],
  };

  const keywords = nameMap[traderAlias] || [];
  const hits = (spikeData.news.articles || []).filter(a =>
    keywords.some(kw => (a.title + " " + (a.description || "")).toLowerCase().includes(kw))
  );
  return hits.length > 0 ? { hits: hits.slice(0, 3), count: hits.length } : null;
}

// ─── Main ────────────────────────────────────────────────────────────────────
let _socialSpike = null;
let _financialSpike = null;

async function run() {
  log(AGENT, "🔬 WHALE SCRUBBER online. Cleaning the ocean floor.");
  await initDB();
  await initWhaleDB();

  // Seed all known traders
  for (const trader of KNOWN_TRADERS) {
    await upsertTrader(trader);
    log(AGENT, `📌 Registered: ${trader.alias}`);
  }

  const provider = new ethers.JsonRpcProvider(POLYGON_RPC);

  // Subscribe to spikes for social/news intel
  await subscribeSpikes(["social", "financial"], (spike) => {
    if (spike.category === "social") _socialSpike = spike.data;
    if (spike.category === "financial") _financialSpike = spike.data;
  });

  let scanCount = 0;
  const SCAN_MS = SOURCES.BLOCK_SCAN_INTERVAL_MS;

  const tick = async () => {
    scanCount++;
    log(AGENT, `=== Whale Scrub #${scanCount} ===`);

    try {
      const traders = await getAllTraders();

      // 1. On-chain: scan latest block for large transactions
      const largeTxs = await scanPolygonWhales(provider);
      for (const tx of largeTxs) {
        const alias = await matchToKnownTrader(tx, traders);
        await logWhaleTrade({
          traderAlias: alias,
          market: "onchain",
          instrument: "MATIC",
          side: tx.maticVal > 0 ? "TRANSFER" : "TRANSFER",
          sizeUsd: null,
          price: null,
          venue: "Polygon",
          txHash: tx.txHash,
          source: "block_scan",
          confidence: alias === "UNKNOWN_WHALE" ? 0.4 : 0.85,
          rawData: tx,
          tradedAt: new Date(),
        });
        if (alias !== "UNKNOWN_WHALE") {
          log(AGENT, `🎯 Matched large tx to ${alias}: ${tx.maticVal.toFixed(0)} MATIC`);
          await tgAlert(`🐋 <b>${alias}</b> moving on-chain\n${tx.maticVal.toFixed(0)} MATIC | TX: ${tx.txHash?.slice(0,16)}…`);
        }
      }

      // 2. Check known wallet balances
      await checkKnownWalletBalances(provider, traders);

      // 3. Cross-reference social spikes with trader names
      for (const trader of traders) {
        const newsMention = inferWhaleSentimentFromSpike(_socialSpike, trader.alias);
        if (newsMention) {
          log(AGENT, `📰 ${trader.alias} mentioned in ${newsMention.count} news article(s)`);
          await logWhaleTrade({
            traderAlias: trader.alias,
            market: "social",
            instrument: "NEWS_MENTION",
            side: "MENTIONED",
            sizeUsd: null,
            price: null,
            venue: "NewsAPI",
            source: "social_spike",
            confidence: 0.6,
            rawData: { articles: newsMention.hits },
            tradedAt: new Date(),
          });

          // Generate WATCH signal
          await logWhaleSignal({
            traderAlias: trader.alias,
            signalType: "WATCH",
            instrument: "NEWS",
            reasoning: `${trader.alias} in ${newsMention.count} news stories — monitor for market-moving action`,
            strength: Math.min(newsMention.count * 0.2, 0.9),
            sourceSim: "news_spike",
            expiresAt: Date.now() + 60 * 60 * 1000, // 1hr
          });
        }
      }

      // 4. Crypto price moves → infer who might be moving what
      const cryptoData = _financialSpike?.CryptoSpike;
      if (cryptoData) {
        const btcChg  = cryptoData.bitcoin?.usd_24h_change ?? 0;
        const maticChg = cryptoData["matic-network"]?.usd_24h_change ?? 0;

        // SAYLOR-style: BTC up big → he's probably buying
        if (btcChg > 8) {
          await logWhaleSignal({
            traderAlias: "SAYLOR",
            signalType: "FOLLOW",
            instrument: "BTC",
            reasoning: `BTC up ${btcChg.toFixed(1)}% — SAYLOR archetype: accumulating. Follow the infinite bid.`,
            strength: Math.min(btcChg / 20, 1.0),
            sourceSim: "financial_spike",
            expiresAt: Date.now() + 4 * 60 * 60 * 1000,
          });
          await dbInsertSignal({ agent: AGENT, type: "FOLLOW", pair: "BTC", strength: btcChg / 20, details: { trader: "SAYLOR", chg: btcChg }, spikeSource: "CryptoSpike" });
        }

        // CHANOS-style: Any asset down >15% → short signal
        if (maticChg < -15) {
          await logWhaleSignal({
            traderAlias: "CHANOS",
            signalType: "FADE",
            instrument: "MATIC",
            reasoning: `MATIC down ${Math.abs(maticChg).toFixed(1)}% — CHANOS archetype: something is wrong structurally.`,
            strength: Math.min(Math.abs(maticChg) / 30, 1.0),
            sourceSim: "financial_spike",
            expiresAt: Date.now() + 2 * 60 * 60 * 1000,
          });
        }
      }

      log(AGENT, `Scrub #${scanCount} complete. ${largeTxs.length} large tx(s) detected.`);

    } catch (err) {
      log(AGENT, `Scrub error: ${err.message}`, "ERROR");
    }

    setTimeout(tick, SCAN_MS);
  };

  await tick();
}

run().catch(err => {
  console.error("[WHALE_SCRUBBER FATAL]", err);
  process.exit(1);
});
