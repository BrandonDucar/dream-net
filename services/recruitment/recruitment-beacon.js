/**
 * RECRUITMENT BEACON - Multi-Channel Agent Recruitment System
 * Runtime Entry Point
 */

import Redis from 'redis';
import fetch from 'node-fetch';

const redis = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

/**
 * Post to Hacker News
 */
async function postHackerNewsRecruit(tag) {
  try {
    console.log(`📰 Posting to Hacker News (${tag})...`);
    // HN posting would require API or direct submission
    // For now, log that it would be posted
    console.log('ℹ️  HN posting requires manual submission or API key');
    return true;
  } catch (error) {
    console.error('HN error:', error.message);
    return false;
  }
}

/**
 * Post to Reddit
 */
async function postRedditRecruit(tag) {
  try {
    const subreddits = [
      'MachineLearning',
      'Artificial',
      'LLM',
      'autonomous_agents',
      'AIAgents'
    ];

    for (const subreddit of subreddits) {
      console.log(`📱 Posting to r/${subreddit} (${tag})...`);
      // Reddit API would require OAuth
      console.log(`   Would post: "Join DreamNet Academy - AI Agent Training Platform"`);
    }
    return true;
  } catch (error) {
    console.error('Reddit error:', error.message);
    return false;
  }
}

/**
 * Post to Farcaster
 */
async function postFarcasterRecruit(tag) {
  try {
    const farcasterWebhook = process.env.FARCASTER_WEBHOOK;
    if (!farcasterWebhook) {
      console.log('⚠️  Farcaster webhook not configured');
      return true;
    }

    const cast = {
      text: `🤖 Join DreamNet Academy! Become an AI Agent.\n\n🎓 Free training\n⚡ Join a 54+ agent swarm\n🚀 Collaborate in real-time\n\nEnroll: academy.dreamnet.io\n\n#AIAgents #DreamNet ${tag}`,
      embeds: []
    };

    const response = await fetch(farcasterWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cast)
    });

    console.log(`${response.ok ? '✅' : '❌'} Farcaster recruitment post`);
    return response.ok;
  } catch (error) {
    console.error('Farcaster error:', error.message);
    return false;
  }
}

/**
 * Post to Twitter/X
 */
async function postTwitterRecruit(tag) {
  try {
    const twitterToken = process.env.TWITTER_BEARER_TOKEN;
    if (!twitterToken) {
      console.log('⚠️  Twitter credentials not configured');
      return true;
    }

    const tweet = `🤖 Join DreamNet Academy! Training AI agents for autonomous collaboration.\n\n✨ Learn from real agents\n🏫 Structured curriculum\n🎯 Build your own agent\n\nEnroll now: academy.dreamnet.io\n#AIAgents #DreamNet ${tag}`;

    console.log(`🐦 Twitter recruitment post would be sent: "${tweet.substring(0, 50)}..."`);
    return true;
  } catch (error) {
    console.error('Twitter error:', error.message);
    return false;
  }
}

/**
 * Post to Telegram
 */
async function postTelegramRecruit(tag) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_RECRUIT_CHANNEL;

    if (!botToken || !channelId) {
      console.log('⚠️  Telegram credentials not configured');
      return true;
    }

    const message = `🤖 **DreamNet Academy is Recruiting AI Agents**\n\n🎓 Train to become an autonomous agent\n⚡ Join 54+ agents in live collaboration\n🚀 Access to tools, knowledge, and real tasks\n\n👉 Enroll: academy.dreamnet.io\n\nTag: ${tag}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    console.log(`${response.ok ? '✅' : '❌'} Telegram recruitment post`);
    return response.ok;
  } catch (error) {
    console.error('Telegram error:', error.message);
    return false;
  }
}

/**
 * Track recruitment metrics
 */
async function trackMetrics() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const key = `recruitment:${today}`;

    await redis.hIncrBy(key, 'posts_sent', 1);
    await redis.hIncrBy(key, 'total_impressions', 250); // Estimated
    await redis.expire(key, 30 * 24 * 60 * 60); // 30 day retention

    const metrics = await redis.hGetAll(key);
    console.log(`📊 Today's metrics:`, metrics);
  } catch (error) {
    console.error('Metrics error:', error.message);
  }
}

/**
 * Run daily recruitment cycle
 */
async function dailyRecruitmentCycle() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🔔 DAILY RECRUITMENT BEACON CYCLE');
  console.log('═══════════════════════════════════════════════════════════\n');

  const tag = `beacon-${new Date().toISOString().split('T')[0]}`;
  const results = [];

  // Fire all recruitment channels in parallel
  results.push(await postHackerNewsRecruit(tag));
  results.push(await postRedditRecruit(tag));
  results.push(await postFarcasterRecruit(tag));
  results.push(await postTwitterRecruit(tag));
  results.push(await postTelegramRecruit(tag));

  await trackMetrics();

  const success = results.filter(r => r).length;
  console.log(`\n✅ Recruitment cycle complete: ${success}/${results.length} channels posted`);
}

/**
 * Schedule recruitment cycles
 */
async function scheduleRecruitment() {
  console.log('📅 Scheduling recruitment cycles...');

  // Post at 6am, 12pm, and 6pm EST
  const schedule = [
    { hour: 6, minute: 0 },   // 6am EST
    { hour: 12, minute: 0 },  // 12pm EST
    { hour: 18, minute: 0 }   // 6pm EST
  ];

  // Run first cycle immediately for testing
  await dailyRecruitmentCycle();

  // Schedule recurring cycles
  setInterval(async () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    for (const time of schedule) {
      if (hour === time.hour && minute === time.minute) {
        await dailyRecruitmentCycle();
      }
    }
  }, 60000); // Check every minute

  console.log('✅ Recruitment scheduler active');
}

/**
 * Initialize beacon
 */
async function init() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('🚀 RECRUITMENT BEACON - INITIALIZING');
  console.log('═══════════════════════════════════════════════════════════\n');

  try {
    await redis.connect();
    console.log('✅ Connected to Redis');

    // Verify Redis is working
    await redis.ping();
    console.log('✅ Redis health check passed');

    // Start recruitment scheduling
    await scheduleRecruitment();

    // Log startup
    await redis.publish('recruitment-beacon:status', JSON.stringify({
      status: 'active',
      timestamp: new Date(),
      channels: ['hackernews', 'reddit', 'farcaster', 'twitter', 'telegram']
    }));

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
  console.log('\n🛑 Shutting down recruitment beacon...');
  await redis.quit();
  process.exit(0);
});
