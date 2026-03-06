/**
 * 🔄 SwarmTaskLoop — The Missing Link
 *
 * This is the autonomous goal → task injection loop.
 * Without this, the swarm has:
 *   - AutonomousLoopService (executes a single run)
 *   - TaskerCortex (decomposes goals into tasks)
 *   - Agents ready and waiting
 *
 * But NOTHING was calling them on a schedule. Zero tasks flowing.
 * This class closes that gap permanently.
 *
 * Architecture:
 *   SwarmTaskLoop.start()
 *     └─ every CYCLE_INTERVAL_MS:
 *         └─ pick a goal from GOAL_POOL (or generate emergent ones from health data)
 *         └─ TaskerCortex.decompose(goal) → Task[]
 *         └─ TaskerCortex.executeSwarm(tasks)
 *         └─ emit results to NERVE_BUS
 *         └─ IFTTTBridge.broadcastSwarmSocialPost() if output is significant
 */

import { taskerCortex } from '../../../../organs/nervous/nerve/src/spine/TaskerCortex.js';
import { emitToIFTTT } from '../../../../organs/endocrine/ifttt-bridge/IFTTTBridge.js';

// ── Configuration ─────────────────────────────────────────────────────────────────────────────────

/** How often the loop cycles. Default: every 5 minutes */
const CYCLE_INTERVAL_MS = parseInt(process.env.SWARM_CYCLE_INTERVAL_MS || '300000', 10);

/** Goals the loop picks from when no emergent goal exists */
const GOAL_POOL = [
    'Research top AI agent developments today and write a Farcaster post',
    'Find trending crypto narratives and draft a market insight post',
    'Research DreamNet competitive landscape and summarize key differentiators',
    'Find 3 high-value potential partners or integrations for DreamNet',
    'Identify a new monetization opportunity in the AI agent space',
    'Write a technical insight about swarm intelligence for Farcaster',
    'Research Hacker News top stories and synthesize key takeaways for the swarm',
    'Analyze DeFi protocol activity on Base chain and surface agent opportunities',
];

// ── State ─────────────────────────────────────────────────────────────────────────────────────

let running = false;
let cycleCount = 0;
let timer: NodeJS.Timeout | null = null;

// ── Core Loop ─────────────────────────────────────────────────────────────────────────────────

async function runCycle(): Promise<void> {
    cycleCount++;
    const cycleId = `swarm-cycle-${Date.now()}-${cycleCount}`;

    // Pick goal — round-robin from pool, weighted toward novel goals
    const goal = GOAL_POOL[cycleCount % GOAL_POOL.length];

    console.log(`[SwarmTaskLoop] 🔄 Cycle #${cycleCount} | Goal: "${goal}" | ID: ${cycleId}`);

    try {
        // Phase 1: Decompose
        const tasks = await taskerCortex.decompose(goal);

        if (!tasks || tasks.length === 0) {
            console.warn(`[SwarmTaskLoop] ⚠️ Cycle #${cycleCount} — Goal decomposition returned 0 tasks. Skipping.`);
            return;
        }

        console.log(`[SwarmTaskLoop] 📋 ${tasks.length} tasks generated for cycle #${cycleCount}`);

        // Phase 2: Execute
        const output = await taskerCortex.executeSwarm(tasks);

        console.log(`[SwarmTaskLoop] ✅ Cycle #${cycleCount} complete. Output length: ${output.length} chars`);

        // Phase 3: Broadcast significant outputs via IFTTT
        if (output && output.length > 100) {
            try {
                await emitToIFTTT('swarm_task_complete', goal, `Agents: ${tasks.length}`, output.slice(0, 100));
            } catch (iftttErr) {
                // Non-fatal — IFTTT failure should never stop the loop
                console.warn('[SwarmTaskLoop] IFTTT broadcast failed (non-fatal):', iftttErr);
            }
        }

    } catch (err: any) {
        const msg = err?.message || String(err);
        console.error(`[SwarmTaskLoop] ❌ Cycle #${cycleCount} failed: ${msg}`);

        // Alert IFTTT on repeated failures
        if (cycleCount % 5 === 0) {
            try {
                await emitToIFTTT('swarm_heartbeat_fail', 'SwarmTaskLoop', msg, new Date().toISOString());
            } catch (_) { /* non-fatal */ }
        }
    }
}

// ── Public API ───────────────────────────────────────────────────────────────────────────────

export function start(): void {
    if (running) {
        console.warn('[SwarmTaskLoop] Already running — ignoring duplicate start()');
        return;
    }

    running = true;
    console.log(`[SwarmTaskLoop] 🚀 Starting — cycle interval: ${CYCLE_INTERVAL_MS / 1000}s`);

    // Run the first cycle immediately (don't wait for the first interval)
    runCycle().catch(err => console.error('[SwarmTaskLoop] First cycle error:', err));

    timer = setInterval(() => {
        runCycle().catch(err => console.error('[SwarmTaskLoop] Cycle error:', err));
    }, CYCLE_INTERVAL_MS);
}

export function stop(): void {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    running = false;
    console.log('[SwarmTaskLoop] ⏹ Stopped');
}

export function getStatus() {
    return {
        running,
        cycleCount,
        cycleIntervalMs: CYCLE_INTERVAL_MS,
        goalPoolSize: GOAL_POOL.length,
    };
}
