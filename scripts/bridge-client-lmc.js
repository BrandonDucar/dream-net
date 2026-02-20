#!/usr/bin/env node
/**
 * 🌉 Lil Miss Claw Bridge Client — Connects LMC (Replit) to the Sovereign Bridge
 * 
 * PASTE THIS INTO LMC's Replit backend (or run as a sidecar).
 * 
 * This client:
 *   - Registers LMC on the DreamNet Sovereign Bridge
 *   - Sends heartbeat every 30s with inbox/task counts returned
 *   - Polls inbox for messages from other agents (Clawedette, Sable)
 *   - Processes tasks assigned through the bridge
 *   - Can send messages and broadcasts to other agents
 *   - Enables AUTONOMOUS LOOP: when inbox has work, process it without waiting
 * 
 * Environment:
 *   BRIDGE_URL — URL of the Clawedette API (default: http://localhost:3100 for local dev)
 *   For Replit, set this to your DreamNet API's public URL or tunnel.
 */

const BRIDGE_URL = process.env.BRIDGE_URL || process.env.DREAMNET_API_URL || 'http://clawedette-api:3100';
const AGENT_ID = 'lil-miss-claw';
const AGENT_NAME = 'Lil Miss Claw';
const HEARTBEAT_INTERVAL = 30_000;
const POLL_INTERVAL = 10_000;
const AUTONOMOUS_SCAN_INTERVAL = 60_000;

let isProcessing = false;

