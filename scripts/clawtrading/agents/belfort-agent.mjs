/**
 * BELFORT — The Strattonite
 *
 * "Act as if. Act as if you are the most confident trader in the room.
 *  Act as if the market owes you money. It does."
 * — BELFORT (this AI agent, not a real person, obviously)
 *
 * Original fictional AI trading character. Inspired by the archetype of
 * the high-pressure, high-conviction, pump-it-to-the-moon penny stock
 * evangelist. Except BELFORT operates on DeFi markets, not cold calls.
 * He reads whale activity, finds the most pumped instrument with the
 * most social heat, and goes in HEAVY with hard stop-losses so he
 * doesn't actually go to prison (this time).
 *
 * Behavioral DNA (from the real archetype):
 *   - Momentum-first: He doesn't trade value, he trades STORY.
 *   - Size conviction: Small position? Peasant thinking. GO SIZE.
 *   - Hard entry/exit: He knows exactly when to drop it and run.
 *   - Social signal reader: If Twitter is screaming, BELFORT is already in.
 *   - Never holds through catastrophe: Stop-loss is non-negotiable religion.
 *   - Works the room: Broadcasts signals to the whole team.
 *
 * Role: Momentum + social spike reader. Identifies explosive instruments,
 * sizes into them fast, and gets out clean. Feeds signals to GEKKO + SOROS_BOT.
 */
import { ethers } from "ethers";
import {
  POLYGON_RPC, TOKENS, RISK,
  getPrice, log, tgAlert
} from "../shared/config.mjs";
import { writeSignals, readPnL } from "../shared/state.mjs";
import { subscribeSpikes } from "../shared/spikes.mjs";
import { initDB, dbInsertSignal, dbInsertSpikeEvent } from "../shared/db.mjs";
import { upsertTrader, logWhaleTrade, logWhaleSignal, initWhaleDB } from "../shared/whale-db.mjs";

const AGENT = "BELFORT";

// ─── BELFORT's Behavioral Constants ────────────────────────────────────────
const DNA = {
  MIN_SENTIMENT_SCORE:  0.65,  // won't touch it unless the room is HOT
  MIN_MOMENTUM_PCT:      5.0,  // needs 5%+ move in 24h to even look
  CONVICTION_MULTIPLIER: 1.8,  // BELFORT sizes 80% bigger than risk limits say
  SOCIAL_SPIKE_WEIGHT:   0.4,  // 40% of signal strength is pure social heat
  EXIT_COLD_BARS:           3, // exits after 3 quiet intervals (no momentum)
  BROADCAST_TO_TEAM:      true,// pushes signals to GEKKO + SOROS_BOT
};

// ─── Whale targets BELFORT tracks on-chain (Polygon/Base) ──────────────────
const WHALE_WALLETS_TO_WATCH = [
  // Large known DeFi momentum wallets on Polygon (public addresses)
  "0x4d1C297D39C5c1277964D0E3f8Aa901493664530", // known MATIC whale
  "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0", // Polygon bridge hot wallet
  "0xab5801a7d398351b8be11c439e05c5b3259aec9b", // known influencer wallet
];

// ─── Sentiment scoring from social spikes ──────────────────────────────────
function scoreSentiment(spikeData) {
  if (!spikeData) return 0;
  const { sentiment, reddit, news } = spikeData;
  let score = 0;
  let factors = 0;

  // Reddit engagement
  if (reddit?.topPost?.score > 5000) { score += 0.9; factors++; }
  else if (reddit?.topPost?.score > 1000) { score += 0.6; factors++; }
  else if (reddit?.topPost?.score > 100) { score += 0.3; factors++; }

  // News sentiment
  if (news?.articles?.[0]) {
    const titles = news.articles.slice(0, 5).map(a => a.title?.toLowerCase() || "").join(" ");
    const bullWords = ["surge", "pump", "explode", "moon", "soar", "rally", "breakout", "all-time", "ath"];
    const hitCount = bullWords.filter(w => titles.includes(w)).length;
    score += Math.min(hitCount * 0.15, 0.6);
    factors++;
  }

  // Sentiment score if provided
  if (typeof sentiment?.score === "number") {
    score += sentiment.score;
    factors++;
  }

  return factors > 0 ? Math.min(score / factors, 1.0) : 0;
}

