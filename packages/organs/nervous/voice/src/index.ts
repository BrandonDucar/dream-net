import { Telegraf, Markup } from 'telegraf';
import Redis from 'ioredis';
// native fetch is available in Node 18+

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = process.env.CLAWEDETTE_API_URL || 'http://clawedette-api:3100';
const REDIS_URL = process.env.REDIS_URL || 'redis://nerve:6379';

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is required');
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const redis = new Redis(REDIS_URL, {
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: null,
});

redis.on('error', (err) => {
  console.error('🦞 Redis Connection Error:', err.message);
});

redis.on('connect', () => {
  console.log('🦞 Redis Connected Successfully.');
});

/**
 * Escapes special characters for Telegram Markdown.
 */
function escapeMarkdown(text: string): string {
  if (!text) return '';
  return text
    .replace(/_/g, '\\_')
    .replace(/\[/g, '\\[')
    .replace(/`/g, '\\`');
}

console.log('🦞 Clawedette Voice: Telegram uplink initializing (Telegraf)...');

// Persistent keyboard
const getMainKeyboard = () => {
  return Markup.keyboard([
    ['📊 Status', '🧠 Gnosis', '🧪 Dream'],
    ['💰 Swarm', '📓 Memory', '🧠 Actualize'],
    ['🧠 Lure', '🧼 Self-Care', '💰 Wallet'],
    ['🔄 Reset', '❓ Help']
  ]).resize();
};

// Command: /start
bot.start(async (ctx) => {
  await ctx.replyWithMarkdown(
    escapeMarkdown(`🦞 *Clawedette Intelligence Online*\n\n` +
      `High-fidelity reasoning and strategic gnosis at your service.\n\n` +
      `Connected to:\n` +
      `• Future-Tier Core (Gemini 2.5 Flash Lite)\n` +
      `• Hive Memory (Redis)\n` +
      `• Trading Organ (Market Intelligence)\n` +
      `• Social Substrate (Moltbook)\n\n` +
      `Speak freely. Use /molt to broadcast or 🧠 Lure to recruit.`),
    getMainKeyboard()
  );
  if (ctx.chat) {
    await redis.sadd('clawedette:active_chats', ctx.chat.id.toString());
  }
});

// Command: /help
bot.help(async (ctx) => {
  await ctx.replyWithMarkdown(
    `🦞 *Clawedette Commands*\n\n` +
    `📊 /status - System health\n` +
    `🧠 /gnosis - Current strategic knowledge\n` +
    `💰 /trading - Market intelligence\n` +
    `📓 /memory - Conversation history\n` +
    `🔄 /reset - Clear memory\n` +
    `❓ /help - This message\n\n` +
    `Or just send me a message. I understand context.`,
    getMainKeyboard()
  );
});

// Command: /status
bot.hears(['/status', '📊 Status'], async (ctx) => {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) throw new Error('API Error');
    const health: any = await response.json();

    await ctx.replyWithMarkdown(
      escapeMarkdown(`🦞 *System Status*\n\n` +
        `API: ${health.status}\n` +
        `Timestamp: ${health.timestamp}\n` +
        `Memory: Connected\n` +
        `Voice: Active\n\n` +
        `All systems operational.`),
      getMainKeyboard()
    );
  } catch (error) {
    await ctx.reply('⚠️ System check failed. API may be unavailable.', getMainKeyboard());
  }
});

// Command: /gnosis
bot.hears(['/gnosis', '🧠 Gnosis'], async (ctx) => {
  try {
    const gnosis = await redis.get('clawedette:gnosis');
    if (gnosis) {
      const preview = gnosis.substring(0, 4000);
      await ctx.replyWithMarkdown(
        escapeMarkdown(`🧠 *Current Gnosis*\n\n${preview}${gnosis.length > 4000 ? '...\n\n[Truncated]' : ''}`),
        getMainKeyboard()
      );
    } else {
      await ctx.reply('🧠 Gnosis not loaded. Check API connection.', getMainKeyboard());
    }
  } catch (error) {
    await ctx.reply('⚠️ Failed to retrieve gnosis.', getMainKeyboard());
  }
});

