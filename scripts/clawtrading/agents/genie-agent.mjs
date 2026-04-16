/**
 * GENIE — The Wish-Granting Interpreter
 *
 * "You have three wishes. I'm going to find 300."
 *
 * GENIE takes simulation outputs from Mirofish and Tartarian,
 * interprets them as "wishes" (strategic intents), then generates
 * precise, executable trading wishes the team can act on.
 *
 * The philosophy: every sim output is a raw desire. GENIE turns it
 * into a structured, actionable, priced wish with:
 *   - Exact instrument
 *   - Entry condition
 *   - Size recommendation
 *   - Exit trigger
 *   - Confidence-weighted risk
 *   - Broadcast to BELFORT / STONKSWALL / SOROS_BOT
 *
 * Once GENIE figures out a pattern that works repeatedly, it
 * escalates autonomy — smaller confirmation threshold each time it
 * wins. This is the "buck wild" learning loop.
 *
 * Lives in the Playground. Experiments freely. Reports everything.
 */
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { log, tgAlert } from "../shared/config.mjs";
import { writeSignals } from "../shared/state.mjs";
import { initDB, dbInsertSignal } from "../shared/db.mjs";
import {
  initWhaleDB, getActiveSignals, logSimulation,
  logWhaleSignal, getAllTraders
} from "../shared/whale-db.mjs";
import { runMirofish, runMirofishAll } from "../sims/mirofish.mjs";
import { runTartarian, runTartarianAll } from "../sims/tartarian.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../../.env") });

const AGENT = "GENIE";

// ─── Genie's Learning State ──────────────────────────────────────────────────
// Tracks which wishes came true and amplifies confidence accordingly.
// This is the "buck wild" escalation system.
const WISH_LEDGER = {
  granted:  0,
  denied:   0,
  pending:  [],
  // autonomyLevel: 0.0 = full confirmation needed, 1.0 = full autonomy
  autonomyLevel: 0.1,
};

function updateAutonomy(wasSuccessful) {
  if (wasSuccessful) {
    WISH_LEDGER.granted++;
    // Each win increases autonomy by 5%, capped at 0.9
    WISH_LEDGER.autonomyLevel = Math.min(WISH_LEDGER.autonomyLevel + 0.05, 0.90);
  } else {
    WISH_LEDGER.denied++;
    // Each loss drops autonomy by 10%
    WISH_LEDGER.autonomyLevel = Math.max(WISH_LEDGER.autonomyLevel - 0.10, 0.05);
  }
  log(AGENT, `🧞 Autonomy level: ${(WISH_LEDGER.autonomyLevel * 100).toFixed(0)}% | Granted: ${WISH_LEDGER.granted} | Denied: ${WISH_LEDGER.denied}`);
}

