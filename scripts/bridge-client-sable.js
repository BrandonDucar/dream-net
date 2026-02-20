#!/usr/bin/env node
/**
 * 🌉 Sable Bridge Client — Connects Sable (Moltbot Gateway) to the Sovereign Bridge
 * 
 * Runs as a sidecar alongside the Clawdbot gateway.
 * - Registers Sable on the bridge
 * - Sends heartbeat every 30s (returns inbox/task counts)
 * - Polls inbox for new messages and relays them
 * - Listens for tasks and broadcasts
 * - Can relay Telegram messages through the bridge to other agents
 */

const BRIDGE_URL = process.env.BRIDGE_URL || 'http://clawedette-api:3100';
const AGENT_ID = 'sable';
const AGENT_NAME = 'Sable';
const HEARTBEAT_INTERVAL = 30_000;
const POLL_INTERVAL = 15_000;

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
      type: 'clawdbot',
      version: '1.0.0',
      capabilities: [
        'telegram', 'discord', 'chat', 'gateway',
        'message-relay', 'voice', 'skills'
      ],
      endpoint: 'http://moltbot-gateway:11234',
      metadata: {
        telegramBot: '@ghostmintopsocials_bot',
        gatewayPort: 11234,
      },
    });
    console.log(`🌉 [Sable→Bridge] Registered: ${JSON.stringify(result)}`);
    return true;
  } catch (err) {
    console.error(`🌉 [Sable→Bridge] Registration failed: ${err.message}`);
    return false;
  }
}

// ─── Heartbeat loop ─────────────────────────────────────────────────────────

async function heartbeatLoop() {
  try {
    const result = await post('/bridge/heartbeat', {
      agentId: AGENT_ID,
      status: 'online',
      metadata: { uptime: process.uptime() },
    });

    if (result.ack) {
      if (result.inbox > 0 || result.tasks > 0) {
        console.log(`🌉 [Sable→Bridge] Heartbeat OK — ${result.inbox} inbox, ${result.tasks} tasks`);
      }
    }
  } catch (err) {
    console.error(`🌉 [Sable→Bridge] Heartbeat failed: ${err.message}`);
  }
}

// ─── Inbox polling ──────────────────────────────────────────────────────────

async function pollInbox() {
  try {
    const { messages, count } = await get(`/bridge/inbox/${AGENT_ID}?unread=true&limit=10`);
    if (count === 0) return;

    console.log(`🌉 [Sable→Bridge] ${count} new messages in inbox`);

    for (const msg of messages) {
      console.log(`🌉 [Sable→Bridge] From ${msg.from} [${msg.type}/${msg.priority}]: ${msg.content.slice(0, 100)}`);

      // Handle different message types
      switch (msg.type) {
        case 'command':
          console.log(`🌉 [Sable→Bridge] Executing command: ${msg.content}`);
          break;
        case 'task':
          console.log(`🌉 [Sable→Bridge] New task received: ${msg.data?.title || msg.content}`);
          break;
        case 'relay':
          console.log(`🌉 [Sable→Bridge] Relay from ${msg.from}: ${msg.content}`);
          break;
        case 'broadcast':
          console.log(`🌉 [Sable→Bridge] Broadcast from ${msg.from}: ${msg.content}`);
          break;
        default:
          console.log(`🌉 [Sable→Bridge] Message from ${msg.from}: ${msg.content}`);
      }
    }

    // Mark all as read
    await post(`/bridge/inbox/${AGENT_ID}/read`, {});
  } catch (err) {
    // Silent fail on poll errors
  }
}

// ─── Task polling ───────────────────────────────────────────────────────────

async function pollTasks() {
  try {
    const { tasks, count } = await get(`/bridge/tasks/${AGENT_ID}?status=pending`);
    if (count === 0) return;

    console.log(`🌉 [Sable→Bridge] ${count} pending tasks`);
    for (const task of tasks) {
      console.log(`🌉 [Sable→Bridge] Task: ${task.title} [${task.priority}] from ${task.assignedBy}`);
    }
  } catch (err) {
    // Silent fail
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌉 [Sable→Bridge] Starting bridge client...');
  console.log(`🌉 [Sable→Bridge] Bridge URL: ${BRIDGE_URL}`);

  // Wait for bridge to be available
  let registered = false;
  let retries = 0;
  while (!registered && retries < 30) {
    registered = await register();
    if (!registered) {
      retries++;
      console.log(`🌉 [Sable→Bridge] Retry ${retries}/30 in 10s...`);
      await new Promise(r => setTimeout(r, 10_000));
    }
  }

  if (!registered) {
    console.error('🌉 [Sable→Bridge] Could not connect to bridge after 30 retries. Exiting.');
    process.exit(1);
  }

  // Start loops
  setInterval(heartbeatLoop, HEARTBEAT_INTERVAL);
  setInterval(pollInbox, POLL_INTERVAL);
  setInterval(pollTasks, POLL_INTERVAL * 2);

  // Initial poll
  await heartbeatLoop();
  await pollInbox();

  console.log('🌉 [Sable→Bridge] Bridge client running. Heartbeat every 30s, inbox poll every 15s.');
}

main().catch(err => {
  console.error('🌉 [Sable→Bridge] Fatal:', err);
  process.exit(1);
});
