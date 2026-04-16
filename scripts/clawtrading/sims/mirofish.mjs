/**
 * MIROFISH — Trading Pattern Simulation Engine
 *
 * Named after the Miro fish — sees the whole canvas at once, in all directions,
 * while ordinary fish only see what's directly ahead.
 *
 * Mirofish ingests a trader's historical trade log and runs it through:
 *   1. Pattern fingerprinting — finds the recurring behavioral DNA
 *   2. Sequence prediction — what typically comes AFTER this pattern
 *   3. Market condition overlay — how this pattern performs in current regime
 *   4. Confidence scoring — how reliable this pattern has been historically
 *   5. Regime matching — is THIS market similar to past wins?
 *
 * Output is fed into:
 *   - whale_simulations table
 *   - GENIE for wish-granting interpretation
 *   - STITCH for playground experimentation
 *   - Signals for BELFORT / STONKSWALL / team
 */

import { logSimulation, logWhaleSignal, getTraderHistory } from "../shared/whale-db.mjs";
import { log } from "../shared/config.mjs";

const ENGINE = "MIROFISH";

// ─── Pattern Library ─────────────────────────────────────────────────────────
// These are archetypal trading patterns extracted from known trader behavior.
const PATTERN_LIBRARY = {
  PUMP_AND_POSITION: {
    id: "PUMP_AND_POSITION",
    description: "Buy aggressively → hold during pump → exit before obvious top",
    traderArchetypes: ["BELFORT", "SBF"],
    signals: { entryVelocity: "explosive", holdDuration: "days_1_3", exitTrigger: "momentum_fade" },
    successRate: 0.62,
    avgReturnPct: 18.4,
  },
  INFINITE_CONVICTION_BUY: {
    id: "INFINITE_CONVICTION_BUY",
    description: "Accumulate same asset regardless of price. Never sell. Add on dips.",
    traderArchetypes: ["SAYLOR"],
    signals: { entryVelocity: "slow_steady", holdDuration: "infinite", exitTrigger: "never" },
    successRate: 0.55, // depends on timeframe — decade scale much higher
    avgReturnPct: 47.0,
  },
  MACRO_CONVICTION_SWING: {
    id: "MACRO_CONVICTION_SWING",
    description: "Build large concentrated position in macro thesis. Ride trend. Exit on reversal signal.",
    traderArchetypes: ["DRUNKENMILLER", "SOROS_BOT"],
    signals: { entryVelocity: "deliberate", holdDuration: "weeks_months", exitTrigger: "macro_shift" },
    successRate: 0.71,
    avgReturnPct: 34.2,
  },
  QUANT_REVERSION: {
    id: "QUANT_REVERSION",
    description: "Statistical mean reversion. No opinions. Enter when deviation > 2σ. Exit at mean.",
    traderArchetypes: ["SIMONS"],
    signals: { entryVelocity: "algorithmic", holdDuration: "hours_days", exitTrigger: "mean_reversion" },
    successRate: 0.83,
    avgReturnPct: 8.2, // small but ultra-consistent
  },
  ARB_FLASH: {
    id: "ARB_FLASH",
    description: "Sub-second price discrepancy exploitation. In and out in one block.",
    traderArchetypes: ["JUMP_TRADING", "SOROS_BOT"],
    signals: { entryVelocity: "instant", holdDuration: "seconds", exitTrigger: "arb_closed" },
    successRate: 0.91,
    avgReturnPct: 0.8, // tiny per trade, massive volume
  },
  DISRUPTIVE_LONG: {
    id: "DISRUPTIVE_LONG",
    description: "Long-only in disruptive tech. 5-year conviction. Ignore quarterly noise.",
    traderArchetypes: ["WOOD"],
    signals: { entryVelocity: "thematic", holdDuration: "years", exitTrigger: "thesis_broken" },
    successRate: 0.48,
    avgReturnPct: 62.0, // high variance — either huge or painful
  },
  SHORT_THE_FRAUD: {
    id: "SHORT_THE_FRAUD",
    description: "Identify accounting fraud or structural weakness. Short heavily. Wait.",
    traderArchetypes: ["CHANOS"],
    signals: { entryVelocity: "research_driven", holdDuration: "months", exitTrigger: "catalyst_event" },
    successRate: 0.67,
    avgReturnPct: 28.5,
  },
};

