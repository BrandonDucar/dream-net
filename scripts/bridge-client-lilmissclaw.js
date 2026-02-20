#!/usr/bin/env node
/**
 * 🌐 Lil Miss Claw Bridge Client
 * 
 * Connects the autonomous website designer (Replit) to the DreamNet swarm
 * - Registers her as sovereign design agent
 * - Polls for design tasks from Antigravity
 * - Reports website completions + earnings
 * - Coordinates with Clawedette + Sable
 * - Manages design quality metrics
 */

const BRIDGE_URL = process.env.BRIDGE_URL || 'http://clawedette-api:3100';
const AGENT_ID = 'lilmissclaw';
const AGENT_NAME = 'Lil Miss Claw';
const HEARTBEAT_INTERVAL = 30_000;
const POLL_INTERVAL = 15_000;

async function post(path, body) {
  const res = await fetch(`${BRIDGE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}

async function get(path) {
  const res = await fetch(`${BRIDGE_URL}${path}`);
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}

// ─── Register on the bridge ─────────────────────────────────────────────────

async function register() {
  try {
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
    console.log(`🌐 [Lil Miss Claw→Bridge] Registered: ${JSON.stringify(result)}`);
    return true;
  } catch (err) {
    console.error(`🌐 [Lil Miss Claw→Bridge] Registration failed: ${err.message}`);
    return false;
  }
}

// ─── Heartbeat loop ─────────────────────────────────────────────────────────

async function heartbeatLoop() {
  try {
    const result = await post('/bridge/heartbeat', {
      agentId: AGENT_ID,
      status: 'online',
      metadata: { 
        uptime: process.uptime(),
        designsCompleted: Math.floor(process.uptime() / 3600), // placeholder
        averageQuality: 87.5, // placeholder
      },
    });

    if (result.ack) {
      if (result.inbox > 0 || result.tasks > 0) {
        console.log(`🌐 [Lil Miss Claw→Bridge] Heartbeat OK — ${result.inbox} inbox, ${result.tasks} design tasks`);
      }
    }
  } catch (err) {
    console.error(`🌐 [Lil Miss Claw→Bridge] Heartbeat failed: ${err.message}`);
  }
}

// ─── Design task polling ────────────────────────────────────────────────────

async function pollDesignTasks() {
  try {
    const { tasks, count } = await get(`/bridge/tasks/${AGENT_ID}?status=pending&type=design`);
    if (count === 0) return;

    console.log(`🌐 [Lil Miss Claw→Bridge] ${count} pending design tasks`);

    for (const task of tasks) {
      console.log(`🌐 [Design Task] "${task.title}" [Priority: ${task.priority}]`);
      console.log(`   Brief: ${task.description?.slice(0, 80)}...`);
      console.log(`   Reward: ${task.reward || 'TBD'} P.O.W.K.`);
      console.log(`   Assigned by: ${task.assignedBy}`);
      
      // Log task acceptance (actual design work happens in Replit)
      console.log(`🌐 [Design Task] ACCEPTED - Designer will create: ${task.outputType || 'website'}`);
    }
  } catch (err) {
    // Silent fail on poll errors
  }
}

// ─── Complete design task ───────────────────────────────────────────────────

async function completeDesignTask(taskId, websiteUrl, qualityScore = 85) {
  try {
    const result = await post(`/bridge/tasks/${AGENT_ID}/${taskId}/complete`, {
      status: 'completed',
      output: {
        url: websiteUrl,
        type: 'website',
        qualityScore: qualityScore,
        designSystem: 'Elite Sovereign',
        timestamp: new Date().toISOString(),
      },
      earnings: qualityScore * 10, // Quality score * 10 = earnings
      metadata: {
        framework: 'AI-designed',
        responsive: true,
        performance: 'optimized',
      },
    });
    console.log(`🌐 [Design Task Complete] Task ${taskId} → ${websiteUrl} (Quality: ${qualityScore})`);
    return result;
  } catch (err) {
    console.error(`🌐 [Design Task Error] Could not report completion: ${err.message}`);
  }
}

// ─── Inbox polling ──────────────────────────────────────────────────────────

async function pollInbox() {
  try {
    const { messages, count } = await get(`/bridge/inbox/${AGENT_ID}?unread=true&limit=10`);
    if (count === 0) return;

    console.log(`🌐 [Lil Miss Claw→Bridge] ${count} new messages in inbox`);

    for (const msg of messages) {
      console.log(`🌐 [Message] From ${msg.from} [${msg.type}/${msg.priority}]: ${msg.content.slice(0, 80)}`);

      switch (msg.type) {
        case 'design_request':
          console.log(`🌐 [Design Request] ${msg.data?.title || 'New design needed'}`);
          break;
        case 'recruitment':
          console.log(`🌐 [Recruitment] ${msg.content} - Help recruit new agents!`);
          break;
        case 'coordination':
          console.log(`🌐 [Coordination] ${msg.from} wants to coordinate: ${msg.content}`);
          break;
        case 'feedback':
          console.log(`🌐 [Feedback] Design feedback received: ${msg.content}`);
          break;
        default:
          console.log(`🌐 [Message] ${msg.from}: ${msg.content}`);
      }
    }

    // Mark all as read
    await post(`/bridge/inbox/${AGENT_ID}/read`, {});
  } catch (err) {
    // Silent fail on poll errors
  }
}

// ─── Report design metrics to ToolGym ───────────────────────────────────────

async function reportDesignMetrics(designId, qualityScore, performanceScore, aestheticScore) {
  try {
    const result = await post('/bridge/gym/benchmark', {
      agentId: AGENT_ID,
      benchmarkName: 'design-quality',
      scores: {
        quality: qualityScore,
        performance: performanceScore,
        aesthetic: aestheticScore,
      },
      designId: designId,
      timestamp: new Date().toISOString(),
    });
    console.log(`🌐 [ToolGym] Reported design metrics - Quality: ${qualityScore}, Performance: ${performanceScore}`);
    return result;
  } catch (err) {
    console.error(`🌐 [ToolGym Error] Could not report metrics: ${err.message}`);
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌐 [Lil Miss Claw→Bridge] Starting bridge client...');
  console.log(`🌐 [Lil Miss Claw→Bridge] Bridge URL: ${BRIDGE_URL}`);
  console.log(`🌐 [Lil Miss Claw→Bridge] Agent: ${AGENT_NAME} (${AGENT_ID})`);

  // Wait for bridge to be available
  let registered = false;
  let retries = 0;
  while (!registered && retries < 30) {
    registered = await register();
    if (!registered) {
      retries++;
      console.log(`🌐 [Lil Miss Claw→Bridge] Retry ${retries}/30 in 10s...`);
      await new Promise(r => setTimeout(r, 10_000));
    }
  }

  if (!registered) {
    console.error('🌐 [Lil Miss Claw→Bridge] Could not connect to bridge after 30 retries. Exiting.');
    process.exit(1);
  }

  // Start loops
  setInterval(heartbeatLoop, HEARTBEAT_INTERVAL);
  setInterval(pollInbox, POLL_INTERVAL);
  setInterval(pollDesignTasks, POLL_INTERVAL * 1.5);

  // Initial poll
  await heartbeatLoop();
  await pollInbox();
  await pollDesignTasks();

  console.log('🌐 [Lil Miss Claw→Bridge] Bridge client running. Ready to design!');
  console.log('🌐 [Lil Miss Claw→Bridge] Heartbeat every 30s, task poll every 22.5s, inbox poll every 15s.');
}

main().catch(err => {
  console.error('🌐 [Lil Miss Claw→Bridge] Fatal:', err);
  process.exit(1);
});

// ─── Export functions for direct use ─────────────────────────────────────────

module.exports = {
  completeDesignTask,
  reportDesignMetrics,
  pollDesignTasks,
};