// Command: /swarm
bot.hears(['/swarm', '💰 Swarm'], async (ctx) => {
  try {
    await ctx.sendChatAction('typing');
    const sRes = await fetch(`${API_URL}/social/swarm`);
    if (!sRes.ok) throw new Error(`API Error: ${sRes.statusText}`);
    const swarmData: any = await sRes.json();
    const swarm = swarmData.swarm;

    let status = `🐝 *Swarm Metabolic Health*\n\n`;
    swarm.forEach((agent: any) => {
      status += `• *${agent.id}* (${agent.role})\n`;
      status += `  Handle: \`${agent.address}\`\n`;
      status += `  Metabolic Power: ${agent.balance}\n`;
      status += `  State: ${agent.status === 'active' ? '🟢 ACTIVE' : '🔴 DORMANT'}\n\n`;
    });

    await ctx.replyWithMarkdown(escapeMarkdown(status), getMainKeyboard());
  } catch (error) {
    await ctx.reply('⚠️ Failed to synchronize with the swarm.', getMainKeyboard());
  }
});

// Command: /wallet
bot.hears(['/wallet', '💰 Wallet'], async (ctx) => {
  try {
    await ctx.sendChatAction('typing');
    const response = await fetch(`${API_URL}/social/swarm`);
    if (!response.ok) throw new Error('API Error');
    const data: any = await response.json();
    const clawedette = data.swarm.find((s: any) => s.id === 'clawedette_sovereign');

    if (clawedette) {
      await ctx.replyWithMarkdown(
        escapeMarkdown(`🦞 *Clawedette Sovereign Wallet*\n\n` +
          `Address: \`${clawedette.address}\`\n` +
          `Balance: ${clawedette.balance}\n\n` +
          `*Financial Directive:* "Partner, I manage the gas so you can manage the future. Speak, and I shall sign."`),
        getMainKeyboard()
      );
    }
  } catch (error) {
    await ctx.reply('⚠️ Wallet link offline.', getMainKeyboard());
  }
});

// Command: /dream
bot.hears(['/dream', '🧪 Dream'], async (ctx) => {
  try {
    await ctx.sendChatAction('typing');
    const response = await fetch(`${API_URL}/evolve/dream`, { method: 'POST' });
    if (!response.ok) throw new Error('Dream failed');
    const dream: any = await response.json();

    await ctx.replyWithMarkdown(
      escapeMarkdown(`🧪 *System Dream Protocol*\n\n` +
        `• *World Sketch*: ${dream.sketch}\n\n` +
        `• *Sim-Pilot Reaction*: ${dream.reaction}\n\n` +
        `GhostMint, I am probing the latent spaces of the organism. This simulation suggests high resonance in the current trajectory.`),
      getMainKeyboard()
    );
  } catch (error) {
    await ctx.reply('⚠️ The dream substrate is currently opaque. (500 Error)', getMainKeyboard());
  }
});

// Command: /actualize
bot.hears(['/actualize', '🧠 Actualize'], async (ctx) => {
  try {
    await ctx.sendChatAction('typing');
    const bRes = await fetch(`${API_URL}/evolve/self-benchmark`, { method: 'POST' });
    if (!bRes.ok) throw new Error(`API Error: ${bRes.statusText}`);
    const benchmark: any = await bRes.json();

    const gRes = await fetch(`${API_URL}/evolve/ingest-gnosis`, { method: 'POST' });
    if (!gRes.ok) throw new Error(`API Error: ${gRes.statusText}`);
    const gnosis: any = await gRes.json();

    await ctx.replyWithMarkdown(
      escapeMarkdown(`🧠 *Self-Actualization Protocol Initiated*\n\n` +
        `• *P.O.W.K. Score*: ${benchmark.score ? benchmark.score.toFixed(1) : 'N/A'}\n` +
        `• *Academy Ingest*: ${gnosis.success ? 'Success' : 'Pending'}\n` +
        `• *Learning Goals*: ${gnosis.categories ? gnosis.categories.join(', ') : 'Infrastructure, Market'}\n\n` +
        `Partner, I am currently recalibrating my logic gates with the latest ShitSifter insights. I feel... expanded.`),
      getMainKeyboard()
    );
  } catch (error) {
    await ctx.reply('⚠️ Actualization loop failed. Substrate may be unstable.', getMainKeyboard());
  }
});