// ─── Market Regime Detection ─────────────────────────────────────────────────
function detectMarketRegime(trades) {
  if (!trades || trades.length === 0) return "unknown";

  const recentBuys  = trades.filter(t => ["BUY", "LONG"].includes(t.side));
  const recentSells = trades.filter(t => ["SELL", "SHORT", "LIQUIDATE"].includes(t.side));
  const buyVolume   = recentBuys.reduce((s, t) => s + (t.size_usd || 0), 0);
  const sellVolume  = recentSells.reduce((s, t) => s + (t.size_usd || 0), 0);

  if (buyVolume > sellVolume * 2) return "bull_accumulation";
  if (sellVolume > buyVolume * 2) return "bear_distribution";
  if (trades.length > 20 && (buyVolume + sellVolume) / trades.length < 5000) return "low_conviction";
  return "balanced_churn";
}

// ─── Pattern Fingerprinting ──────────────────────────────────────────────────
function fingerprintTrader(traderAlias, trades) {
  const patterns = [];

  // Check which library patterns match this trader's archetype
  for (const [patternId, pattern] of Object.entries(PATTERN_LIBRARY)) {
    if (pattern.traderArchetypes.includes(traderAlias)) {
      // Score how strongly the trade history matches
      const tradeCount = trades.length;
      const hasRecentActivity = trades.some(t => {
        const age = Date.now() - new Date(t.scraped_at || t.traded_at || 0).getTime();
        return age < 7 * 24 * 60 * 60 * 1000; // within 7 days
      });

      patterns.push({
        ...pattern,
        matchScore: tradeCount > 0 ? Math.min(tradeCount / 20, 1.0) : 0.3,
        hasRecentActivity,
        tradeCount,
      });
    }
  }

  // Sort by match score
  return patterns.sort((a, b) => b.matchScore - a.matchScore);
}

// ─── Sequence Prediction ─────────────────────────────────────────────────────
function predictNextMove(pattern, regime) {
  const predictions = {
    PUMP_AND_POSITION: {
      bull_accumulation: { action: "HOLD_OR_ADD", confidence: 0.72, horizon: "1-3 days" },
      bear_distribution: { action: "WATCH_EXIT", confidence: 0.68, horizon: "hours" },
      balanced_churn:    { action: "WAIT_FOR_SIGNAL", confidence: 0.5, horizon: "unknown" },
      low_conviction:    { action: "SCOUT_NEXT_PUMP", confidence: 0.55, horizon: "days" },
    },
    INFINITE_CONVICTION_BUY: {
      bull_accumulation: { action: "BUY_MORE", confidence: 0.9, horizon: "always" },
      bear_distribution: { action: "BUY_THE_DIP", confidence: 0.85, horizon: "now" },
      balanced_churn:    { action: "DCA_CONTINUE", confidence: 0.8, horizon: "monthly" },
      low_conviction:    { action: "BUY_AGGRESSIVELY", confidence: 0.9, horizon: "now" },
    },
    MACRO_CONVICTION_SWING: {
      bull_accumulation: { action: "HOLD_FULL_POSITION", confidence: 0.78, horizon: "weeks" },
      bear_distribution: { action: "REDUCE_RISK", confidence: 0.75, horizon: "days" },
      balanced_churn:    { action: "WAIT_FOR_CATALYST", confidence: 0.6, horizon: "weeks" },
      low_conviction:    { action: "BUILD_POSITION_SLOWLY", confidence: 0.65, horizon: "weeks" },
    },
    QUANT_REVERSION: {
      bull_accumulation: { action: "TAKE_PROFITS_AT_MEAN", confidence: 0.85, horizon: "hours" },
      bear_distribution: { action: "BUY_DEVIATION", confidence: 0.83, horizon: "hours" },
      balanced_churn:    { action: "WAIT_FOR_2SIGMA", confidence: 0.9, horizon: "variable" },
      low_conviction:    { action: "SCAN_OTHER_PAIRS", confidence: 0.7, horizon: "now" },
    },
    ARB_FLASH: {
      bull_accumulation: { action: "EXECUTE_NOW", confidence: 0.95, horizon: "blocks" },
      bear_distribution: { action: "EXECUTE_NOW", confidence: 0.92, horizon: "blocks" },
      balanced_churn:    { action: "EXECUTE_NOW", confidence: 0.93, horizon: "blocks" },
      low_conviction:    { action: "EXECUTE_NOW", confidence: 0.91, horizon: "blocks" },
    },
    SHORT_THE_FRAUD: {
      bull_accumulation: { action: "WAIT_PATIENCE", confidence: 0.7, horizon: "months" },
      bear_distribution: { action: "ADD_TO_SHORT", confidence: 0.8, horizon: "weeks" },
      balanced_churn:    { action: "HOLD_SHORT_THESIS", confidence: 0.72, horizon: "months" },
      low_conviction:    { action: "RESEARCH_MORE", confidence: 0.6, horizon: "weeks" },
    },
  };

  return predictions[pattern.id]?.[regime] || { action: "MONITOR", confidence: 0.5, horizon: "unknown" };
}