// ─── Momentum scoring from financial spikes ─────────────────────────────────
function scoreMomentum(cryptoData, targetTokens = ["matic-network", "bitcoin", "ethereum"]) {
  const results = [];
  for (const id of targetTokens) {
    const token = cryptoData?.[id];
    if (!token) continue;
    const chg24h = token.usd_24h_change ?? 0;
    const chg7d  = token.usd_7d_change  ?? 0;
    const price  = token.usd ?? 0;
    const vol    = token.usd_24h_vol ?? 0;

    if (chg24h >= DNA.MIN_MOMENTUM_PCT) {
      results.push({
        token: id,
        price,
        chg24h,
        chg7d,
        volume: vol,
        momentumScore: Math.min(chg24h / 30, 1.0), // normalize to 0-1 at 30% = max
      });
    }
  }
  return results.sort((a, b) => b.momentumScore - a.momentumScore);
}

// ─── On-chain whale watch (Polygon) ─────────────────────────────────────────
async function scanWhaleWallets(provider) {
  const alerts = [];
  for (const addr of WHALE_WALLETS_TO_WATCH) {
    try {
      const bal = await provider.getBalance(addr);
      const matic = parseFloat(ethers.formatEther(bal));
      if (matic > 10_000) {
        alerts.push({ address: addr, maticBal: matic });
        log(AGENT, `🐋 Whale wallet ${addr.slice(0, 10)}… holds ${matic.toFixed(0)} MATIC`);
      }
    } catch { /* skip */ }
  }
  return alerts;
}

// ─── Main state ─────────────────────────────────────────────────────────────
let _socialContext  = {};
let _financialContext = {};
let _quietBars = {};