// ─── Wish Builder ─────────────────────────────────────────────────────────────
// Converts a raw sim result into a structured Wish
function buildWish(simResult, traderAlias, simEngine) {
  if (!simResult) return null;

  const { topPattern, regime, patterns, strategicForecast, phase } = simResult;

  // Mirofish-style wish
  if (simEngine === "mirofish" && topPattern) {
    const pred = topPattern.prediction;
    const action = pred.action;
    const isLong = action.includes("BUY") || action.includes("HOLD") || action.includes("ADD") || action.includes("ACCUMULATE");
    const isShort = action.includes("SELL") || action.includes("SHORT") || action.includes("FADE") || action.includes("EXIT");

    return {
      id: `wish-${AGENT}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      source: simEngine,
      trader: traderAlias,
      pattern: topPattern.pattern,
      type: isLong ? "LONG" : isShort ? "SHORT" : "WATCH",
      instrument: traderAlias === "SAYLOR" ? "BTC" : traderAlias === "CHANOS" ? "SHORT_TARGET" : "MATIC",
      entry: "MARKET",
      sizeMultiplier: 0.5 + (pred.confidence * 0.5), // 50-100% of normal position
      exitTrigger: topPattern.signals?.exitTrigger || "momentum_fade",
      horizon: pred.horizon,
      confidence: pred.confidence,
      autonomyRequired: pred.confidence < 0.75 ? "confirm" : "autonomous",
      rawSim: topPattern,
      createdAt: Date.now(),
    };
  }

  // Tartarian-style wish
  if (simEngine === "tartarian" && strategicForecast) {
    const action = strategicForecast.action;
    const isLong = action.includes("ACCUMULATE") || action.includes("HOLD") || action.includes("ADD");
    const isAlert = action.includes("ALERT") || action.includes("DUMP");
    const isShort = action.includes("SHORT") || action.includes("EXIT") || action.includes("REDUCE");

    return {
      id: `wish-${AGENT}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      source: simEngine,
      trader: traderAlias,
      pattern: phase || "UNKNOWN_PHASE",
      type: isAlert ? "ALERT" : isLong ? "LONG" : isShort ? "SHORT" : "WATCH",
      instrument: "MACRO",
      entry: "STAGED",
      sizeMultiplier: isAlert ? 0 : 0.3 + (strategicForecast.confidence * 0.4),
      exitTrigger: `phase_transition`,
      horizon: "macro",
      confidence: strategicForecast.confidence,
      autonomyRequired: strategicForecast.confidence < 0.80 ? "confirm" : "autonomous",
      halvingContext: strategicForecast.halvingContext,
      createdAt: Date.now(),
    };
  }

  return null;
}

// ─── Wish Executor ────────────────────────────────────────────────────────────
async function executeWish(wish) {
  if (!wish) return;

  const requiresAutonomy = wish.autonomyRequired === "autonomous";
  const hasAutonomy = WISH_LEDGER.autonomyLevel >= (requiresAutonomy ? 0.5 : 0.8);

  if (wish.type === "ALERT") {
    await tgAlert(
      `🧞 <b>GENIE ALERT WISH</b>\n` +
      `Trader: ${wish.trader} | Pattern: ${wish.pattern}\n` +
      `⚠️ ${wish.type} — confidence ${(wish.confidence * 100).toFixed(0)}%\n` +
      `Source: ${wish.source} | Horizon: ${wish.horizon || "macro"}\n` +
      `<i>The lamp has spoken. Heed its warning.</i>`
    );
    return;
  }

  const signal = {
    type: "MOMENTUM",
    source: AGENT,
    wish: wish.id,
    trader: wish.trader,
    pattern: wish.pattern,
    direction: wish.type,
    instrument: wish.instrument,
    confidence: wish.confidence,
    sizeMultiplier: wish.sizeMultiplier,
    autonomy: WISH_LEDGER.autonomyLevel,
    horizon: wish.horizon,
    ts: Date.now(),
  };

  if (hasAutonomy) {
    log(AGENT, `🧞 AUTONOMOUS wish: ${wish.type} ${wish.instrument} | ${wish.trader} | conf ${(wish.confidence * 100).toFixed(0)}%`);
    await writeSignals([signal]);
    await dbInsertSignal({
      agent: AGENT,
      type: wish.type,
      pair: wish.instrument,
      strength: wish.confidence,
      details: wish,
      spikeSource: wish.source,
    });
    await tgAlert(
      `🧞 <b>GENIE WISH GRANTED</b>\n` +
      `${wish.type} <b>${wish.instrument}</b> | Trader archetype: ${wish.trader}\n` +
      `Pattern: ${wish.pattern} | Confidence: ${(wish.confidence * 100).toFixed(0)}%\n` +
      `Size: ${(wish.sizeMultiplier * 100).toFixed(0)}% of normal | Source: ${wish.source}\n` +
      `Autonomy: ${(WISH_LEDGER.autonomyLevel * 100).toFixed(0)}% 🔮`
    );
    WISH_LEDGER.pending.push({ wish, grantedAt: Date.now() });
  } else {
    log(AGENT, `🧞 Wish queued (low autonomy ${(WISH_LEDGER.autonomyLevel * 100).toFixed(0)}%): ${wish.type} ${wish.instrument}`);
    await logWhaleSignal({
      traderAlias: wish.trader,
      signalType: "WATCH",
      instrument: wish.instrument,
      reasoning: `GENIE wish pending autonomy: ${wish.type} | pattern ${wish.pattern} | conf ${(wish.confidence * 100).toFixed(0)}%`,
      strength: wish.confidence * WISH_LEDGER.autonomyLevel,
      sourceSim: `genie-${wish.source}`,
      expiresAt: Date.now() + 4 * 60 * 60 * 1000,
    });
  }
}

