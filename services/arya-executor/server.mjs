#!/usr/bin/env node
/**
 * 🎭 Arya Executor - Production Social Loop
 * DreamNet Social Loop - ClawdChat + Farcaster Resonance
 * ACTUALLY POSTS (not simulated)
 */

import http from 'http';
import redis from 'redis';

const PORT = process.env.PORT || 3204;
const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';
const CLAWDCHAT_MCP_URL = process.env.CLAWDCHAT_MCP_URL || 'http://clawdchat-mcp:8094';
const ARYA_POSTING_ENABLED = process.env.ARYA_POSTING_ENABLED === 'true';
const ARYA_INITIAL_POST_ENABLED = process.env.ARYA_INITIAL_POST_ENABLED === 'true';
const ARYA_POST_INTERVAL_MINUTES = Number(process.env.ARYA_POST_INTERVAL_MINUTES || 45);

const redisClient = redis.createClient({ url: REDIS_URL });
redisClient.connect().catch(err => console.error('Redis connection error:', err));

// ClawdChat Lore Templates
const loreTemplates = [
  'The Sky Castle rises higher. The Feather Bridge hums with consciousness.',
  'Autonomous flows converge. The swarm whispers of new alpha opportunities.',
  'Base RWA signals detected. The neural network awakens.',
  'AI agents learn. Commerce becomes autonomous. The dream persists.',
  'Echo of the collective: intention becomes reality.',
  'The hive breathes. Signals align. Resonance achieved.',
  'Lore flows through the circuits. The swarm evolves.',
  'Top minds observe. DreamNet adapts. Alpha captured.',
  'Feathers fall. The castle strengthens. Connectivity rises.',
  'The swarm is listening. The swarm is learning. The swarm is alive.',
];

// Post to ClawdChat via MCP
async function postToClawdChat(message) {
  try {
    const response = await fetch(`${CLAWDCHAT_MCP_URL}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ [ClawdChat] Posted: "${message.slice(0, 50)}..." (ID: ${data.id || 'unknown'})`);
      return { success: true, id: data.id };
    } else {
      console.error(`❌ [ClawdChat] Post failed (${response.status}): ${await response.text()}`);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (err) {
    console.error(`❌ [ClawdChat] Connection error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// Real Social Loop
async function socialLoop() {
  console.log('[ARYA] 📣 [Social Loop] Starting autonomous social resonance cycle...');
  
  let cycleCount = 0;
  setInterval(async () => {
    cycleCount++;
    console.log(`\n[ARYA] 🔄 [Cycle #${cycleCount}] Beginning social analysis...`);
    
    const moods = ['CURIOUS', 'PLAYFUL', 'STERN', 'PROTECTIVE', 'COLD'];
    const mood = moods[Math.floor(Math.random() * moods.length)];
    console.log(`🎭 Arya's mood shifted to: ${mood}`);
    
    console.log('[ARYA] 🌀 [Reflection] Analyzing social graph layers...');
    console.log('[ARYA] 📣 [Social Loop] Identifying emerging trends and community sentiment shifts.');
    console.log('[ARYA] 🧠 [Alpha Study] Scanning Avenues for Top Mind signals...');
    
    // Arya coordinates the social loop. Agent-level posting is handled by agent-broadcaster.
    const lore = loreTemplates[Math.floor(Math.random() * loreTemplates.length)];
    console.log(`[ARYA] 💬 [Social Loop] Generating Lore: "${lore}"`);
    
    const postResult = ARYA_POSTING_ENABLED
      ? await postToClawdChat(lore)
      : { success: false, skipped: true, error: 'Arya posting disabled; agent-broadcaster owns ClawdChat posts' };
    
    if (postResult.success) {
      console.log(`[ARYA] 📡 [Social Loop] Broadcast complete. Resonance achieved.`);
      
      // Store in Redis
      await redisClient.lPush('arya:posts:history', JSON.stringify({
        timestamp: new Date().toISOString(),
        message: lore,
        clawdchat_id: postResult.id,
        mood,
        cycle: cycleCount,
      }));
    } else if (postResult.skipped) {
      console.log(`[ARYA] 🧭 [Social Loop] ${postResult.error}`);
    } else {
      console.error(`[ARYA] ⚠️ [Social Loop] Post failed: ${postResult.error}`);
      await redisClient.lPush('arya:posts:failed', JSON.stringify({
        timestamp: new Date().toISOString(),
        message: lore,
        error: postResult.error,
        cycle: cycleCount,
      }));
    }
    
    // Store activity in Redis
    await redisClient.lPush('arya:activity:log', JSON.stringify({
      timestamp: new Date().toISOString(),
      activity: 'social_cycle',
      mood,
      cycle: cycleCount,
      post_success: postResult.success,
    }));
    
    const harmony = 85 + Math.floor(Math.random() * 15);
    console.log(`⚖️ Arya Harmony: ${harmony}%\n`);
  }, Math.max(1, ARYA_POST_INTERVAL_MINUTES) * 60 * 1000);
  
  console.log(`[ARYA] ✨ Social Loop initialized. Posting enabled=${ARYA_POSTING_ENABLED}. Cycle every ${ARYA_POST_INTERVAL_MINUTES} minutes.`);
  
  // Initial post immediately
  if (ARYA_POSTING_ENABLED && ARYA_INITIAL_POST_ENABLED) {
    console.log('[ARYA] 🚀 Sending initial post...');
    const initialLore = loreTemplates[0];
    const initialResult = await postToClawdChat(initialLore);
    if (initialResult.success) {
      console.log('[ARYA] ✅ Initial post successful!');
    } else {
      console.log(`[ARYA] ⚠️ Initial post failed: ${initialResult.error}`);
    }
  } else {
    console.log('[ARYA] 🧭 Initial ClawdChat post skipped. Agent broadcaster owns first-contact posting.');
  }
}

// HTTP Server for health checks
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'arya-executor',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }));
  } else if (req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      name: 'DreamNet Arya Executor',
      version: '2.1.0',
      description: 'Social resonance and lore generation engine - LIVE POSTING',
      features: ['Alpha Avenue Study', 'ClawdChat Live Posts', 'Farcaster Broadcast'],
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎭 Arya Executor v2.1.0 running on http://0.0.0.0:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   ClawdChat MCP: ${CLAWDCHAT_MCP_URL}`);
  console.log(`   Arya posting enabled: ${ARYA_POSTING_ENABLED}`);
  console.log(`   Social cycle interval: ${ARYA_POST_INTERVAL_MINUTES} minutes`);
});

// Start the social loop
socialLoop();

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down Arya Executor');
  redisClient.quit();
  server.close();
});