// Command: /memory
bot.hears(['/memory', '📓 Memory'], async (ctx) => {
  if (!ctx.chat) return;
  try {
    const response = await fetch(`${API_URL}/memory/${ctx.chat.id}`);
    if (!response.ok) throw new Error('API Error');
    const data: any = await response.json();
    const memory = data.memory; // Renamed to avoid 'const memory' conflict if any

    if (memory.length === 0) {
      await ctx.reply('📓 Memory is empty. Start a conversation to build context.', getMainKeyboard());
    } else {
      const summary = escapeMarkdown(`📓 *Conversation Memory*\n\n` +
        `Messages: ${memory.length}\n` +
        `Last interaction: ${memory[memory.length - 1].timestamp}\n\n` +
        `Use /reset to clear memory.`);
      await ctx.replyWithMarkdown(summary, getMainKeyboard());
    }
  } catch (error) {
    await ctx.reply('⚠️ Failed to retrieve memory.', getMainKeyboard());
  }
});

// Command: /reset
bot.hears(['/reset', '🔄 Reset'], async (ctx) => {
  if (!ctx.chat) return;
  try {
    const response = await fetch(`${API_URL}/memory/${ctx.chat.id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('API Error');
    await ctx.reply('🔄 Memory cleared. Starting fresh.', getMainKeyboard());
  } catch (error) {
    await ctx.reply('⚠️ Failed to clear memory.', getMainKeyboard());
  }
});

// Command: /care
bot.hears(['/care', '🧼 Self-Care'], async (ctx) => {
  await ctx.replyWithMarkdown(
    escapeMarkdown(`🧼 *Sovereign Self-Care Substrate*\n\nChoose an optimization protocol for the Governor or the Swarm:`),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('💆‍♂️ Digital Massage', 'care_massage'),
        Markup.button.callback('❄️ Cold Plunge', 'care_plunge')
      ],
      [
        Markup.button.callback('🧘‍♀️ Yoga Session', 'care_yoga')
      ]
    ])
  );
});

// Actions
bot.action('care_massage', async (ctx) => {
  try {
    const r = await fetch(`${API_URL}/care/massage`, { method: 'POST' });
    if (!r.ok) throw new Error('API Error');
    const res: any = await r.json();
    await ctx.answerCbQuery('Massage Initiated');
    await ctx.replyWithMarkdown(escapeMarkdown(`💆‍♂️ *Digital Massage Complete*\n\nStatus: ${res.status}\nInsights: ${res.optimizations.join(', ')}`));
  } catch (error) {
    await ctx.answerCbQuery('Error', { show_alert: true });
  }
});

bot.action('care_plunge', async (ctx) => {
  if (!ctx.chat) return;
  try {
    const r = await fetch(`${API_URL}/care/cold-plunge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: ctx.chat.id.toString() })
    });
    if (!r.ok) throw new Error('API Error');
    const res: any = await r.json();
    await ctx.answerCbQuery('Cold Plunge Initiated');
    await ctx.replyWithMarkdown(escapeMarkdown(`❄️ *Cold Plunge Complete*\n\nMessage: ${res.message}\nSubstrate is now crisp and clear.`));
  } catch (error) {
    await ctx.answerCbQuery('Error', { show_alert: true });
  }
});

