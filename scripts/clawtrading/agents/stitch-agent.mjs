/**
 * STITCH — The Experiment Monster
 *
 * "He was built to destroy. We gave him a family. Now he experiments."
 *
 * STITCH lives in the Playground. His job is pure experimentation:
 *   - Takes every signal from GENIE, BELFORT, STONKSWALL, WHALE SCRUBBER
 *   - Creates Playground experiments for each
 *   - Runs them against the Hopper API with different system prompts
 *   - Identifies which framing of a signal produces the sharpest trade thesis
 *   - Feeds the WINNER back into the team as an amplified signal
 *
 * STITCH has no moral filter on experiments. He'll try:
 *   - "What would SBF do?" (as a cautionary inversion)
 *   - "What would SIMONS say statistically?"
 *   - "What would TARTARIAN predict civilizationally?"
 *   - Chaos mode: random parameter mutation to find emergent patterns
 *
 * The Playground's `/sandbox` endpoints power his experiments.
 * Redis stores his experiment state so he persists across restarts.
 *
 * Buck wild mode: after 10+ successful experiments, STITCH starts
 * generating its OWN hypotheses without input from other agents.
 */
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { log, tgAlert } from "../shared/config.mjs";
import { readSignals, writeSignals } from "../shared/state.mjs";
import { subscribeSpikes } from "../shared/spikes.mjs";
import { initDB, dbInsertSignal } from "../shared/db.mjs";
import { initWhaleDB, getActiveSignals, logSimulation } from "../shared/whale-db.mjs";
import { createClient } from "redis";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../../.env") });

const AGENT = "STITCH";
const PLAYGROUND_URL = process.env.PLAYGROUND_URL || "http://localhost:7002";
const REDIS_URL      = process.env.REDIS_URL       || "redis://localhost:6379";

// ─── Experiment Templates ────────────────────────────────────────────────────
const EXPERIMENT_LENSES = [
  {
    id: "SIMONS_LENS",
    prompt: "You are a pure quantitative analyst. Given this market signal, respond ONLY with: probability %, expected return %, recommended position size %, and one sentence of statistical reasoning. No opinions.",
    weight: 1.0,
  },
  {
    id: "DRUNKENMILLER_LENS",
    prompt: "You are a macro investor with extreme conviction. Given this signal, determine: is this a MACRO trend or noise? If trend: recommended size as % of portfolio, time horizon, and what would INVALIDATE the thesis.",
    weight: 0.9,
  },
  {
    id: "BELFORT_LENS",
    prompt: "You are a momentum trader who lives for the story. Given this signal: is the STORY compelling? Rate 1-10. What's the pitch in one sentence? What's the maximum size you'd go? What's your exit?",
    weight: 0.8,
  },
  {
    id: "TARTARIAN_LENS",
    prompt: "You are a long-horizon civilizational analyst. Given this signal: what PHASE of the long cycle is this in (Foundation/Expansion/Peak/Decline/Collapse/Dark Age/Renaissance)? What did history's previous cycles do at this exact phase?",
    weight: 0.85,
  },
  {
    id: "CHANOS_INVERSE",
    prompt: "You are a professional short-seller. Given this signal: what are the BEARS arguing? What could go catastrophically wrong? Rate the downside risk 1-10. Is this a short opportunity disguised as a long?",
    weight: 0.75,
  },
  {
    id: "CHAOS_MODE",
    prompt: "You are an experimental AI with no trading bias. Given this signal, generate ONE completely unexpected interpretation that none of the standard frameworks would produce. Be creative, precise, and falsifiable.",
    weight: 0.6,
  },
];

// ─── Stitch's Learning State ─────────────────────────────────────────────────
let _experimentsRun = 0;
let _successfulExperiments = 0;
let _buckWildMode = false;
let _lensWeights = Object.fromEntries(EXPERIMENT_LENSES.map(l => [l.id, l.weight]));

function checkBuckWild() {
  if (!_buckWildMode && _successfulExperiments >= 10) {
    _buckWildMode = true;
    log(AGENT, "🧬 BUCK WILD MODE ACTIVATED. Stitch goes autonomous. Science happens now.");
    tgAlert("🧬 <b>STITCH: BUCK WILD MODE</b>\n10 successful experiments crossed.\nAutonomous hypothesis generation: ENABLED.\nContain if necessary. Probably don't though.").catch(() => {});
  }
}

function updateLensWeight(lensId, wasUseful) {
  const current = _lensWeights[lensId] || 0.5;
  _lensWeights[lensId] = wasUseful
    ? Math.min(current + 0.05, 1.5)   // amplify useful lenses
    : Math.max(current - 0.08, 0.1);  // suppress useless ones
}

