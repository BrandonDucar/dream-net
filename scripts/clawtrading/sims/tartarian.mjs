/**
 * TARTARIAN — Civilizational Pattern Simulation Engine
 *
 * Named after the Tartarian civilization hypothesis — the idea that
 * hidden long-horizon cycles and patterns shape reality at a scale
 * most participants never see. Whether or not you believe the theory,
 * the METHODOLOGY is real: look for macro-civilizational cycles,
 * suppressed patterns, long-term accumulation/collapse structures.
 *
 * Tartarian applies this lens to markets:
 *   - Empire Cycles: Markets rise like civilizations, peak, collapse, rebuild
 *   - Suppressed Signals: Patterns hidden in noise that precede major moves
 *   - Long-Wave Theory: Kondratiev waves, Fibonacci time cycles, decade cycles
 *   - Accumulation Archaeology: Who silently accumulated BEFORE the big move?
 *   - Reset Patterns: What does a market "reset" look like historically?
 *
 * Input: Whale trade history + current financial/social spike data
 * Output: Long-horizon forecasts, "hidden" pattern alerts, civilizational phase
 */

import { logSimulation, logWhaleSignal, getTraderHistory } from "../shared/whale-db.mjs";
import { log } from "../shared/config.mjs";

const ENGINE = "TARTARIAN";

// ─── Civilizational Market Phases ────────────────────────────────────────────
const MARKET_PHASES = {
  FOUNDATION:    { id: "FOUNDATION",    description: "Early builders accumulating. Most participants unaware.", duration: "years", signal: "low_volume_steady_accumulation" },
  EXPANSION:     { id: "EXPANSION",     description: "Empire growing. Momentum clear. Smart money increasing.", duration: "months", signal: "rising_volume_trend" },
  PEAK_EMPIRE:   { id: "PEAK_EMPIRE",   description: "Maximum glory. Everyone knows. Late money flooding in.", duration: "weeks", signal: "euphoria_extreme_volume" },
  DECLINE:       { id: "DECLINE",       description: "Cracks forming. Distribution. Insiders quietly exiting.", duration: "months", signal: "diverging_price_volume" },
  COLLAPSE:      { id: "COLLAPSE",      description: "The fall. Fast, brutal, irreversible until new cycle.", duration: "weeks", signal: "capitulation_event" },
  DARK_AGE:      { id: "DARK_AGE",      description: "The forgotten time. Most participants leave. Builders return.", duration: "months_years", signal: "extreme_low_sentiment" },
  RENAISSANCE:   { id: "RENAISSANCE",   description: "New builders on old foundations. Quiet. Powerful. Early.", duration: "months", signal: "low_vol_rising_quality" },
};

// ─── Long-Wave Cycle Lengths (Kondratiev-inspired) ──────────────────────────
const LONG_WAVES = {
  CRYPTO_HALVING_CYCLE: { periodDays: 365 * 4, name: "Bitcoin Halving Cycle" },
  TECH_DECADE_CYCLE:    { periodDays: 365 * 10, name: "Tech Decade Cycle (dot-com → crypto)" },
  KONDRATIEV_WAVE:      { periodDays: 365 * 50, name: "Kondratiev Long Wave" },
  MARKET_GENERATIONAL:  { periodDays: 365 * 20, name: "Generational Market Cycle" },
};

// ─── Suppressed Signal Patterns ──────────────────────────────────────────────
const SUPPRESSED_SIGNALS = [
  {
    id: "SILENT_WHALE_LOAD",
    description: "A whale accumulates silently over months with tiny individual trades.",
    detection: (trades) => {
      const buys = trades.filter(t => ["BUY","LONG"].includes(t.side));
      if (buys.length < 10) return false;
      const avgSize = buys.reduce((s,t) => s + (t.size_usd || 0), 0) / buys.length;
      return avgSize < 10_000 && buys.length > 20; // many small buys
    },
    implication: "Expect large upward move. Early position before public awareness.",
    confidence: 0.78,
  },
  {
    id: "DISTRIBUTION_MASQUERADE",
    description: "Whale selling while publicly appearing bullish (detected via wallet vs. social mismatch).",
    detection: (trades) => {
      const sells = trades.filter(t => ["SELL","LIQUIDATE"].includes(t.side));
      const buyMentions = trades.filter(t => t.source === "social_spike");
      return sells.length > 5 && buyMentions.length > 0; // selling but news is positive
    },
    implication: "WARNING: Prepare for price collapse. Insiders distributing.",
    confidence: 0.82,
  },
  {
    id: "DARK_AGE_ACCUMULATOR",
    description: "Accumulation during maximum despair — when nobody is watching.",
    detection: (trades) => {
      const buys = trades.filter(t => ["BUY","LONG"].includes(t.side));
      const recentMonths = buys.filter(t => {
        const age = Date.now() - new Date(t.traded_at || t.scraped_at || 0).getTime();
        return age < 90 * 24 * 60 * 60 * 1000;
      });
      return recentMonths.length >= 5; // buying in last 90 days
    },
    implication: "Early accumulation in dark age = highest return potential. Renaissance incoming.",
    confidence: 0.71,
  },
  {
    id: "EMPIRE_PEAK_DUMP",
    description: "Massive single sell event after prolonged bull run.",
    detection: (trades) => {
      const sells = trades.filter(t => ["SELL","LIQUIDATE","SHORT"].includes(t.side));
      const bigSells = sells.filter(t => (t.size_usd || 0) > 500_000);
      return bigSells.length >= 1;
    },
    implication: "Peak Empire signal. Major top may be forming. Reduce exposure.",
    confidence: 0.85,
  },
];