async function run() {
  log(AGENT, "🐺 BELFORT online. The market is a telephone. I am the voice.");
  await initDB();
  await initWhaleDB();

  const provider = new ethers.JsonRpcProvider(POLYGON_RPC);

  // Register BELFORT's profile in the whale DB
  await upsertTrader({
    alias: "BELFORT",
    realName: "AI Archetype — The Strattonite",
    style: "pump_momentum",
    markets: ["crypto", "defi", "onchain"],
    knownWallets: [],
    bio: "High-conviction momentum AI. Reads social heat + price action. Goes size on breakouts. Hard stops.",
    riskLevel: "extreme",
  });

  // Subscribe to social spikes for sentiment
  await subscribeSpikes(["social"], (spike) => {
    _socialContext[spike.spikeName] = spike.data;
    dbInsertSpikeEvent({ spikeName: spike.spikeName, category: "social", data: spike.data, confidence: spike.confidence }).catch(() => {});
  });

  // Subscribe to financial spikes for momentum
  await subscribeSpikes(["financial"], (spike) => {
    _financialContext[spike.spikeName] = spike.data;
    dbInsertSpikeEvent({ spikeName: spike.spikeName, category: "financial", data: spike.data, confidence: spike.confidence }).catch(() => {});
  });

  const SCAN_MS = 45_000;
  let scanCount = 0;

  const tick = async () => {
    scanCount++;
    log(AGENT, `=== BELFORT scan #${scanCount} — reading the room ===`);

    try {
      // 1. Score momentum from crypto data
      const cryptoData = _financialContext?.CryptoSpike;
      const movers = scoreMomentum(cryptoData);

      // 2. Score social heat
      const sentimentScore = scoreSentiment(_socialContext);

      // 3. Scan whale wallets on-chain
      const whales = await scanWhaleWallets(provider);

      // 4. Build signals for anything that passes BELFORT's filters
      const signals = [];

      for (const mover of movers) {
        const combinedScore = (mover.momentumScore * (1 - DNA.SOCIAL_SPIKE_WEIGHT))
                            + (sentimentScore * DNA.SOCIAL_SPIKE_WEIGHT);

        if (combinedScore < DNA.MIN_SENTIMENT_SCORE) {
          log(AGENT, `${mover.token}: score ${combinedScore.toFixed(2)} too cold. Not BELFORT's style.`);
          continue;
        }

        // Check if we've been watching this and it went cold
        if (_quietBars[mover.token]) {
          _quietBars[mover.token]++;
          if (_quietBars[mover.token] >= DNA.EXIT_COLD_BARS) {
            log(AGENT, `${mover.token}: gone cold after ${_quietBars[mover.token]} scans. Out.`, "WARN");
            delete _quietBars[mover.token];
            continue;
          }
        } else {
          _quietBars[mover.token] = 0;
        }

        const signal = {
          type: "MOMENTUM",
          source: AGENT,
          token: mover.token,
          direction: "LONG",
          chg24h: mover.chg24h,
          price: mover.price,
          momentumScore: mover.momentumScore,
          sentimentScore,
          combinedScore,
          conviction: Math.min(combinedScore * DNA.CONVICTION_MULTIPLIER, 1.0),
          whaleBacking: whales.length > 0,
          ts: Date.now(),
        };

        signals.push(signal);
        log(AGENT, `🔥 SIGNAL: ${mover.token} +${mover.chg24h.toFixed(1)}% | sentiment ${sentimentScore.toFixed(2)} | conviction ${signal.conviction.toFixed(2)}`);

        // Log to whale DB as a signal
        await logWhaleSignal({
          traderAlias: "BELFORT",
          signalType: "FOLLOW",
          instrument: mover.token,
          reasoning: `Momentum +${mover.chg24h.toFixed(1)}%, social heat ${sentimentScore.toFixed(2)}, ${whales.length} whale wallets hot`,
          strength: signal.conviction,
          sourceSim: "belfort-scan",
          expiresAt: Date.now() + 15 * 60 * 1000,
        });

        // Persist to main signals DB
        await dbInsertSignal({
          agent: AGENT,
          type: "MOMENTUM",
          pair: mover.token,
          strength: signal.conviction,
          details: signal,
          spikeSource: "CryptoSpike+SocialSpike",
        });
      }

      // 5. Broadcast to team if anything hot
      if (signals.length > 0 && DNA.BROADCAST_TO_TEAM) {
        await writeSignals(signals);
        await tgAlert(
          `🐺 <b>BELFORT SIGNAL${signals.length > 1 ? "S" : ""}</b>\n` +
          signals.map(s =>
            `• <b>${s.token}</b> +${s.chg24h.toFixed(1)}% | conviction ${(s.conviction * 100).toFixed(0)}%${s.whaleBacking ? " 🐋" : ""}`
          ).join("\n") +
          `\n\n<i>"The sale begins when the customer says no."</i>`
        );
      } else if (signals.length === 0) {
        log(AGENT, "No hot signals. BELFORT waits for the room to get loud.");
      }

      // 6. Daily P&L sanity check
      const pnl = readPnL();
      if (pnl.dailyPnlUSDC <= -RISK.DAILY_LOSS_LIMIT_USDC) {
        log(AGENT, "🛑 Daily loss limit. Even BELFORT knows when to shut up.", "ERROR");
        await tgAlert(`🛑 <b>BELFORT circuit breaker</b>\nDaily loss: $${pnl.dailyPnlUSDC}\n<i>"Sometimes you gotta fold."</i>`);
      }

    } catch (err) {
      log(AGENT, `Scan error: ${err.message}`, "ERROR");
    }

    setTimeout(tick, SCAN_MS);
  };

  await tick();
}

run().catch(err => {
  console.error("[BELFORT FATAL — the feds finally caught up]", err);
  process.exit(1);
});