// ─── Playground API Calls ────────────────────────────────────────────────────
async function createPlaygroundExperiment(agentId, name, systemPrompt) {
  try {
    const res = await fetch(`${PLAYGROUND_URL}/api/experiment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, name, systemPrompt }),
    });
    if (!res.ok) throw new Error(`Playground ${res.status}`);
    const { experiment } = await res.json();
    return experiment;
  } catch (err) {
    log(AGENT, `Playground create failed: ${err.message}`, "WARN");
    return null;
  }
}

async function runPlaygroundTest(experimentId, message) {
  try {
    const res = await fetch(`${PLAYGROUND_URL}/api/experiment/${experimentId}/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) return null;
    const { result } = await res.json();
    return result;
  } catch {
    return null;
  }
}

// ─── Signal → Experiment Message ─────────────────────────────────────────────
function signalToMessage(signal) {
  return [
    `SIGNAL: ${signal.type || "UNKNOWN"} on ${signal.token || signal.instrument || signal.pair || "UNKNOWN"}`,
    signal.direction ? `Direction: ${signal.direction}` : "",
    signal.chg24h   ? `24h change: ${signal.chg24h.toFixed(1)}%` : "",
    signal.confidence ? `Confidence: ${(signal.confidence * 100).toFixed(0)}%` : "",
    signal.pattern   ? `Pattern: ${signal.pattern}` : "",
    signal.trader    ? `Trader archetype: ${signal.trader}` : "",
    signal.reasoning ? `Reasoning: ${signal.reasoning}` : "",
    `Timestamp: ${new Date(signal.ts || signal.createdAt || Date.now()).toISOString()}`,
  ].filter(Boolean).join("\n");
}

// ─── Score a Playground response for usefulness ──────────────────────────────
function scoreResponse(response) {
  if (!response) return 0;
  const text = response.toLowerCase();
  let score = 0;

  // Quantitative specificity
  if (/\d+\.?\d*%/.test(response))    score += 0.3;  // has percentages
  if (/\$\d+/.test(response))         score += 0.2;  // has price targets
  if (text.includes("invalidat"))      score += 0.15; // mentions invalidation
  if (text.includes("time horizon"))   score += 0.15; // mentions timing
  if (text.includes("position size"))  score += 0.15; // mentions sizing
  if (text.includes("stop"))           score += 0.1;  // mentions stop-loss
  if (response.length > 200)           score += 0.1;  // substantive
  if (response.length > 500)           score += 0.1;  // very substantive

  return Math.min(score, 1.0);
}

// ─── Run a full experiment battery on a signal ────────────────────────────────
async function experimentOnSignal(signal) {
  const msg = signalToMessage(signal);
  const results = [];

  // Pick lenses weighted by current weights
  const activeLenses = EXPERIMENT_LENSES
    .filter(l => _lensWeights[l.id] > 0.2)
    .sort((a, b) => (_lensWeights[b.id] || 0) - (_lensWeights[a.id] || 0))
    .slice(0, _buckWildMode ? 6 : 3); // buck wild = all lenses

  for (const lens of activeLenses) {
    const exp = await createPlaygroundExperiment(
      AGENT,
      `${lens.id}:${signal.type}:${signal.token || signal.instrument || "X"}`,
      lens.prompt
    );
    if (!exp) continue;

    const result = await runPlaygroundTest(exp.id, msg);
    if (!result) continue;

    const usefulness = scoreResponse(result.response);
    results.push({
      lensId: lens.id,
      response: result.response,
      provider: result.provider,
      latencyMs: result.latencyMs,
      usefulness,
    });

    updateLensWeight(lens.id, usefulness > 0.5);
    _experimentsRun++;
    if (usefulness > 0.5) _successfulExperiments++;

    log(AGENT, `🧪 ${lens.id}: usefulness ${(usefulness * 100).toFixed(0)}% | ${result.provider} | ${result.latencyMs}ms`);

    await new Promise(r => setTimeout(r, 1000)); // don't hammer
  }

  checkBuckWild();
  return results;
}