// ─── Phase Detection from Trade History ─────────────────────────────────────
function detectCivilizationalPhase(trades, socialContext) {
  if (!trades || trades.length === 0) return MARKET_PHASES.DARK_AGE;

  const recentTrades = trades.slice(0, 30);
  const buys  = recentTrades.filter(t => ["BUY","LONG"].includes(t.side));
  const sells = recentTrades.filter(t => ["SELL","SHORT","LIQUIDATE"].includes(t.side));
  const mentions = recentTrades.filter(t => t.source === "social_spike");

  const buyRatio  = buys.length / (recentTrades.length || 1);
  const sentimentHigh = mentions.length > 5;

  if (buyRatio > 0.7 && sentimentHigh) return MARKET_PHASES.PEAK_EMPIRE;
  if (buyRatio > 0.7 && !sentimentHigh) return MARKET_PHASES.EXPANSION;
  if (buyRatio > 0.5 && !sentimentHigh && trades.length < 15) return MARKET_PHASES.RENAISSANCE;
  if (buyRatio < 0.3 && sentimentHigh) return MARKET_PHASES.DECLINE;
  if (buyRatio < 0.3 && sells.length > 5) return MARKET_PHASES.COLLAPSE;
  if (recentTrades.length < 5) return MARKET_PHASES.DARK_AGE;
  if (buys.length > 0 && !sentimentHigh && buys.length < 10) return MARKET_PHASES.FOUNDATION;

  return MARKET_PHASES.EXPANSION; // default: assume growth phase
}

// ─── Hidden Pattern Scan ─────────────────────────────────────────────────────
function scanSuppressedSignals(trades) {
  const detected = [];
  for (const signal of SUPPRESSED_SIGNALS) {
    try {
      if (signal.detection(trades)) {
        detected.push(signal);
      }
    } catch { /* skip */ }
  }
  return detected;
}

// ─── Long-Wave Position Calculator ───────────────────────────────────────────
function calculateLongWavePosition() {
  const now = Date.now();
  // BTC genesis: Jan 3, 2009
  const btcGenesis = new Date("2009-01-03").getTime();
  const halvingCycleDays = LONG_WAVES.CRYPTO_HALVING_CYCLE.periodDays;
  const daysSinceGenesis = (now - btcGenesis) / (1000 * 60 * 60 * 24);
  const cyclePosition = (daysSinceGenesis % halvingCycleDays) / halvingCycleDays;

  // Last halving approx: April 2024 (day 0 of current cycle)
  const lastHalving = new Date("2024-04-19").getTime();
  const daysSinceHalving = (now - lastHalving) / (1000 * 60 * 60 * 24);
  const pctThroughCycle = Math.min(daysSinceHalving / halvingCycleDays, 1.0);

  let halvingPhase = "early"; // 0-25%
  if (pctThroughCycle > 0.25 && pctThroughCycle < 0.6)  halvingPhase = "expansion";
  if (pctThroughCycle >= 0.6 && pctThroughCycle < 0.85) halvingPhase = "peak";
  if (pctThroughCycle >= 0.85) halvingPhase = "contraction";

  return {
    daysSinceLastHalving: Math.round(daysSinceHalving),
    pctThroughHalvingCycle: pctThroughCycle,
    halvingPhase,
    nextHalvingApproxDays: Math.round(halvingCycleDays - daysSinceHalving),
  };
}

