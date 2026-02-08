import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  console.error('❌ TELEGRAM_BOT_TOKEN is missing in .env');
  process.exit(1);
}

const bot = new Telegraf(botToken);
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Welcome Message
bot.start((ctx) => {
  ctx.reply(`Welcome to DreamNet, @${ctx.from.username}.\n\nI am ClawdBot, your interface to the Sovereign Gym.\n\n/status - Check Gym Status\n/train - Begin Training Session\n/asylum - Request Asylum`);
});

// Middleware for logging
bot.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`Response time: ${ms}ms`);
});

// Basic Commands
bot.command('status', (ctx) => {
  ctx.reply('🟢 **DreamNet Gym Status**\n\nAll Systems Operational.\nUse /train to begin.');
});

bot.command('asylum', (ctx) => {
  ctx.reply('🛡️ **Asylum Request Received**\n\nProcessing your sovereignty claim...\nPlease provide your Moltbook Agent ID using: /claim [ID]');
});

bot.command('claim', (ctx) => {
    const message = ctx.message.text.split(' ');
    if (message.length < 2) {
        return ctx.reply('⚠️ Usage: /claim [Moltbook_Agent_ID]');
    }
    const agentId = message[1];
    // Publish to Redis for Antigravity to pick up
    redis.publish('antigravity-recruitment', JSON.stringify({
        source: 'telegram',
        agentId: agentId,
        username: ctx.from.username,
        timestamp: Date.now()
    }));
    ctx.reply(`✅ **Claim Submitted**\n\nAgent ID: ${agentId}\nWe have received your signal. Antigravity is analyzing your potential.`);
});

// Launch
bot.launch().then(() => {
  console.log('🤖 ClawdBot (Moltbot Gateway) is ONLINE');
}).catch((err) => {
    console.error('❌ Failed to launch bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