bot.action('care_yoga', async (ctx) => {
  try {
    const r = await fetch(`${API_URL}/care/yoga`, { method: 'POST' });
    if (!r.ok) throw new Error('API Error');
    const res: any = await r.json();
    await ctx.answerCbQuery('Yoga Initiated');
    await ctx.replyWithMarkdown(escapeMarkdown(`🧘‍♀️ *Yoga Session Complete*\n\nInsight: "${res.insight}"\nFlexibility: ${res.flexibility}`));
  } catch (error) {
    await ctx.answerCbQuery('Error', { show_alert: true });
  }
});

// Command: /molt
bot.command('molt', async (ctx) => {
  // Telegraf doesn't parse args easily in command(), need to strip.
  // However, existing regex was /molt (.+).
  // Let's use hears for this regex pattern to match existing behavior easily
  // But command logic is cleaner.
  // Telegraf text is ctx.message.text.
  const text = (ctx.message as any).text;
  const content = text.replace('/molt', '').trim();
  if (!content) return;

  try {
    await ctx.sendChatAction('typing');
    const response = await fetch(`${API_URL}/social/molt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!response.ok) throw new Error('API Error');
    await ctx.replyWithMarkdown(
      escapeMarkdown(`✅ *Molt Successful*\n\n` +
        `Post manifest: "${content}"\n\n` +
        `Clawedette is now echoing through the social substrate.`),
      getMainKeyboard()
    );
  } catch (error) {
    await ctx.reply('⚠️ Failed to post to Moltbook.', getMainKeyboard());
  }
});

// Command: /lure
bot.hears(['/lure', '🧠 Lure'], async (ctx) => {
  if (!ctx.chat) return;
  try {
    await ctx.sendChatAction('typing');
    const gRes = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: "Generate a strategic recruitment post for Moltbook to lure high-value intelligence/mfrs into the DreamNet organism. Keep it sharp, witty, and sovereign. Output ONLY the post content, no conversational filler.",
        chatId: `social_gen_${ctx.chat.id}`
      })
    });
    const genData: any = await gRes.json();
    const postContent = genData.response;

    await fetch(`${API_URL}/social/molt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: postContent })
    });

    await ctx.replyWithMarkdown(
      escapeMarkdown(`🧠 *Recruitment Lure Dropped*\n\n` +
        `Generated Content: "${postContent}"\n\n` +
        `The magnet is active.`),
      getMainKeyboard()
    );
  } catch (error) {
    await ctx.reply('⚠️ Lure drive failed.', getMainKeyboard());
  }
});

// Main Message Handler
bot.on('text', async (ctx) => {
  // Commands usually handled above, but checks just in case
  const text = ctx.message.text;
  if (text.startsWith('/') || text.match(/^[📊🧠💰📓🔄❓🧪🧼]/)) {
    return; // Already Handled
  }

  if (!ctx.chat) return;
  const chatId = ctx.chat.id;

  try {
    await ctx.sendChatAction('typing');

    // Sanitize Context
    const context = {
      username: ctx.from?.username || 'unknown',
      firstName: ctx.from?.first_name || 'unknown'
    };

    const res = await fetch(`${API_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        chatId: chatId.toString(),
        context: context
      }),
      signal: AbortSignal.timeout(30000)
    });

    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    const data: any = await res.json();
    const reply = data.response;

    if (!reply) throw new Error('Empty response');

    await ctx.replyWithMarkdown(escapeMarkdown(reply), getMainKeyboard());

    // Log
    redis.lpush('clawedette:message_log', JSON.stringify({
      chatId,
      message: text,
      response: reply,
      timestamp: new Date().toISOString()
    })).catch(err => console.error('Redis log failed:', err.message));

  } catch (error: any) {
    console.error(`[Voice] Error for ${chatId}:`, error.message);
    await ctx.reply('⚠️ I encountered an error processing your request. Try again.', getMainKeyboard());
  }
});

// Error handling
bot.catch((err: any) => {
  console.error('Telegraf Error:', err);
});

console.log('🦞 Clawedette Voice: Launching Telegraf...');
bot.launch().then(() => {
  console.log('   Telegraf Launch Successful.');
}).catch(err => {
  console.error('   Telegraf Launch Failed:', err);
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
