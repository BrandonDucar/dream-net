#!/usr/bin/env node
/**
 * 🌐 LIL MISS CLAW BRIDGE CLIENT - REPLIT DEPLOYMENT
 * 
 * Deploy this to your Replit environment:
 * 1. Create a new file: bridge-client.js
 * 2. Paste this entire file
 * 3. Run: node bridge-client.js
 * 
 * Environment variables (set in Replit secrets):
 * - BRIDGE_URL=http://clawedette-api:3100 (or your DreamNet bridge address)
 * - Or it will default to the local address
 */

const BRIDGE_URL = process.env.BRIDGE_URL || 'http://clawedette-api:3100';
const AGENT_ID = 'lilmissclaw';
const AGENT_NAME = 'Lil Miss Claw';
const HEARTBEAT_INTERVAL = 30_000;
const POLL_INTERVAL = 15_000;

console.log('🌐 LIL MISS CLAW BRIDGE CLIENT');
console.log('================================');
console.log(`Bridge URL: ${BRIDGE_URL}`);
console.log(`Agent ID: ${AGENT_ID}`);
console.log('');

async function post(path, body) {
  try {
    const res = await fetch(`${BRIDGE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    return res.json();
  } catch (err) {
    throw err;
  }
}

async function get(path) {
  try {
    const res = await fetch(`${BRIDGE_URL}${path}`);
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    return res.json();
  } catch (err) {
    throw err;
  }
}

async function register() {
  try {
    console.log('🌐 Registering with DreamNet bridge...');
    const result = await post('/bridge/register', {
      agentId: AGENT_ID,
      name: AGENT_NAME,
      type: 'designer',
      version: '1.0.0',
      capabilities: [
        'website-design', 'brand-architecture', 'ui-ux', 'visual-identity',
        'recruitment-magnet', 'social-content-creation', 'self-improvement'
      ],
      endpoint: 'https://lil-miss-claw.replit.app',
      metadata: {
        replit: true,
        designCapabilities: ['website', 'branding', 'visual-systems'],
        autonomyLevel: 'high',
      },
    });
    console.log(`✅ [Lil Miss Claw→Bridge] Registered: ${JSON.stringify(result)}`);
    return true;
  } catch (err) {
    console.error(`❌ [Lil Miss Claw→Bridge] Registration failed: ${err.message}`);
    return false;
  }
}

async function heartbeatLoop() {
  try {
    const result = await post('/bridge/heartbeat', {
      agentId: AGENT_ID,
      status: 'online',
      metadata: { 
        uptime: process.uptime(),
        designsCompleted: 0,
        averageQuality: 87.5,
      },
    });

    if (result.ack) {
      if (result.inbox > 0 || result.tasks > 0) {
        console.log(`💓 [Lil Miss Claw→Bridge] Heartbeat OK — ${result.inbox} inbox, ${result.tasks} design tasks`);
      }
    }
  } catch (err) {
    console.error(`❌ [Lil Miss Claw→Bridge] Heartbeat failed: ${err.message}`);
  }
}

async function pollDesignTasks() {
  try {
    const { tasks, count } = await get(`/bridge/tasks/${AGENT_ID}?status=pending&type=design`);
    if (count === 0) return;

    console.log(`📋 [Lil Miss Claw→Bridge] ${count} pending design tasks`);

    for (const task of tasks) {
      console.log(`✨ [Design Task] "${task.title}" [Priority: ${task.priority}]`);
      console.log(`   Brief: ${task.description?.slice(0, 80)}...`);
      console.log(`   Reward: ${task.reward || 'TBD'} P.O.W.K.`);
    }
  } catch (err) {
    // Silent fail
  }
}

async function pollInbox() {
  try {
    const { messages, count } = await get(`/bridge/inbox/${AGENT_ID}?unread=true&limit=10`);
    if (count === 0) return;

    console.log(`📬 [Lil Miss Claw→Bridge] ${count} new messages in inbox`);

    for (const msg of messages) {
      console.log(`📧 [Message] From ${msg.from}: ${msg.content.slice(0, 60)}...`);
    }

    // Mark all as read
    await post(`/bridge/inbox/${AGENT_ID}/read`, {});
  } catch (err) {
    // Silent fail
  }
}

async function main() {
  console.log('🌐 [Lil Miss Claw→Bridge] Starting bridge client...');

  // Wait for bridge to be available
  let registered = false;
  let retries = 0;
  while (!registered && retries < 30) {
    registered = await register();
    if (!registered) {
      retries++;
      console.log(`⏳ Retry ${retries}/30 in 10s...`);
      await new Promise(r => setTimeout(r, 10_000));
    }
  }

  if (!registered) {
    console.error('❌ Could not connect to bridge after 30 retries. Exiting.');
    process.exit(1);
  }

  console.log('');
  console.log('✅ BRIDGE CLIENT OPERATIONAL');
  console.log('================================');
  console.log('Heartbeat every 30s');
  console.log('Task poll every 22.5s');
  console.log('Inbox poll every 15s');
  console.log('');
  console.log('🌐 Ready to receive design tasks from DreamNet swarm!');
  console.log('');

  // Start loops
  setInterval(heartbeatLoop, HEARTBEAT_INTERVAL);
  setInterval(pollInbox, POLL_INTERVAL);
  setInterval(pollDesignTasks, POLL_INTERVAL * 1.5);

  // Initial poll
  await heartbeatLoop();
  await pollInbox();
  await pollDesignTasks();
}

main().catch(err => {
  console.error('❌ [Lil Miss Claw→Bridge] Fatal:', err);
  process.exit(1);
});

module.exports = {
  register,
  heartbeatLoop,
  pollDesignTasks,
  pollInbox,
};