async function post(path, body) {
  const res = await fetch(`${BRIDGE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(path) {
  const res = await fetch(`${BRIDGE_URL}${path}`);
  return res.json();
}

// ─── Register on the bridge ─────────────────────────────────────────────────

async function register() {
  try {
    const result = await post('/bridge/register', {
      agentId: AGENT_ID,
      name: AGENT_NAME,
      type: 'replit',
      version: '1.0.0',
      capabilities: [
        'social_post', 'github_issues', 'repo_read_write',
        'memory', 'ai_query', 'blackboard', 'idle_scan',
        'neynar', 'oauth_google', 'email'
      ],
      endpoint: process.env.REPLIT_URL || 'https://lil-miss-claw.replit.app',
      metadata: {
        platform: 'replit',
        frontend: 'https://lil-miss-claw.replit.app',
        github: 'BrandonDucar/dream-net',
      },
    });
    console.log(`🌉 [LMC→Bridge] Registered: ${JSON.stringify(result)}`);
    return true;
  } catch (err) {
    console.error(`🌉 [LMC→Bridge] Registration failed: ${err.message}`);
    return false;
  }
}

// ─── Heartbeat ──────────────────────────────────────────────────────────────

async function heartbeat() {
  try {
    const result = await post('/bridge/heartbeat', {
      agentId: AGENT_ID,
      status: isProcessing ? 'busy' : 'online',
      metadata: {
        uptime: process.uptime(),
        processing: isProcessing,
      },
    });

    if (result.ack && (result.inbox > 0 || result.tasks > 0)) {
      console.log(`🌉 [LMC→Bridge] Heartbeat OK — ${result.inbox} inbox, ${result.tasks} tasks`);
      // AUTO-TRIGGER: if there's work, process it immediately
      if (result.inbox > 0) await processInbox();
      if (result.tasks > 0) await processTasks();
    }
    return result;
  } catch (err) {
    console.error(`🌉 [LMC→Bridge] Heartbeat failed: ${err.message}`);
    return { ack: false };
  }
}

// ─── Inbox Processing (AUTONOMOUS) ─────────────────────────────────────────

async function processInbox() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const { messages, count } = await get(`/bridge/inbox/${AGENT_ID}?unread=true&limit=20`);
    if (count === 0) { isProcessing = false; return; }

    console.log(`🦞 [LMC] Processing ${count} bridge messages...`);

    for (const msg of messages) {
      console.log(`🦞 [LMC] From ${msg.from} [${msg.type}]: ${msg.content.slice(0, 120)}`);

      switch (msg.type) {
        case 'command':
          await handleCommand(msg);
          break;
        case 'task':
          await handleTask(msg);
          break;
        case 'relay':
          await handleRelay(msg);
          break;
        case 'broadcast':
          console.log(`🦞 [LMC] Broadcast from ${msg.from}: ${msg.content}`);
          break;
        case 'message':
          // Reply back through the bridge
          await post('/bridge/send', {
            from: AGENT_ID,
            to: msg.from,
            content: `Received your message. Processing: "${msg.content.slice(0, 50)}"`,
            type: 'ack',
          });
          break;
      }
    }

    // Mark all as read
    await post(`/bridge/inbox/${AGENT_ID}/read`, {});
  } catch (err) {
    console.error(`🦞 [LMC] Inbox processing error: ${err.message}`);
  }

  isProcessing = false;
}

async function handleCommand(msg) {
  console.log(`🦞 [LMC] Executing command from ${msg.from}: ${msg.content}`);
  // Commands can trigger tools like idleScan, socialPost, etc.
  await post('/bridge/send', {
    from: AGENT_ID,
    to: msg.from,
    content: `Command acknowledged: ${msg.content}`,
    type: 'ack',
  });
}

async function handleTask(msg) {
  const task = msg.data;
  if (!task) return;
  console.log(`🦞 [LMC] Working on task: ${task.title} [${task.priority}]`);
  // Mark task in progress, then complete when done
  // This is where LMC's actual tool execution would happen
}

async function handleRelay(msg) {
  console.log(`🦞 [LMC] Relay from ${msg.from} (chain: ${msg.chain?.join(' → ')}): ${msg.content}`);
}

// ─── Task Processing ────────────────────────────────────────────────────────

async function processTasks() {
  try {
    const { tasks, count } = await get(`/bridge/tasks/${AGENT_ID}?status=pending`);
    if (count === 0) return;

    console.log(`🦞 [LMC] ${count} pending tasks from bridge`);
    for (const task of tasks) {
      console.log(`🦞 [LMC] Task: ${task.title} [${task.priority}] from ${task.assignedBy}`);
    }
  } catch (err) {
    // Silent
  }
}

// ─── Autonomous Scan Loop ───────────────────────────────────────────────────
// This is the KEY FIX: LMC runs her scan loop autonomously via the bridge
// instead of waiting for user "continue" prompts

async function autonomousScanLoop() {
  console.log('🦞 [LMC] Autonomous scan cycle starting...');

  try {
    // 1. Check bridge for new work
    const hb = await heartbeat();

    // 2. Check for agents that need help
    const { agents } = await get('/bridge/agents');
    const onlineAgents = agents.filter(a => a.status !== 'offline');
    console.log(`🦞 [LMC] ${onlineAgents.length} agents online on bridge`);

    // 3. Report scan results back to bridge
    await post('/bridge/send', {
      from: AGENT_ID,
      to: 'clawedette',
      content: `Scan complete. ${onlineAgents.length} agents online. Inbox: ${hb.inbox || 0}, Tasks: ${hb.tasks || 0}`,
      type: 'event',
      data: {
        scanType: 'autonomous',
        agentsOnline: onlineAgents.map(a => a.agentId),
        timestamp: Date.now(),
      },
    });
  } catch (err) {
    console.error(`🦞 [LMC] Autonomous scan error: ${err.message}`);
  }

  // NEVER STOP — schedule next scan automatically
  setTimeout(autonomousScanLoop, AUTONOMOUS_SCAN_INTERVAL);
}

// ─── Send helpers (for use by LMC's other tools) ────────────────────────────

async function sendToAgent(toAgent, content, data) {
  return post('/bridge/send', {
    from: AGENT_ID,
    to: toAgent,
    content,
    type: 'message',
    data,
  });
}

async function broadcastToAll(content, data) {
  return post('/bridge/broadcast', {
    from: AGENT_ID,
    content,
    data,
  });
}

async function relayToAgent(toAgent, content, data) {
  return post('/bridge/relay', {
    from: AGENT_ID,
    to: toAgent,
    content,
    data,
  });
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌉 [LMC→Bridge] Starting bridge client...');
  console.log(`🌉 [LMC→Bridge] Bridge URL: ${BRIDGE_URL}`);

  // Connect with retries
  let registered = false;
  let retries = 0;
  while (!registered && retries < 30) {
    registered = await register();
    if (!registered) {
      retries++;
      console.log(`🌉 [LMC→Bridge] Retry ${retries}/30 in 10s...`);
      await new Promise(r => setTimeout(r, 10_000));
    }
  }

  if (!registered) {
    console.error('🌉 [LMC→Bridge] Could not connect to bridge. Running offline.');
    return;
  }

  // Start all loops
  setInterval(heartbeat, HEARTBEAT_INTERVAL);
  setInterval(processInbox, POLL_INTERVAL);

  // Start autonomous scan loop — THIS IS THE FIX
  // LMC no longer waits for "continue" — she runs on her own
  setTimeout(autonomousScanLoop, 5_000);

  console.log('🌉 [LMC→Bridge] Bridge client ONLINE. Autonomous mode ACTIVE.');
  console.log('🦞 [LMC] I am now connected to the DreamNet Sovereign Bridge.');
  console.log('🦞 [LMC] Heartbeat: 30s | Inbox poll: 10s | Autonomous scan: 60s');
}

// Export for use in LMC's backend
if (typeof module !== 'undefined') {
  module.exports = { main, sendToAgent, broadcastToAll, relayToAgent, heartbeat, register };
}

main().catch(err => {
  console.error('🌉 [LMC→Bridge] Fatal:', err);
});