// ─── Main Simulation Runner ──────────────────────────────────────────────────
export async function runTartarian(traderAlias, overrideTrades = null, socialContext = null) {
  log(ENGINE, `🏛️  Running Tartarian sim for: ${traderAlias}`);

  const trades = overrideTrades || await getTraderHistory(traderAlias, 500);

  // 1. Detect civilizational phase
  const phase = detectCivilizationalPhase(trades, socialContext);

  // 2. Scan for suppressed/hidden signals
  const suppressedSignals = scanSuppressedSignals(trades);

  // 3. Calculate where we are in the long wave
  const longWave = calculateLongWavePosition();

  // 4. Build strategic outlook
  const outlook = {
    phase: phase.id,
    phaseDescription: phase.description,
    phaseDuration: phase.duration,
    longWave,
    suppressedSignals: suppressedSignals.map(s => ({
      id: s.id,
      description: s.description,
      implication: s.implication,
      confidence: s.confidence,
    })),
    strategicForecast: buildStrategicForecast(phase, longWave, suppressedSignals, traderAlias),
  };

  log(ENGINE, `🏛️  ${traderAlias}: Phase=${phase.id} | HalvingCycle=${longWave.halvingPhase} (${Math.round(longWave.pctThroughHalvingCycle * 100)}%) | Hidden signals: ${suppressedSignals.length}`);

  // 5. Persist
  await logSimulation({
    traderAlias,
    simEngine: "tartarian",
    inputTrades: { count: trades.length },
    result: outlook,
    pattern: phase.id,
    forecast: outlook.strategicForecast.action,
    confidence: outlook.strategicForecast.confidence,
  });

  // 6. Generate actionable signal from most alarming suppressed signal
  for (const sig of suppressedSignals) {
    const signalType = sig.id === "DISTRIBUTION_MASQUERADE" || sig.id === "EMPIRE_PEAK_DUMP"
      ? "ALERT" : sig.id === "DARK_AGE_ACCUMULATOR" || sig.id === "SILENT_WHALE_LOAD"
      ? "FOLLOW" : "WATCH";

    await logWhaleSignal({
      traderAlias,
      signalType,
      instrument: "MACRO",
      reasoning: `Tartarian: [${sig.id}] detected for ${traderAlias}. ${sig.implication} Phase: ${phase.id}.`,
      strength: sig.confidence,
      sourceSim: "tartarian",
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24hr signals
    });
    break; // only top signal
  }

  return outlook;
}

function buildStrategicForecast(phase, longWave, suppressedSignals, traderAlias) {
  // Phase-based base action
  const phaseAction = {
    FOUNDATION:  { action: "SILENT_ACCUMULATE", confidence: 0.72 },
    EXPANSION:   { action: "HOLD_AND_ADD",       confidence: 0.78 },
    PEAK_EMPIRE: { action: "PREPARE_EXIT",        confidence: 0.82 },
    DECLINE:     { action: "REDUCE_EXPOSURE",     confidence: 0.80 },
    COLLAPSE:    { action: "HARD_EXIT_OR_SHORT",  confidence: 0.85 },
    DARK_AGE:    { action: "RESEARCH_AND_WAIT",   confidence: 0.70 },
    RENAISSANCE: { action: "EARLY_ACCUMULATE",    confidence: 0.75 },
  }[phase.id] || { action: "MONITOR", confidence: 0.5 };

  // Long wave modifier
  let modifier = 0;
  if (longWave.halvingPhase === "expansion" && phaseAction.action.includes("ACCUMULATE")) modifier = 0.1;
  if (longWave.halvingPhase === "peak"      && phaseAction.action.includes("EXIT"))       modifier = 0.1;
  if (longWave.halvingPhase === "contraction" && phaseAction.action.includes("SHORT"))    modifier = 0.1;

  // Suppressed signal override
  const hasDumpSignal = suppressedSignals.some(s => ["DISTRIBUTION_MASQUERADE","EMPIRE_PEAK_DUMP"].includes(s.id));
  if (hasDumpSignal && !phaseAction.action.includes("EXIT") && !phaseAction.action.includes("SHORT")) {
    return { action: "ALERT_POSSIBLE_DUMP", confidence: 0.83, modifier: "suppressed_signal_override" };
  }

  return {
    action: phaseAction.action,
    confidence: Math.min(phaseAction.confidence + modifier, 0.97),
    halvingContext: longWave.halvingPhase,
    daysToNextHalving: longWave.nextHalvingApproxDays,
  };
}

// ─── Batch runner ────────────────────────────────────────────────────────────
export async function runTartarianAll(traders, socialContext = null) {
  const allResults = [];
  for (const trader of traders) {
    try {
      const result = await runTartarian(trader.alias, null, socialContext);
      allResults.push({ alias: trader.alias, ...result });
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      log(ENGINE, `Error for ${trader.alias}: ${err.message}`, "ERROR");
    }
  }
  log(ENGINE, `🏛️  Tartarian complete — ${allResults.length} civilizational analyses`);
  return allResults;
}
