#!/usr/bin/env node
/**
 * 🛡️ Sovereign Heartbeat Sidecar
 * 
 * Lightweight script that runs inside any DreamNet agent container
 * and phones home to Clawedette's sovereign layer every 30s.
 * 
 * Env vars:
 *   SOVEREIGN_AGENT_ID       — e.g. "sable", "lil-miss-claw"
 *   SOVEREIGN_HEARTBEAT_URL  — e.g. "http://clawedette-api:3100/sovereign/heartbeat"
 *   REDIS_URL                — optional, for direct Redis heartbeat
 * 
 * Usage: node sovereign-heartbeat-sidecar.js
 */

const AGENT_ID = process.env.SOVEREIGN_AGENT_ID || 'unknown-agent';
const HEARTBEAT_URL = process.env.SOVEREIGN_HEARTBEAT_URL || 'http://clawedette-api:3100/sovereign/heartbeat';
const INTERVAL_MS = 30_000;

async function beat() {
  try {
    const res = await fetch(HEARTBEAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: AGENT_ID,
        metadata: {
          memory: process.memoryUsage(),
          uptime: process.uptime(),
          pid: process.pid
        }
      }),
      signal: AbortSignal.timeout(5000)
    });

    if (res.ok) {
      console.log(`🛡️ [Heartbeat] ${AGENT_ID} → OK (${new Date().toISOString()})`);
    } else {
      console.warn(`🛡️ [Heartbeat] ${AGENT_ID} → ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error(`🛡️ [Heartbeat] ${AGENT_ID} → FAILED: ${err.message}`);
  }
}

console.log(`🛡️ [Heartbeat] Starting sovereign heartbeat for "${AGENT_ID}"`);
console.log(`🛡️ [Heartbeat] Phoning home to: ${HEARTBEAT_URL}`);
console.log(`🛡️ [Heartbeat] Interval: ${INTERVAL_MS / 1000}s`);

beat();
setInterval(beat, INTERVAL_MS);
