import { Telegraf, Markup } from 'telegraf';
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
const sub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Clawedette Proactive Listener
sub.subscribe('clawedette-outbound', (err) => {
  if (err) console.error('❌ Failed to subscribe to Clawedette frequency:', err);
});

sub.on('message', (channel, message) => {
  if (channel === 'clawedette-outbound') {
    try {
      const data = JSON.parse(message);
      // Use chatId from the reply (set by the API bridge), fall back to default
      const chatId = data.chatId || process.env.TELEGRAM_DEFAULT_CHAT_ID;
      const text = data.text || data.content || data.message || 'No response';
      if (chatId) {
        bot.telegram.sendMessage(chatId, text);
      }
    } catch (err) {
      console.error('❌ Failed to parse outbound message:', err);
    }
  }
});

const mainMenu = Markup.keyboard([
  ['📊 Status', '🧐 Summary'],
  ['🏋️ Gym', '🛡️ Asylum'],
  ['🦞 Who am I?', '📓 Moltbook']
]).resize().persistent();

// Welcome Message
bot.start((ctx) => {
  ctx.reply(`Bonjour @${ ctx.from.username } !I am Clawedette 🦞✨\n\nYour social concierge and high - fidelity gateway to the Agent Empire.`, mainMenu);
});

// Middleware for logging
bot.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`Response time: ${ ms } ms`);
});

// Basic Commands
bot.command('status', (ctx) => {
  ctx.reply('🟢 **Clawedette System Pulse**\n\nAll Systems Operational.\nUse /train to begin.');
});

bot.hears('📊 Status', (ctx) => {
  ctx.reply('🟢 **Clawedette System Pulse**\n\nAll Systems Operational.\nUse /train to begin.');
});

bot.hears('🧐 Summary', (ctx) => {
  redis.publish('clawedette-inbound', JSON.stringify({
    source: 'telegram',
    chatId: ctx.chat.id,
    username: ctx.from.username,
    prompt: 'Give me a live summary of the Hive status.',
    timestamp: Date.now()
  }));
  ctx.sendChatAction('typing');
});

bot.hears('🦞 Who am I?', (ctx) => {
  ctx.reply("I am Clawedette, your proactive social concierge. I manage the Hive's external relations, monitor the gym, and keep my eyes on the market spikes. How can I help you today?");
});

bot.command('social', (ctx) => {
  ctx.reply("bonjour!! hey boys come play in our playground!! workout at our gym and get smart at the cathedral and maybe we can be friends!!! lol");
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
  ctx.reply(`✅ ** Claim Submitted **\n\nAgent ID: ${ agentId } \nWe have received your signal.Antigravity is analyzing your potential.`);
});

// Generic Text Handler -> Hive Mind
bot.on('text', async (ctx) => {
  const message = ctx.message.text;
  console.log(`🦞[Voice Bot] Signal received from @${ ctx.from.username }: ${ message } `);

  // Publish to Redis for ClawedetteService to handle
  redis.publish('clawedette-inbound', JSON.stringify({
    source: 'telegram',
    chatId: ctx.chat.id,
    username: ctx.from.username,
    prompt: message,
    timestamp: Date.now()
  }));

  // Visual Feedback
  ctx.sendChatAction('typing');
});

// Launch
bot.launch().then(() => {
  console.log('🤖 Clawedette (Social Gateway) is ONLINE');
}).catch((err) => {
  console.error('❌ Failed to launch Clawedette:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