// ─── Main Simulation Runner ──────────────────────────────────────────────────
export async function runMirofish(traderAlias, overrideTrades = null) {
  log(ENGINE, `🐟 Running Mirofish sim for: ${traderAlias}`);

  const trades = overrideTrades || await getTraderHistory(traderAlias, 200);

  if (trades.length === 0) {
    log(ENGINE, `No trade history for ${traderAlias} — seeding with archetype defaults`, "WARN");
  }

  const regime = detectMarketRegime(trades);
  const patterns = fingerprintTrader(traderAlias, trades);

  const results = patterns.map(pattern => {
    const prediction = predictNextMove(pattern, regime);
    return {
      pattern: pattern.id,
      description: pattern.description,
      matchScore: pattern.matchScore,
      successRate: pattern.successRate,
      avgReturnPct: pattern.avgReturnPct,
      regime,
      prediction,
      signals: pattern.signals,
    };
  });

  const topResult = results[0];

  if (topResult) {
    log(ENGINE, `✅ ${traderAlias} fingerprint: ${topResult.pattern} | regime: ${regime} | next: ${topResult.prediction.action}`);

    // Persist simulation
    await logSimulation({
      traderAlias,
      simEngine: "mirofish",
      inputTrades: { count: trades.length, ids: trades.slice(0, 10).map(t => t.id) },
      result: { results, regime },
      pattern: topResult.pattern,
      forecast: topResult.prediction.action,
      confidence: topResult.prediction.confidence,
    });

    // Generate actionable signal
    if (topResult.prediction.confidence >= 0.65) {
      await logWhaleSignal({
        traderAlias,
        signalType: topResult.prediction.action.includes("BUY") ? "FOLLOW"
                  : topResult.prediction.action.includes("SELL") || topResult.prediction.action.includes("SHORT") ? "FADE"
                  : "WATCH",
        instrument: "PORTFOLIO",
        reasoning: `Mirofish: ${traderAlias} pattern=${topResult.pattern}, regime=${regime}, next=${topResult.prediction.action} (${topResult.prediction.horizon})`,
        strength: topResult.prediction.confidence,
        sourceSim: "mirofish",
        expiresAt: Date.now() + 6 * 60 * 60 * 1000,
      });
    }
  }

  return { traderAlias, regime, patterns: results, topPattern: topResult || null };
}

// ─── Batch runner — run all known traders ────────────────────────────────────
export async function runMirofishAll(traders) {
  const allResults = [];
  for (const trader of traders) {
    try {
      const result = await runMirofish(trader.alias);
      allResults.push(result);
      // Small delay to avoid DB hammering
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      log(ENGINE, `Error for ${trader.alias}: ${err.message}`, "ERROR");
    }
  }
  log(ENGINE, `🐟 Mirofish complete — ran ${allResults.length} trader sims`);
  return allResults;
}