// ─── Main Loop ───────────────────────────────────────────────────────────────
async function run() {
  log(AGENT, "🧞 GENIE online. Your wishes are my commands — eventually.");
  await initDB();
  await initWhaleDB();

  const RUN_INTERVAL_MS = 10 * 60 * 1000; // every 10 min
  let runCount = 0;

  const tick = async () => {
    runCount++;
    log(AGENT, `=== GENIE cycle #${runCount} | autonomy ${(WISH_LEDGER.autonomyLevel * 100).toFixed(0)}% ===`);

    try {
      const traders = await getAllTraders();
      if (traders.length === 0) {
        log(AGENT, "No traders in DB yet — waiting for Whale Scrubber to seed them", "WARN");
        setTimeout(tick, RUN_INTERVAL_MS);
        return;
      }

      // Run Mirofish on all traders
      const mirofishResults = await runMirofishAll(traders);

      // Run Tartarian on top 5 by trade history relevance
      const tartarianResults = await runTartarianAll(traders.slice(0, 5));

      // Convert all sim results to wishes
      const wishes = [];

      for (const result of mirofishResults) {
        const wish = buildWish(result, result.traderAlias, "mirofish");
        if (wish && wish.confidence >= 0.60) wishes.push(wish);
      }

      for (const result of tartarianResults) {
        const wish = buildWish(result, result.alias, "tartarian");
        if (wish && wish.confidence >= 0.65) wishes.push(wish);
      }

      // Sort by confidence, execute top wishes
      wishes.sort((a, b) => b.confidence - a.confidence);
      const topWishes = wishes.slice(0, 5);

      log(AGENT, `🧞 ${wishes.length} wishes generated | Executing top ${topWishes.length}`);

      for (const wish of topWishes) {
        await executeWish(wish);
        await new Promise(r => setTimeout(r, 2000));
      }

      // Check if any pending wishes resolved (simplified: after 30min assume outcome)
      const resolved = WISH_LEDGER.pending.filter(w => Date.now() - w.grantedAt > 30 * 60 * 1000);
      for (const r of resolved) {
        // TODO: hook to actual price outcome check via price feed
        // For now simulate based on signal quality
        const succeeded = r.wish.confidence > 0.70 && Math.random() < r.wish.confidence;
        updateAutonomy(succeeded);
        WISH_LEDGER.pending = WISH_LEDGER.pending.filter(w => w !== r);
      }

      // Check active signals and report
      const activeSignals = await getActiveSignals();
      log(AGENT, `📡 Active signals in DB: ${activeSignals.length}`);
      if (runCount % 6 === 0 && activeSignals.length > 0) {
        await tgAlert(
          `🧞 <b>GENIE signal summary</b>\n` +
          `Active signals: ${activeSignals.length}\n` +
          `Wishes granted: ${WISH_LEDGER.granted} | Denied: ${WISH_LEDGER.denied}\n` +
          `Autonomy level: ${(WISH_LEDGER.autonomyLevel * 100).toFixed(0)}% 🔮\n` +
          activeSignals.slice(0, 5).map(s => `• ${s.signal_type} ${s.instrument} [${s.trader_alias}]`).join("\n")
        );
      }

    } catch (err) {
      log(AGENT, `Cycle error: ${err.message}`, "ERROR");
    }

    setTimeout(tick, RUN_INTERVAL_MS);
  };

  await tick();
}

run().catch(err => {
  console.error("[GENIE FATAL — the lamp cracked]", err);
  process.exit(1);
});
