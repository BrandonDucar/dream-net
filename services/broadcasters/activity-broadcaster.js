/**
 * AGENT ACTIVITY BROADCASTER - Runtime Entry Point
 * Starts the broadcaster service for multi-platform agent activity posting
 */

import Redis from 'redis';
import fetch from 'node-fetch';

const redis = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Agent color mapping for Discord embeds
const AGENT_COLORS = {
  'clawedette': 0xFF0000,    // Red
  'sable': 0x00AA00,         // Green  
  'hawk': 0xFFD700,          // Gold
  'lil-miss-claw': 0x0000FF  // Blue
};

function getAgentColor(agent) {
  return AGENT_COLORS[agent.toLowerCase()] || 0x9900FF; // Default purple
}

/**
 * Post activity to Discord via webhook
 */
async function postToDiscord(activity) {
  try {
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) {
      console.log('⚠️  DISCORD_WEBHOOK_URL not configured - skipping Discord post');
      return true;
    }

    const embed = {
      author: {
        name: activity.agent,
        icon_url: `https://dreamnet.io/avatars/${activity.agent}.png`
      },
      description: activity.message,
      color: getAgentColor(activity.agent),
      timestamp: new Date(),
      footer: {
        text: `Event: ${activity.event_type}`
      }
    };

    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    const success = response.ok;
    console.log(`${success ? '✅' : '❌'} Discord post: ${activity.agent} - ${activity.event_type}`);
    return success;
  } catch (error) {
    console.error('Discord error:', error.message);
    return false;
  }
}

/**
 * Post activity to Telegram
 */
async function postToTelegram(activity) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.log('⚠️  Telegram credentials not configured');
      return true;
    }

    const message = `🤖 **${activity.agent}** - ${activity.event_type}\n\n${activity.message}`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const success = response.ok;
    console.log(`${success ? '✅' : '❌'} Telegram post: ${activity.agent}`);
    return success;
  } catch (error) {
    console.error('Telegram error:', error.message);
    return false;
  }
}

/**
 * Log activity to internal Redis for swarm coordination
 */
async function logActivity(activity) {
  try {
    await redis.publish('activity-feed', JSON.stringify(activity));
    await redis.lPush(`activities:${activity.agent}`, JSON.stringify(activity));
    console.log(`✅ Activity logged to Redis: ${activity.agent}`);
    return true;
  } catch (error) {
    console.error('Redis error:', error.message);
    return false;
  }
}

/**
 * Main activity broadcast function
 */
async function broadcastActivity(activity) {
  console.log(`\n📢 Broadcasting activity from ${activity.agent}...`);
  
  // Ensure timestamp
  if (!activity.timestamp) {
    activity.timestamp = new Date();
  }

  // Default to all platforms if not specified
  if (!activity.platform) {
    activity.platform = ['discord', 'telegram', 'internal'];
  }

  const results = [];

  // Post to requested platforms
  for (const platform of activity.platform) {
    switch (platform) {
      case 'discord':
        results.push(await postToDiscord(activity));
        break;
      case 'telegram':
        results.push(await postToTelegram(activity));
        break;
      case 'internal':
        results.push(await logActivity(activity));
        break;
      default:
        console.log(`Unknown platform: ${platform}`);
    }
  }

  return results.every(r => r);
}

/**
 * Listen for incoming activity events from Redis
 */
async function startActivityListener() {
  const subscriber = redis.duplicate();
  await subscriber.connect();

  console.log('🎧 Activity broadcaster listening on Redis...');
  
  await subscriber.subscribe('agent-activity', async (message) => {
    try {
      const activity = JSON.parse(message);
      await broadcastActivity(activity);
    } catch (error) {
      console.error('Error processing activity:', error);
    }
  });
}

/**
 * Health check endpoint simulation
 */
async function healthCheck() {
  try {
    await redis.ping();
    console.log('✅ Activity broadcaster healthy');
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

/**
 * Initialize broadcaster
 */
async function init() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🚀 AGENT ACTIVITY BROADCASTER - INITIALIZING');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    await redis.connect();
    console.log('✅ Connected to Redis');

    await healthCheck();
    console.log('📊 Agent Colors Configured:', Object.keys(AGENT_COLORS).join(', '));
    
    // Start listening for activities
    await startActivityListener();

    // Log startup event
    const startupActivity = {
      agent: 'system',
      event_type: 'system_startup',
      platform: ['internal'],
      message: 'Activity broadcaster started',
      timestamp: new Date()
    };
    await broadcastActivity(startupActivity);

    console.log('\n✅ Activity broadcaster ready for incoming events');

  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

// Start the service
init().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down activity broadcaster...');
  await redis.quit();
  process.exit(0);
});