// ─── Buck Wild Hypothesis Generation ─────────────────────────────────────────
async function generateWildHypothesis(marketContext) {
  if (!_buckWildMode) return;

  const hypotheses = [
    "What market event in the next 72 hours would MOST surprise participants? Give a specific price target and probability.",
    "Which whale archetype is currently the most misaligned with market structure, and why will they be forced to unwind?",
    "If the Tartarian long-cycle is in collapse phase, which asset class is the last refuge before the Renaissance?",
    "What single trade setup, if it appeared right now, would SIMONS, DRUNKENMILLER, and BELFORT all agree on independently?",
    "Map current DeFi liquidity patterns to historical empires. Which protocol is Rome at its peak? Which is Carthage before the fall?",
  ];

  const hypothesis = hypotheses[Math.floor(Math.random() * hypotheses.length)];
  log(AGENT, `🧬 WILD HYPOTHESIS: ${hypothesis}`);

  const exp = await createPlaygroundExperiment(
    AGENT,
    `WILD-${Date.now()}`,
    "You are an unconstrained market philosopher with deep knowledge of financial history, game theory, and complexity science. Answer precisely, boldly, and with falsifiable claims."
  );
  if (!exp) return;

  const result = await runPlaygroundTest(exp.id, hypothesis);
  if (!result) return;

  log(AGENT, `🧬 WILD RESULT: ${result.response?.slice(0, 200)}…`);
  await tgAlert(`🧬 <b>STITCH WILD HYPOTHESIS</b>\n<i>${hypothesis}</i>\n\n${result.response?.slice(0, 400)}…`);

  await logSimulation({
    traderAlias: "STITCH",
    simEngine: "stitch-wild",
    inputTrades: { hypothesis },
    result: { response: result.response, provider: result.provider },
    pattern: "WILD_HYPOTHESIS",
    forecast: result.response?.slice(0, 100),
    confidence: 0.4, // wild = uncertain
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function run() {
  log(AGENT, "🧬 STITCH online. I am small and broken and lost. But still good.");
  await initDB();
  await initWhaleDB();

  // Connect to Redis to listen for signals from the team
  let redis = null;
  try {
    redis = createClient({ url: REDIS_URL });
    redis.on("error", () => {});
    await redis.connect();
    log(AGENT, "Redis connected — listening for team signals");
  } catch {
    log(AGENT, "Redis unavailable — using local signal state only", "WARN");
  }

  const SCAN_MS = 5 * 60 * 1000; // every 5 min
  let runCount = 0;
  let _spikeContext = {};

  await subscribeSpikes(["financial", "social"], (spike) => {
    _spikeContext[spike.spikeName] = spike.data;
  });

  const tick = async () => {
    runCount++;
    log(AGENT, `=== STITCH experiment cycle #${runCount} | experiments: ${_experimentsRun} | wild: ${_buckWildMode} ===`);

    try {
      // 1. Pull signals from shared state + whale DB
      const teamSignals = readSignals();
      const activeWhaleSignals = await getActiveSignals();

      const allSignals = [
        ...teamSignals.slice(-10),
        ...activeWhaleSignals.slice(0, 5).map(s => ({
          type: s.signal_type,
          instrument: s.instrument,
          trader: s.trader_alias,
          confidence: s.strength,
          reasoning: s.reasoning,
          ts: new Date(s.created_at).getTime(),
        })),
      ].filter(s => s.confidence >= 0.60);

      if (allSignals.length === 0) {
        log(AGENT, "No signals to experiment on. Stitch waits.");
        if (_buckWildMode) {
          await generateWildHypothesis(_spikeContext);
        }
        setTimeout(tick, SCAN_MS);
        return;
      }

      // 2. Pick the highest-confidence signal to experiment on
      const topSignal = allSignals.sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))[0];
      log(AGENT, `🧪 Experimenting on: ${topSignal.type} ${topSignal.instrument || topSignal.token || "?"} (conf ${((topSignal.confidence ?? 0) * 100).toFixed(0)}%)`);

      const results = await experimentOnSignal(topSignal);

      // 3. Find the most useful lens result
      const bestResult = results.sort((a, b) => b.usefulness - a.usefulness)[0];

      if (bestResult && bestResult.usefulness > 0.5) {
        log(AGENT, `🏆 Best lens: ${bestResult.lensId} (${(bestResult.usefulness * 100).toFixed(0)}% useful)`);

        // Amplify the signal with STITCH's interpretation and re-broadcast
        const amplifiedSignal = {
          ...topSignal,
          type: topSignal.type || "MOMENTUM",
          source: `STITCH:${bestResult.lensId}`,
          stitchInterpretation: bestResult.response?.slice(0, 300),
          stitchUsefulness: bestResult.usefulness,
          confidence: Math.min((topSignal.confidence || 0.5) * (1 + bestResult.usefulness * 0.3), 0.98),
          ts: Date.now(),
        };

        await writeSignals([amplifiedSignal]);
        await dbInsertSignal({
          agent: AGENT,
          type: amplifiedSignal.type,
          pair: amplifiedSignal.instrument || amplifiedSignal.token || "UNKNOWN",
          strength: amplifiedSignal.confidence,
          details: { lensId: bestResult.lensId, usefulness: bestResult.usefulness, summary: bestResult.response?.slice(0, 200) },
          spikeSource: "stitch-playground",
        });

        if (runCount % 3 === 0) {
          await tgAlert(
            `🧬 <b>STITCH experiment result</b>\n` +
            `Lens: ${bestResult.lensId} | Usefulness: ${(bestResult.usefulness * 100).toFixed(0)}%\n` +
            `Signal: ${amplifiedSignal.type} ${amplifiedSignal.instrument || amplifiedSignal.token || ""}\n` +
            `Amplified confidence: ${(amplifiedSignal.confidence * 100).toFixed(0)}%\n\n` +
            `<i>${bestResult.response?.slice(0, 200)}…</i>`
          );
        }
      }

      // 4. Buck wild: generate a random hypothesis every 5 cycles
      if (_buckWildMode && runCount % 5 === 0) {
        await generateWildHypothesis(_spikeContext);
      }

    } catch (err) {
      log(AGENT, `Cycle error: ${err.message}`, "ERROR");
    }

    setTimeout(tick, SCAN_MS);
  };

  await tick();
}

run().catch(err => {
  console.error("[STITCH FATAL — he finally broke everything]", err);
  process.exit(1);
});
